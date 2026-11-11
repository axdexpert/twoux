# Answer actions

The row under every answer: origin label on the left, then Copy, Helpful, Not helpful, Regenerate and a More menu. Always visible, never only on hover.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- Under every answer the assistant gives in the side panel or on the assistant page.
- Under a stacked group of answer parts once, after the last part, not after each one.
- Under an answer that was stopped, so Regenerate and feedback are still reachable.

## When not to use

- For actions on a generated file, such as Download. Those belong in the file's own card.
- For feedback about the page or product. Use the product feedback route, not answer feedback.
- Under approval results, notices or the clarifying question card.

## Structure

1. Origin label: "Assistant · from your workspace data" (see AI origin label)
2. Copy: copies the answer as plain text with record IDs
3. Helpful and Not helpful: feedback toggles with submitting and sent states
4. Regenerate: latest answer only
5. More (⋯): Save as task, Open as page, Copy link
6. Not helpful form (optional): a short dismissible form under the answer

## Guidelines

- Show at most four icon buttons; anything else goes in More.
- Keep the row visible at all times. Hover-only actions are invisible to keyboard and touch users.
- Feedback has three states: default, sending (spinner in the pressed button) and sent. Once sent, the chosen button stays pressed and the other is disabled with a reason.
- Not helpful opens an optional form under the answer: reasons as checkboxes (Wrong figures, Missed records, Too long, Other) and a note. It can be closed without sending.
- Same order everywhere: label, Copy, Helpful, Not helpful, Regenerate, More.

## Content

- Tooltips: "Copy", "Helpful", "Not helpful", "Regenerate answer", "More actions".
- After feedback: "Feedback sent". Disabled reason on the other button: "You marked this as helpful".
- Copy confirmation is a short tooltip, "Copied", not a toast.

## Accessibility

- Feedback buttons are toggle buttons with aria-pressed, named "Helpful" and "Not helpful".
- "Feedback sent" and "Copied" are announced as status messages without moving focus.
- Disabled buttons stay focusable so their reason can be read.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move through the actions after reading the answer |
| Enter / Space | Press the focused action |
| Esc | Close the More menu or the Not helpful form |

## Examples

### actions

```tsx
import { AnswerActions, AssistantMessage, DropdownMenuItem } from "@twoux/ui";

export const meta = { title: "Under every answer", description: "Copy, Helpful, Not helpful and Regenerate (latest answer only), with the rest under More. Always visible, not on hover. Feedback shows sending, then stays pressed.", order: 1 };

export default function Example() {
	return (
		<div className="w-full max-w-lg">
			<AssistantMessage from="24 listings" actions={<AnswerActions text="2 listings close this week with fewer than 10 applicants." onRegenerate={() => {}} onFeedback={() => new Promise((r) => setTimeout(r, 500))} more={<><DropdownMenuItem>Save as task</DropdownMenuItem><DropdownMenuItem>Open as page</DropdownMenuItem><DropdownMenuItem>Copy link</DropdownMenuItem></>} />}>
				<p><strong>2 listings</strong> close this week with fewer than 10 applicants.</p>
			</AssistantMessage>
		</div>
	);
}
```

## Related

- Regenerating an answer
- Labelling AI output
- AI origin label
- Assistant side panel
