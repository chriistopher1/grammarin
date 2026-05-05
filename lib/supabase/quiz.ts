import { Grammar, QuizQuestion, UserProgress } from "../../types/index";
import { createClient } from "./client";

const supabase = createClient();

export async function getGrammarById(id: string): Promise<Grammar | null> {
  const { data, error } = await supabase
    .from("grammars")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function getQuizQuestions(
  grammarId: string,
): Promise<QuizQuestion[]> {
  const { data, error } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("grammar_id", grammarId)
    .order("question_number", { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function getUserProgress(
  userId: string,
  grammarId: string,
): Promise<UserProgress | null> {
  // console.log("getUserProgress called with", { userId, grammarId });
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("grammar_id", grammarId)
    .single();
  // console.log("getUserProgress", { data, error });
  if (error) return null;
  return data;
}

export async function upsertUserProgress(
  userId: string,
  grammarId: string,
  updates: Partial<UserProgress>,
): Promise<UserProgress | null> {
  const { data, error } = await supabase
    .from("user_progress")
    .upsert(
      {
        user_id: userId,
        grammar_id: grammarId,
        ...updates,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,grammar_id" },
    )
    .select()
    .single();
  if (error) return null;
  return data;
}

export function getCompletedCount(progress: UserProgress | null): number {
  if (!progress) return 0;
  let count = 0;
  if (progress.quiz_question_1_completed) count++;
  if (progress.quiz_question_2_completed) count++;
  if (progress.quiz_question_3_completed) count++;
  return count;
}

export function getQuestionProgressKey(
  questionNumber: number,
): keyof UserProgress {
  return `quiz_question_${questionNumber}_completed` as keyof UserProgress;
}
