// Renders the README banner (.github/assets/banner.png) from the playground's ?page=banner.
// Start the playground first (pnpm --filter playground dev), then: node scripts/banner.mjs [url]
import { chromium } from "playwright-core";

const url = process.argv[2] ?? "http://localhost:3200/?page=banner";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
await page.goto(url);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(600);
await page.screenshot({ path: new URL("../.github/assets/banner.png", import.meta.url).pathname });
await browser.close();
console.log("Wrote .github/assets/banner.png (2400×1260)");
