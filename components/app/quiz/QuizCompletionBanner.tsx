import { Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

interface QuizCompletionBannerProps {
  grammarTitle: string;
  nextGrammarId?: string;
}

export function QuizCompletionBanner({
  grammarTitle,
  nextGrammarId,
}: QuizCompletionBannerProps) {
  return (
    <div className="rounded-2xl border border-green-500/40 bg-green-500/10 p-6 text-center space-y-4">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
          <Trophy className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-foreground mb-1">
          Quiz Complete! 🎉
        </h3>
        <p className="text-muted-foreground text-sm">
          You&apos;ve mastered all questions for{" "}
          <span className="font-semibold text-foreground">{grammarTitle}</span>
        </p>
      </div>
      <div className="flex gap-3 justify-center">
        <Link
          href="/grammar"
          className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          Back to Lessons
        </Link>
        {nextGrammarId && (
          <Link
            href={`/quiz/${nextGrammarId}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Next Lesson
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}