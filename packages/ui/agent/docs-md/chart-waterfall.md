# Waterfall chart

How an opening amount becomes a closing amount: each increase and decrease floats from the running total, joined by connectors, with totals in grey from zero.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- Explaining how a balance or profit moved from one figure to another, such as cash flow for a month.
- A bridge between two totals where each step matters, such as budget to actual.

## When not to use

- To show a series over time. Use the TwoUX Line chart card.
- For parts of one total with no order. Use the TwoUX Share bar or Bar chart.

## Structure

1. Title and subtitle
2. Y axis from zero (or below, when totals go negative)
3. Total bars in grey from zero
4. Increase and decrease bars floating from the running total
5. Connector lines between bars
6. Value labels with + or − where they fit
7. Legend: increase, decrease, total
8. Tooltip: change and running total

## Guidelines

- Increases and decreases take two categorical colours (c1 and c2), never green and red; the + or − on each label carries direction.
- Totals are grey and start from zero, so they read as levels, not changes.
- Join bars with thin connectors at the running total.
- Print a value only where it fits; the tooltip and table always have it.
- Order steps as the money moved: opening, money in, money out, closing.
- Use ChartFrame for the four states: loading keeps the frame, an error says what failed with Try again, an empty period says so, and no match offers Clear filters.

## Content

- Use a real minus sign and a plus sign on every change; totals have no sign.
- Name the legend by meaning (Money in, Money out, Balance), not by colour.

## Accessibility

- 1.4.1 Use of Color: direction is carried by the sign on each label, in the tooltip and in the table, not by colour.
- 1.1.1 and WAI complex images: the chart has a short generated summary as its accessible name and a Table view with every value.
- 2.1.1 Keyboard: the chart is one tab stop; arrow keys move between marks and show the same tooltip as hover.
- 1.4.13 Content on Hover or Focus: the tooltip never covers the mark it describes, stays while the pointer is over the chart and closes with Esc.
- Accessible description: "Waterfall chart showing cash flow for October 2026."

## Keyboard

| Keys | Action |
|---|---|
| Tab | Focus the chart |
| ← → ↑ ↓ | Move to the previous or next mark and show its values |
| Home End | Jump to the first or last mark |
| Esc | Hide the tooltip |

## Examples

### cash-flow

```tsx
import { ChartFrame, Waterfall, type WaterfallStep, waterfallTable } from "@twoux/ui";

export const meta = { title: "Cash flow for the month", description: "Opening balance, money in and money out, then the closing balance as a total. Grey totals, two categorical colours for in and out, a + or − on every change that fits.", order: 1 };

const STEPS: WaterfallStep[] = [
	{ id: "open", label: "Opening", value: 1_240_000, total: true },
	{ id: "subs", label: "Subscriptions", value: 486_000 },
	{ id: "services", label: "Services", value: 92_000 },
	{ id: "payroll", label: "Payroll", value: -412_000 },
	{ id: "hosting", label: "Hosting", value: -88_000 },
	{ id: "rent", label: "Rent", value: -46_000 },
	{ id: "vat", label: "VAT", value: -131_000 },
	{ id: "close", label: "Closing", total: true },
];
const gbp = (n: number) => (Math.abs(n) >= 1_000_000 ? `£${(n / 1_000_000).toFixed(2)}m` : n === 0 ? "£0" : `£${Math.round(n / 1000)}k`);

export default function Example() {
	return (
		<ChartFrame className="w-full" title="Cash flow" description="October 2026, all accounts" table={waterfallTable(STEPS, gbp)}>
			<Waterfall steps={STEPS} format={gbp} labels={{ increase: "Money in", decrease: "Money out", total: "Balance" }} aria-label="Cash flow, October 2026" />
		</ChartFrame>
	);
}
```

## Related

- Bar chart
- Bullet chart
- Stat card with comparison
