import { notFound } from "next/navigation";
import {
  getGrammarById,
  getQuizQuestions,
  getUserProgress,
} from "@/lib/supabase/quiz";
import { createClient } from "@/lib/supabase/server";
import { QuizClient } from "@/components/app/quiz/QuizClient";

async function getNextGrammarId(
  currentOrderNumber: number,
): Promise<string | undefined> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("grammars")
    .select("id")
    .eq("order_number", currentOrderNumber + 1)
    .single();

  return data?.id;
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [grammar, questions] = await Promise.all([
    getGrammarById(id),
    getQuizQuestions(id),
  ]);

  if (!grammar) notFound();

//   console.log("user, id", user!.id, id);

  const progress = user ? await getUserProgress(user.id, id) : null;

//   console.log("progress", progress);

  const nextGrammarId = await getNextGrammarId(grammar.order_number);

  return (
    <QuizClient
      grammar={grammar}
      questions={questions}
      initialProgress={progress}
      nextGrammarId={nextGrammarId}
    />
  );
}
