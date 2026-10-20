// Engine Gemini: Playwright điều khiển gemini.google.com bằng Chrome chạy ẩn (mặc định headless), hồ sơ riêng runner/.profile.
// Đăng nhập (runner không đụng tới mật khẩu):
//  - file cookie JSON runner/gemini_cookies.json (xem gemini_cookies.ts) – tự làm mới để dùng lâu dài;
//  - hoặc tự đăng nhập trong cửa sổ trình duyệt: npm -w runner run gemini-login.
// Mỗi tab làm một job: chat mới (tạm thời) → tải bản vẽ + file ngữ cảnh → gõ câu lệnh ngắn → chờ → lấy khối JSON.
// Lưu ý: tự động hoá giao diện web có thể trái điều khoản của Google và dễ hỏng khi giao diện đổi (xem gemini_selectors.ts).
// Không có thủ thuật né phát hiện bot; gặp xác minh/captcha thì dừng. Chạy nhiều luồng nên dùng engine Gemini API (gemini_api.ts).
import path from "node:path";
import { writeFileSync } from "node:fs";
import type { BrowserContext, Page, Locator } from "playwright";
import { GOC_REPO, log } from "../chung";
import { GEMINI_URL, SEL } from "./gemini_selectors";
import { FILE_COOKIE, giuCookieDinhKy, luuCookie, napCookie } from "./gemini_cookies";
import { bam, choLuotGui, cuonDoc, go, nghi } from "./nguoi_that";

const PROFILE = path.join(GOC_REPO, "runner", ".profile");
/** headless (ẩn hẳn, mặc định) · offscreen (cửa sổ thật đặt ngoài màn hình) · hien (thấy được, để đăng nhập/gỡ lỗi) */
const CHE_DO = (process.env.PCCC_GEMINI_AN ?? "headless") as "headless" | "offscreen" | "hien";
let ctx: Promise<BrowserContext> | null = null;

export class BiChan extends Error {}

export async function coPlaywright(): Promise<boolean> {
  try { await import("playwright"); return true; } catch { return false; }
}

export function moTrinhDuyet(cheDo = CHE_DO): Promise<BrowserContext> {
  if (ctx) return ctx;
  ctx = (async () => {
    const { chromium } = await import("playwright");
    const args = ["--disable-background-timer-throttling", "--disable-renderer-backgrounding", "--disable-backgrounding-occluded-windows"];
    if (cheDo === "offscreen") args.push("--window-position=-32000,-32000");
    const opt = { headless: cheDo === "headless", viewport: { width: 1366, height: 820 }, locale: "vi-VN", timezoneId: "Asia/Ho_Chi_Minh", args };
    let c: BrowserContext;
    try { c = await chromium.launchPersistentContext(PROFILE, { ...opt, channel: "chrome" }); } // Chrome thật: Google ít chặn hơn
    catch { c = await chromium.launchPersistentContext(PROFILE, opt); }
    await napCookie(c);
    const dung = giuCookieDinhKy(c);
    c.on("close", () => { dung(); ctx = null; });
    return c;
  })();
  ctx.catch(() => (ctx = null));
  return ctx;
}

export async function dongTrinhDuyet() {
  const c = await ctx?.catch(() => null);
  if (c) { await luuCookie(c).catch(() => {}); await c.close().catch(() => {}); }
  ctx = null;
}

async function tim(page: Page, ds: readonly string[], timeout = 5000): Promise<Locator | null> {
  const het = Date.now() + timeout;
  do {
    for (const s of ds) {
      const l = page.locator(s).last();
      if (await l.isVisible().catch(() => false)) return l;
    }
    if (timeout > 0) await page.waitForTimeout(300);
  } while (Date.now() < het);
  return null;
}

async function kiemChan(page: Page) {
  if (await tim(page, SEL.biChan, 0)) throw new BiChan("Gemini yêu cầu xác minh hoặc báo hết lượt: dừng tất cả tab, thử lại sau.");
}

/** Mở chat mới; chờ ô nhập (tức là đã đăng nhập). */
async function chatMoi(page: Page, choDangNhap = 15000): Promise<Locator> {
  await page.goto(GEMINI_URL, { waitUntil: "domcontentloaded" });
  await kiemChan(page);
  const o = await tim(page, SEL.oNhap, choDangNhap);
  if (await tim(page, SEL.chuaDangNhap, 1500)) throw new BiChan("Cookie Gemini đã hết hạn (đang ở chế độ khách): xuất lại file cookie rồi nạp vào web. Các job Gemini sẽ chạy bằng Claude.");
  if (!o) throw new Error(`Gemini chưa đăng nhập: nạp lại file cookie (${path.basename(FILE_COOKIE)}) hoặc chạy npm -w runner run gemini-login.`);
  if (process.env.PCCC_GEMINI_TAM_THOI !== "0") { // chat tạm thời: không làm đầy lịch sử của người dùng
    const t = await tim(page, SEL.nutTamThoi, 1500);
    if (t) { await bam(page, t); await nghi(800, 1800); }
  }
  return (await tim(page, SEL.oNhap, 5000)) ?? o;
}

