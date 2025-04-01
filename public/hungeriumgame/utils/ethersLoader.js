/**
 * This utility helps load ethers.js in a way that's compatible with Next.js SSR
 * without requiring polyfills to be installed for server-side rendering
 */

// We'll only load ethers in the browser, never during SSR
let ethersInstance = null;

// Safe import that works in any environment
export async function loadEthers() {
  // Check if we're in the browser
  if (typeof window === 'undefined') {
    return null;
  }
  
  if (ethersInstance) {
    return ethersInstance;
  }
  
  try {
    // Dynamic import that happens only in browser
    ethersInstance = await new Promise((resolve) => {
      // Use setTimeout to ensure this runs after hydration
      setTimeout(async () => {
        try {
          // Use a dynamic import with a fixed path to prevent bundling issues
          const ethersModule = await import('ethers');
          resolve(ethersModule.ethers || ethersModule.default || ethersModule);
        } catch (err) {
          console.error('Failed to load ethers:', err);
          resolve(null);
        }
      }, 0);
    });
    
    return ethersInstance;
  } catch (error) {
    console.error('Failed to load ethers.js:', error);
    return null;
  }
}

// For use with React.lazy or other imperative code
export function getEthers() {
  return ethersInstance;
}
