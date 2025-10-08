-- Create the skills table
CREATE TABLE public.skills (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add comments to the table and columns
COMMENT ON TABLE public.skills IS 'Stores the list of skills that can be assigned to users.';
COMMENT ON COLUMN public.skills.name IS 'The name of the skill (e.g., React, Python).';

-- Populate the skills table with the initial set of skills
INSERT INTO public.skills (name) VALUES
('React'),
('Node.js'),
('Python'),
('JavaScript'),
('TypeScript'),
('Vue'),
('Angular'),
('HTML'),
('CSS'),
('SQL'),
('MongoDB'),
('Firebase'),
('Supabase'),
('Docker'),
('Kubernetes'),
('AWS'),
('Google Cloud'),
('Azure'),
('Machine Learning'),
('Data Science'),
('UI/UX Design'),
('Figma'),
('Project Management');

-- Enable Row Level Security (RLS) for the skills table
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow authenticated users to read skills
CREATE POLICY "Allow authenticated users to read skills"
ON public.skills
FOR SELECT
TO authenticated
USING (true);