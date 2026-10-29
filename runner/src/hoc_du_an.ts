// Kiểm soát bài học rút từ dự án của người dùng (agent pccc-hoc-du-an ghi vào knowledge/hoc/du-an/<agent>.md).
// Không gọi AI: lint thuật ngữ/hiệu lực (kiem_soat.ts), bắt buộc căn cứ, chặn thông tin riêng của khách, báo trùng với tri thức sẵn có.
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { AGENTS } from "@pccc/shared";
import { GOC_REPO } from "./chung";
import { lintVanBan } from "./kiem_soat";

export const THU_MUC_DU_AN = path.join(GOC_REPO, "knowledge", "hoc", "du-an");

export interface BaiHoc { tieu_de: string; trang_thai: string; can_cu: string; noi_dung: string; tho: string }
export interface LoiBaiHoc { tieu_de: string; muc: "loi" | "canh_bao"; ly_do: string }

/** Tách các bài học "### tiêu đề" với các dòng "- Trạng thái:", "- Căn cứ:", "- Nội dung:". */
export function tachBaiHoc(md: string): BaiHoc[] {
  return md.split(/^### /m).slice(1).map((k) => {
    const truong = (ten: string) => k.match(new RegExp(`^- ${ten}:\\s*(.*)$`, "mi"))?.[1].trim() ?? "";
    return { tieu_de: k.split("\n")[0].trim(), trang_thai: truong("Trạng thái"), can_cu: truong("Căn cứ"), noi_dung: truong("Nội dung"), tho: k };
  });
}

// Thông tin riêng của khách không được vào tri thức (repo đẩy GitHub; ket_qua/ thì không).
const RIENG: { re: RegExp; ly_do: string }[] = [
  { re: /(?:\+84|\b0)(?:[\s.]?\d){9}\b/, ly_do: "có số điện thoại" },
  { re: /[\w.+-]+@[\w-]+\.[\w.]+/, ly_do: "có email" },
  { re: /\b\d{12}\b/, ly_do: "có số giống CCCD" },
  { re: /\b(?:ông|bà)\s+[A-ZĐ][a-zà-ỹ]+\s+[A-ZĐ]/u, ly_do: "có tên người" },
  { re: /\b(?:số nhà|địa chỉ|tổ \d+|thửa đất số|tờ bản đồ)\b/i, ly_do: "có địa chỉ / thửa đất" },
  { re: /\b(?:Công ty|DNTN|TNHH)\b[^\n.,;]{3,}/, ly_do: "có tên doanh nghiệp chủ đầu tư" },
];
const CAN_CU = /(Điều|Đ\.?\s?\d|mục|khoản|Bảng|Phụ lục|PL\s?[A-Z]|[A-H]\.\d|\d+\.\d+|tập huấn|người dùng chốt|người thẩm định)/i;
const TRANG_THAI = /^(da_duyet|cho_duyet|het_hieu_luc)$/;

/** Bỏ dấu, ký tự lạ; dùng so trùng. */
const chuan = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, " ").trim();
const cum = (t: string, n = 5) => { const w = chuan(t).split(" "); const s = new Set<string>(); for (let i = 0; i + n <= w.length; i++) s.add(w.slice(i, i + n).join(" ")); return s; };

/** Tỉ lệ cụm 5 từ của a có trong kho (0–1). */
export function tiLeTrung(a: string, kho: Set<string>): number { const c = cum(a); if (!c.size) return 0; let t = 0; for (const x of c) if (kho.has(x)) t++; return t / c.size; }

export function kiemBaiHoc(md: string, kho: Set<string> = new Set()): LoiBaiHoc[] {
  const out: LoiBaiHoc[] = [];
  for (const b of tachBaiHoc(md)) {
    const l = (muc: LoiBaiHoc["muc"], ly_do: string) => out.push({ tieu_de: b.tieu_de, muc, ly_do });
    if (!TRANG_THAI.test(b.trang_thai)) l("loi", `Trạng thái phải là da_duyet | cho_duyet | het_hieu_luc (đang: "${b.trang_thai}")`);
    if (!b.noi_dung) l("loi", "thiếu dòng Nội dung");
    if (!CAN_CU.test(b.can_cu)) l("loi", "thiếu Căn cứ (điều khoản, bảng, tập huấn hoặc 'người dùng chốt <ngày>')");
    for (const r of RIENG) if (r.re.test(b.tho)) l("loi", `lộ thông tin khách: ${r.ly_do}`);
    for (const v of lintVanBan(b.tho)) l("loi", `${v.ly_do}: "${v.trich}"`);
    const t = tiLeTrung(b.noi_dung, kho);
    if (t >= 0.6) l("canh_bao", `trùng ${Math.round(t * 100)}% với tri thức sẵn có: bỏ, hoặc gộp vào file gốc`);
  }
  return out;
}

/** Cụm 5 từ của tri thức sẵn có (knowledge/*.md trừ thư mục học tự động, bai-hoc, skills/), trừ file đang kiểm. */
export function khoTriThuc(boQua: string): Set<string> {
  const s = new Set<string>();
  const duyet = (d: string) => { for (const f of readdirSync(d)) { const p = path.join(d, f);
    if (statSync(p).isDirectory()) { if (!/hoc$/.test(p) || p === THU_MUC_DU_AN) duyet(p); }
    else if (p.endsWith(".md") && path.resolve(p) !== path.resolve(boQua)) for (const x of cum(readFileSync(p, "utf8"))) s.add(x); } };
  for (const d of ["knowledge", "skills"]) if (existsSync(path.join(GOC_REPO, d))) duyet(path.join(GOC_REPO, d));
  return s;
}

/** Mỗi agent một file bài học (agent đọc qua tri_thuc); tạo file trống nếu chưa có. */
export function taoFileAgent(): string[] {
  mkdirSync(THU_MUC_DU_AN, { recursive: true });
  const moi: string[] = [];
  for (const a of AGENTS) {
    const f = path.join(THU_MUC_DU_AN, `${a.id}.md`);
    if (!existsSync(f)) { writeFileSync(f, `# Bài học từ dự án – ${a.ten}\nChỉ áp dụng bài có "Trạng thái: da_duyet". Ghi bởi agent pccc-hoc-du-an, kiểm bằng \`npx tsx runner/src/hoc_du_an.ts kiem\`.\n`, "utf8"); moi.push(f); }
  }
  return moi;
}

if (process.argv[1]?.endsWith("hoc_du_an.ts")) {
  const [viec, ...tep] = process.argv.slice(2);
  if (viec === "tao") console.log(`Tạo ${taoFileAgent().length} file`);
  else if (viec === "kiem") {
    const ds = tep.length ? tep : readdirSync(THU_MUC_DU_AN).filter((f) => f.endsWith(".md") && !f.startsWith("_")).map((f) => path.join(THU_MUC_DU_AN, f));
    let loi = 0;
    for (const f of ds) {
      const kq = kiemBaiHoc(readFileSync(f, "utf8"), khoTriThuc(f));
      for (const k of kq) { console.log(`${path.basename(f)} | ${k.tieu_de} | ${k.muc === "loi" ? "LỖI" : "cảnh báo"}: ${k.ly_do}`); if (k.muc === "loi") loi++; }
    }
    console.log(loi ? `${loi} lỗi: sửa trước khi đặt da_duyet` : "Đạt: không có lỗi");
    process.exit(loi ? 1 : 0);
  } else console.log("Dùng: npx tsx runner/src/hoc_du_an.ts tao | kiem [file.md…]");
}
