// Sổ tài liệu học tập: file JSON nằm TRONG thư mục tài liệu (copy thư mục sang máy mới thì sổ đi theo, file đã học không học lại).
// File được nhận diện bằng đường dẫn tương đối + mã băm nội dung (không dùng đường dẫn tuyệt đối, không dùng giờ sửa file vì copy làm đổi).
// Từ sổ sinh checklist (_CHECKLIST_TAI_LIEU.md): mỗi dòng một văn bản; văn bản mới thay/sửa đổi văn bản cũ thì thay ngay tại dòng cũ.
import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

export const TEN_SO = "_PCCC_so_hoc.json";
export const TEN_CHECKLIST = "_CHECKLIST_TAI_LIEU.md";
const BO_QUA = new Set(["node_modules", ".git", "$recycle.bin", "system volume information"]);

export type TrangThaiHang = "da_hoc" | "khong_lien_quan" | "scan" | "loi" | "khong_ho_tro";
export interface Hang {
  ten: string; rel: string; sha: string; size: number; so_hieu: string; tieu_de: string; loai_tl: string; tinh_nang: string;
  ngay: string; trang_thai: TrangThaiHang; id?: string; ghi_chu: string;
  /** số khái niệm đã rút (undefined = chưa rút) và rút từ đâu */
  khai_niem?: number; kn_tu?: "ghi-chu" | "file";
}
export interface Loai { rel: string; ten: string; ly_do: string; ngay: string }
export interface So { v: 1; hang: Hang[]; loai: Loai[]; da_doc: Record<string, { sha: string; size: number; mtime: number }> }
export interface GhiChuNhe { id: string; tieu_de: string; anh_huong: string; ngay: string }
export interface Tep { abs: string; rel: string; size: number; mtime: number; sha: string }

const relDe = (dir: string, abs: string) => path.relative(dir, abs).replace(/\\/g, "/");
const bam = (f: string) => createHash("sha1").update(readFileSync(f)).digest("hex");

export function docSo(dir: string): So {
  try { const s = JSON.parse(readFileSync(path.join(dir, TEN_SO), "utf8").replace(/^﻿/, "")) as So; return { v: 1, hang: s.hang ?? [], loai: s.loai ?? [], da_doc: s.da_doc ?? {} }; }
  catch { return { v: 1, hang: [], loai: [], da_doc: {} }; }
}
export const ghiSo = (dir: string, so: So) => writeFileSync(path.join(dir, TEN_SO), JSON.stringify(so, null, 1), "utf8");

/** Mọi file trong cây thư mục (bỏ file bắt đầu bằng "_" là file của hệ thống, liên kết tượng trưng, thư mục hệ thống). */
export function tatCaTep(goc: string, out: string[] = [], sau = 0): string[] {
  if (sau > 8 || out.length > 5000) return out;
  let ds: string[] = [];
  try { ds = readdirSync(goc); } catch { return out; }
  for (const t of ds) {
    if (t.startsWith("~$") || t.startsWith("_") || BO_QUA.has(t.toLowerCase())) continue;
    const f = path.join(goc, t);
    let st; try { st = lstatSync(f); } catch { continue; }
    if (st.isSymbolicLink()) continue;
    if (st.isDirectory()) tatCaTep(f, out, sau + 1); else out.push(f);
  }
  return out;
}

// ---------- số hiệu ----------
export interface SoHieu { base: string; nam?: string; sd: boolean; khoa: string; hien: string }
/** Nhận số hiệu từ chuỗi tự do (tên file, tiêu đề). `sd`: là bản sửa đổi, bổ sung. Văn bản không có số hiệu nhận ra được → null. */
export function chuanSo(t: string): SoHieu | null {
  const sd = /s[ửu]a\s*đ[ổo]i|\bsđ\s?\d|bổ\s*sung/i.test(t);
  let m = t.match(/\b(TCVN|QCVN)[\s-]*(\d+(?:-\d{1,2})?)(?!\d)\s*[:_\-/\s]?\s*((?:19|20)\d{2})?/i);
  if (m) {
    const base = `${m[1].toUpperCase()} ${m[2].replace(/^0+(?=\d)/, "")}`;
    return { base, nam: m[3], sd, khoa: `${base}|${m[3] ?? ""}|${sd ? "sd" : ""}`, hien: base + (m[3] ? ":" + m[3] : "") };
  }
  let loai = "", so = "", nam = "";
  m = t.match(/\b(N[Đđ]|TT|Q[Đđ])\s*[- ]?\s*(\d{1,4})\s*\/\s*((?:19|20)\d{2})/i);
  if (m) { loai = m[1]; so = m[2]; nam = m[3]; }
  else if ((m = t.match(/(\d{1,4})\s*\/\s*((?:19|20)\d{2})\s*\/\s*(N[Đđ]|TT|Q[Đđ])/i))) { so = m[1]; nam = m[2]; loai = m[3]; }
  if (!so && (m = t.match(/\b(\d{1,4})_((?:19|20)\d{2})_(nd|tt|qd)/i))) { so = m[1]; nam = m[2]; loai = m[3]; }
  if (!so) return null;
  const hien = `${loai.toUpperCase()} ${so}/${nam}`.replace(/^ND /, "NĐ ").replace(/^QD /, "QĐ ");
  return { base: hien, sd: false, khoa: hien, hien };
}
const soCua = (h: Hang) => {
  const c = chuanSo(h.so_hieu) ?? chuanSo(h.tieu_de) ?? chuanSo(h.ten);
  if (!c || c.base.includes("/")) return c;
  const sd = chuanSo(`${h.tieu_de} ${h.ten} ${h.so_hieu}`)?.sd ?? c.sd; // "sửa đổi" thường nằm ở tiêu đề/tên file, không ở số hiệu
  return { ...c, sd, khoa: `${c.base}|${c.nam ?? ""}|${sd ? "sd" : ""}` };
};

