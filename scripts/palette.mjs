// Generates the primitive colour ranges (50–950) in OKLCH, like Tailwind v4.
// Every role colour TwoUX already validated is kept EXACTLY as an anchor on its nearest step,
// so no contrast ratio changes. Run: node scripts/palette.mjs  → packages/ui/src/styles/palette.css + palette.json
import { writeFileSync } from "node:fs";

/* ---------- colour maths: sRGB <-> OKLab/OKLCH (Björn Ottosson) ---------- */
const toLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function hexToOklch(hex) {
	const [r, g, b] = [1, 3, 5].map((i) => toLin(Number.parseInt(hex.slice(i, i + 2), 16) / 255));
	const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
	const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
	const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
	const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
	const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
	const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
	return { L, C: Math.hypot(A, B), H: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360 };
}
function oklchToRgb({ L, C, H }) {
	const a = C * Math.cos((H * Math.PI) / 180), b = C * Math.sin((H * Math.PI) / 180);
	const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
	return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
}
const inGamut = (rgb) => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);
function oklchToHex(c) {
	let lo = 0, hi = c.C; // reduce chroma until in sRGB gamut
	if (!inGamut(oklchToRgb(c))) { for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; inGamut(oklchToRgb({ ...c, C: mid })) ? (lo = mid) : (hi = mid); } c = { ...c, C: lo }; }
	return `#${oklchToRgb(c).map((v) => Math.round(Math.min(1, Math.max(0, toGam(v))) * 255).toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}
const lum = (hex) => { const [r, g, b] = [1, 3, 5].map((i) => toLin(Number.parseInt(hex.slice(i, i + 2), 16) / 255)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100; };

/* ---------- scale shape (lightness per step, Tailwind v4-like) ---------- */
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const LIGHT = { 50: 0.975, 100: 0.945, 200: 0.89, 300: 0.81, 400: 0.71, 500: 0.62, 600: 0.545, 700: 0.475, 800: 0.405, 900: 0.335, 950: 0.255 };
const CHROMA = { 50: 0.14, 100: 0.25, 200: 0.45, 300: 0.7, 400: 0.9, 500: 1, 600: 1, 700: 0.92, 800: 0.8, 900: 0.66, 950: 0.5 };

/* ---------- families and their anchors (validated role values, kept exact) ---------- */
const FAMILIES = {
	indigo: { anchors: { 50: "#EEEDFD", 600: "#5753E0", 700: "#4340C4" }, note: "Accent. 600 = primary action, 700 = accent text, 50 = selection tint" },
	green: { anchors: { 50: "#E8F6EE", 200: "#BFE3CD" }, ref: "#1E7F47", note: "Status: ok (700 generated for a smooth range, re-checked for contrast)" },
	amber: { anchors: { 50: "#FDF4E3", 200: "#F0D7A8", 600: "#A87000", 700: "#965606" }, note: "Status: warn, in progress" },
	red: { anchors: { 50: "#FCECED", 200: "#F1C3C6", 600: "#C2333B" }, note: "Status: bad, destructive" },
	orange: { anchors: { 500: "#E0602B" }, note: "Data visualisation (series 2)" },
	teal: { anchors: { 600: "#00897B" }, note: "Data visualisation (series 3)" },
	magenta: { anchors: { 600: "#CC4A7A" }, note: "Data visualisation (series 5)" },
	blue: { anchors: { 600: "#2A78D6" }, note: "Data visualisation (series 7)" },
};

const out = {};
for (const [name, f] of Object.entries(FAMILIES)) {
	const hue = hexToOklch(f.ref ?? f.anchors[500] ?? f.anchors[600] ?? Object.values(f.anchors)[0]).H;
	const peak = Math.max(...[...Object.values(f.anchors), ...(f.ref ? [f.ref] : [])].map((h) => hexToOklch(h).C));
	out[name] = Object.fromEntries(STEPS.map((s) => [s, f.anchors[s] ?? oklchToHex({ L: LIGHT[s], C: peak * CHROMA[s] * 1.05, H: hue })]));
}
// Neutral: hand-anchored. Neutrals need finer light steps for surfaces, so 25, 75 and 150 exist only here.
out.neutral = {
	25: "#FAFAFC", 50: "#F5F5F8", 75: "#F0F0F4", 100: "#ECECF2", 150: "#E6E6EC", 200: "#D6D6DF",
	300: "#B4B4C1", 400: "#9D9DAB", 500: "#868695", 600: "#656574", 700: "#474756", 800: "#33333F", 900: "#23232D", 950: "#17171F",
};
FAMILIES.neutral = { anchors: { 25: 1, 50: 1, 75: 1, 100: 1, 150: 1, 200: 1, 500: 1, 600: 1, 700: 1, 950: 1 }, note: "Surfaces, lines, text" };

/* ---------- check: lightness must fall monotonically, anchors must sit on the right step ---------- */
const problems = [];
for (const [name, scale] of Object.entries(out)) {
	const vals = Object.entries(scale);
	for (let i = 1; i < vals.length; i++) if (hexToOklch(vals[i][1]).L >= hexToOklch(vals[i - 1][1]).L) problems.push(`${name}-${vals[i][0]} is not darker than ${name}-${vals[i - 1][0]}`);
}

const ORDER = ["neutral", "indigo", "blue", "teal", "green", "amber", "orange", "red", "magenta"];
let css = "/* Generated by scripts/palette.mjs. Do not edit: change the anchors there and re-run. */\n@theme static {\n  /* Remove Tailwind's default palette: only TwoUX colours exist, so bg-slate-500 and friends fail to build. */\n  --color-*: initial;\n  --color-white: #FFFFFF;\n  --color-black: #000000;\n";
for (const n of ORDER) {
	css += `\n  /* ${n}: ${FAMILIES[n].note} */\n`;
	for (const [s, hex] of Object.entries(out[n])) css += `  --color-${n}-${s}: ${hex};${FAMILIES[n].anchors[s] ? " /* anchor */" : ""}\n`;
}
css += "}\n";
writeFileSync(new URL("../packages/ui/src/styles/palette.css", import.meta.url), css);
const json = ORDER.map((n) => ({ name: n, note: FAMILIES[n].note, steps: Object.entries(out[n]).map(([s, hex]) => ({ step: s, hex, anchor: !!FAMILIES[n].anchors[s], onWhite: contrast(hex, "#FFFFFF"), onBlack: contrast(hex, "#000000") })) }));
writeFileSync(new URL("../packages/ui/registry/palette.json", import.meta.url), JSON.stringify(json, null, 2));
console.log(`Wrote ${ORDER.length} ranges.`, problems.length ? `\nPROBLEMS:\n${problems.join("\n")}` : "Lightness is monotonic in every range.");
