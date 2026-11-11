// twoux theme: builds the brand layer (brand colour, corner radii, button shape, font).
// In an app: reads ./twoux.theme.json, writes ./twoux-theme.css (import it after @twoux/ui/styles.css).
// In the TwoUX repo: reads packages/ui/theme.json, writes packages/ui/src/styles/theme.css.
// Fails, and writes nothing, if the colour would break WCAG contrast.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const pkg = new URL("..", import.meta.url).pathname;
const projectTheme = join(process.cwd(), "twoux.theme.json");
const inApp = existsSync(projectTheme) && !existsSync(join(process.cwd(), "packages/ui/bin/theme.mjs"));
const THEME = inApp ? projectTheme : join(pkg, "theme.json");
const OUT = inApp ? join(process.cwd(), "twoux-theme.css") : join(pkg, "src/styles/theme.css");
const PALETTE = join(pkg, "src/styles/palette.css");

/* ---------- colour maths (same as scripts/palette.mjs) ---------- */
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
	let lo = 0, hi = c.C;
	if (!inGamut(oklchToRgb(c))) { for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; inGamut(oklchToRgb({ ...c, C: mid })) ? (lo = mid) : (hi = mid); } c = { ...c, C: lo }; }
	return `#${oklchToRgb(c).map((v) => Math.round(Math.min(1, Math.max(0, toGam(v))) * 255).toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}
const lum = (hex) => { const [r, g, b] = [1, 3, 5].map((i) => toLin(Number.parseInt(hex.slice(i, i + 2), 16) / 255)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const LIGHT = { 50: 0.975, 100: 0.945, 200: 0.89, 300: 0.81, 400: 0.71, 500: 0.62, 600: 0.545, 700: 0.475, 800: 0.405, 900: 0.335, 950: 0.255 };
const CHROMA = { 50: 0.14, 100: 0.25, 200: 0.45, 300: 0.7, 400: 0.9, 500: 1, 600: 1, 700: 0.92, 800: 0.8, 900: 0.66, 950: 0.5 };

/* ---------- read theme ---------- */
const theme = JSON.parse(readFileSync(THEME, "utf8"));
const fail = (msg) => { console.error(`${inApp ? "twoux.theme.json" : "theme.json"}: ${msg}\nNothing was written.`); process.exit(1); };

// The primary colour is either a TwoUX palette family ("indigo", "blue", "teal"...) or a brand hex.
let ramp;
let source;
if (/^#[0-9a-f]{6}$/i.test(theme.primary)) {
	const hex = theme.primary.toUpperCase();
	const c = hexToOklch(hex);
	const at = STEPS.reduce((best, s) => (Math.abs(LIGHT[s] - c.L) < Math.abs(LIGHT[best] - c.L) ? s : best), 600);
	const peak = c.C / CHROMA[at];
	ramp = Object.fromEntries(STEPS.map((s) => [s, s === at ? hex : oklchToHex({ L: LIGHT[s], C: peak * CHROMA[s], H: c.H })]));
	source = `brand ${hex} (anchored at step ${at})`;
} else {
	const palette = readFileSync(PALETTE, "utf8");
	ramp = Object.fromEntries(STEPS.map((s) => {
		const m = palette.match(new RegExp(`--color-${theme.primary}-${s}:\\s*(#[0-9A-F]{6})`, "i"));
		if (!m) fail(`"${theme.primary}" is not a palette family or a #RRGGBB colour.`);
		return [s, m[1].toUpperCase()];
	}));
	source = `palette family "${theme.primary}"`;
}