// ---------- phân loại theo tên ----------
export function loaiTaiLieu(rel: string): string {
  const t = rel.toLowerCase();
  if (/\.(xls|xlsx|xlsm)$/.test(t)) return "Bảng tính";
  if (/\.(mp4|mkv|avi|mov)$/.test(t)) return "Video";
  if (/tap huan|tập huấn|chuyên đề|chuyen de/.test(t)) return "Tài liệu tập huấn";
  if (/sơ đồ|so do|bảng tra|bang tra|tra bảng/.test(t)) return "Sơ đồ – tra nhanh";
  if (/nước ngoài|nuoc ngoai|\bsp ?\d|nfpa|ashrae/.test(t)) return "Tiêu chuẩn nước ngoài";
  if (/qcvn/.test(t)) return "Quy chuẩn QCVN";
  if (/tcvn/.test(t)) return "Tiêu chuẩn TCVN";
  if (/nghị định|nghi dinh|\bn[đd]\b|[-_ ]ndcp|thông tư|thong tu|công văn|cong van|c07-p|luật|luat|\d+\/20\d{2}/.test(t)) return "Văn bản pháp luật";
  return "Khác";
}
/** "m01-phan-loai, m02-bac-chiu-lua" → "M01, M02" (tính năng/mục thẩm định mà văn bản ảnh hưởng). */
export function nhanTinhNang(anh_huong: string | string[]): string {
  const t = Array.isArray(anh_huong) ? anh_huong.join(",") : anh_huong;
  const m = [...t.matchAll(/\bm(\d{2})\b/gi)].map((x) => "M" + x[1]); // ghi chú cũ có chú thích tự do sau mã mục: chỉ lấy mã
  const khac = t.split(/[,;]/).map((x) => x.trim()).filter((x) => /^(doc-ho-so|huong-dan|ra-soat|so-bo-thiet-ke|chung)$/.test(x));
  return [...new Set([...m, ...khac])].join(", ");
}

