# Share bar

One whole split into up to six parts in a single horizontal bar, with each part's name and share in a legend above. Smaller parts fold into a grey Other.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- Showing how one total splits at one moment, read at a glance, such as recurring revenue by plan.
- A card or table header has room for a line, not a chart: a thin bar takes 8px and the legend carries the numbers.

## When not to use

- To compare parts precisely or rank more than six of them. Use the TwoUX Bar chart, because bars on one baseline compare more exactly than segments end to end.
- To show the split changing over time. Use the TwoUX Area chart.

## Structure

1. Title and subtitle
2. Legend above the bar: swatch, name and share for each part
3. Bar: one block per part with a 2px surface gap
4. Other: the folded tail, in grey
5. Tooltip: name, share and amount

## Guidelines

- Keep to six parts; the smallest fold into Other, which is always grey and always last.
- Separate parts with a 2px gap in the surface colour, never a border.
- Colours follow the order you pass, c1 first. Pass parts in a stable order so a part keeps its colour from one period to the next.
- Thin bar: shares go in the legend above, not on the bar. Tall bar: the share prints inside each block only when it fits, and the legend gives names.
- Use a share bar instead of a donut when space is a line, not a square.
- Use ChartFrame for the four states: loading keeps the frame, an error says what failed with Try again, an empty period says so, and no match offers Clear filters.

## Content

- Shares to one decimal place in the legend, whole percentages inside a tall bar.
- Name the part people know (Business, Team), not an internal code.

## Accessibility

- 1.4.1 Use of Color: every part is named in the legend and in the generated summary, so colour is not the only way to tell parts apart.
- 1.1.1 and WAI complex images: the chart has a short generated summary as its accessible name and a Table view with every value.
- 2.1.1 Keyboard: the chart is one tab stop; arrow keys move between marks and show the same tooltip as hover.
- 1.4.13 Content on Hover or Focus: the tooltip never covers the mark it describes, stays while the pointer is over the chart and closes with Esc.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Focus the chart |
| ← → ↑ ↓ | Move to the previous or next mark and show its values |
| Home End | Jump to the first or last mark |
| Esc | Hide the tooltip |

## Examples

### plan-revenue

```tsx
import { ChartFrame, ShareBar, shareTable } from "@twoux/ui";

export const meta = { title: "Recurring revenue by plan", description: "A thin bar under a legend that already gives each share. Eight plans arrive; the two smallest fold into Other so the bar keeps six parts.", order: 1 };

const PLANS = [
	{ id: "business", label: "Business", value: 1_284_000 },
	{ id: "team", label: "Team", value: 612_000 },
	{ id: "enterprise", label: "Enterprise", value: 498_000 },
	{ id: "starter", label: "Starter", value: 231_000 },
	{ id: "agency", label: "Agency", value: 104_000 },
	{ id: "education", label: "Education", value: 46_000 },
	{ id: "charity", label: "Charity", value: 21_000 },
	{ id: "legacy", label: "Legacy", value: 9_000 },
];
const gbp = (n: number) => `£${(n / 1000).toLocaleString("en-GB", { maximumFractionDigits: 0 })}k`;

export default function Example() {
	return (
		<ChartFrame className="w-full" title="Recurring revenue by plan" description="Annual run rate, 5 November 2026" table={shareTable(PLANS, gbp, "Plan")} height={60}>
			<ShareBar parts={PLANS} format={gbp} aria-label="Recurring revenue by plan" />
		</ChartFrame>
	);
}
```

## Related

- Donut chart
- Bar chart
- Treemap
