# Checkbox

Lets people choose any number of options, or confirm one setting that is applied when they save.

Kind: component · Group: Actions and inputs · Status: built, import from @twoux/ui

## When to use

- To pick any number of options from a list, including none.
- To select table rows for bulk actions, with a header checkbox that selects all.
- For a single setting in a form that is applied when the person saves: Show salary on listing.
- As a parent with an indeterminate dash when only some children are selected.

## When not to use

- For one choice out of several. Use Radio.
- For a setting that takes effect at once. Use Switch.
- To switch the view of other content. Use Segmented control.

## Structure

1. Box (15px)
2. Check or dash mark
3. Label
4. Hint (optional)
5. Group label (for sets)

## Guidelines

- Box is 15px, 4px radius. Checked and indeterminate fill with primary.
- The label is part of the click target. Clicking either toggles the box.
- List options vertically, one per line. Horizontal only for two short options with clear spacing.
- Indeterminate is visual only; clicking it selects all rows.
- Opt-in checkboxes start unticked.

## Content

- Write labels positively: Accept CVs by email, not Don't accept CVs by email.
- Keep labels short, sentence case, no end punctuation.
- Group labels say what to choose: Columns to show.

## Accessibility

- Use a native input type="checkbox" with a label element. Space toggles it.
- Parent checkboxes expose aria-checked="mixed" when partly selected.
- Wrap related checkboxes in a fieldset with a legend, or role="group" with aria-labelledby.
- The 15px box is below 24px, so the label is clickable and rows are 36px apart to meet target spacing.
- Unchecked border and checked fill need 3:1 against white.

## Keyboard

| Keys | Action |
|---|---|
| Space | Toggle the focused checkbox |
| X | Select the focused table row (single-key shortcut, can be turned off) |
| Shift+J / Shift+K | Extend row selection down or up |

## Examples

### select-all

```tsx
import { Checkbox } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Select all", description: "The parent shows indeterminate when only some rows are selected. Clicking it selects all; clicking again clears all.", order: 3 };

const roles = ["Junior Product Designer", "Graduate Data Analyst", "Junior QA Engineer"];

export default function Example() {
	const [sel, setSel] = useState<string[]>([roles[0]]);
	const all = sel.length === roles.length ? true : sel.length ? "indeterminate" : false;
	return (
		<div className="w-72 overflow-hidden rounded-sm border border-line bg-surface">
			<label className="flex h-row cursor-pointer items-center gap-2.5 bg-surface-2 px-3 text-sm font-medium text-ink-2">
				<Checkbox checked={all} onCheckedChange={() => setSel(all === true ? [] : roles)} aria-label="Select all listings" />
				{sel.length ? `${sel.length} of ${roles.length} selected` : "Select all"}
			</label>
			{roles.map((r) => (
				<label key={r} className="flex h-row cursor-pointer items-center gap-2.5 border-t border-line px-3 hover:bg-surface-2">
					<Checkbox checked={sel.includes(r)} onCheckedChange={(v) => setSel((s) => (v ? [...s, r] : s.filter((x) => x !== r)))} />
					{r}
				</label>
			))}
		</div>
	);
}
```

### states

```tsx
import { Checkbox } from "@twoux/ui";

export const meta = { title: "States", description: "Unchecked, checked, indeterminate (some children selected) and disabled. The box is 16px; its row is 24px so it is easy to hit.", order: 1 };

export default function Example() {
	return (
		<div className="flex items-center gap-6">
			<Checkbox aria-label="Unchecked" />
			<Checkbox aria-label="Checked" defaultChecked />
			<Checkbox aria-label="Some selected" checked="indeterminate" />
			<Checkbox aria-label="Disabled" disabled />
			<Checkbox aria-label="Disabled and checked" disabled defaultChecked />
		</div>
	);
}
```

### with-label

```tsx
import { CheckboxField } from "@twoux/ui";

export const meta = { title: "With label and hint", description: "The label is clickable and part of the target. A hint explains the consequence, not the control.", order: 2 };

export default function Example() {
	return (
		<div className="grid gap-3">
			<CheckboxField id="ex-salary" label="Show salary on listing" hint="Listings with a salary get about a third more applies." defaultChecked />
			<CheckboxField id="ex-email" label="Accept CVs by email" />
		</div>
	);
}
```

## Related

- Radio
- Switch
- Form validation