// ---------- quét: file nào cần học ----------
/** `duocDoc`: file có định dạng học được. `cu`: chỉ mục cũ của runner (đường dẫn tuyệt đối → thông tin), để chuyển sổ cũ sang sổ mới mà không học lại, không gọi AI. */
export function quet(dir: string, so: So, tatCa: string[], duocDoc: (f: string) => boolean,
  cu: Record<string, { size: number; id?: string; ghi?: string }>, ghiChu: Map<string, GhiChuNhe>): Tep[] {
  const can: Tep[] = [];
  const dongCuoi = (k: string) => so.hang.find((h) => h.rel === k);
  for (const abs of tatCa) {
    const rel = relDe(dir, abs), ten = path.basename(abs);
    let st; try { st = statSync(abs); } catch { continue; }
    if (!duocDoc(abs)) {
      if (!dongCuoi(rel) && !/\.(ps1|csv|json|bat|ini|db)$/i.test(ten))
        so.hang.push({ ten, rel, sha: "", size: st.size, so_hieu: "", tieu_de: "", loai_tl: loaiTaiLieu(rel), tinh_nang: "", ngay: new Date(st.mtimeMs).toISOString(), trang_thai: "khong_ho_tro",
          ghi_chu: /\.doc$/i.test(ten) ? "Word cũ .doc: lưu thành .docx để học" : "Định dạng này agent chưa đọc" });
      continue;
    }
    const e = so.da_doc[rel];
    if (e && e.size === st.size) {
      if (Math.abs(e.mtime - st.mtimeMs) < 2000) continue;
      if (!e.sha) { e.mtime = st.mtimeMs; e.sha = bam(abs); continue; } // chuyển từ chỉ mục cũ: coi như chưa đổi
      const sha = bam(abs);
      if (sha === e.sha) { e.mtime = st.mtimeMs; continue; } // chỉ đổi giờ do copy sang máy khác
      can.push({ abs, rel, size: st.size, mtime: st.mtimeMs, sha }); continue; // nội dung đổi: học lại
    }
    const lg = cu[abs];
    if (lg && lg.size === st.size) { // chuyển từ chỉ mục cũ (không băm: tránh tải cả thư mục Drive về)
      const sha = "";
      so.da_doc[rel] = { sha, size: st.size, mtime: st.mtimeMs };
      if (!dongCuoi(rel)) {
        const g = lg.id ? ghiChu.get(lg.id) : undefined;
        const so_hieu = chuanSo(ten)?.hien || (g && chuanSo(g.tieu_de)?.hien) || "";
        so.hang.push({ ten, rel, sha, size: st.size, so_hieu, tieu_de: g?.tieu_de ?? "", loai_tl: loaiTaiLieu(rel), tinh_nang: g ? nhanTinhNang(g.anh_huong) : "",
          ngay: g?.ngay ?? new Date(st.mtimeMs).toISOString(), trang_thai: g || /đã (nạp|học)/.test(lg.ghi ?? "") ? "da_hoc" : /scan/.test(lg.ghi ?? "") ? "scan" : "khong_lien_quan", id: lg.id, ghi_chu: g ? "" : lg.ghi ?? "" });
      }
      continue;
    }
    const sha = bam(abs);
    const tep = { abs, rel, size: st.size, mtime: st.mtimeMs, sha };
    if (e) { can.push(tep); continue; }
    const trungSha = Object.entries(so.da_doc).find(([k, v]) => v.sha === sha && k !== rel);
    if (trungSha) {
      const [k] = trungSha;
      if (!existsSync(path.join(dir, k))) { // file chỉ bị dời/đổi tên: giữ nguyên dòng, cập nhật đường dẫn
        const h = dongCuoi(k); if (h) { h.rel = rel; h.ten = ten; }
        so.da_doc[rel] = { sha, size: st.size, mtime: st.mtimeMs }; delete so.da_doc[k]; continue;
      }
      so.loai.push({ rel, ten, ly_do: `trùng nội dung với ${k}`, ngay: new Date().toISOString() });
      so.da_doc[rel] = { sha, size: st.size, mtime: st.mtimeMs }; continue;
    }
    const trungTen = so.hang.find((h) => h.rel !== rel && h.ten.toLowerCase() === ten.toLowerCase());
    if (trungTen) {
      so.loai.push({ rel, ten, ly_do: `trùng tên với ${trungTen.rel}`, ngay: new Date().toISOString() });
      so.da_doc[rel] = { sha, size: st.size, mtime: st.mtimeMs }; continue;
    }
    can.push(tep);
  }
  return can;
}

