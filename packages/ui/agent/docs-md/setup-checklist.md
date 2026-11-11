# Setup checklist

A short list in the sidebar of the few things that make the product useful, with progress shown as "2 of 4".

Kind: component · Group: Navigation · Status: built, import from @twoux/ui

## When to use

- Showing the next few things that make an empty workspace useful.
- Setup that people can do in any order and return to later.

## When not to use

- A fixed sequence. Use Stepper (stepper) or Onboarding step (onboarding-step).
- Teaching the interface. Use contextual help, not a modal tour.

## Structure

1. Heading ("Get set up")
2. Progress text ("2 of 4") and bar
3. Tasks (status, label, Start)
4. Dismiss button

## Guidelines

- Keep it to three to five tasks that make the product useful.
- Put it in the sidebar and let people dismiss it.
- Show progress as text, "2 of 4", with the bar as extra.
- Start opens the task in place. Never a modal tour or a full-page takeover.
- When everything is done, collapse it or let it disappear.

## Content

- Tasks begin with a verb: "Connect Slack", "Invite a teammate".
- Start button text stays "Start"; the task name is read out with it.

## Accessibility

- The checklist is a labelled section with a list; done tasks say "done" for assistive technology (SC 1.3.1, 1.4.1).
- Start and Dismiss have names that include what they act on (SC 2.4.6).
- The progress bar is decorative; the count is text (SC 1.4.1).

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move through Start buttons and Dismiss |
| Enter or Space | Start a task or hide the checklist |

## Examples

### sidebar

```tsx
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
```

## Related

- Onboarding to an empty workspace
- Empty state
- Onboarding step
- App shell and sidebar navigation
- Stepper
