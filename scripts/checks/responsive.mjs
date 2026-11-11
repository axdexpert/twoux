// Responsive sweep: no sideways scrolling, nav reachable, at phone and tablet widths.
import { chromium } from "playwright-core";
const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const out = process.argv[2];
const PAGES = ["/", "/docs", "/components", "/components/button", "/components/button?tab=usage", "/components/dropdown-menu?tab=api", "/foundation/colours", "/foundation/typography", "/patterns/propose-apply", "/for-agents", "/how-its-built"];
const browser = await chromium.launch({ channel: "chrome" });
const results = [];
for (const [label, width] of [["phone", 390], ["tablet", 768]]) {
	const page = await browser.newPage({ viewport: { width, height: 844 }, deviceScaleFactor: 1 });
	for (const path of PAGES) {
		await page.goto(BASE + path); await page.waitForTimeout(500);
		const r = await page.evaluate(() => {
			const main = document.querySelector("main");
			const wide = [...document.querySelectorAll("main *")].filter((el) => { const b = el.getBoundingClientRect(); return b.right > window.innerWidth + 1 && !el.closest(".overflow-x-auto, .code-panel, pre, table, [role=tablist]"); }).slice(0, 3).map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(" ").slice(0, 3).join(".")} (${Math.round(el.getBoundingClientRect().right)}px)`);
			return { pageScroll: document.documentElement.scrollWidth > window.innerWidth + 1, mainScroll: main.scrollWidth > main.clientWidth + 1, wide };
		});
		const ok = !r.pageScroll && !r.mainScroll && !r.wide.length;
		results.push(`${ok ? "PASS" : "FAIL"}  ${label} ${path}${ok ? "" : `  ${JSON.stringify(r)}`}`);
	}
	if (out) { await page.goto(BASE + "/components/button"); await page.waitForTimeout(500); await page.screenshot({ path: `${out}/${label}.png` }); }
	if (label === "phone") {
		await page.goto(BASE + "/components/button"); await page.waitForTimeout(400);
		await page.getByRole("button", { name: "Open navigation" }).click(); await page.waitForTimeout(400);
		const nav = await page.getByRole("dialog", { name: "TwoUX" }).isVisible();
		results.push(`${nav ? "PASS" : "FAIL"}  phone: menu button opens navigation`);
		if (out) await page.screenshot({ path: `${out}/phone-nav.png` });
		await page.getByRole("dialog").getByRole("link", { name: "Checkbox" }).first().click(); await page.waitForTimeout(500);
		const closed = !(await page.getByRole("dialog", { name: "TwoUX" }).isVisible().catch(() => false)) && page.url().includes("/components/checkbox");
		results.push(`${closed ? "PASS" : "FAIL"}  phone: picking a page navigates and closes the menu`);
	}
	await page.close();
}
await browser.close();
console.log(results.join("\n"));
process.exit(results.some((r) => r.startsWith("FAIL")) ? 1 : 0);
