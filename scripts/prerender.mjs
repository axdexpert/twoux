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
// Example apps: the gallery and each full-screen app, read from EXAMPLE_APPS so new ones are picked up.
const exampleApps = [...readFileSync(join(root, "apps/docs/src/content.ts"), "utf8").matchAll(/\bto: "(\/example[^"#]*)"/g)].map((m) => m[1]);
// "/" is not prerendered: .htaccess sends it to /docs/, and dist/index.html stays the bare shell for unknown addresses.
// Addresses end in a slash: each page is a folder, and the host redirects /docs to /docs/, so canonical URLs match.
const routes = [...new Set(["/docs", "/get-started", "/components", "/foundation", "/patterns", "/for-agents", "/how-its-built", "/licence", "/examples", ...exampleApps, ...docs.filter((d) => d.id !== "chart-colours").map(path)])];

const shell = readFileSync(join(dist, "index.html"));
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".txt": "text/plain", ".md": "text/markdown", ".json": "application/json", ".woff2": "font/woff2" };
const server = createServer((req, res) => {
	const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
	const file = join(dist, url);
	if (url !== "/" && existsSync(file) && extname(file)) { res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" }); res.end(readFileSync(file)); return; }
	res.writeHead(200, { "content-type": "text/html" }); res.end(shell);
}).listen(0);
const base = `http://localhost:${server.address().port}`;

const jsonLd = JSON.stringify({
	"@context": "https://schema.org",
	"@graph": [
		{ "@type": "WebSite", "@id": `${site}/#website`, name: "TwoUX", url: `${site}/docs/`, inLanguage: "en-GB" },
		{
			"@type": "SoftwareSourceCode",
			"@id": `${site}/#software`,
			name: "TwoUX",
			description: "TwoUX is an engineering-first design system for complex apps. It makes UI and UX decisions explicit for engineers and AI agents, and enforces quality before inconsistent experiences reach production.",
			url: `${site}/docs/`,
			codeRepository: "https://github.com/axdexpert/twoux",
			sameAs: ["https://github.com/axdexpert/twoux", "https://www.npmjs.com/package/@twoux/ui"],
			programmingLanguage: ["TypeScript", "CSS"],
			runtimePlatform: "React 19, Tailwind CSS v4",
			keywords: "design system, React components, shadcn/ui, Radix, Tailwind CSS, B2B SaaS, AI coding agents, AGENTS.md, MCP, WCAG 2.2, accessibility, data tables, dashboards",
			license: `${site}/licence/`,
			image: `${site}/brand/banner.png`,
			author: { "@type": "Person", name: "Giulia Pizzignacco" },
		},
	],
});

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
let done = 0;
for (const route of routes) {
	await page.goto(base + route, { waitUntil: "networkidle" });
	await page.waitForTimeout(300);
	const html = await page.evaluate(({ canonical, site, jsonLd }) => {
		document.querySelectorAll('link[rel="canonical"]').forEach((l) => l.remove());
		const link = Object.assign(document.createElement("link"), { rel: "canonical", href: canonical });
		document.head.append(link);
		// A real page is indexable; only the bare shell (unknown addresses) carries noindex.
		document.querySelectorAll("[data-shell]").forEach((n) => n.remove());
		// Link previews (Slack, LinkedIn, X) and search: absolute URL, image, and the page's own title and description.
		const set = (attr, key, value) => {
			let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
			if (!tag) { tag = document.createElement("meta"); tag.setAttribute(attr, key); document.head.append(tag); }
			tag.setAttribute("content", value);
		};
		const title = document.title;
		const description = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
		set("property", "og:url", canonical);
		set("property", "og:title", title);
		set("property", "og:description", description);
		set("property", "og:image", `${site}/brand/banner.png`);
		set("property", "og:image:width", "2400");
		set("property", "og:image:height", "1260");
		set("property", "og:image:alt", "The TwoUX wordmark surrounded by TwoUX components.");
		set("property", "og:locale", "en_GB");
		set("name", "twitter:title", title);
		set("name", "twitter:description", description);
		set("name", "twitter:image", `${site}/brand/banner.png`);
		// Structured data: what TwoUX is, where its code lives, its licence.
		document.querySelectorAll('script[type="application/ld+json"]').forEach((n) => n.remove());
		const ld = Object.assign(document.createElement("script"), { type: "application/ld+json", textContent: jsonLd });
		document.head.append(ld);
		// Toasts, open popovers and other live state aren't page content.
		document.querySelectorAll("[data-sonner-toaster], [data-radix-popper-content-wrapper]").forEach((n) => n.remove());
		return "<!doctype html>\n" + document.documentElement.outerHTML;
	}, { canonical: `${site}${route}/`, site, jsonLd });
	const out = route === "/" ? join(dist, "index.html") : join(dist, route, "index.html");
	mkdirSync(join(out, ".."), { recursive: true });
	writeFileSync(out, html);
	done++;
}
await browser.close();
server.close();

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((r) => `  <url><loc>${site}${r}/</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);
const robots = join(dist, "robots.txt");
if (existsSync(robots) && !readFileSync(robots, "utf8").includes("Sitemap:")) writeFileSync(robots, readFileSync(robots, "utf8") + `\nSitemap: ${site}/sitemap.xml\n`);
console.log(`✓ Prerendered ${done} pages and wrote sitemap.xml for ${site}`);
