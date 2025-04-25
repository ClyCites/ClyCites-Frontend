import * as React from "react";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react"; // Import ReactNode to type children

interface MyThemeProviderProps {
  children: ReactNode; // Explicitly typing children as ReactNode
  // Add other props if needed
}

export function MyThemeProvider({ children }: MyThemeProviderProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
