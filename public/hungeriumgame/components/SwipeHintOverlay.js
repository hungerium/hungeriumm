import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '../utils/animationUtils';

export default function SwipeHintOverlay({ onDismiss }) {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    // Check if we've shown this hint before
    const hasSeenHint = localStorage.getItem('coffylapse_swipe_hint');
    if (hasSeenHint) {
      setVisible(false);
      return;
    }
    
    // Auto-dismiss after 8 seconds
    const timer = setTimeout(() => {
      dismissHint();
    }, 8000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const dismissHint = () => {
    setVisible(false);
    localStorage.setItem('coffylapse_swipe_hint', 'true');
    if (onDismiss) onDismiss();
  };
  
  if (!visible) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-white rounded-xl p-5 max-w-xs w-full text-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
        >
          <div className="mb-4">
            <div className="text-2xl mb-2">👆</div>
            <h3 className="font-bold text-coffee-dark text-lg">Swipe to Choose</h3>
            <p className="text-sm text-gray-600 mt-2">
              On mobile devices, you can swipe horizontally on each option to make your choice quickly!
            </p>
          </div>
          
          {/* Swipe animation demo */}
          <div className="bg-coffee-bg rounded-lg p-3 mb-5 relative overflow-hidden">
            <div className="text-left text-sm mb-1">Example option</div>
            <motion.div 
              className="absolute left-0 top-0 h-full w-full bg-coffee-medium/20"
              animate={{ 
                x: ["0%", "100%", "0%"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 0.5
              }}
            />
            <motion.div 
              className="h-1 w-5 bg-coffee-dark absolute right-3 top-1/2 -translate-y-1/2 rounded-full opacity-40"
              animate={{
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 0.5
              }}
            />
          </div>
          
          <motion.button
            className="bg-coffee-dark text-white px-4 py-2 rounded-lg w-full"
            onClick={dismissHint}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Got it!
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
