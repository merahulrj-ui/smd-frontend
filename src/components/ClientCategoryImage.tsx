"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

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

  const currentSrc = !error && primaryImage ? `/backend-media/${primaryImage}` 
                   : !fallbackError && fallbackImage ? `/backend-media/${fallbackImage}` 
                   : null;

  useEffect(() => {
    // Relying on onError instead of naturalWidth polling for Next.js Image
  }, [currentSrc, error, fallbackError, primaryImage, fallbackImage]);

  if (!currentSrc) {
    return <span>{initials}</span>;
  }

  return (
    <div className="relative w-full h-full">
      <Image 
        src={currentSrc} 
        alt={alt} 
        fill
        sizes="(max-width: 768px) 150px, 200px"
        className="object-contain" 
        onError={() => {
          if (!error && primaryImage) {
            setError(true);
          } else if (!fallbackError && fallbackImage) {
            setFallbackError(true);
          }
        }}
      />
    </div>
  );
}
