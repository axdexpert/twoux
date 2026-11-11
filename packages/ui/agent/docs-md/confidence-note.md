# Confidence note

A short note beside agent output that says, in words, what the agent is unsure about, why, and the safer option or the way to check.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- When the output affects other people, shared records or money and the agent has a real reason to be unsure.
- When the cause is specific: missing data, out-of-date data, or an ambiguous request.
- When the agent is unsure whether a change applies to one item, all items or future items. Ask before acting.

## When not to use

- As a standing disclaimer on every answer. Use the caveat line under the message box (assistant-panel).
- To report an error. Use an error message (error-messages) with the fix.
- Low-stakes output the person can see and change in a second. A note there is noise people learn to skip.

## Structure

1. Lead line ("Not sure:" and the cause)
2. Safer option or what to check
3. Optional actions (for example Check the source, Use the safer option)

## Guidelines

- Say uncertainty in words, never as a percentage. A figure like 72% looks exact and gives people nothing to do.
- Say what caused it: missing data, out of date, or an ambiguous request.
- Offer a safer alternative or a concrete way to check, such as the record to open or the filter to apply.
- Scale to the stakes: use it when the output affects other people, shared records or money, and leave it off elsewhere.
- When unsure whether a change applies to one item, all items or future items, ask before acting. Do not pick the widest.
- Place the note next to the output it is about, not in a corner, so it is read together with it.

## Content

- Start with "Not sure:" and the cause: "Not sure: the connection is 35 minutes, and the last export was in March."
- Follow with what to do, as an instruction: "Check the rail times before sending this to applicants."
- Avoid "might", "may" and "possibly" on their own. Say which part, and why.
- Do not apologise. State the cause and the next step.

## Accessibility

- The cause is text with an icon that is hidden from assistive technology, so meaning does not rely on colour or the icon (SC 1.4.1).
- The note sits next to the output in reading order so it is read with it (SC 1.3.1).
- Any action in the note is a real button with a visible name (SC 4.1.2).
- If a note appears after the output has loaded, put it in a role="status" region so it is announced (SC 4.1.3).

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move to the note's actions, if it has any |
| Enter / Space | Press the focused action |

## Examples

### note

```tsx
import { Button, ConfidenceNote, toast } from "@twoux/ui";

export const meta = { title: "Unsure, and why", description: "The cause in words, then the safer option and a way to check. Use it when the output reaches people, shared records or money.", order: 1 };

export default function Example() {
	return (
		<div className="grid w-full max-w-xl gap-3">
			<ConfidenceNote
				cause="the venue's opening hours are from March, so they may be out of date"
				action={<><Button size="xs" variant="outline" onClick={() => toast("Opened the venue page")}>Check the venue page</Button><Button size="xs" variant="ghost" onClick={() => toast("Draft saved without a time")}>Send without a time</Button></>}
			>
				Check the hours before this goes to 14 applicants. If you cannot, send the invitation without a time and ask them to reply.
			</ConfidenceNote>
			<ConfidenceNote cause="your request does not say whether the new closing date applies to the 3 selected listings or to every listing in this view">
				I have not changed anything. Tell me which, and whether future listings should follow it too.
			</ConfidenceNote>
		</div>
	);
}
```

## Related

- Citations and sources
- Clarifying question card
- AI origin label
- Suggested changes
- Change review
