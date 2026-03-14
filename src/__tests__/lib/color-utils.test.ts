import { hexToRgb, withOpacity } from '@/lib/color-utils';
describe('hexToRgb', () => {
  it('parses white', () => { expect(hexToRgb('#ffffff')).toEqual({r:255,g:255,b:255}); });
  it('parses black', () => { expect(hexToRgb('#000000')).toEqual({r:0,g:0,b:0}); });
  it('returns null for invalid', () => { expect(hexToRgb('xyz')).toBeNull(); });
});