/* ---------- pick roles from the ramp, by contrast ---------- */
const WHITE = "#FFFFFF";
const darkerFrom = (start) => STEPS.filter((s) => s >= start);
const primaryStep = darkerFrom(500).find((s) => contrast(ramp[s], WHITE) >= 4.5);
if (!primaryStep) fail(`no step of ${source} reaches 4.5:1 with white text. Pick a darker or more saturated colour.`);
const hoverStep = STEPS[Math.min(STEPS.indexOf(primaryStep) + 1, STEPS.length - 1)];
const inkStep = darkerFrom(hoverStep).find((s) => contrast(ramp[s], WHITE) >= 7) ?? 950;
const soft = ramp[50];
const checks = [
	["White text on primary", contrast(WHITE, ramp[primaryStep]), 4.5],
	["Accent text on white", contrast(ramp[inkStep], WHITE), 4.5],
	["Accent text on the selection tint", contrast(ramp[inkStep], soft), 4.5],
	["Focus ring on white", contrast(ramp[primaryStep], WHITE), 3],
];
/* Dark theme: the same brand, re-chosen against the dark surfaces in twoux.css (not a flip). */
const twouxCss = readFileSync(join(pkg, "src/styles/twoux.css"), "utf8");
const darkOf = (role) => twouxCss.match(new RegExp(`--color-${role}: light-dark\\([^,]+,\\s*(#[0-9A-F]{6})\\)`, "i"))[1];
const [DS, DHOVER] = [darkOf("surface"), darkOf("hover")];
const mix = (a, b, t) => { // oklab mix, as color-mix(in oklab, a t, b)
	const [p, q] = [hexToOklch(a), hexToOklch(b)].map(({ L, C, H }) => [L, C * Math.cos((H * Math.PI) / 180), C * Math.sin((H * Math.PI) / 180)]);
	const [L, x, y] = p.map((v, i) => v * t + q[i] * (1 - t));
	return oklchToHex({ L, C: Math.hypot(x, y), H: (Math.atan2(y, x) * 180) / Math.PI });
};
const darkSoft = mix(ramp[500], DS, 0.18);
const lighterFrom = (start) => STEPS.filter((s) => s <= start).reverse();
const darkInkStep = lighterFrom(400).find((s) => contrast(ramp[s], DS) >= 7 && contrast(ramp[s], darkSoft) >= 4.5) ?? 50;
const focusStep = contrast(ramp[primaryStep], DHOVER) >= 3 ? primaryStep : lighterFrom(primaryStep).find((s) => contrast(ramp[s], DHOVER) >= 3) ?? 300;
checks.push(
	["Dark: accent text on the surface", contrast(ramp[darkInkStep], DS), 4.5],
	["Dark: accent text on the selection tint", contrast(ramp[darkInkStep], darkSoft), 4.5],
	["Dark: focus ring on a hover fill", contrast(ramp[focusStep], DHOVER), 3],
);
const failed = checks.filter(([, r, min]) => r < min);
if (failed.length) fail(failed.map(([n, r, min]) => `${n} is ${r.toFixed(2)}:1, needs ${min}:1`).join("; "));

/* ---------- radii and font ---------- */
const { button: buttonRadius, ...tiers } = theme.radius ?? {};
const radius = { xs: 4, sm: 6, md: 8, ...tiers };
if (buttonRadius !== undefined && buttonRadius !== "pill" && (typeof buttonRadius !== "number" || buttonRadius < 0 || buttonRadius > 16)) fail('radius.button must be a number from 0 to 16, or "pill".');
const buttonCss = buttonRadius === "pill" ? "9999px" : buttonRadius === undefined ? "var(--radius-sm)" : `${buttonRadius}px`;
for (const [k, v] of Object.entries(radius)) if (typeof v !== "number" || v < 0 || v > 16) fail(`radius.${k} must be a number from 0 to 16.`);
if (!(radius.xs <= radius.sm && radius.sm <= radius.md)) fail("radius must grow: xs ≤ sm ≤ md (inside, controls, floating).");
const font = theme.font ?? "Geist";

/* ---------- motion: tempo scales durations, character sets how much a pop overshoots ---------- */
const { tempo = 1, character = "standard" } = theme.motion ?? {};
if (typeof tempo !== "number" || tempo < 0.75 || tempo > 1.25) fail("motion.tempo must be a number from 0.75 (quicker) to 1.25 (calmer). TwoUX stays short because people trigger the same motion all day.");
const CHARACTERS = {
	crisp: { ease: "cubic-bezier(0.22, 1, 0.36, 1)", pop: 1.1 },
	standard: { ease: "cubic-bezier(0.34, 1.56, 0.64, 1)", pop: 1.25 },
};
if (!CHARACTERS[character]) fail(`motion.character must be "crisp" or "standard". TwoUX has no expressive character: overshoot on entrances and layout slows down work.`);

