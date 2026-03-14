import { getCached, setCache, clearCache } from '@/lib/cache';
describe('cache', () => {
  beforeEach(() => clearCache());
  it('returns null for missing', () => { expect(getCached('nope')).toBeNull(); });
  it('stores and retrieves', () => {
    setCache('key', 'value');
    expect(getCached('key')).toBe('value');
  });
});