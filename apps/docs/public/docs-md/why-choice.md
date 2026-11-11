# Why this choice

A small Why? control beside a choice an agent made. On demand, it names the deciding factors and the options that lost, then offers Change this or Keep it.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- When an agent picked between options for the person: a time, a supplier, a template, a route, a recipient list.
- When a requirement could not be met and the person should know.
- When the choice is easy to change and people may want to change it after seeing why.

## When not to use

- By default, on every output. Explanations on demand keep the screen quiet; use the origin label (ai-origin-label) to say where something came from.
- Sources for a claim. Use Citations and sources (citations-sources).
- Risks or doubt about the output. Use a Confidence note (confidence-note).

## Structure

1. Why? link beside the choice
2. Popover ("Why <choice>", deciding factors)
3. Not chosen (each option and why it lost)
4. Couldn't meet (a requirement that was dropped, if any)
5. Footer (Change this, Keep it)

## Guidelines

- Show the reasoning on demand, from a Why? link. Do not show it by default.
- Name the deciding factors in plain language, with the most important first.
- Name the options that lost and why, so the person can see the alternatives were considered.
- Say if a requirement could not be met ("Couldn't meet: no room free before 10:00"), not only what was satisfied.
- End with Change this and Keep it, so the explanation leads to control.
- Store the reasoning with the choice when it is made. Do not rebuild it later, or the explanation can drift from what actually happened.

## Content

- Title the popover "Why <the choice>": "Why Thursday at 14:00".
- Write each factor as a fact the person could check: "Everyone invited is free", not "Best fit".
- Write each lost option as its name, then the reason: "Wednesday 10:00: Imogen is out until 11:00".
- Keep buttons as verbs: "Change this" opens the choice for editing; "Keep it" closes the popover.

## Accessibility

- The control is a button with the hidden text "Why <choice>", so it is not just "Why?" out of context (SC 2.4.6, 4.1.2).
- The popover is a non-modal dialog opened by the button; Escape closes it and focus returns to the button (APG dialog).
- Deciding factors use a check icon and text, and the icon is hidden from assistive technology (SC 1.4.1).
- The target is padded to at least 24 by 24 CSS pixels (SC 2.5.8).

## Keyboard

| Keys | Action |
|---|---|
| Enter / Space | Open the Why? popover |
| Tab | Move through Change this and Keep it |
| Esc | Close the popover and return focus to Why? |

## Examples

### why

```tsx
import { WhyChoice, toast } from "@twoux/ui";

export const meta = { title: "Why the agent picked this", description: "A Why? link beside the choice. On demand it names the factors, the options that lost and what could not be met, then offers Change this or Keep it.", order: 1 };

export default function Example() {
	return (
		<div className="flex w-full max-w-xl items-center gap-2 rounded-sm border border-line bg-surface px-3 py-2.5 text-base text-ink">
			<span className="min-w-0 flex-1">Interview scheduled for <span className="font-medium">Thursday 14:00</span></span>
			<WhyChoice
				choice="Thursday at 14:00"
				factors={["Everyone invited is free", "It is inside the applicant's availability window", "Room 2 is booked for the full hour"]}
				alternatives={[
					{ name: "Wednesday 10:00", why: "Imogen Hart is out until 11:00" },
					{ name: "Friday 09:30", why: "Falls after the applicant's deadline to reply" },
				]}
				dropped="No slot was free before 12:00, which you asked for."
				onChange={() => toast("Opened the schedule for editing")}
				onKeep={() => toast("Kept Thursday at 14:00")}
			/>
		</div>
	);
}
```

## Related

- Citations and sources
- Confidence note
- AI origin label
- Agent run timeline
- Change review
