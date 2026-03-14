import { getLevelByXp, getLevelColor } from '@/constants/levels';
describe('getLevelByXp', () => {
  it('A1 at 0', () => { expect(getLevelByXp(0).value).toBe('A1'); });
  it('B1 at 3000', () => { expect(getLevelByXp(3000).value).toBe('B1'); });
});
describe('getLevelColor', () => {
  it('returns color for A1', () => { expect(getLevelColor('A1')).toBe('#94a3b8'); });
});