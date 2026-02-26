"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "clycites_data_saver";

interface DataSaverContextValue {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  toggle: () => void;
  pollingIntervalMs: number;
}

const DataSaverContext = createContext<DataSaverContextValue | null>(null);

function readStoredPreference(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "1";
}

export function DataSaverProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState<boolean>(() => readStoredPreference());

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      window.dispatchEvent(new CustomEvent("clycites:data-saver-change", { detail: next }));
    }
  }, []);

  const toggle = useCallback(() => setEnabled(!enabled), [enabled, setEnabled]);

  const value = useMemo<DataSaverContextValue>(
    () => ({
      enabled,
      setEnabled,
      toggle,
      pollingIntervalMs: enabled ? 120_000 : 30_000,
    }),
    [enabled, setEnabled, toggle]
  );

  return <DataSaverContext.Provider value={value}>{children}</DataSaverContext.Provider>;
}

export function useDataSaver(): DataSaverContextValue {
  const ctx = useContext(DataSaverContext);
  if (!ctx) throw new Error("useDataSaver must be used inside <DataSaverProvider>");
  return ctx;
}

export function isDataSaverEnabled(): boolean {
  return readStoredPreference();
}
