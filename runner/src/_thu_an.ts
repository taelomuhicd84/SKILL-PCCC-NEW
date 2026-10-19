// TẠM: thử Chrome chạy ẩn (headless) + cookie có vào được Gemini không.
import { chromium } from "playwright";
import { napCookie } from "./engines/gemini_cookies";
import { SEL, GEMINI_URL } from "./engines/gemini_selectors";
const mode = process.argv[2] ?? "headless";
const ctx = await chromium.launchPersistentContext("runner/.profile_thu", {
  channel: "chrome", headless: mode === "headless", viewport: { width: 1366, height: 820 }, locale: "vi-VN", timezoneId: "Asia/Ho_Chi_Minh",
  args: ["--disable-blink-features=AutomationControlled", ...(mode === "offscreen" ? ["--window-position=-32000,-32000"] : [])],
});
await napCookie(ctx);
const p = ctx.pages()[0] ?? await ctx.newPage();
await p.goto(GEMINI_URL, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(8000);
const r: Record<string, boolean> = {};
for (const [k, ds] of Object.entries(SEL)) { r[k] = false; for (const s of ds) if (await p.locator(s).first().isVisible().catch(() => false)) { r[k] = true; break; } }
console.log(mode, "url:", p.url().slice(0, 60), "| tiêu đề:", (await p.title()).slice(0, 40));
console.log(JSON.stringify(r));
const btns = await p.locator("button[aria-label]").evaluateAll((els) => els.map((e) => e.getAttribute("aria-label")).filter(Boolean).slice(0, 40));
console.log("nút:", btns.filter((b) => (b ?? "").length < 40).join(" | "));
await p.screenshot({ path: process.env.TMP + "/gemini_thu.png" });
await ctx.close();
