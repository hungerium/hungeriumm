// Try to use zustand directly, fallback to our custom implementation
let create, persist;
try {
  const zustand = require('zustand');
  create = zustand.create;
  persist = require('zustand/middleware').persist;
} catch (e) {
  console.warn("Falling back to local implementation of zustand");
  const storeUtils = require('../utils/storeUtils');
  create = storeUtils.create;
  persist = storeUtils.persist;
}

import { 
  connectWallet, 
  disconnectWallet, 
  getTokenBalance, 
  claimGameRewards 
} from '../utils/web3Utils';

// Browser-only wallet store
const isClient = typeof window !== 'undefined';

const useWalletStore = create(
  persist(
    (set, get) => ({
      // Wallet state
      address: null,
      connected: false,
      connecting: false,
      tokenBalance: "0",
      error: null,
      
      // Connect wallet
      connect: async () => {
        if (!isClient) return false;
        
        try {
          set({ connecting: true, error: null });
          
          const result = await connectWallet();
          
          if (result.connected) {
            const balance = await getTokenBalance(result.address);
            
            set({
              address: result.address,
              connected: true,
              connecting: false,
              tokenBalance: balance,
              error: null
            });
            
            return true;
          } else {
            set({
              connecting: false,
              error: result.error || "Failed to connect wallet"
            });
            
            return false;
          }
        } catch (error) {
          set({
            connecting: false,
            error: error.message || "An error occurred while connecting"
          });
          
          return false;
        }
      },
      
      // Disconnect wallet
      disconnect: () => {
        if (!isClient) return;
        
        disconnectWallet();
        set({
          address: null,
          connected: false,
          connecting: false,
          tokenBalance: "0",
          error: null
        });
      },
      
      // Claim tokens - Improved with error handling and retries
      claimTokens: async (amount) => {
        console.log("[WalletStore] claimTokens called with amount:", amount);
        
        if (!isClient) {
          return { success: false, error: "Cannot claim tokens in server environment" };
        }
        
        // Ensure wallet is connected
        if (!get().connected) {
          console.log("[WalletStore] Wallet not connected, attempting to connect");
          
          try {
            const connectResult = await get().connect();
            if (!connectResult) {
              return { 
                success: false, 
                error: "Failed to connect wallet. Please connect your wallet and try again." 
              };
            }
            
            // Wait for connection to stabilize
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (error) {
            return {
              success: false,
              error: "Failed to connect wallet: " + (error.message || "Unknown error")
            };
          }
        }
        
        try {
          // Parse amount as a valid number and ensure it's not NaN
          const parsedAmount = parseFloat(amount);
          if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return {
              success: false,
              error: "Invalid token amount"
            };
          }
          
          console.log("[WalletStore] Proceeding with claim for amount:", parsedAmount.toString());
          
          // Use the proper claim function with retry mechanism
          let result;
          let attempts = 0;
          const maxAttempts = 2;
          
          while (attempts < maxAttempts) {
            attempts++;
            console.log(`[WalletStore] Claim attempt ${attempts}/${maxAttempts}`);
            
            try {
              result = await claimGameRewards(parsedAmount.toString());
              break; // If successful, break out of loop
            } catch (innerError) {
              console.error(`[WalletStore] Error in attempt ${attempts}:`, innerError);
              
              // Only retry on specific errors and if we haven't hit max attempts
              if (attempts < maxAttempts && 
                  (innerError.message?.includes('JSON-RPC error') || 
                   innerError.message?.includes('connection error'))) {
                console.log("[WalletStore] Retrying after error...");
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
              }
              throw innerError;
            }
          }
          
          if (result.success) {
            console.log("[WalletStore] Transaction successful:", result);
            
            // Update token balance
            await get().refreshBalance();
            
            return {
              success: true,
              txHash: result.txHash
            };
          } else {
            console.log("[WalletStore] Transaction failed:", result.error);
            return result;
          }
        } catch (error) {
          console.error("[WalletStore] Error claiming tokens:", error);
          return {
            success: false,
            error: error.message || "An error occurred while claiming tokens"
          };
        }
      },
      
      // Refresh token balance
      refreshBalance: async () => {
        if (!isClient || !get().connected || !get().address) {
          return;
        }
        
        const balance = await getTokenBalance(get().address);
        set({ tokenBalance: balance });
      }
    }),
    {
      name: 'coffylapse-wallet-storage',
      partialize: (state) => ({
        connected: state.connected
      }),
    }
  )
);

// Add helpful debug methods to global scope for browser console debugging
if (typeof window !== 'undefined') {
  window.debugWalletStore = {
    getState: () => useWalletStore.getState(),
    connect: () => useWalletStore.getState().connect(),
    disconnect: () => useWalletStore.getState().disconnect(),
    refreshBalance: () => useWalletStore.getState().refreshBalance()
  };
}

export default useWalletStore;
