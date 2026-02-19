import { Check } from "lucide-react";
import { OrderStatus } from "@/lib/api/types/order.types";
import { cn } from "@/lib/utils";

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "pending",           label: "Order Placed" },
  { status: "confirmed",         label: "Confirmed" },
  { status: "processing",        label: "Processing" },
  { status: "shipped",           label: "Shipped" },
  { status: "delivered",         label: "Delivered" },
  { status: "completed",         label: "Completed" },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
  pending:    0,
  confirmed:  1,
  processing: 2,
  shipped:    3,
  delivered:  4,
  completed:  5,
  cancelled: -1,
};

interface OrderStatusStepperProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusStepper({ status, className }: OrderStatusStepperProps) {
  if (status === "cancelled") {
    return (
      <div className={cn("rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center", className)}>
        <p className="text-sm font-medium text-destructive">Order Cancelled</p>
      </div>
    );
  }

  const currentIdx = STATUS_INDEX[status] ?? 0;

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop horizontal stepper */}
      <div className="hidden sm:flex items-start justify-between w-full">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent   = idx === currentIdx;

          return (
            <div key={step.status} className="flex-1 flex flex-col items-center relative">
              {/* Connector line */}
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    "absolute top-4 left-1/2 w-full h-0.5 -translate-y-1/2",
                    isCompleted ? "bg-primary" : "bg-border"
                  )}
                />
              )}

              {/* Circle */}
              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                  isCompleted ? "bg-primary border-primary text-primary-foreground" :
                  isCurrent   ? "bg-background border-primary text-primary" :
                                "bg-background border-border text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "mt-2 text-center text-xs px-1 leading-tight",
                  isCurrent ? "font-semibold text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile vertical stepper */}
      <ol className="sm:hidden relative space-y-4">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent   = idx === currentIdx;

          return (
            <li key={step.status} className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold",
                  isCompleted ? "bg-primary border-primary text-primary-foreground" :
                  isCurrent   ? "border-primary text-primary" :
                                "border-border text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : idx + 1}
              </div>
              <span className={cn("text-sm", isCurrent ? "font-semibold text-foreground" : "text-muted-foreground")}>
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
