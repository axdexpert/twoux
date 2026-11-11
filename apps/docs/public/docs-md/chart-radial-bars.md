# Radial bars

One to four small concentric rings, each the share of a fixed limit such as seats, credits or storage, with used of limit always written beside them. Never actual against target: that stays the bullet chart.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- Showing two to four limits of a plan together in the space of a stat card, such as seats, assistant credits and storage this month.
- One budget that resets, such as an SLA error budget, where a ring with the share in the centre fits a small tile.

## When not to use

- For actual against a target, such as bookings against plan. Use the TwoUX Bullet chart: angles are read less exactly than lengths.
- For a single limit with a reset date and what stops at the limit. Use the TwoUX Usage meter.
- To compare amounts across categories around a circle. Use a Bar chart: outer rings look longer than inner ones for the same value.
- For parts of one total. Use a Donut chart or Share bar.
- For a value with no fixed maximum, or for the progress of a task. A ring needs a real limit.

## Structure

1. Rings, outermost first: grey track and an arc from 12 o'clock clockwise
2. Zero tick at 12 o'clock
3. Share in the centre when there is one ring
4. List: colour key, measure name, used of limit and share
5. Status badge when a ring is at or over its limit
6. Tooltip under the rings on hover or focus

## Guidelines

- Use radial bars only for share of a fixed limit, 0 to 100% of capacity, quota or budget.
- Show at most four rings, at 96 to 160px. Extra items are not drawn.
- Write used of limit and the share as text beside the rings; the ring only repeats it.
- Start every ring at 12 o'clock and run clockwise from zero. A value over the limit fills the ring; it never wraps round twice.
- Colour rings in series order. A ring at or over its limit adds At limit or Over limit as a badge; never recolour a ring as the only cue.
- No needle, no half-circle dial and no thresholds on the ring.
- Use ChartFrame for the four states: loading keeps the frame, an error says what failed with Try again, an empty period says so, and no match offers Clear filters.

## Content

- Name each ring by what it measures, as a noun: Seats, Assistant credits, Storage.
- Write used of limit with the unit, then the share: 38 of 50 seats · 76%.
- Put the plan and reset date in the chart description: Growth plan · resets 1 Dec.

## Accessibility

- 1.1.1 and WAI complex images: the chart's accessible name lists each measure as used of limit, share and status.
- 1.4.1 Use of Color: every value and status is printed in the list; colour only links a ring to its row.
- 1.4.11 Non-text Contrast: arcs meet 3:1 against the grey track.
- 2.1.1 Keyboard: one tab stop, arrow keys move between rings and show the same tooltip as hover.
- 1.4.10 Reflow: the list moves under the rings on narrow screens.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Focus the chart |
| ← → ↑ ↓ | Move to the previous or next ring |
| Home End | Go to the outer or inner ring |
| Esc | Hide the tooltip |

## Examples

### error-budget

```tsx
import { ChartFrame, RadialBars, radialBarsTable } from "@twoux/ui";

export const meta = { title: "One ring: SLA error budget", description: "A single ring shows its share in the centre. The budget is a fixed limit for the month, so the ring fits; progress against a target would be a bullet chart.", order: 2 };

const ITEMS = [{ id: "budget", label: "Error budget used", value: 26, limit: 43, unit: "min" }];

export default function Example() {
	return (
		<ChartFrame className="w-full max-w-sm" title="Checkout API error budget" description="99.9% availability · November" table={radialBarsTable(ITEMS)} height={120}>
			<RadialBars items={ITEMS} size={104} aria-label="Checkout API error budget used in November" />
		</ChartFrame>
	);
}
```

### workspace-usage

```tsx
import { ChartFrame, RadialBars, radialBarsTable } from "@twoux/ui";

export const meta = { title: "Workspace usage this month", description: "Seats, assistant credits and storage, each as a share of the plan's limit. The list says every value in words; the rings only repeat it. Seats at the limit add a status badge.", order: 1 };

const ITEMS = [
	{ id: "seats", label: "Seats", value: 50, limit: 50, unit: "seats" },
	{ id: "credits", label: "Assistant credits", value: 13_200, limit: 20_000, unit: "credits" },
	{ id: "storage", label: "Storage", value: 38, limit: 100, unit: "GB" },
];

export default function Example() {
	return (
		<ChartFrame className="w-full max-w-md" title="Plan usage" description="Growth plan · resets 1 Dec" table={radialBarsTable(ITEMS)} height={140}>
			<RadialBars items={ITEMS} aria-label="Plan usage this month" />
		</ChartFrame>
	);
}
```

## Related

- Usage meter
- Bullet chart
- Donut chart
- Stat card with comparison
