import { Button } from "@twoux/ui";
import { useState } from "react";

export const meta = {
	title: "Loading",
	description: "While an action runs, the button shows a spinner and ignores clicks but stays focusable, so keyboard users keep their place. Press it to try.",
	order: 6,
};

export default function Example() {
	const [busy, setBusy] = useState(false);
	return (
		<div className="flex items-center gap-2">
			<Button variant="default" loading={busy} onClick={() => { setBusy(true); setTimeout(() => setBusy(false), 1800); }}>
				{busy ? "Publishing…" : "Publish listing"}
			</Button>
			<Button variant="outline" size="sm" loading>Saving…</Button>
		</div>
	);
}
