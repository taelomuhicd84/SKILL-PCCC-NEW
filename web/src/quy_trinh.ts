// Điều phối các giai đoạn trên web: đọc hồ sơ (A0) → chọn bảng → các job hạng mục → rà soát → gộp.
import {
  ThongTin, agentById, docKetQuaJob, gop, lapJobs, promptDocHoSo, promptJob, promptRaSoat, tachJson,
  type Job, type KetQuaDong, type PromptCtx, type DongKetQua,
} from "@pccc/shared";
import { taiBang, taiKb } from "./data";

/** Gọi AI: nhận prompt chế độ "tep" (Claude) và "kem" (Gemini, thủ công), trả văn bản thô. */
export type Goi = (jobId: string, ten: string, promptTep: string, promptKem: string) => Promise<string>;

export interface NguCanh { so_trang: number; huong_dan: boolean; tep: { pdf: string; chu_dir: string } | null }

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
  const goiY = (await taiBang("B15").catch(() => null))?.dong.map((d) => d.goi_y).filter(Boolean).slice(0, 40) ?? [];
  const [ct, ck] = await ctxCa(nc, null, agentById("doc-ho-so").tri_thuc);
  return goiJson(goi, "A0-doc-ho-so", "Đọc hồ sơ", promptDocHoSo(ct, goiY), promptDocHoSo(ck, goiY), (r) => ThongTin.parse(r));
}

export async function taoJobs(bangChinh: string | null, bangHT: string[]): Promise<Job[]> {
  const chinh = bangChinh ? await taiBang(bangChinh) : null;
  const ht = await Promise.all(bangHT.map(taiBang));
  return lapJobs(chinh, ht);
}

export async function chayMotJob(goi: Goi, nc: NguCanh, tt: ThongTin, job: Job): Promise<KetQuaDong[]> {
  const [ct, ck] = await ctxCa(nc, tt, agentById(job.agent).tri_thuc);
  const idx = job.dong.map((d) => d.idx);
  const out = await goiJson(goi, job.id, `${agentById(job.agent).ten} (${job.bang})`, promptJob(ct, job), promptJob(ck, job), (r) => docKetQuaJob(r, job.bang, idx));
  // điền TT theo bảng (AI hay bỏ trống)
  return out.map((d) => ({ ...d, tt: d.tt || job.dong.find((x) => x.idx === d.idx)?.tt || "" }));
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

export { gop };
