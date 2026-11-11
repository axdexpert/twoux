# Tag

Labels a record with a category people chose, such as Design, Hybrid or Graduate scheme.

Kind: component · Group: Actions and inputs · Status: built, import from @twoux/ui

## When to use

- For descriptive categories that classify or group records: team, contract type, work mode.
- For user-defined values that people add and remove.
- When one record belongs to several categories.

## When not to use

- For system state such as Live or Closed. Use Status badge.
- As a button. Use Button or a selectable control.

## Structure

1. Container (22px, 4px corners)
2. Colour dot (optional)
3. Text
4. Remove button (optional)

## Guidelines

- 22px high, 4px corners, white with a 1px grey border, 12px text, so it reads quieter than a status badge. Not fully round: in TwoUX a pill means a filter you can remove.
- Add a colour dot only when the colour means something, such as the team.
- Removable tags put a small x after the text.
- Show up to three in a table cell; summarise the rest as +N so the row stays scannable.
- Never wrap a tag over two lines. Truncate with a tooltip showing the full text.

## Content

- One or two words, ideally under 20 characters.
- Sentence case unless a proper noun: Graduate scheme, not Graduate Scheme.
- Use the same wording everywhere so filters match.

## Accessibility

- Text contrast 4.5:1 on white; the dot is decorative and hidden from assistive technology.
- The remove button is a real button named Remove Design.
- Remove buttons need a 24px target or enough spacing from neighbours.
- Colour never carries the only meaning; the text names the category.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move to a removable tag's remove button |
| Enter / Space | Remove the tag |

## Examples

### tags

```tsx
import { Tag, TagList } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Categories on a listing", description: "Tags are quieter than status badges and have 4px corners (pills mean filters). A dot only when the colour means something. In a table cell, three at most, then +N.", order: 1 };

export default function Example() {
	const [tags, setTags] = useState(["Design", "Hybrid", "Graduate scheme"]);
	return (
		<div className="grid gap-4">
			<div className="flex flex-wrap gap-1.5">{tags.map((t, i) => <Tag key={t} color={i === 0 ? "var(--color-c1)" : undefined} onRemove={() => setTags((x) => x.filter((y) => y !== t))}>{t}</Tag>)}</div>
			<div className="flex items-center gap-3 text-base text-ink-2">In a table cell: <TagList tags={["Engineering", "Remote", "Senior", "Visa sponsorship", "Urgent"]} /></div>
		</div>
	);
}
```

## Related

- Status badge
- Avatar and avatar stack
- Tag input
- Combobox
