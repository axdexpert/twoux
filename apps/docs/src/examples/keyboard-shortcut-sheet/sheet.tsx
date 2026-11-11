import { Button, ShortcutSheet } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Every shortcut, by task", description: "Press ? anywhere outside a text field. The switch at the top turns single-key shortcuts off for screen reader and voice control users; ⌘ shortcuts stay on.", order: 1 };

export default function Example() {
	const [single, setSingle] = useState(true);
	return (
		<div className="grid justify-items-start gap-2">
			<Button variant="outline" onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "?" }))}>Show shortcuts (?)</Button>
			<span className="text-sm text-ink-2">Single-key shortcuts are {single ? "on" : "off"}.</span>
			<ShortcutSheet
				singleKeys={single}
				onSingleKeysChange={setSingle}
				groups={[
					{ title: "Navigate", items: [{ keys: ["⌘", "K"], action: "Search or run a command" }, { keys: ["G", "L"], action: "Go to Listings" }, { keys: ["G", "I"], action: "Go to Inbox" }, { keys: ["/"], action: "Search this list" }] },
					{ title: "Table", items: [{ keys: ["J"], action: "Next row" }, { keys: ["K"], action: "Previous row" }, { keys: ["X"], action: "Select row" }, { keys: ["↵"], action: "Open in side panel" }] },
					{ title: "Act", items: [{ keys: ["C"], action: "New listing" }, { keys: ["F"], action: "Add a filter" }, { keys: ["⌘", "Z"], action: "Undo" }] },
				]}
			/>
		</div>
	);
}
