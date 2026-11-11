import { chromium } from "playwright-core";
const b = await chromium.launch({ channel: "chrome" }); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3100/patterns/filtering-search"); await p.waitForTimeout(500);
await p.keyboard.press("Meta+k"); await p.waitForTimeout(350); await p.screenshot({ path: process.argv[2] + "/s-empty.png" });
await p.keyboard.type("confirm an action"); await p.waitForTimeout(300); await p.screenshot({ path: process.argv[2] + "/s-res.png" });
await b.close();
