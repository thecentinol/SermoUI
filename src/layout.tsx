import { Outlet } from "react-router-dom";
import Sidebar from "@/components/sidebar";
import { ThemeProvider } from "@/providers/themeProvider";

export default function Layout() {
	return (
		<ThemeProvider>
			<div className="flex w-screen h-screen bg-(--bg) p-2 overflow-auto">
				<Sidebar />
				<main className="w-full h-full bg-(--fg) rounded-2xl">
					<header className="flex w-full h-[5%] bg-(--fg-elevated) rounded-2xl text-(--text)">
						<p>Model: </p>
						<p>Settings</p>
					</header>
					<Outlet />
				</main>
			</div>
		</ThemeProvider>
	);
}
