import { ArrowUp } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/features/chat/store/chatStore";

export default function Chat({ disabled }: { disabled: boolean }) {
	const { sendChatMsg, isLoading } = useChatStore();
	const navigate = useNavigate();
	const [message, setMessage] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const adjustHeight = () => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			const contentHeight = textarea.scrollHeight;
			const maxHeight =
				typeof window !== "undefined" ? window.innerHeight * 0.4 : 200;
			textarea.style.height = Math.min(contentHeight, maxHeight) + "px";
		}
	};

	const handleSend = async (message: string) => {
		if (message.trim() && !disabled) {
			const newChatId = await sendChatMsg(null, message);
			if (newChatId) {
				navigate(`/chat/${newChatId}`);
			}
			setMessage("");
			setTimeout(adjustHeight, 0);
		}
	};

	return (
		<div className="flex flex-1 text-(--text) h-[95%]">
			<div className="flex-1 flex justify-center items-center">
				<div className="flex flex-col h-full w-[50vw] gap-4 items-center justify-center text-center">
					<a className="text-6xl w-full font-extrabold">Send message or gay</a>

					<div
						className="flex items-center justify-between m-4 w-full px-4 bg-(--fg-elevated)"
						style={{ borderRadius: "0.8rem" }}
					>
						<textarea
							ref={textareaRef}
							value={message}
							disabled={isLoading}
							onChange={(e) => {
								setMessage(e.target.value);
								adjustHeight();
							}}
							placeholder="Waiting for you to type..."
							className="w-full mt-4 focus:outline-none focus:ring-0 bg-transparent text-white resize-none"
							style={{ borderRadius: "0.8rem" }}
							onKeyDown={async (e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									handleSend(message);
								}
							}}
						/>
						<Button
							className="bg-white rounded-2xl"
							onClick={() => handleSend(message)}
							disabled={disabled || !message.trim()}
						>
							<ArrowUp className="text-black" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
