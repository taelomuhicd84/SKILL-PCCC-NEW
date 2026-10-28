// Sinh .claude/agents/pccc-*.md và .claude/skills/pccc-*/SKILL.md từ shared/src/agents.ts (không sửa tay các file sinh ra).
// Chạy: npm run gen:claude
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { AGENTS, QUY_TAC } from "../src";

const GOC = path.resolve(import.meta.dirname, "../..");
const SINH = "<!-- Sinh tự động từ shared/src/agents.ts bằng `npm run gen:claude`. Không sửa tay. -->";

for (const a of AGENTS) {
  const ten = `pccc-${a.id}`;
  const skillDir = path.join(GOC, ".claude", "skills", ten);
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(path.join(skillDir, "SKILL.md"), `---
name: ${ten}
description: Thẩm định PCCC – ${a.ten}. ${a.viec}${a.bang_he_thong ? " Bảng hệ thống: " + a.bang_he_thong.join(", ") + "." : ""}
---
${SINH}
# ${a.ten}
**Việc:** ${a.viec}
${a.luu_y ? `**Lưu ý:** ${a.luu_y}\n` : ""}${a.bang_he_thong ? `**Bảng hệ thống đi kèm:** ${a.bang_he_thong.join(", ")} (data/bang/<mã>.json; đọc cột quy_dinh).\n` : ""}
## Tri thức (nguyên văn điều khoản – chỉ mở file cần cho dòng đang xét)
${a.tri_thuc.length ? a.tri_thuc.map((f) => `- \`${f}\``).join("\n") : "- Không có module riêng: dùng cột \"Quy định\" của bảng đối chiếu chính thức."}
- Điều khoản chưa nạp (vd. nghị định về diện thẩm duyệt, TCVN 7336, TCVN 13456): dùng cột "Quy định" của dòng bảng; không có thì CAN_XAC_NHAN.

${QUY_TAC}

## Quy trình chung
Xem \`skills/SKILL_quy_trinh_tham_dinh.md\` (8 giai đoạn) và \`knowledge/truong-thong-tin.md\` (trường A/B/C, quy tắc suy ra Y01–Y24).
`, "utf8");

  mkdirSync(path.join(GOC, ".claude", "agents"), { recursive: true });
  writeFileSync(path.join(GOC, ".claude", "agents", `${ten}.md`), `---
name: ${ten}
description: Agent thẩm định PCCC – ${a.ten}. Dùng khi lệnh /tham-dinh giao một job ${a.id} (file prompt jobs/<id>.md) hoặc khi cần xét riêng hạng mục này.
tools: ${a.tools ?? "Read, Grep, Glob, Write"}
model: ${a.model ?? "sonnet"}
---
${SINH}
Bạn là cán bộ thẩm duyệt thiết kế PCCC, phụ trách: **${a.ten}**.
1. Đọc \`.claude/skills/${ten}/SKILL.md\` (nguyên tắc, tri thức của hạng mục).
2. Đọc file prompt được giao (vd. \`ket_qua/<du_an>/jobs/<job>.md\`): thông tin công trình, đường dẫn bản vẽ và chữ có vị trí, các dòng bảng đối chiếu cần xét, định dạng trả lời.
3. Mở bản vẽ (Read PDF với pages, tối đa 20 trang/lần) và chữ có vị trí (Grep trong thư mục chu/) chỉ ở các trang cần.
4. Ghi câu trả lời (đúng một đối tượng JSON theo định dạng trong prompt) vào file kết quả được giao (vd. \`ket_qua/<du_an>/jobs/<job>.json\`). Trả lời ngắn: số dòng đã xét và số dòng CHUA_DAT / CAN_XAC_NHAN.
Không sửa file nào khác.
`, "utf8");
}
console.log(`Đã sinh ${AGENTS.length} agent và ${AGENTS.length} skill trong .claude/`);
