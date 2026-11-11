# Feedback prompt

A small "Was this helpful?" block with Yes and No buttons, a thank you once voted, and an optional short follow-up form.

Kind: component · Group: Feedback and overlays · Status: built, import from @twoux/ui

## When to use

- At the end of help topics, help centre articles and beta feature pages.
- At the end of a report people have just read, to learn if it was useful.
- On a beta feature's page, to learn whether it is worth keeping.

## When not to use

- Under assistant answers; they use the good and bad controls by the origin label.
- As a modal or toast, or before people have read the content.
- For surveys of more than three questions; link to a survey page instead.

## Structure

1. Question as a small heading: "Was this helpful?"
2. Optional one-line description
3. Yes and No buttons (text, with an optional thumb icon)
4. States: default, sending (button spinner), sent (chosen answer selected and thank you text), failed (message and Try again)
5. Optional follow-up revealed after the vote: one to three fields, a privacy line and Send

## Guidelines

- Send the vote on click; send the follow-up separately with its own Send button.
- Once voted, the buttons are replaced by the chosen answer and the thank you; the vote can't be sent twice.
- One feedback prompt per page or panel.
- Free-text fields carry the privacy line and a 500 character limit with a count.
- On failure, show the message inline with Try again; keep any typed text.

## Content

- Question names the thing: "Was this help topic helpful?" or simply "Was this helpful?" when the context is clear.
- Sent: "Thanks, your feedback is recorded."
- Follow-up label: "What was missing? (optional)". Privacy line: "Don't include candidate names or other personal details."

## Accessibility

- Yes and No are real buttons with visible text; an icon alone is not enough.
- After a successful vote, focus moves to the thank you text.
- The failed state is announced in a live region.
- The follow-up fields have visible labels and follow the form validation rules.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move to Yes, then No |
| Enter / Space | Send the vote |
| Tab (after voting) | Reach the optional follow-up fields and Send |

## Examples

### helpful

```tsx
import { CheckboxField, FeedbackPrompt } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Was this helpful?", description: "One vote, sent on click and never twice. After voting, an optional comment with the privacy line and a 500 character limit. Failures keep what was typed and offer Try again.", order: 1 };

export default function Example() {
	const [fail, setFail] = useState(false);
	return (
		<div className="grid w-full max-w-md gap-4">
			<CheckboxField id="fb-fail" label="Simulate a failed send" checked={fail} onCheckedChange={(v) => setFail(v === true)} />
			<div className="rounded-sm border border-line bg-surface p-4">
				<FeedbackPrompt
					description="About the screening questions guide"
					onVote={() => new Promise((res, rej) => setTimeout(() => (fail ? rej(new Error("offline")) : res()), 600))}
					onFollowUp={() => new Promise((res) => setTimeout(res, 600))}
				/>
			</div>
		</div>
	);
}
```

## Related

- Collecting product feedback
- Help panel
- Button
- Text input
