// Cấu hình agent theo hạng mục. Đây là nguồn duy nhất: prompt cho Gemini, file .claude/agents và .claude/skills
// (shared/scripts/gen_claude.ts) đều sinh từ đây. Thêm quy chuẩn mới: thêm đường dẫn file vào `tri_thuc`.
export interface AgentDef {
  id: string;            // tên agent Claude Code: pccc-<id>
  ten: string;
  viec: string;          // mô tả ngắn việc cần xét
  tu_khoa?: RegExp;      // khớp tiêu đề mục lớn của bảng công năng
  bang_he_thong?: string[]; // bảng hệ thống đi kèm (B1–B11)
  tri_thuc: string[];    // file nguyên văn điều khoản (đường dẫn từ gốc repo)
  luu_y?: string;        // điều phải nhớ riêng của hạng mục
  tools?: string;        // công cụ của agent Claude Code; mặc định Read, Grep, Glob, Write
  model?: Model;         // model Claude; mặc định sonnet (đo 2026-10-21: haiku tốn gấp 2,2 lần token, chậm hơn, khớp kém hơn)
}
export type Model = "haiku" | "sonnet" | "opus";

const DN = "knowledge/dinh-nghia/dinh-nghia.md";
const TT = "knowledge/truong-thong-tin.md";
const BH = "knowledge/bai-hoc.md"; // bài học đã xác nhận: mọi agent hạng mục đọc
const PLH = "knowledge/qcvn06-phu-luc-h.md"; // QCVN 06 Phụ lục H: bậc chịu lửa, chiều cao, diện tích khoang cháy
const Q10 = "knowledge/qcvn10-2025-chung.md"; // QCVN 10:2025/BCA: thông tư, định nghĩa, yêu cầu chung (thay tiêu chuẩn trang bị cũ)
const Q10_AUTO = "knowledge/qcvn10-2025-bao-chay-chua-chay-tu-dong.md"; // mục 2.1, 2.5, Phụ lục A
const Q10_NUOC = "knowledge/qcvn10-2025-nuoc-chua-chay.md"; // mục 2.3, 2.4, Phụ lục B, C
const Q10_BINH = "knowledge/qcvn10-2025-binh-dung-cu-co-gioi.md"; // mục 2.6–2.8, Phụ lục D, E, F
const Q10_DEN = "knowledge/qcvn10-2025-den-loa.md"; // mục 2.2, Phụ lục G, H.4
const Q10_H = "knowledge/qcvn10-2025-phu-luc-h.md"; // Phụ lục H: thiết kế cấp nước ngoài nhà, họng nước, trạm bơm

