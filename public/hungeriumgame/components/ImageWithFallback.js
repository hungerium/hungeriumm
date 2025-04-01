import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  // Reset on src change
  useEffect(() => {
    setImgSrc(src);
    setError(false);
  }, [src]);

  // Handle image load error
  const handleError = () => {
    setError(true);
    setImgSrc(fallbackSrc);
    console.warn(`Failed to load image: ${src}, using fallback`);
  };

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || "Image"}
      onError={handleError}
      style={{ 
        objectFit: 'cover',
        ...props.style 
      }}
    />
  );
}
