// Gọi runner cục bộ (http://127.0.0.1:8787) – runner điều khiển Claude Code hoặc Gemini trên máy người dùng.
import type { TrangChu } from "@pccc/shared";

export type Engine = "claude" | "gemini" | "thu-cong";
export const RUNNER = (() => { try { return localStorage.getItem("pccc.runner") || "http://127.0.0.1:8787"; } catch { return "http://127.0.0.1:8787"; } })();

export interface SucKhoe { ok: boolean; claude: boolean; gemini: boolean; ghi_chu?: string }
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
export async function chayJob(engine: "claude" | "gemini", phien: string, job: string, prompt: string): Promise<string> {
  const r = await fetch(`${RUNNER}/job`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ engine, phien, job, prompt }),
  });
  const t = await r.text();
  if (!r.ok) throw new Error(t || r.statusText);
  return (JSON.parse(t) as { tra_loi: string }).tra_loi;
}
