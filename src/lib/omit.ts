export function omit<T extends object>(obj: T, keys: (keyof T)[]) { const r = { ...obj }; keys.forEach(k => delete (r as any)[k]); return r; }
