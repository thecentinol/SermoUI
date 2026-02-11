import { type ReactNode, useEffect } from "react";
import { useUIStore } from "@/stores/ui.store";

export function ThemeProvider({ children }: { children: ReactNode }) {
	const { currentTheme } = useUIStore();

	useEffect(() => {
		document.documentElement.removeAttribute("data-theme");

		document.documentElement.setAttribute("data-theme", currentTheme);
	}, [currentTheme]);

	return <>{children}</>;
}
