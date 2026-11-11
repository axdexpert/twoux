# Separator

A thin line that divides groups of content or menu items. With a label, it separates two ways of doing the same thing, such as “or”.

Kind: component · Group: Content · Status: built, import from @twoux/ui

## When to use

- To divide groups inside a card, panel or menu when spacing alone is not enough.
- With a label, between two routes to the same result: “or” between sign in with Google and the email form.

## When not to use

- Between every row or field. Use spacing; lines everywhere add noise.
- To separate sections of a page. Use headings and space.

## Structure

1. Line: 1px, light edge colour
2. Label (optional): short word centred on the line, on the surface colour

## Guidelines

- Prefer space first. Add a line only where groups would otherwise run together.
- Keep the label to one or two words in lower case: “or”, “or continue with”.
- Lines run the full width of their container, or align with the content inset in menus.

## Content

- Label in lower case with no full stop: “or”.

## Accessibility

- A purely visual line is decorative, so screen readers skip it. Mark it as a separator only when it divides a menu or a toolbar.
- The label is real text, so it is read in order between the two groups.

## Keyboard

| Keys | Action |
|---|---|
| None | Not focusable |

## Examples

### plain-and-labelled

```tsx
import { FieldSeparator, Separator } from "@twoux/ui";

export const meta = { title: "Plain and labelled", description: "A plain line divides groups when space alone is not enough. A labelled one sits between two routes to the same result.", order: 1 };

export default function Example() {
	return (
		<div className="grid w-full max-w-sm gap-6">
			<div className="grid gap-3 rounded-sm border border-line bg-surface p-4">
				<div className="grid gap-0.5">
					<span className="text-base font-medium text-ink">Senior Product Designer</span>
					<span className="text-sm text-ink-3">Leeds · Hybrid</span>
				</div>
				<Separator />
				<div className="flex justify-between text-base text-ink-2">
					<span>Applicants</span>
					<span className="tabular text-ink">38</span>
				</div>
			</div>
			<FieldSeparator>or</FieldSeparator>
		</div>
	);
}
```

## Related

- Card
- Dropdown menu
