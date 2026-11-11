import { Button, Inbox, type InboxItem, toast } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Things that need you", description: "Items that block an agent come first, marked Needs you in words. Focus the list: J and K move, E marks done and the next item opens, ⇧H snoozes. Every action offers Undo.", order: 1 };

const START: InboxItem[] = [
	{ id: "1", title: "Approve: extend 3 listings by 30 days", source: "Agent · Weekly listing check", time: "09:12", needsYou: true, state: "inbox" },
	{ id: "2", title: "Priya Shah mentioned you on Frontend Engineer", source: "Comment", time: "Yesterday", state: "inbox" },
	{ id: "3", title: "Data Analyst closes in 2 days with 4 applicants", source: "Listing alert", time: "Mon", state: "inbox" },
	{ id: "4", title: "Export of 1,262 listings is ready", source: "Export", time: "Sun", state: "done" },
];

export default function Example() {
	const [items, setItems] = useState(START);
	const set = (id: string, patch: Partial<InboxItem>) => setItems((x) => x.map((i) => (i.id === id ? { ...i, ...patch } : i)));
	return (
		<Inbox
			className="h-96 w-full"
			items={items}
			onDone={(id) => { set(id, { state: "done" }); toast.success("Marked done", { action: { label: "Undo", onClick: () => set(id, { state: "inbox" }) } }); }}
			onSnooze={(id, until) => { set(id, { state: "snoozed", snoozedUntil: until }); toast.success(`Snoozed until ${until.toLowerCase()}`, { action: { label: "Undo", onClick: () => set(id, { state: "inbox" }) } }); }}
			renderDetail={(it) => (
				<div className="grid gap-3 text-base text-ink-2">
					<p>{it.source} · {it.time}</p>
					{it.needsYou && <div className="flex gap-2"><Button size="sm">Review changes</Button><Button size="sm" variant="outline">Reject</Button></div>}
				</div>
			)}
		/>
	);
}
