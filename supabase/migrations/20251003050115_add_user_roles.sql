-- Create a custom type for user roles.
-- This allows us to ensure that the 'role' column can only have these specific values.
CREATE TYPE public.user_role AS ENUM ('student', 'recruiter');

-- Add the 'role' column to the 'auth.users' table.
-- This column will store the user's role and defaults to 'student' for all new users.
-- We use 'IF NOT EXISTS' to prevent errors if the script is run multiple times.
ALTER TABLE auth.users
ADD COLUMN IF NOT EXISTS role public.user_role DEFAULT 'student';