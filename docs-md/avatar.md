# Avatar and avatar stack

Shows who owns or is linked to a record, as a photo or initials, and several people as an overlapping stack with +N.

Kind: component · Group: Actions and inputs · Status: built, import from @twoux/ui

## When to use

- To show the owner of a listing or the recruiter on a candidate, next to their name or in a table cell.
- A stack when several people relate to one record and space is short.

## When not to use

- When each person must be clearly identified. List names in full.
- For a single person in a stack. Use one avatar.
- For teams or categories. Use Tag.

## Structure

1. Circle (22px)
2. Photo or initials
3. Stack: overlapping avatars with 2px white ring
4. +N overflow count

## Guidelines

- 22px circle, 10px semibold white initials on a colour assigned per person; photo when one exists.
- Stack shows up to three, overlapping by 6px with a 2px white ring, then +N in small grey text.
- +N reveals the hidden names on hover or focus.
- Each person keeps the same colour everywhere.

## Content

- Initials stand in when there is no photo, and are hidden from screen readers when the name is shown.
- The +N count says how many people are hidden, not the total.
- Tooltips on avatars show the full name, matching the alt text.

## Accessibility

- Standalone avatars have alt text with the person's name; next to a visible name they are decorative (empty alt).
- A stack has a label (for example Candidates) and screen reader text for +N: 3 more candidates.
- White initials need 4.5:1 on the assigned colour; pick colours that pass.
- If the avatar opens a tooltip or popover it must be focusable.
- Interactive avatars are 22px, so keep 24px spacing from other targets.

## Keyboard

| Keys | Action |
|---|---|
| Tab to +N | Focus the overflow count and show hidden names |

## Examples

### people

```tsx
import { AvatarStack, PersonAvatar } from "@twoux/ui";

export const meta = { title: "Owners and interviewers", description: "Initials on a colour fixed per person (white text at 5.8:1 or more). A stack shows three, then +N, which names the rest on hover or focus.", order: 1 };

export default function Example() {
	return (
		<div className="grid gap-4">
			<div className="flex items-center gap-3">
				<PersonAvatar name="Priya Shah" size="lg" /><PersonAvatar name="Tom Becker" /><PersonAvatar name="Amara Okafor" size="sm" />
				<span className="text-base text-ink-2">Priya Shah owns this listing</span>
			</div>
			<div className="flex items-center gap-3">
				<AvatarStack label="Interviewers" people={[{ name: "Priya Shah" }, { name: "Tom Becker" }, { name: "Amara Okafor" }, { name: "Liam Walsh" }, { name: "Sofia Romano" }]} />
				<span className="text-base text-ink-2">5 interviewers</span>
			</div>
		</div>
	);
}
```

## Related

- Tag
- Tooltip
- Status badge
- Provider logo
