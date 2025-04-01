import { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * Optimized image component with progressive loading, error handling,
 * and proper sizing for mobile devices
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  fallbackSrc = '/images/placeholder.svg',
  className = '',
  onLoad,
  onError,
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Reset state when src changes
  useEffect(() => {
    setImgSrc(src);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);
  
  // Handle image load
  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };
  
  // Handle image error
  const handleError = (e) => {
    setHasError(true);
    setImgSrc(fallbackSrc);
    
    if (onError) onError(e);
  };
  
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* Loading placeholder or low-res preview */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse rounded overflow-hidden"
          style={{ width, height }}
        />
      )}
      
      {/* Actual image */}
      <Image
        src={imgSrc}
        alt={alt || "Image"}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        priority={priority}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
    </div>
  );
}
