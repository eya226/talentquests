-- Create the 'profiles' table to store user-specific data.
-- This table is linked to the 'auth.users' table via a foreign key.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  university TEXT,
  skills TEXT[],
  goals TEXT,
  vision_board JSONB
);

-- Create the 'achievements' table to store all possible game achievements.
CREATE TABLE IF NOT EXISTS public.achievements (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  xp_reward INT DEFAULT 0
);

-- Create the 'user_achievements' join table to track which users have earned which achievements.
CREATE TABLE IF NOT EXISTS public.user_achievements (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id INT REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- Enable Row Level Security (RLS) for the tables
-- This is a crucial security measure to ensure users can only access their own data.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for the 'profiles' table.
-- 1. Allow users to read their own profile.
CREATE POLICY "Allow users to read their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- 2. Allow users to create their own profile.
CREATE POLICY "Allow users to create their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- 3. Allow users to update their own profile.
CREATE POLICY "Allow users to update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Create policies for the 'achievements' table.
-- Allow all authenticated users to read the list of achievements.
CREATE POLICY "Allow authenticated users to read achievements"
ON public.achievements FOR SELECT
USING (auth.role() = 'authenticated');

-- Create policies for the 'user_achievements' table.
-- 1. Allow users to read their own earned achievements.
CREATE POLICY "Allow users to read their own achievements"
ON public.user_achievements FOR SELECT
USING (auth.uid() = user_id);