import { buildQueryString } from '@/lib/api-helpers';
describe('buildQueryString', () => {
  it('builds query string', () => {
    expect(buildQueryString({ search: 'hello', limit: 10 })).toBe('?search=hello&limit=10');
  });
  it('skips undefined', () => {
    expect(buildQueryString({ a: 'x', b: undefined })).toBe('?a=x');
  });
  it('returns empty for no params', () => {
    expect(buildQueryString({})).toBe('');
  });
});