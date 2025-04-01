/**
 * Helper to track transaction status and debug claim issues
 */

// For client-side only
export const trackTransaction = async (txHash) => {
  if (typeof window === 'undefined' || !txHash) return null;
  
  console.log(`Tracking transaction: ${txHash}`);
  
  try {
    // Dynamically load ethers
    const { loadEthers } = await import('./ethersLoader');
    const ethers = await loadEthers();
    
    if (!ethers) {
      console.error("Failed to load ethers for transaction tracking");
      return null;
    }
    
    // Get provider based on available wallets
    let provider;
    if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
    } else if (window.BinanceChain) {
      provider = new ethers.providers.Web3Provider(window.BinanceChain);
    } else {
      console.error("No wallet provider available");
      return null;
    }
    
    // Get transaction receipt
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (!receipt) {
      console.log("Transaction pending - no receipt yet");
      return { status: "pending" };
    }
    
    console.log("Transaction receipt:", receipt);
    
    // Get transaction itself for more details
    const tx = await provider.getTransaction(txHash);
    
    return {
      status: receipt.status === 1 ? "success" : "failed",
      receipt,
      transaction: tx,
      gasUsed: receipt.gasUsed.toString(),
      blockNumber: receipt.blockNumber,
      from: receipt.from,
      to: receipt.to,
      // Extract function name from input data if possible
      functionName: tx?.data?.substring(0, 10) || "Unknown"
    };
  } catch (error) {
    console.error("Error tracking transaction:", error);
    return { status: "error", error: error.message };
  }
};

// Add global debugging helper
if (typeof window !== 'undefined') {
  window.trackTx = async (txHash) => {
    const result = await trackTransaction(txHash);
    console.log("Transaction details:", result);
    return result;
  };
}
