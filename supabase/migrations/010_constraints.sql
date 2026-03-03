-- Add check constraint on XP
ALTER TABLE profiles ADD CONSTRAINT check_xp_positive CHECK (xp >= 0);
