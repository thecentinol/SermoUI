import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chat from "@/components/chat";
import ChatView from "@/components/chat-view";
import Layout from "@/components/layout";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Chat />}></Route>
					<Route path="/:chatId" element={<ChatView />}></Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
