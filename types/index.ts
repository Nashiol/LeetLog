export type Difficulty = "easy" | "medium" | "hard";
export type ProblemStatus = "in_progress" | "due_for_review" | "mastered";
export type MasteryLevel = "not_started" | "learning" | "comfortable" | "mastered";
export type ReviewRating = "hard" | "medium" | "easy" | "very_easy";

export interface LeetCodeProblem {
  id: string;
  user_id: string;
  problem_number: number;
  question: string;
  link: string;
  difficulty: Difficulty;
  programming_language: string;
  code_snippet: string;
  notes: string;
  date_solved: string;
  next_review_date: string;
  repetition_count: number;
  ease_factor: number;
  status: ProblemStatus;
  created_at: string;
}

export interface DSAConcept {
  id: string;
  user_id: string;
  topic: string;
  resource_used: string;
  notes: string;
  mastery_level: MasteryLevel;
  date_studied: string;
  created_at: string;
}

export interface InterviewQuestion {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  notes: string;
  created_at: string;
}

export interface CodingQuestion {
  id: string;
  user_id: string;
  question: string;
  repository_link: string;
  notes: string;
  date_created: string;
  created_at: string;
}

export interface SystemDesign {
  id: string;
  user_id: string;
  question: string;
  company: string;
  answer: string;
  notes: string;
  created_at: string;
}
