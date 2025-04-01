// Dynamic import to avoid SSR issues with ethers
import { COFFY_CONTRACT_ADDRESS } from './contractAbi';

// Web3 connection state variables
let provider = null;
let signer = null;
let coffyContract = null;
let ethers = null;

// Check if we're in the browser environment
const isBrowser = typeof window !== 'undefined';

// BSC network configuration
const BSC_NETWORK = {
  chainId: '0x38', // BSC Mainnet
  chainName: 'Binance Smart Chain',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18
  },
  rpcUrls: ['https://bsc-dataseed.binance.org/'],
  blockExplorerUrls: ['https://bscscan.com/']
};

/**
 * Initialize ethers library - must be called before other functions
 */
async function initEthers() {
  if (!ethers && isBrowser) {
    try {
      // Use dynamic import to prevent SSR from trying to bundle ethers
      const { loadEthers } = await import('./ethersLoader');
      ethers = await loadEthers();
      return !!ethers;
    } catch (error) {
      console.error("Failed to load ethers library:", error);
      return false;
    }
  }
  return !!ethers;
}

/**
 * Detect which wallet is installed
 * @returns {string|null} - Wallet type ('metamask', 'trustwallet', 'binancewallet', or null)
 */
function detectWalletType() {
  if (!isBrowser) return null;
  
  // Check for MetaMask
  if (window.ethereum && window.ethereum.isMetaMask) {
    return 'metamask';
  }
  
  // Check for Trust Wallet
  if (window.ethereum && window.ethereum.isTrust) {
    return 'trustwallet';
  }
  
  // Check for Binance Wallet
  if (window.BinanceChain) {
    return 'binancewallet';
  }
  
  // Check for generic ethereum provider
  if (window.ethereum) {
    return 'generic';
  }
  
  return null;
}

/**
 * Get the appropriate provider based on wallet type
 * @returns {Object|null} - Provider object
 */
function getProvider() {
  const walletType = detectWalletType();
  
  if (!walletType) return null;
  
  if (walletType === 'binancewallet' && window.BinanceChain) {
    return window.BinanceChain;
  }
  
  return window.ethereum;
}

/**
 * Switch network to BSC if needed
 */
async function switchToBSCNetwork() {
  const walletProvider = getProvider();
  if (!walletProvider) return false;
  
  try {
    // Try to switch to BSC network
    await walletProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BSC_NETWORK.chainId }],
    });
    return true;
  } catch (switchError) {
    // This error code indicates the chain has not been added to the wallet
    if (switchError.code === 4902) {
      try {
        // Add the BSC network to the wallet
        await walletProvider.request({
          method: 'wallet_addEthereumChain',
          params: [BSC_NETWORK],
        });
        return true;
      } catch (addError) {
        console.error("Error adding BSC network:", addError);
        return false;
      }
    }
    console.error("Error switching to BSC network:", switchError);
    return false;
  }
}

/**
 * Connect to a wallet (MetaMask, Trust Wallet, or Binance Wallet)
 * @returns {Promise<{address: string|null, connected: boolean, error?: string, walletType?: string}>}
 */
