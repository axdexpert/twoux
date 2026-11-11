// Measures the rendered docs against TwoUX's own rules. node scripts/checks/audit.mjs
// Type scale, 4px spacing grid, radius tokens, text contrast on its real background, focus visibility, target size.
import { chromium } from "playwright-core";
const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const PAGES = ["/", "/docs", "/components", "/components/button", "/components/button?tab=usage", "/components/button?tab=api", "/components/checkbox?tab=accessibility", "/foundation/colours", "/foundation/typography", "/patterns/propose-apply", "/for-agents", "/how-its-built", "/components/filter-bar", "/components/board"];

const browser = await chromium.launch({ channel: "chrome" });
// THEME=dark runs the same audit with the dark theme on (pnpm verify runs both).
const theme = process.env.THEME === "dark" ? "dark" : "light";
let page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const prep = async (pg) => { if (theme === "dark") await pg.addInitScript(() => localStorage.setItem("twoux-theme", "dark")); };
await prep(page);
console.log(`Theme: ${theme}`);
// ALL=1 audits every page, found from the three index pages.
if (process.env.ALL) {
	const found = new Set(["/", "/docs", "/example-app", "/for-agents", "/how-its-built"]);
	for (const idx of ["/components", "/foundation", "/patterns"]) {
		await page.goto(BASE + idx); await page.waitForTimeout(500); found.add(idx);
		for (const h of await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")))) if (/^\/(components|foundation|patterns)\/[\w-]+$/.test(h)) found.add(h);
	}
	PAGES.splice(0, PAGES.length, ...found);
	console.log(`Pages: ${PAGES.length}`);
}
const totals = {};
const add = (k, v) => ((totals[k] ??= new Map()), totals[k].set(v, (totals[k].get(v) ?? 0) + 1));

const auditPage = async (n, path) => {
	const t0 = Date.now();
	await page.goto(BASE + path);
	await page.waitForTimeout(700);
	const r = await page.evaluate((marketing) => {
		const TYPE = new Set([11, 12, 13, 14, 15, 16, 18, 20, 24, ...(marketing ? [] : [])]); // TwoUX scale 11–24 plus the docs reading sizes; the home page adds its display sizes
		const RADII = new Set([0, 2, 4, 6, 8, 12, 16, 9999]);
		const px = (v) => Number.parseFloat(v) || 0;
		// Any CSS colour (rgb, oklab from color-mix, color(srgb …)) read back through a canvas, so nothing is skipped.
		const cx = Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", { willReadFrequently: true });
		const parse = (c) => { if (!c || c === "transparent" || c === "rgba(0, 0, 0, 0)") return null; cx.clearRect(0, 0, 1, 1); cx.fillStyle = "#000"; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const [r, g, b, a] = cx.getImageData(0, 0, 1, 1).data; return { r, g, b, a: a / 255 }; };
		const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
		const L = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
		const blend = (top, base) => ({ r: top.r * top.a + base.r * (1 - top.a), g: top.g * top.a + base.g * (1 - top.a), b: top.b * top.a + base.b * (1 - top.a), a: 1 });
		const bgOf = (el) => { const stack = []; for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0) { stack.push(c); if (c.a === 1) break; } } let base = { r: 255, g: 255, b: 255, a: 1 }; for (const c of stack.reverse()) base = blend(c, base); return base; };
		const out = { offScale: [], offGrid: [], radius: [], contrast: [], small: [], sizes: {} };
		const visible = (el) => { const b = el.getBoundingClientRect(); const s = getComputedStyle(el); return b.width > 0 && b.height > 0 && s.visibility !== "hidden" && s.opacity !== "0"; };
		const label = (el) => `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.split(" ").slice(0, 3).join(".") : ""} “${(el.textContent || "").trim().slice(0, 40)}”`;
		const all = [...document.querySelectorAll("header *, aside *, main *")].filter((el) => !el.closest(".code-panel, [data-example], svg, .shiki, [inert], [aria-hidden=true]") && visible(el));
		for (const el of all) {
			if (el.closest(".sr-only")) continue; // screen-reader text is never seen
			const s = getComputedStyle(el);
			const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
			if (hasText) {
				const fs = Math.round(px(s.fontSize) * 10) / 10;
				out.sizes[fs] = (out.sizes[fs] ?? 0) + 1;
				if (!TYPE.has(fs) && !s.fontFamily.includes("Mono")) out.offScale.push(`${fs}px ${label(el)}`);
				const fg = parse(s.color); if (fg) { const bg = bgOf(el); const c = blend(fg, bg); const [a, b] = [L(c), L(bg)].sort((x, y) => y - x); const ratio = (a + 0.05) / (b + 0.05); const large = px(s.fontSize) >= 18.66 || (px(s.fontSize) >= 14 && Number(s.fontWeight) >= 700); if (ratio < (large ? 3 : 4.5)) out.contrast.push(`${ratio.toFixed(2)}:1 ${label(el)}`); }
			}
			for (const prop of ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "rowGap", "columnGap", "marginTop", "marginBottom"]) { const v = px(s[prop]); if (v && Math.abs(v) % 2 !== 0 && Math.abs(v) !== 1) out.offGrid.push(`${prop} ${v}px ${label(el)}`); }
			const rad = Math.round(px(s.borderTopLeftRadius)); if (rad && !RADII.has(rad) && rad < 100) out.radius.push(`${rad}px ${label(el)}`);
			if (el.matches("button, a[href], input, [role=tab], [role=option]") && !el.closest("p, li > span, td > span, .cite") && !(el.matches("input[type=checkbox], input[type=radio]") && el.closest("label") && el.closest("label").getBoundingClientRect().height >= 24)) { const b0 = el.getBoundingClientRect(); const af = getComputedStyle(el, "::after"); const grow = af.position === "absolute" ? Math.max(0, -px(af.top)) * 2 : 0; const b = { width: b0.width + grow, height: b0.height + grow }; // WCAG 2.5.8 spacing exception: an undersized target passes if a 24px circle on its centre touches no other target.
				const spaced = () => { const cx = b0.left + b0.width / 2, cy = b0.top + b0.height / 2; return ![...document.querySelectorAll("button, a[href], input, [role=tab], [role=option]")].some((o) => { if (o === el || o.contains(el) || el.contains(o)) return false; const r = o.getBoundingClientRect(); if (!r.width || !r.height) return false; const nx = Math.max(r.left, Math.min(cx, r.right)), ny = Math.max(r.top, Math.min(cy, r.bottom)); return Math.hypot(cx - nx, cy - ny) < 12; }); };
				if ((b.height < 24 || b.width < 24) && !(el.tagName === "A" && s.display === "inline") && !spaced()) out.small.push(`${Math.round(b.width)}×${Math.round(b.height)} ${label(el)}`); }
		}
		return out;
	}, path === "/");
	for (const k of ["offScale", "offGrid", "radius", "contrast", "small"]) for (const v of r[k]) add(k, v.replace(/“.*”/, "").trim());
	for (const [k, n] of Object.entries(r.sizes)) add("sizes", `${k}px`);
	// focus: tab through and check every stop shows an outline or ring
	await page.evaluate(() => document.body.focus());
	const missing = [];
	for (let i = 0; i < 25; i++) {
		await page.keyboard.press("Tab");
		const f = await page.evaluate(() => { const el = document.activeElement; if (!el || el === document.body || el.hasAttribute("data-radix-focus-guard")) return null; /* Radix focus guards: invisible stops that hand focus to an open popover */ const s = getComputedStyle(el); const has = (n) => { const st = getComputedStyle(n); return (st.outlineStyle !== "none" && Number.parseFloat(st.outlineWidth) > 0) || (st.boxShadow !== "none" && !/^(?:\S+ )?0px 0px 0px 0px/.test(st.boxShadow)); };
			const ring = has(el) || (el.closest("label") && has(el.closest("label"))) || (el.parentElement && has(el.parentElement)); return ring ? null : `${el.tagName.toLowerCase()} “${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)}”`; });
		if (f) missing.push(f);
	}
	for (const m of missing) add("focus", m);
	if (process.env.ALL) console.error(`  ${n + 1}/${PAGES.length} ${path} ${Date.now() - t0}ms`);
};
// A page that hangs is reported and skipped with a fresh tab, so one bad page can't stall the run.
for (const [n, path] of PAGES.entries()) {
	const timedOut = await Promise.race([auditPage(n, path).then(() => false), new Promise((r) => setTimeout(() => r(true), 20000))]);
	if (timedOut) { add("timeout", path); console.error(`  ${n + 1}/${PAGES.length} ${path} timed out`); await page.close().catch(() => {}); page = await browser.newPage({ viewport: { width: 1440, height: 900 } }); await prep(page); }
}
await browser.close();
const show = (k, title) => { const m = totals[k]; console.log(`\n${title}: ${m ? [...m.values()].reduce((a, b) => a + b, 0) : 0}`); if (m) for (const [v, n] of [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12)) console.log(`  ${String(n).padStart(4)}× ${v}`); };
show("sizes", "Font sizes in use");
show("offScale", "Text off the type scale");
show("offGrid", "Spacing off the 4px grid (2px half-steps allowed)");
show("radius", "Radius not from tokens");
show("contrast", "Text below WCAG contrast");
show("small", "Targets under 24px (WCAG 2.5.8)");
show("focus", "Focus with no visible indicator");
show("timeout", "Pages that hung (audit skipped them)");
