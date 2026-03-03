export function chunk<T>(arr: T[], size: number): T[][] { const c: T[][]=[]; for(let i=0;i<arr.length;i+=size)c.push(arr.slice(i,i+size)); return c; }
