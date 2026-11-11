import { Button, CodeBlock, CodeBlockContent, Count, Segment, SegmentedControl, Swap, cn } from "@twoux/ui";
import { Check, Copy, Play } from "lucide-react";
import { type CSSProperties, useEffect, useState } from "react";
import { useToken } from "./tokens";

/* Base values in ms before tempo. The live value is read from the stylesheet, so a wrong number here only affects the demo track. */
const DURATIONS: [token: string, base: number, use: string][] = [
	["--duration-fast", 120, "Hover, press, colour, small controls"],
	["--duration-base", 180, "Tabs, menus, state swaps, small transforms"],
	["--duration-move", 200, "Panels and layout that move"],
	["--duration-slow", 260, "Content swaps, height changes, progress fills"],
	["--duration-long", 480, "Figures rolling to a new value only"],
	["--duration-exit", 120, "Anything leaving"],
];

const EASINGS: [token: string, use: string][] = [
	["--ease-standard", "Changes in place: swaps, numbers, heights. --ease-entrance uses the same curve for arrivals."],
	["--ease-move", "Moving between two places: panel push, sidebar width."],
	["--ease-exit", "Leaving. Accelerates out of the way, never overshoots."],
	["--ease-pop", "A count that changes, and nothing else."],
];

const TEMPOS = ["0.75", "1", "1.25"] as const;

function useReducedMotion() {
	const [reduced, setReduced] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReduced(mq.matches);
		const on = () => setReduced(mq.matches);
		mq.addEventListener("change", on);
		return () => mq.removeEventListener("change", on);
	}, []);
	return reduced;
}

/** Durations are defined on :root, so a preview tempo has to redefine them on the demo, not just --motion-tempo. */
function tempoVars(tempo: number) {
	const v: Record<string, string> = { "--motion-tempo": String(tempo) };
	for (const [t, base] of DURATIONS) if (t !== "--duration-exit") v[t] = `${Math.round(base * tempo)}ms`;
	v["--duration-exit"] = v["--duration-fast"];
	// Animation shorthands also resolve their durations on :root, so redeclare the ones the demos use.
	for (const [name, dur, ease] of [
		["rise-in", "slow", "entrance"],
		["fade-out", "exit", "exit"],
		["swap-in-icon", "base", "entrance"],
		["swap-out-icon", "exit", "exit"],
		["swap-in-text", "base", "entrance"],
		["swap-out-text", "exit", "exit"],
	])
		v[`--animate-${name}`] = `twoux-${name} var(--duration-${dur}) var(--ease-${ease}) both`;
	v["--animate-count-pop"] = "twoux-count-pop var(--duration-slow) var(--ease-spring)";
	return v as CSSProperties;
}

function parseBezier(v: string): [number, number, number, number] | null {
	const m = v.match(/cubic-bezier\(([^)]+)\)/);
	if (!m) return null;
	const n = m[1].split(",").map((x) => Number.parseFloat(x));
	return n.length === 4 && n.every(Number.isFinite) ? (n as [number, number, number, number]) : null;
}

function H3({ children, text }: { children: React.ReactNode; text: React.ReactNode }) {
	return (
		<div className="mb-4">
			<h3 className="mb-1 text-docs-h3 font-semibold">{children}</h3>
			<p className="max-w-[68ch] text-docs text-ink-2">{text}</p>
		</div>
	);
}

function DurationRow({ token, base, use, tempo, played }: { token: string; base: number; use: string; tempo: number; played: boolean }) {
	return (
		<div className="grid grid-cols-[150px_64px_1fr] items-center gap-4 border-t border-line px-4 py-2.5 first:border-t-0 max-md:grid-cols-[1fr_auto] max-md:gap-y-2">
			<span className="grid min-w-0">
				<code className="font-mono text-sm">{token}</code>
				<span className="text-sm text-ink-3 md:hidden">{use}</span>
			</span>
			<span className="text-right font-mono text-sm text-ink-2 tabular">{Math.round(base * tempo)}ms</span>
			<span className="grid gap-1 max-md:col-span-full">
				<span className="relative h-2 rounded-full bg-surface-2">
					<span
						className={cn(
							"absolute top-0 left-0 size-2 rounded-full bg-primary transition-[left]",
							token === "--duration-exit" ? "ease-(--ease-exit)" : "ease-(--ease-standard)",
							played ? "left-[calc(100%-0.5rem)]" : "left-0",
						)}
						style={{ transitionDuration: `var(${token})` }}
					/>
				</span>
				<span className="text-sm text-ink-3 max-md:hidden">{use}</span>
			</span>
		</div>
	);
}

