import {
	Badge,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Button,
	type Candle,
	CandlestickChart,
	ChartFrame,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	DropdownMenuItem,
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
	OrderBook,
	type OrderLevel,
	type PaneDef,
	PaneLayout,
	type PaneLayoutValue,
	RadioGroup,
	RadioGroupItem,
	RollingNumber,
	Segment,
	SegmentedControl,
	ShortcutsProvider,
	SidebarItem,
	SidebarSection,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Tabs,
	TabsList,
	TabsTrigger,
	TextField,
	Timestamp,
	candleTable,
	cn,
	toast,
	usePaneSize,
} from "@twoux/ui";
import { ArrowDown, ArrowUp, ArrowUpDown, BarChart3, ChevronDown, ClipboardList, LineChart, PieChart, Search, Settings, Star, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ExampleShell } from "../../components/example-shell";
import { ExampleBrand } from "../../components/example-brand";
import { countdown, type Interval, MARKETS, type Market, type Ticker, type Trade, useMarketFeed } from "./trading/feed";

/* Trading: one market's live price, order book and order form side by side, as on an exchange.
   The feed (trading/feed.ts) prints trades at the best bid or ask every second; the last trade is the last price,
   candles are built from the trades, and open limit orders fill when the price reaches them. */

type Order = { id: string; market: string; side: "buy" | "sell"; type: "Limit" | "Market"; price: number; amount: number; filled: number; placed: string; status: "Open" | "Filled" | "Cancelled" };

const money = (n: number, d = 2) => n.toLocaleString("en-GB", { minimumFractionDigits: d, maximumFractionDigits: d });
const coin = (n: number) => n.toLocaleString("en-GB", { minimumFractionDigits: 5, maximumFractionDigits: 5 });
const compact = (n: number) => n.toLocaleString("en-GB", { notation: "compact", maximumFractionDigits: 1 });
const MINUS = "−";
const signed = (n: number, f: (n: number) => string) => `${n >= 0 ? "+" : MINUS}${f(Math.abs(n))}`;
const pct = (n: number) => `${n.toFixed(2)}%`;
const change = (t: Ticker) => (t.price / t.open24 - 1) * 100;
const MAKER = 0;
const TAKER = 0.0005;

const STEPS = [0.01, 0.1, 1, 10, 50];

// Columns left to right; sizes are shares of the width (columns) or of the column's height (panes).
const DEFAULT_LAYOUT: PaneLayoutValue = [
	{ id: "c1", size: 16, panes: [{ id: "markets", size: 1 }] },
	{ id: "c2", size: 50, panes: [{ id: "chart", size: 64 }, { id: "orders", size: 36 }] },
	{ id: "c3", size: 17, panes: [{ id: "book", size: 1 }] },
	{ id: "c4", size: 18, panes: [{ id: "form", size: 1 }] },
];

/* Layout, rail and watchlist are kept between visits. In a real app they are saved per person on the server,
   like any layout preference; this example has no server, so it keeps them in this browser. */
function useSaved<T>(key: string, initial: T) {
	const [value, setValue] = useState<T>(() => {
		try {
			const raw = window.localStorage.getItem(`twoux.trading.${key}`);
			return raw ? (JSON.parse(raw) as T) : initial;
		} catch {
			return initial;
		}
	});
	useEffect(() => {
		try { window.localStorage.setItem(`twoux.trading.${key}`, JSON.stringify(value)); } catch { /* storage blocked: keep it for this visit only */ }
	}, [key, value]);
	return [value, setValue] as const;
}

