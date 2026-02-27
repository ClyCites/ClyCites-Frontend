import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export function EmptyState({ title, description, actionLabel, onAction, compact = false }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-dashed border-border/70 bg-card/70 text-center",
        compact ? "px-4 py-6" : "px-6 py-14"
      )}
    >
      <svg
        viewBox="0 0 140 90"
        className={cn("mb-4 text-muted-foreground/70", compact ? "h-10 w-20" : "h-16 w-28")}
        role="img"
        aria-hidden
      >
        <rect x="12" y="18" width="116" height="58" rx="12" fill="hsl(var(--muted) / 0.7)" />
        <rect x="24" y="30" width="56" height="8" rx="4" fill="hsl(var(--muted-foreground) / 0.32)" />
        <rect x="24" y="44" width="84" height="6" rx="3" fill="hsl(var(--muted-foreground) / 0.2)" />
        <circle cx="106" cy="34" r="10" fill="hsl(var(--primary) / 0.2)" />
      </svg>
      <h3 className={cn("font-semibold", compact ? "text-base" : "text-lg")}>{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction && (
        <Button className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
