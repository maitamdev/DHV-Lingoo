export function getBagAriaLabel(i: number, opened: boolean) { return opened ? 'Bag '+(i+1)+' opened' : 'Bag '+(i+1)+'. Tap to open.'; }
export function getCardAriaLabel(word: string, meaning: string, flipped: boolean) { return flipped ? 'Meaning: '+meaning : 'Word: '+word; }
export function getProgressAriaLabel(opened: number, total: number) { return opened+' of '+total+' opened'; }
// Screen reader support
// Achievement ARIA labels planned
