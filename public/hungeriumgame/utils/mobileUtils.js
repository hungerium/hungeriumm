/**
 * Mobile-specific utilities to improve touch experience
 */

// Detect if the device is mobile
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Set correct viewport height for mobile browsers
export const fixMobileViewportHeight = () => {
  if (typeof window === 'undefined') return;
  
  const setVhProperty = () => {
    // Mobile browsers have inconsistent heights due to address bar
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  setVhProperty();
  
  // Update on resize and orientation change
  window.addEventListener('resize', setVhProperty);
  window.addEventListener('orientationchange', setVhProperty);
  
  // iOS Safari specific fix for address bar appearing/disappearing
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    window.addEventListener('scroll', () => {
      // Delay to ensure height is updated after scroll
      setTimeout(setVhProperty, 300);
    });
  }
  
  return () => {
    window.removeEventListener('resize', setVhProperty);
    window.removeEventListener('orientationchange', setVhProperty);
    window.removeEventListener('scroll', setVhProperty);
  };
};

// Prevent bouncing/scrolling when not needed
export const preventPullToRefresh = () => {
  if (typeof window === 'undefined') return;
  
  // Only apply on mobile devices
  if (!isMobileDevice()) return;
  
  // Prevent default on touchmove for body when not at top
  document.body.addEventListener('touchmove', (e) => {
    // Allow scrolling on elements that need it
    if (e.target.closest('.scrollable-area')) return;
    
    // Prevent pull-to-refresh behavior
    if (document.documentElement.scrollTop <= 0) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Prevent rubber band effect on Safari
  document.documentElement.style.overflow = 'auto';
  document.documentElement.style.overscrollBehavior = 'none';
  document.body.style.overscrollBehavior = 'none';
};

// Enhance touch feedback
export const enhanceTouchFeedback = () => {
  if (typeof window === 'undefined') return;
  
  // Add active state for buttons on mobile
  const buttons = document.querySelectorAll('button, .button-like');
  
  buttons.forEach(button => {
    button.addEventListener('touchstart', () => {
      button.classList.add('touch-active');
    });
    
    ['touchend', 'touchcancel'].forEach(event => {
      button.addEventListener(event, () => {
        button.classList.remove('touch-active');
        
        // Add subtle transition effect
        button.style.transition = 'transform 0.2s ease-out';
        button.style.transform = 'scale(1.03)';
        
        setTimeout(() => {
          button.style.transform = 'scale(1)';
        }, 100);
      });
    });
  });
};

// Initialize all mobile optimizations
export const initMobileOptimizations = () => {
  fixMobileViewportHeight();
  preventPullToRefresh();
  enhanceTouchFeedback();
};

export default {
  isMobileDevice,
  fixMobileViewportHeight,
  preventPullToRefresh,
  enhanceTouchFeedback,
  initMobileOptimizations
};
