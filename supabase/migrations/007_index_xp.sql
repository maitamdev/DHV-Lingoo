-- Add index on profiles XP for leaderboard
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON profiles(xp DESC);
