-- LeetLog initial schema
-- All tables have RLS enabled with user_id = auth.uid() policies

-- 1. leetcode_problems
CREATE TABLE leetcode_problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_number integer NOT NULL,
  question text NOT NULL,
  link text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  programming_language text NOT NULL,
  code_snippet text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  date_solved date NOT NULL,
  next_review_date date NOT NULL,
  repetition_count integer NOT NULL DEFAULT 0,
  ease_factor numeric NOT NULL DEFAULT 2.5,
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'due_for_review', 'mastered')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE leetcode_problems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own leetcode problems"
  ON leetcode_problems FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own leetcode problems"
  ON leetcode_problems FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own leetcode problems"
  ON leetcode_problems FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own leetcode problems"
  ON leetcode_problems FOR DELETE
  USING (user_id = auth.uid());

-- 2. dsa_concepts
CREATE TABLE dsa_concepts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic text NOT NULL,
  resource_used text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  mastery_level text NOT NULL DEFAULT 'not_started' CHECK (mastery_level IN ('not_started', 'learning', 'comfortable', 'mastered')),
  date_studied date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE dsa_concepts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own dsa concepts"
  ON dsa_concepts FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own dsa concepts"
  ON dsa_concepts FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own dsa concepts"
  ON dsa_concepts FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own dsa concepts"
  ON dsa_concepts FOR DELETE
  USING (user_id = auth.uid());

-- 3. interview_questions
CREATE TABLE interview_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own interview questions"
  ON interview_questions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own interview questions"
  ON interview_questions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own interview questions"
  ON interview_questions FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own interview questions"
  ON interview_questions FOR DELETE
  USING (user_id = auth.uid());

-- 4. coding_questions
CREATE TABLE coding_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question text NOT NULL,
  repository_link text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  date_created date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE coding_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own coding questions"
  ON coding_questions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own coding questions"
  ON coding_questions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own coding questions"
  ON coding_questions FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own coding questions"
  ON coding_questions FOR DELETE
  USING (user_id = auth.uid());

-- 5. system_design
CREATE TABLE system_design (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question text NOT NULL,
  company text NOT NULL DEFAULT '',
  answer text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE system_design ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own system design entries"
  ON system_design FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own system design entries"
  ON system_design FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own system design entries"
  ON system_design FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own system design entries"
  ON system_design FOR DELETE
  USING (user_id = auth.uid());
