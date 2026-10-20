// Chia bảng đối chiếu thành các job cho agent: bảng công năng chia theo mục lớn (TT là số nguyên tăng dần),
// bảng hệ thống là một job (chia nhỏ nếu dài).
import type { Bang, DongBang } from "./schema";
import { agentChoBangHeThong, agentChoMuc, nhomCuaAgent } from "./agents";

export interface Job {
  id: string;          // vd. "A12-m07-thoat-nan-1"
  agent: string;       // AgentDef.id
  bang: string;
  muc: string;         // tiêu đề mục
  dong: DongBang[];
}

const MAX_DONG = 45;
const laDongDanhSo = (d: DongBang) => /^\d+$/.test(d.noi_dung.trim()); // dòng "1 | 2 | 3 …" đánh số cột

export const laBangKienTruc = (ma: string) => ma.startsWith("KT");

export function chiaMuc(b: Bang): { tieu_de: string; dong: DongBang[] }[] {
  const out: { tieu_de: string; dong: DongBang[] }[] = [];
  const kt = laBangKienTruc(b.ma); // bảng kiến trúc chỉ giữ một số mục lớn (TT 2, 3, 5…) nên không đòi TT liên tiếp
  let ky = 1;
  for (const d of b.dong) {
    if (laDongDanhSo(d)) continue;
    const m = d.tt.match(/^(\d+)\.?$/);
    if (m && (kt || Number(m[1]) === ky)) {
      out.push({ tieu_de: d.noi_dung, dong: [] });
      ky++;
    }
    if (!out.length) out.push({ tieu_de: "Phần đầu", dong: [] });
    out[out.length - 1].dong.push(d);
  }
  return out;
}

/** Cắt một mục dài thành các phần ≤ MAX_DONG, ưu tiên cắt ở dòng tiêu đề con (TT dạng 7.2). */
export function catNho(dong: DongBang[]): DongBang[][] {
  if (dong.length <= MAX_DONG) return [dong];
  const parts: DongBang[][] = [[]];
  for (const d of dong) {
    const cur = parts[parts.length - 1];
    const laTieuDeCon = /^\d+\.\d+\.?$/.test(d.tt);
    if (cur.length >= MAX_DONG || (laTieuDeCon && cur.length >= MAX_DONG / 2)) parts.push([]);
    parts[parts.length - 1].push(d);
  }
  return parts.filter((p) => p.length);
}

/** Phạm vi thẩm định: xây dựng PCCC (kiến trúc), hệ thống PCCC, hoặc cả hai (hai kết quả tách riêng). */
export type PhamVi = "ca-hai" | "kien-truc" | "pccc";

export function lapJobs(bangChinh: Bang | null, bangHeThong: Bang[], bangKienTruc: Bang | null = null, phamVi: PhamVi = "pccc"): Job[] {
  const jobs: Job[] = [];
  const push = (agent: string, bang: string, muc: string, dong: DongBang[]) => {
    catNho(dong).forEach((p, i, all) =>
      jobs.push({ id: `${bang}-${agent}${all.length > 1 ? "-" + (i + 1) : ""}`, agent, bang, muc, dong: p }));
  };
  if (bangChinh) for (const m of chiaMuc(bangChinh)) {
    const ag = agentChoMuc(m.tieu_de).id, nhom = nhomCuaAgent(ag);
    // bảng công năng A: phần hệ thống PCCC khi thẩm định hệ thống; chỉ mục phân loại khi chỉ làm kiến trúc (các mục kiến trúc lấy ở bảng KT)
    if (phamVi !== "kien-truc" || nhom === "chung") push(ag, bangChinh.ma, m.tieu_de, m.dong);
  }
  if (bangKienTruc && phamVi !== "pccc") for (const m of chiaMuc(bangKienTruc)) push(agentChoMuc(m.tieu_de).id, bangKienTruc.ma, m.tieu_de, m.dong);
  if (phamVi !== "kien-truc") for (const b of bangHeThong) push(agentChoBangHeThong(b.ma).id, b.ma, b.ten, b.dong.filter((d) => !laDongDanhSo(d)));
  // id trùng (hai mục cùng agent trong một bảng) → thêm hậu tố
  const seen = new Map<string, number>();
  for (const j of jobs) { const n = seen.get(j.id) ?? 0; seen.set(j.id, n + 1); if (n) j.id += "-" + (n + 1); }
  return jobs;
}
