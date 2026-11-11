# Stepper

A vertical list of numbered steps for a task done in order, such as setting up a workspace or publishing a listing, showing what is done, what is current and what is left.

Kind: component · Group: Navigation · Status: built, import from @twoux/ui

## When to use

- For a task of 3 to 6 steps that must happen in order, where knowing what is left helps people finish.
- For a setup checklist on an empty workspace, where each step unlocks the next.

## When not to use

- For sections people can visit in any order. Use Tabs.
- For one long form. Split it with headings; steps add clicks without reducing work.
- For background progress, such as an upload. Use a progress bar or status.

## Structure

1. Marker: number, or a check when done
2. Line joining the markers, primary up to the current step
3. Title, and an optional one-line description
4. Current step: primary marker, aria-current="step"
5. Later steps: faded

## Guidelines

- Keep it to 3 to 6 steps. More than that, group steps or simplify the task.
- Let people go back to any done step; never skip ahead to a step that depends on an unfinished one.
- Keep entered data when people go back and forward.
- Check each step when people press Next and keep them on it until it passes, with errors at the field. A final Review step checks everything again and links each problem to its step.
- Mark a done step with a check and the line in primary up to the current step, so progress reads at a glance.
- Place it beside the step's content on wide screens, and above it on narrow ones.

## Content

- Step titles are short verb phrases in sentence case: “Add the role”, “Set salary”, “Review and publish”.
- The description says what the step needs, in a few words: “Title, team and location”.

## Accessibility

- Use an ordered list, so screen readers announce the count and position.
- The current step has aria-current="step"; done and current states are also given in text, not by colour alone.
- Done steps that can be revisited are buttons with a visible focus ring.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Reaches each done step that can be revisited |
| Enter / Space | Goes back to that step |

## Examples

### publish

```tsx
import { Button, Stepper } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Publish a listing", description: "Done steps show a check and can be revisited. Later steps stay faded and locked until the one before is finished.", order: 1 };

const STEPS = [
	{ title: "Add the role", description: "Title, team and location" },
	{ title: "Set salary", description: "Band and benefits" },
	{ title: "Screening questions", description: "Up to 5 questions" },
	{ title: "Review and publish" },
];

export default function Example() {
	const [current, setCurrent] = useState(1);
	return (
		<div className="grid w-full max-w-lg grid-cols-[200px_1fr] gap-8 max-sm:grid-cols-1">
			<Stepper steps={STEPS} current={current} onStepSelect={setCurrent} aria-label="Publish a listing" />
			<div className="grid content-start gap-3">
				<span className="text-md font-semibold text-ink">{STEPS[Math.min(current, STEPS.length - 1)].title}</span>
				<span className="text-base text-ink-2">Step {Math.min(current + 1, STEPS.length)} of {STEPS.length}</span>
				<div className="flex gap-2">
					<Button variant="outline" size="sm" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>Back</Button>
					<Button size="sm" disabled={current >= STEPS.length} onClick={() => setCurrent((c) => c + 1)}>{current >= STEPS.length - 1 ? "Publish" : "Continue"}</Button>
				</div>
			</div>
		</div>
	);
}
```

## Related

- Tabs (underline)
- Card
- Onboarding step
