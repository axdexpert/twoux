# Stat card with comparison

One number that matters, with its change against a named previous period shown by arrow, sign and colour, and an optional faint previous-period line.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- A quick view of how one metric is doing, alone or beside related stats.
- The number is the answer; a chart would add reading time without insight.

## When not to use

- For one metric over time. Use the TwoUX Line chart card.
- For plain text or labels.

## Structure

1. Label with period ("Applications · last 30 days")
2. Value
3. Change: arrow, signed percentage, comparison text
4. Optional mini chart: current solid, previous dashed grey
5. Legend (This period, Previous period)

## Guidelines

- The number leads; label and change are secondary.
- Show change with an arrow, a sign and colour together, never colour alone.
- Say what the change compares against, "vs 264 the 30 days before".
- Draw the previous period as a dashed grey line behind the current one.
- Loading shows a skeleton of the number and change; an error shows "Couldn't load" with Try again in the card; no data shows a dash and "No data for this period", never 0.
- When the stat has a target, say it in text ("18 of 25 roles filled") rather than a ring or donut.

## Content

- Label with the metric and the period, and include units.
- Round the value for reading, keep the exact value in the tooltip.
- Keep any description to two lines; longer text is truncated with the full text in a tooltip.

## Accessibility

- 1.4.1 Use of Color: good or bad change is also shown by arrow and sign.
- 1.1.1 Non-text Content: the mini chart has a text alternative or is hidden because the figures are in text.
- 1.4.11 Non-text Contrast: the arrow and line reach 3:1 unless the text carries the same information.
- A missing value reads "No data for this period" to screen readers, not "dash".

## Keyboard

| Keys | Action |
|---|---|
| Tab | Focus the card when it links to a report |

## Examples

### kpis

```tsx
import { StatCompare } from "@twoux/ui";

export const meta = { title: "Key numbers", description: "One number, its change against a named period, and whether that change is good, said in colour and in words. Time to hire going down is good; applications going down is not.", order: 1 };

export default function Example() {
	return (
		<div className="grid w-full grid-cols-3 gap-3 max-md:grid-cols-1">
			{[
				{ label: "Applications this month", value: "595", change: "+12%", period: "October", good: true, spark: [42, 48, 51, 47, 55, 60, 58, 66] },
				{ label: "Median time to hire", value: "23 days", change: "-4 days", period: "last quarter", good: true, spark: [31, 30, 29, 27, 27, 25, 24, 23] },
				{ label: "Offer acceptance", value: "71%", change: "-6 pts", period: "last quarter", good: false, spark: [80, 79, 77, 78, 75, 74, 72, 71] },
			].map((s) => (
				<div key={s.label} className="rounded-sm border border-line bg-surface p-4 shadow-card"><StatCompare {...s} /></div>
			))}
		</div>
	);
}
```

## Related

- Line chart card
- Breakdown table
- Data visualisation colours
- Usage meter
