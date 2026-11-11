# Empty state

What a list, table or panel shows when it loaded correctly but has nothing to show, with the next step.

Kind: component · Group: Feedback and overlays · Status: built, import from @twoux/ui

## When to use

- Filters or search match nothing: "No listings match these filters".
- Nothing has been created yet, such as a team with no listings.
- A queue is cleared, such as the Inbox: "All caught up".

## When not to use

- Data is still loading. Use the Loading skeleton.
- Loading failed. Use the Error state, never an empty message.
- Only part of a record is missing, such as one field. Show "Add" in the field itself.

## Structure

1. Icon tile (32px, neutral)
2. Title: the state, sentence case, no full stop
3. Description: why, and what to try (max 36 characters wide per line block)
4. One action (secondary button), or none for a finished state
5. Dashed container sized to the region it replaces

## Guidelines

- Replace the region that would hold the data, inside the same container, so filters and the result count stay in place.
- Distinguish no data (nothing created) from no results (filters too narrow); they need different actions.
- Give one next step: Clear filters for no results, the create action for no data. Never leave a dead end.
- Keep the result count visible ("0 of 24") so the person sees the filters, not the data, caused the empty view.
- Show the empty state only after loading finishes; never as placeholder text that is later replaced.

## Content

- Title names the state plainly and briefly: "No listings match these filters".
- Description says why and what to try, without repeating the title: "Try a wider date range, or clear the location filter."
- Button label starts with a verb and matches the next step: "Clear filters", "New listing".
- Neutral tone for no results; a short positive line for a finished queue. No jokes, no apologies.

## Accessibility

- Replace the whole table, headers included, so screen readers do not read an empty structure first (1.3.1).
- When filtering produces zero results, announce the new count through a polite live region (4.1.3).
- The icon is decorative and has empty alt text.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Reaches the single action |
| F | Opens the filter picker to change filters instead of clearing them |

## Examples

### no-data

```tsx
import { Button, Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@twoux/ui";
import { BriefcaseBusiness, Plus } from "lucide-react";

export const meta = { title: "No data yet", description: "Nothing has been created. The one action is the create action, not Clear filters.", order: 2 };

export default function Example() {
	return (
		<Empty className="w-full max-w-xl">
			<EmptyHeader>
				<EmptyMedia variant="icon"><BriefcaseBusiness /></EmptyMedia>
				<EmptyTitle>No listings yet</EmptyTitle>
				<EmptyDescription>Listings you publish appear here, with their applicants.</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button variant="outline" size="sm"><Plus />New listing</Button>
			</EmptyContent>
		</Empty>
	);
}
```

### no-results

```tsx
import { Badge, Button, Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@twoux/ui";
import { SearchX, X } from "lucide-react";
import { useState } from "react";

export const meta = { title: "No results", description: "Filters are too narrow. The empty state replaces the table only; the filters and the count stay, so it is clear the filters caused it. One action: Clear filters.", order: 1 };

export default function Example() {
	const [filtered, setFiltered] = useState(true);
	return (
		<div className="grid w-full max-w-xl gap-2">
			<div className="flex items-center gap-2">
				<span className="text-base font-medium text-ink">Listings</span>
				{filtered && (
					<Badge variant="secondary" className="gap-1">
						Location: Inverness
						<Button variant="ghost" size="icon-xs" aria-label="Remove filter Location: Inverness" onClick={() => setFiltered(false)} className="-mr-1 size-4"><X className="size-3" /></Button>
					</Badge>
				)}
				<span className="ml-auto text-sm text-ink-3 tabular">{filtered ? "0 of 24" : "24 of 24"}</span>
			</div>
			{filtered ? (
				<Empty className="min-h-56">
					<EmptyHeader>
						<EmptyMedia variant="icon"><SearchX /></EmptyMedia>
						<EmptyTitle>No listings match these filters</EmptyTitle>
						<EmptyDescription>Try another location, or clear the filters to see all 24.</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button variant="outline" size="sm" onClick={() => setFiltered(false)}>Clear filters</Button>
					</EmptyContent>
				</Empty>
			) : (
				<div className="grid min-h-56 place-items-center rounded-sm border border-line text-base text-ink-2">24 listings</div>
			)}
		</div>
	);
}
```

## Related

- Loading skeleton
- Error state (failed to load)
- Inbox (triage)
- Setup checklist
