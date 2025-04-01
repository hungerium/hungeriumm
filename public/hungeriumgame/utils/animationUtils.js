import React from 'react';

/**
 * This utility helps ensure components work even if framer-motion
 * hasn't been fully loaded yet, preventing initial render errors
 */

// Create a placeholder motion object that won't break the app
const placeholderComponent = (props) => React.createElement('div', { ...props, className: props.className || '' }, props.children);

// Define all the common motion components to avoid undefined errors
const placeholderMotion = {
  div: placeholderComponent,
  button: placeholderComponent,
  span: placeholderComponent,
  p: placeholderComponent,
  h1: placeholderComponent,
  h2: placeholderComponent,
  h3: placeholderComponent,
  ul: placeholderComponent,
  li: placeholderComponent,
};

// Create a simple placeholder AnimatePresence that just renders children
const placeholderAnimatePresence = ({ children }) => <>{children}</>;

// Export variables - using var to avoid redeclaration issues
var motionExport = placeholderMotion;
var AnimatePresenceExport = placeholderAnimatePresence;

// For client-side only to avoid SSR issues
if (typeof window !== 'undefined') {
  try {
    // We need to catch potential errors during the import
    // Using dynamic import with try/catch for safety
    import('framer-motion').then(framerMotion => {
      motionExport = framerMotion.motion;
      AnimatePresenceExport = framerMotion.AnimatePresence;
    }).catch(err => {
      console.warn('Failed to load framer-motion dynamically:', err);
    });
  } catch (e) {
    console.warn('Failed to load framer-motion, using fallback components');
  }
}

/**
 * Enhanced animation utilities with mobile optimization
 */

// Optimized animation presets for mobile
const getOptimizedPresets = () => {
  const isMobile = typeof window !== 'undefined' && 
                   typeof navigator !== 'undefined' && 
                   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  return {
    // Fade in preset
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { 
        duration: isMobile ? 0.2 : 0.3 
      }
    },
    
    // Slide up preset
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { 
        duration: isMobile ? 0.2 : 0.3,
        type: isMobile ? 'tween' : 'spring',
        damping: 25
      }
    },
    
    // Pop preset
    pop: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
      transition: { 
        type: isMobile ? 'tween' : 'spring',
        stiffness: isMobile ? undefined : 400,
        damping: isMobile ? undefined : 30,
        duration: isMobile ? 0.2 : undefined
      }
    },
    
    // Scale preset
    scale: {
      initial: { scale: 0 },
      animate: { scale: 1 },
      exit: { scale: 0 },
      transition: {
        duration: isMobile ? 0.2 : 0.5,
        type: isMobile ? 'tween' : 'spring'
      }
    }
  };
};

// Optimized animation component
const OptimizedMotion = ({ 
  children, 
  preset = null, 
  reducedMotion = false,
  ...props 
}) => {
  if (reducedMotion) {
    // Simplified animations for reduced motion preference
    return <motionExport.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} {...props}>{children}</motionExport.div>;
  }
  
  const presets = getOptimizedPresets();
  const selectedPreset = preset && presets[preset] ? presets[preset] : null;
  
  if (selectedPreset) {
    return <motionExport.div {...selectedPreset} {...props}>{children}</motionExport.div>;
  }
  
  return <motionExport.div {...props}>{children}</motionExport.div>;
};

// Export the variables with the standard names
export const motion = motionExport;
export const AnimatePresence = AnimatePresenceExport;
export { OptimizedMotion };
