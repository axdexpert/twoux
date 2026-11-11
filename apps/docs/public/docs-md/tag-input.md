# Tag input

Enter several short values that don't come from a list, typed or pasted, and see at once which are wrong: email addresses to invite, allowed domains, keywords.

Kind: component · Group: Actions and inputs · Status: built, import from @twoux/ui

## When to use

- For free values with no list to pick from: invite emails, allowed domains, search keywords.
- When people paste a list from a spreadsheet, an email client or another tool.

## When not to use

- When the values come from a list, such as skills or locations. Use Combobox (combobox) with multiple.
- For one value. Use a Text input (text-input).
- For labels on a record that people only read. Use Tag (tag).
- For many rows of values with several fields each. Use a Sheet grid (sheet-grid).

## Structure

1. Label
2. Field holding the tags, then the text input
3. Tag: text and remove button; an invalid tag adds an alert icon and its reason
4. Hint, or what just happened (added, already added, not added)
5. Count when there is a limit: 3 of 10
6. Error under the field

## Guidelines

- Enter, comma or leaving the field adds the typed text. Tab adds it only when there is text, so the field never traps focus.
- Pasted text is split on commas, semicolons, new lines and tabs, so a column from Excel or a list from Outlook works.
- A duplicate (ignoring case) isn't added again: the existing tag is highlighted and the hint line says it is already added.
- An invalid value stays as a marked tag with its reason; the error under the field counts them. Nothing is dropped without saying so.
- Values past the limit stay in the input, and the hint line says how many weren't added.
- Fix a value by pressing Enter on its tag, or double-clicking it: the text goes back into the input.

## Content

- The hint names the separators and the thing: Separate addresses with commas or new lines.
- Messages say what happened and what to do: "anna@acme.co.uk is already added.", "Not an email address.", "2 addresses aren't valid. Fix or remove them."

## Accessibility

- The tags are a list named by the field label. Each tag's name includes its reason when it isn't valid.
- Adding, removing and paste summaries ("12 added, 2 not valid") are announced politely.
- The field is one tab stop; arrow keys move between tags, so long lists don't flood the tab order.
- Error is shown with an icon and words as well as colour.

## Keyboard

| Keys | Action |
|---|---|
| Enter or comma | Add the typed text |
| ← or Backspace at the start of the input | Move to the last tag |
| ← → | Move between tags; → from the last tag returns to the input |
| Backspace / Delete (on a tag) | Remove it; focus moves to the tag before or after |
| Enter (on a tag) | Put its text back in the input to fix it |
| Esc (on a tag) | Return to the input |

## Examples

### invite

```tsx
import { TagInput } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Invite by email", description: "Type or paste addresses. Duplicates are reported, invalid ones stay marked with the reason. Try pasting: ben@acme.co.uk; anna@acme.co.uk; chris@acme", order: 1 };

const isEmail = (v: string) => (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? undefined : "Not an email address.");

export default function Example() {
	const [value, setValue] = useState<string[]>(["anna@acme.co.uk"]);
	return (
		<div className="w-96 max-w-full">
			<TagInput label="Email addresses" noun={{ one: "address", many: "addresses" }} value={value} onValueChange={setValue} validateValue={isEmail} max={10} name="invite" required />
		</div>
	);
}
```

### states

```tsx
import { TagInput } from "@twoux/ui";

export const meta = { title: "States", description: "Invalid values are counted under the field. Read-only tags stay focusable and readable.", order: 2 };

const noop = () => {};
const domain = (v: string) => (/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(v) ? undefined : "Not a domain, such as acme.co.uk.");

export default function Example() {
	return (
		<div className="grid w-96 max-w-full gap-4">
			<TagInput label="Allowed domains" noun={{ one: "domain", many: "domains" }} value={["acme.co.uk", "acme com", "acme.com"]} onValueChange={noop} validateValue={domain} />
			<TagInput label="Keywords" noun={{ one: "keyword", many: "keywords" }} value={["Data engineer", "Analytics", "Remote"]} onValueChange={noop} readOnly />
		</div>
	);
}
```

## Related

- Tag
- Combobox
- Text input
- Sheet grid
- Form validation
