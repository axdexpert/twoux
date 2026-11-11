// Thumbnails for the Example apps gallery: each app at 1440×900, in light and dark, scaled to 960px wide.
//   node scripts/examples/thumbs.mjs [id ...]      (docs dev server running; BASE_URL to override)
// Writes apps/docs/public/thumbs/<id>-light.jpg and <id>-dark.jpg. The app list is read from apps/docs/src/content.ts.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const root = new URL("../..", import.meta.url).pathname;
const OUT = join(root, "apps/docs/public/thumbs");
const content = readFileSync(join(root, "apps/docs/src/content.ts"), "utf8");
const apps = [...content.matchAll(/\{ id: "([\w-]+)", to: "([^"]+)", label:/g)].map((m) => ({ id: m[1], to: m[2] }));
const only = process.argv.slice(2);
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
for (const theme of ["light", "dark"]) {
	const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
	await ctx.addInitScript((t) => { try { if (t === "dark") localStorage.setItem("twoux-theme", "dark"); else localStorage.removeItem("twoux-theme"); } catch {} }, theme);
	const page = await ctx.newPage();
	for (const app of apps) {
		if (only.length && !only.includes(app.id)) continue;
		await page.goto(BASE + app.to);
		await page.waitForLoadState("networkidle");
		await page.waitForTimeout(1500);
		const tmp = join(OUT, `.${app.id}-${theme}.png`);
		await page.screenshot({ path: tmp });
		execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", tmp, "-vf", "scale=960:-2:flags=lanczos", "-q:v", "4", join(OUT, `${app.id}-${theme}.jpg`)]);
		rmSync(tmp);
		console.log(`✓ ${app.id}-${theme}.jpg`);
	}
	await ctx.close();
}
await browser.close();
