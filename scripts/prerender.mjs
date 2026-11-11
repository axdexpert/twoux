// Prerenders the built docs site to plain HTML, so search engines and AI assistants read every page
// without running JavaScript, and writes sitemap.xml. Run after `vite build`:
//   SITE_URL=https://twoux.com node scripts/prerender.mjs
// The app still boots as a single-page app in the browser; the HTML is what crawlers see first.
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { chromium } from "playwright-core";

const root = new URL("..", import.meta.url).pathname;
const dist = join(root, "apps/docs/dist");
const site = (process.env.SITE_URL ?? "https://twoux.com").replace(/\/$/, "");
if (!existsSync(join(dist, "index.html"))) { console.error("✗ Build the site first (apps/docs/dist is missing)."); process.exit(1); }

const contentDir = join(root, "apps/docs/src/content");
const docs = readdirSync(contentDir).filter((f) => f.endsWith(".json")).flatMap((f) => JSON.parse(readFileSync(join(contentDir, f), "utf8")).components ?? []);
const path = (d) => `/${d.kind === "foundation" ? "foundation" : d.kind === "pattern" ? "patterns" : "components"}/${d.id}`;
const routes = ["/", "/docs", "/components", "/foundation", "/patterns", "/for-agents", "/how-its-built", "/licence", ...docs.filter((d) => d.id !== "chart-colours").map(path)];

const shell = readFileSync(join(dist, "index.html"));
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".txt": "text/plain", ".md": "text/markdown", ".json": "application/json", ".woff2": "font/woff2" };
const server = createServer((req, res) => {
	const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
	const file = join(dist, url);
	if (url !== "/" && existsSync(file) && extname(file)) { res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" }); res.end(readFileSync(file)); return; }
	res.writeHead(200, { "content-type": "text/html" }); res.end(shell);
}).listen(0);
const base = `http://localhost:${server.address().port}`;

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
let done = 0;
for (const route of routes) {
	await page.goto(base + route, { waitUntil: "networkidle" });
	await page.waitForTimeout(300);
	const html = await page.evaluate((canonical) => {
		document.querySelectorAll('link[rel="canonical"]').forEach((l) => l.remove());
		const link = Object.assign(document.createElement("link"), { rel: "canonical", href: canonical });
		document.head.append(link);
		// Toasts, open popovers and other live state aren't page content.
		document.querySelectorAll("[data-sonner-toaster], [data-radix-popper-content-wrapper]").forEach((n) => n.remove());
		return "<!doctype html>\n" + document.documentElement.outerHTML;
	}, site + (route === "/" ? "/" : route));
	const out = route === "/" ? join(dist, "index.html") : join(dist, route, "index.html");
	mkdirSync(join(out, ".."), { recursive: true });
	writeFileSync(out, html);
	done++;
}
await browser.close();
server.close();

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((r) => `  <url><loc>${site}${r === "/" ? "/" : r}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);
const robots = join(dist, "robots.txt");
if (existsSync(robots) && !readFileSync(robots, "utf8").includes("Sitemap:")) writeFileSync(robots, readFileSync(robots, "utf8") + `\nSitemap: ${site}/sitemap.xml\n`);
console.log(`✓ Prerendered ${done} pages and wrote sitemap.xml for ${site}`);
