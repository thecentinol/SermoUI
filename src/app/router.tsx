import { createBrowserRouter } from "react-router-dom";
import App from "@/app/app";
import Chat from "@/features/chat/components/chat";
import RootLayout from "@/layout/root-layout";

export const Router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{
				index: true,
				element: <App />,
			},
			{
				path: "chat/:chatId",
				element: <Chat />,
			},
		],
	},
]);