/* ---------- write ---------- */
const css = `/* Generated by twoux theme from ${inApp ? "twoux.theme.json" : "packages/ui/theme.json"} (${source}). Do not edit: change the theme file and run twoux theme. */
@theme static {
${STEPS.map((s) => `  --color-brand-${s}: ${ramp[s]};`).join("\n")}

  /* Primary roles, chosen by contrast */
  --color-primary: var(--color-brand-${primaryStep});        /* ${contrast(WHITE, ramp[primaryStep]).toFixed(2)}:1 with white text */
  --color-primary-hover: var(--color-brand-${hoverStep});
  --color-primary-soft: light-dark(var(--color-brand-50), color-mix(in oklab, var(--color-brand-500) 18%, ${DS})); /* selected rows, AI cell tint */
  --color-primary-ink: light-dark(var(--color-brand-${inkStep}), var(--color-brand-${darkInkStep})); /* accent text, ${contrast(ramp[inkStep], WHITE).toFixed(2)}:1 on white, ${contrast(ramp[darkInkStep], DS).toFixed(2)}:1 on dark */
  --color-focus: light-dark(var(--color-primary), var(--color-brand-${focusStep})); /* focus ring: ${contrast(ramp[focusStep], DHOVER).toFixed(2)}:1 on a dark hover fill */
  --color-primary-foreground: var(--color-white);

  /* Corners: inside a control, controls and cards, what floats */
  --radius-xs: ${radius.xs}px;
  --radius-sm: ${radius.sm}px;
  --radius-md: ${radius.md}px;
  --radius-button: ${buttonCss}; /* buttons only; defaults to sm */

  --font-sans: "${font}", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;

  /* Motion: tempo scales every --duration-* token; character sets the pop */
  --motion-tempo: ${tempo};
  --motion-pop-scale: ${CHARACTERS[character].pop};
  --ease-pop: ${CHARACTERS[character].ease}; /* ${character} */
}
`;
// Warn when the brand sits close to a status hue: a green brand next to green "Open" badges reads as status.
const paletteCss = readFileSync(PALETTE, "utf8");
const hueOf = (name) => hexToOklch(paletteCss.match(new RegExp(`--color-${name}:\\s*(#[0-9A-F]{6})`, "i"))[1]).H;
const STATUS = { ok: hueOf("green-700"), warn: hueOf("amber-600"), bad: hueOf("red-600") };
const brandHue = hexToOklch(ramp[primaryStep]).H;
for (const [name, h] of Object.entries(STATUS)) {
	const d = Math.min(Math.abs(brandHue - h), 360 - Math.abs(brandHue - h));
	if (d < 30) console.warn(`  Note: the brand hue is ${Math.round(d)}° from the "${name}" status colour. Primary buttons and ${name} badges may read as the same thing; status always carries a word, but check key screens.`);
}
writeFileSync(OUT, css);
if (inApp) console.log(`Wrote twoux-theme.css. Import it after @twoux/ui/styles.css.`);
console.log(`Theme: ${source}. Primary step ${primaryStep} (${ramp[primaryStep]}), ink ${inkStep}.`);
if (/^#/.test(theme.primary) && ramp[primaryStep] !== theme.primary.toUpperCase())
	console.warn(`  Note: ${theme.primary.toUpperCase()} is too light for white button text (${contrast(theme.primary, WHITE).toFixed(2)}:1), so buttons use the darker ${ramp[primaryStep]}. Your exact colour stays available as --color-brand-* for marks and illustrations.`);
if (contrast(ramp[primaryStep], DS) < 3) console.warn(`  Note: in dark, primary buttons are ${contrast(ramp[primaryStep], DS).toFixed(2)}:1 against the surface. Their white label carries them (WCAG 1.4.11 exempts labelled buttons), but they will look quieter than in light.`);
for (const [n, r, min] of checks) console.log(`  ${n}: ${r.toFixed(2)}:1 (needs ${min}:1)`);
console.log(`  Radius ${radius.xs}/${radius.sm}/${radius.md}px, buttons ${buttonRadius ?? "sm"} · font ${font} · motion tempo ${tempo}, ${character}`);
