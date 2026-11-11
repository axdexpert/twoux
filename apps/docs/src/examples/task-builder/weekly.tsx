import { TaskBuilder, toast } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "A task written as a sentence", description: "Slots are dashed until set. Run (⌘↵) is blocked while a required slot is empty, and the message names it.", order: 1 };

export default function Example() {
	const [v, setV] = useState<Record<string, string>>({ when: "Every Monday" });
	return (
		<div className="w-full max-w-xl">
			<TaskBuilder
				value={v}
				onChange={setV}
				onRun={() => toast.success("Task started")}
				onSave={() => toast("Saved as a task")}
				onSchedule={() => toast("Scheduled")}
				parts={[{ id: "when", placeholder: "When", options: ["Every Monday", "Every day at 9:00", "Once"], required: true }, ", summarise", { id: "which", placeholder: "which listings", options: ["listings closing this week", "listings with no applicants", "all open listings"], required: true }, "and send it to", { id: "who", placeholder: "who", options: ["me", "the hiring managers", "#hiring on Slack"], required: true }, "."]}
			/>
		</div>
	);
}
