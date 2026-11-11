# Clarifying question card

A card docked above the message box that asks up to three questions with recommended defaults when the answer would change the result.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- When the request is ambiguous and the answer changes the result, for example which listings to rewrite.
- Before high-impact changes or when confidence is low, collect details first.

## When not to use

- Information already in context or retrievable from the data. Do not re-ask; use the context chips (message-composer).
- Suggesting what to ask next after an answer. Use Follow-ups (follow-ups-starters).
- Approving a change. Use Suggested changes (suggested-changes).

## Structure

1. Counter ("1 / 2") and question
2. Options (title and one line each, recommended first, number key)
3. Other (free text, last)
4. Footer (Previous, Skip, Next ↵)
5. Thread line "Waiting for your answer" with timer

## Guidelines

- Ask only when the answer changes the result, at most three questions, one at a time.
- Every question has a default, shown first and marked "(Recommended)". Skip uses the defaults for the rest.
- Options first, free text last. Structured choices beat free text.
- Dock the card above the message box so the thread does not fill with back and forth.
- Stop ends the questions and says "Stopped. Nothing was changed."

## Content

- Questions are short and specific: "Which titles should I rewrite?"
- Each option has a title and one line of consequence ("Leaves listings that are doing well alone").
- Use "choose" or "select", not "click".

## Accessibility

- Options are a radiogroup labelled by the question; each option is role="radio" with aria-checked.
- Arrow keys move and select within the group; Tab moves to Other and the footer buttons in order (SC 2.4.3).
- Number keys 1 to 4 are single character shortcuts, so they must be active only while the card is open and focus is not in a text field, and must respect the setting that turns single-key shortcuts off (SC 2.1.4). The mock listens while the card is open but ignores that setting, which needs fixing.
- The waiting timer must not limit time to answer (SC 2.2.1); it only shows elapsed time.
- Announce the new question when Next is pressed (SC 4.1.3).

## Keyboard

| Keys | Action |
|---|---|
| 1 to 3 | Choose an option |
| 4 | Move focus to Other |
| Arrow keys | Move between options |
| Enter | Next question, or run when it is the last |
| Esc | Close the panel (Stop ends the questions) |

## Examples

### ask

```tsx
import { ClarifyingQuestion, toast } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Ask only what changes the result", description: "One question at a time, at most three. The recommended option comes first; number keys choose; Other is last; Skip keeps the defaults.", order: 1 };

export default function Example() {
	const [k, setK] = useState(0);
	return (
		<div className="w-full max-w-lg">
			<ClarifyingQuestion
				key={k}
				questions={[
					{ question: "Which listings should I compare?", options: [{ id: "team", title: "Same team, last 90 days", detail: "22 listings" }, { id: "all", title: "All listings this year", detail: "141 listings" }] },
					{ question: "How should I show the result?", options: [{ id: "table", title: "A short table" }, { id: "chart", title: "A chart by week" }] },
				]}
				onDone={(a) => { toast(`Continuing with: ${a.join(", ")}`); setK((x) => x + 1); }}
			/>
		</div>
	);
}
```

## Related

- Assistant side panel
- Message composer
- Thinking and steps
- Agent run timeline
- Plan preview
- Confidence note
