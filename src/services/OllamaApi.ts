import type { OllamaModels } from "@/stores/uiStore";

const BASE_URL = "http://localhost:11434/api";

interface OllamaMessage {
	role: "user" | "assistant" | "system";
	content: string;
}

// interface ChatRequest {
// 	model: string;
// 	messages: OllamaMessage[];
// 	stream?: boolean;
// }

interface ChatResponse {
	model: string;
	created_at: string;
	message: {
		role: string;
		content: string;
	};
	done: boolean;
}

interface OllamaTagsResponse {
	models: OllamaModels[];
}

export async function sendChatMessage(
	model: string,
	messages: OllamaMessage[],
	onChunk: (chunk: ChatResponse) => void,
): Promise<void> {
	const res = await fetch(BASE_URL + "/chat", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model,
			messages,
		}),
	});

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(`Ollama API error: ${res.status} - ${errorText}`);
	}

	const reader = res.body?.getReader();
	if (!reader) {
		throw new Error("No response body");
	}
	const decoder = new TextDecoder();
	let buffer = "";

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		buffer += decoder.decode(value);
		const lines = buffer.split("\n");
		buffer = lines.pop() || "";

		for (const line of lines) {
			if (line.trim()) {
				const parsed = JSON.parse(line);
				onChunk(parsed);
			}
		}
	}
}

export async function fetchModels() {
	const res = await fetch(BASE_URL + "/tags");

	if (!res.ok) {
		throw new Error("Failed to fetch Ollama models");
	}

	const data: OllamaTagsResponse = await res.json();
	return data.models;
}

export async function fetchRunningModels(): Promise<Set<string>> {
	const res = await fetch(BASE_URL + "/ps");
	if (!res.ok) throw new Error("Failed to fetch running models");

	const data = await res.json();
	return new Set(data.models.map((m: { name: string }) => m.name));
}
