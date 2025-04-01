import { motion } from '../utils/animationUtils';
import { useState, useEffect } from 'react';

export default function SwipeInstructions({ onDismiss }) {
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState(1);
  
  // Auto-advance through steps and finally dismiss
  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < 3) {
        setStep(step + 1);
      } else {
        setVisible(false);
        if (onDismiss) {
          setTimeout(onDismiss, 500);
        }
      }
    }, step === 3 ? 2000 : 1500);
    
    return () => clearTimeout(timer);
  }, [step, onDismiss]);
  
  // Save that instructions were shown
  useEffect(() => {
    localStorage.setItem('coffylapse_swipe_instructions_shown', 'true');
  }, []);
  
  if (!visible) return null;
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center touch-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl overflow-hidden shadow-xl max-w-sm w-full mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="bg-gradient-to-r from-coffee-medium to-coffee-dark text-white p-4">
          <h2 className="text-lg font-bold">How to Play</h2>
        </div>
        
        <div className="p-5">
          {step === 1 && (
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-5xl mb-3">👆</div>
              <h3 className="text-lg font-bold mb-2">Swipe to Choose</h3>
              <p className="text-gray-600">
                Swipe cards left or right to make decisions for your coffee shop.
              </p>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-5xl mb-3">📊</div>
              <h3 className="text-lg font-bold mb-2">Watch Your Metrics</h3>
              <p className="text-gray-600">
                Your decisions affect your economy, customers, operations, and sustainability.
              </p>
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-5xl mb-3">☕</div>
              <h3 className="text-lg font-bold mb-2">Earn COFFY Tokens</h3>
              <p className="text-gray-600">
                Make successful choices to earn COFFY tokens that can be claimed to your wallet.
              </p>
            </motion.div>
          )}
          
          <div className="flex justify-center items-center mt-4">
            <div className="flex space-x-2">
              <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-coffee-dark' : 'bg-gray-300'}`}></div>
              <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-coffee-dark' : 'bg-gray-300'}`}></div>
              <div className={`w-2 h-2 rounded-full ${step === 3 ? 'bg-coffee-dark' : 'bg-gray-300'}`}></div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-center">
          <motion.button
            className="px-4 py-2 bg-coffee-dark text-white rounded-lg font-medium"
            onClick={() => {
              setVisible(false);
              if (onDismiss) onDismiss();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Got it!
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
