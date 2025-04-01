import { useState, useEffect } from 'react';
import { motion } from '../utils/animationUtils';
import useGameStore from '../store/gameStore';

export default function TokenDisplay({ onClick }) {
  const coffyBalance = useGameStore(state => state.coffyBalance);
  const [parsedBalance, setParsedBalance] = useState(0);
  const [hasTokens, setHasTokens] = useState(false);
  const [animation, setAnimation] = useState(false);
  
  // Parse tokens
  useEffect(() => {
    try {
      const balance = typeof coffyBalance === 'number' ? coffyBalance : 
                     typeof coffyBalance === 'string' ? parseFloat(coffyBalance) : 0;
      
      setParsedBalance(balance);
      setHasTokens(balance > 0);
      
      // Animate when balance increases
      if (balance > parsedBalance) {
        setAnimation(true);
        setTimeout(() => setAnimation(false), 2000);
      }
    } catch (e) {
      setParsedBalance(0);
      setHasTokens(false);
    }
  }, [coffyBalance]);
  
  return (
    <div 
      className="flex items-center cursor-pointer"
      onClick={onClick}
    >
      <motion.div 
        className="flex items-center bg-coffee-darker/90 py-1 px-2 rounded-full border border-coffee-medium/30"
        animate={animation ? {
          scale: [1, 1.1, 1],
          backgroundColor: ['rgba(0,0,0,0.7)', 'rgba(180,83,9,0.3)', 'rgba(0,0,0,0.7)']  
        } : {}}
        transition={{ duration: 1 }}
      >
        <span className="text-amber-500 mr-1">☕</span>
        <span className="font-medium text-xs sm:text-sm text-coffee-light">
          {parsedBalance > 0 ? parsedBalance.toString() : "0"}
        </span>
      </motion.div>
    </div>
  );
}
