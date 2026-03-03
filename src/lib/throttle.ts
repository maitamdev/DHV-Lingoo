export function throttle(fn: Function, ms: number) { let last = 0; return (...a: any[]) => { const now = Date.now(); if (now - last >= ms) { last = now; fn(...a); } }; }
