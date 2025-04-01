import { useState, useEffect } from 'react';
import { motion } from '../utils/animationUtils';

export default function Header({ 
  daysPassed = 1,
  shopLevel = 1,
  experience = 0,
  isMobile = false,
  isWalletConnected = false,
  walletAddress = null,
  tokenBalance = "0",
  onClaimReward = () => {}
}) {
  const [tokenAnimation, setTokenAnimation] = useState(false);
  const [parsedBalance, setParsedBalance] = useState(0);
  const [hasTokens, setHasTokens] = useState(false);
  
  // Format wallet address for display
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Parse token balance and determine if there are tokens to claim
  useEffect(() => {
    try {
      // Ensure tokenBalance is properly converted to number
      let balance = 0;
      
      if (typeof tokenBalance === 'string') {
        balance = parseFloat(tokenBalance) || 0;
      } else if (typeof tokenBalance === 'number') {
        balance = tokenBalance;
      }
      
      // Ensure balance is finite and positive
      balance = isFinite(balance) && balance > 0 ? balance : 0;
      
      setParsedBalance(balance);
      setHasTokens(balance > 0);
      
      // Remove console logging
    } catch (error) {
      // Silent error handling
      setParsedBalance(0);
      setHasTokens(false);
    }
  }, [tokenBalance]);
  
  // Add animation effect when tokens are available
  useEffect(() => {
    if (hasTokens) {
      // Start pulsing animation for claim button
      setTokenAnimation(true);
      
      // Flash animation
      const interval = setInterval(() => {
        setTokenAnimation(prev => !prev);
      }, 2000);
      
      return () => clearInterval(interval);
    } else {
      setTokenAnimation(false);
    }
  }, [hasTokens]);

  // Remove logging

  return (
    <div className="flex flex-col justify-between items-center px-2 py-2 border-b border-coffee-medium/30 relative z-10 bg-coffee-dark/70 backdrop-blur-sm">
      {/* Top row with title and claim button */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div className={isMobile ? "mr-1" : "mr-2"}>
            <h1 className={`${isMobile ? 'text-base' : 'text-xl'} font-bold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent`}>
              CoffyLapse
            </h1>
            <div className="flex items-center">
              <span className="text-xs text-coffee-light/70 mr-2">Lv{shopLevel}</span>
              <span className="text-xs text-coffee-light/70">Day {daysPassed}</span>
            </div>
          </div>
        </div>
        
        {/* POWERED BY COFFY COIN TEAM text */}
        <div className="text-center">
          <span className="text-xs font-bold text-coffee-light/80">
            POWERED BY COFFY COIN TEAM
          </span>
        </div>
        
        {/* COFFY Balance and Claim Button */}
        <div className="flex items-center space-x-1" id="coffy-token-display" data-testid="token-display">
          <div className="flex items-center bg-coffee-darker/90 py-1 px-2 rounded-l-full border border-coffee-medium/30">
            <span className="text-amber-500 mr-1">☕</span>
            <span 
              className="font-medium text-xs sm:text-sm text-coffee-light" 
              id="token-balance-display"
              data-testid="token-balance"
            >
              {parsedBalance > 0 ? parsedBalance.toString() : "0"}
            </span>
          </div>
          <motion.button 
            id="token-claim-button"
            data-testid="claim-button"
            onClick={() => {
              // Remove console logging
              
              // Only trigger if we have tokens and handler is provided
              if (hasTokens && typeof onClaimReward === 'function') {
                onClaimReward();
              }
            }}
            className={`bg-gradient-to-br ${hasTokens ? 'from-amber-500 to-amber-700 cursor-pointer' : 'from-gray-500 to-gray-700 cursor-not-allowed'} 
            text-white text-xs font-medium py-1 px-2 sm:px-3 rounded-r-full flex items-center shadow-sm`}
            animate={tokenAnimation ? {
              scale: [1, 1.08, 1],
              backgroundColor: ['rgb(217 119 6)', 'rgb(245 158 11)', 'rgb(217 119 6)']
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
            disabled={!hasTokens}
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 118 0v2m-8 0H5.2A2.2 2.2 0 003 8.2v10.6A2.2 2.2 0 005.2 21h13.6a2.2 2.2 0 002.2-2.2V8.2A2.2 2.2 0 0018.8 6H14" />
            </svg>
            <span>
              {hasTokens ? `Claim ${parsedBalance}` : "Claim"}
            </span>
          </motion.button>
        </div>
      </div>
      
      {/* Wallet connection status - only show when connected */}
      {isWalletConnected && (
        <div className="w-full flex justify-end mt-1">
          <span className="text-xs font-medium bg-green-900/50 text-green-300 px-1 py-0.5 rounded border border-green-500/30">
            {formatAddress(walletAddress)}
          </span>
        </div>
      )}
    </div>
  );
}
