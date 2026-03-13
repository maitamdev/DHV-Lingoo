export function isEmpty(v: unknown): boolean { if (v == null) return true; if (typeof v === 'string') return v.trim() === ''; if (Array.isArray(v)) return v.length === 0; return false; }
// Null prototype safety
