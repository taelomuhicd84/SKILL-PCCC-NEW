// Chạy: npx tsx runner/src/lap_kho_van_ban.ts — trích chữ mọi tài liệu trong checklist ra runner/cache/van_ban/*.txt để agent hỏi đáp Grep được toàn văn (không gọi AI, không tốn token).
import { mkdirSync, writeFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { docCauHinh, docChu } from "./hoc";
import { docSo } from "./tai_lieu";
import { GOC_REPO } from "./chung";

const RA = path.join(GOC_REPO, "runner", "cache", "van_ban");
mkdirSync(RA, { recursive: true });
let n = 0, bo = 0;
for (const d of docCauHinh().thu_muc.filter((x) => process.argv[2] ? x === process.argv[2] : /TAILIEUHOCTAP/i.test(x))) { // mặc định chỉ thư mục tài liệu học tập, không đụng hồ sơ khách
  if (!existsSync(d)) continue;
  for (const h of docSo(d).hang) {
    if (h.trang_thai === "khong_ho_tro") continue;
    const f = path.join(d, h.rel), out = path.join(RA, h.ten.replace(/[\/:*?"<>|]/g, "_") + ".txt");
    if (!existsSync(f)) continue;
    if (existsSync(out) && statSync(out).mtimeMs > statSync(f).mtimeMs) { bo++; continue; }
    try { const t = (await docChu(f)).replace(/[ \t]+/g, " "); writeFileSync(out, `# FILE: ${h.ten}\n# SỐ HIỆU: ${h.so_hieu}\n# LOẠI: ${h.loai_tl}\n\n${t}`, "utf8"); n++; console.log("ok", h.ten, t.length); }
    catch (e) { console.log("LỖI", h.ten, String(e).slice(0, 100)); }
  }
}
console.log(`xong: ${n} file mới, ${bo} đã có`);
