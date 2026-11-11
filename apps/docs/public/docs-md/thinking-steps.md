# Thinking and steps

A row that shows what the assistant is doing in words with a running timer, then collapses to "Thought for 2.1s · 4 steps" and expands on request.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- Any response that takes more than about a second, so people know what is happening instead of watching a bare spinner.
- When the answer depends on what was read: steps say "Read 2 listings and 3,000 views" so people can judge scope.
- Keeping the reasoning in the history after the answer arrives, so it can be checked later.

## When not to use

- Responses under a second. Stream the answer directly; short loading states flicker.
- Multi-step agent work that changes records. Use the Agent run timeline (agent-run) with states and Stop.
- Progress of applying approved changes. Use the Step card (step-card).

## Structure

1. Header (status mark, "Thinking", timer)
2. Step list (short title and one line of detail each)
3. Collapsed summary button ("Thought for Xs · N steps")

## Guidelines

- Say the current step in words ("Reading 9 listings"), never only an animation.
- Show a running timer while thinking. When the answer starts, collapse to "Thought for 2.1s · 4 steps" with a check.
- Each step has a short title and one line of detail. Keep plan, execution and evidence apart.
- If the person answered clarifying questions, add a step "Using your answers" with their choices.
- Stopping during thinking marks the header "Stopped" and removes unfinished steps; nothing is changed.

## Content

- Use present participles for running steps ("Reading listings", "Comparing with the board median") and past tense once done.
- Include counts and time: "Read 2 listings and 3,000 views · 4s".
- Do not write "Thinking deeply" or anything that implies a person or magic.

## Accessibility

- The thinking row is a polite live region; announce each step title, not the timer ticks (SC 4.1.3).
- The running timer updates in parallel with other content, so Stop must be available (SC 2.2.2); the pulse animation is decorative and stops when done.
- The collapsed summary is a disclosure button with aria-expanded; Enter or Space toggles the steps.
- Step states use an icon shape as well as colour (SC 1.4.1).

## Keyboard

| Keys | Action |
|---|---|
| Enter / Space | Expand or collapse finished steps |
| Tab | Move to the summary button |

## Examples

### steps

```tsx
import { Button, ThinkingSteps } from "@twoux/ui";
import { useEffect, useState } from "react";

export const meta = { title: "Say what it is doing", description: "The current step in words with a running timer, never only an animation. When the answer starts, it collapses to a summary you can open.", order: 1 };

const STEPS = [{ title: "Reading 24 listings", detail: "Open and closing soon" }, { title: "Comparing applicants with last quarter" }, { title: "Checking salary bands", detail: "Against the 2026 bands file" }, { title: "Writing the answer" }];

export default function Example() {
	const [n, setN] = useState(1);
	const [t, setT] = useState(0);
	const done = n > STEPS.length;
	useEffect(() => {
		if (done) return;
		const i = setInterval(() => setT((x) => x + 0.1), 100);
		const s = setTimeout(() => setN((x) => x + 1), 700);
		return () => { clearInterval(i); clearTimeout(s); };
	}, [n, done]);
	return (
		<div className="grid w-full max-w-md gap-3">
			<ThinkingSteps done={done} seconds={t} steps={STEPS.slice(0, Math.min(n, STEPS.length))} />
			<Button variant="outline" size="sm" className="justify-self-start" onClick={() => { setN(1); setT(0); }}>Replay</Button>
		</div>
	);
}
```

## Related

- Assistant side panel
- Agent run timeline
- Step card
- Clarifying question card
