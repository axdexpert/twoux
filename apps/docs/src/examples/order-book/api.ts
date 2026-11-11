export const install = "";
export const api = [
	{ component: "OrderBook", props: [
		{ name: "asks · bids", type: "{ price, amount }[]", description: "Resting sell and buy orders, in any order. Sells show above the spread with the best (lowest) price last; buys below with the best (highest) first." },
		{ name: "rows", type: "number", default: "10", description: "Levels shown on each side, after grouping." },
		{ name: "step · steps · onStepChange · formatStep", type: "number · number[] · (step) => void · (n) => string", description: "Price grouping with − and + buttons. Sell prices round up and buy prices round down." },
		{ name: "last", type: "{ price, direction: \"up\" | \"down\" }", description: "Last traded price, between the sides, with an arrow and a spoken direction." },
		{ name: "onSelectPrice", type: "(price, side) => void", description: "Called when a row is chosen by click, Enter or Space. Fill the order form's limit price; never place an order from here." },
		{ name: "priceLabel · amountLabel · totalLabel · format · formatAmount", type: "string · (n) => string", description: "Column headings with units, such as Price (USDC) and Total (BTC), and number formats. Depth bars ease to new sizes; rows never flash." },
		{ name: "loading", type: "boolean", default: "false", description: "Shows skeleton rows and keeps the frame." },
		{ name: "aria-label", type: "string", description: "Names the book, such as BTC-USDC order book." },
	] },
	{ component: "groupLevels · orderBookTable", props: [
		{ name: "(levels, step, side) · (asks, bids, format?, formatAmount?)", type: "function", description: "Group levels by a price step; build the Table view for ChartFrame." },
	] },
];
