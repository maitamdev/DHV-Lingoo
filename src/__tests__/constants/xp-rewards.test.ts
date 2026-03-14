import { getStreakMultiplier } from '@/constants/xp-rewards';
describe('getStreakMultiplier', () => {
  it('1x for day 1', () => { expect(getStreakMultiplier(1)).toBe(1.0); });
  it('1.25x for 7 days', () => { expect(getStreakMultiplier(7)).toBe(1.25); });
  it('3x for 100+ days', () => { expect(getStreakMultiplier(150)).toBe(3.0); });
});