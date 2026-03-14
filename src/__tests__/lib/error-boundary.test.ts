import { AppError, isAppError, getErrorMessage, createNotFoundError } from '@/lib/error-boundary';
describe('AppError', () => {
  it('creates error', () => {
    const err = new AppError('test', 'CODE', 400);
    expect(err.message).toBe('test');
    expect(err.code).toBe('CODE');
  });
});
describe('isAppError', () => {
  it('true for AppError', () => { expect(isAppError(new AppError('x'))).toBe(true); });
  it('false for Error', () => { expect(isAppError(new Error('x'))).toBe(false); });
});
describe('createNotFoundError', () => {
  it('creates 404', () => { expect(createNotFoundError('User').statusCode).toBe(404); });
});