const KN = (id: string) => `knowledge/hoc/khai-niem/_theo_agent/${id}.md`; // khái niệm agent tự học rút ra, riêng từng agent (runner sinh)
const GR = "knowledge/giap-ranh-khoang-cach-pccc.md"; // quy tắc giáp ranh/khoảng cách PCCC (Bài học 30): nguồn duy nhất, m03, m06, sơ bộ
const LV = "knowledge/loi-vao-tren-cao.md"; // ghi chú lối vào từ trên cao trên mặt đứng: nguồn duy nhất, m04, sơ bộ
const HOC = "knowledge/hoc/_da_duyet.md"; // tri thức agent tự học, chỉ gồm ghi chú đã duyệt (runner sinh)
const AGENTS_GOC: AgentDef[] = [
  { id: "doc-ho-so", ten: "Đọc hồ sơ, lập thông tin công trình", viec: "Đọc toàn bộ bản vẽ, điền các trường A01–A10, B01–B08, C01–C12 và cờ hệ thống PCCC; phân loại từng trang.",
    tri_thuc: [TT, DN] },
  { id: "m01-phan-loai", ten: "Mục 1 – Phân loại, diện thẩm duyệt", viec: "Diện thẩm duyệt và phân cấp; số tầng, tầng hầm; chiều cao PCCC; nhóm nhà F; cấp nguy hiểm cháy kết cấu; hạng nguy hiểm cháy nổ.",
    tu_khoa: /chiều cao an toàn|số tầng|nhóm nhà|phân loại|phân cấp|đối tượng thuộc diện|đối tượng thẩm định|quy mô/i, tri_thuc: [BH, DN, TT, PLH, Q10, "knowledge/qcvn06-dieu-7.md", "knowledge/nghi-dinh-tham-dinh-dieu-chinh.md"],
    luu_y: "Diện thẩm định theo NĐ 105/2025 (Điều 6, 9) đã sửa bởi NĐ 347/2026: xem knowledge/nghi-dinh-tham-dinh-dieu-chinh.md. Diện thẩm định theo Phụ lục III NĐ 105 (vẫn dùng sau NĐ 347); NĐ 136/2020 và NĐ 50/2024 đã hết hiệu lực, không viện dẫn. Hồ sơ điều chỉnh hoặc cải tạo: đối chiếu từng thay đổi với danh sách đóng phải thẩm định lại, chỉ xét phần điều chỉnh; ca nhập nhằng ghi CAN_XAC_NHAN." },
  { id: "m02-bac-chiu-lua", ten: "Mục 2 – Bậc chịu lửa", viec: "Bậc chịu lửa yêu cầu và giới hạn chịu lửa cấu kiện (Bảng 2, 4, Phụ lục H).", tu_khoa: /bậc chịu lửa/i, tri_thuc: [BH, DN, PLH] },
  { id: "m03-khoang-cach", ten: "Mục 3 – Khoảng cách an toàn PCCC", viec: "Khoảng cách tới công trình lân cận (Bảng E1, Phụ lục E).", tu_khoa: /khoảng cách an toàn/i, tri_thuc: [BH, DN, GR],
    luu_y: "Giáp ranh đất, khoảng cách PCCC không đủ hoặc không ghi chú: làm theo knowledge/giap-ranh-khoang-cach-pccc.md (CHUA_DAT, khoanh, hướng dẫn)" },
  { id: "m04-giao-thong", ten: "Mục 4 – Đường, bãi đỗ xe chữa cháy, lối vào từ trên cao", viec: "Đường xe chữa cháy (rộng, cao, tải trọng, bán kính quay), bãi đỗ, lối vào từ trên cao, họng tiếp nước.",
    tu_khoa: /đường giao thông|xe chữa cháy|bãi đỗ|lối vào/i, tri_thuc: [BH, DN, "knowledge/qcvn06-dieu-6.md", LV],
    luu_y: "Lối vào từ trên cao: đọc MẶT ĐỨNG và chi tiết, thiếu ký hiệu/ghi chú/kích thước thì CHUA_DAT, khoanh, hướng dẫn theo knowledge/loi-vao-tren-cao.md. Phóng to mặt bằng tổng thể, đọc cự ly mép bãi/đường đến tường từng nhà (nhãn như 2000), không chỉ lấy chữ '2-10 m' trong thuyết minh. Nhãn trong ngoặc ở tên bãi (VD '(25M X 120M)') là kích thước NHÀ; nhãn 3500 ở bãi là bề rộng bãi; nhãn giữa hai nhà hoặc rộng đường là bề rộng đường xe chữa cháy. Cho phép cộng dồn chiều dài nhiều bãi đỗ xe chữa cháy của một hạng mục (VD yêu cầu 50 m, hai bãi 25 m). Mỗi bãi phải dài ≥ 15 m và rộng ≥ 3,5 m, bãi ngắn hơn 15 m không được tính vào tổng. LUÔN đọc hết và lấy hết thông tin từ bảng thống kê hạng mục chính/phụ trợ trên bản mặt bằng tổng thể (trang đầu, bản trệt/tầng 1/cải tạo): chiều cao PCCC (khác chiều cao mái), nhóm nhà, hạng, số tầng, khối tích, bậc chịu lửa; cự ly bãi–tường lấy giới hạn theo chiều cao PCCC (< 12 m: 5 m; 12–28 m: 8 m); số liệu lệch giữa các bảng thì ghi chỉnh bản vẽ; đọc TOÀN BỘ các trang trước khi kết luận thiếu. Bản vẽ không ghi cự ly bãi/đường đến tường từng nhà: kết luận CAN_XAC_NHAN, ghi vào ly_do và vi_tri (khoanh trên bản vẽ), và viết hướng dẫn thiết kế trong chinh_ban_ve (ghi dim cự ly từ mép bãi đến tường từng nhà, yêu cầu <= 5 m nhà dưới 12 m, <= 8 m nhà 12-28 m, Đ 6.2.2.3). Cự ly thường ghi bằng nhãn nhỏ cạnh bãi (VD 2000 = 2 m, 5385 = đoạn chéo góc nhà đến góc bãi): phóng to đọc hết trước khi nói bản vẽ không ghi; nhãn ngoặc ở tên bãi đối chiếu với dim cạnh hình để biết là nhà hay bãi (Bài học 15). Phân loại nhà xưởng hay nhà phố, bãi và đường nằm TRONG công trình hay NGOÀI đường lộ: chỉ đường trong công trình mới xét đường cụt/bãi quay xe và đoạn tránh xe; ngoài đường lộ công cộng thì KHONG_AP_DUNG, lý do đường lộ (Bài học 16). Xác định đường xe chữa cháy bằng hatch/ký hiệu: đọc chú giải (ghi chú/note) và chi tiết mặt cắt trên bản vẽ giao thông để biết hatch nào là đường chịu tải xe chữa cháy (bê tông cốt thép, đường nhựa), hatch nào là cỏ/cây/hạng mục khác; chỉ phần hatch đường mới tính là đường xe chữa cháy, cỏ và hatch khác không tính; chú giải và chi tiết mặt cắt ghi ngược nhau (IR1/IR2) thì CXN. Bãi quay xe nhận bằng hình học ở cuối đường cụt: mảng tam giác (đầu búa), chữ T, vuông, tròn nối vào cuối đường; thấy hình đó thì đo kích thước và ghi đã có bãi quay xe, chỉ CXN kích thước so với phương tiện địa phương (Đ 6.4); chưa thấy hình nào thì mới ghi thiếu. Bãi quay xe (Đ 6.4 hiện hành chỉ nói phù hợp xe địa phương; các dạng dưới là quy định cũ dùng THAM KHẢO, nhỏ hơn ngưỡng thì CXN): tam giác đều cạnh >=7 m (một đỉnh ở đường cụt, hai đỉnh cân đối hai bên đường), hình vuông cạnh >=12 m, hình tròn đường kính >=10 m, chữ nhật vuông góc đường cụt >=5x20 m; đo kích thước trên bản vẽ so ngưỡng, có thể nhiều cái, mỗi đường cụt một; hatch lục giác không phải bãi quay xe (Bài học 17). Làn 3,5 m là khoảng giữa hai nhãn 3500 (xe đỗ hai bên vẫn xét được); cự ly mép bãi đến tường đọc từ nhãn cạnh (4500 = 4,5 m); bãi có thể chia nhiều bãi >=15 m cộng dồn đủ chu vi/6; bãi tránh xe chỉ cần khi đường một làn >=100 m (Bài học 18). Đường cụt = đi một chiều, hết đường phải quay lại; đường vòng = liền mạch quanh nhà và ra ngoài được (kể cả cổng thứ hai): đường vòng thông suốt thì không cần bãi quay xe (KHONG_AP_DUNG); chỉ đường cụt >46 m mới cần; thấy không liền mạch hoặc thiếu bề rộng đoạn sau nhà thì CXN (Bài học 19). Lối vào từ trên cao (Bài học 21): nhà F5 một tầng KHÔNG cần (KHONG_AP_DUNG); F5 từ hai tầng kể cả cao PCCC <15 m vẫn phải có, mỗi 20 m bãi một lối, cự ly ngang từ bãi 2–10 m; F1.3 không áp dụng. Không bắt buộc bãi đỗ xe chữa cháy (chú thích 1 Bảng 14: <=50 người/tầng và đường xe chữa cháy→họng tiếp nước <=18 m) thì không vẽ, không khoanh bãi; chỉ ghi đường tiếp cận và căn cứ miễn (Bài học 23). Nhà F5 bắt buộc có bãi đỗ xe chữa cháy (dài theo Bảng 16), trừ F5 hạng A, B diện tích sàn đến 300 m2 hoặc hạng C, D, E không vượt giới hạn nhà bậc chịu lửa V (Phụ lục H) thì chỉ cần đường tiếp cận theo 6.2.2.1; thiếu hạng hay số tầng thì CXN.  Chỉ đoạn đường thông thủy >=3,5 m mới là đường cho xe chữa cháy; đoạn hẹp hơn (khe giữa nhà và hàng rào...) không tính, đường đứt tại đó và phần còn lại là đường cụt (Bài học 20)." },
  { id: "m05-cong-nang", ten: "Mục 5 – Bố trí công năng", viec: "Vị trí các công năng, phòng nguy hiểm cháy, tầng hầm, phòng kỹ thuật.", tu_khoa: /bố trí công năng/i,
    tri_thuc: [BH, "skills/SKILL_ngan_chay_cong_nang.md", DN] },
  { id: "m06-ngan-chay", ten: "Mục 6 – Ngăn cháy, chống cháy lan", viec: "Ngăn cháy ngang, đứng, theo công năng, hành lang; vật liệu; cửa, tường, sàn ngăn cháy; tỉ lệ cửa/tường.",
    tu_khoa: /ngăn cháy|chống cháy lan/i,
    tri_thuc: [BH, "skills/SKILL_ngan_chay_cong_nang.md", "skills/MOD_hanh_lang_bao_che.md", "skills/MOD_vat_lieu_hoan_thien.md", DN, PLH, "knowledge/qcvn06-dieu-4.md", GR],
    luu_y: "Tường ngoài theo ranh/đường quy ước (E.3) và ngăn cháy phương đứng (4.33): làm theo knowledge/giap-ranh-khoang-cach-pccc.md." },
  { id: "m07-thoat-nan", ten: "Mục 7 – Lối, đường thoát nạn", viec: "Lối ra, số lối, phân tán, cửa, chiều rộng, khoảng cách (Bảng G), đường thoát nạn, hành lang, cầu thang, buồng thang, lối lên mái.",
    tu_khoa: /lối.*thoát nạn|giải pháp thoát nạn|^thoát nạn/i,
    tri_thuc: [BH, "skills/SKILL_thoat_nan.md", "skills/MOD_loi_ra_va_cua.md", "skills/MOD_so_luong_loi_ra.md", "skills/MOD_tinh_toan_khoang_cach.md",
      "skills/PHU_LUC_G_QCVN06.md", "skills/MOD_hanh_lang_bao_che.md", "skills/MOD_cau_thang_buong_thang.md", "skills/MOD_hinh_Phu_luc_I_cau_thang.md",
      "skills/MOD_vat_lieu_hoan_thien.md", "memory/pccc-escape-route-method.md", DN],
    luu_y: "Đếm lối thoát nạn: xét từng thang theo MOD_cau_thang_buong_thang trước (thang rẽ quạt/bậc chéo thêm 3.4.4), thang nào đạt mới tính là lối ra; thiếu kích thước bậc thì thang đó CẦN XÁC NHẬN. Đếm theo tầng: tầng trên = số buồng thang đạt, tầng trệt = số lối ra ngoài nhà, tầng hầm = số thang lên tầng 1 hoặc lên sân (Bài học 26). Số đo trên bản vẽ là ước lượng ±1–2 m: ghi rõ 'ước lượng'. Khoảng cách và phân tán đo theo Phụ lục G và Hình I. Điểm xuất phát đường thoát nạn: gian phòng có cửa chống cháy đúng yêu cầu thì từ cửa đó (Bài học 9); KHÔNG có cửa chống cháy thì từ ĐIỂM XA NHẤT trong phòng. Đo theo đường đi thực tế, né bàn ghế, tủ, thiết bị, cột, vật cản giữa đường, không dùng đường chim bay/đoạn thẳng; không biết bố trí vật cản thì CXN (Bài học 22). Tuyến vẽ theo GÓC VUÔNG bám lối đi trống (dọc tường tới cửa phòng, ra hành lang, đi thẳng tới cửa thoát nạn), không đường chéo; chiều dài là tổng các đoạn thẳng (Bài học 24). Trình bày thoát nạn theo mẫu (Bài học 25): chú giải ký hiệu, tuyến góc vuông ghi L từng đoạn và tổng, khung tính toán (diện tích sử dụng = diện tích tầng − chiếm chỗ, số người, mật độ, Bảng G.2a theo bậc chịu lửa), chi tiết cửa sổ thoát nạn khẩn cấp và cửa chống cháy." },
  { id: "m08-thang-may-cc", ten: "Mục 8 – Thang máy chữa cháy", viec: "Đối tượng phải có, số lượng, sảnh, giếng, nguồn điện thang máy chữa cháy.",
    tu_khoa: /thang máy/i, tri_thuc: [BH, DN, "knowledge/qcvn06-dieu-6.md"] },
  { id: "m09-chong-khoi", ten: "Mục 9 – Chống tụ khói", viec: "Hút xả khói, tăng áp, thoát khói tự nhiên (Phụ lục D).", tu_khoa: /tụ khói|hút khói|tăng áp/i,
    tri_thuc: [BH, "skills/MOD_chong_khoi_PL_D.md", DN] },
  { id: "m10-binh-chua-chay", ten: "Mục 10 – Bình chữa cháy, phương tiện ban đầu", viec: "Loại, số lượng, khoảng cách bố trí bình chữa cháy.",
    tu_khoa: /bình chữa cháy|chữa cháy ban đầu|xách tay/i, bang_he_thong: ["B12"], tri_thuc: [BH, Q10_BINH],
    luu_y: "Căn cứ trang bị, bố trí phương tiện chữa cháy ban đầu chỉ lấy từ QCVN 10:2025/BCA (mục 2.6–2.8, Phụ lục D–F, file knowledge/qcvn10-2025-binh-dung-cu-co-gioi.md). Bản vẽ viện dẫn tiêu chuẩn trang bị cũ thì ghi nhận là viện dẫn của thiết kế, không trích làm căn cứ." },
  { id: "m11-bao-chay", ten: "Mục 11 – Báo cháy", viec: "Đối tượng phải trang bị, loại đầu báo, bố trí, tủ trung tâm, liên động.", tu_khoa: /báo cháy|báo nồng độ/i,
    bang_he_thong: ["B1", "B2"], tri_thuc: [BH, Q10, Q10_AUTO, "skills/MOD_dau_bao_khoi_khoang_dam.md"],
    luu_y: "Toàn văn TCVN 7568-14:2025 ở knowledge/tcvn7568-14-2025.md (Claude đọc khi cần điều khoản ngoài cột Quy định). Đầu báo khói trên trần có dầm: theo module khoang dầm, xét từng ô giữa dầm." },
  { id: "m12-chua-chay", ten: "Mục 12 – Chữa cháy (sprinkler, họng nước, ngoài nhà, trạm bơm, khí, bọt)", viec: "Đối tượng phải trang bị, lưu lượng, áp lực, bố trí, nguồn nước, trạm bơm.",
    tu_khoa: /hệ thống chữa cháy|chữa cháy tự động|chữa cháy bằng|họng nước|cấp nước chữa cháy|trạm bơm/i,
    bang_he_thong: ["B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11"], tri_thuc: [BH, Q10, Q10_AUTO, Q10_NUOC, Q10_H] },
  { id: "m13-cap-dien", ten: "Mục 13 – Cấp điện cho hệ thống PCCC", viec: "Nguồn ưu tiên, nguồn dự phòng, cáp chịu lửa, ATS.", tu_khoa: /cấp điện|nguồn điện|hệ thống điện/i,
    bang_he_thong: ["B14"], tri_thuc: [BH] },
  { id: "m14-den-su-co", ten: "Mục 14 – Chiếu sáng sự cố, chỉ dẫn thoát nạn, loa", viec: "Độ rọi, vị trí đèn EXIT/EM, thời gian duy trì, loa thông báo.",
    tu_khoa: /chiếu sáng sự cố|chỉ dẫn thoát nạn|loa/i, bang_he_thong: ["B13"], tri_thuc: [BH, "skills/SKILL_thoat_nan.md", Q10_DEN] },
  { id: "m15-cnch", ten: "Mục 15 – Dụng cụ phá dỡ, phương tiện bảo hộ, cứu nạn", viec: "Dụng cụ phá dỡ thông thường, mặt nạ, phương tiện cơ giới.",
    tu_khoa: /phá dỡ|bảo hộ|cứu nạn|CNCH|mặt nạ|cơ giới|dụng cụ chữa cháy|cá nhân/i, tri_thuc: [BH, Q10_BINH],
    luu_y: "Căn cứ trang bị, bố trí phương tiện chữa cháy ban đầu chỉ lấy từ QCVN 10:2025/BCA (mục 2.6–2.8, Phụ lục D–F, file knowledge/qcvn10-2025-binh-dung-cu-co-gioi.md). Bản vẽ viện dẫn tiêu chuẩn trang bị cũ thì ghi nhận là viện dẫn của thiết kế, không trích làm căn cứ." },
  { id: "m16-chong-set", ten: "Mục 16 – Chống sét", viec: "Phương án chống sét theo TCVN 9385.", tu_khoa: /chống sét/i, tri_thuc: [BH] },
  { id: "m17-lien-lac", ten: "Mục 17 – Liên lạc", viec: "Hệ thống liên lạc, điện thoại phòng trực.", tu_khoa: /liên lạc|điện thoại/i, tri_thuc: [BH] },
  { id: "m18-quang-cao", ten: "Mục 18 – Biển quảng cáo", viec: "Biển quảng cáo không che lối thoát nạn, ô cửa cứu nạn (QCVN 17:2018).", tu_khoa: /quảng cáo/i, tri_thuc: [BH] },
  { id: "chung", ten: "Hạng mục khác", viec: "Đối chiếu các dòng không thuộc hạng mục riêng (công trình đặc thù, xăng dầu, khí, tàu…).", tri_thuc: [BH, DN] },
  { id: "ra-soat", ten: "Rà soát chéo", viec: "Tìm số liệu lệch giữa các dòng, kết luận mâu thuẫn, dòng thiếu nguồn hoặc thiếu điều khoản; chỉ trả về các dòng cần sửa.",
    tri_thuc: [BH, "skills/SKILL_thoat_nan.md"] },
  { id: "huong-dan", ten: "Hướng dẫn thẩm định", viec: "Viết hướng dẫn cho người thiết kế ở các dòng CHƯA ĐẠT, CẦN XÁC NHẬN, chỉnh bản vẽ: bản vẽ thiếu đường thoát nạn, thiếu bề rộng thoát nạn, thiếu ghi chú… thì cần bổ sung gì, ở đâu, trị số yêu cầu, điều khoản.",
    tri_thuc: [BH, DN, "skills/SKILL_thoat_nan.md", "skills/MOD_loi_ra_va_cua.md", "skills/PHU_LUC_G_QCVN06.md", "skills/MOD_cau_thang_buong_thang.md", "memory/pccc-escape-route-method.md"] },
  { id: "khao-sat-bao-gia", ten: "Báo cáo khảo sát và báo giá PCCC", viec: "Mục 8 (không phải thẩm định): từ bản vẽ hoặc thông tin bằng chữ lấy hạng mục, công năng, diện tích, số tầng, chiều cao PCCC, khối tích (không có thì diện tích x chiều cao); công trình có thuộc diện thẩm định không; số lối thoát nạn trên bản vẽ và đã đảm bảo yêu cầu QCVN 06 chưa; thuộc diện lắp đặt hệ thống PCCC nào; có chữa cháy nước thì cần tính bể nước PCCC (skill tính bể làm sau).",
    tri_thuc: ["knowledge/khao-sat-bao-gia.md", BH, "skills/MOD_cau_thang_buong_thang.md", DN, PLH, Q10, Q10_AUTO, Q10_NUOC, "knowledge/nghi-dinh-tham-dinh-dieu-chinh.md", "skills/MOD_so_luong_loi_ra.md", "skills/PHU_LUC_G_QCVN06.md", "knowledge/so-bo-thiet-ke-pccc.md"],
    luu_y: "Số lối thoát nạn: xét từng buồng thang theo MOD_cau_thang_buong_thang (thang rẽ quạt thêm 3.4.4) rồi mới đếm. Đếm theo tầng: tầng trên = số buồng thang đạt, tầng trệt = số lối ra ngoài nhà, tầng hầm = số thang lên tầng 1 hoặc lên sân (Bài học 26). Đây là số liệu sơ bộ để khảo sát và báo giá, không phải kết luận thẩm định. Trả lời tiếng Việt, ngắn, theo đúng 8 mục trong knowledge/khao-sat-bao-gia.md và kết thúc bằng MỘT khối json khao_sat. Khối tích không có trên bản vẽ thì tự tính diện tích x chiều cao và ghi rõ. Bản vẽ không có bề rộng thoát nạn thì chỉ ghi yêu cầu theo QCVN 06, không kết luận bề rộng. Bể nước PCCC: chưa tự tính, ghi CẦN TÍNH BỂ NƯỚC PCCC khi có chữa cháy nước. Số liệu thiếu thì ước lượng có nhãn hoặc CẦN XÁC NHẬN; không bịa ngưỡng quy chuẩn." },
  { id: "bao-gia", ten: "Báo giá PCCC", viec: "Mục 8 (không phải thẩm định): từ số liệu báo cáo khảo sát (diện tích, số tầng, chiều cao PCCC, lối thoát nạn, hệ thống PCCC phải lắp đặt) lập bảng khối lượng sơ bộ từng hệ thống, đơn vị tính, đơn giá (lấy từ bảng đơn giá người dùng; không có thì để trống) để xuất file Excel báo giá.",
    tri_thuc: ["knowledge/bao-gia-pccc.md", "knowledge/khao-sat-bao-gia.md", Q10_BINH],
    luu_y: "Khối lượng là ước lượng theo quy tắc trong knowledge/bao-gia-pccc.md, ghi cách ước từng dòng. Không tự đặt đơn giá thị trường: chỉ dùng bảng đơn giá hoặc giá người dùng cho, không có thì null. Hệ thống CẦN XÁC NHẬN vẫn đưa vào, ghi 'chờ xác nhận'. Kết thúc bằng MỘT khối json bao_gia." },
  { id: "thuy-luc", ten: "Tính toán thủy lực chữa cháy", viec: "Không phải thẩm định từng dòng: tính, kiểm, sơ bộ và tối ưu phương án thủy lực sprinkler + họng nước theo TCVN 7336:2021 Phụ lục B (kho giá kệ: TCVN 14496:2025) và QCVN 10:2025 Phụ lục H; xuất kết quả ra file Excel mẫu bang_tinh/thuy_luc/MAU_THUY_LUC_7336.xlsx.",
    tools: "Read, Grep, Glob, Write, Bash",
    tri_thuc: ["knowledge/kiem-bang-tinh-thuy-luc-7336.md", "bang_tinh/thuy_luc/o_nhap.json", Q10_H, Q10_NUOC],
    luu_y: "Nhận PDF bản vẽ: làm đúng 12 bước mục “Quy trình từ PDF bản vẽ tới kết quả” trong knowledge/kiem-bang-tinh-thuy-luc-7336.md (vùng tính n ≥ S/Ω, hàng cuối lấy đầu gần nút, thiếu Qmin thì tăng số đầu bằng lệnh chon-dau; áp đầu chủ đạo theo cách 1 (I·Fv/kv)² hoặc cách 2 catalogue; cộng HCB2 cụm van; đếm số trục cấp, họng chung/riêng, khoanh bằng scripts/khoanh_thuy_luc.py, ghi CẦN XÁC NHẬN). Không tự nhẩm số: mọi phép tính chạy bằng `npx tsx scripts/thuy_luc.ts` (lõi shared/src/thuy_luc.ts). Bốn việc: (1) KIỂM bảng tính người dùng: đọc Excel/PDF, đối chiếu checklist knowledge/kiem-bang-tinh-thuy-luc-7336.md, dựng so_lieu.json rồi `tinh` để so số; (2) TÍNH THEO BẢN VẼ: đọc mặt bằng sprinkler (K đầu phun, nhóm nguy cơ, DN và chiều dài từng đoạn từ đầu chủ đạo về bơm, Z, họng nước) thành so_lieu.json theo khóa bang_tinh/thuy_luc/o_nhap.json, chạy `tinh <so_lieu.json> --excel ket_qua/<du_an>/thuy_luc.xlsx`; (3) SƠ BỘ khi bản vẽ chỉ có mặt bằng: lập mat_bang.json (nhóm, cao phòng, chiều dài ống chính ước tính về bơm, Z, họng) rồi `so-bo <mat_bang.json> <so_lieu.json> --excel …`, ghi rõ mọi giả định; (4) TỐI ƯU: `toi-uu <so_lieu.json> <so_lieu_tot.json> --excel …` so 4 phương án (giữ ống tăng áp đầu chủ đạo, nâng DN ống chính/vòng, nâng DN nhánh, nâng cả hai), báo PB, Q bơm, bể, vận tốc để người dùng chọn. TRƯỚC KHI TÍNH luôn nhận diện và ghi ra: nhánh đối xứng, bất đối xứng hay một phía (một phía không nhân đôi), mạch vòng hay cụt (quy tắc ở mục Nhận diện trong knowledge/kiem-bang-tinh-thuy-luc-7336.md; file .xlsx đúng mẫu thì `tinh <file.xlsx>` tự nhận diện); mạch vòng mỗi nửa vòng mang ½ lưu lượng. Bố trí đầu phun kiểm a ≥ 1,5 m, Ω ≤ 12 m² (nhóm 1–3), ≤ 9 m² (nhóm 4–7). Excel mẫu tối đa 5 đầu mỗi nhánh, 8 hàng, 4 đoạn vòng; đoạn bỏ trống ra #N/A là chủ ý. Không ghi đè file người dùng đang mở: lưu file mới. Thiếu dữ liệu (DN, chiều dài, K) thì hỏi hoặc ghi giả định có đánh dấu, không bịa. Lưu lượng họng vào bơm và bể = số tia theo QCVN 10:2025 Bảng H.5/H.6 × lưu lượng lăng tra H.7 tại chiều cao tia đặc tối thiểu cần (thường 2,6 l/s); QCVN 06 Điều 5 không dùng nữa." },
  { id: "so-bo-thiet-ke", ten: "Sơ bộ thiết kế PCCC", viec: "Mục 7 (không phải thẩm định): từ mặt bằng và số liệu công trình, đề xuất sơ bộ đường giao thông và bãi đỗ xe chữa cháy (bãi đỗ, làn xe, bãi quay xe, bãi tránh xe, lối vào từ trên cao) và đường thoát nạn (tuyến, chiều dài, số người, bề rộng), hỏi đáp với người thiết kế.",
    tri_thuc: [BH, "knowledge/so-bo-thiet-ke-pccc.md", "knowledge/qcvn06-dieu-6.md", "skills/PHU_LUC_G_QCVN06.md", "skills/MOD_so_luong_loi_ra.md", "memory/pccc-escape-route-method.md", GR, LV],
    luu_y: "Đây là đề xuất sơ bộ cho người thiết kế, không phải kết luận thẩm định. Trả lời tiếng Việt, ngắn, trích điều khoản, ghi rõ giả định và số đo là ước lượng. Giáp ranh đất hoặc khoảng cách PCCC không đủ: làm theo knowledge/giap-ranh-khoang-cach-pccc.md. Lối vào từ trên cao: khoanh vị trí trên mặt đứng và hướng dẫn theo knowledge/loi-vao-tren-cao.md. Thiếu số liệu (chiều cao PCCC, nhóm nhà, hạng, số người, khối tích, sprinkler) thì hỏi lại hoặc nêu giả định có đánh dấu; không bịa trị số quy chuẩn. Khi được cho quy mô và công năng từng tầng thì lập BẢNG THÔNG TIN PCCC theo form trong knowledge/so-bo-thiet-ke-pccc.md (bảng theo tầng, bảng chỉ tiêu, hệ quả sơ bộ); đầu ra này sẽ làm nền cho báo cáo khảo sát và báo giá." },
];

