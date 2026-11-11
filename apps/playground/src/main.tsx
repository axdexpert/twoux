import { ShortcutsProvider, Toaster, TooltipProvider } from "@twoux/ui";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { Ballast } from "./ballast/Ballast";
import { Banner } from "./banner/Banner";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ShortcutsProvider>
			<TooltipProvider>
			{{ ballast: <Ballast />, banner: <Banner /> }[new URLSearchParams(window.location.search).get("page") ?? ""] ?? <App />}
			<Toaster />
		</TooltipProvider>
			</ShortcutsProvider>
	</StrictMode>,
);
