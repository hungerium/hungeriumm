import { createContext, useContext, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Create context with default values
const Web3Context = createContext({
  ethers: null,
  isLoading: true,
  hasError: false,
  errorMessage: ''
});

// Hook to use the Web3 context
export function useWeb3() {
  return useContext(Web3Context);
}

// Client-side only component
function Web3ProviderInner({ children }) {
  const [state, setState] = useState({
    ethers: null,
    isLoading: true,
    hasError: false,
    errorMessage: ''
  });
  
  useEffect(() => {
    async function loadEthersLibrary() {
      try {
        // Dynamic import within useEffect ensures it only happens client-side
        const ethersModule = await import('../utils/ethersLoader');
        const ethersLib = await ethersModule.loadEthers();
        
        setState({
          ethers: ethersLib,
          isLoading: false,
          hasError: !ethersLib,
          errorMessage: ethersLib ? '' : 'Failed to load ethers library'
        });
      } catch (error) {
        console.error('Error initializing Web3:', error);
        setState({
          ethers: null,
          isLoading: false,
          hasError: true,
          errorMessage: error.message || 'Unknown error loading Web3'
        });
      }
    }
    
    loadEthersLibrary();
  }, []);
  
  return (
    <Web3Context.Provider value={state}>
      {children}
    </Web3Context.Provider>
  );
}

// This ensures the component is only rendered client-side
export const Web3Provider = dynamic(
  () => Promise.resolve(Web3ProviderInner),
  { 
    ssr: false,
    loading: () => <>{/* Nothing to render during SSR */}</>
  }
);

// Optional Web3Required component that only renders children when Web3 is available
export function Web3Required({ children, fallback = null }) {
  const { ethers, isLoading, hasError } = useWeb3();
  
  if (isLoading) {
    return <div className="text-center p-4">Loading Web3 environment...</div>;
  }
  
  if (hasError || !ethers) {
    return fallback || (
      <div className="text-center p-4 text-red-600">
        Web3 environment failed to load. Please refresh and try again.
      </div>
    );
  }
  
  return children;
}
