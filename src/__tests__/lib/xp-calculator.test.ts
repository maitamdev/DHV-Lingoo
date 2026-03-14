import { calculateLevel, xpToNextLevel, levelProgress, xpForAction } from '@/lib/xp-calculator';
describe('calculateLevel', () => {
  it('level 1 at 0 xp', () => { expect(calculateLevel(0)).toBe(1); });
  it('level 2 at 500 xp', () => { expect(calculateLevel(500)).toBe(2); });
});
describe('xpForAction', () => {
  it('quiz gives 5 xp', () => { expect(xpForAction('quiz')).toBe(5); });
  it('listening gives 10 xp', () => { expect(xpForAction('listening')).toBe(10); });
});