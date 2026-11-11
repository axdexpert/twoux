# Step card

The proposal turns into a step card while changes apply: each change shows a spinner then a check, with an "N / M" counter, and the table updates row by row.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- Applying approved changes that take more than an instant, so people can see each one land.
- When the table should update as each step finishes, so the result can be checked in place.

## When not to use

- Scheduled or long agent runs with waiting steps. Use the Agent run timeline (agent-run).
- Reasoning before an answer. Use Thinking and steps (thinking-steps).

## Structure

1. Header ("Applying 2 changes" and counter)
2. Step rows (spinner or check, change label)
3. Footer note ("Working…" then "Applied 2 changes.")

## Guidelines

- Each step has a visible state: pending with spinner, then done with a check. A failed step says why and keeps the others.
- Show the counter ("1 / 2") so progress reads without counting icons.
- Finish with a summary and an Undo toast.
- Keep the step card in the thread as a record of what was done.

## Content

- Use the same label as the proposal row so people recognise each change.
- Finish in past tense with a count: "Applied 2 changes."

## Accessibility

- Announce the counter and the final summary through a status region (SC 4.1.3); do not announce every spinner.
- Spinners are aria-hidden and the state is also given in text (SC 1.3.1, 1.4.1).
- Spinner motion stops when the step ends; runs over five seconds need Stop (SC 2.2.2).

## Keyboard

| Keys | Action |
|---|---|
| ⌘Z / Ctrl+Z | Undo the applied changes from the toast |

## Examples

### apply

```tsx
import { Button, StepCard } from "@twoux/ui";
import { useEffect, useState } from "react";

export const meta = { title: "Applying, step by step", description: "Each change shows pending, then done. A failed step says why and keeps the others. The counter reads progress without counting icons.", order: 1 };

export default function Example() {
	const [n, setN] = useState(0);
	useEffect(() => { if (n < 3) { const t = setTimeout(() => setN((x) => x + 1), 700); return () => clearTimeout(t); } }, [n]);
	const state = (i: number) => (i >= n ? "pending" : i === 2 ? "failed" : "done") as "pending" | "done" | "failed";
	return (
		<div className="grid w-full max-w-md gap-2">
			<StepCard title="Extending 3 listings" steps={[{ label: "Frontend Engineer closes 21 Dec", state: state(0) }, { label: "Data Analyst closes 12 Jan", state: state(1) }, { label: "QA Engineer", state: state(2), reason: n > 2 ? "Already closed. Reopen it first." : undefined }]} />
			<Button variant="outline" size="sm" className="justify-self-start" onClick={() => setN(0)}>Replay</Button>
		</div>
	);
}
```

## Related

- Suggested changes
- Agent run timeline
- Toast
- Plan preview
