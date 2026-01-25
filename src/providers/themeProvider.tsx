import { useEffect } from "react";
import { useUIStore } from "@/stores/uiStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const { currentTheme } = useUIStore();

	useEffect(() => {
		document.documentElement.removeAttribute("data-theme");

		document.documentElement.setAttribute("data-theme", currentTheme);
	}, [currentTheme]);

	return <>{children}</>;
}
