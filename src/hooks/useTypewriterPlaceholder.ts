"use client";
import { useState, useEffect } from 'react';

const SUGGESTIONS = [
  "Search 'Discounted Medical Supplies'...",
  "Search 'ECG Machines'...",
  "Search 'Hospital Beds'...",
  "Search 'Surgical Instruments'...",
  "Search 'Diagnostic Equipment'..."
];

export function useTypewriterPlaceholder(speed = 100, pause = 2000) {
  const [placeholder, setPlaceholder] = useState('');
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const currentText = SUGGESTIONS[suggestionIndex];

    if (isDeleting) {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setPlaceholder(currentText.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, speed / 2);
      } else {
        setIsDeleting(false);
        setSuggestionIndex((prev) => (prev + 1) % SUGGESTIONS.length);
      }
    } else {
      if (charIndex < currentText.length) {
        timer = setTimeout(() => {
          setPlaceholder(currentText.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, speed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pause);
      }
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, suggestionIndex, speed, pause]);

  return placeholder;
}
