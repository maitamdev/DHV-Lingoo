export function measureTime<T>(fn: () => T, label: string): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  if (process.env.NODE_ENV === 'development') {
    console.log('[Perf]', label, Math.round(end - start) + 'ms');
  }
  return result;
}