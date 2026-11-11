# Notifications vs inbox vs toast

The rule for where a message goes: toast for your own action, banner for a condition on this page, inbox for anything that needs you later, activity for the rest.

Kind: component · Group: Feedback and overlays · Status: built, import from @twoux/ui

## When to use

- Designing any new message, to choose its component before writing it.
- Reviewing a screen that shows several messages at once, to remove the ones that belong elsewhere.

## When not to use

- Field-level validation, which always sits next to the field. Use inline field errors and the Banner strip.
- Loading feedback. Use the Loading skeleton or an inline spinner.

## Structure

1. Question 1: did the person just do this, here? Toast
2. Question 2: is it a condition on the page in view? Banner
3. Question 3: does it need someone to act, now or later? Inbox
4. Question 4: must it stop the task before it continues? Confirmation dialog
5. Otherwise: the record's Activity tab, no message

## Guidelines

- Toast: passive confirmation of the person's own action in the current view; disappears; may carry Undo.
- Banner: a condition in context that persists until resolved; may carry one action.
- Inbox: events the person did not trigger, or that complete later, that need a response; persists until done or snoozed.
- Confirmation dialog: only when the task must stop for a decision that cannot be undone.
- Activity: events that need nothing. Logging them instead of notifying prevents alert fatigue.
- Errors never go in a toast.
- Keep event notifications people didn't trigger (reminders, assignments) apart from toasts. Notifications get their own component, which comes in at the top right and can stack, separate from toasts.

## Content

- Whatever the component, say what happened and what to do next, in sentence case, without apologies.
- Use the same name for the same record across toast, inbox and activity.

## Accessibility

- Toasts use role="status"; blocking errors use role="alert"; the dialog uses role="alertdialog" (4.1.3).
- Only dialogs take focus; everything else is announced without moving focus.
- Nothing important is only in a timed message (2.2.1); the Inbox and Activity keep a permanent record.
- Non-urgent updates can be postponed by the person (snooze), which supports 2.2.4 Interruptions.

## Keyboard

| Keys | Action |
|---|---|
| ⌘Z | Undo after a toast |
| G I | Open the Inbox |

## Examples

### choose

```tsx
import { Badge, RadioField, RadioGroup } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Where should this message go?", description: "Answer in order. The first yes decides: toast, banner, Inbox or confirmation dialog. If none apply, log it in the record's Activity and send nothing.", order: 1 };

const Q = [
	{ id: "own", q: "Did the person just do this, here?", yes: "Toast", why: "Confirms their own action and disappears; can carry Undo." },
	{ id: "cond", q: "Is it a condition on the page in view?", yes: "Banner", why: "Stays in context until resolved; at most one action." },
	{ id: "act", q: "Does it need someone to act, now or later?", yes: "Inbox", why: "Persists until done or snoozed, even if they weren't here." },
	{ id: "stop", q: "Must it stop the task before it continues?", yes: "Confirmation dialog", why: "Only when the decision can't be undone." },
];

export default function Example() {
	const [answers, setAnswers] = useState<Record<string, string>>({});
	const first = Q.find((q) => answers[q.id] === "yes");
	const allNo = Q.every((q) => answers[q.id] === "no");
	return (
		<div className="grid w-full max-w-xl gap-3">
			{Q.map((q, i) => (
				<fieldset key={q.id} className="grid gap-1.5 rounded-sm border border-line bg-surface p-3" disabled={i > 0 && answers[Q[i - 1].id] !== "no"}>
					<legend className="sr-only">{q.q}</legend>
					<span className="text-base font-medium text-ink">{i + 1}. {q.q}</span>
					<RadioGroup value={answers[q.id] ?? ""} onValueChange={(v) => setAnswers((a) => ({ ...Object.fromEntries(Object.entries(a).filter(([k]) => Q.findIndex((x) => x.id === k) < i)), [q.id]: v }))} className="flex gap-4">
						<RadioField id={`${q.id}-y`} value="yes" label="Yes" />
						<RadioField id={`${q.id}-n`} value="no" label="No" />
					</RadioGroup>
				</fieldset>
			))}
			<p role="status" className="flex items-center gap-2 text-base text-ink-2">
				{first ? <><Badge>{first.yes}</Badge>{first.why}</> : allNo ? <><Badge variant="secondary">Activity only</Badge>Log it on the record; don't notify anyone.</> : "Answer the questions in order."}
			</p>
		</div>
	);
}
```

## Related

- Toast
- Banner (inline alert)
- Inbox (triage)
- Confirmation dialog
