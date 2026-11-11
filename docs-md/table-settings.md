# Table settings

Settings for one table in the side panel: how duplicates are handled with the consequence written out, deleting empty rows, and sharing as a template with who can use it. Saved with Save; closing with changes asks first.

Kind: component · Group: Data · Status: built, import from @twoux/ui

## When to use

- For rules that apply to a whole table rather than one column.

## When not to use

- For column set-up. Use the column menu.

## Structure

1. Duplicate rows: match on, Keep the oldest, Keep the newest, Keep both, each with what happens
2. Empty rows: Delete empty rows automatically
3. Share as a template: checkbox, who can use it, link with Copy
4. Footer: Cancel, Save

## Guidelines

- Write out the consequence of each duplicate rule, including overwritten values and runs that cost credits again.
- Use checkboxes and radios in this form, saved with Save; a switch is only for changes that apply at once.
- Ask before discarding only when something changed, and warn before leaving the page while dirty.
- Say what a template shares and what it never shares.

## Content

- "Rows and looked-up values are never shared."

## Accessibility

- Radio groups are labelled by their heading; hints are linked to each option.
- The discard dialog puts focus on Keep editing.

## Keyboard

| Keys | Action |
|---|---|
| ⌘ Enter | Save |
| Esc | Close; asks first when there are changes |

## Examples

### settings

```tsx
import { Button, TableSettings, type TableSettingsValue } from "@twoux/ui";
import { Settings } from "lucide-react";
import { useState } from "react";

export const meta = { title: "Settings for the People table", description: "Change a setting and close the panel: it asks before discarding. Close without changes and it doesn't ask. Each duplicate rule says what happens to existing rows and credits.", order: 1 };

export default function Example() {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState<TableSettingsValue>({ duplicates: "keep-oldest", matchOn: "email", deleteEmptyRows: false, template: { shared: false, audience: "workspace" } });
	return (
		<>
			<Button variant="outline" onClick={() => setOpen(true)}><Settings />Table settings</Button>
			<TableSettings
				open={open}
				onOpenChange={setOpen}
				mode="overlay"
				value={value}
				onSave={async (v) => { await new Promise((r) => setTimeout(r, 400)); setValue(v); }}
				columns={[{ id: "email", label: "Work email" }, { id: "name", label: "Name" }]}
				tableName="People"
				workspaceName="TwoUX"
				templateLink="https://app.example.com/t/people"
			/>
		</>
	);
}
```

## Related

- Side panel (drawer)
- Sheet grid
