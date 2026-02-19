import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  text?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };

export function LoadingState({ text, className, size = "md" }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground", className)}>
      <Loader2 className={cn("animate-spin", sizeMap[size])} />
      {text && <p className="text-sm">{text}</p>}
    </div>
  );
}

export function LoadingSpinner({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  return <Loader2 className={cn("animate-spin text-primary", sizeMap[size], className)} />;
}
