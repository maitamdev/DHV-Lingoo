'use client';
import { useState, useCallback } from 'react';

export function useCopyToClipboard(resetMs: number = 2000): [boolean, (text: string) => void] {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), resetMs);
    } catch {
      setCopied(false);
    }
  }, [resetMs]);

  return [copied, copy];
}