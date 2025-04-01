import { useState, useEffect } from 'react';
import { motion } from '../utils/animationUtils';
import LoadingSpinner from './LoadingSpinner';

export default function ConnectWalletOverlay({ onConnect, isConnecting, error }) {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Only use animations on the client side
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 640);
      
      const handleResize = () => {
        setIsMobile(window.innerWidth < 640);
      };
      
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  // Simple version without motion for SSR
  if (!isClient) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-4 sm:p-6 my-4 sm:my-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-coffee-dark mb-2">
            Welcome to CoffyLapse
          </h1>
          <p className="text-gray-600 mb-6">
            Start your coffee shop adventure!
          </p>
        </div>
        
        <button
          onClick={() => onConnect(true)} // Use skipWallet=true to bypass wallet
          className="bg-coffee-dark hover:bg-coffee-darker text-white font-medium py-3 px-6 rounded-lg w-full mb-3"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-4 sm:p-6 my-4 sm:my-10 mx-2 sm:mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center">
        <motion.div 
          className="mb-6 relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-coffee-light rounded-full animate-pulse opacity-20"></div>
            <svg className="w-24 h-24 relative z-10 mx-auto text-coffee-dark" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
            </svg>
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 bg-clip-text text-transparent mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Welcome to CoffyLapse
        </motion.h1>
        
        <motion.p 
          className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Start your coffee shop adventure and become a coffee legend!
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              <p>Error: {error}</p>
            </div>
          )}
          
          {/* Simple Start Game button without wallet options */}
          <motion.button
            onClick={() => onConnect(true)} // skipWallet=true
            className="relative overflow-hidden bg-coffee-dark hover:bg-coffee-darker text-white font-medium py-3 px-6 rounded-lg w-full mb-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Start Game
            </div>
          </motion.button>
          
          {isConnecting && (
            <div className="text-center p-3 bg-blue-50 rounded-lg mb-3">
              <div className="flex items-center justify-center mb-2">
                <LoadingSpinner size="small" />
                <span className="ml-2 text-sm">Loading game...</span>
              </div>
            </div>
          )}
        </motion.div>
        
        <motion.div
          className="bg-coffee-bg rounded-lg p-3 mt-4 border border-coffee-light"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-xs text-center text-coffee-dark">
            <p><b>This is a simulation game.</b> Your choices will affect your coffee shop's economy, customer satisfaction, production, and sustainability.</p>
            <p className="mt-2">Make strategic decisions and become a coffee shop tycoon!</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
