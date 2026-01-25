import { Outlet } from "react-router-dom";
import Sidebar from "@/components/sidebar";
import { ThemeProvider } from "@/providers/themeProvider";

export default function Layout() {
	return (
		<ThemeProvider>
			<div className="flex w-screen h-screen bg-(--bg) p-2">
				<Sidebar />
				<main className="w-full h-full bg-(--fg) rounded-2xl">
					<Outlet />
				</main>
			</div>
		</ThemeProvider>
	);
}
