type Handler = (...args: unknown[]) => void;
const handlers = new Map<string, Set<Handler>>();

export function on(event: string, handler: Handler): void {
  if (!handlers.has(event)) handlers.set(event, new Set());
  handlers.get(event)!.add(handler);
}
export function off(event: string, handler: Handler): void {
  handlers.get(event)?.delete(handler);
}
export function emit(event: string, ...args: unknown[]): void {
  handlers.get(event)?.forEach(h => h(...args));
}
export function once(event: string, handler: Handler): void {
  const wrapper: Handler = (...args) => { off(event, wrapper); handler(...args); };
  on(event, wrapper);
}