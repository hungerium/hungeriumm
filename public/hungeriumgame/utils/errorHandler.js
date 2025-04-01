/**
 * Global error handling utilities
 */
import { debugLog, errorLog } from './logUtils';

// Known error types
export const ERROR_TYPES = {
  NETWORK: 'NetworkError',
  WALLET: 'WalletError',
  TRANSACTION: 'TransactionError',
  STORAGE: 'StorageError',
  GAME_LOGIC: 'GameLogicError',
  AUTH: 'AuthenticationError',
  UNKNOWN: 'UnknownError'
};

// Error with categorization
export class AppError extends Error {
  constructor(message, type = ERROR_TYPES.UNKNOWN, details = {}) {
    super(message);
    this.name = type;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
  
  // Create formatted error for display/logging
  format() {
    return {
      type: this.name,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
      stack: process.env.NODE_ENV !== 'production' ? this.stack : undefined
    };
  }
}

// Create specific error instances
export const createNetworkError = (message, details = {}) => 
  new AppError(message, ERROR_TYPES.NETWORK, details);

export const createWalletError = (message, details = {}) => 
  new AppError(message, ERROR_TYPES.WALLET, details);

export const createTransactionError = (message, details = {}) => 
  new AppError(message, ERROR_TYPES.TRANSACTION, details);

export const createStorageError = (message, details = {}) => 
  new AppError(message, ERROR_TYPES.STORAGE, details);

export const createGameLogicError = (message, details = {}) => 
  new AppError(message, ERROR_TYPES.GAME_LOGIC, details);

// Format error for display to users
export const getUserFriendlyError = (error) => {
  // Default message
  let message = "Something went wrong. Please try again.";
  
  if (error instanceof AppError) {
    switch(error.name) {
      case ERROR_TYPES.NETWORK:
        message = "Network connection issue. Please check your internet connection and try again.";
        break;
      case ERROR_TYPES.WALLET:
        message = "Wallet connection issue. Please ensure your wallet is unlocked and try again.";
        break;
      case ERROR_TYPES.TRANSACTION:
        message = "Transaction failed. Please check your wallet and try again.";
        break;
      case ERROR_TYPES.STORAGE:
        message = "Data storage issue. Your progress might not be saved.";
        break;
      case ERROR_TYPES.GAME_LOGIC:
        message = "Game issue detected. Please refresh the page.";
        break;
      default:
        message = error.message || message;
    }
  } else if (error && typeof error === 'object') {
    // Handle standard errors or error-like objects
    message = error.message || message;
    
    // Detect common error patterns
    if (message.includes('User rejected') || message.includes('user rejected')) {
      message = "Transaction was rejected in your wallet.";
    } else if (message.includes('insufficient funds')) {
      message = "You don't have enough funds to complete this transaction.";
    }
  }
  
  return message;
};

// Global error handler
export const handleGlobalError = (error, { silent = false } = {}) => {
  const errorObj = error instanceof AppError ? error : new AppError(
    error?.message || "Unknown error occurred",
    ERROR_TYPES.UNKNOWN,
    { originalError: error }
  );
  
  // Log error
  errorLog(`${errorObj.name}: ${errorObj.message}`, errorObj);
  
  // In production, we could send to an error tracking service here
  if (process.env.NODE_ENV === 'production') {
    // Example: sendToErrorTracking(errorObj.format());
  }
  
  if (!silent) {
    // Display user-friendly message (could be replaced with UI notification)
    const userMessage = getUserFriendlyError(errorObj);
    if (typeof window !== 'undefined') {
      console.error(userMessage);
    }
  }
  
  return errorObj;
};

// Function to apply global error handling to the application
export const initGlobalErrorHandlers = () => {
  if (typeof window === 'undefined') return;
  
  // Handle uncaught promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    handleGlobalError(event.reason, { silent: false });
  });
  
  // Handle uncaught exceptions
  window.addEventListener('error', (event) => {
    event.preventDefault();
    handleGlobalError(event.error || new Error(event.message), { silent: false });
  });
  
  debugLog('Global error handlers initialized');
};

export default {
  ERROR_TYPES,
  AppError,
  createNetworkError,
  createWalletError,
  createTransactionError,
  createStorageError,
  createGameLogicError,
  getUserFriendlyError,
  handleGlobalError,
  initGlobalErrorHandlers
};
