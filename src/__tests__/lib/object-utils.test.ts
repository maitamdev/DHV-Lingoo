import { pick, omit, isEmpty } from '@/lib/object-utils';
describe('pick', () => {
  it('picks keys', () => { expect(pick({a:1,b:2,c:3}, ['a','c'])).toEqual({a:1,c:3}); });
});
describe('omit', () => {
  it('omits keys', () => { expect(omit({a:1,b:2,c:3}, ['b'])).toEqual({a:1,c:3}); });
});
describe('isEmpty', () => {
  it('null is empty', () => { expect(isEmpty(null)).toBe(true); });
  it('empty string', () => { expect(isEmpty('')).toBe(true); });
  it('non-empty', () => { expect(isEmpty('hi')).toBe(false); });
});