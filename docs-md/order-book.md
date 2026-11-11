# Order book

Resting sell and buy orders either side of the spread, each with a bar for the running total, so people see where the price is likely to meet resistance and can pick a price to trade at.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- A trading screen where people place limit orders and need the prices other people are offering.
- Showing how much can be bought or sold before the price moves, through the running totals.

## When not to use

- For a price over time. Use the TwoUX Candlestick chart or Price chart.
- For a short list of prices with today's change. Use the TwoUX Change list.

## Structure

1. Group by: − and + to widen or narrow price groups
2. Column headings with units: Price, Amount, Total
3. Sell orders above, best (lowest) price next to the spread
4. Middle line: last price with its direction, and the spread
5. Buy orders below, best (highest) price next to the spread
6. Depth bar behind each row: running total against the deeper side

## Guidelines

- Sells above, buys below, best prices next to the spread; side is carried by position, the row's name and colour together.
- Sell prices are red and buy prices green, the way depth charts draw asks and bids.
- Bars show the running total against the deeper side, so walls stand out.
- Choosing a row puts its price in the order form; it never places an order.
- Rows keep their place as prices update and never flash; only the values change.
- Group sell prices up and buy prices down, so a group never shows a better price than its orders.

## Content

- Put the unit in each heading: Price (USDC), Amount (BTC).
- Say Spread, not a symbol, and give it in the price's unit.

## Accessibility

- 1.4.1 Use of Color: each row is named Sell or Buy with its amount, price and total, and the two sides are separate lists.
- 2.1.1 Keyboard: the book is one tab stop; arrow keys move between rows and Enter uses the price.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Focus the book |
| ↑ ↓ | Move to the previous or next price |
| Page Up Page Down | Move five prices |
| Home End | Jump to the first or last price |
| Enter Space | Use the price in the order form |

## Examples

### live

```tsx
import { OrderBook, type OrderLevel, TextField } from "@twoux/ui";
import { useMemo, useState } from "react";

export const meta = { title: "Pick a price for the order form", description: "Sells above and buys below the spread, each row's bar showing the running total. Choose a row, by click or with the arrow keys and Enter, to put its price in the limit price field. The − and + buttons group prices.", order: 1 };

// Levels from a seeded random sequence, so the book looks real and stays the same on every load.
function levels(mid: number, dir: 1 | -1, seed: number): OrderLevel[] {
	const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
	return Array.from({ length: 40 }, (_, i) => ({ price: mid + dir * 0.4 * (i + 1) * (1 + rand()), amount: Number((rand() ** 3 * 0.9 + 0.0002).toFixed(5)) }));
}
const money = (n: number) => n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const coin = (n: number) => n.toLocaleString("en-GB", { minimumFractionDigits: 5, maximumFractionDigits: 5 });
const STEPS = [0.01, 0.1, 1, 10];

export default function Example() {
	const asks = useMemo(() => levels(70_237.17, 1, 11), []);
	const bids = useMemo(() => levels(70_237.17, -1, 29), []);
	const [step, setStep] = useState(0.01);
	const [limit, setLimit] = useState("");
	return (
		<div className="grid w-full max-w-3xl gap-6 sm:grid-cols-[18rem_1fr]">
			<OrderBook
				aria-label="BTC-USDC order book"
				asks={asks}
				bids={bids}
				rows={8}
				format={money}
				formatAmount={coin}
				priceLabel="Price (USDC)"
				amountLabel="Amount (BTC)"
				step={step}
				steps={STEPS}
				onStepChange={setStep}
				last={{ price: 70_237.17, direction: "up" }}
				onSelectPrice={(p) => setLimit(p.toFixed(2))}
			/>
			<div className="grid content-start">
				<TextField label="Limit price" suffix="USDC" inputMode="decimal" value={limit} onChange={(e) => setLimit(e.target.value)} hint="Choose a row in the order book to use its price." />
			</div>
		</div>
	);
}
```

## Related

- Candlestick chart
- Change list
- Price chart
