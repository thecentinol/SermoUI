import { Ellipsis, PlusIcon, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chatStore";

export default function Sidebar() {
	const { chats } = useChatStore();
	const navigate = useNavigate();

	return (
		<div className="flex flex-col h-full w-[20%] bg-(--bg) text-(--text) pl-2 pr-3">
			<h1 className="h-[5%]">SermoUI</h1>
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
							className="flex items-center justify-between px-4 py-2"
						>
							{c.title || "New Chat"}
							<Ellipsis className="cursor-pointer" />
						</Button>
					))}
				</div>
			</div>

			<div className="h-[10%] border-t border-gray-500 flex items-center justify-end cursor-pointer">
				<Settings />
			</div>
		</div>
	);
}
