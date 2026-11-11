# Stacked area chart

Two or more series stacked over time, so the top edge is the total and each band is one part of it, such as applications per week split by source.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- When the total over time matters and so does how it splits, such as weekly applications by source (LinkedIn, Indeed, Careers page, Referral).
- When the parts always add up to a meaningful whole, such as candidates in the pipeline by stage at the end of each week.

## When not to use

- For one series. Use the Line chart card; a single filled area only adds ink.
- For values that can go negative, such as net change in open roles. Use the Line chart card or Bar chart.
- For series that do not add up to a whole, such as applications for two unrelated listings. Overlapping areas hide each other; use lines.
- When people need to compare the middle bands exactly. Only the bottom band sits on a flat baseline; use the Line chart card or a Breakdown table.

## Structure

1. Title (what is measured) and subtitle (period)
2. Controls row: time range, Chart or Table
3. Plot: stacked bands from a zero baseline, a thin surface-colour line between bands, one y-axis
4. Legend: one item per band, in stack order, each a toggle
5. Crosshair tooltip: every band's value and the total at the hovered date
6. Optional threshold: dashed line with a text label
7. Footer: source and updated time

## Guidelines

- Always stack, always from zero. The top edge must read as the true total.
- Use two to five bands. Fold the smallest sources into "Other" at the top of the stack rather than adding a sixth colour.
- Put the largest or steadiest band at the bottom so the most important part has a flat baseline, and keep the stack order the same on every chart.
- Use categorical colours in fixed order from colour 1, separated by a thin line in the surface colour so neighbouring bands stay distinct.
- The tooltip lists bands in the same order as the stack, top to bottom, then the total.
- Show missing weeks as a gap, never as a drop to zero.
- Hiding a band from the legend restacks the rest and updates the total in the tooltip. Colours do not move.

## Content

- Title names the total and the split: "Applications by source". Subtitle gives the period: "Last 12 weeks".
- Legend items use the names people use in the product: "Careers page", not "careers_site". Never truncate a name if the end is what tells two apart.
- Skip x-axis labels at a regular interval (every other week) instead of crowding them, and abbreviate months: "3 Nov".

## Accessibility

- The chart has an accessible name matching its title and a description such as "Stacked area chart showing applications by source, last 12 weeks."
- The Table view lists every band per week plus the total, and is the long description.
- Bands are named in the tooltip and legend, so colour is never the only way to tell them apart.
- Legend items are toggle buttons with a pressed state; hiding one is announced politely: "Referral hidden".

## Keyboard

| Keys | Action |
|---|---|
| Tab | Focus the plot, then each legend item |
| ← → | Move the crosshair to the previous or next week |
| Enter | Pin the tooltip so its links can be reached with Tab |
| Esc | Close the tooltip and return focus to the plot |
| Space (legend item) | Show or hide that band |

## Examples

### pipeline

```tsx
import { CartesianChart, ChartFrame, ChartLegend, chartTable, seriesColor } from "@twoux/ui";
import { APPLICATIONS, WEEKS } from "../chart-card-line/data";

export const meta = { title: "Applications, stacked by team", description: "Stacked from zero, so the top edge is the total and each band is one team. Use it when the total matters as much as the parts; for comparing teams, use lines.", order: 1 };

export default function Example() {
	return (
		<ChartFrame className="w-full" title="Applications per week" description="Stacked by team" table={chartTable("Week", WEEKS, APPLICATIONS)} legend={<ChartLegend items={APPLICATIONS.map((s, i) => ({ id: s.id, label: s.label, color: seriesColor(i) }))} />}>
			<CartesianChart kind="area" stacked x={WEEKS} series={APPLICATIONS} aria-label="Applications per week, stacked by team" />
		</ChartFrame>
	);
}
```

## Related

- Line chart card
- Bar chart
- Data visualisation colours
- Breakdown table
- Data visualisation
