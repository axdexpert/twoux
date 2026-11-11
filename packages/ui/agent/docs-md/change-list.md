# Change list

Ticker rows for indices, prices or rates: name and code, value with unit, change by arrow, sign and colour, an optional sparkline, and a See all link.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- A short dashboard list of instruments or metrics where today's level and change matter most.
- Several numbers that move together, each too small for its own stat tile.

## When not to use

- For one headline number. Use the TwoUX Stat compare.
- To rank items by a share of a total. Use the TwoUX Ranked list.

## Structure

1. Title and subtitle (period, delay)
2. Row: name and code
3. Optional sparkline of the period
4. Value with unit, tabular
5. Change: arrow, sign and percentage
6. Footer: See all link

## Guidelines

- Keep to about five to seven rows and link to the full list with See all.
- Change shows an arrow, a sign and a colour; colour alone is never the signal.
- Values align in tabular figures with their unit after the number.
- Sparklines use one colour and no axis; they show shape, the number gives the level.
- Say how fresh the data is in the subtitle, such as 15 minutes delayed.
- Use ChartFrame for the four states: loading keeps the frame, an error says what failed with Try again, an empty period says so, and no match offers Clear filters.

## Content

- Name first, code second in smaller text: people scan names, specialists scan codes.
- Use a real minus sign for falls and two decimals for percentage change.

## Accessibility

- 1.4.1 Use of Color: arrow and sign carry direction; screen readers hear up or down with the value.
- 1.4.11 Non-text Contrast: arrows use the status text colours, which meet 4.5:1.
- 4.1.2 Name, Role, Value: each row is one link named by its whole content.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move to the next row, then See all |
| Enter | Open the row |

## Examples

### indices

```tsx
import { ChangeList } from "@twoux/ui";

export const meta = { title: "Market indices", description: "Name and code, value with unit, change by arrow, sign and colour, and today's line. The footer links to the full list.", order: 1 };

// Intraday path: 48 five-minute points from a seeded walk that ends at today's change, so each line has real ups and downs.
function intraday(value: number, changePct: number, volatility: number, seed: number) {
	const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
	const open = value / (1 + changePct / 100);
	const n = 48;
	const walk = [0];
	for (let i = 1; i < n; i++) walk.push(walk[i - 1] + (rand() - 0.5) * 2);
	const end = walk[n - 1];
	return walk.map((w, i) => open + (w - (end * i) / (n - 1)) * open * volatility + ((value - open) * i) / (n - 1));
}

const ROWS = [
	{ id: "uk100", name: "UK 100", symbol: "UKX", value: 8412.36, unit: "pts", change: 0.42, spark: intraday(8412.36, 0.42, 0.0011, 11) },
	{ id: "uk250", name: "UK 250", symbol: "MCX", value: 20184.9, unit: "pts", change: -0.31, spark: intraday(20184.9, -0.31, 0.001, 23) },
	{ id: "eu600", name: "Europe 600", symbol: "SXXP", value: 512.07, unit: "pts", change: 0.18, spark: intraday(512.07, 0.18, 0.0009, 37) },
	{ id: "gilt10", name: "UK gilt, 10 year", symbol: "GUKG10", value: 4.12, unit: "%", change: 0.0, spark: intraday(4.12, 0.0, 0.0016, 53) },
	{ id: "gbpusd", name: "Pound to dollar", symbol: "GBP/USD", value: 1.2846, unit: "USD", change: -0.12, spark: intraday(1.2846, -0.12, 0.0004, 71) },
];

export default function Example() {
	return (
		<ChangeList
			className="w-full max-w-md"
			title="Major indices"
			description="Today, 15 minutes delayed"
			items={ROWS.map((r) => ({ ...r, href: `#${r.id}` }))}
			format={(n) => n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: n < 10 ? 4 : 2 })}
			seeAll={{ href: "#markets", label: "See all markets" }}
		/>
	);
}
```

## Related

- Ranked list
- Stat card with comparison
- Price chart
