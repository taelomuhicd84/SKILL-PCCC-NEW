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
  trang_lq?: string; // chữ các trang liên quan đã nhúng sẵn (chế độ "tep")
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

const DINH_DANG = `## Định dạng trả lời
Chỉ trả về MỘT khối \`\`\`json, không viết gì ngoài khối đó:
{"dong":[{"bang":"A12","idx":90,"tt":"7.2.3","noi_dung_thiet_ke":"thiết kế có gì (số liệu, trang)","ket_luan":"DAT|CHUA_DAT|CAN_XAC_NHAN|KHONG_AP_DUNG","ly_do":"lý do có số","dieu_khoan":"Đ 3.2.8 QCVN 06:2022/SĐ1:2023","chinh_ban_ve":"(nếu có)","nguon":[{"trang":12,"ghi_chu":"mặt bằng tầng 1"}],"vi_tri":[{"trang":12,"anchor":"D3"}]}],"ghi_chu":"điều cần lưu ý chung (nếu có)"}
Trả về đủ MỌI dòng được giao (theo "idx"), đúng thứ tự.`;

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
- Chữ có vị trí: ${ctx.tep.chu_dir}/trang_<n>.txt, mỗi dòng "x y chữ" (toạ độ 0–1000, gốc trên-trái). Dùng Grep để tìm ký hiệu (cửa D3, FD1, tên phòng, cao độ) và lấy "anchor".
- Ảnh trang: ${ctx.tep.chu_dir.replace(/chu$/, "anh")}/trang_<n>.png (nếu thư mục có). Máy không có pdftoppm nên Read PDF có thể lỗi: mở ảnh PNG bằng Read. BẮT BUỘC mở ảnh trước khi kết luận CHƯA ĐẠT dựa vào vị trí, hướng mở hay ký hiệu của cửa, thang, đầu phun, đèn hoặc số đo trên mặt bằng; chữ có vị trí chỉ cho biết tọa độ nhãn, không cho biết nhãn thuộc vật nào. Thiếu ảnh thì ghi CAN_XAC_NHAN.${ctx.trang_lq ? `

## Chữ các trang liên quan (đã nhúng sẵn, KHÔNG cần Read hay Grep lại các trang này; chỉ mở thêm khi thiếu số liệu)
${ctx.trang_lq}` : ""}`;
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
    QUY_TAC, phanThongTin(ctx.thong_tin), phanBanVe(ctx), phanTriThuc(ctx, a.tri_thuc), bangDong(job), DINH_DANG,
  ].join("\n\n");
}

export function promptDocHoSo(ctx: PromptCtx, goiYBang: string[] = []): string {
  const a = agentById("doc-ho-so");
  return [
    `# Agent ${a.ten}\nBạn là cán bộ thẩm duyệt thiết kế PCCC. Việc: ${a.viec}`,
    `## Nguyên tắc\n- Mỗi trường ghi giá trị, nguồn (trang, bảng, ghi chú) và trạng thái: doc (đọc thẳng) · do (đo, ước lượng) · suy (suy từ trường khác, ghi công thức) · tam (tạm tính) · thieu (không có trên bản vẽ).\n- Không đoán: không thấy thì trạng thái "thieu" và thêm câu hỏi vào "cau_hoi".\n- Số tầng, chiều cao PCCC theo định nghĩa 1.4.9, 1.4.50, 1.4.57 QCVN 06 (chiều cao PCCC là số, đơn vị m).\n- BẮT BUỘC mở bằng Read ảnh PNG của TỪNG trang (thư mục anh/ cạnh chu/) trước khi điền hoặc ghi "thieu"; chữ trích chỉ là phụ. Bản vẽ hình, bảng thống kê, bảng ảnh (vd. mặt bằng giao thông, bảng bãi đỗ xe chữa cháy, bảng thông tin công trình) thường không có trong chữ trích. Không được báo "không đọc được ảnh" khi thư mục anh/ có file; ảnh nhỏ thì xem lại từng vùng. Số liệu đọc từ bảng/hình ghi trạng thái "doc" hoặc "do" kèm trang.`,
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
    DINH_DANG,
  ].join("\n\n");
}

