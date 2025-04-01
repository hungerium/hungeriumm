import useGameStore from '../store/gameStore';

/**
 * Helper function to add COFFY tokens to gameStore
 * @param {number} amount - Amount to add (default 50)
 * @returns {number} New COFFY balance
 */
export function addCoffyTokens(amount = 50) {
  // Only run in browser
  if (typeof window === 'undefined') return 0;
  
  const gameStore = useGameStore.getState();
  const currentBalance = typeof gameStore.coffyBalance === 'number' ? gameStore.coffyBalance : 0;
  const newBalance = currentBalance + amount;
  
  console.log(`[AddCoffy] Adding ${amount} tokens:`, {
    previous: currentBalance,
    new: newBalance
  });
  
  // Update store
  useGameStore.setState({ coffyBalance: newBalance });
  
  return newBalance;
}

// For window debugging
if (typeof window !== 'undefined') {
  window.addCoffy = addCoffyTokens;
}
