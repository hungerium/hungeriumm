import { useState, useEffect } from 'react';
import { getFixedImagePath } from '../utils/imageDebugger';
import { getSvgFallback, verifySvgPath } from '../utils/svgPathVerifier';
import ImageWithFallback from './ImageWithFallback';

/**
 * Component to render character avatars with proper SVG handling
 */
export default function CharacterAvatar({ 
  character, 
  size = 40, 
  className = '',
  showBorder = true,
  priority = true 
}) {
  const [imagePath, setImagePath] = useState(character?.image || '/images/placeholder.svg');
  const [isSvg, setIsSvg] = useState(character?.image?.endsWith('.svg') || false);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    // Reset state when character changes
    if (character?.image) {
      const path = getFixedImagePath(character.image);
      setImagePath(path);
      setIsSvg(path.endsWith('.svg'));
      setHasError(false);
      
      // Verify SVG path exists
      if (path.endsWith('.svg')) {
        verifySvgPath(path).then(exists => {
          if (!exists) {
            console.warn(`[CharacterAvatar] SVG not found: ${path}`);
            setImagePath(getSvgFallback(path));
            setHasError(true);
          }
        });
      }
    } else {
      setImagePath('/images/placeholder.svg');
      setIsSvg(true);
      setHasError(false);
    }
  }, [character]);
  
  const containerClasses = `${showBorder ? 'border border-coffee-medium/40' : ''} 
                            relative overflow-hidden bg-coffee-medium/30 rounded-full ${className}`;
  
  return (
    <div 
      className={containerClasses} 
      style={{ width: size, height: size }}
    >
      {isSvg ? (
        // For SVG images, use a div with background image to ensure proper scaling
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url(${imagePath})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      ) : (
        // For raster images, use ImageWithFallback
        <ImageWithFallback 
          src={imagePath}
          alt={character?.name || "Character"}
          width={size}
          height={size}
          className="object-cover w-full h-full"
          fallbackSrc="/images/placeholder.svg"
          priority={priority}
        />
      )}
    </div>
  );
}
