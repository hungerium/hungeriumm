/**
 * Utility functions to handle and recover from common errors in Web3 interactions
 */

// Parse and simplify blockchain error messages
export function parseBlockchainError(error) {
  const message = error?.message || String(error);
  
  // Common MetaMask/wallet errors
  if (message.includes('User denied transaction') || error?.code === 4001) {
    return {
      code: 'USER_REJECTED',
      message: 'You rejected the transaction in your wallet',
      recoverable: false
    };
  }
  
  if (message.includes('insufficient funds')) {
    return {
      code: 'INSUFFICIENT_FUNDS',
      message: 'Not enough funds to pay for transaction gas',
      recoverable: false
    };
  }
  
  if (message.includes('Internal JSON-RPC error')) {
    return {
      code: 'RPC_ERROR',
      message: 'Wallet connection error. Try refreshing the page.',
      recoverable: true
    };
  }
  
  if (message.includes('nonce too low') || message.includes('replacement transaction underpriced')) {
    return {
      code: 'NONCE_ERROR',
      message: 'Transaction conflict. Please wait a moment and try again.',
      recoverable: true
    };
  }
  
  if (message.includes('gas required exceeds')) {
    return {
      code: 'GAS_LIMIT',
      message: 'Transaction would exceed gas limit. Try with a smaller amount.',
      recoverable: false
    };
  }
  
  if (message.includes('network changed') || message.includes('chain ID')) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Network changed. Please make sure you are on BSC network.',
      recoverable: true
    };
  }
  
  // Default case
  return {
    code: 'UNKNOWN_ERROR',
    message: message.substring(0, 100), // Limit message length
    recoverable: false
  };
}

// Function to attempt recovery based on error type
export async function attemptErrorRecovery(error, ethers, provider) {
  const parsedError = parseBlockchainError(error);
  
  if (!parsedError.recoverable) {
    return { 
      success: false, 
      error: parsedError.message 
    };
  }
  
  // Recovery strategies
  switch (parsedError.code) {
    case 'RPC_ERROR':
      // Reset provider and try again
      try {
        // Delay to allow any pending operations to complete
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Return recovery instructions
        return {
          success: true,
          action: 'RESET_PROVIDER',
          message: 'Wallet connection reset. Please try again.'
        };
      } catch (recoveryError) {
        return {
          success: false,
          error: 'Failed to reconnect to wallet'
        };
      }
      
    case 'NETWORK_ERROR':
      // Suggest network switch
      return {
        success: true,
        action: 'SWITCH_NETWORK',
        message: 'Please switch to the Binance Smart Chain network and try again.'
      };
      
    default:
      return {
        success: false,
        error: parsedError.message
      };
  }
}
