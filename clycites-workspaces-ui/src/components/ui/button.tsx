import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_14px_24px_-16px_hsl(var(--primary)/0.9)] hover:bg-primary/92",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_12px_20px_-14px_hsl(var(--destructive)/0.95)] hover:bg-destructive/90",
        outline:
          "border border-input/80 bg-card/78 text-foreground shadow-[0_10px_24px_-22px_hsl(var(--foreground)/0.9)] hover:bg-hoverbg/70",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_14px_24px_-16px_hsl(var(--secondary)/0.85)] hover:bg-secondary/90",
        ghost: "text-foreground hover:bg-hoverbg/68",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success/14 text-success hover:bg-success/22",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-6",
        xl: "h-12 rounded-2xl px-8 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          "relative overflow-hidden transition-all duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
          "before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.25),transparent)] before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100",
          buttonVariants({ variant, size, className })
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-30" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-90" fill="currentColor" d="M12 3a9 9 0 0 1 9 9h-4a5 5 0 0 0-5-5V3z" />
            </svg>
            <span>Loading</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
