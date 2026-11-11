// Screenshots of every page type for design review. node scripts/checks/shots.mjs <outdir>
import { chromium } from "playwright-core";
const out = process.argv[2] ?? "/tmp/twoux-shots";
const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const pages = [
	["home", "/", 0], ["gallery", "/components", 0], ["button-ex", "/components/button", 700],
	["button-usage", "/components/button?tab=usage", 0], ["checkbox-a11y", "/components/checkbox?tab=accessibility", 0],
	["pattern", "/patterns/propose-apply", 0], ["pattern-2", "/patterns/propose-apply", 900], ["typography", "/foundation/typography", 300],
	["agents", "/for-agents", 380], ["agents-jobs", "/for-agents#jobs", 0], ["typo-head", "/foundation/typography", 0], ["built", "/how-its-built", 380], ["codeblock", "/components/code-block", 560],
];
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
for (const [name, path, y] of pages) {
	await page.goto(BASE + path);
	await page.waitForTimeout(600);
	await page.evaluate((y) => document.querySelector("main").scrollTo({ top: y, behavior: "instant" }), y);
	await page.waitForTimeout(300);
	await page.screenshot({ path: `${out}/${name}.png` });
}
await page.goto(BASE + "/components");
await page.keyboard.press("Meta+k");
await page.waitForTimeout(400);
await page.screenshot({ path: `${out}/search-empty.png` });
await page.keyboard.type("status");
await page.waitForTimeout(300);
await page.screenshot({ path: `${out}/search-results.png` });
await browser.close();
console.log("ok");
