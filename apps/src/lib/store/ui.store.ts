"use client";

import { create } from "zustand";

interface UiStoreState {
  workspaceSidebarOpen: boolean;
  notificationsOpen: boolean;
  commandPaletteOpen: boolean;
  setWorkspaceSidebarOpen: (open: boolean) => void;
  toggleWorkspaceSidebar: () => void;
  setNotificationsOpen: (open: boolean) => void;
  toggleNotifications: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
}

export const useUiStore = create<UiStoreState>((set) => ({
  workspaceSidebarOpen: true,
  notificationsOpen: false,
  commandPaletteOpen: false,
  setWorkspaceSidebarOpen: (open) => set({ workspaceSidebarOpen: open }),
  toggleWorkspaceSidebar: () => set((state) => ({ workspaceSidebarOpen: !state.workspaceSidebarOpen })),
  setNotificationsOpen: (open) => set({ notificationsOpen: open }),
  toggleNotifications: () => set((state) => ({ notificationsOpen: !state.notificationsOpen })),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
}));
