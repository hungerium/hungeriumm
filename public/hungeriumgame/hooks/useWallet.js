import { useState, useEffect, useCallback } from 'react';
import { connectWallet, disconnectWallet, getTokenBalance, claimGameRewards } from '../utils/web3Utils';

export default function useWallet() {
  const [walletState, setWalletState] = useState({
    address: null,
    connected: false,
    connecting: false,
    tokenBalance: "0",
    error: null
  });
  
  // Connect to wallet
  const connect = useCallback(async () => {
    try {
      setWalletState(prev => ({ ...prev, connecting: true, error: null }));
      
      const result = await connectWallet();
      
      if (result.connected) {
        const balance = await getTokenBalance(result.address);
        
        setWalletState({
          address: result.address,
          connected: true,
          connecting: false,
          tokenBalance: balance,
          error: null
        });
        
        // Save connected state to localStorage
        localStorage.setItem('coffylapse_wallet_connected', 'true');
        
        return true;
      } else {
        setWalletState(prev => ({
          ...prev,
          connecting: false,
          error: result.error || "Failed to connect wallet"
        }));
        
        return false;
      }
    } catch (error) {
      setWalletState(prev => ({
        ...prev,
        connecting: false,
        error: error.message
      }));
      
      return false;
    }
  }, []);
  
  // Disconnect wallet
  const disconnect = useCallback(() => {
    disconnectWallet();
    setWalletState({
      address: null,
      connected: false,
      connecting: false,
      tokenBalance: "0",
      error: null
    });
    localStorage.removeItem('coffylapse_wallet_connected');
  }, []);
  
  // Claim tokens
  const claimTokens = useCallback(async (amount) => {
    if (!walletState.connected) {
      return { success: false, error: "Wallet not connected" };
    }
    
    const result = await claimGameRewards(amount);
    
    if (result.success) {
      // Update token balance after successful claim
      const newBalance = await getTokenBalance(walletState.address);
      setWalletState(prev => ({ ...prev, tokenBalance: newBalance }));
    }
    
    return result;
  }, [walletState.connected, walletState.address]);
  
  // Refresh token balance
  const refreshBalance = useCallback(async () => {
    if (walletState.connected && walletState.address) {
      const balance = await getTokenBalance(walletState.address);
      setWalletState(prev => ({ ...prev, tokenBalance: balance }));
    }
  }, [walletState.connected, walletState.address]);
  
  // Auto-connect from localStorage on initial load
  useEffect(() => {
    const checkConnection = async () => {
      const shouldConnect = localStorage.getItem('coffylapse_wallet_connected') === 'true';
      
      if (shouldConnect) {
        await connect();
      }
    };
    
    checkConnection();
  }, [connect]);
  
  return {
    ...walletState,
    connect,
    disconnect,
    claimTokens,
    refreshBalance
  };
}
