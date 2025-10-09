-- Phase 1 Schema Updates for TalentQuest

-- 1. Add new columns to the 'profiles' table
ALTER TABLE public.profiles
ADD COLUMN role text CHECK (role IN ('student', 'recruiter')),
ADD COLUMN archetype text,
ADD COLUMN personality_tags text[],
ADD COLUMN vision_board jsonb,
ADD COLUMN recommended_path text;

-- Add comments for the new columns
COMMENT ON COLUMN public.profiles.role IS 'The role of the user, either student or recruiter.';
COMMENT ON COLUMN public.profiles.archetype IS 'The user''s archetype, e.g., "Full-Stack Builder".';
COMMENT ON COLUMN public.profiles.personality_tags IS 'Array of personality tags derived from the onboarding chat.';
COMMENT ON COLUMN public.profiles.vision_board IS 'JSON object for storing user goals, e.g., dream companies, salary.';
COMMENT ON COLUMN public.profiles.recommended_path IS 'The initial skill path recommended to the user.';


-- 2. Create the 'achievements' table
CREATE TABLE public.achievements (
    id text PRIMARY KEY,
    name text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add comments for the achievements table
COMMENT ON TABLE public.achievements IS 'Stores the master list of all possible achievements in the system.';
COMMENT ON COLUMN public.achievements.id IS 'A unique identifier for the achievement (e.g., "first_login").';


-- 3. Create the 'user_achievements' table
CREATE TABLE public.user_achievements (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id text REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (user_id, achievement_id)
);

-- Add comments for the user_achievements table
COMMENT ON TABLE public.user_achievements IS 'Tracks which users have earned which achievements.';


-- 4. Seed the 'achievements' table with initial data
INSERT INTO public.achievements (id, name, description) VALUES
('first_login', 'First Login', 'Welcome to TalentQuest'),
('chat_complete', 'Identity Forged', 'You built your profile through conversation'),
('dashboard_viewed', 'Nexus Explorer', 'You’ve seen your command center');


-- 5. Enable Row Level Security (RLS) for the new tables
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- 6. Define RLS policies
-- Allow all authenticated users to read the master list of achievements.
CREATE POLICY "Allow authenticated users to read achievements"
ON public.achievements
FOR SELECT
TO authenticated
USING (true);

-- Allow users to read their own earned achievements.
CREATE POLICY "Allow users to read their own achievements"
ON public.user_achievements
FOR SELECT
USING (auth.uid() = user_id);