# Task builder

Repeated tasks written as a sentence with editable slots that reuse filter values, with Run blocked until every required slot is filled.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- Tasks people run often with the same shape, such as "Find Live listings under 3% and draft new titles for hiring managers".
- When the inputs map to filters already in TwoUX, so slots reuse those values.
- When an answer should be saved and rerun on a schedule.

## When not to use

- A one-off question. Use the Message composer (message-composer).
- A prompt that runs per row with typed outputs. Use the Prompt editor (prompt-editor).
- Browsing ready-made tasks. Use the Templates gallery (templates-gallery).

## Structure

1. Sentence with slots (dashed when empty, filled when set)
2. Actions (Schedule, Save as task, Run ⌘↵)
3. Inline error naming the empty slot

## Guidelines

- Make the critical slots prominent and say which can be left empty.
- An empty slot is dashed and blocks Run; the message says which slot.
- Filled slots show as regular text; empty ones as placeholders.
- Do not overload the sentence with slots.
- Scheduled runs notify before they act and land in the Inbox when they need approval.
- An empty slot shows its field name in italics in a dashed box; once filled it shows the value as normal text.
- The popover field label matches the slot name exactly, so people know which slot they are editing.
- Slots hold one value each. Status belongs in a badge and several related values in a key-value list, not in slots.

## Content

- Write the sentence as an instruction in plain words; slot placeholders match the filter field names.
- Error: "Choose who gets the titles before you run this."

## Accessibility

- Each slot is a button whose name includes the slot and value ("Status: Live") (SC 4.1.2).
- Slots open a menu or listbox following the menu button pattern.
- The disabled Run has its reason in text next to it (SC 3.3.1, 3.3.2).
- Dashed versus solid is not the only cue; empty slots show placeholder text (SC 1.4.1).

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move between slots |
| Enter / Space | Open a slot's options |
| ⌘↵ / Ctrl+Enter | Run when all required slots are filled |

## Examples

### weekly

```tsx
import { TaskBuilder, toast } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "A task written as a sentence", description: "Slots are dashed until set. Run (⌘↵) is blocked while a required slot is empty, and the message names it.", order: 1 };

export default function Example() {
	const [v, setV] = useState<Record<string, string>>({ when: "Every Monday" });
	return (
		<div className="w-full max-w-xl">
			<TaskBuilder
				value={v}
				onChange={setV}
				onRun={() => toast.success("Task started")}
				onSave={() => toast("Saved as a task")}
				onSchedule={() => toast("Scheduled")}
				parts={[{ id: "when", placeholder: "When", options: ["Every Monday", "Every day at 9:00", "Once"], required: true }, ", summarise", { id: "which", placeholder: "which listings", options: ["listings closing this week", "listings with no applicants", "all open listings"], required: true }, "and send it to", { id: "who", placeholder: "who", options: ["me", "the hiring managers", "#hiring on Slack"], required: true }, "."]}
			/>
		</div>
	);
}
```

## Related

- Templates gallery
- Prompt editor with fields
- Agent run timeline
