# Candlestick chart

Open, high, low and close per period for a price. Up candles are hollow and down candles filled, in two categorical colours, or green and red on trading screens; volume is its own chart below.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- Showing how a traded price moved each day, including its range, for people who read markets.
- Spotting days with wide ranges or large volume.

## When not to use

- For a general audience or one price over time. Use the TwoUX Price chart or Line chart card.
- For anything that is not open, high, low and close.

## Structure

1. Title and subtitle
2. Price axis on the right, not from zero, with a note
3. Candles: wick for high and low, body for open and close
4. Optional last-price tag on the axis, with a dashed line
5. Up: hollow c1; down: filled c2 (green and red with colors="market")
6. Volume chart below with its own axis, sharing the crosshair
7. Legend: up and down
8. Tooltip: change, open, high, low, close, volume

## Guidelines

- Up and down take two categorical colours and differ in fill too: up hollow, down filled.
- Use two categorical colours by default. On trading screens, where people expect it, use green for up and red for down (colors="market"); the hollow and filled bodies stay, so colour is never the only cue.
- Put volume in its own chart below with its own axis; never a second y axis.
- The price axis need not start at zero, and says so.
- One crosshair for both charts, so a day's price and volume read together.
- Use ChartFrame for the four states: loading keeps the frame, an error says what failed with Try again, an empty period says so, and no match offers Clear filters.
- On a live market, tag the last price on the axis (showLast) and move only the forming candle as prices arrive.

## Content

- Dates as day and short month (5 Nov); the unit in the subtitle.
- Legend says what up means: Up (close above open).

## Accessibility

- 1.4.1 Use of Color: direction is carried by hollow or filled bodies, the tooltip and the table.
- 1.1.1 and WAI complex images: the chart has a short generated summary as its accessible name and a Table view with every value.
- 2.1.1 Keyboard: the chart is one tab stop; arrow keys move between marks and show the same tooltip as hover.
- 1.4.13 Content on Hover or Focus: the tooltip never covers the mark it describes, stays while the pointer is over the chart and closes with Esc.
- Accessible description: "Candlestick chart showing Ashdown plc daily prices, last 30 trading days."

## Keyboard

| Keys | Action |
|---|---|
| Tab | Focus the chart |
| ← → ↑ ↓ | Move to the previous or next mark and show its values |
| Home End | Jump to the first or last mark |
| Esc | Hide the tooltip |

## Examples

### daily

```tsx
import { type Candle, CandlestickChart, candleTable, ChartFrame } from "@twoux/ui";

export const meta = { title: "Daily prices with volume", description: "Ninety trading days. Up days are hollow, down days filled, and volume sits in its own panel under the prices with the same crosshair.", order: 1 };

// 90 trading days from a seeded random walk, so the example looks like a real price series and stays the same on every load.
function tradingDays(count: number, endDate: Date) {
	const days: Date[] = [];
	const d = new Date(endDate);
	while (days.length < count) {
		if (d.getDay() !== 0 && d.getDay() !== 6) days.unshift(new Date(d));
		d.setDate(d.getDate() - 1);
	}
	return days;
}
function makeCandles(): Candle[] {
	let seed = 7;
	const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
	let close = 742;
	return tradingDays(90, new Date(2026, 10, 5)).map((day) => {
		const open = close + (rand() - 0.5) * 4;
		const pull = (742 - open) * 0.06; // drifts back towards a middle price, like a stock trading in a range
		close = open + pull + (rand() - 0.5) * 22 + (rand() > 0.93 ? (rand() - 0.5) * 34 : 0);
		const high = Math.max(open, close) + rand() * 9;
		const low = Math.min(open, close) - rand() * 9;
		const big = Math.abs(close - open) > 12;
		const v = Math.round((1.4 + rand() * 1.4 + (big ? 1.2 : 0)) * 1_000_000);
		const r = (n: number) => Math.round(n * 10) / 10;
		return { t: day.toLocaleDateString("en-GB", { day: "numeric", month: "short" }), o: r(open), h: r(high), l: r(low), c: r(close), v };
	});
}
const DAYS: Candle[] = makeCandles();
const pence = (n: number) => `${n.toLocaleString("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}p`;

export default function Example() {
	return (
		<ChartFrame className="w-full" title="Ashdown plc, daily" description="Last 90 trading days, in pence" table={candleTable(DAYS, pence)} height={320}>
			<CandlestickChart candles={DAYS} format={pence} aria-label="Ashdown plc daily prices, last 90 trading days" />
		</ChartFrame>
	);
}
```

## Related

- Price chart
- Line chart card
- Bar chart
- Order book