export function TradingExample() {
	const [layout, setLayout] = useSaved<PaneLayoutValue>("layout", DEFAULT_LAYOUT);
	const [watchList, setWatchList] = useSaved<string[]>("watchlist", ["BTC-USDC", "ETH-USDC"]);
	const watch = new Set(watchList);
	const [marketId, setMarketId] = useState("BTC-USDC");
	const [listView, setListView] = useState("all");
	const [query, setQuery] = useState("");
	const [interval, setInterval_] = useState<Interval>("1H");
	const [chartView, setChartView] = useState<"chart" | "table">("chart");
	const [bookView, setBookView] = useState("book");
	const [ordersView, setOrdersView] = useState("open");

	const feed = useMarketFeed(marketId, interval);
	const { market, ticker, tickers, book, trades, candles } = feed;
	const price = ticker.price;
	const direction: "up" | "down" = price >= ticker.prev ? "up" : "down";
	const bestAsk = book.asks[0]?.price ?? price;
	const bestBid = book.bids[0]?.price ?? price;
	const unit = feed.unit;
	const steps = STEPS.map((s) => s * unit * 100).filter((s) => s >= unit);
	const [step, setStep] = useState<number | undefined>(undefined);
	const groupStep = step ?? steps[0];

	// Balances. Open orders reserve what they would spend, so Available is what a new order can use.
	const [balance, setBalance] = useState<Record<string, number>>({ USDC: 12_480.5, BTC: 0.1432, ETH: 2.4, SOL: 31.2, ARB: 0, BCH: 0, DOGE: 0, LTC: 0, LINK: 0 });
	const now0 = useRef(Date.now()).current;
	const [orders, setOrders] = useState<Order[]>(() => [
		{ id: "ORD-20481", market: "BTC-USDC", side: "buy", type: "Limit", price: 70_050, amount: 0.04, filled: 0, placed: new Date(now0 - 42 * 60_000).toISOString(), status: "Open" },
		{ id: "ORD-20476", market: "ETH-USDC", side: "sell", type: "Limit", price: 3_560, amount: 1.2, filled: 0.35, placed: new Date(now0 - 3 * 3_600_000).toISOString(), status: "Open" },
		{ id: "ORD-20412", market: "BTC-USDC", side: "buy", type: "Market", price: 70_910.4, amount: 0.015, filled: 0.015, placed: new Date(now0 - 26 * 3_600_000).toISOString(), status: "Filled" },
	]);
	const open = orders.filter((o) => o.status === "Open");
	const past = orders.filter((o) => o.status !== "Open");
	const base = (id: string) => id.split("-")[0];
	const reserved = (asset: string) => open.reduce((t, o) => t + (o.side === "buy" ? (asset === "USDC" ? (o.amount - o.filled) * o.price : 0) : base(o.market) === asset ? o.amount - o.filled : 0), 0);
	const availableOf = (asset: string) => Math.max(0, (balance[asset] ?? 0) - reserved(asset));

	const settle = (o: Order, fillPrice: number, fee: number) => {
		const qty = o.amount - o.filled;
		setBalance((b) => {
			const n = { ...b };
			const a = base(o.market);
			if (o.side === "buy") { n.USDC -= qty * fillPrice * (1 + fee); n[a] = (n[a] ?? 0) + qty; }
			else { n[a] -= qty; n.USDC += qty * fillPrice * (1 - fee); }
			return n;
		});
	};

	// Resting limit orders fill when the market trades through their price.
	useEffect(() => {
		for (const o of open) {
			const t = tickers[o.market];
			if (!t) continue;
			const hit = o.side === "buy" ? t.price <= o.price : t.price >= o.price;
			if (!hit) continue;
			settle(o, o.price, MAKER);
			setOrders((os) => os.map((x) => (x.id === o.id ? { ...x, filled: x.amount, status: "Filled" } : x)));
			toast.success(`${o.side === "buy" ? "Buy" : "Sell"} order filled`, { description: `${coin(o.amount - o.filled)} ${base(o.market)} at ${money(o.price)} USDC` });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [feed.now]);

	// Order form
	const [side, setSide] = useState<"buy" | "sell">("buy");
	const [type, setType] = useState("limit");
	const [limit, setLimit] = useState("");
	const [amount, setAmount] = useState("");
	const [tif, setTif] = useState("gtc");
	const [errors, setErrors] = useState<{ limit?: string; amount?: string }>({});
	const limitRef = useRef<HTMLInputElement>(null);
	const amountRef = useRef<HTMLInputElement>(null);
	const limitPrice = Number(limit.replace(/,/g, ""));
	// A limit priced through the spread trades at once against the book, so it pays the taker fee.
	const crosses = type === "limit" && limitPrice > 0 && (side === "buy" ? limitPrice >= bestAsk : limitPrice <= bestBid);
	const touch = side === "buy" ? bestAsk : bestBid;
	const fillPrice = type === "market" || crosses ? touch : limitPrice;
	const qty = Number(amount.replace(/,/g, ""));
	const subtotal = fillPrice && qty ? fillPrice * qty : 0;
	const feeRate = type === "market" || crosses ? TAKER : MAKER;
	const fee = subtotal * feeRate;
	const available = side === "buy" ? availableOf(market.quote) : availableOf(market.base);
	const setShare = (share: number) => {
		const p = fillPrice || touch;
		const q = side === "buy" ? (available * share) / p / (1 + feeRate) : available * share;
		setAmount(q ? (Math.floor(q * 1e5) / 1e5).toFixed(5) : "0");
		setErrors((e) => ({ ...e, amount: undefined }));
	};

	const submit = () => {
		const next: typeof errors = {};
		if (type === "limit" && !(limitPrice > 0)) next.limit = `Enter a limit price in ${market.quote}.`;
		if (!(qty > 0)) next.amount = `Enter how much ${market.base} to ${side}.`;
		else if (side === "buy" && subtotal + fee > available) next.amount = `This costs ${money(subtotal + fee)} ${market.quote}; ${money(available)} is available. Lower the amount or add funds.`;
		else if (side === "sell" && qty > available) next.amount = `${coin(available)} ${market.base} is available. Lower the amount.`;
		setErrors(next);
		if (next.limit) return limitRef.current?.focus();
		if (next.amount) return amountRef.current?.focus();
		const fills = type === "market" || crosses;
		const o: Order = { id: `ORD-${20482 + orders.length}`, market: market.id, side, type: type === "market" ? "Market" : "Limit", price: fills ? touch : limitPrice, amount: qty, filled: 0, placed: new Date().toISOString(), status: "Open" };
		if (fills) {
			settle(o, touch, TAKER);
			setOrders((os) => [{ ...o, filled: qty, status: "Filled" }, ...os]);
			toast.success(`${side === "buy" ? "Bought" : "Sold"} ${coin(qty)} ${market.base}`, { description: `At ${money(touch, market.decimals)} ${market.quote}, fee ${money(fee)} ${market.quote}` });
		} else {
			setOrders((os) => [o, ...os]);
			toast.success(`${side === "buy" ? "Buy" : "Sell"} order placed`, { description: `${coin(qty)} ${market.base} at ${money(limitPrice, market.decimals)} ${market.quote}`, action: { label: "Cancel order", onClick: () => cancel(o.id) } });
		}
		setAmount("");
	};
	const cancel = (id: string) => {
		setOrders((os) => os.map((o) => (o.id === id && o.status === "Open" ? { ...o, status: "Cancelled" } : o)));
		toast.success(`Order ${id} cancelled`, { action: { label: "Undo", onClick: () => setOrders((os) => os.map((o) => (o.id === id && o.status === "Cancelled" ? { ...o, status: "Open" } : o))) } });
	};

	const shown = MARKETS.filter((m) => (listView === "all" || watch.has(m.id)) && m.id.toLowerCase().includes(query.trim().toLowerCase()));
	const pick = (id: string) => { setMarketId(id); setStep(undefined); setLimit(""); setAmount(""); setErrors({}); };

	const sidebar = (
		<>
			<ExampleBrand label="Exchange" />
			<SidebarSection>
				<SidebarItem label="Trade" icon={<LineChart />} current />
				<SidebarItem label="Markets" icon={<BarChart3 />} />
				<SidebarItem label="Portfolio" icon={<PieChart />} />
				<SidebarItem label="Orders" icon={<ClipboardList />} count={open.length} />
				<SidebarItem label="Wallets" icon={<Wallet />} />
			</SidebarSection>
			<SidebarSection title="Account"><SidebarItem label="Settings" icon={<Settings />} /></SidebarSection>
		</>
	);

	const topBar = (
		<>
			<Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#trade">Trade</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>{market.id}</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
			<span className="flex-1" />
			<Button variant="outline" size="sm" onClick={() => toast.message("Transfers are not wired in this example")}><ArrowUpDown />Transfer</Button>
		</>
	);

	const changeCls = (n: number) => (n >= 0 ? "text-ok" : "text-bad");
	const Arrow = ({ n }: { n: number }) => (n >= 0 ? <ArrowUp className="size-3.5" aria-hidden="true" /> : <ArrowDown className="size-3.5" aria-hidden="true" />);
	const ch = change(ticker);

	const reset = () => {
		const before = layout;
		setLayout(DEFAULT_LAYOUT);
		toast.success("Layout reset", { action: { label: "Undo", onClick: () => setLayout(before) } });
	};

	const panes: Record<string, PaneDef> = {
		markets: {
			title: "Markets",
			children: (
				<div className="grid content-start gap-inline p-region">
					<TextField label="Search markets" prefix={<Search />} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="BTC, ETH…" />
					<SegmentedControl value={listView} onValueChange={(v) => v && setListView(v)} size="sm" aria-label="Markets to show">
						<Segment value="all">All</Segment>
						<Segment value="watch">Watchlist</Segment>
					</SegmentedControl>
					{shown.length ? (
						<ul className="grid">
							{shown.map((m) => {
								const t = tickers[m.id];
								const c = change(t);
								return (
									<li key={m.id} className={cn("flex items-center gap-hair rounded-xs", m.id === marketId && "bg-selected")}>
										<button type="button" onClick={() => pick(m.id)} aria-current={m.id === marketId ? "true" : undefined} className="grid min-w-0 flex-1 grid-cols-[1fr_auto] gap-x-inline rounded-xs px-inline py-tight text-left text-sm outline-none hover:bg-hover focus-visible:ring-2 focus-visible:ring-primary">
											<span className="truncate font-medium text-ink">{m.id}</span>
											<span className={cn("text-right tabular", t.price > t.prev ? "text-ok" : t.price < t.prev ? "text-bad" : "text-ink")}>{money(t.price, m.decimals)}</span>
											<span className="text-xs text-ink-3">Vol {compact(t.volQuote)}</span>
											<span className={cn("flex items-center justify-end gap-hair text-xs tabular", changeCls(c))}><Arrow n={c} />{signed(c, pct)}</span>
										</button>
										<Button variant="ghost" size="icon-xs" aria-pressed={watch.has(m.id)} aria-label={`Watch ${m.id}`} onClick={() => setWatchList((w) => (w.includes(m.id) ? w.filter((x) => x !== m.id) : [...w, m.id]))}>
											<Star className={cn("size-3.5", watch.has(m.id) ? "fill-current text-primary" : "text-ink-3")} />
										</Button>
									</li>
								);
							})}
						</ul>
					) : (
						<Empty>
							<EmptyHeader>
								<EmptyTitle level={3}>No markets match “{query}”</EmptyTitle>
								<EmptyDescription>{listView === "watch" ? "Your watchlist has no market with that name." : "Search by the coin's code, such as BTC."}</EmptyDescription>
							</EmptyHeader>
							<Button variant="outline" size="sm" onClick={() => { setQuery(""); setListView("all"); }}>Clear search</Button>
						</Empty>
					)}
				</div>
			),
		},
		chart: {
			title: `${market.id} price, ${interval} candles in ${market.quote}`,
			actions: (
				<SegmentedControl value={interval} onValueChange={(v) => v && setInterval_(v as Interval)} size="sm" aria-label="Candle length">
					{(["15m", "1H", "4H", "1D"] as const).map((i) => <Segment key={i} value={i}>{i}</Segment>)}
				</SegmentedControl>
			),
			menu: <DropdownMenuItem onSelect={() => setChartView((v) => (v === "chart" ? "table" : "chart"))}>{chartView === "chart" ? "Show as table" : "Show chart"}</DropdownMenuItem>,
			children: <ChartPane market={market} interval={interval} candles={candles} closesIn={feed.closesIn} view={chartView} onViewChange={setChartView} />,
		},
		book: {
			title: bookView === "book" ? "Order book" : "Recent trades",
			header: (
				<SegmentedControl value={bookView} onValueChange={(v) => v && setBookView(v)} size="sm" aria-label="Order book or recent trades">
					<Segment value="book">Order book</Segment>
					<Segment value="trades">Trades</Segment>
				</SegmentedControl>
			),
			children: bookView === "book" ? (
				<BookPane
					market={market}
					book={book}
					price={price}
					direction={direction}
					step={groupStep}
					steps={steps}
					onStepChange={setStep}
					onSelectPrice={(p) => { setType("limit"); setLimit(p.toFixed(market.decimals)); setErrors((e) => ({ ...e, limit: undefined })); }}
				/>
			) : (
				<TradesTable market={market} trades={trades} />
			),
		},
		form: {
			title: "Place order",
			children: (
				<div className="grid content-start gap-group p-region">
					<SegmentedControl value={side} onValueChange={(v) => { if (v) { setSide(v as "buy" | "sell"); setErrors({}); } }} aria-label="Buy or sell" className="w-full">
						<Segment value="buy" className="flex-1">Buy</Segment>
						<Segment value="sell" className="flex-1">Sell</Segment>
					</SegmentedControl>
					<Tabs value={type} onValueChange={(v) => { setType(v); setErrors({}); }}>
						<TabsList>
							<TabsTrigger value="limit">Limit</TabsTrigger>
							<TabsTrigger value="market">Market</TabsTrigger>
						</TabsList>
					</Tabs>
					<dl className="grid grid-cols-[1fr_auto] gap-x-group gap-y-tight text-sm">
						<dt className="text-ink-2">Available</dt>
						<dd className="text-right text-ink tabular">{side === "buy" ? `${money(available)} ${market.quote}` : `${coin(available)} ${market.base}`}</dd>
						<dt className="text-ink-2">Best {side === "buy" ? "ask" : "bid"}</dt>
						<dd className="text-right text-ink tabular">{money(touch, market.decimals)} {market.quote}</dd>
					</dl>
					<form noValidate className="grid gap-group" onSubmit={(e) => { e.preventDefault(); submit(); }}>
						{type === "limit" ? (
							<TextField
								ref={limitRef}
								label="Limit price"
								suffix={market.quote}
								inputMode="decimal"
								value={limit}
								placeholder={money(side === "buy" ? bestBid : bestAsk, market.decimals)}
								error={errors.limit}
								hint={crosses ? `${side === "buy" ? "At or above the best ask" : "At or below the best bid"}, so it fills now at about ${money(touch, market.decimals)} and pays the taker fee.` : "Choose a row in the order book to use its price."}
								onChange={(e) => { setLimit(e.target.value); setErrors((er) => ({ ...er, limit: undefined })); }}
							/>
						) : (
							<p className="text-sm text-ink-2">Fills now against the book, from about {money(touch, market.decimals)} {market.quote}; a large order may fill at worse prices.</p>
						)}
						<TextField ref={amountRef} label="Amount" suffix={market.base} inputMode="decimal" value={amount} placeholder="0.00000" error={errors.amount} onChange={(e) => { setAmount(e.target.value); setErrors((er) => ({ ...er, amount: undefined })); }} />
						<div className="grid grid-cols-4 gap-tight" role="group" aria-label={`Use part of your available ${side === "buy" ? market.quote : market.base}`}>
							{[0.25, 0.5, 0.75, 1].map((s) => <Button key={s} type="button" variant="outline" size="xs" onClick={() => setShare(s)}>{s === 1 ? "Max" : `${s * 100}%`}</Button>)}
						</div>
						{type === "limit" && (
							<Collapsible>
								<CollapsibleTrigger asChild>
									<Button type="button" variant="ghost" size="sm" className="group w-full justify-between">Additional settings<ChevronDown className="text-ink-3 transition-transform group-data-[state=open]:rotate-180" /></Button>
								</CollapsibleTrigger>
								<CollapsibleContent className="grid gap-inline pt-inline">
									<p id="tif" className="text-sm font-medium text-ink">Time in force</p>
									<RadioGroup value={tif} onValueChange={setTif} aria-labelledby="tif">
										{[["gtc", "Good till cancelled"], ["day", "Until the end of today (UTC)"], ["ioc", "Fill now or cancel the rest"]].map(([v, l]) => (
											<label key={v} className="flex items-center gap-inline text-sm text-ink"><RadioGroupItem value={v} />{l}</label>
										))}
									</RadioGroup>
								</CollapsibleContent>
							</Collapsible>
						)}
						<dl className="grid grid-cols-[1fr_auto] gap-x-group gap-y-tight border-t border-line pt-inline text-sm">
							<dt className="text-ink-2">{side === "buy" ? "Cost" : "Proceeds"}</dt><dd className="text-right text-ink tabular">{subtotal ? `${money(subtotal)} ${market.quote}` : "–"}</dd>
							<dt className="text-ink-2">Fee ({feeRate ? "0.05% taker" : "0.00% maker"})</dt><dd className="text-right text-ink tabular">{subtotal ? `${money(fee)} ${market.quote}` : "–"}</dd>
							<dt className="font-medium text-ink">Total</dt><dd className="text-right font-semibold text-ink tabular">{subtotal ? `${money(side === "buy" ? subtotal + fee : subtotal - fee)} ${market.quote}` : "–"}</dd>
						</dl>
						<Button type="submit" shortcut="⌘↵">{side === "buy" ? "Buy" : "Sell"} {market.base}</Button>
						{(type === "market" || crosses) && <p className="text-xs text-ink-2">This order fills at once and can't be cancelled.</p>}
					</form>
				</div>
			),
		},
		orders: {
			title: ordersView === "open" ? "Open orders" : "Order history",
			header: (
				<SegmentedControl value={ordersView} onValueChange={(v) => v && setOrdersView(v)} size="sm" aria-label="Orders to show">
					<Segment value="open">Open orders ({open.length})</Segment>
					<Segment value="history">Order history</Segment>
				</SegmentedControl>
			),
			children: (() => {
				const list = ordersView === "open" ? open : past;
				return list.length ? (
					<Table size="dense" aria-label={ordersView === "open" ? "Open orders" : "Order history"}>
						<TableHeader>
							<TableRow>
								<TableHead>Market</TableHead><TableHead>Side</TableHead><TableHead>Type</TableHead>
								<TableHead className="text-right">Price</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right">Filled</TableHead><TableHead className="text-right">Total (USDC)</TableHead>
								<TableHead>Placed</TableHead><TableHead>Status</TableHead>{ordersView === "open" && <TableHead><span className="sr-only">Actions</span></TableHead>}
							</TableRow>
						</TableHeader>
						<TableBody>
							{list.map((o) => {
								const m = MARKETS.find((x) => x.id === o.market);
								return (
									<TableRow key={o.id}>
										<TableCell className="font-medium">{o.market}</TableCell>
										<TableCell><Badge variant={o.side === "buy" ? "success" : "destructive"}>{o.side === "buy" ? "Buy" : "Sell"}</Badge></TableCell>
										<TableCell>{o.type}</TableCell>
										<TableCell className="text-right tabular">{money(o.price, m?.decimals)}</TableCell>
										<TableCell className="text-right tabular">{coin(o.amount)}</TableCell>
										<TableCell className="text-right tabular">{Math.round((o.filled / o.amount) * 100)}%</TableCell>
										<TableCell className="text-right tabular">{money(o.price * o.amount)}</TableCell>
										<TableCell className="text-ink-2"><Timestamp value={o.placed} /></TableCell>
										<TableCell><Badge variant={o.status === "Open" ? "default" : o.status === "Filled" ? "success" : "secondary"}>{o.status}</Badge></TableCell>
										{ordersView === "open" && <TableCell className="text-right"><Button variant="ghost" size="xs" onClick={() => cancel(o.id)} aria-label={`Cancel order ${o.id}`}>Cancel</Button></TableCell>}
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				) : (
					<Empty>
						<EmptyHeader>
							<EmptyTitle level={3}>{ordersView === "open" ? "No open orders" : "No past orders"}</EmptyTitle>
							<EmptyDescription>{ordersView === "open" ? "Limit orders you place wait here until they fill or you cancel them." : "Filled and cancelled orders appear here."}</EmptyDescription>
						</EmptyHeader>
					</Empty>
				);
			})(),
		},
	};

	return (
		<ShortcutsProvider>
			<div className="h-full min-h-0">
				<ExampleShell className="h-example-frame" frame="flush" sidebar={sidebar} topBar={topBar}>
					<div className="flex h-full min-h-0 flex-col">
						{/* Market summary: the pair and its last 24 hours. Stays put; the panes below are arranged by the person. */}
						<section aria-labelledby="pair" className="flex shrink-0 flex-wrap items-center gap-x-7 gap-y-tight border-b border-line px-page py-control">
							<h1 id="pair" className="text-lg font-semibold text-ink">{market.id}</h1>
							<dl className="flex flex-wrap gap-x-7 gap-y-inline text-sm">
								<div className="grid">
									<dt className="text-xs text-ink-3">Last price</dt>
									<dd className={cn("font-semibold tabular", direction === "up" ? "text-ok" : "text-bad")}>
										<RollingNumber value={money(price, market.decimals)} />
										<span className="sr-only">, {direction === "up" ? "up" : "down"} on the last trade</span>
									</dd>
								</div>
								<div className="grid">
									<dt className="text-xs text-ink-3">24h change</dt>
									<dd className={cn("flex items-center gap-tight tabular", changeCls(ch))}><Arrow n={ch} />{signed(price - ticker.open24, (n) => money(n, market.decimals))} ({signed(ch, pct)})</dd>
								</div>
								<div className="grid"><dt className="text-xs text-ink-3">24h high</dt><dd className="text-ink tabular">{money(ticker.high24, market.decimals)}</dd></div>
								<div className="grid"><dt className="text-xs text-ink-3">24h low</dt><dd className="text-ink tabular">{money(ticker.low24, market.decimals)}</dd></div>
								<div className="grid"><dt className="text-xs text-ink-3">24h volume ({market.base})</dt><dd className="text-ink tabular">{money(ticker.volBase, 2)}</dd></div>
								<div className="grid"><dt className="text-xs text-ink-3">24h volume ({market.quote})</dt><dd className="text-ink tabular">{money(ticker.volQuote, 0)}</dd></div>
							</dl>
						</section>
						<PaneLayout aria-label="Trading workspace" value={layout} onValueChange={setLayout} panes={panes} onReset={reset} />
					</div>
				</ExampleShell>
			</div>
		</ShortcutsProvider>
	);
}

/* The chart draws at the height its pane has: price above, volume below, legend under both.
   The open candle and the price tag ease to each trade; the tag counts down to the candle's close. */
function ChartPane({ market, interval, candles, closesIn, view, onViewChange }: { market: Market; interval: Interval; candles: Candle[]; closesIn: number; view: "chart" | "table"; onViewChange: (v: "chart" | "table") => void }) {
	const { height, stacked } = usePaneSize();
	const showVolume = stacked || height >= 320;
	const chartH = stacked ? 260 : Math.max(120, height - (showVolume ? 116 : 52));
	return (
		<ChartFrame titleHidden view={view} onViewChange={onViewChange} level={2} title={`${market.id} price`} description={`${interval} candles, in ${market.quote}`} height={chartH} table={candleTable(candles, (n) => money(n, market.decimals), (n) => money(n, 4))}>
			<CandlestickChart
				candles={candles}
				colors="market"
				showLast
				live
				lastNote={countdown(closesIn)}
				height={chartH}
				volumeHeight={showVolume ? 56 : 0}
				volumeLabel={`Volume (${market.base})`}
				format={(n) => money(n, market.decimals)}
				formatVolume={(n) => n.toLocaleString("en-GB", { maximumFractionDigits: n < 10 ? 2 : 0 })}
				aria-label={`Candlestick chart showing ${market.id} prices, last ${candles.length} ${interval} candles`}
			/>
		</ChartFrame>
	);
}

/* As many price levels as the pane has room for, on each side of the spread. */
function BookPane({ market, book, price, direction, step, steps, onStepChange, onSelectPrice }: { market: Market; book: { asks: OrderLevel[]; bids: OrderLevel[] }; price: number; direction: "up" | "down"; step: number; steps: number[]; onStepChange: (s: number) => void; onSelectPrice: (p: number) => void }) {
	const { height, stacked } = usePaneSize();
	const rows = stacked ? 8 : Math.max(3, Math.floor((height - 110) / 48));
	return (
		<div className="py-tight">
			<OrderBook
				aria-label={`${market.id} order book`}
				asks={book.asks}
				bids={book.bids}
				rows={rows}
				format={(n) => money(n, market.decimals)}
				formatAmount={coin}
				priceLabel={`Price (${market.quote})`}
				amountLabel={`Amount (${market.base})`}
				totalLabel={`Total (${market.base})`}
				step={step}
				steps={steps}
				onStepChange={onStepChange}
				formatStep={(n) => money(n, Math.max(0, -Math.floor(Math.log10(n))))}
				last={{ price, direction }}
				onSelectPrice={onSelectPrice}
			/>
		</div>
	);
}

/* Latest prints first. Rows that arrived since the last tick fade in; older rows stay still. */
function TradesTable({ market, trades }: { market: Market; trades: Trade[] }) {
	const seen = useRef(0);
	const newest = trades[0]?.id ?? 0;
	const since = seen.current;
	useEffect(() => { seen.current = newest; }, [newest]);
	return (
		<Table size="dense" aria-label={`Recent ${market.id} trades`}>
			<TableHeader><TableRow><TableHead>Price ({market.quote})</TableHead><TableHead className="text-right">Amount ({market.base})</TableHead><TableHead className="text-right">Time</TableHead></TableRow></TableHeader>
			<TableBody>
				{trades.map((t) => (
					<TableRow key={t.id} className={cn(since && t.id > since && "animate-fade-in")}>
						<TableCell className={cn("tabular", t.side === "buy" ? "text-ok" : "text-bad")}><span className="sr-only">{t.side === "buy" ? "Buy" : "Sell"} at </span>{money(t.price, market.decimals)}</TableCell>
						<TableCell className="text-right tabular">{coin(t.amount)}</TableCell>
						<TableCell className="text-right text-ink-2"><Timestamp value={new Date(t.at)} format="time" /></TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
