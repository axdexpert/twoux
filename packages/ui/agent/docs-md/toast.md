# Toast

A short, non-blocking confirmation of something the person just did, with Undo when the action can be reversed.

Kind: component · Group: Feedback and overlays · Status: built, import from @twoux/ui

## When to use

- Confirm an action the person just took in the current view, such as publishing, extending or closing a listing.
- Offer Undo right after a reversible change, so the change can go ahead without a confirmation dialog.
- Confirm accelerated actions done by keyboard (T, D, E, ⇧C), where the person has no other visual cue that the key worked.

## When not to use

- Errors and anything the person must act on. Use an Error state in place, or a Banner on the page.
- Events the person did not cause, such as an agent finishing or a listing about to close. Send them to the Inbox.
- When the result is already visible on screen and there is nothing else to know, show nothing.
- Irreversible, high-impact actions. Ask first with a Confirmation dialog.

## Structure

1. Status icon (check for success)
2. Title: what happened, past tense
3. Optional body: which record, one line
4. Undo button (ghost, small)
5. Live region container (role="status")

## Guidelines

- Place the toast at the bottom right, 16px from the edges, at most 340px wide, on a solid white surface. It rises above the focused element and anything marked data-toast-avoid, such as a sticky footer, so it never covers them.
- Show one toast at a time. A new toast replaces the one on screen rather than stacking.
- Hide it after 6 seconds. Pause the timer while the pointer is over the toast or focus is inside it.
- Allow one action only, and only Undo. Never put a Close or Cancel button next to it.
- Undo must also be reachable without the toast: ⌘Z undoes the last action for as long as the record allows.
- Never move focus to the toast. The person keeps working where they were.

## Content

- Title in past tense saying what happened: "Listing published", "Snoozed until Mon 9:00".
- Name the record in the body when the title alone is ambiguous: "Junior Product Designer is now live."
- Sentence case, UK spelling, one short sentence, no exclamation marks and no "successfully".
- Do not apologise or thank. Say the outcome and stop.

## Accessibility

- Render toasts into a role="status" live region that already exists in the DOM, so screen readers announce them without moving focus (4.1.3).
- Because Undo disappears with the toast, the same undo is available through ⌘Z and the record's activity, which meets the intent of 2.2.1 Timing Adjustable.
- The toast must not hide the focused element: TwoUX's Toaster measures the focused element and any data-toast-avoid element in its corner and moves up above them (2.4.11).
- Do not rely on the green check alone: the title says the outcome in words (1.4.1).
- Respect prefers-reduced-motion: the toast appears without sliding when motion is reduced (2.3.3).

## Keyboard

| Keys | Action |
|---|---|
| ⌘Z | Undo the last action, whether or not the toast is still visible |
| Tab | Reaches the Undo button while the toast is shown; the timer pauses while focus is inside |

## Examples

### undo

```tsx
import { Button, toast } from "@twoux/ui";
import { useEffect, useState } from "react";

export const meta = { title: "Confirm with Undo", description: "Close a listing. The toast says what happened, offers Undo, and leaves in 6 seconds. ⌘Z undoes it too, even after the toast has gone.", order: 1 };

export default function Example() {
	const [open, setOpen] = useState(true);

	const reopen = () => {
		setOpen(true);
		toast.success("Listing reopened", { description: "Senior Product Designer, Leeds" });
	};

	const close = () => {
		setOpen(false);
		toast.success("Listing closed", {
			description: "Senior Product Designer, Leeds",
			action: { label: "Undo", onClick: reopen },
		});
	};

	// Undo stays reachable without the toast
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "z" && !open) {
				e.preventDefault();
				reopen();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});

	return (
		<div className="flex w-full max-w-md items-center justify-between rounded-sm border border-line bg-surface px-3 py-2.5">
			<div className="grid">
				<span className="text-base font-medium text-ink">Senior Product Designer</span>
				<span className="text-sm text-ink-3">Leeds · {open ? "Open" : "Closed"}</span>
			</div>
			<Button variant="outline" size="sm" onClick={open ? close : reopen}>
				{open ? "Close listing" : "Reopen"}
			</Button>
		</div>
	);
}
```

## Related

- Banner (inline alert)
- Confirmation dialog
- Inbox (triage)
- Notifications vs inbox vs toast
- Error state (failed to load)
