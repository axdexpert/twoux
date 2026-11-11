import { ShortcutsProvider, Toaster, TooltipProvider } from "@twoux/ui";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { Ballast } from "./ballast/Ballast";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ShortcutsProvider>
			<TooltipProvider>
			{new URLSearchParams(window.location.search).get("page") === "ballast" ? <Ballast /> : <App />}
			<Toaster />
		</TooltipProvider>
			</ShortcutsProvider>
	</StrictMode>,
);
