import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm transition-colors", {
  variants: {
    variant: {
      default: "bg-primary/16 text-primary",
      secondary: "bg-secondary/14 text-secondary",
      destructive: "bg-destructive/14 text-destructive",
      outline: "border border-border/75 bg-card/70 text-foreground",
      success: "bg-success/16 text-success",
      warning: "bg-warning/18 text-warning-foreground",
      muted: "bg-muted text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
