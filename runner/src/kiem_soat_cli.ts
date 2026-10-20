// Kiểm soát lại mọi ghi chú tự học bằng quy tắc (không tốn hạn mức): npx tsx runner/src/kiem_soat_cli.ts
import { kiemLaiBangQuyTac, lietKe } from "./hoc";
import { tomTatVanDe } from "./kiem_soat";

const tat = lietKe();
const loi = kiemLaiBangQuyTac();
console.log(`${tat.length} ghi chú, ${loi.length} có vấn đề theo quy tắc thuật ngữ/số hiệu/hiệu lực.\n`);
for (const g of loi) console.log(`## ${g.id} ${g.tieu_de}\n${g.van_de.map((v, i) => `  ${i + 1}) [${v.loai}] "${v.trich}"${v.dung ? " → " + v.dung : ""} — ${v.ly_do}`).join("\n")}\n`);
