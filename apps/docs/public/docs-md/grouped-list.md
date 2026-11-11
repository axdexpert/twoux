# Grouped list

A compact list of records split under group headers (such as candidates by stage), each header showing its count.

Kind: component · Group: Data · Status: built, import from @twoux/ui

## When to use

- Records fall into a small number of meaningful groups that people scan one at a time, such as pipeline stages.
- A short list where a full table would be heavy; simple vertical content reads better as a simple list.

## When not to use

- When people sort or compare many attributes across all records. Use the TwoUX List table.
- For nested hierarchies more than one level deep. Use a tree.
- For more than about seven groups at once; split with a filter or Saved view instead.

## Structure

1. Group header (name, count, optional action)
2. Rows: ID, title, secondary text, owner avatar, date
3. Divider between rows

## Guidelines

- Each group header has a tinted background so rows read as belonging to it.
- Show the count beside every group name.
- Keep the same row layout in every group so columns line up down the list.
- Allow groups to collapse when lists are long.

## Content

- Group names are the states people use, "Interviewing", "Screening", "Offer accepted".
- Order groups by workflow, not alphabetically.
- Keep row text to the ID, name, role, owner and date; open the row for more.

## Accessibility

- 1.3.1 Info and Relationships: each group is a list with a heading, so the grouping is available to assistive technology.
- APG disclosure pattern: collapsible headers are buttons with aria-expanded.
- 2.1.1 Keyboard: J and K move through rows across groups, as in the List table.

## Keyboard

| Keys | Action |
|---|---|
| J / K | Move to the next or previous row |
| Enter | Open the row |
| Enter / Space (header) | Collapse or expand the group |

## Examples

### by-stage

```tsx
import { Badge, Button, GroupedList, ListGroup } from "@twoux/ui";

export const meta = { title: "Candidates by stage", description: "Each tinted header names the group and counts it. Every row keeps the same layout so columns line up. Headers collapse with Enter or Space.", order: 1 };

const STAGES = [
	{ stage: "Interview", people: [["Priya Shah", "Frontend Engineer", "28 Oct"], ["Sofia Romano", "Junior Product Designer", "20 Oct"]] },
	{ stage: "Screen", people: [["Amara Okafor", "Junior Product Designer", "2 Nov"]] },
	{ stage: "Applied", people: [["Tom Becker", "Frontend Engineer", "4 Nov"], ["Liam Walsh", "Data Analyst", "5 Nov"], ["Hana Kim", "QA Engineer", "5 Nov"]] },
];

export default function Example() {
	return (
		<GroupedList className="w-full max-w-xl" aria-label="Candidates by stage">
			{STAGES.map((g) => (
				<ListGroup key={g.stage} title={g.stage} count={g.people.length} defaultOpen={g.stage !== "Applied"} action={g.stage === "Applied" ? <Button variant="ghost" size="xs">Screen all</Button> : undefined}>
					{g.people.map(([name, role, date]) => (
						<li key={name} className="grid h-9 grid-cols-[1fr_auto_auto] items-center gap-3 px-3 text-base hover:bg-hover">
							<span className="min-w-0 truncate"><span className="font-medium text-ink">{name}</span> <span className="text-ink-3">· {role}</span></span>
							<Badge variant="secondary">{g.stage}</Badge>
							<span className="tabular w-14 text-right text-sm text-ink-3">{date}</span>
						</li>
					))}
				</ListGroup>
			))}
		</GroupedList>
	);
}
```

## Related

- List table
- Saved views
- Filter pills and filter bar
