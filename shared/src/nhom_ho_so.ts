// Gộp nhiều file bản vẽ (kiến trúc, PCCC…) của cùng một công trình theo tên file.
// "KT Hoàng Anh.pdf" + "PCCC Hoàng Anh.pdf" → một nhóm "Hoàng Anh". Không đoán thêm: tên khác nhau thì là công trình khác (web cho đổi nhóm bằng tay).

const bo = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/gi, "d").toLowerCase();

/** Cụm từ chỉ bộ môn, loại bản vẽ (không phải tên công trình). So trên chữ không dấu, theo từng từ. */
const CUM_BO: string[][] = [
  ["kien", "truc"], ["ket", "cau"], ["cap", "thoat", "nuoc"], ["tham", "dinh"], ["tham", "duyet"], ["ban", "ve"], ["thiet", "ke"],
  ["da", "dien"], ["hoan", "cong"], ["phong", "chay", "chua", "chay"], ["thuyet", "minh"], ["ho", "so"], ["he", "thong"],
];
const TU_BO = new Set(["kt", "pccc", "pc", "bv", "kc", "mep", "dd", "final", "copy", "rev", "hs", "tk", "tc", "tm", "pa", "cd", "bvtc", "bvhc"]);
const NGAY = /\b\d{1,2}[.\-/]\d{1,2}(?:[.\-/]\d{2,4})?\b/g;

export interface TenNhom { key: string; ten: string }

export function tenCongTrinh(tenFile: string): TenNhom {
  const goc = tenFile.replace(/\.[a-z0-9]{2,4}$/i, "").replace(NGAY, " ").replace(/\(\s*\d+\s*\)/g, " ");
  const tu = goc.split(/[\s_\-.,;:()[\]]+/).filter(Boolean);
  const kd = tu.map(bo);
  const giu: number[] = [];
  for (let i = 0; i < tu.length;) {
    const cum = CUM_BO.find((c) => c.every((w, k) => kd[i + k] === w));
    if (cum) { i += cum.length; continue; }
    if (TU_BO.has(kd[i]) || /^v\d+$/.test(kd[i]) || /^rev\d*$/.test(kd[i])) { i++; continue; }
    giu.push(i); i++;
  }
  if (giu.length > 1 && /^\d{1,2}$/.test(kd[giu[0]])) giu.shift(); // số thứ tự đầu tên ("01 KT Hoàng Anh")
  const ten = giu.map((i) => tu[i]).join(" ").trim();
  if (!ten) { const t = tu.join(" ") || tenFile; return { key: bo(t), ten: t }; } // tên toàn từ bộ môn/ngày: giữ nguyên, tự thành nhóm riêng
  return { key: giu.map((i) => kd[i]).join(" "), ten };
}

export interface NhomFile<T> { key: string; ten: string; files: T[] }

/** Gộp theo công trình. Trong nhóm: file kiến trúc đứng trước (bản vẽ kiến trúc giúp đọc mặt bằng trước khi đọc hệ thống PCCC). */
export function nhomTheoCongTrinh<T>(files: T[], tenCua: (f: T) => string): NhomFile<T>[] {
  const m = new Map<string, NhomFile<T>>();
  for (const f of files) {
    const t = tenCongTrinh(tenCua(f));
    const g = m.get(t.key) ?? { key: t.key, ten: t.ten, files: [] };
    g.files.push(f);
    m.set(t.key, g);
  }
  const kt = (f: T) => (/\bkt\b|kien\s*truc/i.test(bo(tenCua(f))) ? 0 : 1);
  for (const g of m.values()) g.files.sort((a, b) => kt(a) - kt(b) || tenCua(a).localeCompare(tenCua(b), "vi"));
  return [...m.values()];
}
