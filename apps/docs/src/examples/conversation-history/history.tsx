import { ConversationHistory, toast } from "@twoux/ui";

export const meta = { title: "Find past conversations", description: "Named from the first question, scheduled tasks first, a dot for a new answer and Needs you for a waiting run.", order: 1 };

export default function Example() {
	return (
		<div className="w-full max-w-md rounded-sm border border-line bg-surface p-3">
			<ConversationHistory
				scheduled={[{ id: "s1", title: "Weekly listing check", date: "Mon", status: "needs-you" }]}
				recent={[{ id: "r1", title: "Why are these closing with few applicants?", date: "Today", status: "new" }, { id: "r2", title: "Compare Design applicants with last quarter", date: "Tue" }, { id: "r3", title: "Draft a shorter description for LST-1044", date: "3 Nov" }]}
				onOpen={(id) => toast(`Opened ${id}`)}
			/>
		</div>
	);
}
