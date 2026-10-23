// Điều phối các giai đoạn trên web: đọc hồ sơ (A0) → chọn bảng → các job hạng mục → rà soát → gộp.
import {
  ThongTin, agentById, canKhung, nhomCuaAgent, docKetQuaJob, ganHuongDan, gop, lapJobs, promptChat, promptDocHoSo, promptHuongDan, promptJob, promptRaSoat, tachJson, trangLienQuan,
  type Job, type LuotChat, type PhamVi, type KetQuaDong, type PromptCtx, type DongKetQua, type TrangChu,
} from "@pccc/shared";
import { taiBang, taiKb } from "./data";

/** Gọi AI: nhận prompt chế độ "tep" (Claude) và "kem" (Gemini, thủ công), trả văn bản thô. */
export type Goi = (jobId: string, ten: string, promptTep: string, promptKem: string) => Promise<string>;

export interface NguCanh { so_trang: number; huong_dan: boolean; tep: { pdf: string; chu_dir: string } | null; chu?: TrangChu[] }

async function ctxCa(nc: NguCanh, tt: ThongTin | null, files: string[]): Promise<[PromptCtx, PromptCtx]> {
  const base = { thong_tin: tt, so_trang: nc.so_trang, huong_dan: nc.huong_dan };
  return [
    { ...base, che_do: "tep", tep: nc.tep ?? { pdf: "ban_ve.pdf", chu_dir: "chu" } },
    { ...base, che_do: "kem", kb: await taiKb(files) },
  ];
}

/** Gọi và đọc JSON; sai định dạng thì hỏi lại một lần. */
async function goiJson<T>(goi: Goi, id: string, ten: string, pt: string, pk: string, doc: (raw: unknown) => T): Promise<T> {
  const raw = await goi(id, ten, pt, pk);
  try { return doc(tachJson(raw)); } catch (e) {
    const sua = `\n\n## LỖI LẦN TRƯỚC\nCâu trả lời trước không đọc được (${String(e).slice(0, 300)}). Trả lại ĐÚNG MỘT khối \`\`\`json theo định dạng.`;
    return doc(tachJson(await goi(id + "-lai", ten + " (hỏi lại)", pt + sua, pk + sua)));
  }
}

export async function docHoSo(goi: Goi, nc: NguCanh): Promise<ThongTin> {
  const goiY = (await taiBang("A12").catch(() => null))?.dong.map((d) => d.goi_y).filter(Boolean).slice(0, 40) ?? [];
  const [ct, ck] = await ctxCa(nc, null, agentById("doc-ho-so").tri_thuc);
  return goiJson(goi, "A0-doc-ho-so", "Đọc hồ sơ", promptDocHoSo(ct, goiY), promptDocHoSo(ck, goiY), (r) => ThongTin.parse(r));
}

export async function taoJobs(bangChinh: string | null, bangHT: string[], bangKT: string | null = null, phamVi: PhamVi = "pccc"): Promise<Job[]> {
  const chinh = bangChinh ? await taiBang(bangChinh) : null;
  const ht = await Promise.all(bangHT.map(taiBang));
  return lapJobs(chinh, ht, bangKT ? await taiBang(bangKT).catch(() => null) : null, phamVi);
}

/** Prompt của một job cho hai chế độ: "tep" (Claude đọc file) và "kem" (Gemini, thủ công). */
export async function promptCua(nc: NguCanh, tt: ThongTin, job: Job): Promise<{ pt: string; pk: string }> {
  const [ct, ck] = await ctxCa(nc, tt, agentById(job.agent).tri_thuc);
  return { pt: promptJob({ ...ct, trang_lq: trangLienQuan(job.agent, tt, nc.chu ?? []) }, job), pk: promptJob(ck, job) };
}

/** Đọc câu trả lời của một job; điền TT theo bảng (AI hay bỏ trống). */
export function docTraLoiJob(raw: unknown, job: Job): KetQuaDong[] {
  return docKetQuaJob(raw, job.bang, job.dong.map((d) => d.idx)).map((d) => ({ ...d, nhom: nhomCuaAgent(job.agent), tt: d.tt || job.dong.find((x) => x.idx === d.idx)?.tt || "" }));
}

export async function chayMotJob(goi: Goi, nc: NguCanh, tt: ThongTin, job: Job): Promise<KetQuaDong[]> {
  const { pt, pk } = await promptCua(nc, tt, job);
  return goiJson(goi, job.id, `${agentById(job.agent).ten} (${job.bang})`, pt, pk, (r) => docTraLoiJob(r, job));
}

export async function raSoat(goi: Goi, nc: NguCanh, tt: ThongTin, ds: DongKetQua[]): Promise<KetQuaDong[]> {
  const [ct, ck] = await ctxCa(nc, tt, agentById("ra-soat").tri_thuc);
  const xet = ds.filter((d) => d.ket_luan !== "KHONG_AP_DUNG");
  const theoBang = new Map<string, number[]>();
  for (const d of ds) theoBang.set(d.bang, [...(theoBang.get(d.bang) ?? []), d.idx]);
  return goiJson(goi, "R-ra-soat", "Rà soát chéo", promptRaSoat(ct, xet), promptRaSoat(ck, xet), (r) => {
    const raw = r as { dong?: { bang?: string }[] };
    return [...theoBang].flatMap(([bang, idx]) => docKetQuaJob({ dong: (raw.dong ?? []).filter((d) => d.bang === bang) }, bang, idx));
  });
}

/** Agent Hướng dẫn thẩm định: chạy sau rà soát, trả về kết quả đã ghi hướng dẫn vào các dòng CHƯA ĐẠT, CẦN XÁC NHẬN, chỉnh bản vẽ. */
export async function huongDan(goi: Goi, nc: NguCanh, tt: ThongTin, ds: DongKetQua[]): Promise<DongKetQua[]> {
  const [ct, ck] = await ctxCa(nc, tt, agentById("huong-dan").tri_thuc);
  const can = ds.filter(canKhung);
  if (!can.length) return ds;
  return goiJson(goi, "H-huong-dan", "Hướng dẫn thẩm định", promptHuongDan(ct, can), promptHuongDan(ck, can), (r) => ganHuongDan(ds, r));
}

export { gop };

/** Prompt chat Sơ bộ thiết kế PCCC cho hai chế độ: "tep" (Claude đọc file) và "kem" (Gemini, tri thức dán sẵn). */
export async function promptChatCa(nc: NguCanh, tt: ThongTin | null, lichSu: LuotChat[], cau: string, khoanh = false): Promise<{ pt: string; pk: string }> {
  const [ct, ck] = await ctxCa(nc, tt, agentById("so-bo-thiet-ke").tri_thuc);
  return { pt: promptChat(ct, lichSu, cau, khoanh), pk: promptChat(ck, lichSu, cau, khoanh) };
}
