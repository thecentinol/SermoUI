import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type Theme, useUIStore } from "@/stores/uiStore";

export function StorageSettings() {
	return <div>Storage settings</div>;
}

export function ModelSettings() {
	return (
		<div>
			<h1>Ollama</h1>
		</div>
	);
}

export function AppearanceSettings() {
	const { currentTheme, setTheme } = useUIStore();

	return (
		<div>
			<h1>Theme</h1>
			<Select
				value={currentTheme}
				onValueChange={(val: Theme) => setTheme(val)}
			>
				<SelectTrigger>
					<SelectValue placeholder="Select theme" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="default">Default</SelectItem>
					<SelectItem value="tokyo-night">Tokyo night</SelectItem>
					<SelectItem value="nord">Nord</SelectItem>
					<SelectItem value="oceanic-depth">Oceanic depth</SelectItem>
					<SelectItem value="void">Void</SelectItem>
					<SelectItem value="solarized">Solarized</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
