"use client";

import { useEffect, useState } from 'react';

export default function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-4">
      <span className="font-bold text-slate-700">Share this article:</span>
      <a 
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="Share on Facebook" 
        className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors"
      >
        <i className="fab fa-facebook-f"></i>
      </a>
      <a 
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="Share on Twitter" 
        className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-blue-100 hover:text-blue-400 transition-colors"
      >
        <i className="fab fa-twitter"></i>
      </a>
      <a 
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="Share on LinkedIn" 
        className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-blue-100 hover:text-blue-700 transition-colors"
      >
        <i className="fab fa-linkedin-in"></i>
      </a>
      <a 
        href={`https://api.whatsapp.com/send?text=${encodedTitle} ${encodedUrl}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="Share on WhatsApp" 
        className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-green-100 hover:text-green-600 transition-colors"
      >
        <i className="fab fa-whatsapp"></i>
      </a>
    </div>
  );
}
