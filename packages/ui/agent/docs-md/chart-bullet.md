# Bullet chart

Actual against target for a few measures: a thin bar over grey qualitative bands with the target as a dark tick, in a fraction of a gauge's space.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- Showing progress against a target for several measures in one card, such as bookings this quarter.
- Where a gauge or dial was asked for: a bullet chart says the same in a line.

## When not to use

- For a single number with no target. Use the TwoUX Stat compare.
- For usage against a hard limit. Use the TwoUX Usage meter.

## Structure

1. Title and subtitle
2. Row: measure name, actual and target as text
3. Qualitative bands in neutral grey steps, darkest for the worst
4. Actual: thin bar in c1
5. Target: dark tick
6. Scale under each bar
7. Legend: actual, target, bands

## Guidelines

- Use a bullet chart, never a gauge or dial.
- Bands are neutral grey steps, darkest for the worst range; they never use status colours.
- The actual is a thin bar in the first series colour, the target a dark tick across it.
- Print actual and target as text on each row, so the bar is never the only way to read them.
- Each row has its own scale; never compare bar lengths between rows with different scales.
- Use ChartFrame for the four states: loading keeps the frame, an error says what failed with Try again, an empty period says so, and no match offers Clear filters.

## Content

- Name the bands by meaning (Poor, Satisfactory, Good), worst first.
- Write actual of target, such as £412k of £450k.

## Accessibility

- 1.4.1 Use of Color: values are printed; bands are named in the legend and in each row's name.
- 1.1.1 and WAI complex images: each row's accessible name gives the actual, target, percentage of target and band.
- 2.1.1 Keyboard: each row is focusable and shows the same tooltip as hover.
- 1.4.11 Non-text Contrast: the actual bar and target tick meet 3:1 against every band.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move to the next measure |
| Esc | Hide the tooltip |

## Examples

### quarter-targets

```tsx
import { BulletChart, ChartFrame } from "@twoux/ui";

export const meta = { title: "Quarter to date against target", description: "Each measure is a thin bar over grey bands, with the target as a dark tick. It replaces a row of gauges in a third of the space.", order: 1 };

const ROWS = [
	{ id: "new", label: "New business", value: 412_000, target: 450_000, bands: [300_000, 400_000, 500_000] },
	{ id: "expansion", label: "Expansion", value: 188_000, target: 160_000, bands: [100_000, 150_000, 220_000] },
	{ id: "renewals", label: "Renewals", value: 731_000, target: 820_000, bands: [700_000, 800_000, 900_000] },
];
const gbp = (n: number) => (n === 0 ? "£0" : `£${Math.round(n / 1000)}k`);

export default function Example() {
	return (
		<ChartFrame
			className="w-full"
			title="Bookings against target"
			description="Quarter to date, Q4 2026"
			table={{ columns: ["Measure", "Actual", "Target", "Of target"], rows: ROWS.map((r) => [r.label, gbp(r.value), gbp(r.target), `${Math.round((r.value / r.target) * 100)}%`]) }}
		>
			<BulletChart rows={ROWS} format={gbp} aria-label="Bookings against target, quarter to date" />
		</ChartFrame>
	);
}
```

## Related

- Stat card with comparison
- Waterfall chart
- Bar chart
