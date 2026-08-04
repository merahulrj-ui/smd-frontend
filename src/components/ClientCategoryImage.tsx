"use client";

import { useState, useRef, useEffect } from 'react';

export default function ClientCategoryImage({ 
  primaryImage, 
  fallbackImage, 
  alt, 
  initials 
}: { 
  primaryImage: string | null; 
  fallbackImage: string | null; 
  alt: string;
  initials: string;
}) {
  const [error, setError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const currentSrc = !error && primaryImage ? `/backend-media/${primaryImage}` 
                   : !fallbackError && fallbackImage ? `/backend-media/${fallbackImage}` 
                   : null;

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth === 0) {
      if (!error && primaryImage) {
        setError(true);
      } else if (!fallbackError && fallbackImage) {
        setFallbackError(true);
      }
    }
  }, [currentSrc, error, fallbackError, primaryImage, fallbackImage]);

  if (!currentSrc) {
    return <span>{initials}</span>;
  }

  return (
    <img 
      ref={imgRef}
      src={currentSrc} 
      alt={alt} 
      className="w-full h-full object-contain" 
      onError={() => {
        if (!error && primaryImage) {
          setError(true);
        } else {
          setFallbackError(true);
        }
      }} 
    />
  );
}
