import { calculateGrade, shuffleWithSeed } from '@/lib/quiz-helpers';
describe('calculateGrade', () => {
  it('A+ for 95', () => { expect(calculateGrade(95).grade).toBe('A+'); });
  it('D for 30', () => { expect(calculateGrade(30).grade).toBe('D'); });
});
describe('shuffleWithSeed', () => {
  it('returns same length', () => { expect(shuffleWithSeed([1,2,3], 42).length).toBe(3); });
  it('deterministic', () => { expect(shuffleWithSeed([1,2,3], 42)).toEqual(shuffleWithSeed([1,2,3], 42)); });
});