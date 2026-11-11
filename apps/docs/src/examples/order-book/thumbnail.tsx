import { OrderBook } from "@twoux/ui";

/* The real OrderBook with three levels a side and no grouping control, to fit the card. */
const ASKS = [{ price: 70_240.12, amount: 0.3272 }, { price: 70_239.6, amount: 0.0922 }, { price: 70_237.58, amount: 0.0805 }];
const BIDS = [{ price: 70_236.76, amount: 0.0021 }, { price: 70_235.61, amount: 0.475 }, { price: 70_233.19, amount: 0.108 }];
const money = (n: number) => n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const coin = (n: number) => n.toLocaleString("en-GB", { minimumFractionDigits: 4, maximumFractionDigits: 4 });

export default function Thumbnail() {
	return (
		<div className="w-64" aria-hidden="true">
			<OrderBook aria-label="Order book" asks={ASKS} bids={BIDS} rows={3} format={money} formatAmount={coin} last={{ price: 70_237.17, direction: "up" }} />
		</div>
	);
}
