import { truncate, slugify } from '@/lib/string-utils';
describe('truncate', () => {
  it('truncates long strings', () => {
    expect(truncate('hello world', 8)).toBe('hello...');
  });
  it('keeps short strings', () => {
    expect(truncate('hi', 10)).toBe('hi');
  });
});
describe('slugify', () => {
  it('converts to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });
});