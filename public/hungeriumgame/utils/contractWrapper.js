import { loadEthers } from './ethersLoader';
import { COFFY_CONTRACT_ADDRESS, COFFY_ABI } from './contractAbi';

// Cache objects
let ethers = null;
let provider = null;
let signer = null;
let contract = null;

// Get ethers library
export async function getEthers() {
  if (!ethers) {
    ethers = await loadEthers();
  }
  return ethers;
}

// Get provider
export async function getProvider() {
  if (!provider) {
    const ethersLib = await getEthers();
    if (!ethersLib) return null;
    
    if (window.ethereum) {
      provider = new ethersLib.providers.Web3Provider(window.ethereum);
    } else if (window.BinanceChain) {
      provider = new ethersLib.providers.Web3Provider(window.BinanceChain);
    } else {
      return null;
    }
  }
  return provider;
}

// Get signer
export async function getSigner() {
  if (!signer) {
    const providerInstance = await getProvider();
    if (!providerInstance) return null;
    
    signer = providerInstance.getSigner();
  }
  return signer;
}

// Get contract instance
export async function getContract() {
  if (!contract) {
    const signerInstance = await getSigner();
    if (!signerInstance) return null;
    
    const ethersLib = await getEthers();
    if (!ethersLib) return null;
    
    contract = new ethersLib.Contract(
      COFFY_CONTRACT_ADDRESS,
      COFFY_ABI,
      signerInstance
    );
  }
  return contract;
}

// Reset all instances (for wallet disconnection)
export function resetContract() {
  provider = null;
  signer = null;
  contract = null;
}

// Claim tokens directly
export async function claimTokens(amount) {
  try {
    const contractInstance = await getContract();
    if (!contractInstance) {
      throw new Error("Contract not initialized");
    }
    
    const ethersLib = await getEthers();
    if (!ethersLib) {
      throw new Error("Ethers library not loaded");
    }
    
    // Get token decimals
    const decimals = await contractInstance.decimals();
    
    // Convert amount to wei
    const amountInWei = ethersLib.utils.parseUnits(amount.toString(), decimals);
    
    // Call contract method
    console.log(`Claiming ${amount} COFFY tokens (${amountInWei.toString()} wei)`);
    
    // NOTE: This is a simulation since we don't have a real contract
    // Replace with actual contract call in production:
    // const tx = await contractInstance.claimGameRewards(amountInWei);
    // await tx.wait();
    
    // Simulate a transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      txHash: "0x" + Math.random().toString(16).slice(2)
    };
  } catch (error) {
    console.error("Error claiming tokens:", error);
    return {
      success: false,
      error: error.message || "Failed to claim tokens"
    };
  }
}
