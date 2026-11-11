# Filter panel

A side panel of collapsible filter sections for searches with many fields, with live counts per option and a main action that says how many rows it will act on.

Kind: component · Group: Data · Status: built, import from @twoux/ui

## When to use

- Search across many dimensions at once, such as candidates by location, team, experience and salary. That is faceted navigation.
- People set filters across several categories, which work best placed vertically on the left.
- People need counts per option to avoid zero-result combinations.

## When not to use

- For two or three filters on a table. Use the TwoUX Filter bar so filters stay inline.
- Inside a dropdown or menu when there are several categories; multiple categories should never go in a menu.
- For saved combinations people reuse. Use TwoUX Saved views.

## Structure

1. Header (Filters, count of active filters, Clear all)
2. Collapsible sections with set-value count
3. Options with result counts
4. Results table
5. Footer ("Showing 5 of 412 candidates", Save search, main action with count)

## Guidelines

- Sections collapse, and each closed section shows how many values are set.
- Show the most used sections open and the rest collapsed.
- Each option shows how many results it matches.
- The result count updates live and the main action states its scope, "Add 412 to pipeline".
- Offer Clear all for the panel and a clear per section.

## Content

- Section titles are the field names people use, not database names.
- Write "Any team" or "Any time" when a section has no value, so the default is explicit.
- Keep counts in the same place on every option so they scan down the column.

## Accessibility

- APG disclosure pattern: each section header is a button with aria-expanded; Enter or Space toggles it.
- 4.1.3 Status Messages: the live result count is announced as a full phrase, "412 candidates".
- 2.1.1 Keyboard: every section, option and Clear all can be reached and used from the keyboard.
- 1.3.1 Info and Relationships: options are grouped under their section with a group label.

## Keyboard

| Keys | Action |
|---|---|
| Tab / ⇧Tab | Move between sections and controls |
| Enter / Space (section) | Expand or collapse the section |
| Space (option) | Tick or untick an option |

## Examples

### candidates

```tsx
import { Button, FilterPanel, type FilterSection, Table, TableBody, TableCell, TableRow, toast } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Search candidates by many fields", description: "Sections collapse and show how many values are set. Each option shows its count. The footer says what the main action will affect.", order: 1 };

const PEOPLE = [
	{ name: "Amara Okafor", stage: "Screen", source: "Referral", location: "Leeds" },
	{ name: "Tom Becker", stage: "Applied", source: "Job board", location: "Manchester" },
	{ name: "Priya Shah", stage: "Interview", source: "Careers page", location: "London" },
	{ name: "Liam Walsh", stage: "Applied", source: "Job board", location: "Leeds" },
	{ name: "Sofia Romano", stage: "Offer", source: "Agency", location: "Remote (UK)" },
	{ name: "Hana Kim", stage: "Screen", source: "Job board", location: "Glasgow" },
];
type K = "stage" | "source" | "location";

export default function Example() {
	const [value, setValue] = useState<Record<string, string[]>>({ stage: ["Applied", "Screen"] });
	const match = (p: (typeof PEOPLE)[number], skip?: K) => (Object.entries(value) as [K, string[]][]).every(([k, v]) => k === skip || !v.length || v.includes(p[k]));
	const rows = PEOPLE.filter((p) => match(p));
	const section = (id: K, title: string, open?: boolean): FilterSection => ({ id, title, defaultOpen: open, options: [...new Set(PEOPLE.map((p) => p[id]))].sort().map((v) => ({ value: v, label: v, count: PEOPLE.filter((p) => match(p, id) && p[id] === v).length })) });
	return (
		<div className="grid h-96 w-full grid-cols-[240px_1fr] overflow-hidden rounded-sm border border-line bg-surface max-md:grid-cols-1">
			<FilterPanel className="border-r border-line" value={value} onChange={setValue} sections={[section("stage", "Stage", true), section("source", "Source", true), section("location", "Location")]} />
			<div className="flex min-h-0 flex-col">
				<div className="min-h-0 flex-1 overflow-auto">
					<Table aria-label="Candidates"><TableBody>{rows.map((p) => <TableRow key={p.name}><TableCell className="font-medium text-ink">{p.name}</TableCell><TableCell className="text-ink-2">{p.stage}</TableCell><TableCell className="text-ink-2">{p.location}</TableCell></TableRow>)}</TableBody></Table>
				</div>
				<div className="flex items-center justify-between gap-2 border-t border-line px-3 py-2">
					<span className="tabular text-sm text-ink-2" aria-live="polite">Showing {rows.length} of {PEOPLE.length} candidates</span>
					<Button size="sm" disabled={!rows.length} onClick={() => toast.success(`Added ${rows.length} to the pipeline`)}>Add {rows.length} to pipeline</Button>
				</div>
			</div>
		</div>
	);
}
```

## Related

- Filter pills and filter bar
- Saved views
- List table
- Bulk action bar
