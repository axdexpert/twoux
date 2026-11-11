import type { Candle, OrderLevel } from "@twoux/ui";
import { useEffect, useRef, useState } from "react";

/* A simulated market feed that behaves the way an exchange does, so the screen makes sense to a trader:
   - trades print at the best bid or ask, and the last trade is the last price;
   - the order book keeps its levels and changes a few sizes each tick, instead of being rebuilt;
   - candles are built from those trades in real time buckets (15m, 1H, 4H, 1D), and a new one opens on the boundary;
   - 24h change, high, low and volume roll from the hourly history plus today's trades.
   Seeded, so the history looks the same on every load; the live part moves with the clock. */

export type Market = { id: string; base: string; quote: string; price: number; change: number; volume: number; decimals: number; vol: number };
export const MARKETS: Market[] = [
	{ id: "BTC-USDC", base: "BTC", quote: "USDC", price: 70293.32, change: -2.84, volume: 14_718.4, decimals: 2, vol: 0.00022 },
	{ id: "ETH-USDC", base: "ETH", quote: "USDC", price: 3481.26, change: 2.56, volume: 118_604.2, decimals: 2, vol: 0.00028 },
	{ id: "SOL-USDC", base: "SOL", quote: "USDC", price: 168.71, change: 4.08, volume: 581_540, decimals: 2, vol: 0.00035 },
	{ id: "ARB-USDC", base: "ARB", quote: "USDC", price: 0.5276, change: -5.85, volume: 2_468_000, decimals: 4, vol: 0.0004 },
	{ id: "BCH-USDC", base: "BCH", quote: "USDC", price: 357.97, change: -3.05, volume: 25_432, decimals: 2, vol: 0.0003 },
	{ id: "DOGE-USDC", base: "DOGE", quote: "USDC", price: 0.12647, change: 6.1, volume: 180_760_000, decimals: 5, vol: 0.00045 },
	{ id: "LTC-USDC", base: "LTC", quote: "USDC", price: 71.38, change: 0.42, volume: 89_700, decimals: 2, vol: 0.0003 },
	{ id: "LINK-USDC", base: "LINK", quote: "USDC", price: 13.92, change: -1.18, volume: 367_700, decimals: 3, vol: 0.00033 },
];

export const INTERVALS = { "15m": 15 * 60_000, "1H": 3_600_000, "4H": 4 * 3_600_000, "1D": 86_400_000 } as const;
export type Interval = keyof typeof INTERVALS;
export type Trade = { id: number; side: "buy" | "sell"; price: number; amount: number; at: number };
export type Ticker = { price: number; prev: number; open24: number; high24: number; low24: number; volBase: number; volQuote: number };

const TICK_MS = 1000;
const rng = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const gauss = (r: () => number) => Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r());
const roundTo = (n: number, unit: number) => Math.round(n / unit) * unit;
export const tickSize = (m: Market) => 10 ** -m.decimals;

/* 60 hourly candles ending in the open one. The last 24 run from the price a day ago to the price now, so the 1H chart
   and the 24h change, high and low come from the same history and always agree. */
function hourly(m: Market, now: number): (Candle & { start: number })[] {
	const r = rng(m.id.length * 7919 + 13);
	const step = m.vol * Math.sqrt(3600) * 0.6;
	const open24 = m.price / (1 + m.change / 100);
	// The day: a walk bent to start at open24 and end at the price.
	const walk = [0];
	for (let i = 1; i <= 24; i++) walk.push(walk[i - 1] + gauss(r) * step);
	const day = walk.map((w, i) => open24 * Math.exp(w - (walk[24] * i) / 24 + (Math.log(m.price / open24) * i) / 24));
	// Before it: walked back from open24.
	const before = [open24];
	for (let i = 0; i < 36; i++) before.unshift(before[0] * Math.exp(-gauss(r) * step));
	const closes = [...before.slice(0, -1), ...day];
	const lastStart = Math.floor(now / 3_600_000) * 3_600_000;
	const n = closes.length - 1;
	return closes.slice(1).map((c, i) => {
		const o = closes[i];
		const start = lastStart - (n - 1 - i) * 3_600_000;
		const swing = step * 0.6;
		return { start, t: label(start, "1H"), o, c, h: Math.max(o, c) * (1 + r() * swing), l: Math.min(o, c) * (1 - r() * swing), v: (m.volume / 24) * (0.5 + r()) };
	});
}

