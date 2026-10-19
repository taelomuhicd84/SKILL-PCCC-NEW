// Đăng nhập Gemini bằng file cookie JSON (cookie Google của chính người dùng) và giữ nó dùng lâu dài.
//
// Vì sao file cookie "chết": Google xoay vòng cookie phiên (__Secure-1PSIDTS, SIDCC… đổi sau vài chục phút đến vài ngày)
// và huỷ cả phiên khi đăng xuất ở trình duyệt gốc. Cách giữ lâu dài ở đây:
//  1. Nạp file vào trình duyệt Playwright (hồ sơ riêng runner/.profile).
//  2. Mỗi lần dùng xong và định kỳ khi runner mở: lấy cookie ĐÃ ĐƯỢC GOOGLE LÀM MỚI ghi đè lại vào file (xoay vòng theo).
//  3. Lệnh `gemini-giu-phien` mở Gemini một lúc rồi ghi lại cookie: đặt Task Scheduler chạy 1–2 lần/ngày khi không dùng.
// File cookie là thông tin đăng nhập: giữ trên máy mình, không commit (đã có trong .gitignore), không gửi cho ai.
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { BrowserContext } from "playwright";
import { GOC_REPO, log } from "../chung";

export const FILE_COOKIE = process.env.PCCC_GEMINI_COOKIES ?? path.join(GOC_REPO, "runner", "gemini_cookies.json");

type PwCookie = { name: string; value: string; domain: string; path: string; expires: number; httpOnly: boolean; secure: boolean; sameSite: "Strict" | "Lax" | "None" };
const laGoogle = (d: string) => /(^|\.)google\.com$|(^|\.)gemini\.google\.com$|(^|\.)youtube\.com$/.test(d.replace(/^\./, ""));

function sameSite(v: unknown, secure: boolean): PwCookie["sameSite"] {
  const s = String(v ?? "").toLowerCase();
  if (s === "strict") return "Strict";
  if (s === "none" || s === "no_restriction") return secure ? "None" : "Lax";
  return "Lax"; // lax, unspecified, rỗng
}

/** Đọc mọi định dạng hay gặp: Cookie-Editor / EditThisCookie (mảng), Playwright storageState ({cookies:[…]}), {cookies:[…]} bất kỳ. */
export function chuanHoa(raw: unknown): PwCookie[] {
  const arr = (Array.isArray(raw) ? raw : (raw as { cookies?: unknown[] })?.cookies) ?? [];
  const out: PwCookie[] = [];
  for (const c of arr as Record<string, unknown>[]) {
    if (!c?.name || c.value == null || !c.domain) continue;
    const secure = !!c.secure;
    const het = (c.expirationDate ?? c.expires ?? c.expiry) as number | undefined;
    out.push({
      name: String(c.name), value: String(c.value), domain: String(c.domain), path: String(c.path ?? "/"),
      expires: c.session === true || het == null || het < 0 ? -1 : Math.floor(Number(het)),
      httpOnly: !!c.httpOnly, secure, sameSite: sameSite(c.sameSite, secure),
    });
  }
  return out.filter((c) => laGoogle(c.domain));
}

export function coFileCookie() { return existsSync(FILE_COOKIE); }

export async function napCookie(ctx: BrowserContext): Promise<number> {
  if (!coFileCookie()) return 0;
  const ds = chuanHoa(JSON.parse(readFileSync(FILE_COOKIE, "utf8")));
  const conHan = ds.filter((c) => c.expires === -1 || c.expires * 1000 > Date.now());
  if (!ds.some((c) => /PSID$|^SID$/.test(c.name))) log("Cảnh báo: file cookie thiếu SID/__Secure-1PSID – có thể chưa đăng nhập khi xuất.");
  await ctx.addCookies(conHan);
  log(`Đã nạp ${conHan.length}/${ds.length} cookie Google từ ${path.basename(FILE_COOKIE)}`);
  return conHan.length;
}

/** Ghi cookie hiện tại (đã được Google làm mới) đè lên file. Ghi qua file tạm để không hỏng file khi bị ngắt. */
export async function luuCookie(ctx: BrowserContext): Promise<void> {
  const ds = (await ctx.cookies()).filter((c) => laGoogle(c.domain));
  if (!ds.some((c) => /PSID$|^SID$/.test(c.name))) { log("Không ghi cookie: phiên hiện tại không có SID (đã bị đăng xuất?)"); return; }
  const tam = FILE_COOKIE + ".tam";
  writeFileSync(tam, JSON.stringify({ cookies: ds, cap_nhat: new Date().toISOString() }, null, 1), "utf8");
  renameSync(tam, FILE_COOKIE);
  log(`Đã làm mới file cookie (${ds.length} cookie)`);
}

/** Khi trình duyệt còn mở: ghi lại cookie mỗi 30 phút. */
export function giuCookieDinhKy(ctx: BrowserContext): () => void {
  const t = setInterval(() => { luuCookie(ctx).catch(() => {}); }, 30 * 60_000);
  return () => clearInterval(t);
}
