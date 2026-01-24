import { useEffect, useState } from "react";
import { sendChatMessage } from "../services/OllamaApi";

const BASE_URL = "http://localhost:11434/api";

export interface Chat {
	id: number;
	title: string;
	messages: Message[];
	createdAt: number;
	updatedAt: number;
}

export interface Message {
	id: number;
	chatId: Chat["id"];
	role: "user" | "assistant";
	model: string;
	content: string;
	timestamp: number;
}

export function useChats() {
	const [chats, setChats] = useState<Chat[]>([]);
	const [currChatId, setCurrChatId] = useState<number | null>(null);
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
			id: Date.now(),
			title: "New Chat",
			messages: [],
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};
		setChats([...chats, newChat]);
		setCurrChatId(newChat.id);
	};

	return {
		chats,
		currChatId,
		isLoading,
	};
}
