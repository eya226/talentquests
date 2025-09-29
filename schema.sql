-- Profiles Table
-- This table will store user profile data, extending the built-in auth.users table.
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  archetype text,
  skills jsonb,
  "values" text[],
  vision_board jsonb,
  role text default 'student'::text
);

alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Function to create a public profile for each new user
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, role)
  values (new.id, new.email, new.raw_user_meta_data->>'role');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function when a new user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Quests Table
-- This table stores the available quests/challenges for users.
create table quests (
  id uuid not null primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  title text not null,
  description text,
  initial_code text,
  xp_reward integer,
  badge_reward text
);

alter table quests enable row level security;
create policy "Quests are viewable by everyone." on quests for select using (true);
-- Add policies for insert/update/delete for admin roles later if needed.


-- Jobs Table
-- This table stores job listings posted by recruiters.
create table jobs (
  id uuid not null primary key default gen_random_uuid(),
  recruiter_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default now(),
  company_name text not null,
  title text not null,
  salary integer,
  description text,
  culture_fit_tags text[]
);

alter table jobs enable row level security;
create policy "Jobs are viewable by authenticated users." on jobs for select using (auth.role() = 'authenticated');
create policy "Recruiters can insert their own jobs." on jobs for insert with check (auth.uid() = recruiter_id);
create policy "Recruiters can update their own jobs." on jobs for update using (auth.uid() = recruiter_id);


-- Quest Submissions Table
-- This table stores user submissions for quests.
create table quest_submissions (
  id uuid not null primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  quest_id uuid references quests on delete cascade not null,
  submitted_at timestamp with time zone default now(),
  submitted_code text,
  is_solved boolean default false
);

alter table quest_submissions enable row level security;
create policy "Users can view their own submissions." on quest_submissions for select using (auth.uid() = user_id);
create policy "Users can insert their own submissions." on quest_submissions for insert with check (auth.uid() = user_id);


-- Applications Table
-- This table links users to jobs they've applied for.
create table applications (
  id uuid not null primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  job_id uuid references jobs on delete cascade not null,
  applied_at timestamp with time zone default now(),
  status text default 'applied'::text,
  unique(user_id, job_id)
);

alter table applications enable row level security;
create policy "Users can view their own applications." on applications for select using (auth.uid() = user_id);
create policy "Users can create applications." on applications for insert with check (auth.uid() = user_id);
create policy "Recruiters can view applications for their jobs." on applications for select using (
  exists (
    select 1 from jobs where jobs.id = applications.job_id and jobs.recruiter_id = auth.uid()
  )
);
create policy "Recruiters can update application status for their jobs." on applications for update using (
  exists (
    select 1 from jobs where jobs.id = applications.job_id and jobs.recruiter_id = auth.uid()
  )
);

-- Questions Table
-- This table stores the questions for the onboarding chat.
create table questions (
  id uuid not null primary key default gen_random_uuid(),
  "order" integer not null unique,
  question_text text not null,
  associated_skill text,
  associated_value text
);

alter table questions enable row level security;
create policy "Questions are viewable by everyone." on questions for select using (true);


-- Seed Data
-- This should be run after the tables and policies are created.

-- Insert a sample quest
insert into quests (id, title, description, initial_code, xp_reward, badge_reward)
values (
  'a1b2c3d4-e5f6-7890-1234-567890abcdef', -- A fixed UUID for consistency
  'The Bug Hunter''s Guild: Neo-Bugton''s Infinite Loop',
  'The city''s streetlights are stuck in an infinite loop, draining power. Fix the code to break the cycle.',
  'while True: # <- Bug!\n    turn_on_lights()',
  50,
  'Syntax Mastery'
);

-- Insert onboarding questions
insert into questions ("order", question_text, associated_skill, associated_value)
values
  (1, 'Tell me about a project you enjoyed building.', 'Problem-Solving', 'Builder'),
  (2, 'When you get stuck on a tough problem, what’s your first move?', 'Resourcefulness', 'Independent'),
  (3, 'Do you prefer working on a team or flying solo?', 'Collaboration', 'Team Player'),
  (4, 'What kind of company would you love to join one day?', 'Vision', 'Purpose-Driven');

-- Note: To seed a job, you need a recruiter user to exist first.
-- 1. Sign up a user you want to be a recruiter.
-- 2. Get their user ID from the `auth.users` table.
-- 3. Run the following SQL, replacing 'YOUR_RECRUITER_USER_ID' with the actual ID.
--
-- insert into jobs (recruiter_id, company_name, title, salary, description, culture_fit_tags)
-- values (
--   'YOUR_RECRUITER_USER_ID',
--   'EdTech Tunisia',
--   'Junior Backend Developer',
--   2800,
--   'You both value education & purpose-driven work. You also beat the Malware Spider — a perfect fit!',
--   '{"Education", "Purpose-Driven"}'
-- );