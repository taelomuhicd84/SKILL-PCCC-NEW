// Engine Claude Code: gọi `claude -p` (headless) bằng tài khoản Claude Code đã đăng nhập trên máy người dùng.
// Chỉ cho phép công cụ đọc (Read, Grep, Glob): agent đọc bản vẽ, chữ có vị trí và file tri thức, không sửa gì.
import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { GOC_REPO, log } from "../chung";

/** Token liên kết tài khoản Claude, dán từ web: kết quả `claude setup-token` (dùng lâu dài) hoặc API key. Không commit. */
export const FILE_TOKEN = path.join(GOC_REPO, "runner", "claude_token.json");
export const coToken = () => existsSync(FILE_TOKEN);
export function luuToken(token: string, nhan?: string) {
  const t = token.trim();
  if (!/^sk-ant-[\w-]{20,}$/.test(t)) throw new Error("Token không đúng dạng (sk-ant-…): dùng kết quả của `claude setup-token` hoặc API key.");
  writeFileSync(FILE_TOKEN, JSON.stringify({ token: t, luc: new Date().toISOString(), nhan: nhan?.trim() || undefined }), "utf8");
}
/** Đặt lại tên gợi nhớ cho token đã lưu (Anthropic không trả email cho token `setup-token`, nên tên do người dùng đặt). */
export function datNhanToken(nhan: string) {
  const j = JSON.parse(readFileSync(FILE_TOKEN, "utf8"));
  writeFileSync(FILE_TOKEN, JSON.stringify({ ...j, nhan: nhan.trim() || undefined }), "utf8");
}
/** Thông tin token Claude của runner, không lộ token: tên gợi nhớ, dấu vân tay ngắn, loại, giờ lưu. */
export function thongTinToken() {
  if (!coToken()) return { co: false as const };
  const j = JSON.parse(readFileSync(FILE_TOKEN, "utf8")) as { token: string; luc?: string; nhan?: string };
  return { co: true as const, nhan: j.nhan ?? null, luc: j.luc ?? null, loai: j.token.startsWith("sk-ant-api") ? "API key" : "token đăng nhập (setup-token)", dau: createHash("sha256").update(j.token).digest("hex").slice(0, 8) };
}
/** Đăng nhập CLI của máy (runner KHÔNG dùng): chỉ để người dùng thấy là tài khoản nào. */
export function taiKhoanCli(): { email?: string; cach?: string } {
  try {
    const l = lenh();
    const r = spawnSync(l.cmd, ["auth", "status"], { encoding: "utf8", shell: l.shell, timeout: 10_000, env: { ...process.env, CLAUDE_CODE_OAUTH_TOKEN: "" } });
    const j = JSON.parse(r.stdout);
    return { email: j.email, cach: j.authMethod };
  } catch { return {}; }
}
/** Hạn mức đang chờ reset (đặt khi runner phải chờ Claude), null nếu không. */
export let hanMucDen: string | null = null;
/** Gọi thử một câu ngắn để biết token còn dùng được hay hết hạn mức. */
export async function kiemTraClaude(): Promise<{ ok: boolean; ghi_chu: string }> {
  try { await chayClaude("Trả lời đúng một chữ: ok", GOC_REPO, 60_000, ["Read"], "haiku"); hanMucDen = null; return { ok: true, ghi_chu: "Gọi thử thành công: token còn dùng được." }; }
  catch (e) {
    const m = String(e instanceof Error ? e.message : e).replace(/^Error: /, "");
    if (HET_HAN_MUC.test(m)) hanMucDen = new Date(Date.now() + choDenReset(m)).toLocaleTimeString("vi-VN");
    return { ok: false, ghi_chu: m.slice(0, 300) };
  }
}
function envToken(): NodeJS.ProcessEnv {
  if (!coToken()) return process.env;
  const t = JSON.parse(readFileSync(FILE_TOKEN, "utf8")).token as string;
  return { ...process.env, ...(t.startsWith("sk-ant-api") ? { ANTHROPIC_API_KEY: t } : { CLAUDE_CODE_OAUTH_TOKEN: t }) };
}

