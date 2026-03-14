import { getGrade } from '@/constants/practice';
describe('getGrade', () => {
  it('A+ for 95', () => { expect(getGrade(95).grade).toBe('A+'); });
  it('B for 75', () => { expect(getGrade(75).grade).toBe('B'); });
  it('D for 10', () => { expect(getGrade(10).grade).toBe('D'); });
});