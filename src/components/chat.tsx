import { ArrowUp } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chatStore";

export default function Chat() {
	const { sendMsg, isLoading } = useChatStore();
	const navigate = useNavigate();

	const handleSendMsg = async (content: string) => {
		const newChatId = await sendMsg(null, content);
		if (newChatId) {
			navigate(`/chat/${newChatId}`);
		}
	};

	return (
		<div className="flex flex-1 text-(--text)">
			<div className="flex-1 flex justify-center items-center">
				<div className="flex flex-col h-screen w-[50vw] relative">
					<a className="text-6xl w-full font-extrabold absolute top-[30%] left-1/2 -translate-x-1/2 text-center">
						Send message or gay
					</a>
					<Input disabled={isLoading} onSend={handleSendMsg} />
				</div>
			</div>
		</div>
	);
}

function Input({
	onSend,
	disabled,
}: {
	onSend: (message: string) => void;
	disabled?: boolean;
}) {
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

	const handleSubmit = () => {
		if (message.trim() && !disabled) {
			onSend(message);
			setMessage("");
			setTimeout(adjustHeight, 0);
		}
	};

	return (
		<div
			className="flex items-center justify-between mx-auto my-auto m-4 w-full px-4 bg-(--fg-elevated)"
			style={{ borderRadius: "0.8rem" }}
		>
			<textarea
				ref={textareaRef}
				value={message}
				disabled={disabled}
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
						handleSubmit();
					}
				}}
			/>
			<Button
				className="bg-white rounded-2xl"
				onClick={handleSubmit}
				disabled={disabled || !message.trim()}
			>
				<ArrowUp className="text-black" />
			</Button>
		</div>
	);
}
