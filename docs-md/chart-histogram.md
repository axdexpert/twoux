# Histogram

How values spread: touching columns, one per equal bin, counted on one axis, with an optional dashed marker such as the median.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- Seeing the shape of a distribution, such as salary offers, where an average hides the tail.
- Checking whether most values sit in a range before setting a threshold.

## When not to use

- To compare distributions of several groups. Use the TwoUX Box plot.
- For counts by named category. Use the TwoUX Bar chart.

## Structure

1. Title and subtitle
2. Y axis: count
3. Columns, one per bin, 2px gaps
4. X axis: bin edges and title with unit
5. Optional dashed marker with label
6. Tooltip: range, count, share

## Guidelines

- Use equal, round bin widths and say the width in the subtitle or table.
- Columns touch with a 2px surface gap, because bins are continuous.
- The y axis starts at zero and counts; there is one axis only.
- Mark the median or a threshold with a dashed grey line and a text label.
- Use ChartFrame for the four states: loading keeps the frame, an error says what failed with Try again, an empty period says so, and no match offers Clear filters.

## Content

- X axis title names the measure and unit, such as Annual salary offered.
- Count label is the plural noun of what is counted (offers).

## Accessibility

- 1.1.1 and WAI complex images: the chart has a short generated summary as its accessible name and a Table view with every value.
- 2.1.1 Keyboard: the chart is one tab stop; arrow keys move between marks and show the same tooltip as hover.
- 1.4.13 Content on Hover or Focus: the tooltip never covers the mark it describes, stays while the pointer is over the chart and closes with Esc.
- Accessible description: "Histogram showing salary offers in £5k bins, last 12 months."

## Keyboard

| Keys | Action |
|---|---|
| Tab | Focus the chart |
| ← → ↑ ↓ | Move to the previous or next mark and show its values |
| Home End | Jump to the first or last mark |
| Esc | Hide the tooltip |

## Examples

### salary-offers

```tsx
import { binValues, ChartFrame, Histogram, histogramTable } from "@twoux/ui";

export const meta = { title: "Salary offers", description: "140 offers in £5k bins with the median marked. The shape shows the long tail a single average hides.", order: 1 };

const OFFERS = [23000, 27000, 28500, 29500, 30000, 30000, 30000, 30000, 31500, 32500, 33000, 33500, 33500, 34000, 34000, 35500, 36000, 36000, 36500, 37000, 37500, 38000, 38000, 38000, 38000, 38500, 38500, 39000, 39500, 40000, 40000, 40500, 40500, 40500, 40500, 41000, 41000, 41000, 41500, 41500, 42000, 42500, 42500, 43000, 43000, 43000, 43500, 43500, 43500, 44000, 44000, 45000, 45000, 45500, 45500, 46500, 46500, 46500, 47000, 49500, 50000, 50500, 50500, 50500, 50500, 51000, 51000, 51000, 51500, 51500, 52000, 52500, 53000, 53500, 53500, 53500, 54000, 54000, 54500, 55000, 55000, 55000, 55000, 55500, 56000, 56500, 57000, 57500, 57500, 57500, 57500, 57500, 58000, 58000, 58500, 59000, 60000, 62000, 62000, 62000, 62500, 62500, 63000, 63000, 63000, 63000, 63500, 64000, 64500, 65000, 65000, 65500, 66000, 67000, 67500, 68000, 68000, 68000, 70000, 70500, 75500, 75500, 76000, 76500, 76500, 77500, 78500, 79500, 79500, 79500, 82500, 83000, 83500, 83500, 88000, 91000, 92000, 93500, 101500, 104000];
const BINS = binValues(OFFERS, { binWidth: 5000, start: 20000 });
const gbp = (n: number) => `£${n / 1000}k`;

export default function Example() {
	return (
		<ChartFrame className="w-full" title="Salary offers" description="Offers made, last 12 months" table={histogramTable(BINS, gbp, "Salary")}>
			<Histogram bins={BINS} format={gbp} xTitle="Annual salary offered" countLabel="offers" marker={{ value: 52000, label: "Median £52k" }} aria-label="Salary offers, last 12 months" />
		</ChartFrame>
	);
}
```

## Related

- Box plot
- Bar chart
- Scatter chart
