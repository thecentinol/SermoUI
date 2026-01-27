import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { sendChatMessage, sendMessage } from "@/services/OllamaApi";

export interface Chat {
	id: string;
	title: string;
	messages: Message[];
	createdAt: number;
	updatedAt: number;
}

export interface Message {
	id: string;
	chatId?: string;
	role: "user" | "assistant";
	model: string;
	content: string;
	timestamp: number;
}

export type Response = {};

interface ChatStore {
	chats: Chat[];
	// messages: Message[];
	isLoading: boolean;
	model: string;
	setModel: (model: string) => void;
	sendChatMsg: (
		chatId: string | null,
		content: string,
	) => Promise<string | void>;
}

export const useChatStore = create<ChatStore>()(
	devtools(
		persist(
			(set, get) => ({
				chats: [],
				isLoading: false,
				model: "llama3.2:1b",
				setModel: (model) => set({ model }),

				sendChatMsg: async (chatId: string | null, content: string) => {
					const { model, chats } = get();
					set({ isLoading: true }, false, "sendMsg/start");

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

						set({ chats: [...chats, newChat] });

						actualChatId = newChat.id;
						currChat = newChat;
					} else {
						currChat = chats.find((c) => c.id === actualChatId);
						if (!currChat) {
							set({ isLoading: false });
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

					const assistantMsg: Message = {
						id: crypto.randomUUID(),
						chatId: actualChatId,
						role: "assistant",
						model,
						content: "",
						timestamp: Date.now(),
					};

					set({
						chats: get().chats.map((chat) =>
							chat.id === actualChatId
								? {
										...chat,
										messages: [...chat.messages, userMsg, assistantMsg],
										updatedAt: Date.now(),
									}
								: chat,
						),
					});

					const ollamaMsgs = [...currChat.messages, userMsg].map((m) => ({
						role: m.role,
						content: m.content,
					}));

					try {
						let fullContent = "";
						await sendChatMessage(model, ollamaMsgs, (chunk) => {
							console.log("Recieved chunk:", chunk);
							fullContent += chunk.message.content;

							set({
								chats: get().chats.map((chat) =>
									chat.id === actualChatId
										? {
												...chat,
												messages: chat.messages.map((msg) =>
													msg.id === assistantMsg.id
														? { ...msg, content: fullContent }
														: msg,
												),
											}
										: chat,
								),
							});
						});
					} catch (err) {
						console.error("ERROR:", err);
					} finally {
						set({ isLoading: false }, false, "sendMsg/end");
					}
					return actualChatId;
				},
			}),
			{ name: "ollama-chats" },
		),
	),
);
