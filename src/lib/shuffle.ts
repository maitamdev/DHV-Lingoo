export function shuffle<T>(arr: T[]): T[] { const s=[...arr]; for(let i=s.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[s[i],s[j]]=[s[j],s[i]]}return s; }
// Fisher-Yates uniform
// Achievement random selection