/** Trên Windows: claude.exe gọi thẳng; claude.cmd (cài qua npm) phải qua shell, nên bọc tham số trong ngoặc kép. */
function lenh(): { cmd: string; shell: boolean } {
  if (process.platform !== "win32") return { cmd: "claude", shell: false };
  const w = (spawnSync("where", ["claude"], { encoding: "utf8" }).stdout ?? "").split(/\s*\n/).map((x) => x.trim()).filter(Boolean);
  const exe = w.find((x) => x.toLowerCase().endsWith(".exe"));
  return exe ? { cmd: exe, shell: false } : { cmd: w[0] ?? "claude", shell: true };
}
const quote = (a: string) => (/[\s"]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a);
export const coClaude = () => { const l = lenh(); return spawnSync(l.cmd, ["--version"], { encoding: "utf8", shell: l.shell }).status === 0; };

export function chayClaude(prompt: string, thuMucPhien: string, timeoutMs = 30 * 60_000, congCu = ["Read", "Grep", "Glob"], model?: string): Promise<string> {
  // Người dùng chốt (2026-10-21): runner chỉ dùng token Claude của Phương, KHÔNG dùng đăng nhập CLI (tài khoản trantrongtien198).
  if (!coToken() && !process.env.PCCC_CHO_PHEP_DANG_NHAP_CLI) return Promise.reject(new Error("Chưa liên kết Claude của Phương: dán token ở ô 'Liên kết Claude' (runner không dùng đăng nhập CLI của trantrongtien198)."));
  const args = ["-p", "--output-format", "json", "--allowedTools", ...congCu, "--add-dir", thuMucPhien];
  const m = process.env.PCCC_CLAUDE_MODEL || model; // biến môi trường ép một model cho mọi job
  if (m) args.push("--model", m);
  return new Promise((resolve, reject) => {
    const l = lenh();
    const p = spawn(l.shell ? quote(l.cmd) : l.cmd, l.shell ? args.map(quote) : args, { cwd: GOC_REPO, shell: l.shell, windowsHide: true, env: envToken() });
    let out = "", err = "";
    const t = setTimeout(() => { p.kill(); reject(new Error("Claude quá thời gian")); }, timeoutMs);
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (err += d));
    p.on("error", (e) => { clearTimeout(t); reject(e); });
    p.on("close", (code) => {
      clearTimeout(t);
      try {
        const j = JSON.parse(out);
        if (j.is_error) return reject(new Error("Claude báo lỗi: " + String(j.result ?? "").slice(0, 500)));
        resolve(String(j.result ?? ""));
      } catch {
        reject(new Error(`claude thoát mã ${code}: ${(err || out).slice(0, 800)}`));
      }
    });
    p.stdin.end(prompt, "utf8");
  });
}

/** Hết hạn mức gói Claude ("You've hit your session limit · resets 3:20pm"): chờ tới giờ reset rồi tự gọi lại. */
const HET_HAN_MUC = /session limit|usage limit|hit your|rate.?limit|quota|429|overloaded|limit reached/i;
export function choDenReset(loi: string, bayGio = new Date()): number {
  const m = loi.match(/resets?\s+(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!m) return 15 * 60_000;
  let h = Number(m[1]) % 12; if (/pm/i.test(m[3] ?? "")) h += 12; if (!m[3] && Number(m[1]) >= 12) h = Number(m[1]);
  const t = new Date(bayGio); t.setHours(h, Number(m[2] ?? 0), 0, 0);
  if (t.getTime() <= bayGio.getTime()) t.setDate(t.getDate() + 1);
  return t.getTime() - bayGio.getTime() + 2 * 60_000; // thêm 2 phút cho chắc đã reset
}
export async function chayClaudeCho(prompt: string, thuMuc: string, timeoutMs?: number, congCu?: string[], baoCho?: (luc: string) => void, model?: string): Promise<string> {
  for (let lan = 0; ; lan++) {
    try { const kq = await chayClaude(prompt, thuMuc, timeoutMs, congCu, model); hanMucDen = null; return kq; } catch (e) {
      if (!HET_HAN_MUC.test(String(e)) || lan >= 12) throw e;
      const cho = Math.min(choDenReset(String(e)), 8 * 3600_000);
      const luc = new Date(Date.now() + cho).toLocaleTimeString("vi-VN");
      log(`Hết hạn mức Claude: tự chạy tiếp lúc ${luc}`); baoCho?.(luc);
      hanMucDen = luc;
      await new Promise((r) => setTimeout(r, cho));
    }
  }
}
