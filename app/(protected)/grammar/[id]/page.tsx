import { LearnPageClient } from "@/components/app/learn/LearnPageClient";
import { fetchGrammarById } from "@/lib/supabase/db";
import { notFound } from "next/navigation";

export default async function GrammarLearnPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // console.log("Fetching grammar with ID:", id);

  const grammar = await fetchGrammarById(id);
  if (!grammar) notFound();

  return <LearnPageClient grammar={grammar} />;
}