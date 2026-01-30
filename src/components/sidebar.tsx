import {
	Brain,
	Database,
	Ellipsis,
	PaletteIcon,
	PlusIcon,
	Settings,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	AppearanceSettings,
	ModelSettings,
	StorageSettings,
} from "@/components/settingsContent";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatStore } from "@/stores/chatStore";
import { useUIStore } from "@/stores/uiStore";

export default function Sidebar() {
	const { chats, deleteChat, renameChat } = useChatStore();
	const navigate = useNavigate();
	const {
		settingsOpen,
		setSettingsOpen,
		activeSettingsContent,
		setActiveSettingsContent,
	} = useUIStore();

	const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
	const [draftTitle, setDraftTitle] = useState("");

	return (
		<div className="flex flex-col h-full w-[20%] bg-(--bg) text-(--text) pl-2 pr-3">
			<h1 className="flex items-center justify-start gap-2 mb-3 min-h-[5%]">
				<img src="/logo.svg" alt="logo" width={35} height={35} />
				SermoUI
			</h1>
			<div className="h-[12%]">
				<p className="text-(--text-muted) pl-1">Actions</p>
				<Button
					onClick={() => navigate("/")}
					className="justify-start w-full p-1"
				>
					<PlusIcon />
					New Chat
				</Button>
			</div>

			<div className="h-full">
				<p className="text-(--text-muted) pl-1">Chats</p>
				<div className="overflow-y-auto">
					{chats.map((c) => (
						<Button
							key={c.id}
							onClick={() => navigate(`/chat/${c.id}`)}
							className="flex items-center justify-between w-full px-4 py-2"
						>
							{renamingChatId === c.id ? (
								<input
									autoFocus
									value={draftTitle}
									onChange={(e) => setDraftTitle(e.target.value)}
									onBlur={() => {
										renameChat(c.id, draftTitle.trim());
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											renameChat(c.id, draftTitle.trim());
											setRenamingChatId(null);
										}
										if (e.key === "Escape") {
											setRenamingChatId(null);
										}
									}}
									className="w-full outline-1"
								/>
							) : (
								<span>{c.title || "New Chat"}</span>
							)}

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<span onClick={(e) => e.stopPropagation}>
										<Ellipsis className="cursor-pointer" />
									</span>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem
										onClick={(e) => {
											e.stopPropagation();
											setRenamingChatId(c.id);
											setDraftTitle(c.title || "New chat");
										}}
									>
										Rename
									</DropdownMenuItem>
									<DropdownMenuItem
										className="focus:bg-red-500"
										onClick={() => deleteChat(c.id)}
									>
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</Button>
					))}
				</div>
			</div>

			{/* SETTINGS */}
			<div className="h-[10%] border-t border-gray-500 flex items-center justify-end cursor-pointer">
				<Settings onClick={() => setSettingsOpen(true)} />

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
			</div>
		</div>
	);
}
