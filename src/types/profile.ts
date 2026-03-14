export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  xp: number;
  streak: number;
  longest_streak: number;
  goals: string[];
  interests: string[];
  daily_time: number;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}