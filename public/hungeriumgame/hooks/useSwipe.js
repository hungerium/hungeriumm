import { useEffect } from 'react';

/**
 * Enhanced swipe hook with better sensitivity and options
 * @param {React.RefObject} elementRef - Reference to the element to detect swipes on
 * @param {Function} onSwipe - Callback function when swipe is detected
 * @param {Object} options - Configuration options
 */
const useSwipe = (
  elementRef,
  onSwipe,
  options = {
    threshold: 50,
    timeout: 300,
    trackTouch: true,
    trackMouse: true
  }
) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let moving = false;
    
    // Determine if it's a valid swipe (horizontal movement > vertical movement)
    const isValidSwipe = (moveX, moveY, diffTime) => {
      const horizontalDist = Math.abs(moveX);
      const verticalDist = Math.abs(moveY);
      
      // Check threshold and direction
      return (
        horizontalDist > options.threshold && 
        horizontalDist > verticalDist * 1.5 && // To prefer horizontal swipes
        diffTime < options.timeout // Time limit for a swipe
      );
    };
    
    // Process movement
    const processMovement = (endX, endY, endTime) => {
      if (!moving) return;
      
      const moveX = endX - startX;
      const moveY = endY - startY;
      const diffTime = endTime - startTime;
      
      if (isValidSwipe(moveX, moveY, diffTime)) {
        // Determine direction
        const direction = moveX > 0 ? 'right' : 'left';
        
        // Add 100ms delay to avoid accidental triggers
        setTimeout(() => {
          onSwipe(direction);
        }, 100);
      }
      
      moving = false;
    };
    
    // Touch events
    const handleTouchStart = (e) => {
      if (!options.trackTouch) return;
      
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
      moving = true;
    };
    
    const handleTouchMove = (e) => {
      if (!options.trackTouch || !moving) return;
      
      // Cancel swipe if multiple touches detected (likely pinch zoom)
      if (e.touches.length > 1) {
        moving = false;
        return;
      }
      
      // Optional: Prevent screen scrolling during swipe
      // e.preventDefault();
    };
    
    const handleTouchEnd = (e) => {
      if (!options.trackTouch || !moving) return;
      
      const touch = e.changedTouches[0];
      processMovement(touch.clientX, touch.clientY, Date.now());
    };
    
    // Mouse events
    const handleMouseDown = (e) => {
      if (!options.trackMouse) return;
      
      startX = e.clientX;
      startY = e.clientY;
      startTime = Date.now();
      moving = true;
    };
    
    const handleMouseMove = (e) => {
      // No additional handling needed for mouse movements
    };
    
    const handleMouseUp = (e) => {
      if (!options.trackMouse || !moving) return;
      
      processMovement(e.clientX, e.clientY, Date.now());
    };
    
    // Add event listeners
    if (options.trackTouch) {
      element.addEventListener('touchstart', handleTouchStart);
      element.addEventListener('touchmove', handleTouchMove);
      element.addEventListener('touchend', handleTouchEnd);
    }
    
    if (options.trackMouse) {
      element.addEventListener('mousedown', handleMouseDown);
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseup', handleMouseUp);
    }
    
    // Clean up
    return () => {
      if (options.trackTouch) {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
      }
      
      if (options.trackMouse) {
        element.removeEventListener('mousedown', handleMouseDown);
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, [elementRef, onSwipe, options]);
};

export default useSwipe;
