/**
 * Image path debugging utility
 * Helps identify missing character images
 */
import { characters } from '../data/characters';

// Function to test if an image exists (client-side only)
export const checkImageExists = (url) => {
  // Skip for server-side
  if (typeof window === 'undefined') return true;
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

// Check all character images and report which ones are missing
export const checkCharacterImages = async () => {
  if (typeof window === 'undefined') return {};
  
  console.log('Checking character images...');
  const results = { found: [], missing: [] };
  
  for (const character of characters) {
    const exists = await checkImageExists(character.image);
    if (exists) {
      results.found.push(character.id);
    } else {
      results.missing.push({
        id: character.id,
        name: character.name,
        path: character.image
      });
    }
  }
  
  console.log('Character image check results:', results);
  
  if (results.missing.length > 0) {
    console.warn(`Missing ${results.missing.length} character images.`);
    console.warn('Missing images:', results.missing.map(c => c.path).join(', '));
    console.warn('Make sure these files exist in the public directory.');
  } else {
    console.log('All character images found!');
  }
  
  return results;
};

// Function to update image paths for development
export const getFixedImagePath = (path) => {
  if (!path) return '/images/placeholder.jpg';
  
  // If path already starts with http, it's an external image
  if (path.startsWith('http')) return path;
  
  // For development, you might need to modify the path
  // For example, if you're using a custom prefix or base path
  // return `/your-base-path${path}`;
  
  // For Next.js, make sure they're in the public directory
  return path;
};

export default {
  checkImageExists,
  checkCharacterImages,
  getFixedImagePath
};
