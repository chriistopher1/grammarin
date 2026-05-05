// import { createAdminClient } from "./admin";
import { createClient } from "./client";
import type {
  Grammar,
  QuizQuestion,
  UserProgress,
  QuizQuestionKey,
} from "@/types";

const supabase =  createClient();

// ─── Grammar ───────────────────────────────────────────────
export async function fetchAllGrammars(): Promise<Grammar[]> {
  const { data, error } = await supabase
    .from("grammars")
    .select("*")
    .order("order_number");
  if (error) throw error;
  return data ?? [];
}

export async function fetchGrammarById(id: string): Promise<Grammar | null> {
  const { data, error } = await supabase
    .from("grammars")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

// ─── Quiz Questions ─────────────────────────────────────────
export async function fetchQuizQuestions(
  grammarId: string,
): Promise<QuizQuestion[]> {
  const { data, error } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("grammar_id", grammarId)
    .order("question_number");
  if (error) throw error;
  return data ?? [];
}

// ─── User Progress ──────────────────────────────────────────
export async function fetchUserProgress(
  userId: string,
  grammarId: string,
): Promise<UserProgress | null> {
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("grammar_id", grammarId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchAllUserProgress(
  userId: string,
): Promise<UserProgress[]> {
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data ?? [];
}

export async function upsertLearnCompleted(userId: string, grammarId: string) {
  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: userId,
      grammar_id: grammarId,
      is_learn_completed: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,grammar_id" },
  );
  if (error) throw error;
}

export async function upsertQuizQuestionCompleted(
  userId: string,
  grammarId: string,
  questionNumber: number,
) {
  const key: QuizQuestionKey =
    `quiz_question_${questionNumber}_completed` as QuizQuestionKey;
  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: userId,
      grammar_id: grammarId,
      [key]: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,grammar_id" },
  );
  if (error) throw error;
}

export async function upsertQuizCompleted(userId: string, grammarId: string) {
  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: userId,
      grammar_id: grammarId,
      quiz_question_1_completed: true,
      quiz_question_2_completed: true,
      quiz_question_3_completed: true,
      quiz_completed: true,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,grammar_id" },
  );
  if (error) throw error;
}
