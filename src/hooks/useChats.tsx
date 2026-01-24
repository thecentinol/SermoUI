import { useEffect, useState } from "react";
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
	const [isLoading, setisLoading] = useState(false);
	const STORAGE_KEY = "ollama-chats";

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

	const createChat = () => {
		const newChat: Chat = {
			id: crypto.randomUUID(),
			title: "New Chat",
			messages: [],
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};
		setChats([...chats, newChat]);
		return newChat.id;
	};

	const sendMessage = async (
		chatId: string,
		model: string,
		content: string,
	) => {
		if (!chatId) {
			createChat();
		}
		setisLoading(true);

		const userMsg: Message = {
			id: crypto.randomUUID(),
			chatId: currChatId,
			role: "user",
			model: model,
			content: content,
			timestamp: Date.now(),
		};
		setChats([...chats, currChatId]);
	};

	return {
		chats,
		currChatId,
		isLoading,
		loadChats,
		saveChats,
		createChat,
		sendMessage,
	};
}
