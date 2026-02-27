"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useToast, ToastItem } from "./use-toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();
  const reducedMotion = useReducedMotion();

  if (!toasts.length) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-4 right-4 z-100 flex w-full max-w-sm flex-col gap-2 pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: reducedMotion ? 0 : 22, scale: reducedMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: reducedMotion ? 0 : 22, scale: reducedMotion ? 1 : 0.98 }}
            transition={{ duration: reducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <ToastItem {...toast} onDismiss={dismiss} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
