import { Badge, cn } from "@twoux/ui";
import { useEffect, useState } from "react";
import palette from "../../../../packages/ui/registry/palette.json";
import { MotionDemos } from "./motion-demos";

/** Resolve a colour token to the hex it paints in the current theme (roles are light-dark() pairs, so the raw value isn't a colour). */
function resolve(name: string) {
	const probe = document.createElement("span");
	probe.style.color = `var(${name})`;
	document.body.appendChild(probe);
	const c = getComputedStyle(probe).color;
	probe.remove();
	const cx = Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d");
	if (!cx) return "";
	cx.fillStyle = c;
	cx.fillRect(0, 0, 1, 1);
	const [r, g, bl] = cx.getImageData(0, 0, 1, 1).data;
	return `#${[r, g, bl].map((n) => n.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

/** Read a token straight from the stylesheet, so the docs can never show a value the product doesn't use. Updates when the theme changes. */
export function useToken(name: string) {
	const [v, setV] = useState("");
	useEffect(() => {
		const raw = () => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
		const read = () => setV(name.startsWith("--color-") ? resolve(name) : raw());
		read();
		const mo = new MutationObserver(read);
		mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		mq.addEventListener("change", read);
		return () => { mo.disconnect(); mq.removeEventListener("change", read); };
	}, [name]);
	return v;
}

function lum(hex: string) {
	const h = hex.replace("#", "");
	if (h.length < 6) return 1;
	const c = [0, 2, 4].map((i) => Number.parseInt(h.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
	return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
/** Contrast against the current surface (white in light, the dark surface in dark) unless another colour is given. */
export function contrast(a: string, b = typeof document === "undefined" ? "#FFFFFF" : resolve("--color-surface") || "#FFFFFF") {
	const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
	return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
}

type Need = "text" | "ui" | "none";
function Pass({ ratio, need }: { ratio: number; need: Need }) {
	if (need === "none") return <span className="text-sm text-ink-3">Decorative</span>;
	const min = need === "text" ? 4.5 : 3;
	return ratio >= min ? (
		<Badge variant="success">{ratio}:1 · passes {need === "text" ? "1.4.3" : "1.4.11"}</Badge>
	) : (
		<Badge variant="destructive">{ratio}:1 · fails {need === "text" ? "1.4.3" : "1.4.11"}</Badge>
	);
}

function Swatch({ token, use, need }: { token: string; use: string; need: Need }) {
	const v = useToken(token);
	return (
		<tr className="border-t border-line">
			<td className="px-3 py-2">
				<span className="flex items-center gap-3">
					<span className="size-8 shrink-0 rounded-sm border border-line" style={{ background: `var(${token})` }} />
					<span className="grid">
						<code className="font-mono text-sm">{token}</code>
						<span className="font-mono text-xs text-ink-3">{v}</span>
					</span>
				</span>
			</td>
			<td className="px-3 py-2 text-ink-2">{use}</td>
			<td className="px-3 py-2">{v && <Pass ratio={contrast(v)} need={need} />}</td>
		</tr>
	);
}

const PALETTE: { title: string; rows: [string, string, Need][] }[] = [
	{
		title: "Surfaces",
		rows: [
			["--color-bg", "Page and app shell", "none"],
			["--color-surface", "Cards, tables, panels, popovers", "none"],
			["--color-surface-2", "Table header, footers", "none"],
			["--color-hover", "Hover fill, skeleton", "none"],
			["--color-selected", "Selected nav item", "none"],
		],
	},
	{
		title: "Lines and control borders",
		rows: [
			["--color-line", "Dividers, table rows, card edges", "none"],
			["--color-line-strong", "Outlines on grey: secondary buttons, popovers, canvas", "none"],
			["--color-input", "Edge of text fields and selects (with a visible label and shadow)", "none"],
			["--color-control", "Edge of checkboxes, radios and switches", "ui"],
		],
	},
	{
		title: "Text",
		rows: [
			["--color-ink", "Primary text", "text"],
			["--color-ink-2", "Secondary text, labels, column headers", "text"],
			["--color-ink-3", "Placeholders, meta", "text"],
			["--color-primary-ink", "Links, selected tab, accent text", "text"],
		],
	},
	{
		title: "Accent",
		rows: [
			["--color-primary", "The one primary action, focus ring, selection", "ui"],
			["--color-primary-soft", "Selected rows, AI cell tint", "none"],
		],
	},
	{
		title: "Status (reserved for state)",
		rows: [
			["--color-ok", "Live, done, success", "text"],
			["--color-warn", "Expiring, needs you", "text"],
			["--color-bad", "Failed, closed, errors", "text"],
			["--color-progress", "In progress", "ui"],
		],
	},
];

export function ColourTables() {
	return (
		<div className="grid gap-6">
			{PALETTE.map((g) => (
				<div key={g.title}>
					<h3 className="mb-2 text-md font-semibold">{g.title}</h3>
					<div className="overflow-x-auto rounded-sm border border-line bg-surface">
						<table className="w-full min-w-[620px] border-collapse text-left text-docs-sm">
							<thead className="bg-surface-2 text-sm text-ink-2">
								<tr>
									<th className="px-3 py-2 font-medium">Token</th>
									<th className="px-3 py-2 font-medium">Use</th>
									<th className="px-3 py-2 font-medium">Contrast on white</th>
								</tr>
							</thead>
							<tbody>
								{g.rows.map(([t, u, n]) => (
									<Swatch key={t} token={t} use={u} need={n} />
								))}
							</tbody>
						</table>
					</div>
				</div>
			))}
		</div>
	);
}

export function DataVisSwatches() {
	const cats = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => `--color-c${i}`);
	const seq = [1, 2, 3, 4, 5].map((i) => `--color-q${i}`);
	return (
		<div className="grid gap-6">
			<div>
				<h3 className="mb-1 text-md font-semibold">Categorical, in this order</h3>
				<p className="mb-3 text-ink-2">Series 1 always gets c1. A ninth series folds into “Other”. Scatter and categorical heatmaps use c1 to c3 only.</p>
				<div className="grid grid-cols-8 gap-2 max-md:grid-cols-4">
					{cats.map((t, i) => (
						<Chip key={t} token={t} label={`${i + 1}`} />
					))}
				</div>
			</div>
			<div>
				<h3 className="mb-1 text-md font-semibold">Sequential and ordinal</h3>
				<p className="mb-3 text-ink-2">One hue, light to dark. Darker always means more.</p>
				<div className="flex overflow-hidden rounded-sm">
					{seq.map((t) => (
						<SeqStep key={t} token={t} />
					))}
				</div>
			</div>
		</div>
	);
}
function Chip({ token, label }: { token: string; label: string }) {
	const v = useToken(token);
	return (
		<div className="grid gap-1">
			<span className="h-12 rounded-sm" style={{ background: `var(${token})` }} />
			<span className="text-sm font-medium">{label}</span>
			<span className="font-mono text-xs text-ink-3">{v}</span>
			{v && <span className={cn("text-xs", contrast(v) >= 3 ? "text-ok" : "text-bad")}>{contrast(v)}:1</span>}
		</div>
	);
}
function SeqStep({ token }: { token: string }) {
	const v = useToken(token);
	return (
		<div className="flex h-14 flex-1 items-end p-2" style={{ background: `var(${token})` }}>
			<span className={cn("font-mono text-xs", contrast(v || "#FFFFFF", "#FFFFFF") > 4 ? "text-white" : "text-black")}>{token.replace("--color-", "")}</span>
		</div>
	);
}

const TYPE: [string, string, string][] = [
	["text-2xl", "Page title", "Listings"],
	["text-xl", "Figures", "£32,000"],
	["text-lg", "Section heading", "Performance"],
	["text-md", "Lead text", "Applies per day by team"],
	["text-base", "Body, table cells, buttons", "Junior Product Designer · London"],
	["text-sm", "Meta, column headers, helper text", "Updated 12 min ago"],
	["text-xs", "Keycaps, counts, chart ticks only", "24"],
];
export function TypeScale() {
	return (
		<div className="overflow-hidden rounded-sm border border-line bg-surface">
			{TYPE.map(([cls, use, sample]) => (
				<TypeRow key={cls} cls={cls} use={use} sample={sample} />
			))}
		</div>
	);
}
function TypeRow({ cls, use, sample }: { cls: string; use: string; sample: string }) {
	const size = useToken(`--${cls}`);
	const lh = useToken(`--${cls}--line-height`);
	return (
		<div className="grid grid-cols-[150px_1fr_220px] items-center gap-4 border-t border-line px-3 py-2 first:border-t-0 max-md:grid-cols-1">
			<span className="grid">
				<code className="font-mono text-sm">{cls}</code>
				<span className="font-mono text-xs text-ink-3">
					{size} / {lh}
				</span>
			</span>
			<span className={cn(cls, cls.match(/xl|lg/) ? "font-semibold" : "")}>{sample}</span>
			<span className="text-sm text-ink-2">{use}</span>
		</div>
	);
}

export function SpacingScale() {
	const steps = [1, 2, 3, 4, 5, 6, 8, 10];
	return (
		<div className="overflow-hidden rounded-sm border border-line bg-surface">
			{steps.map((n) => (
				<div key={n} className="grid grid-cols-[110px_70px_1fr] items-center gap-4 border-t border-line px-4 py-2 first:border-t-0">
					<code className="font-mono text-sm">p-{n} · gap-{n}</code>
					<span className="font-mono text-sm text-ink-2">{n * 4}px</span>
					<span className="h-3 rounded-xs bg-primary" style={{ width: `calc(var(--spacing) * ${n})` }} />
				</div>
			))}
		</div>
	);
}

export function ShapeSamples() {
	const radii: [string, string][] = [
		["rounded-xs", "Badges, keycaps, checkboxes"],
		["rounded-sm", "Buttons, inputs, menu items"],
		["rounded-sm", "Cards, panels, popovers"],
		["rounded-sm", "Dialogs"],
	];
	return (
		<div className="grid grid-cols-4 gap-3 max-md:grid-cols-2">
			{radii.map(([cls, use]) => (
				<div key={cls} className="grid gap-2">
					<span className={cn("h-16 border border-control bg-surface-2", cls)} />
					<code className="font-mono text-sm">{cls}</code>
					<span className="text-sm text-ink-2">{use}</span>
				</div>
			))}
			<div className="col-span-full mt-2 grid grid-cols-2 gap-3">
				<div className="grid h-20 place-items-center rounded-sm border border-line bg-surface text-sm text-ink-2">In-page: border, no shadow</div>
				<div className="grid h-20 place-items-center rounded-sm bg-surface text-sm text-ink-2 shadow-pop">Floating: shadow-pop</div>
			</div>
		</div>
	);
}

export function DensitySamples() {
	const rows: [string, string, string][] = [
		["h-control-sm", "28px", "Small buttons, filter pills, toolbar controls"],
		["h-control", "32px", "Default buttons and inputs"],
		["h-row", "36px", "Table and list rows"],
	];
	return (
		<div className="overflow-hidden rounded-sm border border-line bg-surface">
			{rows.map(([cls, px, use]) => (
				<div key={cls} className="grid grid-cols-[130px_60px_1fr_1fr] items-center gap-4 border-t border-line px-4 py-2 first:border-t-0 max-md:grid-cols-2">
					<code className="font-mono text-sm">{cls}</code>
					<span className="font-mono text-sm text-ink-2">{px}</span>
					<span className={cn("flex items-center rounded-sm border border-dashed border-primary bg-primary-soft px-2 text-sm text-primary-ink", cls)}>{px}</span>
					<span className="text-sm text-ink-2">{use}</span>
				</div>
			))}
		</div>
	);
}


/* ---------- primitive ranges (Tailwind-style 50–950), from the generated palette ---------- */
function RangeSwatch({ family, s }: { family: string; s: (typeof palette)[number]["steps"][number] }) {
	const [copied, setCopied] = useState(false);
	const token = `--color-${family}-${s.step}`;
	const textOn = s.onWhite >= s.onBlack ? "white" : "black";
	const best = Math.max(s.onWhite, s.onBlack);
	return (
		<button
			type="button"
			title={`${token} · ${s.hex} · ${s.onWhite}:1 on white${s.anchor ? " · anchor" : ""}. Click to copy the token.`}
			onClick={() => navigator.clipboard?.writeText(`var(${token})`).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1000); })}
			className="group grid min-w-0 gap-1.5 text-left"
		>
			<span className={cn("relative grid h-12 place-items-center rounded-sm ring-1 ring-black/5 transition-transform group-hover:scale-[1.04]", textOn === "white" ? "text-white" : "text-black")} style={{ background: s.hex }}>
				<span className="text-xs font-semibold opacity-0 group-hover:opacity-100">{copied ? "Copied" : best >= 4.5 ? "AA" : best >= 3 ? "AA large" : ""}</span>
				{s.anchor && <span className="absolute top-1 right-1 size-1.5 rounded-full bg-current opacity-70" />}
			</span>
			<span className="grid leading-tight">
				<span className="text-docs-sm font-medium">{s.step}</span>
				<span className="font-mono text-xs text-ink-3 uppercase">{s.hex.slice(1)}</span>
			</span>
		</button>
	);
}

export function PaletteRanges() {
	return (
		<div className="grid gap-5">
			{palette.map((f) => (
				<div key={f.name} className="grid grid-cols-[140px_1fr] items-start gap-4 max-xl:grid-cols-1">
					<div className="pt-2">
						<div className="text-docs font-semibold capitalize">{f.name}</div>
						<div className="text-docs-sm text-ink-3">{f.note}</div>
					</div>
					<div className="overflow-x-auto pb-1"><div className="grid min-w-[560px] gap-2" style={{ gridTemplateColumns: `repeat(${f.steps.length}, minmax(0, 1fr))` }}>
						{f.steps.map((s) => (
							<RangeSwatch key={s.step} family={f.name} s={s} />
						))}
					</div></div>
				</div>
			))}
			<p className="text-docs-sm text-ink-2">
				<span className="mr-1 inline-block size-1.5 rounded-full bg-ink-2 align-middle" /> marks an anchor: a value validated for contrast and kept exactly. Hover a swatch to see whether white or black text passes; click to copy the token.
			</p>
		</div>
	);
}

function ColoursPage() {
	return (
		<div className="grid gap-12">
			<section>
				<h3 className="mb-1 text-docs-h3 font-semibold">Ranges</h3>
				<p className="mb-5 max-w-[68ch] text-docs text-ink-2">The primitives behind the roles, 50 to 950, built in OKLCH so lightness steps evenly. Use a role in product code; reach for a range only in charts and reviewed illustrations.</p>
				<PaletteRanges />
			</section>
			<section>
				<h3 className="mb-1 text-docs-h3 font-semibold">Roles</h3>
				<p className="mb-5 max-w-[68ch] text-docs text-ink-2">What components use. Each role points to one step in a range, so it can be re-pointed in one place.</p>
				<ColourTables />
			</section>
		</div>
	);
}

export const VISUAL: Record<string, () => React.JSX.Element> = {
	colours: ColoursPage,
	"data-vis-colours": DataVisSwatches,
	typography: TypeScale,
	spacing: SpacingScale,
	"shape-elevation": ShapeSamples,
	"content-density": DensitySamples,
	motion: MotionDemos,
};
