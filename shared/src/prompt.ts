// Dựng prompt cho từng agent. Hai chế độ:
//  - "tep": agent tự đọc file (Claude Code): chỉ ghi đường dẫn tri thức, bản vẽ, chữ có vị trí.
//  - "kem": dán sẵn tri thức vào ngữ cảnh (Gemini, copy-paste): kb[path] phải có nội dung.
import type { Job } from "./chia_muc";
import { agentById } from "./agents";
import { HE_THONG, type KetQuaDong, type ThongTin } from "./schema";

export interface PromptCtx {
  che_do: "tep" | "kem";
  thong_tin: ThongTin | null;
  so_trang: number;
  huong_dan: boolean;
  kb?: Record<string, string>;
  tep?: { pdf: string; chu_dir: string }; // đường dẫn (chế độ "tep")
}

export const QUY_TAC = `## Nguyên tắc (bắt buộc)
1. Kết luận mỗi dòng chỉ nhận: DAT · CHUA_DAT · CAN_XAC_NHAN · KHONG_AP_DUNG, kèm lý do có số liệu ngay tại dòng và trích khoản, điều.
2. Thiếu dữ liệu trên bản vẽ, bản vẽ mâu thuẫn, hoặc quy chuẩn chưa có trong tri thức được cung cấp → CAN_XAC_NHAN, nói rõ thiếu gì. Không đoán thành DAT hay CHUA_DAT.
3. Không bịa trị số quy chuẩn: chỉ dùng tri thức được cung cấp và cột "Quy định" của bảng đối chiếu chính thức; không có thì ghi "cần tra".
4. Sai sót cụ thể trên bản vẽ đã rõ cách sửa (ghi nhầm ký hiệu như D1 thay FD1, số liệu lệch nhau, phép tính sai, thiếu ghi chú bắt buộc như chiều cao PCCC) → ghi vào "chinh_ban_ve" một câu: sai gì, sửa thành gì. KHÔNG đổi kết luận của thiết kế. Không dùng "chinh_ban_ve" cho gợi ý chung ("nên ghi rõ", "nên bổ sung thuyết minh") – thiếu dữ liệu để kết luận thì là CAN_XAC_NHAN.
5. Dòng CHUA_DAT, CAN_XAC_NHAN hoặc có chinh_ban_ve: ghi "vi_tri" (trang và chữ bám "anchor" có thật trên trang, hoặc bbox 0–1000) để khoanh khung trên bản vẽ.
6. Dòng tiêu đề mục (không có nội dung cần xét) vẫn trả về với ket_luan KHONG_AP_DUNG và ly_do "dòng tiêu đề".
7. Số đo trên bản vẽ là ước lượng ±1–2 m nếu không có kích thước ghi: ghi chữ "ước lượng".
8. Bản vẽ đã thể hiện đủ (ký hiệu cửa, GHCL, chiều mở, kích thước) thì phải kết luận DAT hoặc CHUA_DAT; không né sang CAN_XAC_NHAN. Đọc knowledge/bai-hoc.md trước khi kết luận.`;

const DINH_DANG = (huongDan: boolean) => `## Định dạng trả lời
Chỉ trả về MỘT khối \`\`\`json, không viết gì ngoài khối đó:
{"dong":[{"bang":"B15","idx":90,"tt":"7.2.3","noi_dung_thiet_ke":"thiết kế có gì (số liệu, trang)","ket_luan":"DAT|CHUA_DAT|CAN_XAC_NHAN|KHONG_AP_DUNG","ly_do":"lý do có số","dieu_khoan":"Đ 3.2.8 QCVN 06:2022/SĐ1:2023","chinh_ban_ve":"(nếu có)","nguon":[{"trang":12,"ghi_chu":"mặt bằng tầng 1"}],"vi_tri":[{"trang":12,"anchor":"D3"}]${huongDan ? ',"huong_dan":"cách thiết kế cho đạt: giải pháp cụ thể, trị số yêu cầu, điều khoản"' : ""}}],"ghi_chu":"điều cần lưu ý chung (nếu có)"}
Trả về đủ MỌI dòng được giao (theo "idx"), đúng thứ tự.${huongDan ? "\nHướng dẫn thiết kế đang BẬT: mọi dòng CHUA_DAT, CAN_XAC_NHAN, có chinh_ban_ve, và các dòng yêu cầu chính (dù DAT) phải có \"huong_dan\" viết cho người thiết kế." : ""}`;

