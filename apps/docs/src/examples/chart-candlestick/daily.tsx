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
