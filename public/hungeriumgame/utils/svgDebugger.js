/**
 * Utility to check and fix SVG files for the game
 */
import { characters } from '../data/characters';
import { verifySvgPath } from './svgPathVerifier';

// Check all SVG characters and log status
export const validateAllSvgCharacters = async () => {
  if (typeof window === 'undefined') return { valid: [], invalid: [] };
  
  const svgCharacters = characters.filter(char => 
    char.image && char.image.endsWith('.svg')
  );
  
  console.log(`Checking ${svgCharacters.length} SVG character images...`);
  
  const results = { valid: [], invalid: [] };
  
  // Check each SVG file
  for (const char of svgCharacters) {
    const valid = await verifySvgPath(char.image);
    if (valid) {
      results.valid.push(char.id);
    } else {
      results.invalid.push({
        id: char.id,
        name: char.name,
        path: char.image
      });
      console.warn(`Invalid SVG character: ${char.id} (${char.image})`);
    }
  }
  
  // Log summary
  if (results.invalid.length > 0) {
    console.error(`⚠️ Found ${results.invalid.length} invalid SVG characters:`);
    results.invalid.forEach(char => {
      console.error(`- ${char.id}: ${char.path}`);
    });
    console.error('Make sure these files exist in the public directory.');
  } else {
    console.log('✅ All SVG character images are valid!');
  }
  
  return results;
};

// Add to window for debugging
if (typeof window !== 'undefined') {
  window.validateSvgCharacters = validateAllSvgCharacters;
}

export default {
  validateAllSvgCharacters
};
