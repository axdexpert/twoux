# Heatmap

A grid of two dimensions (such as team by weekday) shaded in one hue from light to dark, with every cell showing its number and a legend under the grid.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- Showing a quantity across two dimensions at once, such as when people apply by team and weekday.
- Spotting patterns and hot spots matters more than reading exact values; the printed numbers cover exact reading.

## When not to use

- When people must compare exact amounts; colour is a poor encoding of magnitude. Use the TwoUX Bar chart or Breakdown table.
- For one dimension over time. Use the TwoUX Line chart card.

## Structure

1. Title and subtitle
2. Row labels (team)
3. Column labels (weekday)
4. Cells with value text
5. Legend: Fewer to More ramp, under the grid

## Guidelines

- One hue, light for low and dark for high, never a rainbow.
- Every cell shows its number, so colour is never the only cue.
- Avoid red and green together; for diverging values use blue against orange or red.
- Separate neighbouring cells with a gap in the surface colour.
- Put the legend under the grid.
- While loading, show the grid with empty cells and labels; on error replace the grid with the error state and Try again; with no data, an empty state.
- Missing cells show a dash and "No data" in the tooltip, never the lightest step, which would read as low.
- Selecting a cell can drill down to the list behind it, such as candidates who applied to Design on Mondays, as a filtered List table.

## Content

- Legend ends say "Fewer" and "More", not colour names.
- Title says what is counted; subtitle gives the period, "Applies by team and weekday, last 30 days".
- Choose text colour per cell so numbers stay readable on dark steps.

## Accessibility

- 1.4.1 Use of Color: values are printed in the cells, which is the sufficient technique of adding text.
- 1.4.11 Non-text Contrast: heat maps can fall under the essential exception, but because the cells show values TwoUX does not depend on it.
- 1.1.1 and WAI complex images: give a short alternative and a table of the values.
- The grid is keyboard reachable: Tab to the grid, arrow keys move cell to cell, and each cell is announced with row, column and value.
- Accessible description: "Heatmap showing applies by team and weekday, last 30 days."

## Examples

### weekday

```tsx
import { ChartFrame, Heatmap } from "@twoux/ui";

export const meta = { title: "When candidates apply", description: "One hue from light to dark, a legend from fewer to more, and every value in the cell's accessible name. Zero is grey, not the lightest step.", order: 1 };

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TEAMS = ["Design", "Engineering", "Data", "People"];
const V = [[12, 18, 15, 14, 9, 2, 4], [31, 36, 33, 29, 21, 6, 9], [7, 9, 11, 8, 6, 0, 1], [4, 6, 5, 7, 3, 0, 0]];

export default function Example() {
	return (
		<ChartFrame className="w-full max-w-2xl" title="Applications by weekday" description="Last 4 weeks, by team">
			<Heatmap rows={TEAMS} columns={DAYS} values={V} aria-label="Applications by team and weekday" />
		</ChartFrame>
	);
}
```

## Related

- Data visualisation colours
- Breakdown table
- Bar chart
