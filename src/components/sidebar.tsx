import { Ellipsis, PlusIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
	return (
		<div className="flex flex-col h-full w-[20%] bg-(--bg) text-(--text) pl-2 pr-3">
			<h1 className="h-[5%]">SermoUI</h1>
			<div className="h-[12%]">
				<p className="text-(--text-muted) pl-1">Actions</p>
				<Button className="justify-start w-full rounded-md hover:bg-(--fg-elevated) cursor-pointer p-1">
					<PlusIcon />
					New Chat
				</Button>
			</div>

			<div className="h-full">
				<p className="text-(--text-muted) pl-1">Chats</p>
				<div className="overflow-y-auto">
					<p className="flex items-center justify-between hover:bg-(--fg-hover) pl-4 py-2 rounded-md">
						Example
						<Ellipsis className="cursor-pointer" />
					</p>
				</div>
			</div>

			<div className="h-[10%] border-t border-gray-500 flex items-center justify-end cursor-pointer">
				<Settings />
			</div>
		</div>
	);
}
