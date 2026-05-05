"use client";

import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import { GrammarCard } from "./GrammarCard";
import { ProgressBar } from "@/components/app/grammar/ProgressBar";
import type { Grammar } from "@/types";

interface GrammarListClientProps {
  grammars: Grammar[];
}

export function GrammarListClient({ grammars }: GrammarListClientProps) {
  const { user } = useAuth();
  const { progress } = useProgress(user?.id);

  const completedCount = Object.values(progress).filter(
    (p) => p.quiz_completed
  ).length;

  return (
    <>
      {/* Progress summary */}
      <div className="mb-6 p-4 rounded-xl border bg-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground">Your Progress</span>
          <span className="text-xs text-muted-foreground">
            {completedCount} completed
          </span>
        </div>
        <ProgressBar completed={completedCount} total={grammars.length} />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {grammars.map((grammar) => (
          <GrammarCard
            key={grammar.id}
            grammar={grammar}
            progress={progress[grammar.id]}
          />
        ))}
      </div>
    </>
  );
}