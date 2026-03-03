-- Create courses read-only policy
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY courses_read ON courses FOR SELECT USING (true);
