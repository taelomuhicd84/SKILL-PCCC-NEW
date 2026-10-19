// Gọi runner cục bộ (http://127.0.0.1:8787) – runner điều khiển Claude Code hoặc Gemini trên máy người dùng.
import type { TrangChu } from "@pccc/shared";

export type Engine = "gemini-api" | "claude" | "gemini" | "thu-cong";
export type EngineRunner = Exclude<Engine, "thu-cong">;
export const RUNNER = (() => { try { return localStorage.getItem("pccc.runner") || "http://127.0.0.1:8787"; } catch { return "http://127.0.0.1:8787"; } })();

export interface SucKhoe { ok: boolean; claude: boolean; claude_token?: boolean; gemini: boolean; gemini_cookie?: boolean; gemini_key?: boolean; ghi_chu?: string }
export interface Phien { phien: string; pdf: string; chu_dir: string }

export async function kiemRunner(): Promise<SucKhoe | null> {
  try {
    const r = await fetch(`${RUNNER}/suc-khoe`, { signal: AbortSignal.timeout(3000) });
    return r.ok ? r.json() : null;
  } catch { return null; }
}

function b64(buf: ArrayBuffer): string {
  const u = new Uint8Array(buf); let s = "";
  for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000));
  return btoa(s);
}

export async function taoPhien(ten: string, pdf: ArrayBuffer, chu: TrangChu[]): Promise<Phien> {
  const r = await fetch(`${RUNNER}/phien`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ ten, pdf_base64: b64(pdf), chu }),
  });
  if (!r.ok) throw new Error("runner: " + (await r.text()));
  return r.json();
}

/** Chạy một agent; trả về văn bản trả lời thô của AI. */
export async function chayJob(engine: EngineRunner, phien: string, job: string, prompt: string): Promise<string> {
  const r = await fetch(`${RUNNER}/job`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ engine, phien, job, prompt }),
  });
  const t = await r.text();
  if (!r.ok) throw new Error(t || r.statusText);
  return (JSON.parse(t) as { tra_loi: string }).tra_loi;
}

async function post<T>(duong: string, body: unknown): Promise<T> {
  const r = await fetch(`${RUNNER}${duong}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body ?? {}) });
  const t = await r.text();
  if (!r.ok) throw new Error((() => { try { return JSON.parse(t).loi; } catch { return t; } })());
  return JSON.parse(t);
}

// ---- liên kết tài khoản (lưu trên máy người dùng, trong thư mục runner) ----
export const napCookieGemini = (json: unknown) => post<{ so_cookie: number }>("/gemini/cookie", json);
export const kiemGemini = () => post<{ dang_nhap: boolean }>("/gemini/kiem", {});
export const luuKeyGemini = (key: string) => post("/gemini/key", { key });
export const luuTokenClaude = (token: string) => post("/claude/token", { token });
export const moDangNhapClaude = () => post<{ huong_dan: string }>("/claude/dang-nhap", {});

// ---- chạy lô song song ----
export interface TrangThaiLo { tong: number; xong: Record<string, string>; loi: Record<string, string>; dang: string[]; het: boolean }
export const batDauLo = (engine: EngineRunner, phien: string, jobs: { job: string; prompt: string }[], luong?: number) =>
  post<{ lo: string }>("/lo", { engine, phien, jobs, luong });
export async function xemLo(id: string): Promise<TrangThaiLo> {
  const r = await fetch(`${RUNNER}/lo/${id}`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
