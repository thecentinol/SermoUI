import { ArrowUp } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chatStore";

export default function ChatView() {
	const params = useParams();
	const chatId = params?.chatId;
	const { chats, sendMsg, isLoading } = useChatStore();
	const scrollRef = useRef<HTMLDivElement>(null);

	const currChat = chatId ? chats.find((c) => c.id === chatId) : null;
	const messages = useMemo(() => currChat?.messages || [], [currChat]);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages]);

	const handleSendMsg = async (content: string) => {
		await sendMsg(chatId || null, content);
	};

	return (
		<div className="flex flex-1">
			<div className="flex-1 flex justify-center items-center">
				<div className="flex flex-col h-screen w-[50vw]">
					<div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
						{messages.map((msg) => (
							<div
								key={msg.id}
								className={`p-3 my-2 rounded-2xl ${
									msg.role === "user"
										? "bg-(--bg) self-end ml-auto text-white max-w-[70%]"
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
						{/* <div className="text-white bg-(--surface) ml-auto w-[7vw] rounded-2xl flex gap-2 p-1"> */}
						{/* 	<Copy className="w-5 h-5 cursor-pointer" /> */}
						{/* 	<Pencil className="w-5 h-5 cursor-pointer" /> */}
						{/* 	<ChevronLeft className="w-5 h-5 cursor-pointer" /> */}
						{/* 	<ChevronRight className="w-5 h-5 cursor-pointer" /> */}
						{/* </div> */}
					</div>
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

	const handleSend = () => {
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
						handleSend();
					}
				}}
			/>
			<Button
				className="bg-white rounded-2xl"
				onClick={handleSend}
				disabled={disabled || !message.trim()}
			>
				<ArrowUp className="text-black" />
			</Button>
		</div>
	);
}