export const connectWallet = async () => {
  if (!isBrowser) {
    return { address: null, connected: false, error: "Not in browser environment" };
  }
  
  try {
    // Initialize ethers - this will now use our custom client-side loader
    const ethersLoaded = await initEthers();
    if (!ethersLoaded) {
      throw new Error("Failed to load ethers library");
    }
    
    // Detect wallet type
    const walletType = detectWalletType();
    const walletProvider = getProvider();
    
    if (!walletProvider) {
      throw new Error("No compatible wallet detected. Please install MetaMask, Trust Wallet, or Binance Wallet");
    }
    
    // Connect based on wallet type
    let accounts;
    
    if (walletType === 'binancewallet') {
      accounts = await window.BinanceChain.request({ method: 'eth_requestAccounts' });
    } else {
      // MetaMask, Trust Wallet, and other ethereum-compatible wallets
      accounts = await walletProvider.request({ method: 'eth_requestAccounts' });
    }
    
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found. Please unlock your wallet and try again.");
    }
    
    // Switch to BSC network
    const networkSwitched = await switchToBSCNetwork();
    if (!networkSwitched) {
      throw new Error("Failed to switch to Binance Smart Chain. Please manually switch to BSC network.");
    }
    
    // Create a Web3 provider and signer based on wallet type
    if (walletType === 'binancewallet') {
      provider = new ethers.providers.Web3Provider(window.BinanceChain);
    } else {
      provider = new ethers.providers.Web3Provider(window.ethereum);
    }
    
    signer = provider.getSigner();
    
    // Get the connected account address
    const address = await signer.getAddress();
    
    // Get ABI for contract initialization
    const { COFFY_ABI } = await import('./contractAbi');
    
    // Initialize the contract with the signer
    coffyContract = new ethers.Contract(
      COFFY_CONTRACT_ADDRESS,
      COFFY_ABI,
      signer
    );
    
    // Set up event listeners for wallet state changes
    if (walletType === 'binancewallet') {
      window.BinanceChain.on('chainChanged', () => {
        console.log('Chain changed, reloading...');
        window.location.reload();
      });
      
      window.BinanceChain.on('accountsChanged', (accounts) => {
        console.log('Account changed:', accounts[0] || 'none');
        if (!accounts.length) {
          disconnectWallet();
          window.location.reload();
        } else {
          window.location.reload();
        }
      });
    } else {
      window.ethereum.on('chainChanged', () => {
        console.log('Chain changed, reloading...');
        window.location.reload();
      });
      
      window.ethereum.on('accountsChanged', (accounts) => {
        console.log('Account changed:', accounts[0] || 'none');
        if (!accounts.length) {
          disconnectWallet();
          window.location.reload();
        } else {
          window.location.reload();
        }
      });
    }
    
    // Return successful connection info
    return {
      address,
      connected: true,
      walletType
    };
  } catch (error) {
    console.error("Error connecting wallet:", error);
    return {
      address: null,
      connected: false,
      error: error.message || "Failed to connect wallet"
    };
  }
};

/**
 * Get token balance for an address
 * @param {string} address - Wallet address
 * @returns {Promise<string>} - Token balance as formatted string
 */
export const getTokenBalance = async (address) => {
  if (!isBrowser || !coffyContract || !ethers) {
    return "0";
  }
  
  try {
    // Get the raw balance as BigNumber
    const balance = await coffyContract.balanceOf(address);
    
    // Get token decimals
    const decimals = await coffyContract.decimals();
    
    // Format the balance with proper decimal places
    return ethers.utils.formatUnits(balance, decimals);
  } catch (error) {
    console.error("Error getting token balance:", error);
    return "0";
  }
};

/**
 * Claim game rewards from the contract on BSC network
 * @param {string|number} amount - Amount to claim
 * @returns {Promise<{success: boolean, txHash?: string, error?: string}>}
 */
