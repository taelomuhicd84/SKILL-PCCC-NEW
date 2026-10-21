// Lưu đệm câu trả lời job theo nội dung prompt (dùng chung mọi phiên): cùng hồ sơ, cùng bảng, cùng tri thức thì không gọi AI lại.
// Khóa = engine + model + prompt (đường dẫn thư mục phiên đã thay bằng <PHIEN>) + giờ sửa mới nhất của tri thức, nên sửa knowledge/ hay prompt là đệm tự vô hiệu.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { GOC_REPO } from "./chung";

const THU_MUC = path.join(GOC_REPO, "runner", "cache");
const TRI_THUC = ["knowledge", "skills", "memory"];

function mtimeMoiNhat(d: string): number {
  if (!existsSync(d)) return 0;
  let m = 0;
  for (const e of readdirSync(d, { withFileTypes: true })) {
    if (e.name === "_nhat_ky_kiem_soat.md") continue;
    const p = path.join(d, e.name);
    m = Math.max(m, e.isDirectory() ? mtimeMoiNhat(p) : statSync(p).mtimeMs);
  }
  return m;
}
let nho: { luc: number; gt: number } | null = null; // quét thư mục tri thức tối đa mỗi 30 giây
const moiNhat = () => (nho && Date.now() - nho.luc < 30_000 ? nho.gt : (nho = { luc: Date.now(), gt: Math.max(...TRI_THUC.map((t) => mtimeMoiNhat(path.join(GOC_REPO, t)))) }).gt);

export function khoaDem(engine: string, model: string, prompt: string, thuMucPhien?: string): string {
  let p = prompt;
  if (thuMucPhien) for (const d of new Set([thuMucPhien, thuMucPhien.split(String.fromCharCode(92)).join("/")])) p = p.split(d).join("<PHIEN>");
  return createHash("sha256").update([engine, model, Math.floor(moiNhat()), p].join("\0")).digest("hex").slice(0, 32);
}
export const docDem = (khoa: string): string | null => { const f = path.join(THU_MUC, khoa + ".txt"); return existsSync(f) ? readFileSync(f, "utf8") : null; };
export function luuDem(khoa: string, tra: string) { mkdirSync(THU_MUC, { recursive: true }); writeFileSync(path.join(THU_MUC, khoa + ".txt"), tra, "utf8"); }
