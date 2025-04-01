import { useState } from 'react';
import { motion } from '../utils/animationUtils';
import useWalletStore from '../store/walletStore';

export default function ClaimTokenModal({ 
  isOpen, 
  onClose, 
  onClaim, 
  balance = "0", 
  maxClaimable = "0" 
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [claimStatus, setClaimStatus] = useState(null);
  
  // Get wallet connection status directly
  const { connected, connect } = useWalletStore();
  
  // Parse the maxClaimable amount as a number
  const parsedMaxClaimable = parseFloat(maxClaimable) || 0;
  const canClaim = parsedMaxClaimable > 0;
  
  const handleClaim = async () => {
    if (!canClaim) {
      setClaimStatus({
        success: false,
        message: "No tokens available to claim"
      });
      return;
    }
    
    setIsProcessing(true);
    setClaimStatus({
      success: null,
      message: "Preparing wallet transaction..."
    });
    
    try {
      // Get valid number amount
      const claimAmount = parseFloat(maxClaimable);
      
      if (isNaN(claimAmount) || claimAmount <= 0) {
        throw new Error("Invalid token amount");
      }
      
      // Pass the exact amount to claim
      const result = await onClaim(claimAmount.toString());
      
      if (result.success) {
        setClaimStatus({
          success: true,
          message: `Success! ${maxClaimable} COFFY tokens have been sent to your wallet.`,
          txHash: result.txHash
        });
        
        // Wait before redirecting
        setTimeout(() => {
          onClose();
          window.location.href = `/claim-success?amount=${maxClaimable}&txHash=${result.txHash}`;
        }, 3000);
      } else {
        setClaimStatus({
          success: false,
          message: result.error || "Token transfer failed"
        });
      }
    } catch (error) {
      setClaimStatus({
        success: false,
        message: error.message || "An unexpected error occurred"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-coffee-dark flex items-center">
            <span className="text-xl mr-2">☕</span>
            Claim COFFY Tokens
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isProcessing}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Your COFFY Tokens</label>
              <span className="text-sm text-amber-600 font-semibold">
                {balance} COFFY
              </span>
            </div>
            
            <div className="text-right">
              <label className="block text-sm font-medium text-gray-700">Available to Claim</label>
              <span className="text-lg text-green-600 font-semibold">
                {maxClaimable} COFFY
              </span>
            </div>
          </div>
          
          <div className="p-3 bg-amber-50 rounded-md mb-4 text-sm">
            <p className="text-amber-800">
              <span className="font-medium">💡 Note:</span> You earn 50 COFFY tokens for each decision you make in the game.
            </p>
          </div>
        </div>
        
        {/* Transaction status */}
        {claimStatus && (
          <div className={`p-3 rounded-md mb-4 text-sm ${
            claimStatus.success === true ? 'bg-green-50 text-green-800' : 
            claimStatus.success === false ? 'bg-red-50 text-red-800' : 
            'bg-blue-50 text-blue-800'
          }`}>
            <p>{claimStatus.message}</p>
            {claimStatus.success === null && (
              <div className="mt-2 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <p className="text-xs">Waiting for wallet confirmation...</p>
              </div>
            )}
            {claimStatus.txHash && (
              <div className="mt-2">
                <div className="flex items-center mb-1">
                  <span className="font-medium text-xs">Transaction Details:</span>
                  {claimStatus.amount && claimStatus.tokenSymbol && (
                    <span className="ml-2 text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                      {claimStatus.amount} {claimStatus.tokenSymbol}
                    </span>
                  )}
                </div>
                <div className="bg-black/5 p-2 rounded text-xs font-mono break-all">
                  {claimStatus.txHash}
                </div>
                {claimStatus.txHash.startsWith("0x") && (
                  <a 
                    href={`https://bscscan.com/tx/${claimStatus.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-xs mt-1 block"
                  >
                    View on BSCScan
                  </a>
                )}
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="button"
            className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              canClaim && !isProcessing
                ? 'bg-amber-600 hover:bg-amber-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={handleClaim}
            disabled={!canClaim || isProcessing}
          >
            {isProcessing ? 'Processing...' : `Claim ${maxClaimable} COFFY`}
          </button>
        </div>
      </div>
    </div>
  );
}
