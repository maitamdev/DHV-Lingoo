import { chunkArray, uniqueBy } from '@/lib/array-utils';
describe('chunkArray', () => {
  it('chunks correctly', () => { expect(chunkArray([1,2,3,4,5], 2)).toEqual([[1,2],[3,4],[5]]); });
  it('handles empty', () => { expect(chunkArray([], 3)).toEqual([]); });
});
describe('uniqueBy', () => {
  it('removes duplicates', () => {
    const result = uniqueBy([{id:1,n:'a'},{id:2,n:'b'},{id:1,n:'c'}], 'id');
    expect(result.length).toBe(2);
  });
});