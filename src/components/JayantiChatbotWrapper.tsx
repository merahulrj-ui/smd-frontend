"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const JayantiChatbot = dynamic(() => import('@/components/JayantiChatbot'), { ssr: false });

export default function JayantiChatbotWrapper() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Delay loading the heavy chatbot script by 4 seconds 
    // This massively improves Mobile PageSpeed (TBT and LCP) by keeping the main thread free during initial render
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 4000);
    
    // Also load immediately if user scrolls a lot (interaction)
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShouldLoad(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!shouldLoad) return null;

  return <JayantiChatbot />;
}
