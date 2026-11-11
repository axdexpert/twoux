# Form validation

Tells people which fields need fixing and how, at the field and in a summary at the top on submit.

Kind: component · Group: Actions and inputs · Status: built, import from @twoux/ui

## When to use

- On any form where a value can be wrong or missing: a new listing, a salary, a closing date.
- Field errors as soon as the person leaves a field with a wrong value.
- The summary strip when someone submits and one or more fields fail.

## When not to use

- For errors not tied to a field, such as a server failure. Use a banner above the form or the table error state.
- To confirm success on every field. Use a Toast for the completed action instead.
- Before the person has touched the field. Leave untouched fields neutral until submit.

## Structure

1. Error summary strip (on submit)
2. Count of problems
3. Go to first link
4. Field with red border
5. Inline error message

## Guidelines

- Check a field when the person leaves it. Recheck on each keystroke once it is in error, and clear the error when fixed.
- On submit, check the whole form. Show the red strip at the top: 2 fields need fixing before you can publish.
- The strip has a Go to first link that scrolls to and focuses the first field in error.
- The summary adds to inline errors; it never replaces them.
- Message sits directly under the field, replacing the hint, in 12px red text.
- Keep everything the person typed. Never clear a form on error.

## Content

- Say what to do, not what went wrong in system terms: Pick a date after today.
- For empty fields, instruct: Enter a job title. For wrong values, describe the limit: Enter at least £23,400.
- No please, sorry, oops, invalid or blaming words.
- Use the field label in the message so it reads as one thing, and use the same words in the summary.
- The summary counts problems in plain words: 2 fields need fixing before you can publish.

## Accessibility

- Each failed field has aria-invalid="true" and aria-describedby pointing at its message.
- Errors are in text, not only red. The border colour is a second cue.
- The strip uses role="alert" so it is announced at once; Go to first moves focus to the field.
- Messages suggest a fix whenever the system knows one.
- Red text and the red border meet 4.5:1 and 3:1 on white.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Leave a field and trigger its check |
| Enter on Go to first | Move focus to the first field in error |

## Examples

### summary

```tsx
import { Button, ErrorSummary, TextField } from "@twoux/ui";
import { useState } from "react";
export const meta = {"title": "Validate on submit, then summarise", "description": "Press Publish. On submit, each field shows its own error and the summary at the top counts the problems and links to each field.", "order": 1};

export default function Example() {
	const [title, setTitle] = useState("");
	const [salary, setSalary] = useState("18000");
	const [sent, setSent] = useState(false);
	const errs = [
		!title.trim() && { field: "Job title", message: "Enter a job title.", href: "#fv-title" },
		Number(salary.replace(/\D/g, "")) < 23400 && { field: "Salary", message: "Enter at least £23,400.", href: "#fv-salary" },
	].filter(Boolean) as { field: string; message: string; href: string }[];
	const show = sent ? errs : [];
	return (
		<form className="grid w-96 gap-4" noValidate onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
			<ErrorSummary errors={show} />
			<TextField id="fv-title" label="Job title" required error={show.find((e) => e.field === "Job title")?.message} value={title} onChange={(e) => setTitle(e.target.value)} />
			<TextField id="fv-salary" label="Salary" required hint="Per year, before tax." error={show.find((e) => e.field === "Salary")?.message} prefix="£" value={salary} onChange={(e) => setSalary(e.target.value)} inputMode="numeric" />
			<div><Button type="submit" variant="default">Publish listing</Button></div>
		</form>
	);
}
```

## Related

- Text input
- Button
- Checkbox
- Radio
- Sign in
- File drop