const cat = (s: string, n: number) => (s.length > n ? s.slice(0, n) + "…" : s);

function phanThongTin(tt: ThongTin | null): string {
  if (!tt) return "## Thông tin công trình\n(chưa có)";
  const ht = Object.entries(tt.he_thong ?? {})
    .map(([k, v]) => `${HE_THONG[k as keyof typeof HE_THONG] ?? k}: ${v === true ? "có" : v === false ? "không" : "chưa rõ"}`).join("; ");
  const truong = Object.entries(tt.truong ?? {})
    .map(([k, t]) => `- ${k}: ${t.gia_tri ?? "—"} [${t.trang_thai}${t.nguon ? "; " + t.nguon : ""}]`).join("\n");
  const trang = (tt.trang ?? []).map((p) => `${p.trang}: ${p.loai}${p.tieu_de ? " – " + p.tieu_de : ""}`).join("; ");
  return `## Thông tin công trình (GĐ1, đã qua người dùng rà)
Tên: ${tt.ten_cong_trinh} · Công năng: ${tt.cong_nang} · Địa điểm: ${tt.dia_diem}
${truong}
Hệ thống PCCC: ${ht || "chưa rõ"}
Phân loại trang: ${trang || "chưa có"}`;
}

function phanTriThuc(ctx: PromptCtx, files: string[]): string {
  if (!files.length) return "## Tri thức\nKhông có module riêng: dùng cột \"Quy định\" của bảng đối chiếu (đã trích sẵn điều khoản) làm căn cứ, ghi nguồn \"bảng đối chiếu chính thức\".";
  if (ctx.che_do === "tep")
    return `## Tri thức (đọc bằng Read, chỉ đọc file cần cho dòng đang xét)\n${files.map((f) => "- " + f).join("\n")}\nNếu cột "Tra ở" ghi "chưa nạp", dùng cột "Quy định" của chính dòng đó.`;
  return "## Tri thức\n" + files.map((f) => `### ${f}\n${ctx.kb?.[f] ?? "(không tải được)"}`).join("\n\n");
}

function phanBanVe(ctx: PromptCtx): string {
  if (ctx.che_do === "tep" && ctx.tep)
    return `## Bản vẽ
- PDF: ${ctx.tep.pdf} (${ctx.so_trang} trang). Đọc bằng Read với tham số pages (tối đa 20 trang mỗi lần); chỉ mở trang cần (xem phân loại trang).
- Chữ có vị trí: ${ctx.tep.chu_dir}/trang_<n>.txt, mỗi dòng "x y chữ" (toạ độ 0–1000, gốc trên-trái). Dùng Grep để tìm ký hiệu (cửa D3, FD1, tên phòng, cao độ) và lấy "anchor".`;
  return `## Bản vẽ\nFile PDF đính kèm (${ctx.so_trang} trang). "anchor" phải là chữ xuất hiện đúng trên trang đó.`;
}

function bangDong(job: Job): string {
  const rows = job.dong.map((d) =>
    `#${d.idx} | TT ${d.tt || "-"} | ${cat(d.noi_dung, 300)}\n   Gợi ý đọc bản vẽ: ${cat(d.goi_y, 300) || "-"}\n   Quy định: ${cat(d.quy_dinh, 1500) || "-"}\n   Khoản, Điều: ${d.khoan_dieu || "-"} | Tra ở: ${d.tra_o || "-"}`);
  return `## Các dòng cần xét – bảng ${job.bang}, mục "${cat(job.muc, 120)}" (${job.dong.length} dòng)\n${rows.join("\n")}`;
}

