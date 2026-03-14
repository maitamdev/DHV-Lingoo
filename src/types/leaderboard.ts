export interface LeaderboardEntry {
  rank: number;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  xp: number;
  streak: number;
  level: string;
  isCurrentUser: boolean;
}

export type LeaderboardPeriod = 'weekly' | 'monthly' | 'all_time';
export type LeaderboardSort = 'xp' | 'streak' | 'lessons';

export interface LeaderboardState {
  entries: LeaderboardEntry[];
  period: LeaderboardPeriod;
  sortBy: LeaderboardSort;
  totalUsers: number;
  myRank: number;
}