-- Create lessons read-only policy
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY lessons_read ON lessons FOR SELECT USING (true);
