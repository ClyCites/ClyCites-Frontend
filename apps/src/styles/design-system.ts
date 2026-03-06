export type ThemeMode = "light" | "dark";

type Scale = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

interface ThemePalette {
  primary: string;
  accent: string;
  success: string;
  warning: string;
  destructive: string;
  neutral: Record<Scale, string>;
  semantic: {
    background: string;
    foreground: string;
    cardBg: string;
    elevatedBg: string;
    border: string;
    mutedText: string;
    hoverBg: string;
  };
}

interface DesignSystem {
  light: ThemePalette;
  dark: ThemePalette;
  radius: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  shadow: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  motion: {
    fast: string;
    normal: string;
    slow: string;
    ease: string;
    easeEmphasized: string;
  };
}

export const designSystem: DesignSystem = {
  light: {
    primary: "146 58% 34%",
    accent: "189 83% 39%",
    success: "145 61% 38%",
    warning: "35 93% 53%",
    destructive: "0 72% 46%",
    neutral: {
      50: "156 28% 98%",
      100: "150 22% 96%",
      200: "149 16% 91%",
      300: "152 14% 82%",
      400: "154 12% 68%",
      500: "156 13% 52%",
      600: "159 18% 38%",
      700: "162 26% 28%",
      800: "165 34% 20%",
      900: "168 42% 14%",
      950: "171 52% 10%",
    },
    semantic: {
      background: "154 32% 97%",
      foreground: "168 43% 12%",
      cardBg: "0 0% 100%",
      elevatedBg: "150 28% 98%",
      border: "153 16% 83%",
      mutedText: "161 12% 39%",
      hoverBg: "150 24% 92%",
    },
  },
  dark: {
    primary: "145 52% 52%",
    accent: "190 90% 61%",
    success: "146 62% 58%",
    warning: "38 95% 60%",
    destructive: "0 84% 65%",
    neutral: {
      50: "168 15% 95%",
      100: "168 12% 89%",
      200: "168 10% 79%",
      300: "167 9% 67%",
      400: "166 8% 53%",
      500: "166 9% 42%",
      600: "165 10% 31%",
      700: "165 11% 23%",
      800: "165 13% 18%",
      900: "166 16% 14%",
      950: "167 22% 8%",
    },
    semantic: {
      background: "165 18% 11%",
      foreground: "158 24% 93%",
      cardBg: "165 16% 14%",
      elevatedBg: "166 16% 17%",
      border: "164 12% 28%",
      mutedText: "161 9% 66%",
      hoverBg: "165 12% 22%",
    },
  },
  radius: {
    xs: "0.5rem",
    sm: "0.625rem",
    md: "0.875rem",
    lg: "1rem",
    xl: "1.25rem",
    full: "999px",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    xxl: "2rem",
  },
  shadow: {
    sm: "0 6px 20px -16px hsl(168 36% 12% / 0.3)",
    md: "0 16px 38px -24px hsl(168 36% 10% / 0.34)",
    lg: "0 24px 48px -28px hsl(168 38% 10% / 0.42)",
    xl: "0 34px 66px -34px hsl(168 42% 8% / 0.5)",
  },
  motion: {
    fast: "150ms",
    normal: "220ms",
    slow: "300ms",
    ease: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    easeEmphasized: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
};

function paletteToVars(palette: ThemePalette): Record<string, string> {
  const entries: Record<string, string> = {
    "--primary": palette.primary,
    "--accent": palette.accent,
    "--success": palette.success,
    "--warning": palette.warning,
    "--destructive": palette.destructive,
    "--background": palette.semantic.background,
    "--foreground": palette.semantic.foreground,
    "--card": palette.semantic.cardBg,
    "--card-foreground": palette.semantic.foreground,
    "--popover": palette.semantic.cardBg,
    "--popover-foreground": palette.semantic.foreground,
    "--border": palette.semantic.border,
    "--input": palette.semantic.border,
    "--ring": palette.primary,
    "--muted": palette.semantic.elevatedBg,
    "--muted-foreground": palette.semantic.mutedText,
    "--accent-foreground": palette.semantic.foreground,
    "--primary-foreground": palette.neutral[50],
    "--secondary": palette.neutral[700],
    "--secondary-foreground": palette.neutral[50],
    "--destructive-foreground": palette.neutral[50],
    "--warning-foreground": palette.neutral[900],
    "--card-bg": palette.semantic.cardBg,
    "--elevated-bg": palette.semantic.elevatedBg,
    "--hover-bg": palette.semantic.hoverBg,
    "--muted-text": palette.semantic.mutedText,
  };

  const neutralScale: Scale[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  neutralScale.forEach((key) => {
    entries[`--neutral-${key}`] = palette.neutral[key];
  });

  return entries;
}

function staticVars(): Record<string, string> {
  return {
    "--radius-xs": designSystem.radius.xs,
    "--radius-sm": designSystem.radius.sm,
    "--radius-md": designSystem.radius.md,
    "--radius-lg": designSystem.radius.lg,
    "--radius-xl": designSystem.radius.xl,
    "--radius-full": designSystem.radius.full,
    "--space-xs": designSystem.spacing.xs,
    "--space-sm": designSystem.spacing.sm,
    "--space-md": designSystem.spacing.md,
    "--space-lg": designSystem.spacing.lg,
    "--space-xl": designSystem.spacing.xl,
    "--space-2xl": designSystem.spacing.xxl,
    "--shadow-sm": designSystem.shadow.sm,
    "--shadow-md": designSystem.shadow.md,
    "--shadow-lg": designSystem.shadow.lg,
    "--shadow-xl": designSystem.shadow.xl,
    "--duration-fast": designSystem.motion.fast,
    "--duration-normal": designSystem.motion.normal,
    "--duration-slow": designSystem.motion.slow,
    "--ease-standard": designSystem.motion.ease,
    "--ease-emphasized": designSystem.motion.easeEmphasized,
    "--radius": designSystem.radius.lg,
  };
}

function toCssBlock(selector: string, vars: Record<string, string>): string {
  const declarations = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");
  return `${selector} {\n${declarations}\n}`;
}

export function createDesignSystemCss(): string {
  const lightVars = { ...staticVars(), ...paletteToVars(designSystem.light) };
  const darkVars = paletteToVars(designSystem.dark);

  return [
    toCssBlock(":root", lightVars),
    toCssBlock(":root.dark", darkVars),
    toCssBlock(":root.light", lightVars),
    `@media (prefers-color-scheme: dark) {\n${toCssBlock(":root:not(.light)", darkVars)}\n}`,
  ].join("\n\n");
}

export const chartSeriesPalette = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--neutral-400))",
];
