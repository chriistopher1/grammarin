"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function markLearnCompleted(grammarId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("user_progress")
    .upsert({
      user_id: user.id,
      grammar_id: grammarId,
      is_learn_completed: true,
    }, { onConflict: "user_id,grammar_id" })

  if (error) return { error: error.message }
  revalidatePath(`/grammar/${grammarId}`)
  return { success: true }
}

export async function markQuizQuestionCompleted(
  grammarId: string,
  questionNumber: 1 | 2 | 3
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const field = `quiz_question_${questionNumber}_completed` as const

  // Check if all 3 will be complete
  const { data: existing } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("grammar_id", grammarId)
    .single()

  const updatedProgress = {
    ...(existing || {}),
    user_id: user.id,
    grammar_id: grammarId,
    [field]: true,
  }

  const allComplete =
    (questionNumber === 1 || existing?.quiz_question_1_completed) &&
    (questionNumber === 2 || existing?.quiz_question_2_completed) &&
    (questionNumber === 3 || existing?.quiz_question_3_completed)

  if (allComplete) {
    updatedProgress.quiz_completed = true
    updatedProgress.completed_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from("user_progress")
    .upsert(updatedProgress, { onConflict: "user_id,grammar_id" })

  if (error) return { error: error.message }
  revalidatePath(`/quiz/${grammarId}`)
  return { success: true, allComplete }
}

export async function getUserProgress(grammarId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("grammar_id", grammarId)
    .single()

  return data
}