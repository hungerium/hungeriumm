/**
 * Utility for controlled logging in the application
 * 
 * This utility helps manage console output in different environments
 * and can be toggled via environment variables or local storage
 */

// Check if debugging is enabled
const isDebugEnabled = () => {
  if (typeof window === 'undefined') return false;
  
  // Check for debug flag in localStorage
  return localStorage.getItem('coffylapse_debug') === 'true' || 
         process.env.NODE_ENV === 'development';
};

// Log only in debug mode
export const debugLog = (message, data) => {
  if (!isDebugEnabled()) return;
  
  if (data) {
    console.log(`[DEBUG] ${message}`, data);
  } else {
    console.log(`[DEBUG] ${message}`);
  }
};

// Always log errors
export const errorLog = (message, error) => {
  if (error) {
    console.error(`[ERROR] ${message}`, error);
  } else {
    console.error(`[ERROR] ${message}`);
  }
};

// Log warnings
export const warnLog = (message, data) => {
  if (!isDebugEnabled() && process.env.NODE_ENV === 'production') return;
  
  if (data) {
    console.warn(`[WARN] ${message}`, data);
  } else {
    console.warn(`[WARN] ${message}`);
  }
};

// Enable or disable debug logging
export const setDebugLogging = (enabled) => {
  if (typeof window !== 'undefined') {
    if (enabled) {
      localStorage.setItem('coffylapse_debug', 'true');
    } else {
      localStorage.removeItem('coffylapse_debug');
    }
  }
};

export default {
  debugLog,
  errorLog,
  warnLog,
  setDebugLogging,
  isDebugEnabled
};
