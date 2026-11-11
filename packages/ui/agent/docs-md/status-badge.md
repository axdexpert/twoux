# Status badge

Shows the system state of a record, such as Live, Draft or Closed early, in one short word or phrase.

Kind: component · Group: Actions and inputs · Status: built, import from @twoux/ui

## When to use

- To show workflow or system state of a listing or candidate: Live, Expires in 3 days, Closed early, Draft.
- In table rows, where a word reads faster than an icon alone.
- Next to the object it describes, never floating on its own.

## When not to use

- For user-made categories such as Design or Graduate scheme. Use Tag.
- To start an action or change state. Use a Dropdown menu or Button; the badge is static.
- For counts on tabs or filters. Use a plain count next to the label.

## Structure

1. Bordered container (20px)
2. Status text
3. Dot or icon (optional)

## Guidelines

- 20px high, 4px radius, 12px medium text, 1px border in the tone colour on a tinted background.
- Five tones with fixed meaning: ok (green), warn (amber), bad (red), mute (grey), accent (primary, for Featured).
- Match the tone to the meaning, not to how much attention you want.
- Keep the same tone for the same status everywhere in the product.
- Do not truncate. If the text is long, rewrite it; badges cannot be focused to reveal the rest.

## Content

- One to three words, sentence case: Expires in 3 days, not EXPIRING SOON.
- Use plain words people use, not system codes.
- Prefer a specific state over a vague one: Closed early, not Inactive.

## Accessibility

- The text carries the meaning; colour only reinforces it.
- Text on the tinted background needs 4.5:1; the border 3:1 is not required because the text identifies it.
- Badges are not interactive: no tabindex, no tooltip that holds needed information.
- When a status changes live (for example after an agent run), announce it with a status message.

## Examples

### dot

```tsx
import { Badge } from "@twoux/ui";

export const meta = {
	title: "With dot",
	description: "A leading dot helps scanning down a long column. The word stays.",
	order: 2,
};

export default function Example() {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<Badge variant="success" dot>Live</Badge>
			<Badge variant="warning" dot>Needs you</Badge>
			<Badge variant="destructive" dot>Failed</Badge>
		</div>
	);
}
```

### in-table

```tsx
import { Badge } from "@twoux/ui";

export const meta = {
	title: "In a table",
	description: "One badge per row, in its own column, left aligned so the words line up.",
	order: 3,
};

const rows = [
	["Junior Product Designer", "success", "Live", "86"],
	["Graduate Data Analyst", "warning", "Expires in 3 days", "54"],
	["Marketing Assistant", "secondary", "Draft", "0"],
	["Customer Success Associate", "destructive", "Closed early", "19"],
] as const;

export default function Example() {
	return (
		<table className="w-full max-w-xl border-collapse overflow-hidden rounded-sm border border-line-strong bg-surface text-left">
			<thead>
				<tr className="h-8 bg-surface-2 text-sm text-ink-2">
					<th className="px-3 font-medium">Role</th>
					<th className="px-3 font-medium">Status</th>
					<th className="px-3 text-right font-medium">Applies</th>
				</tr>
			</thead>
			<tbody>
				{rows.map(([role, variant, label, applies]) => (
					<tr key={role} className="h-row border-t border-line">
						<td className="px-3 font-medium">{role}</td>
						<td className="px-3"><Badge variant={variant}>{label}</Badge></td>
						<td className="tabular px-3 text-right">{applies}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
```

### statuses

```tsx
import { Badge } from "@twoux/ui";

export const meta = {
	title: "Record status",
	description: "Always a word. Colour repeats the meaning but never carries it alone.",
	order: 1,
};

export default function Example() {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<Badge variant="success">Live</Badge>
			<Badge variant="warning">Expires in 3 days</Badge>
			<Badge variant="destructive">Closed early</Badge>
			<Badge variant="secondary">Draft</Badge>
			<Badge variant="default">Featured</Badge>
		</div>
	);
}
```

## Related

- Tag
- Tooltip
- Tabs (underline)
