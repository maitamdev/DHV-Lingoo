// Custom hook for clipboard copy with feedback
import { useState, useCallback } from 'react';

export function useClipboard(timeout: number = 2000) {
    const [copied, setCopied] = useState(false);

    const copy = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), timeout);
            return true;
        } catch {
            return false;
        }
    }, [timeout]);

    return { copied, copy };
}
