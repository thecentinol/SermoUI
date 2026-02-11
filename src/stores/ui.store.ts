import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
	fetchModels,
	fetchRunningModels,
} from "@/features/chat/api/api.ollama";

export type Theme =
	| "default"
	| "tokyo-night"
	| "nord"
	| "oceanic-depth"
	| "void"
	| "solarized";

type SettingsContentType = "storage" | "models" | "appearance";

type ModelStatus = "running" | "stopped";

export interface OllamaModels {
	name: string;
	modified_at: string;
	size: number;
	digest: string;
	details: {
		format: string;
		family: string;
		families: string[];
		parameter_size: string;
		quantization_level: string;
	};
}

interface OllamaModelWithStatus extends OllamaModels {
	status: ModelStatus;
}

export interface UIStore {
	sidebarCollapsed: boolean;
	toggleSidebar: () => void;

	activeSettingsContent: SettingsContentType;
	setActiveSettingsContent: (content: SettingsContentType) => void;
	settingsOpen: boolean;
	setSettingsOpen: (open: boolean) => void;

	currentTheme: Theme;
	setTheme: (theme: Theme) => void;

	models: OllamaModelWithStatus[];
	modelIsLoading: boolean;
	loadModels: () => void;
	selectedModels: string[] | null;
	setSelectedModels: (models: string[] | null) => void;
	modelModalOpen: boolean;
	setModelModalOpen: (open: boolean) => void;
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

			models: [],
			modelIsLoading: false,
			selectedModels: null,
			setSelectedModels: (models) => set({ selectedModels: models }),
			modelModalOpen: false,
			setModelModalOpen: (open) => set({ modelModalOpen: open }),

			loadModels: async () => {
				set({ modelIsLoading: true });

				try {
					const [installed, running] = await Promise.all([
						fetchModels(),
						fetchRunningModels(),
					]);

					const modelStatus: OllamaModelWithStatus[] = installed.map((m) => ({
						...m,
						status: running.has(m.name) ? "running" : "stopped",
					}));
					set({ models: modelStatus });
				} finally {
					set({ modelIsLoading: false });
				}
			},
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
