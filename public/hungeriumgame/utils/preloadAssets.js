import { characters } from '../data/characters';
import { preloadSvgImages } from './svgPathVerifier';

/**
 * Preload all character images and SVGs
 * This helps ensure images are ready when needed
 */
export const preloadCharacterImages = async () => {
  if (typeof window === 'undefined') return;
  
  // Extract all image paths from characters
  const imagePaths = characters
    .map(character => character.image)
    .filter(path => path && typeof path === 'string');
  
  // Separate SVG images
  const svgPaths = imagePaths.filter(path => path.endsWith('.svg'));
  
  // Preload SVG images
  if (svgPaths.length > 0) {
    console.log(`Preloading ${svgPaths.length} SVG character images...`);
    const svgResults = await preloadSvgImages(svgPaths);
    
    if (svgResults.failed.length > 0) {
      console.warn(`Failed to load ${svgResults.failed.length} SVG images:`, svgResults.failed);
    } else {
      console.log(`Successfully preloaded all SVG images.`);
    }
  }
  
  // Preload non-SVG images
  const nonSvgPaths = imagePaths.filter(path => !path.endsWith('.svg'));
  if (nonSvgPaths.length > 0) {
    console.log(`Preloading ${nonSvgPaths.length} character images...`);
    nonSvgPaths.forEach(path => {
      const img = new Image();
      img.src = path;
    });
  }
};

export default {
  preloadCharacterImages
};
