import { formatRelativeTime } from '@/lib/date-utils';
describe('formatRelativeTime', () => {
  it('returns vua xong for recent', () => {
    expect(formatRelativeTime(new Date())).toBe('vua xong');
  });
});