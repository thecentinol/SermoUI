import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme =
	| "default"
	| "tokyo-night"
	| "nord"
	| "oceanic-depth"
	| "void"
	| "solarized";

type SettingsContentType = "storage" | "model" | "appearance";

export interface UIStore {
	sidebarCollapsed: boolean;
	toggleSidebar: () => void;

	activeSettingsContent: SettingsContentType;
	setActiveSettingsContent: (content: SettingsContentType) => void;
	settingsOpen: boolean;
	setSettingsOpen: (open: boolean) => void;

	currentTheme: Theme;
	setTheme: (theme: Theme) => void;
}

const defaultActiveSettingsContent: SettingsContentType = "storage";
const defaultTheme: Theme = "default";

export const useUIStore = create<UIStore>()(
	persist(
		(set) => ({
			sidebarCollapsed: false,
			toggleSidebar: () =>
				set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

			activeSettingsContent: defaultActiveSettingsContent,
			setActiveSettingsContent: (content) =>
				set({ activeSettingsContent: content }),

			settingsOpen: false,
			setSettingsOpen: (open) => set({ settingsOpen: open }),

			currentTheme: defaultTheme,
			setTheme: (theme) => set({ currentTheme: theme }),
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
