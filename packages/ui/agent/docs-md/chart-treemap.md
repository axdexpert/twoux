# Treemap

Parts of a total as nested rectangles sized by value: squarified so tiles stay readable, names only where they fit, and the tail folded into Other after 12 tiles.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- Showing which of many items make up most of a total, such as cloud spend by service.
- A total with one level of grouping, where the groups matter as well as the items.

## When not to use

- To compare items precisely. Use the TwoUX Bar chart, because areas are read less exactly than lengths.
- For five parts or fewer. Use the TwoUX Share bar.

## Structure

1. Title and subtitle
2. Tiles sized by value, with 2px surface gaps
3. Name and share inside tiles that can hold them
4. Other tile in grey
5. Legend of groups when there are two or more
6. Tooltip: name, value, share, group

## Guidelines

- Keep to 12 tiles; the rest fold into a grey Other.
- Use the squarified layout so tiles stay close to square and readable.
- Without groups every tile is one colour; with groups each group takes its series colour and a legend. Never colour tiles by value.
- Print a name only where it fits and a share only where there is room; never clip text.
- Values go in the tooltip and the Table view.
- Use ChartFrame for the four states: loading keeps the frame, an error says what failed with Try again, an empty period says so, and no match offers Clear filters.

## Content

- Short tile names; the full name is in the tooltip and table.
- Subtitle gives the period and scope, such as October 2026, all projects.

## Accessibility

- 1.4.1 Use of Color: groups are named in the legend and the tooltip; every value is in the table.
- 1.1.1 and WAI complex images: the chart has a short generated summary as its accessible name and a Table view with every value.
- 2.1.1 Keyboard: the chart is one tab stop; arrow keys move between marks and show the same tooltip as hover.
- 1.4.13 Content on Hover or Focus: the tooltip never covers the mark it describes, stays while the pointer is over the chart and closes with Esc.
- Accessible description: "Treemap showing cloud spend by service, October 2026."

## Keyboard

| Keys | Action |
|---|---|
| Tab | Focus the chart |
| ← → ↑ ↓ | Move to the previous or next mark and show its values |
| Home End | Jump to the first or last mark |
| Esc | Hide the tooltip |

## Examples

### cloud-spend

```tsx
import { ChartFrame, shareTable, Treemap } from "@twoux/ui";

export const meta = { title: "Cloud spend by service", description: "Fifteen services in three groups: the twelfth tile onwards fold into Other. Names show only on tiles big enough to hold them.", order: 1 };

const ITEMS = [
	{ id: "vm", label: "Virtual machines", value: 48_200, group: "Compute" },
	{ id: "k8s", label: "Kubernetes", value: 31_400, group: "Compute" },
	{ id: "fn", label: "Functions", value: 6_900, group: "Compute" },
	{ id: "gpu", label: "GPU instances", value: 22_800, group: "Compute" },
	{ id: "obj", label: "Object storage", value: 18_600, group: "Storage" },
	{ id: "block", label: "Block storage", value: 12_100, group: "Storage" },
	{ id: "backup", label: "Backups", value: 5_400, group: "Storage" },
	{ id: "pg", label: "Postgres", value: 19_700, group: "Data" },
	{ id: "wh", label: "Warehouse", value: 15_300, group: "Data" },
	{ id: "cache", label: "Cache", value: 4_200, group: "Data" },
	{ id: "stream", label: "Streaming", value: 3_900, group: "Data" },
	{ id: "search", label: "Search", value: 2_800, group: "Data" },
	{ id: "dns", label: "DNS", value: 600, group: "Compute" },
	{ id: "logs", label: "Log archive", value: 1_100, group: "Storage" },
	{ id: "etl", label: "ETL jobs", value: 900, group: "Data" },
];
const gbp = (n: number) => `£${n.toLocaleString("en-GB")}`;

export default function Example() {
	return (
		<ChartFrame className="w-full" title="Cloud spend by service" description="October 2026, all projects" table={shareTable(ITEMS, gbp, "Service")} height={260}>
			<Treemap items={ITEMS} format={gbp} aria-label="Cloud spend by service, October 2026" />
		</ChartFrame>
	);
}
```

## Related

- Share bar
- Bar chart
- Donut chart
