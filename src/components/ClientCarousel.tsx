"use client";

import { useRef, useState, useEffect, ReactNode } from 'react';

export default function ClientCarousel({ children }: { children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const manageArrows = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 5);
    setShowRight(Math.round(scrollLeft) < (scrollWidth - clientWidth - 5));
  };

  useEffect(() => {
    manageArrows();
    window.addEventListener('resize', manageArrows);
    // Add a slight delay check for initial load in case fonts/images change width
    const timeout = setTimeout(manageArrows, 500);
    return () => {
      window.removeEventListener('resize', manageArrows);
      clearTimeout(timeout);
    }
  }, [children]);

  return (
    <div className="relative group/carousel">
      {showLeft && (
        <button 
          onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md z-10 text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all opacity-0 group-hover/carousel:opacity-100"
          aria-label="Scroll left"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
      )}
      
      <div 
        ref={scrollRef} 
        onScroll={manageArrows}
        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 hide-scrollbar scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar { display: none; }
        `}} />
        {children}
      </div>

      {showRight && (
        <button 
          onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md z-10 text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all opacity-0 group-hover/carousel:opacity-100"
          aria-label="Scroll right"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      )}
    </div>
  );
}
