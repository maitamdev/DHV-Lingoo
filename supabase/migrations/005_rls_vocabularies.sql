-- Create vocabularies read-only policy
ALTER TABLE lesson_vocabularies ENABLE ROW LEVEL SECURITY;
CREATE POLICY vocab_read ON lesson_vocabularies FOR SELECT USING (true);
