// Gộp kết quả các job, đánh số khung (số khung = thứ tự dòng cần khoanh, dùng chung cho PDF và bảng).
import { KetQuaJob, type KetQuaDong } from "./schema";

export interface DongKetQua extends KetQuaDong { khung?: number }
export interface KetQua {
  phien_ban: 1;
  ten_cong_trinh: string;
  bang_chinh: string | null;
  bang_he_thong: string[];
  thong_tin: unknown;
  dong: DongKetQua[];
  loi_job: { job: string; loi: string }[];
  ngay: string;
}

export const canKhung = (d: KetQuaDong) => d.ket_luan === "CHUA_DAT" || d.ket_luan === "CAN_XAC_NHAN" || !!d.chinh_ban_ve;

/** Kiểm và chuẩn hoá câu trả lời của một job (ném lỗi nếu sai định dạng). Gán lại `bang` theo job để tránh AI ghi nhầm. */
export function docKetQuaJob(raw: unknown, bang: string, idxHopLe: number[]): KetQuaDong[] {
  const kq = KetQuaJob.parse(raw);
  const ok = new Set(idxHopLe);
  return kq.dong.filter((d) => ok.has(d.idx)).map((d) => ({ ...d, bang }));
}

/** Gộp: dòng sau ghi đè dòng trước cùng (bang, idx) — dùng cho kết quả rà soát. */
export function gop(nhom: KetQuaDong[][]): DongKetQua[] {
  const m = new Map<string, DongKetQua>();
  for (const ds of nhom) for (const d of ds) m.set(`${d.bang}#${d.idx}`, { ...m.get(`${d.bang}#${d.idx}`), ...d });
  const out = [...m.values()].sort((a, b) => (a.bang === b.bang ? a.idx - b.idx : a.bang.localeCompare(b.bang, "vi", { numeric: true })));
  let so = 0;
  for (const d of out) d.khung = canKhung(d) ? ++so : undefined;
  return out;
}

export function demKetLuan(ds: KetQuaDong[]) {
  const c = { DAT: 0, CHUA_DAT: 0, CAN_XAC_NHAN: 0, KHONG_AP_DUNG: 0, chinh_ban_ve: 0 };
  for (const d of ds) { c[d.ket_luan]++; if (d.chinh_ban_ve) c.chinh_ban_ve++; }
  return c;
}
