import Link from "next/link";
import { CheckCircle2, Circle, BookOpen } from "lucide-react";
import type { Grammar } from "@/types";
import type { UserProgress } from "@/types";

interface GrammarCardProps {
  grammar: Grammar;
  progress?: UserProgress;
}

const CATEGORY_COLORS: Record<string, string> = {
  Emphasis: "bg-orange-100 text-orange-700",
  Time: "bg-blue-100 text-blue-700",
  Comparison: "bg-purple-100 text-purple-700",
  Negation: "bg-red-100 text-red-700",
  Modal: "bg-green-100 text-green-700",
  Question: "bg-yellow-100 text-yellow-700",
  Conjunction: "bg-pink-100 text-pink-700",
  Aspect: "bg-cyan-100 text-cyan-700",
  Default: "bg-muted text-muted-foreground",
};

function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Default;
}

export function GrammarCard({ grammar, progress }: GrammarCardProps) {
  const isCompleted = progress?.quiz_completed ?? false;
  const isStarted = !!progress;

  return (
    <Link href={`/grammar/${grammar.id}`} className="group block">
      <div className="relative border rounded-xl p-4 bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200">
        {/* Status icon */}
        <div className="absolute top-3 right-3">
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-success" />
          ) : isStarted ? (
            <Circle className="w-5 h-5 text-primary/50" strokeWidth={2.5} />
          ) : (
            <Circle className="w-5 h-5 text-muted-foreground/30" />
          )}
        </div>

        {/* Order number */}
        <span className="text-xs text-muted-foreground font-medium">
          #{grammar.order_number}
        </span>

        {/* Title */}
        <h3 className="font-chinese text-lg font-bold mt-1 text-foreground group-hover:text-primary transition-colors pr-6 leading-tight">
          {grammar.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">{grammar.pinyin}</p>

        {/* Description */}
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {grammar.short_description}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-2 mt-3">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryColor(grammar.category)}`}
          >
            {grammar.category}
          </span>
          {isStarted && !isCompleted && (
            <span className="text-xs text-primary font-medium flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              In progress
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}