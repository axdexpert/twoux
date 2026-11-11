import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ShortcutsProvider, Toaster, TooltipProvider } from "@twoux/ui";
import { App } from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<ShortcutsProvider><TooltipProvider><App /><Toaster /></TooltipProvider></ShortcutsProvider>
		</BrowserRouter>
	</StrictMode>,
);