/** The curve drawn from the token's own cubic-bezier, with a dot that travels it in time when played. */
function EasingCard({ token, use, played }: { token: string; use: string; played: boolean }) {
	const value = useToken(token);
	const b = parseBezier(value);
	// Plot area 0..100; y is flipped and padded so an overshoot above 1 stays visible.
	const P = 14;
	const X = (x: number) => P + x * 100;
	const Y = (y: number) => P + (1 - y) * 100;
	const d = b ? `M${X(0)},${Y(0)} C${X(b[0])},${Y(b[1])} ${X(b[2])},${Y(b[3])} ${X(1)},${Y(1)}` : "";
	return (
		<figure className="grid content-start gap-3 rounded-sm border border-line bg-surface p-4 shadow-card">
			<svg viewBox={`0 0 ${100 + P * 2} ${100 + P * 2}`} className="aspect-square w-full max-w-40 justify-self-center overflow-visible" role="img" aria-label={`${token} curve: ${value || "loading"}`}>
				<rect x={P} y={P} width="100" height="100" className="fill-none stroke-line" strokeDasharray="2 3" />
				{b && <path d={d} className="fill-none stroke-primary" strokeWidth="2.5" strokeLinecap="round" />}
			</svg>
			<span className="relative h-2 rounded-full bg-surface-2" aria-hidden="true">
				<span
					className={cn("absolute top-0 left-0 size-2 rounded-full bg-primary transition-[left] duration-(--duration-long)", played ? "left-[calc(100%-0.5rem)]" : "left-0")}
					style={{ transitionTimingFunction: `var(${token})` }}
				/>
			</span>
			<figcaption className="grid gap-1">
				<code className="font-mono text-sm">{token}</code>
				<span className="font-mono text-xs text-ink-3">{value}</span>
				<span className="text-sm text-ink-2">{use}</span>
			</figcaption>
		</figure>
	);
}

/** Enter with --ease-entrance at the base duration; leave faster with --ease-exit. The card unmounts when its exit ends. */
function EnterExit({ tempo }: { tempo: number }) {
	const [state, setState] = useState<"hidden" | "shown" | "leaving">("hidden");
	return (
		<div className="grid gap-4 rounded-sm border border-line bg-surface p-4 shadow-card">
			<div className="flex flex-wrap items-center gap-3">
				<Button variant="outline" size="sm" onClick={() => setState((s) => (s === "shown" ? "leaving" : "shown"))}>
					{state === "shown" ? "Hide the summary" : "Show the summary"}
				</Button>
				<span className="text-sm text-ink-3">Arrives in {Math.round(260 * tempo)}ms and decelerates; leaves in {Math.round(120 * tempo)}ms and accelerates.</span>
			</div>
			<div className="min-h-20">
				{state !== "hidden" && (
					<div
						onAnimationEnd={() => state === "leaving" && setState("hidden")}
						className={cn("grid gap-1 rounded-sm border border-line bg-surface-2 p-3", state === "leaving" ? "animate-fade-out" : "animate-rise-in")}
					>
						<span className="text-base font-medium">Operations Coordinator</span>
						<span className="text-sm text-ink-2">12 new applications since Monday · 3 need review</span>
					</div>
				)}
			</div>
		</div>
	);
}

function Helpers() {
	const [copied, setCopied] = useState(false);
	const [count, setCount] = useState(3);
	useEffect(() => {
		if (!copied) return;
		const t = window.setTimeout(() => setCopied(false), 1500);
		return () => window.clearTimeout(t);
	}, [copied]);
	return (
		<div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
			<div className="grid gap-3 rounded-sm border border-line bg-surface p-4 shadow-card">
				<div className="flex items-center gap-3">
					<Button variant="outline" size="sm" onClick={() => setCopied(true)}>
						<Swap swapKey={copied ? "done" : "copy"} kind="icon">{copied ? <Check className="size-4" /> : <Copy className="size-4" />}</Swap>
						<Swap swapKey={copied ? "done" : "copy"}>{copied ? "Copied" : "Copy link"}</Swap>
					</Button>
				</div>
				<p className="text-sm text-ink-2"><code className="font-mono">Swap</code>: the new state enters at --duration-base, the old one leaves at --duration-exit.</p>
			</div>
			<div className="grid gap-3 rounded-sm border border-line bg-surface p-4 shadow-card">
				<div className="flex items-center gap-3">
					<Button variant="outline" size="sm" onClick={() => setCount((c) => c + 1)}>Add to review</Button>
					<span className="inline-flex items-center gap-1.5 text-base">
						In review <span className="rounded-xs bg-surface-2 px-1.5 text-sm font-medium"><Count value={count} /></span>
					</span>
				</div>
				<p className="text-sm text-ink-2"><code className="font-mono">Count</code>: the only overshoot in TwoUX, set by the theme's character.</p>
			</div>
		</div>
	);
}

