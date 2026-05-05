import { GrammarListClient } from "@/components/app/grammar/GrammarListClient";
import { fetchAllGrammars } from "@/lib/supabase/db";

export default async function HomePage() {
  const grammars = await fetchAllGrammars();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-widest mb-3">
          <span className="w-6 h-px bg-primary" />
          HSK 2 Grammar
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          Master Mandarin{" "}
          <span className="font-chinese text-primary">语法</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-base max-w-xl">
          30 essential grammar patterns for HSK 2. Learn the structure, then
          practice with drag-and-drop quizzes.
        </p>
      </div>

      <GrammarListClient grammars={grammars} />
    </div>
  );
}