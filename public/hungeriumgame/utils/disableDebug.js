/**
 * Utility to ensure all debugging elements are disabled
 */

export const disableDebugElements = () => {
  if (typeof window === 'undefined') return;

  // Create a MutationObserver to watch for dynamically added debug elements
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the element or its children have debug-related IDs or classes
            const debugElements = node.querySelectorAll('[id*="debug"], [class*="debug"], [data-debug]');
            debugElements.forEach(el => el.remove());
            
            // Check the node itself
            if (node.id?.includes('debug') || 
                (node.className && typeof node.className === 'string' && node.className.includes('debug')) ||
                node.hasAttribute('data-debug')) {
              node.remove();
            }
          }
        });
      }
    }
  });

  // Start observing
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });

  // Initial cleanup
  const debugElements = document.querySelectorAll('[id*="debug"], [class*="debug"], [data-debug]');
  debugElements.forEach(el => el.remove());
  
  // Return the observer so it can be disconnected if needed
  return observer;
};

// Run the function automatically when imported
if (typeof window !== 'undefined') {
  setTimeout(() => {
    disableDebugElements();
  }, 0);
}
