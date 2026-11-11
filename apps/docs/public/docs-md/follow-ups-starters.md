# Follow-ups and starters

Follow-ups continue an answer as muted rows under a "Follow-ups" label; starters appear only in the empty state as suggested tasks based on what is on screen.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- In the empty state, to show two or three tasks based on the selection, instead of a blank "How can I help?".
- After an answer, to offer one or two ways to go deeper and one to widen.
- To prompt checking, such as "Show who viewed these but didn't apply", not only moving on.

## When not to use

- Asking for missing details. Use the Clarifying question card (clarifying-question).
- Reusable workflows. Use the Templates gallery (templates-gallery) or saved tasks via / (message-composer).
- Inside an answer's body. Follow-ups sit after the answer actions, never inside the answer.

## Structure

1. Starters: "Try asking" label, bulb icon, two or three chips, Hide
2. Follow-ups: "Follow-ups" label, rows with a ↳ icon, muted text, full width

## Guidelines

- Starters are based on what is selected ("Why are these 2 doing badly?") or, with nothing selected, on common tasks.
- Show three or fewer. Too many options cause scanning fatigue.
- Anchor follow-ups in the last answer and keep them visually apart from it.
- Selecting a follow-up sends it; selecting a starter that needs editing fills the box instead.
- Starters can be hidden. Do not show them everywhere.
- Starters fill the composer for editing and show an edit icon; slots in them are dashed until filled. Follow-ups send at once.
- A prompt has no state: picking it inserts or sends once, and it doesn't stay selected.
- Follow-ups that narrow an answer offer up to five options, most likely first, each under 72 characters.

## Content

- Write them as the person would ask, specific to the data: "Which of these close this week?"
- Sentence case, no exclamation marks, no trailing arrow.
- Include at least one prompt that helps check the answer, not only extend it.

## Accessibility

- Each follow-up and starter is a button with its full text as the name (SC 4.1.2).
- Group them under a visible label ("Follow-ups", "Try asking") that is programmatically associated (SC 1.3.1).
- Rows are full width and at least 24 by 24 px targets (SC 2.5.8).
- Starters and follow-ups are buttons whose names say what happens: "Insert: Which listings close this week?" or "Ask: Compare with last month".

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move to the next suggestion |
| Enter / Space | Send the follow-up, or fill the box with the starter |

## Examples

### suggestions

```tsx
import { FollowUps, Starters, toast } from "@twoux/ui";

export const meta = { title: "Starters and follow-ups", description: "Starters come from what is selected; follow-ups continue the last answer, muted and apart from it. Three at most.", order: 1 };

export default function Example() {
	return (
		<div className="grid w-full max-w-lg gap-6">
			<Starters items={["Why are these 2 doing badly?", "Compare applicants with last quarter", "Draft a shorter description"]} onPick={(q) => toast(q)} onHide={() => {}} />
			<FollowUps items={["Which job boards are they on?", "Show the same for Design", "Extend both by 30 days"]} onPick={(q) => toast(q)} />
		</div>
	);
}
```

## Related

- Assistant side panel
- Message composer
- Templates gallery
- Clarifying question card
