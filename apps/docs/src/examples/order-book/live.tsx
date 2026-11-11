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
