# Sankey chart

Flows from left to right across two or three columns, such as traffic sources to pages to outcomes. Link width shows value; hover or focus highlights a path.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- Showing how a quantity splits and recombines across stages, such as visits from sources to pages to outcomes.
- Finding the largest flows into a loss, such as where people leave.

## When not to use

- For ordered stages where each is a subset of the last. Use the TwoUX Funnel.
- For more than three columns or about 12 nodes; split it or use a table.

## Structure

1. Title and subtitle
2. Columns of nodes
3. Links, width by value
4. Labels: name, value and share of column
5. Highlighted path on hover or focus
6. Tooltip: from, to, value, share of source

## Guidelines

- Keep to two or three columns and about 12 nodes.
- Link width is proportional to value; links use one hue at low opacity so overlaps stay readable.
- Hovering a node lights every flow through it; hovering a link lights that link.
- Labels give name, value and share of the column when there is room; on narrow screens names only.
- The Table view lists every flow as from, to and value.
- Use ChartFrame for the four states: loading keeps the frame, an error says what failed with Try again, an empty period says so, and no match offers Clear filters.

## Content

- Name the last column by outcome (Started trial, Left), not by page.
- Shares are of the column, so each column adds to 100%.

## Accessibility

- 1.1.1 and WAI complex images: the chart has a short generated summary as its accessible name and a Table view with every value.
- 2.1.1 Keyboard: the chart is one tab stop; arrow keys move between marks and show the same tooltip as hover.
- 1.4.13 Content on Hover or Focus: the tooltip never covers the mark it describes, stays while the pointer is over the chart and closes with Esc.
- Accessible description: "Sankey chart showing visits from source to page to outcome, last 30 days."
- 1.4.1 Use of Color: links are one hue; their values are in labels, tooltips and the table.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Focus the chart |
| ← → ↑ ↓ | Move to the previous or next mark and show its values |
| Home End | Jump to the first or last mark |
| Esc | Hide the tooltip |

## Examples

### pricing-traffic

```tsx
import { ChartFrame, SankeyChart, sankeyTable } from "@twoux/ui";

export const meta = { title: "Visits to the pricing page", description: "Where visits came from, which page they reached, and what they did next. Hover a node to light every flow through it.", order: 1 };

const NODES = [
	{ id: "organic", label: "Organic search" },
	{ id: "paid", label: "Paid search" },
	{ id: "direct", label: "Direct" },
	{ id: "referral", label: "Referral" },
	{ id: "pricing", label: "Pricing page" },
	{ id: "docs", label: "Docs" },
	{ id: "trial", label: "Started trial" },
	{ id: "demo", label: "Booked demo" },
	{ id: "left", label: "Left" },
];
const LINKS = [
	{ source: "organic", target: "pricing", value: 8_200 },
	{ source: "organic", target: "docs", value: 4_100 },
	{ source: "paid", target: "pricing", value: 5_600 },
	{ source: "direct", target: "pricing", value: 3_900 },
	{ source: "direct", target: "docs", value: 2_300 },
	{ source: "referral", target: "pricing", value: 1_800 },
	{ source: "pricing", target: "trial", value: 2_900 },
	{ source: "pricing", target: "demo", value: 1_100 },
	{ source: "pricing", target: "left", value: 15_500 },
	{ source: "docs", target: "trial", value: 1_200 },
	{ source: "docs", target: "left", value: 5_200 },
];

export default function Example() {
	return (
		<ChartFrame className="w-full" title="Visits to pricing and docs" description="Last 30 days" table={sankeyTable(NODES, LINKS)} height={280}>
			<SankeyChart nodes={NODES} links={LINKS} aria-label="Visits from source to page to outcome, last 30 days" />
		</ChartFrame>
	);
}
```

## Related

- Funnel
- Bar chart
- Breakdown table
