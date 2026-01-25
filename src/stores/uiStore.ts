import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme =
	| "default"
	| "tokyo-night"
	| "nord"
	| "oceanic-depth"
	| "void"
	| "solarized";

export interface UIStore {
	sidebarCollapsed: boolean;
	settingsModalOpen: boolean;
	currentTheme: Theme;
	setTheme: (theme: Theme) => void;
	toggleSidebar: () => void;
	openSettings: () => void;
	closeSettings: () => void;
}

const defaultTheme: Theme = "default";

export const useUIStore = create<UIStore>()(
	persist(
		(set) => ({
			sidebarCollapsed: false,
			toggleSidebar: () =>
				set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

			currentTheme: defaultTheme,
			setTheme: (theme) => set({ currentTheme: theme }),

			settingsModalOpen: false,
			openSettings: () => set({ settingsModalOpen: true }),
			closeSettings: () => set({ settingsModalOpen: false }),
		}),
		{
			name: "ui-storage",
			partialize: (state) => ({
				currentTheme: state.currentTheme,
				sidebarCollapsed: state.sidebarCollapsed,
			}),
		},
	),
);
