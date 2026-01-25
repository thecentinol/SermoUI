import { Outlet } from "react-router-dom";
import Sidebar from "@/components/sidebar";

export default function Layout() {
	return (
		<div className="flex w-screen h-screen bg-(--bg) p-2">
			<Sidebar />
			<main className="w-full h-full bg-(--fg) rounded-2xl overflow-hidden">
				<Outlet />
			</main>
		</div>
	);
}
