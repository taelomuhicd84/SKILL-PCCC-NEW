// Engine Gemini: Playwright điều khiển gemini.google.com trong một hồ sơ trình duyệt riêng (runner/.profile).
// Người dùng tự đăng nhập Google lần đầu (chạy: npm -w runner run gemini-login). Runner không đụng tới mật khẩu.
// Lưu ý: tự động hoá giao diện web có thể trái điều khoản của Google và dễ hỏng khi giao diện đổi (xem gemini_selectors.ts).
import path from "node:path";
import { writeFileSync } from "node:fs";
import type { BrowserContext, Page, Locator } from "playwright";
import { GOC_REPO, log } from "../chung";
import { GEMINI_URL, SEL } from "./gemini_selectors";

const PROFILE = path.join(GOC_REPO, "runner", ".profile");
let ctx: BrowserContext | null = null;

export async function coPlaywright(): Promise<boolean> {
  try { await import("playwright"); return true; } catch { return false; }
}

async function moTrinhDuyet(): Promise<BrowserContext> {
  if (ctx) return ctx;
  const { chromium } = await import("playwright");
  const opt = { headless: false, viewport: null, args: ["--disable-blink-features=AutomationControlled"] };
  try { ctx = await chromium.launchPersistentContext(PROFILE, { ...opt, channel: "chrome" }); } // Chrome thật: Google ít chặn đăng nhập hơn
  catch { ctx = await chromium.launchPersistentContext(PROFILE, opt); }
  ctx.on("close", () => (ctx = null));
  return ctx;
}

async function tim(page: Page, ds: readonly string[], timeout = 5000): Promise<Locator | null> {
  const het = Date.now() + timeout;
  while (Date.now() < het) {
    for (const s of ds) {
      const l = page.locator(s).last();
      if (await l.isVisible().catch(() => false)) return l;
    }
    await page.waitForTimeout(300);
  }
  return null;
}

/** Mở Gemini, chờ người dùng đăng nhập nếu cần (tối đa 10 phút). */
async function moGemini(): Promise<Page> {
  const c = await moTrinhDuyet();
  const page = c.pages()[0] ?? (await c.newPage());
  await page.goto(GEMINI_URL, { waitUntil: "domcontentloaded" });
  if (!(await tim(page, SEL.oNhap, 15000))) {
    log("Gemini: chưa đăng nhập. Hãy đăng nhập Google trong cửa sổ trình duyệt vừa mở…");
    if (!(await tim(page, SEL.oNhap, 10 * 60_000))) throw new Error("Không thấy ô nhập của Gemini (chưa đăng nhập hoặc giao diện đã đổi – sửa runner/src/engines/gemini_selectors.ts).");
  }
  return page;
}

async function taiTep(page: Page, files: string[]) {
  const nut = await tim(page, SEL.nutTaiLen);
  if (!nut) throw new Error("Không thấy nút tải tệp của Gemini (sửa gemini_selectors.ts).");
  const chooser = page.waitForEvent("filechooser", { timeout: 15000 });
  await nut.click();
  const muc = await tim(page, SEL.mucTaiTep, 3000);
  if (muc) await muc.click();
  (await chooser).setFiles(files);
  await page.waitForTimeout(1500);
  for (let i = 0; i < 240 && (await tim(page, SEL.dangTaiTep, 200)); i++) await page.waitForTimeout(500);
}

async function choTraLoi(page: Page, timeoutMs: number): Promise<string> {
  const het = Date.now() + timeoutMs;
  await page.waitForTimeout(3000);
  let truoc = "", on = 0;
  while (Date.now() < het) {
    const dangChay = await tim(page, SEL.nutDung, 200);
    const l = await tim(page, SEL.traLoi, 500);
    const t = l ? await l.innerText().catch(() => "") : "";
    if (!dangChay && t && t === truoc) { if (++on >= 3) return t; } else on = 0;
    truoc = t;
    await page.waitForTimeout(2000);
  }
  throw new Error("Gemini quá thời gian trả lời");
}

/** Gửi một job: đính kèm bản vẽ + file ngữ cảnh (prompt đầy đủ), dán câu lệnh ngắn, chờ trả lời. */
export async function chayGemini(prompt: string, pdf: string, thuMucJob: string, jobId: string, timeoutMs = 20 * 60_000): Promise<string> {
  const page = await moGemini();
  const ngucanh = path.join(thuMucJob, `${jobId}.md`);
  writeFileSync(ngucanh, prompt, "utf8");
  await taiTep(page, [pdf, ngucanh]);
  const o = (await tim(page, SEL.oNhap))!;
  await o.click();
  await o.fill(`Đọc file ${jobId}.md (nhiệm vụ, nguyên tắc, tri thức, các dòng cần xét) và bản vẽ PDF đính kèm. Làm đúng nhiệm vụ trong file và chỉ trả về một khối \`\`\`json theo định dạng ghi trong file.`);
  const gui = await tim(page, SEL.nutGui, 3000);
  if (gui) await gui.click(); else await o.press("Enter");
  return choTraLoi(page, timeoutMs);
}

// npm -w runner run gemini-login: mở trình duyệt để người dùng đăng nhập một lần.
if (process.argv.includes("--dang-nhap")) {
  moGemini().then(() => log("Đã thấy ô nhập Gemini: đăng nhập xong. Đóng cửa sổ trình duyệt để kết thúc.")).catch((e) => { console.error(e); process.exit(1); });
}
