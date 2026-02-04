import {
	Brain,
	ChevronsUpDown,
	Database,
	PaletteIcon,
	Settings,
} from "lucide-react";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import {
	AppearanceSettings,
	ModelSettings,
	StorageSettings,
} from "@/components/settingsContent";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandSeparator,
} from "@/components/ui/command";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ThemeProvider } from "@/providers/themeProvider";
import { useUIStore } from "@/stores/uiStore";

export default function Layout() {
	const {
		settingsOpen,
		setSettingsOpen,
		activeSettingsContent,
		setActiveSettingsContent,
		modelModalOpen,
		setModelModalOpen,
		models,
		modelIsLoading,
		loadModels,
		selectedModels,
		setSelectedModels,
	} = useUIStore();

	useEffect(() => {
		loadModels();
	}, [loadModels]);

	return (
		<ThemeProvider>
			<div className="flex w-screen h-screen bg-(--bg) p-2 overflow-auto">
				<Sidebar />
				<main className="w-full h-full bg-(--fg) rounded-2xl">
					<header className="flex w-full h-[5%] bg-(--fg-elevated) rounded-2xl text-(--text)">
						<Button onClick={() => setModelModalOpen(true)}>
							Models
							<ChevronsUpDown />
						</Button>
						<Button onClick={() => setSettingsOpen(true)}>
							<Settings />
						</Button>
					</header>
					<Outlet />
				</main>
			</div>

			<CommandDialog open={modelModalOpen} onOpenChange={setModelModalOpen}>
				<Command>
					<CommandInput placeholder="Search models..." />
					<CommandEmpty>No models found.</CommandEmpty>
					<CommandGroup heading="Ollama">
						{models.map((m) => (
							<CommandItem key={m.name}>
								<Checkbox />
								{m.name}
							</CommandItem>
						))}
					</CommandGroup>
					<CommandSeparator />

					<CommandGroup heading="Anthropic">
						<CommandItem>Coming soon...</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="OpenAI">
						<CommandItem>Coming soon...</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="xAI">
						<CommandItem>Coming soon...</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Gemini">
						<CommandItem>Coming soon...</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Qwen">
						<CommandItem>Coming soon...</CommandItem>
					</CommandGroup>
				</Command>
			</CommandDialog>

			<Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
				<DialogContent className="flex">
					<DialogHeader className="hidden">
						<DialogTitle>Settings</DialogTitle>
						<DialogDescription>
							Settings for storage, models, theme
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col h-full w-[20%] border-r border-gray-400/50">
						<Button
							onClick={() => setActiveSettingsContent("storage")}
							className="flex items-center justify-start text-lg"
						>
							<Database /> Storage
						</Button>
						<Button
							onClick={() => setActiveSettingsContent("models")}
							className="flex items-center justify-start text-lg"
						>
							<Brain /> Models
						</Button>
						<Button
							onClick={() => setActiveSettingsContent("appearance")}
							className="flex items-center justify-start text-lg"
						>
							<PaletteIcon /> Appearance
						</Button>
					</div>

					<div className="flex flex-col h-full w-[80%] text-(--text)">
						{(() => {
							switch (activeSettingsContent) {
								case "storage":
									return <StorageSettings />;
								case "models":
									return <ModelSettings />;
								case "appearance":
									return <AppearanceSettings />;
								default:
									return null;
							}
						})()}
					</div>
				</DialogContent>
			</Dialog>
		</ThemeProvider>
	);
}