/**
 * Play, then the preview speed beside it, so people change the speed where they watch the result. Each demo has its
 * own Play; the speed is shared by the whole page, as motion.tempo is shared by a product.
 */
function Player({ label, played, onPlay, tempo, onTempo }: { label: string; played: boolean; onPlay: () => void; tempo: (typeof TEMPOS)[number]; onTempo: (t: (typeof TEMPOS)[number]) => void }) {
	return (
		<div className="mb-3 flex flex-wrap items-center gap-3">
			<Button variant="outline" size="sm" onClick={onPlay}>
				<Play className="size-4" aria-hidden="true" />
				{played ? "Play back" : label}
			</Button>
			<span className="flex items-center gap-2">
				<span className="text-sm text-ink-2" aria-hidden="true">Speed</span>
				<SegmentedControl value={tempo} onValueChange={(v) => onTempo(v as typeof tempo)} aria-label="Preview speed">
					{TEMPOS.map((v) => <Segment key={v} value={v}>{v === "1" ? "1 (default)" : v}</Segment>)}
				</SegmentedControl>
			</span>
		</div>
	);
}

export function MotionDemos() {
	const reduced = useReducedMotion();
	const [tempo, setTempo] = useState<(typeof TEMPOS)[number]>("1");
	const [playedDurations, setPlayedDurations] = useState(false);
	const [playedCurves, setPlayedCurves] = useState(false);
	const t = Number(tempo);

	return (
		<div className="grid gap-12" style={tempoVars(t)}>
			<p className="max-w-[68ch] text-docs text-ink-2">
				Speed changes every demo on this page, as <code className="font-mono text-sm">motion.tempo</code> does for a product: 0.75 is quicker, 1.25 calmer.
				{reduced && " Reduced motion is on in your system settings, so these demos jump to their end state. That is what TwoUX does for everyone with this setting."}
			</p>

			<section>
				<H3 text="One band per job. Exits use the fast band, so people are never kept waiting for something to leave.">Duration</H3>
				<Player label="Play durations" played={playedDurations} onPlay={() => setPlayedDurations((p) => !p)} tempo={tempo} onTempo={setTempo} />
				<div className="overflow-hidden rounded-sm border border-line bg-surface">
					{DURATIONS.map(([token, base, use]) => <DurationRow key={token} token={token} base={base} use={use} tempo={t} played={playedDurations} />)}
				</div>
			</section>

			<section>
				<H3 text="Named by what the motion is for. Each dot below runs over 480ms so the shape of the curve is visible; in the product the same curves run at the durations above.">Easing</H3>
				<Player label="Play curves" played={playedCurves} onPlay={() => setPlayedCurves((p) => !p)} tempo={tempo} onTempo={setTempo} />
				<div className="grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-sm:grid-cols-1">
					{EASINGS.map(([token, use]) => <EasingCard key={token} token={token} use={use} played={playedCurves} />)}
				</div>
			</section>

			<section>
				<H3 text="Match the exit to the entrance, and leave faster than you arrive. What rises in fades out; it never flies off in another direction.">Entering and leaving</H3>
				<EnterExit tempo={t} />
			</section>

			<section>
				<H3 text="For changes inside a screen, use the helpers rather than writing an animation. They use these tokens, follow the tempo and stop under reduced motion.">Motion helpers</H3>
				<Helpers />
			</section>

			<section>
				<H3 text="Write tokens, never raw values, so a tempo change in the theme reaches your animation too.">Animate with the tokens</H3>
				<CodeBlock>
					<CodeBlockContent
						code={`// In a class: pick the duration by job and the easing by role
<div className="transition-[height] duration-(--duration-slow) ease-(--ease-standard)" />
<aside className="transition-[width] duration-(--duration-move) ease-(--ease-move)" />

/* In CSS */
.summary-enter { animation: var(--animate-rise-in); }
.summary-leave { animation: var(--animate-fade-out); }`}
					/>
				</CodeBlock>
			</section>

			<section>
				<H3 text="Change motion for the whole product in the theme file, never on one page. Tempo scales every duration token; crisp removes the overshoot from pops. Loops and shadcn's overlay motion are not scaled.">Tune motion from the theme</H3>
				<CodeBlock>
					<CodeBlockContent
						code={`// twoux.theme.json, then run: npx twoux theme
{
  "primary": "indigo",
  "motion": {
    "tempo": 0.9,          // 0.75 (quicker) to 1.25 (calmer)
    "character": "crisp"   // "standard" (default) or "crisp"
  }
}`}
					/>
				</CodeBlock>
			</section>
		</div>
	);
}
