import { useState } from 'react';
import { motion } from '../utils/animationUtils';
import { playSound } from '../utils/soundUtils';

/**
 * TouchFeedback component - Enhances any clickable element with touch-friendly feedback
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The element to wrap with touch feedback
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.haptic - Whether to use haptic feedback (on supported devices)
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Whether the component is disabled
 */
export default function TouchFeedback({ 
  children, 
  className = "", 
  haptic = true,
  onClick,
  disabled = false,
  ...props 
}) {
  const [isPressed, setIsPressed] = useState(false);
  
  const triggerHaptic = () => {
    if (haptic && navigator?.vibrate) {
      navigator.vibrate(20); // Short, subtle vibration
    }
  };
  
  const handlePress = () => {
    if (disabled) return;
    setIsPressed(true);
    triggerHaptic();
  };
  
  const handleRelease = () => {
    setIsPressed(false);
  };
  
  const handleClick = (e) => {
    if (disabled) return;
    
    // Play the click sound
    try {
      playSound('click');
    } catch (err) {
      console.warn('Could not play click sound:', err);
    }
    
    if (onClick) onClick(e);
  };
  
  return (
    <motion.div
      className={`touch-feedback ${className} ${isPressed ? 'touch-active' : ''}`}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
      onTouchCancel={handleRelease}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={handleRelease}
      onClick={handleClick}
      whileTap={{ scale: 0.97 }}
      initial={false}
      {...props}
    >
      {children}
    </motion.div>
  );
}
