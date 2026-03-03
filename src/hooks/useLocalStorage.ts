// Custom hook for localStorage persistence
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
    const [storedValue, setStoredValue] = useState<T>(initialValue);

    useEffect(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) setStoredValue(JSON.parse(item));
        } catch (error) {
            console.warn('Error reading localStorage:', error);
        }
    }, [key]);

    const setValue = (value: T) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn('Error setting localStorage:', error);
        }
    };

    return [storedValue, setValue];
}