/* History for any candle length, ending in the open candle at the current price. 1H is the hourly history itself. */
function history(m: Market, iv: Interval, now: number, price: number): (Candle & { start: number })[] {
	if (iv === "1H") {
		const h = hourly(m, now);
		const k = h[h.length - 1];
		h[h.length - 1] = { ...k, c: price, h: Math.max(k.h, price), l: Math.min(k.l, price) };
		return h;
	}
	const ms = INTERVALS[iv];
	const r = rng(m.id.length * 104729 + ms / 60_000);
	const n = 60;
	const closes = [price];
	for (let i = 1; i <= n; i++) closes.unshift(closes[0] * Math.exp(-gauss(r) * m.vol * Math.sqrt(ms / 1000) * 0.6));
	const lastStart = Math.floor(now / ms) * ms;
	return closes.slice(1).map((c, i) => {
		const o = closes[i];
		const start = lastStart - (n - 1 - i) * ms;
		const swing = m.vol * Math.sqrt(ms / 1000) * 0.4;
		return { start, t: label(start, iv), o, c, h: Math.max(o, c) * (1 + r() * swing), l: Math.min(o, c) * (1 - r() * swing), v: (m.volume * (ms / 86_400_000)) * (0.4 + r() * 1.2) };
	});
}

export function label(t: number, iv: Interval) {
	const d = new Date(t);
	if (iv === "1D") return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
	if (iv === "4H" && d.getHours() < 4) return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
	return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function freshBook(price: number, unit: number, r: () => number) {
	const size = () => Number(((r() ** 3) * 0.9 + 0.0004 + (r() < 0.05 ? 1.5 + r() * 3 : 0)).toFixed(5));
	const asks: OrderLevel[] = [];
	const bids: OrderLevel[] = [];
	let a = roundTo(price + unit, unit), b = roundTo(price - unit, unit);
	for (let i = 0; i < 80; i++) {
		asks.push({ price: a, amount: size() });
		bids.push({ price: b, amount: size() });
		a = roundTo(a + unit * (1 + Math.floor(r() * 60)), unit);
		b = roundTo(b - unit * (1 + Math.floor(r() * 60)), unit);
	}
	return { asks, bids };
}

export function useMarketFeed(marketId: string, interval: Interval) {
	const now0 = useRef(Date.now()).current;
	const tickers = useRef<Record<string, Ticker>>({});
	if (!Object.keys(tickers.current).length) {
		for (const m of MARKETS) {
			const day = hourly(m, now0).slice(-24);
			tickers.current[m.id] = { price: m.price, prev: m.price, open24: day[0].o, high24: Math.max(...day.map((k) => k.h), m.price), low24: Math.min(...day.map((k) => k.l), m.price), volBase: m.volume, volQuote: day.reduce((t, k) => t + (k.v ?? 0) * k.c, 0) };
		}
	}
	const market = MARKETS.find((m) => m.id === marketId) ?? MARKETS[0];
	const unit = tickSize(market);
	const r = useRef(rng(4242)).current;

	type FeedState = { candles: (Candle & { start: number })[]; book: { asks: OrderLevel[]; bids: OrderLevel[] }; trades: Trade[]; now: number; seq: number };
	const [state, setState] = useState<FeedState>(() => {
		const t = tickers.current[market.id];
		return { candles: history(market, interval, now0, t.price), book: freshBook(t.price, unit, r), trades: [], now: now0, seq: 0 };
	});
	// The tick reads and writes this, not a state updater, so nothing runs twice in development.
	const live = useRef(state);

	// A new market or candle length: rebuild history and book around the live price.
	useEffect(() => {
		const t = tickers.current[market.id];
		const now = Date.now();
		live.current = { ...live.current, candles: history(market, interval, now, t.price), book: freshBook(t.price, unit, r), trades: [], now };
		setState(live.current);
	}, [market, interval, unit, r]);

	useEffect(() => {
		const id = window.setInterval(() => {
			const now = Date.now();
			// Every market's price moves; only the open market prints trades on screen.
			for (const m of MARKETS) {
				const t = tickers.current[m.id];
				if (m.id === market.id) continue;
				t.prev = t.price;
				t.price = roundTo(t.price * Math.exp(gauss(r) * m.vol), tickSize(m));
				t.high24 = Math.max(t.high24, t.price);
				t.low24 = Math.min(t.low24, t.price);
			}
			{
				const s = live.current;
				const t = tickers.current[market.id];
				let { asks, bids } = s.book;
				// Makers re-quote around the moving fair price: the whole book shifts by the move, sizes stay.
				const move = roundTo(t.price * (Math.exp(gauss(r) * market.vol) - 1), unit);
				asks = asks.map((l) => ({ ...l, price: roundTo(l.price + move, unit) }));
				bids = bids.map((l) => ({ ...l, price: roundTo(l.price + move, unit) }));
				// Takers hit the best price; a few prints per second, with the occasional sweep through a level.
				const n = 1 + Math.floor(r() * 4);
				const prints: Trade[] = [];
				let seq = s.seq;
				for (let i = 0; i < n; i++) {
					const buy = r() < 0.5 + Math.max(-0.2, Math.min(0.2, (t.open24 - t.price) / t.price * 5));
					const book = buy ? asks : bids;
					const lvl = book[0];
					const amount = Number(Math.min(lvl.amount, (r() ** 2) * 0.35 + 0.0002).toFixed(5));
					prints.push({ id: ++seq, side: buy ? "buy" : "sell", price: lvl.price, amount, at: now - (n - 1 - i) * 120 });
					lvl.amount = Number((lvl.amount - amount).toFixed(5));
					if (lvl.amount <= 0.00001) book.shift();
				}
				// Makers refill near the touch and change a few resting sizes.
				const size = () => Number(((r() ** 3) * 0.9 + 0.0004).toFixed(5));
				const last = prints[prints.length - 1].price;
				while (asks.length && asks[0].price - bids[0]?.price > unit * 3 && r() < 0.6) asks.unshift({ price: roundTo(asks[0].price - unit * (1 + Math.floor(r() * 20)), unit), amount: size() });
				while (bids.length && asks[0]?.price - bids[0].price > unit * 3 && r() < 0.6) bids.unshift({ price: roundTo(bids[0].price + unit * (1 + Math.floor(r() * 20)), unit), amount: size() });
				if (asks[0] && asks[0].price <= last) asks[0].price = roundTo(last + unit, unit);
				if (bids[0] && bids[0].price >= (asks[0]?.price ?? Infinity)) bids[0].price = roundTo((asks[0]?.price ?? last) - unit, unit);
				for (const side of [asks, bids]) for (let k = 0; k < 4; k++) { const l = side[Math.floor(r() * Math.min(side.length, 25))]; if (l) l.amount = size(); }
				while (asks.length < 80) asks.push({ price: roundTo((asks[asks.length - 1]?.price ?? last) + unit * (1 + Math.floor(r() * 60)), unit), amount: size() });
				while (bids.length < 80) bids.push({ price: roundTo((bids[bids.length - 1]?.price ?? last) - unit * (1 + Math.floor(r() * 60)), unit), amount: size() });

				t.prev = t.price;
				t.price = last;
				const vb = prints.reduce((v, p) => v + p.amount, 0);
				t.volBase += vb;
				t.volQuote += prints.reduce((v, p) => v + p.amount * p.price, 0);
				t.high24 = Math.max(t.high24, last);
				t.low24 = Math.min(t.low24, last);

				// Candles: the open one takes the prints; crossing the boundary opens a new one at the last price.
				const ms = INTERVALS[interval];
				const candles = s.candles.slice();
				let k = { ...candles[candles.length - 1] };
				const start = Math.floor(now / ms) * ms;
				if (start > k.start) {
					candles.shift();
					k = { start, t: label(start, interval), o: k.c, h: k.c, l: k.c, c: k.c, v: 0 };
					candles.push(k);
				}
				for (const p of prints) { k.c = p.price; k.h = Math.max(k.h, p.price); k.l = Math.min(k.l, p.price); k.v = (k.v ?? 0) + p.amount; }
				candles[candles.length - 1] = k;
				live.current = { candles, book: { asks, bids }, trades: [...prints.reverse(), ...s.trades].slice(0, 40), now, seq };
				setState(live.current);
			}
		}, TICK_MS);
		return () => window.clearInterval(id);
	}, [market, interval, unit, r]);

	const ticker = tickers.current[market.id];
	return { market, unit, ticker, tickers: tickers.current, ...state, closesIn: INTERVALS[interval] - (state.now % INTERVALS[interval]) };
}

export const countdown = (ms: number) => {
	const s = Math.max(0, Math.floor(ms / 1000));
	const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
	const two = (n: number) => String(n).padStart(2, "0");
	return h ? `${h}:${two(m)}:${two(sec)}` : `${two(m)}:${two(sec)}`;
};
