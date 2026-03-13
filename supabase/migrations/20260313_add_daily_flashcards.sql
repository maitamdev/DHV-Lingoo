-- =============================================
-- DHV-Lingoo: Daily AI-Generated Flashcards
-- Stores 5 AI-generated vocabulary cards per day
-- =============================================

-- Table: Daily Flashcards (AI-generated)
CREATE TABLE IF NOT EXISTS public.daily_flashcards (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date date NOT NULL UNIQUE,
  cards jsonb NOT NULL DEFAULT '[]'::jsonb,
  -- Each card: { word, meaning, phonetic, example, category, difficulty }
  generated_by text DEFAULT 'ai' CHECK (generated_by IN ('ai', 'manual', 'fallback')),
  model text, -- e.g. 'llama-3.3-70b-versatile' or 'Qwen/Qwen2.5-72B-Instruct'
  topic text, -- optional theme for the day
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for fast date lookup
CREATE INDEX IF NOT EXISTS idx_daily_flashcards_date ON public.daily_flashcards(date DESC);

-- Enable RLS
ALTER TABLE public.daily_flashcards ENABLE ROW LEVEL SECURITY;

-- Anyone can read daily flashcards
CREATE POLICY "Anyone can view daily flashcards"
  ON public.daily_flashcards FOR SELECT
  USING (true);

-- Only service role (cron) can insert/update
CREATE POLICY "Service role can manage daily flashcards"
  ON public.daily_flashcards FOR ALL
  USING (true)
  WITH CHECK (true);

-- Auto-update updated_at
CREATE TRIGGER on_daily_flashcards_updated
  BEFORE UPDATE ON public.daily_flashcards
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- =============================================
-- Table: User Flashcard History
-- Tracks which cards each user has seen/learned
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_flashcard_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  flashcard_date date NOT NULL,
  revealed_cards boolean[] DEFAULT '{false,false,false,false,false}',
  xp_earned integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, flashcard_date)
);

-- Index for user lookup
CREATE INDEX IF NOT EXISTS idx_user_flashcard_history_user 
  ON public.user_flashcard_history(user_id, flashcard_date DESC);

-- Enable RLS
ALTER TABLE public.user_flashcard_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own history
CREATE POLICY "Users can view own flashcard history"
  ON public.user_flashcard_history FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own history
CREATE POLICY "Users can insert own flashcard history"
  ON public.user_flashcard_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own history
CREATE POLICY "Users can update own flashcard history"
  ON public.user_flashcard_history FOR UPDATE
  USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE TRIGGER on_user_flashcard_history_updated
  BEFORE UPDATE ON public.user_flashcard_history
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
-- Index optimization for user queries