async function taiTep(page: Page, files: string[]) {
  const nut = await tim(page, SEL.nutTaiLen);
  if (!nut) throw new Error("Không thấy nút tải tệp của Gemini (sửa gemini_selectors.ts).");
  await bam(page, nut);
  await nghi(500, 1200);
  const muc = await tim(page, SEL.mucTaiTep, 4000);
  if (!muc) throw new Error("Không thấy mục 'Tải tệp lên' (sửa gemini_selectors.ts).");
  const chooser = page.waitForEvent("filechooser", { timeout: 15000 });
  chooser.catch(() => {}); // nếu bước bấm lỗi trước khi await thì không để lời hứa này làm sập tiến trình
  await bam(page, muc);
  await (await chooser).setFiles(files);
  await nghi(2000, 3500);
  for (let i = 0; i < 300 && (await tim(page, SEL.tepDangTai, 0)); i++) await page.waitForTimeout(500);
}

/** Chờ trả lời xong: không còn nút Dừng và nội dung đứng yên 3 lần liên tiếp. Lấy khối mã (JSON) nếu có. */
async function choTraLoi(page: Page, timeoutMs: number): Promise<string> {
  const het = Date.now() + timeoutMs;
  await nghi(4000, 6000);
  let truoc = "", on = 0;
  while (Date.now() < het) {
    await kiemChan(page);
    const dangChay = await tim(page, SEL.nutDung, 0);
    const r = page.locator(SEL.traLoi[0]).last();
    const t = (await r.count()) ? await r.innerText().catch(() => "") : "";
    if (!dangChay && t && t === truoc) {
      if (++on >= 3) {
        for (const s of SEL.khoiMa) {
          const codes = await r.locator(s).allInnerTexts().catch(() => [] as string[]);
          const j = codes.find((c) => c.includes("{"));
          if (j) return j;
        }
        return t;
      }
    } else on = 0;
    truoc = t;
    if (Math.random() < 0.2) await cuonDoc(page);
    await page.waitForTimeout(2000);
  }
  throw new Error("Gemini quá thời gian trả lời");
}

/** Chạy một job trên một tab có sẵn. */
export async function chayTrenTab(page: Page, prompt: string, pdf: string, thuMucJob: string, jobId: string, timeoutMs = 20 * 60_000): Promise<string> {
  const ngucanh = path.join(thuMucJob, `${jobId}.md`);
  writeFileSync(ngucanh, prompt, "utf8");
  let o = await chatMoi(page);
  await nghi(1000, 2500);
  await taiTep(page, [pdf, ngucanh]);
  o = (await tim(page, SEL.oNhap)) ?? o;
  await bam(page, o);
  await go(page, `Đọc tệp ${jobId}.md (nhiệm vụ, nguyên tắc, tri thức, các dòng cần xét) và bản vẽ PDF đính kèm. Làm đúng nhiệm vụ trong tệp, chỉ trả về một khối json theo định dạng ghi trong tệp.`);
  await nghi(600, 1500);
  await choLuotGui();
  const gui = await tim(page, SEL.nutGui, 3000);
  if (gui) await bam(page, gui); else await page.keyboard.press("Enter");
  const t = await choTraLoi(page, timeoutMs);
  await luuCookie(page.context()).catch(() => {}); // ghi cookie đã làm mới sau mỗi job
  return t;
}

export async function moTab(): Promise<Page> {
  return (await moTrinhDuyet()).newPage();
}

/** Một job lẻ (endpoint /job): dùng một tab riêng rồi đóng. */
export async function chayGemini(prompt: string, pdf: string, thuMucJob: string, jobId: string): Promise<string> {
  const p = await moTab();
  try { return await chayTrenTab(p, prompt, pdf, thuMucJob, jobId); } finally { await p.close().catch(() => {}); }
}

/** Kiểm tra đăng nhập, làm mới file cookie, đóng trình duyệt. */
export async function giuPhien(): Promise<boolean> {
  try {
    const p = await moTab();
    await p.goto(GEMINI_URL, { waitUntil: "domcontentloaded" });
    const ok = !!(await tim(p, SEL.oNhap, 15000));
    if (ok) await luuCookie(p.context());
    return ok;
  } finally { await dongTrinhDuyet(); }
}

// npm -w runner run gemini-login: mở cửa sổ THẤY ĐƯỢC để người dùng đăng nhập một lần (cookie được ghi ra file).
if (process.argv.includes("--dang-nhap")) {
  (async () => {
    const c = await moTrinhDuyet("hien");
    const p = c.pages()[0] ?? (await c.newPage());
    await p.goto(GEMINI_URL);
    log("Đăng nhập Google trong cửa sổ vừa mở (tối đa 10 phút)…");
    if (!(await tim(p, SEL.oNhap, 10 * 60_000))) throw new Error("Chưa thấy Gemini sau 10 phút");
    await luuCookie(c);
    log("Đã đăng nhập, đã ghi file cookie.");
    await c.close();
  })().catch((e) => { console.error(e); process.exit(1); });
}
// npm -w runner run gemini-giu-phien: kiểm tra đăng nhập + làm mới file cookie (đặt Task Scheduler chạy 1–2 lần/ngày).
if (process.argv.includes("--giu-phien")) {
  giuPhien().then((ok) => { log(ok ? "Phiên Gemini còn hiệu lực, đã làm mới cookie." : "Phiên Gemini đã hết: xuất lại file cookie."); process.exit(ok ? 0 : 2); })
    .catch((e) => { console.error(e); process.exit(1); });
}
