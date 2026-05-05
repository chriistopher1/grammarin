"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { Grammar, QuizQuestion, UserProgress } from "@/types/index";
import { upsertUserProgress, getQuestionProgressKey } from "@/lib/supabase/quiz";
import { createClient } from "@/lib/supabase/client";
import { QuizProgressBar } from "./QuizProgressBar";
import { QuizQuestionCard } from "./QuizQuestionCard";
import { QuizCompletionBanner } from "./QuizCompletionBanner";

interface QuizClientProps {
  grammar: Grammar;
  questions: QuizQuestion[];
  initialProgress: UserProgress | null;
  nextGrammarId?: string;
}

export function QuizClient({
  grammar,
  questions,
  initialProgress,
  nextGrammarId,
}: QuizClientProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(initialProgress);
  const [savingQuestion, setSavingQuestion] = useState<number | null>(null);

    const supabase = createClient();

  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  const isQuestionCompleted = useCallback(
    (questionNumber: number): boolean => {
      if (!progress) return false;
      const key = getQuestionProgressKey(questionNumber);
      return !!progress[key];
    },
    [progress]
  );

  const completedCount = [1, 2, 3].filter((n) =>
    isQuestionCompleted(n)
  ).length;

  const allCompleted = completedCount === questions.length;

  const handleQuestionComplete = async (questionNumber: number) => {
    if (!userId || isQuestionCompleted(questionNumber)) return;
    setSavingQuestion(questionNumber);

    const allWillBeComplete =
      [1, 2, 3]
        .filter((n) => n !== questionNumber)
        .every((n) => isQuestionCompleted(n)) &&
      questions.length === 3;

    const updates: Partial<UserProgress> = {
      [getQuestionProgressKey(questionNumber)]: true,
      ...(allWillBeComplete && {
        quiz_completed: true,
        completed_at: new Date().toISOString(),
      }),
    };

    const updated = await upsertUserProgress(userId, grammar.id, updates);
    if (updated) {
      setProgress(updated);
    }
    setSavingQuestion(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Back nav */}
        <div className="flex items-center justify-between">
          <Link
            href="/grammar"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lessons
          </Link>
          <Link
            href={`/grammar/${grammar.id}`}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Review Grammar
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              HSK {grammar.hsk_level}
            </span>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
              {grammar.category}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              {grammar.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              {grammar.short_description}
            </p>
          </div>
          <QuizProgressBar
            completed={completedCount}
            total={questions.length}
          />
        </div>

        {/* Guest notice */}
        {!userId && (
          <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
            <strong>Tip:</strong> Sign in to save your progress across sessions.
          </div>
        )}

        {/* Saving indicator */}
        {savingQuestion !== null && (
          <p className="text-xs text-muted-foreground text-right animate-pulse">
            Saving progress...
          </p>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((q, i) => (
            <QuizQuestionCard
              key={q.id}
              question={q}
              questionIndex={i}
              totalQuestions={questions.length}
              isCompleted={isQuestionCompleted(q.question_number)}
              onComplete={handleQuestionComplete}
            />
          ))}
        </div>

        {/* Completion */}
        {allCompleted && (
          <QuizCompletionBanner
            grammarTitle={grammar.title}
            nextGrammarId={nextGrammarId}
          />
        )}
      </div>
    </div>
  );
}