export function promptJob(ctx: PromptCtx, job: Job): string {
  const a = agentById(job.agent);
  return [
    `# Agent ${a.ten}\nBạn là cán bộ thẩm duyệt thiết kế PCCC. Việc: ${a.viec}${a.luu_y ? "\nLưu ý: " + a.luu_y : ""}`,
    QUY_TAC, phanThongTin(ctx.thong_tin), phanBanVe(ctx), phanTriThuc(ctx, a.tri_thuc), bangDong(job), DINH_DANG(ctx.huong_dan),
  ].join("\n\n");
}

export function promptDocHoSo(ctx: PromptCtx, goiYBang: string[] = []): string {
  const a = agentById("doc-ho-so");
  return [
    `# Agent ${a.ten}\nBạn là cán bộ thẩm duyệt thiết kế PCCC. Việc: ${a.viec}`,
    `## Nguyên tắc\n- Mỗi trường ghi giá trị, nguồn (trang, bảng, ghi chú) và trạng thái: doc (đọc thẳng) · do (đo, ước lượng) · suy (suy từ trường khác, ghi công thức) · tam (tạm tính) · thieu (không có trên bản vẽ).\n- Không đoán: không thấy thì trạng thái "thieu" và thêm câu hỏi vào "cau_hoi".\n- Số tầng, chiều cao PCCC theo định nghĩa 1.4.9, 1.4.50, 1.4.57 QCVN 06 (chiều cao PCCC là số, đơn vị m).`,
    phanBanVe(ctx), phanTriThuc(ctx, a.tri_thuc),
    goiYBang.length ? `## Gợi ý của bảng đối chiếu (những thứ phải tìm trên bản vẽ)\n${goiYBang.map((g) => "- " + cat(g, 200)).join("\n")}` : "",
    `## Định dạng trả lời
Chỉ trả về MỘT khối \`\`\`json:
{"ten_cong_trinh":"","dia_diem":"","chu_dau_tu":"","don_vi_thiet_ke":"","cong_nang":"vd. karaoke / chung cư / văn phòng / nhà xưởng",
 "truong":{"A01":{"gia_tri":"F2.1 karaoke","nguon":"trang 3, bảng thống kê","trang_thai":"doc"},"A03":{"gia_tri":7.6,"nguon":"mặt đứng trang 14","trang_thai":"doc"}},
 "he_thong":{${Object.keys(HE_THONG).map((k) => `"${k}":true|false|null`).join(",")}},
 "trang":[{"trang":1,"loai":"bìa|thuyết minh|mặt bằng|mặt cắt|mặt đứng|bảng thống kê|báo cháy|chữa cháy|hút khói|điện|EX-EM|khác","tieu_de":"tên bản vẽ"}],
 "cau_hoi":["điều chưa rõ cần người dùng xác nhận"]}
Điền đủ các trường A01–A10, B01–B08, C01–C12 trong knowledge/truong-thong-tin.md (trường nào không có thì trang_thai "thieu"). Phân loại MỌI trang.`,
  ].filter(Boolean).join("\n\n");
}

export function promptRaSoat(ctx: PromptCtx, ketQua: KetQuaDong[]): string {
  const tom = ketQua.map((k) => `${k.bang}#${k.idx} ${k.tt} | ${k.ket_luan} | ${cat(k.noi_dung_thiet_ke, 160)} | ${cat(k.ly_do, 220)} | ${k.dieu_khoan}`).join("\n");
  return [
    `# Agent Rà soát chéo\nBạn là cán bộ thẩm duyệt PCCC rà lại kết quả của các agent hạng mục.`,
    QUY_TAC, phanThongTin(ctx.thong_tin),
    `## Kết quả cần rà (bang#idx tt | kết luận | thiết kế | lý do | điều)\n${tom}`,
    `## Việc
Tìm: cùng một số liệu nhưng các dòng ghi khác nhau; kết luận mâu thuẫn nhau; DAT/CHUA_DAT nhưng lý do không có số hoặc không có điều khoản; dòng kết luận vượt quá tri thức (nên là CAN_XAC_NHAN).
Chỉ trả về các dòng CẦN SỬA, đầy đủ trường như định dạng dưới (bản đã sửa). Không có gì cần sửa thì {"dong":[]}.`,
    DINH_DANG(false),
  ].join("\n\n");
}
