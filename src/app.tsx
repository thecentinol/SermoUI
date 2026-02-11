import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chat from "@/features/chat/components/chat";
import ChatView from "@/features/chat/components/chat-view";
import { useChatStore } from "@/features/chat/store/chatStore";
import Layout from "@/layout/main-layout";

function App() {
	const { isLoading } = useChatStore();

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Chat disabled={isLoading} />}></Route>
					<Route path="/chat/:chatId" element={<ChatView />}></Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
