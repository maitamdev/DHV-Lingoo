-- Add index on lesson_progress for faster queries
CREATE INDEX IF NOT EXISTS idx_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson ON lesson_progress(lesson_id);
