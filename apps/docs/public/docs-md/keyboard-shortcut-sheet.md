# Shortcut sheet (?)

A panel listing every shortcut by task, opened with ?, which also holds the switch to turn single-key shortcuts off.

Kind: component · Group: Navigation · Status: built, import from @twoux/ui

## When to use

- Reference for people who want to learn the faster path after using the visible controls.
- The single place to turn single-key shortcuts off.
- Supporting expert users who already rely on shortcuts and want the full list in one view.

## When not to use

- As the main way to discover shortcuts. Show each key on its button, menu item and palette row.
- Searching for an action to run. Use the Command palette.

## Structure

1. Toggle: Single-key shortcuts, with the note "Turn off if you use a screen reader or voice control. ⌘ shortcuts stay on."
2. Group: Navigate (⌘K, G L, G P, /)
3. Group: Table (J K, X, ⇧J, ↵)
4. Group: Act (C, E, F, ⌘Z)
5. Each row: action name left, key caps right

## Guidelines

- Opens with ? from anywhere outside a text field, and from the Help menu.
- Group shortcuts by task, a handful per group, so the sheet can be scanned.
- Single-key shortcuts (C, E, F, J, K, X, R, G sequences) can be turned off; ⌘ shortcuts stay on.
- Single-key shortcuts never fire while focus is in a text input.
- Avoid keys that clash with the browser, the operating system or screen readers, and never override copy, paste or save.
- Prefer one or two letters with a mnemonic (C create, E edit, F filter) over stacked modifiers.

## Content

- Action names match the button labels they belong to.
- Show keys as the symbols printed on the keyboard (⌘, ⇧, ↵) and give the Windows equivalent.
- The off switch says who it is for in plain words.

## Accessibility

- Meets 2.1.4 Character Key Shortcuts by letting people turn single-key shortcuts off.
- Every shortcut is an extra route; the same action is reachable by Tab and Enter (2.1.1).
- Shown as a modal dialog with a heading; Esc closes it and focus returns (2.4.3).
- The toggle is a real switch with its state exposed (4.1.2).

## Keyboard

| Keys | Action |
|---|---|
| ? | Open the shortcut sheet |
| Esc | Close it |
| Tab | Reach the single-key shortcut switch |

## Examples

### sheet

```tsx
import { Button, ShortcutSheet } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Every shortcut, by task", description: "Press ? anywhere outside a text field. The switch at the top turns single-key shortcuts off for screen reader and voice control users; ⌘ shortcuts stay on.", order: 1 };

export default function Example() {
	const [single, setSingle] = useState(true);
	return (
		<div className="grid justify-items-start gap-2">
			<Button variant="outline" onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "?" }))}>Show shortcuts (?)</Button>
			<span className="text-sm text-ink-2">Single-key shortcuts are {single ? "on" : "off"}.</span>
			<ShortcutSheet
				singleKeys={single}
				onSingleKeysChange={setSingle}
				groups={[
					{ title: "Navigate", items: [{ keys: ["⌘", "K"], action: "Search or run a command" }, { keys: ["G", "L"], action: "Go to Listings" }, { keys: ["G", "I"], action: "Go to Inbox" }, { keys: ["/"], action: "Search this list" }] },
					{ title: "Table", items: [{ keys: ["J"], action: "Next row" }, { keys: ["K"], action: "Previous row" }, { keys: ["X"], action: "Select row" }, { keys: ["↵"], action: "Open in side panel" }] },
					{ title: "Act", items: [{ keys: ["C"], action: "New listing" }, { keys: ["F"], action: "Add a filter" }, { keys: ["⌘", "Z"], action: "Undo" }] },
				]}
			/>
		</div>
	);
}
```

## Related

- Command palette (⌘K)
- App shell and sidebar navigation
- Page header
