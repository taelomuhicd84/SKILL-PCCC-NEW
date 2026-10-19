// Engine Claude Code: gọi `claude -p` (headless) bằng tài khoản Claude Code đã đăng nhập trên máy người dùng.
// Chỉ cho phép công cụ đọc (Read, Grep, Glob): agent đọc bản vẽ, chữ có vị trí và file tri thức, không sửa gì.
import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { GOC_REPO } from "../chung";

/** Token liên kết tài khoản Claude, dán từ web: kết quả `claude setup-token` (dùng lâu dài) hoặc API key. Không commit. */
export const FILE_TOKEN = path.join(GOC_REPO, "runner", "claude_token.json");
export const coToken = () => existsSync(FILE_TOKEN);
export function luuToken(token: string) {
  const t = token.trim();
  if (!/^sk-ant-[\w-]{20,}$/.test(t)) throw new Error("Token không đúng dạng (sk-ant-…): dùng kết quả của `claude setup-token` hoặc API key.");
  writeFileSync(FILE_TOKEN, JSON.stringify({ token: t, luc: new Date().toISOString() }), "utf8");
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

export function chayClaude(prompt: string, thuMucPhien: string, timeoutMs = 30 * 60_000): Promise<string> {
  const args = ["-p", "--output-format", "json", "--allowedTools", "Read", "Grep", "Glob", "--add-dir", thuMucPhien];
  if (process.env.PCCC_CLAUDE_MODEL) args.push("--model", process.env.PCCC_CLAUDE_MODEL);
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
