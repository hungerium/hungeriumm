import { useState, useEffect } from 'react';
import { motion } from '../utils/animationUtils';

export default function Notification({ message, type = 'info', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) setTimeout(onClose, 300); // Allow time for fade out animation
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  const getTypeClasses = () => {
    switch(type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-700';
      default:
        return 'bg-blue-100 border-blue-500 text-blue-700';
    }
  };
  
  return (
    <motion.div 
      className={`
        fixed bottom-4 right-4 px-4 py-3 rounded border-l-4 shadow-md z-50
        ${getTypeClasses()}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
      transition={{ duration: 0.3 }}
    >
      {message}
    </motion.div>
  );
}
