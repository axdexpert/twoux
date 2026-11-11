# Suggested changes

A proposal card listing each change with a checkbox and before and after, applied with one button and undoable afterwards.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- Any time the assistant or an agent would change records: extend, rename, close, email.
- When several changes are proposed and people may want only some of them.

## When not to use

- Read-only answers. Show the figure and table without a proposal (assistant-panel).
- Actions set to Allow in Agent permissions; those run and appear in the Agent run timeline (agent-run) with Undo.
- Generated values that fill a new column. Use the AI column (ai-column), which never overwrites real data.

## Structure

1. Header ("Suggested changes · 2")
2. Change rows (checkbox, change, detail line, inline diff)
3. Footer (note "Nothing changes until you apply.", Dismiss, Edit, Apply N changes ⌘↵)
4. Undo toast after applying

## Guidelines

- Nothing runs until the person applies. Say so in the footer.
- Each change has a checkbox, ticked by default, and shows the before and after (strikethrough and inserted text).
- The Apply button counts what it will change ("Apply 2 changes") and updates as boxes are unticked.
- Edit opens the changes for adjustment; Dismiss removes the card without changing anything.
- After applying, show a toast with Undo (⌘Z) that restores the previous values.
- Match friction to risk: changes that reach people outside the workspace need a stronger confirmation.

## Content

- Write each change as a plain action: "Extend Operations Coordinator by 30 days", with the consequence on the next line ("New closing date 6 Dec").
- State what does not change ("Title only. Description stays the same.").
- After Undo: "Undone. Nothing was changed."

## Accessibility

- Each change is a native checkbox with its label, so the change and its detail are read together (SC 1.3.1, 4.1.2).
- Before and after use del and ins elements and text, not colour alone (SC 1.4.1).
- Applying changes records data, so it must be reversible or confirmed (SC 3.3.4): this card is the review step and Undo makes it reversible.
- The applied and undone messages are status messages in a role="status" toast (SC 4.1.3).

## Keyboard

| Keys | Action |
|---|---|
| Space | Tick or untick the focused change |
| ⌘↵ / Ctrl+Enter | Apply the ticked changes |
| ⌘Z / Ctrl+Z | Undo from the toast |

## Examples

### proposal

```tsx
import { SuggestedChanges, toast } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "A proposal you apply", description: "Each change ticked by default with before and after. Apply counts what it will change; ⌘↵ applies. Undo follows.", order: 1 };

export default function Example() {
	const [k, setK] = useState(0);
	return (
		<div className="w-full max-w-lg">
			<SuggestedChanges
				key={k}
				changes={[
					{ id: "1", label: "Rename Frontend Engineer", detail: "LST-1041", before: "Frontend Engineer", after: "Frontend Engineer (React)" },
					{ id: "2", label: "Add salary range", detail: "LST-1041", after: "£48,000 to £56,000" },
					{ id: "3", label: "Extend closing date by 30 days", detail: "LST-1041", before: "21 Nov", after: "21 Dec" },
				]}
				onApply={(ids) => { toast.success(`Applied ${ids.length} changes`, { action: { label: "Undo", onClick: () => setK((x) => x + 1) } }); setK((x) => x + 1); }}
				onDismiss={() => toast("Dismissed")}
				onEdit={() => toast("Opened for editing")}
			/>
		</div>
	);
}
```

## Related

- Step card
- Agent permissions
- Assistant side panel
- Toast
- Change review
