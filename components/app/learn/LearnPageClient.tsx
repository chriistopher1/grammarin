"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { upsertLearnCompleted } from "@/lib/supabase/db";
import type { ExplanationBlock, Grammar } from "@/types";
import { ExplanationView } from "./ExplanationView";

interface LearnPageClientProps {
  grammar: Grammar;
}

function transformExplanation(data: any): ExplanationBlock[] {
  return [
    {
      type: "intro",
      title: "Function",
      content: data.function,
    },
    {
      type: "structure",
      title: "Structure",
      content: data.structure,
      items: data.structure_notes,
    },
    {
      type: "examples",
      title: "Examples",
      content: "",
      items: data.examples?.map((ex: any) => ex.sentence ?? JSON.stringify(ex)),
    },
    {
      type: "usage",
      title: "Usage Tips",
      content: "",
      items: data.usage_tips,
    },
    {
      type: "note",
      title: "Common Mistakes",
      content: "",
      items: data.common_mistakes,
    },
  ];
}

export function LearnPageClient({ grammar }: LearnPageClientProps) {
  const { user } = useAuth();
  const router = useRouter();

  async function handleNext() {
    if (user) {
      await upsertLearnCompleted(user.id, grammar.id);
    }
    router.push(`/quiz/${grammar.id}`);
  }
  console.log("EXPLANATION:", grammar.explanation);
  console.log("TYPE:", typeof grammar.explanation);
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        All Grammars
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            HSK {grammar.hsk_level}
          </span>
          <span className="text-xs text-muted-foreground">
            {grammar.category}
          </span>
          <span className="text-xs text-muted-foreground">
            #{grammar.order_number}
          </span>
        </div>
        <h1 className="font-chinese text-3xl font-bold text-foreground">
          {grammar.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{grammar.pinyin}</p>
        <p className="text-muted-foreground mt-2">
          {grammar.short_description}
        </p>
      </div>

      {/* Explanation */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-foreground mb-4">
          Explanation
        </h2>
        <ExplanationView blocks={transformExplanation(grammar.explanation)} />
      </div>

      {/* Next button */}
      <button
        onClick={handleNext}
        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors"
      >
        Start Quiz
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
