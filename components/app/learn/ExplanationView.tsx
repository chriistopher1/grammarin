import type { ExplanationBlock } from "@/types";

interface ExplanationViewProps {
  blocks: ExplanationBlock[];
}

const blockStyles: Record<string, string> = {
  intro: "border-l-4 border-primary pl-4 bg-primary/5 py-3 rounded-r-lg",
  structure: "border-l-4 border-accent pl-4 bg-accent/5 py-3 rounded-r-lg",
  examples: "border-l-4 border-success pl-4 bg-success/10 py-3 rounded-r-lg",
  usage: "border-l-4 border-warning pl-4 bg-warning/5 py-3 rounded-r-lg",
  note: "border rounded-lg p-4 bg-muted/50",
};

export function ExplanationView({ blocks }: ExplanationViewProps) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => (
        <div key={i} className={blockStyles[block.type] ?? blockStyles.note}>
          {block.title && (
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              {block.title}
            </p>
          )}
          <p className="text-sm text-foreground leading-relaxed">{block.content}</p>
          {block.items && block.items.length > 0 && (
            <ul className="mt-2 space-y-1">
              {block.items.map((item, j) => (
                <li key={j} className="text-sm text-foreground flex gap-2">
                  <span className="text-muted-foreground mt-0.5">•</span>
                  <span className="font-chinese">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}