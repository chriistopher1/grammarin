export interface Grammar {
  id: string;
  order_number: number;
  title: string;
  pinyin: string;
  hsk_level: number;
  category: string;
  short_description: string;
  explanation: ExplanationBlock[];
  created_at: string;
}

export interface ExplanationBlock {
  type: "intro" | "structure" | "examples" | "usage" | "note";
  title?: string;
  content: string;
  items?: string[];
}

export interface QuizQuestion {
  id: string;
  grammar_id: string;
  question_number: number;
  words: string[];
  correct_answer: string;
  hint?: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  grammar_id: string;
  is_learn_completed: boolean;
  quiz_question_1_completed: boolean;
  quiz_question_2_completed: boolean;
  quiz_question_3_completed: boolean;
  quiz_completed: boolean;
  started_at: string;
  completed_at?: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  display_name?: string;
  avatar_url?: string;
  total_grammars_completed: number;
  created_at: string;
  updated_at: string;
}

export type QuizQuestionKey =
  | "quiz_question_1_completed"
  | "quiz_question_2_completed"
  | "quiz_question_3_completed";