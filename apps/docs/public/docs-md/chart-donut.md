# Donut chart

Two to five parts of one total at a single moment, with the total in the centre and every segment labelled with its count and share. Most of the time a bar chart is better.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- When the question is how one total splits at one moment, and there are two to five parts: open roles by work pattern (On site, Hybrid, Remote (UK)).
- When the total itself is worth showing, which the centre of the donut holds.

## When not to use

- For change over time. Use the Line chart card, or the Stacked area chart for parts over time.
- For more than five parts. Use a horizontal Bar chart sorted by size.
- When parts are close in size and the difference matters, such as 31% against 34%. Angles are hard to compare; use a Bar chart.
- For one value against a goal, such as 18 of 25 roles filled. Use the Stat card with comparison.
- For ordered stages such as Applied to Offer. Use the Funnel.

## Structure

1. Title and subtitle (the moment or period)
2. Ring of segments starting at 12 o'clock, clockwise, with a 2px surface-colour gap between segments
3. Centre: total value and a one or two word unit ("412 candidates")
4. Segment labels: name, count, share
5. Legend, required when any part is zero
6. Details popover on hover or select

## Guidelines

- Order segments clockwise from 12 o'clock, largest first, unless the parts have their own order (Junior, Mid, Senior), in which case keep that order.
- Colour segments with categorical colours in fixed order from colour 1. Never give each slice a colour chosen by meaning.
- Label every segment with its count and share, so the chart reads without hovering.
- A part with a value of zero has no segment but stays in the legend, so people can see it was counted.
- Keep a minimum segment size so a small part stays visible and selectable, and show its true share in the label.
- When people filter parts out, recalculate the centre total and every share.

## Content

- Segment labels read count, unit, share: "124 candidates, 30%".
- Centre text is the total and a short unit: "412" over "candidates". One or two words only.
- Title is a noun phrase that names the whole: "Open roles by work pattern".
- If a name must be cut, keep the part that tells it apart: "…Designer, Leeds" rather than "Junior Product…".

## Accessibility

- Description: "Donut chart showing open roles by work pattern, today." The Table view lists each part with count and share.
- Segments are identified by their printed labels and the legend, never by colour alone.
- Segments reach 3:1 against the background, and the 2px gap keeps neighbours apart.
- Arrow keys move between segments and show each one's details in the popover.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Focus the chart, then the legend items |
| ← → | Move to the previous or next segment |
| Enter | Pin the details popover |
| Esc | Close the popover |

## Examples

### sources

```tsx
import { ChartFrame, DonutChart } from "@twoux/ui";

export const meta = { title: "Where applicants come from", description: "Two to five parts of one whole, each labelled with its count and share. For more parts, or to compare sizes closely, use a bar chart.", order: 1 };

export default function Example() {
	return (
		<ChartFrame className="w-full max-w-xl" title="Applications by source" description="This month">
			<DonutChart totalLabel="applications" aria-label="Applications by source" segments={[
				{ id: "board", label: "Job boards", value: 312 },
				{ id: "site", label: "Careers page", value: 164 },
				{ id: "ref", label: "Referrals", value: 71 },
				{ id: "agency", label: "Agencies", value: 48 },
			]} />
		</ChartFrame>
	);
}
```

## Related

- Bar chart
- Stat card with comparison
- Stacked area chart
- Data visualisation colours
- Data visualisation
