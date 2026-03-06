"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 4000;

type ToastVariant = "default" | "destructive" | "success";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

type ToastAction =
  | { type: "ADD"; toast: Toast }
  | { type: "REMOVE"; id: string }
  | { type: "DISMISS"; id: string };

interface ToastState {
  toasts: Toast[];
}

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case "ADD":
      return { toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };
    case "REMOVE":
      return { toasts: state.toasts.filter((t) => t.id !== action.id) };
    case "DISMISS":
      return { toasts: state.toasts.filter((t) => t.id !== action.id) };
    default:
      return state;
  }
};

const listeners: Array<React.Dispatch<ToastAction>> = [];
let memoryState: ToastState = { toasts: [] };

function dispatchToast(action: ToastAction) {
  memoryState = toastReducer(memoryState, action);
  listeners.forEach((l) => l(action));
}

let idCounter = 0;
function genId() {
  idCounter = (idCounter + 1) % Number.MAX_SAFE_INTEGER;
  return String(idCounter);
}

export function toast(props: Omit<Toast, "id">) {
  const id = genId();
  const duration = props.duration ?? TOAST_REMOVE_DELAY;
  dispatchToast({ type: "ADD", toast: { ...props, id } });
  setTimeout(() => dispatchToast({ type: "REMOVE", id }), duration);
  return id;
}

export function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState);

  React.useEffect(() => {
    const listener: React.Dispatch<ToastAction> = () => {
      setState({ ...memoryState });
    };
    listeners.push(listener);
    return () => {
      const idx = listeners.indexOf(listener);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  return {
    toasts: state.toasts,
    toast,
    dismiss: (id: string) => dispatchToast({ type: "REMOVE", id }),
  };
}

// ─── Visual Toast Component ───────────────────────────────────────────────────

interface ToastItemProps extends Toast {
  onDismiss: (id: string) => void;
}

const variantStyles: Record<ToastVariant, string> = {
  default: "border border-border/70 bg-card/95 text-foreground",
  destructive: "border border-destructive/70 bg-destructive/12 text-destructive",
  success: "border border-success/35 bg-success/12 text-success",
};

export function ToastItem({ id, title, description, variant = "default", onDismiss }: ToastItemProps) {
  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full items-start gap-3 rounded-2xl p-4 shadow-[var(--shadow-lg)] backdrop-blur-sm transition-all",
        variantStyles[variant]
      )}
    >
      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-semibold">{title}</p>}
        {description && <p className="text-sm opacity-80 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="shrink-0 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Dismiss"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
