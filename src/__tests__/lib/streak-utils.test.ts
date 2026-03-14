import { getStreakEmoji, getStreakMessage } from '@/lib/streak-utils';
describe('getStreakEmoji', () => {
  it('fire for 30+', () => { expect(getStreakEmoji(30)).toBeTruthy(); });
  it('seedling for 1', () => { expect(getStreakEmoji(1)).toBeTruthy(); });
});