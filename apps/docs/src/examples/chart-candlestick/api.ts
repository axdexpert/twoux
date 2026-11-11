export const install = "";
export const api = [
	{ component: "CandlestickChart", props: [
		{ name: "candles", type: "{ t, o, h, l, c, v? }[]", description: "One candle per period. Up is c1 and hollow, down is c2 and filled, so direction never rests on colour." },
		{ name: "volumeHeight", type: "number", default: "64", description: "Volume is its own chart under the prices, sharing the crosshair; 0 hides it. Never a second y axis." },
		{ name: "format · formatVolume · height", type: "(n) => string · (n) => string · number", description: "The price axis starts above zero and says so under the chart." },
		{ name: "colors", type: "\"categorical\" | \"market\"", default: "\"categorical\"", description: "\"market\" draws up green and down red, for trading screens; up stays hollow and down filled." },
		{ name: "showLast · lastNote", type: "boolean · string", default: "false", description: "Tags the last close on the price axis with a dashed line, in the last candle's colour; lastNote adds a second line, such as the time until the open candle closes." },
		{ name: "live", type: "boolean", default: "false", description: "The open candle, its volume and the price tag ease to each new value, for feeds that update every second. Closed candles never move. Off under reduced motion." },
		{ name: "volumeLabel", type: "string", default: "\"Volume\"", description: "Names the volume chart with its unit: Volume (BTC)." },
	] },
	{ component: "candleTable", props: [
		{ name: "(candles, format?, formatVolume?)", type: "function", description: "Table view: date, open, high, low, close, change, volume." },
	] },
];
