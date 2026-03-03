-- Enable RLS on lesson_progress
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY progress_self ON lesson_progress FOR ALL USING (auth.uid() = user_id);
