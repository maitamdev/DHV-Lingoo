'use client';
import { useState, useEffect } from 'react';

export function useScrollPosition(): { x: number; y: number; isScrolled: boolean } {
  const [pos, setPos] = useState({ x: 0, y: 0, isScrolled: false });

  useEffect(() => {
    const handleScroll = () => {
      setPos({ x: window.scrollX, y: window.scrollY, isScrolled: window.scrollY > 50 });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return pos;
}