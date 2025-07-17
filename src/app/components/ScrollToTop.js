'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoArrowUp } from 'react-icons/io5';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const toggleVisibility = () => {
    // Show button when user scrolls down 100px
    if (window.pageYOffset > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // Initialize visibility check
    toggleVisibility();
    
    // Add scroll event listener
    window.addEventListener('scroll', toggleVisibility);
    
    // Clean up
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Inline gradient colors
  const gradientNormal = 'linear-gradient(135deg, #FFD700 0%, #1e90ff 100%)';
  const gradientHover = 'linear-gradient(135deg, #1e90ff 0%, #FFD700 100%)';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center">
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8,
          pointerEvents: isVisible ? 'auto' : 'none'
        }}
        transition={{ duration: 0.3 }}
        className="p-4 md:p-3 rounded-full text-white shadow-2xl hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2"
        onClick={scrollToTop}
        aria-label="Back to top"
        onMouseEnter={() => { setShowTooltip(true); setIsHover(true); }}
        onMouseLeave={() => { setShowTooltip(false); setIsHover(false); }}
        tabIndex={0}
        style={{
          background: isHover ? gradientHover : gradientNormal,
          color: 'white',
          boxShadow: '0 6px 24px 0 rgba(30,144,255,0.25), 0 1.5px 6px 0 rgba(255,215,0,0.15)'
        }}
      >
        <motion.span
          whileHover={{ y: -6 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <IoArrowUp size={56} />
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {showTooltip && isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="mt-2 px-3 py-1 rounded-md bg-black/80 text-white text-xs shadow-lg select-none pointer-events-none"
            style={{ whiteSpace: 'nowrap' }}
          >
            Back to top
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScrollToTop;
