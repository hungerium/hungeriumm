import { useState, useEffect } from 'react';

// This component can be used to check if an image exists before rendering
export default function ImageFallbackProvider({ 
  src, 
  fallbackSrc, 
  children, 
  checkExtensions = ['.svg', '.png', '.jpg'] 
}) {
  const [finalSrc, setFinalSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function checkImageExists() {
      if (!src) {
        setFinalSrc(fallbackSrc);
        setIsLoading(false);
        return;
      }

      // First check the original source
      try {
        const response = await fetch(src, { method: 'HEAD' });
        if (response.ok) {
          setFinalSrc(src);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        // Continue to alternates if fetch fails
      }
      
      // If original fails, try different extensions
      const basePath = src.substring(0, src.lastIndexOf('.'));
      
      // Try each extension
      for (const ext of checkExtensions) {
        const testSrc = `${basePath}${ext}`;
        try {
          const response = await fetch(testSrc, { method: 'HEAD' });
          if (response.ok) {
            setFinalSrc(testSrc);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          // Continue to next extension
        }
      }
      
      // If all fails, use fallback
      setFinalSrc(fallbackSrc);
      setIsLoading(false);
    }
    
    checkImageExists();
  }, [src, fallbackSrc, checkExtensions]);
  
  if (isLoading) {
    return null; // Or a loading spinner
  }
  
  // Clone the child and pass the finalSrc
  return children(finalSrc);
}

// Usage example:
// <ImageFallbackProvider src="/image.png" fallbackSrc="/placeholder.svg">
//   {(finalSrc) => <Image src={finalSrc} alt="My Image" width={100} height={100} />}
// </ImageFallbackProvider>
