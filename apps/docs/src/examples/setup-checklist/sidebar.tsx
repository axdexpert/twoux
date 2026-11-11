import { Button, SetupChecklist, type SetupItem } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Get set up in the sidebar", description: "Start does the task in place. Finish all four and the checklist goes away; Hide closes it sooner.", order: 1 };

const TASKS = [
	{ id: "slack", label: "Connect Slack" },
	{ id: "invite", label: "Invite a teammate" },
	{ id: "import", label: "Import your candidates" },
	{ id: "agent", label: "Turn on the daily summary" },
];

export default function Example() {
	const [done, setDone] = useState<string[]>(["slack"]);
	const [hidden, setHidden] = useState(false);
	const items: SetupItem[] = TASKS.map((t) => ({ ...t, done: done.includes(t.id), onStart: () => setDone((d) => [...d, t.id]) }));
	const finished = done.length === TASKS.length;
	return (
		<div className="grid w-full max-w-64 gap-3">
			{!hidden && !finished && <SetupChecklist items={items} onDismiss={() => setHidden(true)} />}
			{(hidden || finished) && (
				<div className="grid gap-2 text-sm text-ink-2">
					<p>{finished ? "Setup is complete." : "The setup checklist is hidden."}</p>
					<Button variant="outline" size="sm" onClick={() => { setDone(["slack"]); setHidden(false); }}>Start again</Button>
				</div>
			)}
		</div>
	);
}
