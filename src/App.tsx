// import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Chat from "@/components/chat";
import ChatView from "@/components/chat-view";
import Sidebar from "@/components/sidebar";

function App() {
	return (
		<div className="flex w-screen h-screen bg-(--bg) p-2">
			<Sidebar />
			<main className="w-full h-full bg-(--fg) rounded-2xl overflow-y-auto">
				<Routes>
					<Route path="/" element={<Chat />} />
					<Route path="/:chatId" element={<ChatView />} />
				</Routes>
			</main>
		</div>
	);
}

export default App;
