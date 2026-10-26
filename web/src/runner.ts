// Gọi runner cục bộ (http://127.0.0.1:8787) – runner điều khiển Claude Code hoặc Gemini trên máy người dùng.
import type { TrangChu } from "@pccc/shared";

export type Engine = "gemini-api" | "claude" | "gemini" | "hon-hop" | "thu-cong";
export type EngineRunner = Exclude<Engine, "thu-cong">;
export type ViecLoWeb = { job: string; prompt: string; engine?: "claude" | "gemini"; prompt_claude?: string };
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

export type Khoang = Partial<Record<"kien_truc" | "pccc", [number, number]>>;
export async function taoPhien(ten: string, pdf: ArrayBuffer, chu: TrangChu[], khoang?: Khoang): Promise<Phien> {
  const r = await fetch(`${RUNNER}/phien`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ ten, pdf_base64: b64(pdf), chu, khoang }),
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
export const luuTokenClaude = (token: string, nhan?: string) => post("/claude/token", { token, nhan });
export const datNhanClaude = (nhan: string) => post("/claude/nhan", { nhan });
export const kiemTraClaude = () => post<{ ok: boolean; ghi_chu: string }>("/claude/kiem-tra", {});
export interface TaiKhoanClaude {
  token: { co: false } | { co: true; nhan: string | null; luc: string | null; loai: string; dau: string };
  cli: { email?: string; cach?: string; dung: false };
  han_muc_den: string | null;
}
export async function docTaiKhoanClaude(): Promise<TaiKhoanClaude | null> {
  try { const r = await fetch(`${RUNNER}/claude/tai-khoan`, { signal: AbortSignal.timeout(15000) }); return r.ok ? r.json() : null; } catch { return null; }
}
export const moDangNhapClaude = () => post<{ huong_dan: string }>("/claude/dang-nhap", {});

// ---- chạy lô song song ----
export interface TrangThaiLo { tong: number; xong: Record<string, string>; loi: Record<string, string>; dang: string[]; het: boolean }
export const batDauLo = (engine: EngineRunner, phien: string, jobs: ViecLoWeb[], luong?: number) =>
  post<{ lo: string }>("/lo", { engine, phien, jobs, luong });
export async function xemLo(id: string): Promise<TrangThaiLo> {
  const r = await fetch(`${RUNNER}/lo/${id}`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

// ---- agent tự học ----
export interface CauHinhHoc { thu_muc: string[]; tu_dong: boolean; tu_duyet: boolean; chu_de: string[]; lan_cuoi?: string }
export interface GhiChuHoc { id: string; tieu_de: string; nguon: string; loai: "thu-muc" | "mang"; hieu_luc: string; trang_thai: "cho_duyet" | "da_duyet" | "bo" | "can_sua"; kiem_soat?: string; ngay: string; anh_huong: string; canh_bao: string; noi_dung: string }
export interface TrangThaiHoc { dang: boolean; viec: string; xong: number; tong: number; moi: number; loi: string[]; bat_dau?: string; ket_thuc?: string }
export async function xemHoc(): Promise<{ cau_hinh: CauHinhHoc; ghi_chu: GhiChuHoc[]; trang_thai: TrangThaiHoc }> {
  const r = await fetch(`${RUNNER}/hoc`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
export interface HangTaiLieu { ten: string; rel: string; so_hieu: string; loai_tl: string; tinh_nang: string; ngay: string; trang_thai: string; khai_niem?: number; ghi_chu: string }
export const xemChecklistHoc = () => fetch(`${RUNNER}/hoc/checklist`).then((r) => r.json() as Promise<{ thu_muc: { duong: string; hang: HangTaiLieu[]; loai: { ten: string; rel: string; ngay: string; ly_do: string }[] }[] }>);
export interface MucKN { y: string; dieu: string; nguon: string; can_xem?: boolean }
export interface KhaiNiemHoc { slug: string; ten: string; dong_nghia: string[]; anh_huong: string[]; lien_quan: string[]; dung_duoc: boolean; dinh_nghia: MucKN[]; cach_xac_dinh: MucKN[]; ap_dung: MucKN[]; khong_ap_dung: MucKN[]; yeu_cau: MucKN[]; cach_kiem: MucKN[]; hay_nham: MucKN[] }
export const xemKhaiNiemHoc = () => fetch(`${RUNNER}/hoc/khai-niem`).then((r) => r.json() as Promise<{ khai_niem: KhaiNiemHoc[]; lo_hong: string[] }>);
export const thuMucHoc = (b: { them?: string; bo?: string; chon?: boolean }) => post<CauHinhHoc>("/hoc/thu-muc", b);
export const cauHinhHoc = (b: Partial<Pick<CauHinhHoc, "tu_dong" | "tu_duyet" | "chu_de">>) => post<CauHinhHoc>("/hoc/cau-hinh", b);
export const chayHoc = (nguon: "thu-muc" | "mang" | "ca-hai" | "khai-niem" | "khai-niem-file", toi_da?: number) => post<{ bat_dau: boolean }>("/hoc/chay", { nguon, toi_da });
export const duyetHoc = (id: string, trang_thai: GhiChuHoc["trang_thai"], ep = false) => post("/hoc/duyet", { id, trang_thai, ep });

export interface DongLog { luc: string; nd: string }
/** Lịch sử chạy của runner (các dòng có giờ trong runner.log). */
export async function docLog(n = 300): Promise<DongLog[] | null> {
  try {
    const r = await fetch(`${RUNNER}/log?n=${n}`, { signal: AbortSignal.timeout(3000) });
    return r.ok ? ((await r.json()) as { dong: DongLog[] }).dong : null;
  } catch { return null; }
}

/** Tìm bản vẽ đã nạp trước đó (cùng tên công trình) ở máy: trả PDF và khoảng trang kiến trúc / hệ thống nếu có. */
export async function timBanVe(ten: string[]): Promise<{ bytes: ArrayBuffer; khoang: Khoang | null } | null> {
  try {
    const q = ten.filter(Boolean).map((t) => "ten=" + encodeURIComponent(t)).join("&");
    const r = await fetch(`${RUNNER}/ban-ve?${q}`, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) return null;
    const m = (await r.json()) as { id: string; khoang: Khoang | null };
    const f = await fetch(`${RUNNER}/ban-ve/file?id=${encodeURIComponent(m.id)}`);
    return f.ok ? { bytes: await f.arrayBuffer(), khoang: m.khoang } : null;
  } catch { return null; }
}
