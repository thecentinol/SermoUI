import { useEffect } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type Theme, useUIStore } from "@/stores/uiStore";

export function StorageSettings() {
	return (
		<div className="flex flex-col items-center justify-center py-6 overflow-y-auto">
			<div className="flex items-center justify-between w-[80%]">
				<h1 className="font-bold text-xl">Storage type</h1>
				<Select>
					<SelectTrigger>
						<SelectValue placeholder="Select storage" />
					</SelectTrigger>
					<SelectContent className="bg-(--fg)" position="popper">
						<SelectItem value="localStorage">localStorage</SelectItem>
						<SelectItem value="postgresql">PostgreSQL</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}

export function ModelSettings() {
	const { models, modelIsLoading, loadModels } = useUIStore();

	useEffect(() => {
		loadModels();
	}, [loadModels]);

	return (
		<div className="flex flex-col items-center justify-center py-6 overflow-y-auto">
			<div className="w-[80%]">
				<h1 className="text-(--text) text-2xl font-bold mb-2">Ollama</h1>
				<table className="w-full text-left bg-(--fg) rounded-2xl p-2">
					<thead>
						<tr>
							<th>Model</th>
							<th>Size</th>
							<th>Last Mod</th>
							<th>Param</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{modelIsLoading ? (
							<tr>
								<td colSpan={5} className="text-(--text)">
									Loading models...
								</td>
							</tr>
						) : (
							models.map((m) => (
								<tr key={m.name}>
									<td>{m.name}</td>
									<td>{(m.size / 1024 / 1024 / 1024).toFixed(2)}</td>
									<td>{new Date(m.modified_at).toLocaleDateString()}</td>
									<td>{m.details.parameter_size}</td>
									<td>
										<p
											className={`w-fit px-2 rounded-full
												${m.status === "running" ? "bg-green-500/50" : "bg-red-500/50"}
											`}
										>
											{m.status}
										</p>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
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
