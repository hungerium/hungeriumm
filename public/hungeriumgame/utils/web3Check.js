/**
 * Utility to check Web3 integration status
 */

// Check if Web3 wallet is available
export function hasWeb3Wallet() {
  if (typeof window === 'undefined') return false;
  return !!window.ethereum || !!window.BinanceChain;
}

// Check if browser environment supports basic Web3 features
export function hasWeb3Support() {
  if (typeof window === 'undefined') return false;
  
  // Check for all required globals and APIs
  return (
    typeof Promise !== 'undefined' &&
    typeof fetch !== 'undefined' &&
    typeof localStorage !== 'undefined' &&
    typeof Uint8Array !== 'undefined'
  );
}

// Check if ethers.js can be loaded
export async function canLoadEthers() {
  if (typeof window === 'undefined') return false;
  
  try {
    const { loadEthers } = await import('./ethersLoader');
    const ethers = await loadEthers();
    return !!ethers;
  } catch (error) {
    console.error("Error testing ethers loading:", error);
    return false;
  }
}

// Get comprehensive wallet status
export async function getWalletStatus() {
  if (typeof window === 'undefined') {
    return {
      browserSupport: false,
      walletAvailable: false,
      ethersLoaded: false,
      walletType: null,
      networkId: null,
      networkName: null
    };
  }
  
  const hasWallet = hasWeb3Wallet();
  const browserSupport = hasWeb3Support();
  const ethersLoaded = await canLoadEthers();
  
  let walletType = null;
  if (window.ethereum?.isMetaMask) walletType = 'metamask';
  else if (window.ethereum?.isTrust) walletType = 'trustwallet';
  else if (window.BinanceChain) walletType = 'binancewallet';
  else if (window.ethereum) walletType = 'generic';
  
  let networkId = null;
  let networkName = null;
  
  if (hasWallet) {
    try {
      // Get network ID
      if (window.ethereum) {
        networkId = await window.ethereum.request({ method: 'eth_chainId' });
        // Convert hex to decimal
        networkId = parseInt(networkId, 16);
        
        // Determine network name
        switch(networkId) {
          case 1: networkName = 'Ethereum Mainnet'; break;
          case 56: networkName = 'Binance Smart Chain'; break;
          case 97: networkName = 'BSC Testnet'; break;
          default: networkName = `Chain ID: ${networkId}`;
        }
      } else if (window.BinanceChain) {
        // Binance wallet uses a different method
        const chainInfo = await window.BinanceChain.request({ method: 'eth_chainId' });
        networkId = parseInt(chainInfo, 16);
        networkName = networkId === 56 ? 'Binance Smart Chain' : 
                     networkId === 97 ? 'BSC Testnet' : 
                     `Chain ID: ${networkId}`;
      }
    } catch (error) {
      console.error("Error getting chain information:", error);
    }
  }
  
  return {
    browserSupport,
    walletAvailable: hasWallet,
    ethersLoaded,
    walletType,
    networkId,
    networkName
  };
}

// Initialize web3 environment and check compatibility
export async function initWeb3Environment() {
  const status = await getWalletStatus();
  
  // If we have all requirements, preload ethers.js
  if (status.browserSupport && status.walletAvailable) {
    try {
      const { loadEthers } = await import('./ethersLoader');
      await loadEthers();
      console.log("[Web3] Environment initialized successfully");
    } catch (error) {
      console.warn("[Web3] Failed to preload ethers:", error);
    }
  }
  
  return status;
}
