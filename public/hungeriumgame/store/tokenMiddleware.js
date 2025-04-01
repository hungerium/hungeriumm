import useGameStore from './gameStore';
import useWalletStore from './walletStore';

/**
 * This middleware provides direct communication between game and wallet stores
 * for COFFY token operations.
 */
export function initTokenMiddleware() {
  // Only initialize in browser
  if (typeof window === 'undefined') return;
  
  console.log("[TokenMiddleware] Initializing middleware between stores");
  
  // Keep references to the previous unsubscribe functions
  let gameUnsubscribe = null;
  let walletUnsubscribe = null;
  
  // Function to synchronize token balances
  function syncTokenBalances() {
    const gameState = useGameStore.getState();
    const walletState = useWalletStore.getState();
    
    console.log("[TokenMiddleware] Syncing token balances:", {
      gameBalance: gameState.coffyBalance,
      walletBalance: walletState.tokenBalance,
    });
  }
  
  // Unsubscribe from previous listeners
  if (gameUnsubscribe) gameUnsubscribe();
  if (walletUnsubscribe) walletUnsubscribe();
  
  // Subscribe to game store changes
  gameUnsubscribe = useGameStore.subscribe(
    (state) => state.coffyBalance,
    (coffyBalance) => {
      console.log("[TokenMiddleware] Game coffyBalance changed:", coffyBalance);
      syncTokenBalances();
    }
  );
  
  // Subscribe to wallet store changes
  walletUnsubscribe = useWalletStore.subscribe(
    (state) => state.connected,
    (connected) => {
      console.log("[TokenMiddleware] Wallet connection changed:", connected);
      
      // If wallet becomes connected, trigger a sync
      if (connected) {
        console.log("[TokenMiddleware] Wallet connected, triggering sync");
        syncTokenBalances();
      }
    }
  );
  
  // Return unsubscribe function
  return () => {
    if (gameUnsubscribe) gameUnsubscribe();
    if (walletUnsubscribe) walletUnsubscribe();
  };
}

// For direct manual use
export function tokenSync() {
  if (typeof window === 'undefined') return;
  
  const gameState = useGameStore.getState();
  const walletState = useWalletStore.getState();
  
  console.log("[TokenMiddleware] Manual sync triggered with:", {
    gameBalance: gameState.coffyBalance,
    walletBalance: walletState.tokenBalance,
  });
}
