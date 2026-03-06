import type { Transition, Variants } from "framer-motion";

export const motionDuration = {
  fast: 0.15,
  normal: 0.22,
  slow: 0.3,
} as const;

export const motionEase = {
  standard: [0.2, 0.8, 0.2, 1],
  emphasized: [0.16, 1, 0.3, 1],
} as const;

function transition(duration: keyof typeof motionDuration = "normal", reducedMotion = false): Transition {
  if (reducedMotion) {
    return { duration: 0 };
  }

  return {
    duration: motionDuration[duration],
    ease: motionEase.standard,
  };
}

export function fadeIn(reducedMotion = false): Variants {
  return {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: transition("normal", reducedMotion) },
    exit: { opacity: 0, transition: transition("fast", reducedMotion) },
  };
}

export function slideUp(reducedMotion = false, offset = 14): Variants {
  return {
    hidden: { opacity: 0, y: reducedMotion ? 0 : offset },
    show: {
      opacity: 1,
      y: 0,
      transition: transition("normal", reducedMotion),
    },
    exit: {
      opacity: 0,
      y: reducedMotion ? 0 : -offset / 2,
      transition: transition("fast", reducedMotion),
    },
  };
}

export function slideInRight(reducedMotion = false, offset = 24): Variants {
  return {
    hidden: { opacity: 0, x: reducedMotion ? 0 : offset },
    show: {
      opacity: 1,
      x: 0,
      transition: transition("normal", reducedMotion),
    },
    exit: {
      opacity: 0,
      x: reducedMotion ? 0 : offset,
      transition: transition("fast", reducedMotion),
    },
  };
}

export function scaleIn(reducedMotion = false): Variants {
  return {
    hidden: { opacity: 0, scale: reducedMotion ? 1 : 0.97 },
    show: {
      opacity: 1,
      scale: 1,
      transition: transition("normal", reducedMotion),
    },
    exit: {
      opacity: 0,
      scale: reducedMotion ? 1 : 0.98,
      transition: transition("fast", reducedMotion),
    },
  };
}

export function staggerContainer(reducedMotion = false, stagger = 0.06): Variants {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reducedMotion ? 0 : stagger,
        delayChildren: reducedMotion ? 0 : 0.02,
      },
    },
  };
}

export function layoutTransition(reducedMotion = false): Transition {
  if (reducedMotion) {
    return { duration: 0 };
  }

  return {
    duration: motionDuration.normal,
    ease: motionEase.emphasized,
  };
}

export function pressScale(reducedMotion = false): Transition {
  if (reducedMotion) {
    return { duration: 0 };
  }

  return {
    duration: motionDuration.fast,
    ease: motionEase.standard,
  };
}
