import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendChatMessage } from "../services/OllamaApi";

export interface Chat {
	id: string;
	title: string;
	messages: Message[];
	createdAt: number;
	updatedAt: number;
}

export interface Message {
	id: string;
	chatId: string;
	role: "user" | "assistant";
	model: string;
	content: string;
	timestamp: number;
}

export function useChats() {
	const [chats, setChats] = useState<Chat[]>([]);
	const [currChatId, setCurrChatId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const STORAGE_KEY = "ollama-chats";
	const navigate = useNavigate();

	function loadChats(): Chat[] {
		const data = localStorage.getItem(STORAGE_KEY);
		return data ? JSON.parse(data) : [];
	}

	function saveChats(chats: Chat[]) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
	}

	useEffect(() => {
		const chats = loadChats();
		setChats(chats);
	}, []);

	useEffect(() => {
		saveChats(chats);
	}, [chats]);

	const sendMessage = async (
		chatId: string | null,
		model: string,
		content: string,
	) => {
		console.log("sendMessage called with:", { chatId, model, content });
		setIsLoading(true);
		let actualChatId = chatId;
		let currChat: Chat | undefined;

		if (!actualChatId) {
			const newChat: Chat = {
				id: crypto.randomUUID(),
				title: "New Chat",
				messages: [],
				createdAt: Date.now(),
				updatedAt: Date.now(),
			};

			setChats((prev) => [...prev, newChat]);
			actualChatId = newChat.id;
			currChat = newChat;
			navigate(`/chat/${actualChatId}`);
		} else {
			currChat = chats.find((c) => c.id === actualChatId);
			if (!currChat) {
				console.error("ERR: Chat not found!");
				setIsLoading(false);
				console.log("FFound chat:", currChat);
				return;
			}
		}

		const userMsg: Message = {
			id: crypto.randomUUID(),
			chatId: actualChatId,
			role: "user",
			model,
			content,
			timestamp: Date.now(),
		};
		setChats((prevChats) =>
			prevChats.map((chat) =>
				chat.id === chatId
					? {
							...chat,
							messages: [...chat.messages, userMsg],
							updatedAt: Date.now(),
						}
					: chat,
			),
		);

		const OllamaMsgs = [...currChat.messages, userMsg].map((m) => ({
			role: m.role,
			content: m.content,
		}));

		const assistantMsg: Message = {
			id: crypto.randomUUID(),
			chatId: actualChatId,
			role: "assistant",
			model,
			content: "",
			timestamp: Date.now(),
		};

		const updatedMsgs = [...currChat.messages, userMsg];

		setChats((prevChats) =>
			prevChats.map((chat) =>
				chat.id === chatId
					? {
							...chat,
							messages: updatedMsgs,
							updatedAt: Date.now(),
						}
					: chat,
			),
		);

		try {
			let fullContent = "";
			console.log("About to call sendChatMessage API...");
			await sendChatMessage(model, OllamaMsgs, (chunk) => {
				console.log("Recieved chunk:", chunk);
				fullContent += chunk.message.content;

				setChats((prevChats) =>
					prevChats.map((chat) =>
						chat.id === chatId
							? {
									...chat,
									messages: chat.messages.map((msg) =>
										msg.id === assistantMsg.id
											? { ...msg, content: fullContent }
											: msg,
									),
									updatedAt: Date.now(),
								}
							: chat,
					),
				);
			});
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
			console.log("Msg sent");
		}
	};

	return {
		chats,
		currChatId,
		isLoading,
		loadChats,
		saveChats,
		sendMessage,
	};
}
