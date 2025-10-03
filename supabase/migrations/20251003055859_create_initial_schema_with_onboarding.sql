-- Create a custom type for user roles.
-- This allows us to ensure that the 'role' column can only have these specific values.
CREATE TYPE public.user_role AS ENUM ('student', 'recruiter');

-- Add the 'role' column to the 'auth.users' table if it doesn't exist.
-- This column will store the user's role and defaults to 'student' for all new users.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('student', 'recruiter');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'auth' AND table_name = 'users' AND column_name = 'role') THEN
    ALTER TABLE auth.users ADD COLUMN role public.user_role DEFAULT 'student';
  END IF;
END
$$;

-- Create the 'profiles' table to store user-specific data.
-- This table is linked to the 'auth.users' table via a foreign key.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  university TEXT,
  skills TEXT[],
  goals TEXT,
  vision_board JSONB,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a function to automatically update the 'updated_at' timestamp on profile changes.
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before any update on the 'profiles' table.
CREATE TRIGGER on_profiles_updated
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE PROCEDURE public.handle_updated_at();

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

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for the 'profiles' table.
CREATE POLICY "Allow users to read their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow users to create their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Allow users to update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create policies for the 'achievements' table.
CREATE POLICY "Allow authenticated users to read achievements" ON public.achievements FOR SELECT USING (auth.role() = 'authenticated');

-- Create policies for the 'user_achievements' table.
CREATE POLICY "Allow users to read their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);