export const claimGameRewards = async (amount) => {
  console.log("claimGameRewards called with amount:", amount);
  
  if (!isBrowser || (!window.ethereum && !window.BinanceChain)) {
    console.log("No wallet detected, aborting claim (no simulation)");
    return {
      success: false,
      error: "A wallet extension like MetaMask is required to claim tokens"
    };
  }
  
  if (!ethers) {
    try {
      const { loadEthers } = await import('./ethersLoader');
      ethers = await loadEthers();
      
      if (!ethers) {
        return { 
          success: false, 
          error: "Failed to load Ethereum library" 
        };
      }
    } catch (error) {
      console.error("Error loading ethers:", error);
      return { 
        success: false, 
        error: "Failed to load blockchain library: " + (error.message || "Unknown error") 
      };
    }
  }
  
  if (!provider || !signer) {
    try {
      const walletProvider = getProvider();
      
      if (!walletProvider) {
        return { 
          success: false, 
          error: "No wallet provider found. Please install MetaMask or another compatible wallet." 
        };
      }
      
      if (walletProvider === window.BinanceChain) {
        provider = new ethers.providers.Web3Provider(window.BinanceChain);
      } else {
        provider = new ethers.providers.Web3Provider(window.ethereum);
      }
      
      signer = provider.getSigner();
      
      try {
        await signer.getAddress();
      } catch (error) {
        return { 
          success: false, 
          error: "Wallet not properly connected. Please connect your wallet and try again." 
        };
      }
    } catch (error) {
      console.error("Error initializing provider or signer:", error);
      return { 
        success: false, 
        error: "Failed to initialize blockchain connection: " + (error.message || "Unknown error") 
      };
    }
  }
  
  if (!coffyContract) {
    try {
      const { COFFY_ABI } = await import('./contractAbi');
      
      coffyContract = new ethers.Contract(
        COFFY_CONTRACT_ADDRESS,
        COFFY_ABI,
        signer
      );
    } catch (error) {
      console.error("Error initializing contract:", error);
      return { 
        success: false, 
        error: "Failed to initialize token contract: " + (error.message || "Unknown error") 
      };
    }
  }
  
  try {
    console.log("Starting claim process for", amount, "tokens");
    
    // Ensure we're on BSC network
    const networkSwitched = await switchToBSCNetwork();
    if (!networkSwitched) {
      throw new Error("Please switch to Binance Smart Chain network to claim rewards");
    }
    
    // Get token decimals
    const decimals = await coffyContract.decimals();
    console.log("Token decimals:", decimals);
    
    // Convert the amount to token units with proper decimals
    const amountInWei = ethers.utils.parseUnits(amount.toString(), decimals);
    
    console.log(`Claiming ${amount} COFFY tokens (${amountInWei.toString()} wei)`);
    
    let tx;
    
    if (process.env.NEXT_PUBLIC_USE_REAL_CONTRACT === 'true') {
      // Use the real contract call in production with optimized gas settings
      tx = await coffyContract.claimGameRewards(amountInWei, {
        gasLimit: 65000, // Reduced gas limit for optimization
        gasPrice: ethers.utils.parseUnits("3", "gwei") // Lower gas price for cost savings
      });
      console.log("Real transaction sent:", tx.hash);
    } else {
      // For testing with real wallet but simulating contract call
      // Import contract ABI if needed
      const { COFFY_ABI } = await import('./contractAbi');
      
      // Create an interface to encode the function data properly
      const iface = new ethers.utils.Interface(COFFY_ABI);
      
      // Encode the claimGameRewards function call
      const encodedFunction = iface.encodeFunctionData("claimGameRewards", [amountInWei]);
      
      // Get the sender's address
      const fromAddress = await signer.getAddress();
      
      // Send transaction with proper function encoding to actually call claimGameRewards
      tx = await signer.sendTransaction({
        to: COFFY_CONTRACT_ADDRESS, // Send to contract address, not self
        from: fromAddress,
        data: encodedFunction, // Include function data to call claimGameRewards
        value: ethers.utils.parseEther("0"),
        gasLimit: 65000,
        gasPrice: ethers.utils.parseUnits("3", "gwei")
      });
      
      console.log("Simulated claim transaction sent:", tx.hash);
    }
    
    // Return success with transaction hash
    return {
      success: true,
      txHash: tx.hash
    };
  } catch (error) {
    console.error("Error claiming rewards:", error);
    
    // Parse the error message to make it more user-friendly
    let errorMessage = error.message || "Unknown error occurred";
    
    // Handle common errors
    if (errorMessage.includes("user rejected") || error.code === 4001) {
      errorMessage = "Transaction was rejected in wallet";
    } else if (errorMessage.includes("insufficient funds")) {
      errorMessage = "You don't have enough BNB to pay for gas";
    } else if (errorMessage.includes("Internal JSON-RPC error")) {
      errorMessage = "Wallet connection error. Try refreshing the page or reconnecting your wallet.";
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Disconnect the wallet
 * @returns {{address: null, connected: boolean}}
 */
export const disconnectWallet = () => {
  provider = null;
  signer = null;
  coffyContract = null;
  
  return {
    address: null,
    connected: false
  };
};

/**
 * Get network information
 * @returns {Promise<{chainId: number, name: string}|null>}
 */
export const getNetwork = async () => {
  if (!isBrowser || !provider) {
    return null;
  }
  
  try {
    const network = await provider.getNetwork();
    return {
      chainId: network.chainId,
      name: network.name
    };
  } catch (error) {
    console.error("Error getting network:", error);
    return null;
  }
};

/**
 * Get token information (name, symbol)
 * @returns {Promise<{name: string, symbol: string}|null>}
 */
export const getTokenInfo = async () => {
  if (!isBrowser || !coffyContract) {
    return { name: "COFFY", symbol: "COFFY" };
  }
  
  try {
    const name = await coffyContract.name();
    const symbol = await coffyContract.symbol();
    return { name, symbol };
  } catch (error) {
    console.error("Error getting token info:", error);
    return { name: "COFFY", symbol: "COFFY" };
  }
};

// Add a dummy exports for SSR
export const mockFunctions = {
  getTokenBalance: () => "0",
  claimGameRewards: () => ({ success: false, error: "SSR mode" }),
  getNetwork: () => null
};