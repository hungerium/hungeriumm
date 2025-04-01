import { useState, useEffect } from 'react';
import { motion } from '../utils/animationUtils';

export default function ShopBackground({ children, shopLevel = 1, time = 'day', animated = true }) {
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  
  // Shop ambience details based on level
  const shopDetails = {
    1: { 
      name: 'Corner Café', 
      color: 'from-amber-700/10 to-amber-900/20' 
    },
    2: { 
      name: 'Cozy Spot', 
      color: 'from-amber-700/20 to-amber-900/30' 
    },
    3: { 
      name: 'Bean Haven', 
      color: 'from-amber-600/20 to-amber-800/30' 
    },
    4: { 
      name: 'Coffee Emporium', 
      color: 'from-amber-500/20 to-amber-800/30' 
    },
    5: { 
      name: 'Roast Dynasty', 
      color: 'from-amber-500/30 to-amber-700/40' 
    }
  };
  
  // Track mouse movement for parallax effect
  useEffect(() => {
    if (!animated) return;
    
    const handleMouseMove = (e) => {
      // Calculate mouse position percentage
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      
      setParallaxOffset({
        x: x * 5, // Max 5px movement
        y: y * 5  // Max 5px movement
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [animated]);
  
  const currentShop = shopDetails[shopLevel] || shopDetails[1];
  
  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentShop.color}`}></div>
      
      {/* Coffee texture overlay */}
      <div className="absolute inset-0 coffee-texture opacity-30"></div>
      
      {/* Parallax decorative elements */}
      {animated && (
        <>
          <motion.div 
            className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-amber-500/10 blur-xl"
            animate={{
              x: parallaxOffset.x * 2,
              y: parallaxOffset.y * 2,
            }}
            transition={{ type: "tween", ease: "easeOut" }}
          ></motion.div>
          
          <motion.div 
            className="absolute top-1/4 -right-8 w-20 h-20 rounded-full bg-coffee-medium/10 blur-lg"
            animate={{
              x: parallaxOffset.x * 1.5,
              y: parallaxOffset.y * 1.5,
            }}
            transition={{ type: "tween", ease: "easeOut" }}
          ></motion.div>
          
          <motion.div 
            className="absolute bottom-1/3 left-1/4 w-10 h-10 rounded-full bg-amber-800/10 blur-md"
            animate={{
              x: parallaxOffset.x * 3,
              y: parallaxOffset.y * 3,
            }}
            transition={{ type: "tween", ease: "easeOut" }}
          ></motion.div>
        </>
      )}
      
      {/* Shop name */}
      <div className="absolute top-2 left-2 text-xs font-medium text-coffee-dark/60 bg-white/30 backdrop-blur-sm py-1 px-2 rounded-full">
        {currentShop.name}
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
