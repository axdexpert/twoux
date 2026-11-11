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
