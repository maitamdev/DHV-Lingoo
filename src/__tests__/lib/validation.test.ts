import { isValidEmail, isStrongPassword, sanitizeInput } from '@/lib/validation';
describe('isValidEmail', () => {
  it('valid email', () => { expect(isValidEmail('test@example.com')).toBe(true); });
  it('invalid email', () => { expect(isValidEmail('badmail')).toBe(false); });
});
describe('isStrongPassword', () => {
  it('rejects short', () => { expect(isStrongPassword('abc').valid).toBe(false); });
  it('accepts strong', () => { expect(isStrongPassword('Strong1Pass').valid).toBe(true); });
});