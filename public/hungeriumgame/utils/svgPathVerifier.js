/**
 * Utility for verifying SVG paths exist and ensuring proper fallbacks
 */

// Check if an SVG path exists (client-side only)
export const verifySvgPath = async (path) => {
  if (typeof window === 'undefined') return true;
  
  return new Promise((resolve) => {
    if (!path || !path.endsWith('.svg')) {
      resolve(false);
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = path;
  });
};

// Get a suitable fallback path for SVG
export const getSvgFallback = (originalPath) => {
  // For character images
  if (originalPath?.includes('/characters/svg/')) {
    return '/images/placeholder.svg';
  }
  
  // For other SVG images
  return '/images/placeholder.svg';
};

// Preload all SVG images referenced in a collection
export const preloadSvgImages = async (paths) => {
  if (typeof window === 'undefined') return;
  
  const results = { loaded: [], failed: [] };
  
  for (const path of paths) {
    if (!path || typeof path !== 'string') continue;
    
    const exists = await verifySvgPath(path);
    if (exists) {
      results.loaded.push(path);
    } else {
      results.failed.push(path);
      console.warn(`Failed to load SVG: ${path}`);
    }
  }
  
  return results;
};

export default {
  verifySvgPath,
  getSvgFallback,
  preloadSvgImages
};
