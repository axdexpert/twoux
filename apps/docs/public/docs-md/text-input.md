# Text input

Lets people type a single line of text, such as a job title, a salary or a search term.

Kind: component · Group: Actions and inputs · Status: built, import from @twoux/ui

## When to use

- For short free text that cannot be listed in advance: job title, salary, a reference number. For dates use the Date picker (date-picker).
- For search inside a view, with a search icon and an accessible label.
- With a prefix or suffix for units the person should not type: £ and per year.

## When not to use

- To pick one option from a short known list. Use Radio buttons (up to seven) or a select.
- For a yes/no setting. Use a Checkbox or Switch.
- For choosing from existing categories. Use Combobox (combobox) so people choose instead of type; for several free values use Tag input (tag-input).

## Structure

1. Label
2. Required marker (optional)
3. Field with prefix/suffix (optional)
4. Hint text (optional)
5. Error message (when invalid)

## Guidelines

- 32px high, 6px radius, 13px text. Label sits above the field, left-aligned, 6px gap.
- Hint text sits under the field and stays visible while typing. Use it for format and examples.
- No placeholder in place of a label. Use placeholders only for a short example, or not at all.
- Focus shows an primary border and a soft 3px ring. Invalid shows a red border plus a text message under the field.
- Check the value when the person leaves the field, not while they type. Clear the error as soon as the value is fixed.
- Accept common variations (18000, 18,000, £18k) and convert them, then show the cleaned value.

## Content

- Labels are short nouns in sentence case without a colon: Job title, Salary, Closing date.
- Hint text says why or in what format: Shown on the listing and in search results.
- Mark required fields with an asterisk after the label.
- Error text uses UK English and says how to fix it: Enter at least £23,400.

## Accessibility

- Every field has a visible label tied to it with for/id. A placeholder is not a label.
- Link hint and error to the field with aria-describedby; set aria-invalid="true" when it fails.
- Field border needs 3:1 against the surface; typed text and hint text 4.5:1.
- The asterisk is decorative (aria-hidden). Use the required attribute so screen readers announce it.
- Error is not shown by colour alone: red border plus written message.

## Keyboard

| Keys | Action |
|---|---|
| Tab / Shift+Tab | Move into and out of the field |
| / | Focus the search field of the current view (single-key shortcut, can be turned off) |
| Esc | Leave the search field |

## Examples

### affixes

```tsx
import { InputGroup, InputGroupAddon, InputGroupInput, Kbd, TextField } from "@twoux/ui";
import { Search } from "lucide-react";

export const meta = { title: "Prefix and suffix", description: "Units, currency and icons sit inside the field so the value reads as one thing. Built on shadcn's InputGroup.", order: 2 };

export default function Example() {
	return (
		<div className="grid w-80 gap-4">
			<TextField label="Salary" prefix="£" suffix="per year" defaultValue="32,000" inputMode="numeric" />
			<InputGroup>
				<InputGroupAddon><Search /></InputGroupAddon>
				<InputGroupInput aria-label="Search listings" placeholder="Search listings" />
				<InputGroupAddon align="inline-end"><Kbd>/</Kbd></InputGroupAddon>
			</InputGroup>
		</div>
	);
}
```

### field

```tsx
import { TextField } from "@twoux/ui";

export const meta = { title: "With label and hint", description: "Every input has a visible label. The hint says what good input looks like. TextField links label, hint and error to the input for screen readers.", order: 1 };

export default function Example() {
	return (
		<div className="grid w-80 gap-4">
			<TextField label="Job title" hint="Shown on the listing and in search results." required defaultValue="Junior Product Designer" />
			<TextField label="Hiring manager" optional placeholder="Search people" />
		</div>
	);
}
```

### password

```tsx
import { InputGroupButton, TextField } from "@twoux/ui";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const meta = { title: "Password with live feedback", description: "Type to see the message switch from what is missing to a green confirmation. The show and hide button names its action for screen readers. Pattern from Clerk.", order: 4 };

export default function Example() {
	const [value, setValue] = useState("correct-horse-42");
	const [show, setShow] = useState(false);
	const ok = value.length >= 8;
	return (
		<div className="w-80">
			<TextField
				label="Password"
				type={show ? "text" : "password"}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				error={value && !ok ? "Use 8 or more characters." : undefined}
				success={ok ? "Your password meets the requirements." : undefined}
				suffix={
					<InputGroupButton size="icon-xs" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((s) => !s)}>
						{show ? <EyeOff /> : <Eye />}
					</InputGroupButton>
				}
			/>
		</div>
	);
}
```

### states

```tsx
import { TextField } from "@twoux/ui";

export const meta = { title: "States", description: "Error replaces the hint and says how to fix it. Disabled fields keep their value readable.", order: 3 };

export default function Example() {
	return (
		<div className="grid w-80 gap-4">
			<TextField label="Salary" prefix="£" defaultValue="18,000" required error="Enter at least £23,400, the UK minimum for a full-time role." />
			<TextField label="Listing ID" defaultValue="LST-1041" disabled />
		</div>
	);
}
```

## Related

- Form validation
- Date picker
- Combobox
- Tag input
- Tooltip
- Keyboard shortcut hint
- Sign in
- Onboarding step
- File drop
