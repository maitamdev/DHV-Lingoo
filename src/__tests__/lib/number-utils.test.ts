import { formatNumber, percentage, clampValue } from '@/lib/number-utils';
describe('formatNumber', () => {
  it('formats thousands', () => { expect(formatNumber(1500)).toBe('1.5K'); });
  it('formats millions', () => { expect(formatNumber(2000000)).toBe('2.0M'); });
  it('keeps small numbers', () => { expect(formatNumber(42)).toBe('42'); });
});
describe('percentage', () => {
  it('calculates correctly', () => { expect(percentage(3, 10)).toBe(30); });
  it('handles zero', () => { expect(percentage(0, 0)).toBe(0); });
});
describe('clampValue', () => {
  it('clamps above max', () => { expect(clampValue(150, 0, 100)).toBe(100); });
  it('clamps below min', () => { expect(clampValue(-5, 0, 100)).toBe(0); });
});