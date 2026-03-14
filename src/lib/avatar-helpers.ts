const COLORS = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#ec4899','#06b6d4','#6366f1'];
export function getAvatarColor(name: string): string {
  const idx = (name||'').split('').reduce((a,c)=>a+c.charCodeAt(0),0) % COLORS.length;
  return COLORS[idx];
}
export function getInitials(name: string | null): string {
  if (!name) return '?';
  return name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
}