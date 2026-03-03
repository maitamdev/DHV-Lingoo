-- Add index on courses level
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
