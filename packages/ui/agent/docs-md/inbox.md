# Inbox (triage)

The one place for things that need the person, shown as a list beside the selected item's detail, cleared by doing, marking done or snoozing.

Kind: component · Group: Navigation · Status: built, import from @twoux/ui

## When to use

- Agent approvals and questions that block a run.
- Things about to need action, such as listings closing soon, mentions and new assignments.
- Anything the person may need to come back to later, so it must persist rather than flash past.

## When not to use

- Confirming the person's own action. Use a Toast.
- Events that need nothing from anyone. Record them in the record's Activity tab.
- A condition on the page being viewed. Use a Banner.

## Structure

1. Header with key hints (J K, E done, ⇧H snooze)
2. Tabs: Inbox, Snoozed, Done, each with a count
3. List (listbox): items that block an agent first, marked "Needs you", then by time
4. Detail: the item with its actions in place (approve, extend, reply, answer 1 to 3)
5. Snooze menu: quick times plus a typed time
6. Empty state per tab

## Guidelines

- List and detail side by side; acting in the detail never leaves the Inbox, and the next item opens after Done.
- Items that block an agent sort first and carry a "Needs you" badge with a word, not only a colour.
- Items stay until done or snoozed; snoozed items return at the chosen time.
- Snooze offers four quick times (an hour from now, tomorrow, next week, a month from now) and a typed time such as "4 pm" or "2 days"; an unparseable time shows an error and keeps the menu open.
- Every action (done, snooze, approve, reply) shows a toast with Undo.
- Only things that matter reach the Inbox; filter for significance so the count stays trustworthy.
- The unread count shows on the sidebar item; below 860px, when the sidebar hides, an inbox button with the same count appears in the top bar.

## Content

- Item titles say what needs doing and to what: "Approve 3 rejections for Graduate Data Analyst".
- Empty tabs say the state and what happens next: "All caught up. New items appear here when something needs you."
- Snooze placeholder shows examples: "Try 4 pm, tomorrow, 2 days or in 5 weeks."
- Snoozed items show when they come back: "Until Mon 9:00".

## Accessibility

- The list is a listbox with aria-selected on the current item; arrow keys and J/K move through it.
- Tabs follow the APG tabs pattern and expose their counts in the accessible name.
- The detail region is a polite live region, so the newly opened item is announced (4.1.3).
- The compact inbox button's label includes the count: "Inbox, 3 unread" (4.1.2).
- Single-key triage keys (E, ⇧H, 1 to 3) follow the global single-key switch (2.1.4).
- New items never interrupt; they appear in the list and count, and the person reads them when ready (2.2.4).

## Keyboard

| Keys | Action |
|---|---|
| G I | Go to Inbox |
| J / K | Next or previous item |
| E | Mark done |
| ⇧H | Snooze (quick times or type a time, Enter to apply) |
| 1 to 3 | Answer an agent's question |
| ⌘↵ | Send a reply from the detail |
| Esc | Close the snooze menu |

## Examples

### inbox

```tsx
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
```

## Related

- Notifications vs inbox vs toast
- Toast
- App shell and sidebar navigation
- Empty state
