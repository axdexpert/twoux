# Radio

Lets people choose exactly one option from a short, visible list in a form.

Kind: component · Group: Actions and inputs · Status: built, import from @twoux/ui

## When to use

- To pick one option from two to seven, when seeing all options helps the decision: Full time or Part time.
- When both choices need a visible explanation, which a single checkbox cannot give.
- Inside a form that is applied with a Save or Publish button.

## When not to use

- For eight or more options. Use a select or Dropdown menu.
- For several choices at once. Use Checkbox.
- To switch the view of data outside a form. Use Segmented control.
- For a single on/off setting. Use Checkbox or Switch.

## Structure

1. Group label (legend)
2. Radio circle (15px)
3. Option label
4. Option hint (optional)

## Guidelines

- Circle is 15px; selected shows a thick primary ring.
- Preselect the most likely or safest option. Never preselect a risky one.
- Add None when no choice is valid, since a radio group cannot be cleared.
- Stack options vertically. Inline is allowed for two short options, as in Full time / Part time.
- Order from most to least likely, or least to most risky.

## Content

- Labels short and parallel, ideally under three words.
- The legend asks or names the choice: Contract type.
- Avoid overlapping ranges in number options.

## Accessibility

- Native radios share a name, wrapped in fieldset and legend (or role="radiogroup" with a label).
- Tab enters the group on the selected option; arrow keys move and select.
- Labels are clickable so the target exceeds the 15px circle.
- Ring and border have 3:1 contrast against white.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move into the group, onto the selected option |
| Arrow keys | Move to and select the next or previous option |
| Space | Select the focused option if not selected |

## Examples

### group

```tsx
import { RadioField, RadioGroup } from "@twoux/ui";
export const meta = {"title": "Radio group", "description": "One choice from a short, visible list. Arrow keys move and select; Tab leaves the group.", "order": 1};

export default function Example() {
	return (
		<fieldset className="grid gap-2">
			<legend className="mb-1 text-sm font-medium text-ink">Contract</legend>
			<RadioGroup defaultValue="full">
				<RadioField id="r-full" value="full" label="Full time" />
				<RadioField id="r-part" value="part" label="Part time" hint="Under 30 hours a week." />
				<RadioField id="r-fixed" value="fixed" label="Fixed term" />
				<RadioField id="r-zero" value="zero" label="Zero hours" disabled />
			</RadioGroup>
		</fieldset>
	);
}
```

## Related

- Checkbox
- Segmented control
- Form validation
