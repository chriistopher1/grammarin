import { cn } from "@/lib/utils";

interface QuizProgressBarProps {
  completed: number;
  total: number;
}

export function QuizProgressBar({ completed, total }: QuizProgressBarProps) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground font-medium">
          {completed} / {total} completed
        </span>
        <span
          className={cn(
            "font-semibold tabular-nums",
            percent === 100 ? "text-green-600 dark:text-green-400" : "text-primary"
          )}
        >
          {percent}%
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            percent === 100
              ? "bg-green-500"
              : "bg-primary"
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}