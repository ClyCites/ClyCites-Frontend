"use client";

import { useEffect, useState } from "react";

export type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "clycites.theme";

function resolveSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getStoredThemePreference(): ThemePreference {
  if (typeof window === "undefined") {
    return "system";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }

  return "system";
}

export function applyThemePreference(preference: ThemePreference) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  const theme = preference === "system" ? resolveSystemTheme() : preference;

  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

export function initializeTheme() {
  const preference = getStoredThemePreference();
  applyThemePreference(preference);
}

export function useThemePreference() {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    if (typeof window === "undefined") {
      return "system";
    }
    return getStoredThemePreference();
  });

  useEffect(() => {
    applyThemePreference(getStoredThemePreference());

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      const latest = getStoredThemePreference();
      if (latest === "system") {
        applyThemePreference("system");
      }
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const updatePreference = (next: ThemePreference) => {
    setPreference(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    applyThemePreference(next);
  };

  return {
    preference,
    updatePreference,
    resolvedTheme: preference === "system" ? resolveSystemTheme() : preference,
  };
}
