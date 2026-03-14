'use client';
import { useState, useEffect, useRef } from 'react';

export function useCountUp(end: number, duration: number = 1000): number {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (end === 0) { setCount(0); return; }
    startTime.current = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - (startTime.current || now);
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [end, duration]);

  return count;
}