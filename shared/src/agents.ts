// Cấu hình agent theo hạng mục. Đây là nguồn duy nhất: prompt cho Gemini, file .claude/agents và .claude/skills
// (shared/scripts/gen_claude.ts) đều sinh từ đây. Thêm quy chuẩn mới: thêm đường dẫn file vào `tri_thuc`.
export interface AgentDef {
  id: string;            // tên agent Claude Code: pccc-<id>
  ten: string;
  viec: string;          // mô tả ngắn việc cần xét
  tu_khoa?: RegExp;      // khớp tiêu đề mục lớn của bảng công năng
  bang_he_thong?: string[]; // bảng hệ thống đi kèm (B34–B50)
  tri_thuc: string[];    // file nguyên văn điều khoản (đường dẫn từ gốc repo)
  luu_y?: string;        // điều phải nhớ riêng của hạng mục
}

const DN = "knowledge/dinh-nghia/dinh-nghia.md";
const TT = "knowledge/truong-thong-tin.md";
const BH = "knowledge/bai-hoc.md"; // bài học đã xác nhận: mọi agent hạng mục đọc

export const AGENTS: AgentDef[] = [
  { id: "doc-ho-so", ten: "Đọc hồ sơ, lập thông tin công trình", viec: "Đọc toàn bộ bản vẽ, điền các trường A01–A10, B01–B08, C01–C12 và cờ hệ thống PCCC; phân loại từng trang.",
    tri_thuc: [TT, DN] },
  { id: "m01-phan-loai", ten: "Mục 1 – Phân loại, diện thẩm duyệt", viec: "Diện thẩm duyệt và phân cấp; số tầng, tầng hầm; chiều cao PCCC; nhóm nhà F; cấp nguy hiểm cháy kết cấu; hạng nguy hiểm cháy nổ.",
    tu_khoa: /chiều cao an toàn|số tầng|nhóm nhà|phân loại|đối tượng thuộc diện/i, tri_thuc: [BH, DN, TT],
    luu_y: "Diện thẩm duyệt: bảng mẫu dẫn NĐ 136/2020; nếu chưa có văn bản hiện hành trong tri thức thì kết luận theo cột Quy định của bảng và ghi rõ nguồn." },
  { id: "m02-bac-chiu-lua", ten: "Mục 2 – Bậc chịu lửa", viec: "Bậc chịu lửa yêu cầu và giới hạn chịu lửa cấu kiện (Bảng 2, 4, Phụ lục H).", tu_khoa: /bậc chịu lửa/i, tri_thuc: [BH, DN] },
  { id: "m03-khoang-cach", ten: "Mục 3 – Khoảng cách an toàn PCCC", viec: "Khoảng cách tới công trình lân cận (Bảng E1, Phụ lục E).", tu_khoa: /khoảng cách an toàn/i, tri_thuc: [BH, DN] },
  { id: "m04-giao-thong", ten: "Mục 4 – Đường, bãi đỗ xe chữa cháy, lối vào từ trên cao", viec: "Đường xe chữa cháy (rộng, cao, tải trọng, bán kính quay), bãi đỗ, lối vào từ trên cao, họng tiếp nước.",
    tu_khoa: /đường giao thông|xe chữa cháy|bãi đỗ|lối vào/i, tri_thuc: [BH, DN] },
  { id: "m05-cong-nang", ten: "Mục 5 – Bố trí công năng", viec: "Vị trí các công năng, phòng nguy hiểm cháy, tầng hầm, phòng kỹ thuật.", tu_khoa: /bố trí công năng/i,
    tri_thuc: [BH, "skills/SKILL_ngan_chay_cong_nang.md", DN] },
  { id: "m06-ngan-chay", ten: "Mục 6 – Ngăn cháy, chống cháy lan", viec: "Ngăn cháy ngang, đứng, theo công năng, hành lang; vật liệu; cửa, tường, sàn ngăn cháy; tỉ lệ cửa/tường.",
    tu_khoa: /ngăn cháy|chống cháy lan/i,
    tri_thuc: [BH, "skills/SKILL_ngan_chay_cong_nang.md", "skills/MOD_hanh_lang_bao_che.md", "skills/MOD_vat_lieu_hoan_thien.md", DN] },
  { id: "m07-thoat-nan", ten: "Mục 7 – Lối, đường thoát nạn", viec: "Lối ra, số lối, phân tán, cửa, chiều rộng, khoảng cách (Bảng G), đường thoát nạn, hành lang, cầu thang, buồng thang, lối lên mái.",
    tu_khoa: /lối.*thoát nạn|giải pháp thoát nạn|^thoát nạn/i,
    tri_thuc: [BH, "skills/SKILL_thoat_nan.md", "skills/MOD_loi_ra_va_cua.md", "skills/MOD_so_luong_loi_ra.md", "skills/MOD_tinh_toan_khoang_cach.md",
      "skills/PHU_LUC_G_QCVN06.md", "skills/MOD_hanh_lang_bao_che.md", "skills/MOD_cau_thang_buong_thang.md", "skills/MOD_hinh_Phu_luc_I_cau_thang.md",
      "skills/MOD_vat_lieu_hoan_thien.md", "memory/pccc-escape-route-method.md", DN],
    luu_y: "Số đo trên bản vẽ là ước lượng ±1–2 m: ghi rõ 'ước lượng'. Khoảng cách và phân tán đo theo Phụ lục G và Hình I." },
  { id: "m08-thang-may-cc", ten: "Mục 8 – Thang máy chữa cháy", viec: "Đối tượng phải có, số lượng, sảnh, giếng, nguồn điện thang máy chữa cháy.",
    tu_khoa: /thang máy/i, bang_he_thong: ["B50"], tri_thuc: [BH, DN] },
  { id: "m09-chong-khoi", ten: "Mục 9 – Chống tụ khói", viec: "Hút xả khói, tăng áp, thoát khói tự nhiên (Phụ lục D).", tu_khoa: /tụ khói|hút khói|tăng áp/i,
    bang_he_thong: ["B34"], tri_thuc: [BH, "skills/MOD_chong_khoi_PL_D.md", DN] },
  { id: "m10-binh-chua-chay", ten: "Mục 10 – Bình chữa cháy, phương tiện ban đầu", viec: "Loại, số lượng, khoảng cách bố trí bình chữa cháy.",
    tu_khoa: /bình chữa cháy|chữa cháy ban đầu/i, bang_he_thong: ["B45"], tri_thuc: [BH] },
  { id: "m11-bao-chay", ten: "Mục 11 – Báo cháy", viec: "Đối tượng phải trang bị, loại đầu báo, bố trí, tủ trung tâm, liên động.", tu_khoa: /báo cháy/i,
    bang_he_thong: ["B35"], tri_thuc: [BH] },
  { id: "m12-chua-chay", ten: "Mục 12 – Chữa cháy (sprinkler, họng nước, ngoài nhà, trạm bơm, khí, bọt)", viec: "Đối tượng phải trang bị, lưu lượng, áp lực, bố trí, nguồn nước, trạm bơm.",
    tu_khoa: /hệ thống chữa cháy|chữa cháy tự động|họng nước|cấp nước chữa cháy/i,
    bang_he_thong: ["B36", "B37", "B38", "B39", "B40", "B41", "B42", "B43", "B44"], tri_thuc: [BH] },
  { id: "m13-cap-dien", ten: "Mục 13 – Cấp điện cho hệ thống PCCC", viec: "Nguồn ưu tiên, nguồn dự phòng, cáp chịu lửa, ATS.", tu_khoa: /cấp điện|nguồn điện/i,
    bang_he_thong: ["B48"], tri_thuc: [BH] },
  { id: "m14-den-su-co", ten: "Mục 14 – Chiếu sáng sự cố, chỉ dẫn thoát nạn, loa", viec: "Độ rọi, vị trí đèn EXIT/EM, thời gian duy trì, loa thông báo.",
    tu_khoa: /chiếu sáng sự cố|chỉ dẫn thoát nạn|loa/i, bang_he_thong: ["B46"], tri_thuc: [BH, "skills/SKILL_thoat_nan.md"] },
  { id: "m15-cnch", ten: "Mục 15 – Dụng cụ phá dỡ, phương tiện bảo hộ, cứu nạn", viec: "Dụng cụ phá dỡ thông thường, mặt nạ, phương tiện cơ giới.",
    tu_khoa: /phá dỡ|bảo hộ|cứu nạn|CNCH|mặt nạ|cơ giới/i, tri_thuc: [BH] },
  { id: "m16-chong-set", ten: "Mục 16 – Chống sét", viec: "Phương án chống sét theo TCVN 9385.", tu_khoa: /chống sét/i, bang_he_thong: ["B49"], tri_thuc: [BH] },
  { id: "m17-lien-lac", ten: "Mục 17 – Liên lạc", viec: "Hệ thống liên lạc, điện thoại phòng trực.", tu_khoa: /liên lạc/i, tri_thuc: [BH] },
  { id: "m18-quang-cao", ten: "Mục 18 – Biển quảng cáo", viec: "Biển quảng cáo không che lối thoát nạn, ô cửa cứu nạn (QCVN 17:2018).", tu_khoa: /quảng cáo/i, tri_thuc: [BH] },
  { id: "chung", ten: "Hạng mục khác", viec: "Đối chiếu các dòng không thuộc hạng mục riêng (công trình đặc thù, xăng dầu, khí, tàu…).", tri_thuc: [BH, DN] },
  { id: "ra-soat", ten: "Rà soát chéo", viec: "Tìm số liệu lệch giữa các dòng, kết luận mâu thuẫn, dòng thiếu nguồn hoặc thiếu điều khoản; chỉ trả về các dòng cần sửa.",
    tri_thuc: [BH, "skills/SKILL_thoat_nan.md"] },
];

export const agentById = (id: string) => AGENTS.find((a) => a.id === id) ?? AGENTS.find((a) => a.id === "chung")!;

/** Agent hệ thống ứng với một bảng hệ thống, vd. B35 → m11-bao-chay. */
export const agentChoBangHeThong = (ma: string) => AGENTS.find((a) => a.bang_he_thong?.includes(ma)) ?? agentById("chung");

/** Agent cho một mục lớn theo tiêu đề. Thứ tự: mục cụ thể trước, m12 sau m10/m11 để 'chữa cháy ban đầu' không rơi vào m12. */
export function agentChoMuc(tieuDe: string): AgentDef {
  for (const a of AGENTS) if (a.tu_khoa && a.tu_khoa.test(tieuDe)) return a;
  return agentById("chung");
}