export function promptHuongDan(ctx: PromptCtx, ketQua: KetQuaDong[]): string {
  const a = agentById("huong-dan");
  const rows = ketQua.map((k) => `${k.bang}#${k.idx} TT ${k.tt || "-"} | ${k.ket_luan}\n   Thiết kế: ${cat(k.noi_dung_thiet_ke, 300)}\n   Lý do: ${cat(k.ly_do, 400)}\n   Điều: ${k.dieu_khoan || "-"}${k.chinh_ban_ve ? "\n   Chỉnh bản vẽ: " + cat(k.chinh_ban_ve, 200) : ""}`);
  return [
    `# Agent ${a.ten}\nBạn là cán bộ thẩm duyệt PCCC viết hướng dẫn cho người thiết kế để hồ sơ đạt khi nộp lại. Việc: ${a.viec}`,
    `## Nguyên tắc
1. Mỗi dòng một đoạn 1–4 câu, viết việc phải LÀM, không lặp lại lý do: "Bổ sung/Sửa: <việc cụ thể trên bản vẽ, ở trang/tầng/khu vực nào>. Yêu cầu: <trị số tối thiểu hoặc điều kiện> (<điều khoản>)."
2. Bản vẽ thiếu đường thoát nạn: chỉ vẽ tuyến từ điểm xa nhất tới lối ra thoát nạn, ghi chiều dài, đối chiếu giới hạn khoảng cách Phụ lục G QCVN 06 (skills/PHU_LUC_G_QCVN06.md).
3. Bản vẽ thiếu bề rộng thoát nạn: ghi kích thước thông thủy cửa, hành lang, thang; nêu bề rộng tối thiểu và cách tính (số người thoát × chỉ tiêu) theo skills/SKILL_thoat_nan.md, skills/MOD_loi_ra_va_cua.md.
4. Thiếu ghi chú, ký hiệu, số liệu (chiều cao PCCC, GHCL cửa, vật liệu, loại đèn…): nói rõ ghi gì và ghi ở bản vẽ nào.
5. Chỉ dùng trị số có trong tri thức hoặc cột "Điều"; chưa có thì ghi "cần tra <văn bản>", không bịa. Không đổi kết luận. Dòng không có cách hướng dẫn cụ thể thì bỏ qua, không viết cho đủ số.`,
    phanThongTin(ctx.thong_tin), phanBanVe(ctx), phanTriThuc(ctx, a.tri_thuc),
    `## Các dòng cần hướng dẫn (bang#idx tt | kết luận)\n${rows.join("\n")}`,
    `## Định dạng trả lời\nChỉ trả về MỘT khối \`\`\`json, không viết gì ngoài khối đó:\n{"dong":[{"bang":"A12","idx":90,"huong_dan":"Bổ sung: … Yêu cầu: … (Đ …)"}]}`,
  ].join("\n\n");
}


/** Khi người dùng tích "Khoanh đề xuất": bot trả thêm MỘT khối json các mục chưa đạt và vị trí đề xuất thang thoát nạn / thang máy chữa cháy. */
const PHAN_KHOANH = [
  "## Khoanh đề xuất trên bản vẽ (người dùng đã bật)",
  "Xem bản vẽ, liệt kê các mục CHƯA ĐẠT hoặc còn thiếu so với quy chuẩn (số lối thoát nạn, buồng thang thoát nạn, thang máy chữa cháy, bãi đỗ xe chữa cháy, bề rộng, khoảng cách...). Với mục thiếu thang thoát nạn hoặc thang máy chữa cháy: nhìn vào KHOẢNG TRỐNG của mặt bằng (lô đất, sân, hành lang rộng, góc nhà) để đề xuất vị trí đặt, ước lượng kích thước chỗ trống (dài × rộng, m) và so với kích thước cần (buồng thang thoát nạn hai vế khoảng 3,0 × 6,0 m; giếng và sảnh thang máy chữa cháy khoảng 2,5 × 5,0 m; ghi là ước lượng), kết luận chỗ trống đủ hay không đủ.",
  "Sau phần trả lời bằng chữ, thêm đúng MỘT khối ```json dạng:",
  '{"de_xuat":[{"loai":"thang_thoat_nan|thang_may_cc|bai_do|khac","muc":"tên mục chưa đạt","ly_do":"vì sao chưa đạt, kèm số liệu","trang":1,"bbox":[x0,y0,x1,y1],"kich_thuoc_trong_m":"dài x rộng chỗ trống (ước lượng)","kich_thuoc_can_m":"dài x rộng cần","du":true}]}',
  '"bbox" là khung quanh VỊ TRÍ đề xuất (hoặc chỗ thiếu), toạ độ 0–1000 theo trang đứng (gốc góc trên trái); "du" là true, false hoặc null (chưa rõ). Không có mục chưa đạt thì "de_xuat":[].',
].join("\n");

/** Chat với agent Sơ bộ thiết kế PCCC (mục 7): trả lời văn bản tiếng Việt, không phải JSON. */
export interface LuotChat { vai: "nguoi" | "bot"; nd: string }
export function promptChat(ctx: PromptCtx, lichSu: LuotChat[], cau: string, khoanh = false, agentId = "so-bo-thiet-ke", dauVao = ""): string {
  const a = agentById(agentId);
  const ls = lichSu.slice(-8).map((l) => `${l.vai === "nguoi" ? "Người dùng" : "Trợ lý"}: ${cat(l.nd, 1500)}`).join("\n");
  const cachTraLoi = [
    "## Cách trả lời",
    "- Tiếng Việt, ngắn gọn, đi thẳng vào đáp án, rồi căn cứ (điều, bảng) và phép tính từng bước.",
    "- Ghi rõ giả định và dữ liệu còn thiếu; không bịa trị số quy chuẩn: chỉ dùng tri thức bên dưới.",
    "- Khi người dùng nhờ thiết kế: nêu vị trí và kích thước đề xuất (bãi đỗ, làn xe, bãi quay xe, tuyến thoát nạn, lối vào từ trên cao), chiều dài từng đoạn, so với giới hạn và kết luận đạt hoặc cần xác nhận.",
    "- Không trả JSON, không dùng khối mã trừ khi cần bảng ngắn (trừ khối json khoanh đề xuất nếu người dùng bật).",
  ].join("\n");
  return [
    `# Agent ${a.ten}`, a.viec, a.luu_y ?? "", cachTraLoi,
    dauVao ? `## Thông tin đầu vào của người dùng
${dauVao}` : "",
    phanThongTin(ctx.thong_tin), phanBanVe(ctx), phanTriThuc(ctx, a.tri_thuc),
    khoanh ? PHAN_KHOANH : "",
    ls ? `## Hội thoại trước\n${ls}` : "", `## Câu hỏi hiện tại\n${cau}`,
  ].filter(Boolean).join("\n\n");
}
