import { ArrowUp } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chatStore";

export default function ChatView({ disabled }: { disabled?: boolean }) {
	const params = useParams();
	const navigate = useNavigate();
	const chatId = params?.chatId;
	const { chats, sendChatMsg, isLoading } = useChatStore();
	const scrollRef = useRef<HTMLDivElement>(null);
	const [message, setMessage] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const currChat = chatId ? chats.find((c) => c.id === chatId) : null;
	const messages = useMemo(() => currChat?.messages || [], [currChat]);

	useEffect(() => {
		if (!currChat && chatId) {
			navigate("/", { replace: true });
		}
	});

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages]);

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
			await sendChatMsg(chatId || null, message);
			setMessage("");
			setTimeout(adjustHeight, 0);
		}
	};

	return (
		<div className="flex flex-1 h-[95%]">
			<div className="flex-1 flex justify-center items-center">
				<div className="flex flex-col h-full w-[50vw]">
					<div
						ref={scrollRef}
						className="flex-1 overflow-y-auto scrollbar-hide p-4 pb-32"
					>
						{messages.map((msg) => (
							<div
								key={msg.id}
								className={`p-3 my-2 rounded-2xl ${
									msg.role === "user"
										? "bg-(--bg) self-end ml-auto text-white max-w-[70%] w-fit"
										: "bg-transparent self-start mr-auto text-gray-200 w-full"
								}`}
								style={{
									minWidth: `${Math.min(msg.content.length * 8, 300)}px`,
								}}
							>
								<div className="markdown-body prose prose-invert">
									<ReactMarkdown remarkPlugins={[remarkGfm]}>
										{msg.content}
									</ReactMarkdown>
								</div>
							</div>
						))}
					</div>

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
