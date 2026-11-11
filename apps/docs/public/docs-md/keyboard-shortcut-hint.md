# Keyboard shortcut hint

Prints the key or keys that run an action, on its button, menu item or tooltip, so people learn shortcuts by using the product.

Kind: component · Group: Actions and inputs · Status: built, import from @twoux/ui

## When to use

- On buttons and menu items whose action has a shortcut: Try again R, Edit E.
- In tooltips of icon-only buttons.
- In the command palette, the ? shortcut sheet and footers that list navigation keys.

## When not to use

- For shortcuts that do not work in the current context. Leave the hint out.
- As the only way to reach an action. Every shortcut duplicates a visible control.
- Inside body text as decoration. Use plain text such as press Esc.

## Structure

1. Key cap (18px, mono 10.5px)
2. Further key caps for chords or sequences

## Guidelines

- Key cap is 18px high, 4px radius, 2px bottom border, grey surface. On buttons it shrinks to 16px and sits after the label.
- On primary buttons the cap is translucent white so it keeps contrast on primary.
- Chords show keys side by side (⌘ K); sequences show them in order (G then L).
- Render ⌘ on Mac and Ctrl elsewhere.
- Reserve shortcuts for frequent actions; keep them to one or two keys and never override copy, paste or undo.

## Content

- Use symbols for modifiers and capitals for letters: ⌘, ⇧, ↵, Esc, E.
- Use mnemonic keys: E for Edit, C for Create, F for Filter.
- The same action keeps the same key everywhere.

## Accessibility

- Single-key shortcuts (J, K, X, E, /) can be turned off in the shortcut sheet; ⌘ shortcuts stay on.
- Shortcuts avoid keys used by screen readers, such as Caps Lock and Insert combinations.
- The hint is visual. The full list is in the ? sheet so assistive technology users can find it.
- Every action also works by Tab and Enter.
- Key cap text has at least 4.5:1 contrast on its background.

## Keyboard

| Keys | Action |
|---|---|
| ⌘K | Open the command palette |
| ? | Open the shortcut sheet |
| G then L | Go to listings |
| J / K | Next or previous row |
| C | New listing |
| E | Edit |

## Examples

### keys

```tsx
import { Kbd } from "@twoux/ui";

export const meta = {
	title: "Keys",
	description: "One Kbd per key. Use symbols for modifiers: ⌘ ⇧ ⌥ ↵.",
	order: 1,
};

export default function Example() {
	return (
		<dl className="grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-2">
			<dd className="flex gap-0.5"><Kbd>⌘</Kbd><Kbd>K</Kbd></dd><dt className="text-ink-2">Search or run a command</dt>
			<dd className="flex gap-0.5"><Kbd>J</Kbd><Kbd>K</Kbd></dd><dt className="text-ink-2">Next and previous row</dt>
			<dd className="flex gap-0.5"><Kbd>⇧</Kbd><Kbd>H</Kbd></dd><dt className="text-ink-2">Snooze</dt>
			<dd className="flex gap-0.5"><Kbd>Esc</Kbd></dd><dt className="text-ink-2">Close</dt>
		</dl>
	);
}
```

## Related

- Button
- Dropdown menu
- Tooltip
- Switch
