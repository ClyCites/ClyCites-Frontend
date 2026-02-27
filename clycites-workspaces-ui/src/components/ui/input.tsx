import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border border-input/75 bg-card/86 px-3 py-2 text-sm text-foreground shadow-[0_8px_22px_-22px_hsl(var(--foreground)/0.95)]",
        "placeholder:text-muted-foreground transition-all duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
        "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, id, label, placeholder = " ", ...props }, ref) => (
    <div className="relative">
      <input
        id={id}
        ref={ref}
        placeholder={placeholder}
        className={cn(
          "peer h-11 w-full rounded-xl border border-input/75 bg-card/86 px-3 pt-5 text-sm text-foreground",
          "shadow-[0_8px_22px_-22px_hsl(var(--foreground)/0.95)] transition-all duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
          "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3 top-3.5 origin-left text-sm text-muted-foreground transition-all duration-150 peer-placeholder-shown:top-3.5 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:scale-75"
      >
        {label}
      </label>
    </div>
  )
);
FloatingInput.displayName = "FloatingInput";

export { Input, FloatingInput };
