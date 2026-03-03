// Lazy loading utility for heavy components
export function lazyWithPreload(factory: () => Promise<any>) {
  const Component = require('react').lazy(factory);
  (Component as any).preload = factory;
  return Component;
}
