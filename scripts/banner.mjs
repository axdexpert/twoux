// Renders the banner in light and dark from the playground's ?page=banner: the README banner
// (.github/assets/banner.png, banner-dark.png) and the docs Overview copies (apps/docs/public/brand/).
// Start the playground first (pnpm --filter playground dev), then: node scripts/banner.mjs [url]
import { copyFileSync } from "node:fs";
import { chromium } from "playwright-core";

const url = process.argv[2] ?? "http://localhost:3200/?page=banner";
const at = (p) => new URL(`../${p}`, import.meta.url).pathname;
const browser = await chromium.launch({ channel: "chrome" });
for (const theme of ["light", "dark"]) {
	const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2, colorScheme: theme });
	await page.addInitScript((t) => document.documentElement.setAttribute("data-theme", t), theme);
	await page.goto(url);
	await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
	await page.evaluate(() => document.fonts.ready);
	await page.waitForTimeout(600);
	const name = theme === "light" ? "banner.png" : "banner-dark.png";
	await page.screenshot({ path: at(`.github/assets/${name}`) });
	copyFileSync(at(`.github/assets/${name}`), at(`apps/docs/public/brand/${name}`));
	await page.close();
	console.log(`Wrote .github/assets/${name} and apps/docs/public/brand/${name} (2400×1260)`);
}
await browser.close();
