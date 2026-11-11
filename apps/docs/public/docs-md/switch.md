# Switch

Turns one setting on or off with immediate effect, without a Save button.

Kind: component · Group: Actions and inputs · Status: built, import from @twoux/ui

## When to use

- For a setting that applies the moment it is flipped: Email me when someone applies.
- For preferences in popovers and panels: Wrap long text, Single-key shortcuts.
- When the label describes the on state clearly enough on its own.

## When not to use

- In a form that needs Save or Publish. Use Checkbox.
- When both states need explaining, such as cost differences. Use Radio.
- For more than two options. Use Radio or Segmented control.

## Structure

1. Track (28 x 16px)
2. Thumb
3. Label
4. Description (optional)

## Guidelines

- Track 28 x 16px, thumb 12px. On fills primary; off is grey.
- The change applies at once. Confirm it with a short toast when the effect is not visible on screen.
- Label to the left in settings rows, right of the switch in inline lists; keep one pattern per surface.
- If disabled, say why nearby.
- Movement of the thumb is the main cue; colour is the second.

## Content

- Label says what is on when the switch is on. Read it with on/off after it to test.
- The label never changes with the state.
- Lead with the key word, no question: Single-key shortcuts, not Do you want single-key shortcuts?

## Accessibility

- Use role="switch" (or a native checkbox) with aria-checked true/false.
- Space toggles; Enter may also toggle.
- Label tied with for/id so the label row is part of the target; the 28 x 16 track alone is under 24px high.
- Off track and on fill need 3:1 against the surface.
- Changing a switch must not move focus or open a new view.

## Keyboard

| Keys | Action |
|---|---|
| Space | Toggle the focused switch |
| Enter | Also toggles (optional) |

## Examples

### settings

```tsx
import { SwitchField } from "@twoux/ui";
export const meta = {"title": "Settings that apply at once", "description": "A switch changes something immediately, so there is no Save button. The label says what is on.", "order": 1};

export default function Example() {
	return (
		<div className="grid w-96 gap-4 rounded-sm border border-line bg-surface p-4 shadow-card">
			<SwitchField id="sw-email" label="Email me when someone applies" hint="One email per applicant." defaultChecked />
			<SwitchField id="sw-keys" label="Single-key shortcuts" hint="Turn off if you use a screen reader or voice control." defaultChecked />
			<SwitchField id="sw-digest" label="Weekly summary" disabled />
		</div>
	);
}
```

## Related

- Checkbox
- Segmented control
- Keyboard shortcut hint
