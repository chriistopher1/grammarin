"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Lightbulb, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { DragDropBoard } from "./DragDropBoard";
import { QuizQuestion } from "@/types/index";

interface QuizQuestionCardProps {
  question: QuizQuestion;
  questionIndex: number; // 0-based
  totalQuestions: number;
  isCompleted: boolean;
  onComplete: (questionNumber: number) => void;
}

type Status = "idle" | "correct" | "incorrect";

export function QuizQuestionCard({
  question,
  questionIndex,
  totalQuestions,
  isCompleted,
  onComplete,
}: QuizQuestionCardProps) {
  const [arranged, setArranged] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>(isCompleted ? "correct" : "idle");
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [key, setKey] = useState(0); // force DragDropBoard remount on retry

  useEffect(() => {
    if (isCompleted) setStatus("correct");
  }, [isCompleted]);

  const handleCheck = () => {
    const userAnswer = arranged.join("");
    const correct = question.correct_answer.replace(/\s/g, "");
    const userClean = userAnswer.replace(/\s/g, "");

    if (userClean === correct) {
      setStatus("correct");
      onComplete(question.question_number);
    } else {
      setStatus("incorrect");
      setAttempts((a) => a + 1);
    }
  };

  const handleRetry = () => {
    setStatus("idle");
    setArranged([]);
    setKey((k) => k + 1);
  };

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card transition-all duration-300",
        status === "correct" && "border-green-500/50 bg-green-500/5",
        status === "incorrect" && "border-destructive/50 bg-destructive/5",
        status === "idle" && "border-border"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-border/60">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
              status === "correct"
                ? "bg-green-500 text-white"
                : status === "incorrect"
                ? "bg-destructive text-destructive-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {status === "correct" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              questionIndex + 1
            )}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
        </div>

        {question.hint && status !== "correct" && (
          <button
            onClick={() => setShowHint((h) => !h)}
            className={cn(
              "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors",
              showHint
                ? "border-amber-400 bg-amber-400/10 text-amber-600 dark:text-amber-400"
                : "border-border text-muted-foreground hover:border-amber-400 hover:text-amber-600"
            )}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Hint
          </button>
        )}
      </div>

      <div className="p-5 space-y-5">
        {/* Hint */}
        {showHint && question.hint && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-400/10 border border-amber-400/30 text-sm text-amber-700 dark:text-amber-300">
            <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{question.hint}</span>
          </div>
        )}

        {/* Instruction */}
        <p className="text-sm text-muted-foreground">
          Arrange the words to form a correct Mandarin sentence.
        </p>

        {/* Drag and Drop */}
        <DragDropBoard
          key={key}
          words={isCompleted ? [] : question.words}
          onAnswerChange={setArranged}
          disabled={status === "correct"}
        />

        {/* Completed state shows correct answer */}
        {status === "correct" && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-0.5">
                Correct!
              </p>
              <p className="text-lg font-medium text-foreground">
                {question.correct_answer}
              </p>
            </div>
          </div>
        )}

        {/* Incorrect feedback */}
        {status === "incorrect" && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30">
            <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-destructive mb-0.5">
                Not quite right
              </p>
              <p className="text-sm text-muted-foreground">
                Try rearranging the words.
                {attempts >= 2 && question.hint && !showHint && (
                  <button
                    onClick={() => setShowHint(true)}
                    className="ml-1 underline underline-offset-2 hover:text-foreground transition-colors"
                  >
                    Use the hint?
                  </button>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        {status !== "correct" && (
          <div className="flex gap-3">
            {status === "incorrect" && (
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Retry
              </button>
            )}
            <button
              onClick={handleCheck}
              disabled={arranged.length === 0}
              className={cn(
                "flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "disabled:opacity-40 disabled:cursor-not-allowed"
              )}
            >
              Check Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}