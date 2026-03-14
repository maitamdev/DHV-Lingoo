/**
 * Keyboard event utility helpers
 */
export function isEnterKey(e: { key: string }): boolean {
  return e.key === 'Enter';
}

export function isEscapeKey(e: { key: string }): boolean {
  return e.key === 'Escape';
}

export function isArrowKey(e: { key: string }): boolean {
  return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key);
}

export type KeyHandler = { key: string; handler: () => void; ctrl?: boolean; shift?: boolean };

export function createKeyboardHandler(handlers: KeyHandler[]) {
  return (e: KeyboardEvent) => {
    for (const h of handlers) {
      if (e.key === h.key && (!h.ctrl || e.ctrlKey) && (!h.shift || e.shiftKey)) {
        e.preventDefault();
        h.handler();
        break;
      }
    }
  };
}