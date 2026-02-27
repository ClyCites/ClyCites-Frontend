import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-all",
  {
    variants: {
      variant: {
        default:     "border border-transparent bg-primary text-primary-foreground shadow-[0_8px_16px_-12px_hsl(var(--primary)/0.85)]",
        secondary:   "border border-transparent bg-secondary/14 text-secondary",
        destructive: "border border-transparent bg-destructive/12 text-destructive",
        outline:     "border border-border/75 text-foreground bg-card/70",
        success:     "border border-primary/25 bg-primary/12 text-primary",
        warning:     "border border-warning/30 bg-warning/16 text-warning-foreground",
        muted:       "border border-transparent bg-muted text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