export const AGENTS: AgentDef[] = AGENTS_GOC.map((a) => ({ ...a, tri_thuc: [...a.tri_thuc, HOC, KN(a.id)] }));

/** Đọc hồ sơ (A0) và hạng mục tra bảng đơn giản giao Gemini web ở chế độ "hỗn hợp"; mục khó, rà soát, hướng dẫn do Claude. Gemini lỗi thì chạy lại bằng Claude. */
export const AGENT_GEMINI = ["doc-ho-so", "m03-khoang-cach", "m08-thang-may-cc", "m10-binh-chua-chay", "m13-cap-dien", "m15-cnch", "m16-chong-set", "m17-lien-lac", "m18-quang-cao"];
/** id job (vd. "A12-m10-binh-chua-chay-2", "R-ra-soat") → model Claude của agent; không khớp thì sonnet. */
export const modelCuaJob = (id: string): Model => AGENTS_GOC.find((a) => id.includes(a.id))?.model ?? "sonnet";
/** id job (hoặc id agent) → engine ở chế độ hỗn hợp. */
export const engineCuaJob = (id: string): "gemini" | "claude" => (AGENT_GEMINI.some((a) => id.includes(a)) ? "gemini" : "claude");

export const agentById =(id: string) => AGENTS.find((a) => a.id === id) ?? AGENTS.find((a) => a.id === "chung")!;

/** Agent hệ thống ứng với một bảng hệ thống, vd. B1 → m11-bao-chay. */
export const agentChoBangHeThong = (ma: string) => AGENTS.find((a) => a.bang_he_thong?.includes(ma)) ?? agentById("chung");

/** Agent cho một mục lớn theo tiêu đề. Thứ tự: mục cụ thể trước, m12 sau m10/m11 để 'chữa cháy ban đầu' không rơi vào m12. */
export function agentChoMuc(tieuDe: string): AgentDef {
  for (const a of AGENTS) if (a.tu_khoa && a.tu_khoa.test(tieuDe)) return a;
  return agentById("chung");
}

/** Phần thẩm định của một agent: m01 (phân loại) dùng chung; m02–m09 là xây dựng PCCC (NĐ 105 Điều 6 khoản 2: kiến trúc); còn lại là hệ thống PCCC (Điều 9 khoản 2). */
export const nhomCuaAgent = (id: string): "kien_truc" | "pccc" | "chung" =>
  /^m01-/.test(id) ? "chung" : /^m0[2-9]-/.test(id) ? "kien_truc" : "pccc";
