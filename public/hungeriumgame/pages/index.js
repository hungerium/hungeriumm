import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Layout from '../components/Layout';
import ConnectWalletOverlay from '../components/ConnectWalletOverlay';
import LoadingSpinner from '../components/LoadingSpinner';
import { initTokenMiddleware } from '../store/tokenMiddleware';
import DebugTools from '../components/DebugTools';

// Dynamically import GameScreen to prevent SSR issues
const GameScreen = dynamic(() => import('../components/GameScreen'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-coffee-light coffee-texture">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <div className="mt-4 text-coffee-dark font-medium">
          Brewing your coffee shop...
        </div>
      </div>
    </div>
  )
});

export default function Home() {
  const [walletStatus, setWalletStatus] = useState('loading');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we should auto-connect
    const shouldAutoConnect = localStorage.getItem('coffylapse_auto_connect') === 'true';
    
    if (shouldAutoConnect) {
      setWalletStatus('connected');
    } else {
      setWalletStatus('disconnected');
    }
    
    // Add short loading delay for better UX
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Initialize token middleware
  useEffect(() => {
    // Initialize the token middleware
    const unsubscribe = initTokenMiddleware();
    
    // Clean up on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Handle wallet connection
  const handleConnect = async (skipWallet = false) => {
    if (skipWallet) {
      // Continue without wallet
      localStorage.setItem('coffylapse_auto_connect', 'true');
      setWalletStatus('connected');
      return;
    }
    
    // Set as connected for now - the actual connection will happen in GameScreen
    localStorage.setItem('coffylapse_auto_connect', 'true');
    setWalletStatus('connected');
  };
  
  if (isLoading) {
    return (
      <Layout title="CoffyLapse - Loading...">
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="large" />
            <div className="mt-4 text-coffee-dark font-medium">
              Initializing CoffyLapse...
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title="CoffyLapse - Coffee Shop Management Game">
      {walletStatus === 'disconnected' ? (
        <ConnectWalletOverlay 
          onConnect={handleConnect} 
          isConnecting={false}
        />
      ) : (
        <GameScreen />
      )}
      {/* Add debug tools (only visible in development) */}
      {process.env.NODE_ENV === 'development' && <DebugTools />}
      
      {/* Debug claim link */}
      <div className="fixed bottom-0 right-0 p-2 z-50">
        <a 
          href="/debug-claim" 
          className="text-xs bg-gray-800 text-white py-1 px-2 rounded shadow hover:bg-gray-700"
        >
          Debug Claim
        </a>
      </div>
    </Layout>
  );
}
