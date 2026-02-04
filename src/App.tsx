import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chat from "@/components/chat";
import ChatView from "@/components/chat-view";
import Layout from "@/layout";
import { useChatStore } from "@/stores/chatStore";

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
