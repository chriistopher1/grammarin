"use client";

import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DragDropBoardProps {
  words: string[];
  onAnswerChange: (arranged: string[]) => void;
  disabled?: boolean;
}

export function DragDropBoard({
  words,
  onAnswerChange,
  disabled = false,
}: DragDropBoardProps) {
  const [bank, setBank] = useState<string[]>([]);
  const [arranged, setArranged] = useState<string[]>([]);
  const [dragSource, setDragSource] = useState<{
    area: "bank" | "arranged";
    index: number;
  } | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<{
    area: "bank" | "arranged";
    index: number;
  } | null>(null);

  const notify = useCallback(
    (next: string[]) => onAnswerChange(next),
    [onAnswerChange],
  );

  // Move word from bank → arranged
  const addWord = (bankIndex: number) => {
    if (disabled) return;
    const word = bank[bankIndex];
    const newBank = bank.filter((_, i) => i !== bankIndex);
    const newArranged = [...arranged, word];
    setBank(newBank);
    setArranged(newArranged);
    notify(newArranged);
  };

  // Move word from arranged → bank
  const removeWord = (arrangedIndex: number) => {
    if (disabled) return;
    const word = arranged[arrangedIndex];
    const newArranged = arranged.filter((_, i) => i !== arrangedIndex);
    const newBank = [...bank, word];
    setBank(newBank);
    setArranged(newArranged);
    notify(newArranged);
  };

  // --- Drag handlers ---
  const handleDragStart = (area: "bank" | "arranged", index: number) => {
    setDragSource({ area, index });
  };

  const handleDragOver = (
    e: React.DragEvent,
    area: "bank" | "arranged",
    index: number,
  ) => {
    e.preventDefault();
    setDragOverTarget({ area, index });
  };

  const handleDrop = (
    e: React.DragEvent,
    targetArea: "bank" | "arranged",
    targetIndex: number,
  ) => {
    e.preventDefault();
    if (!dragSource || disabled) return;

    const { area: srcArea, index: srcIndex } = dragSource;

    if (srcArea === "bank" && targetArea === "arranged") {
      const word = bank[srcIndex];
      const newBank = bank.filter((_, i) => i !== srcIndex);
      const newArranged = [...arranged];
      newArranged.splice(targetIndex, 0, word);
      setBank(newBank);
      setArranged(newArranged);
      notify(newArranged);
    } else if (srcArea === "arranged" && targetArea === "bank") {
      const word = arranged[srcIndex];
      const newArranged = arranged.filter((_, i) => i !== srcIndex);
      const newBank = [...bank];
      newBank.splice(targetIndex, 0, word);
      setArranged(newArranged);
      setBank(newBank);
      notify(newArranged);
    } else if (srcArea === "arranged" && targetArea === "arranged") {
      const newArranged = [...arranged];
      const [moved] = newArranged.splice(srcIndex, 1);
      newArranged.splice(targetIndex, 0, moved);
      setArranged(newArranged);
      notify(newArranged);
    } else if (srcArea === "bank" && targetArea === "bank") {
      const newBank = [...bank];
      const [moved] = newBank.splice(srcIndex, 1);
      newBank.splice(targetIndex, 0, moved);
      setBank(newBank);
    }

    setDragSource(null);
    setDragOverTarget(null);
  };

  const handleDragEnd = () => {
    setDragSource(null);
    setDragOverTarget(null);
  };

  const handleDropOnArea = (e: React.DragEvent, area: "bank" | "arranged") => {
    e.preventDefault();
    if (!dragSource || disabled) return;
    const { area: srcArea, index: srcIndex } = dragSource;

    if (srcArea === "bank" && area === "arranged") {
      addWord(srcIndex);
    } else if (srcArea === "arranged" && area === "bank") {
      removeWord(srcIndex);
    }

    setDragSource(null);
    setDragOverTarget(null);
  };

  // Reset
  const reset = () => {
    setBank([...words]);
    setArranged([]);
    setDragSource(null);
    setDragOverTarget(null);
    notify([]);
  };

  function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  useEffect(() => {
    setBank(shuffleArray(words));
    setArranged([]);
  }, [words]);

  return (
    <div className="flex flex-col gap-6">
      {/* Answer area */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Your Answer
        </p>
        <div
          className={cn(
            "min-h-[72px] rounded-xl border-2 border-dashed p-3 flex flex-wrap gap-2 items-center transition-colors",
            dragOverTarget?.area === "arranged"
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/30",
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverTarget({ area: "arranged", index: arranged.length });
          }}
          onDrop={(e) => handleDropOnArea(e, "arranged")}
        >
          {arranged.length === 0 && (
            <p className="text-sm text-muted-foreground select-none w-full text-center">
              Drag words here to form a sentence
            </p>
          )}
          {arranged.map((word, i) => (
            <WordChip
              key={`arranged-${i}-${word}`}
              word={word}
              draggable={!disabled}
              isDragging={
                dragSource?.area === "arranged" && dragSource.index === i
              }
              isDragOver={
                dragOverTarget?.area === "arranged" &&
                dragOverTarget.index === i
              }
              variant="arranged"
              onDragStart={() => handleDragStart("arranged", i)}
              onDragOver={(e) => handleDragOver(e, "arranged", i)}
              onDrop={(e) => handleDrop(e, "arranged", i)}
              onDragEnd={handleDragEnd}
              onClick={() => removeWord(i)}
              disabled={disabled}
            />
          ))}
        </div>
      </div>

      {/* Word bank */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Word Bank
        </p>
        <div
          className={cn(
            "min-h-[72px] rounded-xl border border-border p-3 flex flex-wrap gap-2 items-center transition-colors",
            dragOverTarget?.area === "bank"
              ? "border-primary bg-primary/5"
              : "bg-card",
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverTarget({ area: "bank", index: bank.length });
          }}
          onDrop={(e) => handleDropOnArea(e, "bank")}
        >
          {bank.length === 0 && (
            <p className="text-sm text-muted-foreground select-none w-full text-center">
              All words placed
            </p>
          )}
          {bank.map((word, i) => (
            <WordChip
              key={`bank-${i}-${word}`}
              word={word}
              draggable={!disabled}
              isDragging={dragSource?.area === "bank" && dragSource.index === i}
              isDragOver={
                dragOverTarget?.area === "bank" && dragOverTarget.index === i
              }
              variant="bank"
              onDragStart={() => handleDragStart("bank", i)}
              onDragOver={(e) => handleDragOver(e, "bank", i)}
              onDrop={(e) => handleDrop(e, "bank", i)}
              onDragEnd={handleDragEnd}
              onClick={() => addWord(i)}
              disabled={disabled}
            />
          ))}
        </div>
      </div>

      {/* Reset */}
      {!disabled && arranged.length > 0 && (
        <button
          onClick={reset}
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 self-start transition-colors"
        >
          Reset words
        </button>
      )}
    </div>
  );
}

interface WordChipProps {
  word: string;
  draggable: boolean;
  isDragging: boolean;
  isDragOver: boolean;
  variant: "bank" | "arranged";
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onClick: () => void;
  disabled: boolean;
}

function WordChip({
  word,
  draggable,
  isDragging,
  isDragOver,
  variant,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onClick,
  disabled,
}: WordChipProps) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onClick={!disabled ? onClick : undefined}
      className={cn(
        "px-4 py-2 rounded-lg text-base font-medium select-none transition-all duration-150 cursor-pointer",
        "border shadow-sm",
        variant === "arranged"
          ? "bg-primary text-primary-foreground border-primary/80 hover:bg-primary/90"
          : "bg-background text-foreground border-border hover:border-primary hover:bg-primary/5",
        isDragging && "opacity-40 scale-95",
        isDragOver && "ring-2 ring-primary ring-offset-1",
        disabled && "cursor-default opacity-70",
      )}
    >
      {word}
    </div>
  );
}
