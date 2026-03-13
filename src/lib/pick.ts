export function pick<T extends object>(obj: T, keys: (keyof T)[]) { const r: any = {}; keys.forEach(k => { if (k in obj) r[k] = obj[k]; }); return r; }
// Property extraction
