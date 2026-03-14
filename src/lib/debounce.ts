export function debounce(fn: Function, ms: number) { let t: any; return (...a: any[]) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
// API call throttling
// Achievement check throttle
// Answer input debounced to prevent double-submit
