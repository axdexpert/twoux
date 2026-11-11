// Interaction checks against the running docs (pnpm dev). Uses your installed Chrome.
import { chromium } from "playwright-core";
const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && !m.text().startsWith("Failed to load resource") && errors.push(m.text()));
page.on("response", (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url().replace(BASE, "")}`));
const main = () => page.evaluate(() => document.querySelector("main").scrollTop);
const results = [];
const check = (name, ok, detail = "") => results.push(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);

// 1. Switching tabs after scrolling down keeps the tab bar in view instead of jumping to the top
await page.goto(`${BASE}/components/button`);
await page.waitForSelector('[aria-label="Page sections"] [id$="-trigger-usage"]');
await page.evaluate(() => document.querySelector("main").scrollTo({ top: 1400 }));
await page.waitForTimeout(400);
const before = await main();
await page.click('[aria-label="Page sections"] [id$="-trigger-usage"]');
await page.waitForTimeout(500);
const after = await main();
const barTop = await page.evaluate(() => document.querySelector('[aria-label="Page sections"]').getBoundingClientRect().top);
const headerEnd = await page.evaluate(() => { const h = document.querySelector("main header"); return h.offsetTop + h.offsetHeight; });
check("Tab switch keeps place: new tab starts under the bar", Math.abs(after - headerEnd) < 4 && barTop < 120, `scrollTop ${before} → ${after}, tab bar at ${Math.round(barTop)}px`);
check("Tab switch updates URL", page.url().includes("tab=usage"));

// 2. Switching tabs near the top does not move the page
await page.evaluate(() => document.querySelector("main").scrollTo({ top: 0 }));
await page.waitForTimeout(300);
await page.click('[aria-label="Page sections"] [id$="-trigger-accessibility"]');
await page.waitForTimeout(400);
check("Tab switch at top stays at top", (await main()) < 5);

// 3. Arrow keys move between tabs
await page.focus('[aria-label="Page sections"] [id$="-trigger-accessibility"]');
await page.keyboard.press("ArrowRight");
await page.waitForTimeout(300);
check("Arrow keys switch tab", page.url().includes("tab=api"));

// 4. Deep link opens the right tab and section
await page.goto(`${BASE}/components/button?tab=usage#guidelines`);
await page.waitForTimeout(900);
const gTop = await page.evaluate(() => document.getElementById("guidelines")?.getBoundingClientRect().top ?? 9999);
check("Deep link scrolls to section", gTop < 260 && gTop > 0, `heading at ${Math.round(gTop)}px`);

// 5. ⌘K search finds a job and navigates
await page.keyboard.press("Meta+k");
await page.getByRole("dialog", { name: "Search TwoUX" }).waitFor();
await page.waitForFunction(() => document.activeElement?.getAttribute("role") === "combobox");
await page.keyboard.type("confirm an action");
await page.waitForTimeout(200);
const groups = await page.evaluate(() => [...document.querySelectorAll("[cmdk-group-heading]")].map((e) => e.textContent));
check("Search: pages first, then which component for", groups[0] === "Pages" && groups.includes("Which component for"), groups.slice(0, 2).join(", "));
await page.keyboard.press("Enter");
await page.waitForTimeout(800);
check("Search: Enter opens the top page", /\/components\/[\w-]+$/.test(page.url()), page.url().replace(BASE, ""));
const revealed = await page.evaluate(() => { const a = document.querySelector('nav[aria-label="Documentation"] [aria-current="page"]'); const s = a?.closest("aside"); if (!a || !s) return false; const r = a.getBoundingClientRect(), q = s.getBoundingClientRect(); return r.top >= q.top && r.bottom <= q.bottom; });
check("Search: sidebar shows the page you landed on", revealed);

// 6. Sidebar: a page opens its section panel; groups collapse and closed content cannot be tabbed into; Back returns focus
await page.goto(`${BASE}/foundation/colours`);
await page.waitForTimeout(400);
const back = page.locator('nav[aria-label="Documentation"] [data-focus="back"]');
check("Sidebar opens the section of the current page", (await back.getAttribute("aria-label"))?.startsWith("Foundation") === true);
const btn = page.locator('button[aria-controls^="nav-foundation/"]').first();
const groupId = await btn.getAttribute("aria-controls");
await btn.click();
await page.waitForTimeout(400);
const inert = await page.evaluate((id) => document.getElementById(id)?.hasAttribute("inert"), groupId);
check("Closed nav group is inert", inert === true);
await btn.click();
await back.click();
await page.waitForTimeout(400);
const backFocus = await page.evaluate(() => document.activeElement?.getAttribute("data-focus"));
check("Back to all docs puts focus on the section it left", backFocus === "root-foundation", String(backFocus));

check("No console errors", errors.length === 0, errors.slice(0, 3).join(" | "));
console.log(results.join("\n"));
await browser.close();
process.exit(results.some((r) => r.startsWith("FAIL")) ? 1 : 0);
