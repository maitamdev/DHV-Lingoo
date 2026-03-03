export function groupBy<T>(arr: T[], key: keyof T) { return arr.reduce((g, i) => { const k = String(i[key]); (g[k] = g[k] || []).push(i); return g; }, {} as Record<string, T[]>); }
