// import { useState } from "react";
import Sidebar from "@/components/sidebar";

function App() {
	return (
		<div className="flex w-screen h-screen bg-(--bg) p-2">
			<Sidebar />
			<div className="w-full h-full bg-(--fg) rounded-2xl overflow-y-auto"></div>
		</div>
	);
}

export default App;
