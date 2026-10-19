// TẠM: dò menu tải tệp, gửi một câu hỏi nhỏ, đọc câu trả lời.
import { chromium } from "playwright";
import { napCookie } from "./engines/gemini_cookies";
import { GEMINI_URL } from "./engines/gemini_selectors";
const ctx = await chromium.launchPersistentContext("runner/.profile_thu", { channel: "chrome", headless: true, viewport: { width: 1366, height: 820 }, locale: "vi-VN", args: ["--disable-blink-features=AutomationControlled"] });
await napCookie(ctx);
const p = ctx.pages()[0] ?? await ctx.newPage();
await p.goto(GEMINI_URL, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(6000);
await p.locator("button[aria-label='Nội dung tải lên và công cụ']").click();
await p.waitForTimeout(1500);
const items = await p.locator("[role='menuitem'], [role='menu'] button, mat-action-list button, .menu button").evaluateAll((els) => els.map((e) => `${e.tagName}|${e.getAttribute("aria-label") ?? ""}|${(e.textContent ?? "").trim().slice(0, 30)}|${e.getAttribute("data-test-id") ?? ""}`));
console.log("menu:", items.join(" ;; "));
const fc = p.waitForEvent("filechooser", { timeout: 8000 }).catch(() => null);
const up = p.locator("[data-test-id='local-images-files-uploader-button'], [role='menuitem']:has-text('Tải tệp'), button:has-text('Tải tệp lên')").first();
console.log("có mục tải tệp:", await up.isVisible().catch(() => false));
await up.click().catch((e) => console.log("click lỗi", String(e).slice(0, 100)));
const ch = await fc;
console.log("filechooser:", !!ch);
if (ch) { await ch.setFiles(process.env.TMP + "/pccc_thu.md"); await p.waitForTimeout(4000); }
const o = p.locator("rich-textarea .ql-editor").first();
await o.click(); await p.keyboard.type("Đọc tệp đính kèm, trả lời đúng mã số trong tệp, chỉ một khối ```json {\"ma\":...}```", { delay: 40 });
await p.waitForTimeout(800);
const sendLabels = await p.locator("button[aria-label]").evaluateAll((els) => els.map((e) => e.getAttribute("aria-label")).filter((x) => x && x.length < 30));
console.log("nút sau khi gõ:", sendLabels.join(" | "));
await p.keyboard.press("Enter");
const t0 = Date.now();
let txt = "";
for (let i = 0; i < 60; i++) {
  await p.waitForTimeout(2000);
  const tags = await p.locator("model-response").count();
  const stop = await p.locator("button[aria-label*='Dừng' i], button[aria-label*='Stop' i]").count();
  txt = tags ? await p.locator("model-response").last().innerText().catch(() => "") : "";
  if (tags && !stop && txt.includes("}")) break;
}
console.log("sau", Math.round((Date.now() - t0) / 1000), "s; model-response:", await p.locator("model-response").count(), "message-content:", await p.locator("model-response message-content").count());
console.log("trả lời:", txt.slice(0, 200).replace(/\n/g, " ⏎ "));
await ctx.close();
