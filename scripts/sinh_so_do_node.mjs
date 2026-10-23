// Nhúng nội dung md (skills, knowledge, memory, .claude/agents) vào so_do/so_do_quy_trinh_node.htm để bấm node xem được khi mở file trực tiếp (file:// không fetch được md).
// Chạy lại sau khi sửa md: node scripts/sinh_so_do_node.mjs
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";

const GOC = path.resolve(import.meta.dirname, "..");
const HTM = path.join(GOC, "so_do", "so_do_quy_trinh_node.htm");
const md = {};
const nap = (dir, loc = () => true) => {
  for (const f of readdirSync(path.join(GOC, dir))) if (f.endsWith(".md") && loc(f)) md[`${dir}/${f}`] = readFileSync(path.join(GOC, dir, f), "utf8");
};
nap("skills"); nap("knowledge"); nap("knowledge/dinh-nghia"); nap("memory"); nap(".claude/agents", (f) => f.startsWith("pccc-"));
const json = JSON.stringify(md).replace(/</g, "\u003c"); // không để lọt "</script>"
const s = readFileSync(HTM, "utf8");
const a = s.indexOf("<!--MD-->"), b = s.indexOf("<!--/MD-->");
if (a < 0 || b < 0) throw new Error("thiếu mốc <!--MD--> trong " + HTM);
writeFileSync(HTM, s.slice(0, a) + `<!--MD--><script id="md" type="application/json">${json}</script>` + s.slice(b));
console.log(`Đã nhúng ${Object.keys(md).length} file md (${Math.round(json.length / 1024)} KB).`);
