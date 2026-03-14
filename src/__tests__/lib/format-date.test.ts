import { formatTimeAgo } from '@/lib/format-date';
describe('formatTimeAgo', () => {
  it('returns vua xong for now', () => {
    expect(formatTimeAgo(new Date().toISOString())).toBe('vua xong');
  });
});