// ---------- trùng / thay thế ----------
export type Xu = { kieu: "moi" } | { kieu: "trung" | "cu_hon"; voi: Hang } | { kieu: "thay"; cu: Hang[]; loai: "thay_the" | "sua_doi_bo_sung" };
const LA_VB = new Set(["Văn bản pháp luật", "Quy chuẩn QCVN", "Tiêu chuẩn TCVN", "Tiêu chuẩn nước ngoài", "Khác"]);
export function xuLy(so: So, h: Hang, thay: { van_ban?: string; kieu?: string }[] = []): Xu {
  const nm = soCua(h);
  const khac = LA_VB.has(h.loai_tl) ? so.hang.filter((r) => r.rel !== h.rel && r.trang_thai === "da_hoc" && LA_VB.has(r.loai_tl)) : []; // tập huấn, bảng tính, sơ đồ nhắc số hiệu nhưng không phải bản của văn bản đó
  const cu = new Map<string, Hang>();
  let loai: "thay_the" | "sua_doi_bo_sung" = "thay_the";
  if (nm) for (const r of khac) {
    const c = soCua(r); if (!c) continue;
    if (c.khoa === nm.khoa) return { kieu: "trung", voi: r };
    if (c.base !== nm.base) continue;
    if (nm.sd && !c.sd) { cu.set(r.rel, r); loai = "sua_doi_bo_sung"; }
    else if (nm.sd === c.sd && nm.nam && c.nam && nm.nam !== c.nam) { if (nm.nam > c.nam) cu.set(r.rel, r); else return { kieu: "cu_hon", voi: r }; }
  }
  for (const t of thay) {
    const x = chuanSo(t.van_ban ?? ""); if (!x) continue;
    for (const r of khac) { const c = soCua(r); if (c && c.base === x.base && (!x.nam || !c.nam || x.nam === c.nam)) cu.set(r.rel, r); }
    if (/sua_doi/.test(t.kieu ?? "") && cu.size) loai = "sua_doi_bo_sung";
  }
  return cu.size ? { kieu: "thay", cu: [...cu.values()], loai } : { kieu: "moi" };
}
/** Ghi kết quả vào sổ: thay đúng vị trí dòng cũ (không đổi thứ tự checklist). */
export function apDung(so: So, h: Hang, xu: Xu) {
  const ngay = new Date().toISOString();
  if (xu.kieu === "trung" || xu.kieu === "cu_hon") {
    so.loai.push({ rel: h.rel, ten: h.ten, ly_do: xu.kieu === "trung" ? `trùng số hiệu ${xu.voi.so_hieu} với ${xu.voi.ten}` : `bản cũ hơn, đã có ${xu.voi.ten} (${xu.voi.so_hieu})`, ngay });
    return;
  }
  const vt = (xu.kieu === "thay" ? xu.cu[0] : so.hang.find((r) => r.rel === h.rel));
  if (xu.kieu === "thay") {
    h.ghi_chu = `${xu.loai === "thay_the" ? "Thay thế" : "Sửa đổi, bổ sung"}: ${xu.cu.map((c) => `${c.so_hieu || c.tieu_de || c.ten} (file ${c.ten})`).join("; ")}`;
    so.hang = so.hang.filter((r) => r === vt || !xu.cu.includes(r));
  }
  const i = vt ? so.hang.indexOf(vt) : -1;
  if (i >= 0) so.hang[i] = h; else so.hang.push(h);
}

// ---------- checklist ----------
const TT: Record<TrangThaiHang, string> = { da_hoc: "✅ đã học", khong_lien_quan: "➖ không liên quan PCCC", scan: "⚠ bản scan, cần OCR", loi: "❌ lỗi, học lại", khong_ho_tro: "⏸ chưa đọc được" };
const o = (s: string) => s.replace(/\|/g, "/").replace(/\n/g, " ");
export function veChecklist(dir: string, so: So): string {
  const dem = (t: TrangThaiHang) => so.hang.filter((h) => h.trang_thai === t).length;
  const dong = so.hang.map((h, i) => {
    const trung = h.trang_thai === "da_hoc" && h.so_hieu && LA_VB.has(h.loai_tl) ? so.hang.find((r) => r !== h && r.so_hieu === h.so_hieu && r.loai_tl === h.loai_tl) : undefined;
    return `| ${i + 1} | ${o(h.ten)} | ${o(h.so_hieu)} | ${h.loai_tl} | ${o(h.tinh_nang)} | ${h.ngay.slice(0, 10)} | ${TT[h.trang_thai]} | ${h.khai_niem === undefined ? "chưa rút" : h.khai_niem} | ${o(h.ghi_chu + (trung ? ` ⚠ trùng số hiệu với ${trung.ten}` : ""))} |`;
  });
  const loai = so.loai.map((l, i) => `| ${i + 1} | ${o(l.ten)} | ${o(l.rel)} | ${l.ngay.slice(0, 10)} | ${o(l.ly_do)} |`);
  return `# Checklist tài liệu học tập\nThư mục: \`${dir}\` · cập nhật ${new Date().toISOString().slice(0, 16).replace("T", " ")} · ${so.hang.length} tài liệu (đã học ${dem("da_hoc")}, scan ${dem("scan")}, chưa đọc được ${dem("khong_ho_tro")}), đã loại ${so.loai.length}.\n` +
    `Dòng có ghi chú "Thay thế / Sửa đổi, bổ sung" là văn bản mới đã thay vào đúng vị trí văn bản cũ; ghi chú tri thức của văn bản cũ được đánh dấu hết hiệu lực (thay thế) hoặc cảnh báo (sửa đổi).\n\n` +
    `| STT | Tên file | Số hiệu | Loại | Tính năng (mục) | Cập nhật | Trạng thái | Khái niệm | Ghi chú |\n|---|---|---|---|---|---|---|---|---|\n${dong.join("\n")}\n` +
    (loai.length ? `\n## Đã loại (trùng, không học)\n| STT | Tên file | Đường dẫn | Ngày | Lý do |\n|---|---|---|---|---|\n${loai.join("\n")}\n` : "");
}
