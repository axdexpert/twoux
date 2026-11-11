# Export menu

One Export menu per table: options first (only visible columns, include AI columns), then file formats, then copy to clipboard.

Kind: component · Group: Data · Status: built, import from @twoux/ui

## When to use

- People take table data to another tool. Export is a table-level toolbar action.
- Several related export actions start one action each; a menu suits 5 to 15 such items.

## When not to use

- For a single format. Use a plain button, "Export CSV", as on chart cards.
- To choose a value that changes the view. Use a select.

## Structure

1. Export button with a download icon
2. Menu heading with the shortcut (⇧E)
3. Options: Only visible columns, Include AI columns (checkable, the menu stays open)
4. Download CSV, Download JSON
5. Copy as CSV, Copy as JSON

## Guidelines

- Group items with labelled sections: options, download, copy.
- Options are checkbox items that toggle without closing the menu.
- Order by frequency: the most used format first.
- Confirm a copy or a finished download with a short status message.

## Content

- Use verb plus format, "Download CSV", "Copy as JSON".
- Checkbox labels state the choice so its opposite is clear, "Only visible columns".
- Write labels in sentence case on a single line.

## Accessibility

- APG menu button pattern: Enter, Space or Down Arrow opens the menu and focuses the first item.
- APG menu pattern: options use role="menuitemcheckbox" with aria-checked; Escape closes and returns focus to Export.
- 4.1.3 Status Messages: "Copied 24 rows as CSV" is announced without moving focus.

## Keyboard

| Keys | Action |
|---|---|
| ⇧E | Open the Export menu |
| ↑ ↓ | Move between items |
| Space | Toggle an option without closing |
| Enter | Run the export and close |
| Esc | Close and return focus to Export |

## Examples

### menu

```tsx
import { ExportMenu, toast } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Export a table", description: "Options toggle without closing the menu. Downloads and copies run and close, then confirm with a toast. Opens with ⇧E.", order: 1 };

export default function Example() {
	const [onlyVisible, setOnlyVisible] = useState(true);
	const [includeAi, setIncludeAi] = useState(false);
	const scope = `${onlyVisible ? "visible" : "all"} columns${includeAi ? ", with AI columns" : ""}`;
	return (
		<ExportMenu
			onlyVisible={onlyVisible}
			onOnlyVisibleChange={setOnlyVisible}
			includeAi={includeAi}
			onIncludeAiChange={setIncludeAi}
			onDownload={(f) => toast.success(`listings.${f.toLowerCase()} downloaded`, { description: `24 rows, ${scope}` })}
			onCopy={(f) => toast.success(`Copied 24 rows as ${f}`)}
		/>
	);
}
```

## Related

- Data grid
- List table
- Breakdown table
- Line chart card
