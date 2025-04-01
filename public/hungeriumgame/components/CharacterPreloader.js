import { useState, useEffect } from 'react';
import { characters } from '../data/characters';

/**
 * Hidden component that preloads character images to avoid UI flicker
 * Especially important for SVG characters
 */
export default function CharacterPreloader() {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    // Create an array of image paths to preload
    const imagePaths = characters.map(char => char.image).filter(Boolean);
    
    // Count successful loads
    let loadedCount = 0;
    
    // Simple preloader function
    const preloadImage = (src) => {
      return new Promise((resolve) => {
        if (src.endsWith('.svg')) {
          // For SVGs use fetch to load the actual SVG data
          fetch(src)
            .then(response => {
              if (response.ok) resolve(true);
              else resolve(false);
            })
            .catch(() => resolve(false));
        } else {
          // For regular images use Image
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = src;
        }
      });
    };
    
    // Start preloading
    Promise.all(imagePaths.map(preloadImage))
      .then(results => {
        loadedCount = results.filter(Boolean).length;
        console.log(`Preloaded ${loadedCount}/${imagePaths.length} character images`);
        setLoaded(true);
      });
      
  }, []);
  
  // This component doesn't render anything visible
  return <div style={{ display: 'none' }} data-testid="character-preloader" />;
}
