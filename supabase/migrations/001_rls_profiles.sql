-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_self ON profiles FOR ALL USING (auth.uid() = id);
