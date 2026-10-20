// Chạy một lô job song song: Gemini API = N luồng gọi API (mặc định 10), Claude = N tiến trình `claude -p` (mặc định 3),
// Gemini web = tab trong một Chrome ẩn (mặc định 1 tab, tuần tự, có nghỉ).
// Mỗi job xong ghi ngay ra đĩa (bộ nhớ tạm) jobs/<job>.tra_loi.txt; chạy lại lô thì job đã có câu trả lời
// cho đúng prompt đó được dùng lại (tiếp tục sau khi bị ngắt). Ghép kết quả do bên gọi làm (web hoặc CLI gop).
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { log } from "./chung";
import { chayClaudeCho } from "./engines/claude";
import { BiChan, chayTrenTab, dongTrinhDuyet, moTab } from "./engines/gemini";
import { QuaHanMuc, chayGeminiApi } from "./engines/gemini_api";

export type EngineLo = "claude" | "gemini" | "gemini-api";
const LUONG_MAC_DINH: Record<EngineLo, number> = { "gemini-api": Number(process.env.PCCC_GEMINI_API_LUONG ?? 10), claude: Number(process.env.PCCC_CLAUDE_LUONG ?? 3), gemini: Number(process.env.PCCC_GEMINI_LUONG ?? 1) };
import { nghi, ngauNhien } from "./engines/nguoi_that";

export interface ViecLo { job: string; prompt: string; engine?: "claude" | "gemini"; prompt_claude?: string }
export interface TrangThaiLo { tong: number; xong: Record<string, string>; loi: Record<string, string>; dang: string[]; het: boolean; bat_dau: string }

const bam = (s: string) => createHash("sha1").update(s).digest("hex").slice(0, 16);
const tenJob = (j: string) => j.replace(/[^\w.-]/g, "_");

/** Câu trả lời đã lưu của job (nếu prompt không đổi). */
export function daCo(dir: string, v: ViecLo): string | null {
  const f = path.join(dir, "jobs", `${tenJob(v.job)}.tra_loi.txt`), h = path.join(dir, "jobs", `${tenJob(v.job)}.prompt.sha`);
  return existsSync(f) && existsSync(h) && readFileSync(h, "utf8") === bam(v.prompt) ? readFileSync(f, "utf8") : null;
}
function luuTam(dir: string, v: ViecLo, tra: string) {
  mkdirSync(path.join(dir, "jobs"), { recursive: true });
  writeFileSync(path.join(dir, "jobs", `${tenJob(v.job)}.prompt.md`), v.prompt, "utf8");
  writeFileSync(path.join(dir, "jobs", `${tenJob(v.job)}.tra_loi.txt`), tra, "utf8");
  writeFileSync(path.join(dir, "jobs", `${tenJob(v.job)}.prompt.sha`), bam(v.prompt), "utf8");
}

export async function chayLo(engine: EngineLo, dir: string, viec: ViecLo[], tt: TrangThaiLo, luong?: number, dongLo = true): Promise<void> {
  const conLai: ViecLo[] = [];
  for (const v of viec) { const c = daCo(dir, v); if (c != null) tt.xong[v.job] = c; else conLai.push(v); }
  if (conLai.length < viec.length) log(`lô: dùng lại ${viec.length - conLai.length} job đã có`);
  const n = Math.max(1, Math.min(luong ?? LUONG_MAC_DINH[engine], conLai.length));
  let dung: string | null = null;
  const pdf = path.join(dir, "ban_ve.pdf");

  const worker = async (i: number) => {
    let tab: Awaited<ReturnType<typeof moTab>> | null = null;
    let soViec = 0;
    if (engine === "gemini") await nghi(i * 4000, i * 7000); // mở tab cách nhau 4–7 s/tab, không mở dồn một lúc
    else if (engine === "gemini-api") await nghi(i * 1500, i * 1500 + 1000);
    while (!dung) {
      const v = conLai.shift();
      if (!v) break;
      tt.dang.push(v.job);
      for (let thu = 1; thu <= 2; thu++) {
        try {
          let tra: string;
          if (engine === "gemini") {
            tab ??= await moTab();
            tra = await chayTrenTab(tab, v.prompt, pdf, path.join(dir, "jobs"), tenJob(v.job));
          } else if (engine === "gemini-api") tra = await chayGeminiApi(v.prompt, pdf);
          else tra = await chayClaudeCho(v.prompt, dir);
          luuTam(dir, v, tra);
          tt.xong[v.job] = tra;
          delete tt.loi[v.job];
          log(`lô: xong ${v.job} (tab ${i + 1})`);
          break;
        } catch (e) {
          if (e instanceof BiChan || (e instanceof QuaHanMuc && thu === 2)) { dung = String(e.message); tt.loi[v.job] = dung; break; }
          tt.loi[v.job] = String(e).slice(0, 400);
          log(`lô: lỗi ${v.job} lần ${thu}:`, String(e).slice(0, 200));
          if (tab) { await tab.close().catch(() => {}); tab = null; }
          await nghi(5000, 15000);
        }
      }
      tt.dang = tt.dang.filter((x) => x !== v.job);
      if (engine === "gemini" && !dung) { // nghỉ giữa các lượt; vài lượt nghỉ dài
        soViec++;
        await nghi(...(soViec % 4 === 0 ? [40_000, 90_000] as const : [8_000, 20_000] as const));
      }
    }
    await tab?.close().catch(() => {});
  };

  await Promise.all(Array.from({ length: n }, (_, i) => worker(i)));
  if (dung) for (const v of conLai) tt.loi[v.job] = "chưa chạy: " + dung;
  if (engine === "gemini") await dongTrinhDuyet();
  if (dongLo) tt.het = true;
  log(`lô xong: ${Object.keys(tt.xong).length}/${tt.tong} job, lỗi ${Object.keys(tt.loi).length}`);
}

/** Chế độ hỗn hợp: job có engine "gemini" chạy 10 tab Gemini web ẩn, còn lại chạy 3 luồng Claude; hai nhóm chạy cùng lúc. */
export async function chayHonHop(dir: string, viec: ViecLo[], tt: TrangThaiLo): Promise<void> {
  const nhom = (e: "claude" | "gemini") => viec.filter((v) => (v.engine ?? "claude") === e);
  await Promise.all([
    chayLo("claude", dir, nhom("claude"), tt, 3, false), // Claude luôn 3 luồng
    chayLo("gemini", dir, nhom("gemini"), tt, Number(process.env.PCCC_GEMINI_LUONG_HH ?? 10), false),
  ]);
  // Job Gemini lỗi (cookie hết hạn, giao diện đổi…) tự chuyển sang Claude để không mất kết quả.
  const hong = nhom("gemini").filter((v) => tt.xong[v.job] == null);
  if (hong.length) { log(`hỗn hợp: ${hong.length} job Gemini lỗi, chuyển sang Claude`); await chayLo("claude", dir, hong.map((v) => ({ ...v, prompt: v.prompt_claude ?? v.prompt })), tt, 3, false); }
  tt.het = true;
}

export const taoTrangThai = (tong: number): TrangThaiLo => ({ tong, xong: {}, loi: {}, dang: [], het: false, bat_dau: new Date().toISOString() });
export { ngauNhien };
