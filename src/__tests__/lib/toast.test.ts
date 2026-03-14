import { createToast, getToastIcon, getToastColor } from '@/lib/toast';
describe('createToast', () => {
  it('creates with id', () => { expect(createToast('success','ok').id).toBeTruthy(); });
  it('sets type', () => { expect(createToast('error','fail').type).toBe('error'); });
});
describe('getToastColor', () => {
  it('error is red', () => { expect(getToastColor('error')).toBe('#ef4444'); });
});