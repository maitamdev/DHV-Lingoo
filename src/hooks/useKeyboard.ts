'use client';
import { useEffect, useCallback } from 'react';

export function useKeyboard(key: string, handler: () => void, deps: unknown[] = []): void {
  const callback = useCallback(handler, deps);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === key) {
        e.preventDefault();
        callback();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [key, callback]);
}