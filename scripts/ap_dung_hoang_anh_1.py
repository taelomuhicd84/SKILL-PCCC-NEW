"""Áp dụng quy trình thẩm định cho Karaoke Hoàng Anh 1 (bản vẽ kiến trúc 20-12-2024 + bản vẽ PCCC 02-12-2024).
Sinh ra: bảng B15 đã điền (docx chính thức), bảng tóm tắt (md), PDF có khung ghi chú.
Chạy: python -I -X utf8 ap_dung_hoang_anh_1.py
Dữ liệu (ITEMS, SHORT, KHUNG, DONG) nằm ngay trong file này; sửa rồi chạy lại để tạo lại kết quả.
"""
import glob, os, re
import fitz
from docx import Document
from docx.shared import RGBColor
from docx.table import _Cell, Table
from docx.oxml.ns import qn

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "ket_qua", "hoang_anh_1_20-12")
os.makedirs(OUT, exist_ok=True)
ARCH_PDF = glob.glob(r"D:\1.DRIVE CÔNG TY\My Drive\1.PHÒNG THIẾT KẾ\1. HỒ SƠ THẨM DUYỆT\8. Năm 2024\1. KARAOKE\1. HOÀNG ANH 1\New folder\27-12-2024*.pdf")[0]
PCCC_PDF = glob.glob(r"C:\Users\HP\OneDrive\Clip PCCC\KARAOKE HO*\FINAL\PCCC KARAOKE HO*02_12_2024.pdf")[0]
B15 = glob.glob(r"D:\$.4. QC - TCVN\Bảng đối chiếu sửa đổi 1\B15*.docx")[0]
FONT = r"C:\Windows\Fonts\arial.ttf"
FONTB = r"C:\Windows\Fonts\arialbd.ttf"

D, X, N, K, BL = "ĐẠT", "CẦN XÁC NHẬN", "KHÔNG ÁP DỤNG", "CHƯA ĐẠT", "CHỈNH BẢN VẼ"
# CHỈNH BẢN VẼ = sai sót hoặc thiếu ghi chú trên bản vẽ (không tính vào kết luận đạt/chưa đạt của thiết kế)

ITEMS = {
 1: (K, "Cửa D3 (0,8×2,1 m, GHCL '-') mở vào hành lang thoát nạn nhưng không phải cửa chống cháy. Karaoke bắt buộc ngăn cách hành lang bằng bộ phận ngăn cháy; mọi cửa mở vào hành lang phải là cửa ngăn cháy (Đ.3.3.5)."),
 2: (BL, "Sửa ghi chú: 'cửa chống cháy D1 EI60' thành FD1 (D1 là cửa kính 1,9×2,3 m, GHCL '-')."),
 3: (BL, "Số người lớn nhất là 105 (Lầu 1, đã xác nhận): sửa bảng thống kê và ghi chú đang ghi 93; tầng trệt 92 theo khối tính."),
 4: (BL, "Lầu 1: sửa nhãn lối thoát: lối 1 là FD1 0,9×2,1 m, lối 2 là D2 1,5×2,1 m; sửa dòng 'lối rộng 0,9 và 0,9 m' thành 0,9 và 1,5 m."),
 5: (BL, "Giới hạn ghi 40 m không khớp Bảng G.2a (bậc II, mật độ ≤ 2: 60 m giữa hai lối, 30 m hành lang cụt); sửa số. Kết luận ĐẠT không đổi."),
 6: (BL, "Ghi chú 'Sàn BTCT có GHCL REI150' mâu thuẫn thuyết minh kết cấu (sàn BTCT dày 100 mm GHCL REI45); sửa."),
 7: (X, "Hành lang trong dài hơn 15 m, không thông gió tự nhiên (Phụ lục D, D.2c): bộ PCCC đã có hút khói cơ khí, xem khung 14."),
 8: (X, "Thiếu dữ liệu: vật liệu tường và sàn hành lang. Bảng B.8 (F2.1): hành lang tường, trần CV1, sàn CV2. Chỉ ghi trần thạch cao không cháy; cần ghi thêm."),
 9: (BL, "Ghi kích thước bậc tam cấp tại D1 (đã vẽ 3 cấp) và D2 như chi tiết FD1; ghi chú D1, D2 là cửa kính hai cánh luôn đóng, đẩy thủ công mở ra, không khóa."),
 10: (BL, "Cửa FD1 cạnh P.kỹ thuật nước là cửa vào phòng kỹ thuật nằm dưới thang CT2, không phải lối thoát nạn (lối thoát nạn là lối ra ngoài). Nên ghi chú rõ 'cửa phòng kỹ thuật' và hướng mở không vào buồng thang (Đ.3.4.5). Lầu 1 cửa vào CT2 để trống không cánh, thông thủy lớn hơn 900 mm, cao hơn 1,9 m nên đạt, do người thiết kế quyết định có lắp cửa hay không."),
 11: (X, "Bảng tỉ lệ cửa/tường chỉ tính cửa FD1; tường TL3 còn có hai cửa D3 không chống cháy (Lầu 1 nằm trong đoạn 24,5 m; tầng trệt khu WC nằm ngoài đoạn 13,7 m)."),
 12: (BL, "Ghi chú bề rộng chỉ tính tổng n = 105/165 = 0,64 m. Nên bổ sung kiểm tra từng lối khi một lối bị chặn (Đ.3.2.8): 105 người qua FD1 0,9 m (0,9 × 165 = 148 người, đạt). Lối vào buồng thang tính theo G.2.1.1, không áp 1,2 m."),
 13: (BL, "Mặt đứng có cao độ +7,600 nhưng chưa ghi chú 'chiều cao PCCC 7,6 m' (khoảng cách từ mặt đường xe chữa cháy đến mép dưới ô cửa tầng trên cùng, Đ.1.4.9). Bổ sung ghi chú."),
 14: (X, "Hút khói tầng trệt: hành lang khép vòng khoảng 60 m chỉ có 2 miệng hút; D.6 cho mỗi miệng ≤ 45 m (thẳng), ≤ 30 m (gấp khúc), ≤ 20 m (vòng khép kín). Bảng bù khí: 3,89 m³/s chia 1 m² là 3,89 m/s, bảng ghi 3,2 m/s."),
 15: (BL, "Thuyết minh EX–EM: E = 0,4×10 000/820 bằng 4,88 lux (ghi 12,19); diện tích ghi 1 601,7 m² nhưng tính 820 m²; khoảng cách quan sát ghi 85 m nhưng tính H với 30 m (85/200 = 0,425 m lớn hơn biển 0,202 m). Sửa số."),
}
SHORT = {
 1: "D3 (0,8×2,1 m, GHCL '-') mở ra hành lang, không chống cháy (Đ.3.3.5).",
 2: "Sửa ghi chú: 'cửa chống cháy D1 EI60' thành FD1.",
 3: "Số người lớn nhất 105 (đã xác nhận): sửa 93 ở bảng thống kê và ghi chú.",
 4: "Lầu 1: sửa nhãn lối 1 là FD1 0,9 m, lối 2 là D2 1,5 m; sửa ghi chú tổng.",
 5: "Giới hạn 40 m sai so với G.2a (60 m hoặc 30 m); sửa số, kết luận không đổi.",
 6: "Sửa 'sàn REI150' thành REI45 (đúng thuyết minh kết cấu).",
 7: "Hành lang trong > 15 m không thông gió tự nhiên (D.2c): đã có hút khói, xem khung 14.",
 8: "Thiếu vật liệu tường, sàn hành lang (B.8: CV1 và CV2); cần ghi.",
 9: "Ghi kích thước bậc tam cấp D1, D2; ghi chú cửa kính hai cánh đẩy mở thủ công, không khóa.",
 10: "FD1 cạnh P.kỹ thuật nước là cửa phòng dưới thang CT2, không phải lối thoát nạn; nên ghi chú rõ.",
 11: "Bảng tỉ lệ cửa/tường chỉ tính FD1; TL3 còn cửa D3 không chống cháy.",
 12: "Bổ sung kiểm tra từng lối khi một lối bị chặn: 105 người qua FD1 0,9 m (0,9×165 = 148, đạt).",
 13: "Bổ sung ghi chú chiều cao PCCC 7,6 m trên mặt đứng (Đ.1.4.9).",
 14: "Hành lang vòng ≈ 60 m chỉ 2 miệng hút (D.6: ≤ 20–45 m mỗi miệng). Bảng bù khí: 3,89/1 ≠ 3,2 m/s.",
 15: "EX–EM: E = 4,88 lux (ghi 12,19); S ghi 1 601,7 tính 820; L ghi 85 m tính 30 m. Sửa số.",
}

# ---- khung: (nguồn 'A' kiến trúc / 'P' PCCC, trang, số khung, vị trí)
# vị trí: (x0,y0,x1,y1) với A là điểm ảnh 120 dpi (nhân 0,6); P là điểm PDF; hoặc ("find", chuỗi, (dx0,dy0,dx1,dy1))
KHUNG = [
 ("A", 20, 1, (1530, 230, 1672, 280)), ("A", 20, 2, (80, 488, 576, 568)), ("A", 20, 3, (78, 1184, 588, 1216)), ("A", 20, 3, (78, 940, 446, 968)),
 ("A", 20, 5, (78, 1058, 580, 1150)), ("A", 20, 6, (80, 1304, 480, 1334)), ("A", 20, 8, (80, 1334, 440, 1358)),
 ("A", 20, 7, (955, 500, 1500, 546)), ("A", 20, 7, (950, 264, 1660, 312)), ("A", 20, 9, (918, 372, 975, 440)), ("A", 20, 9, (1545, 365, 1598, 432)),
 ("A", 20, 10, (1498, 478, 1625, 602)),
 ("A", 21, 1, (1532, 262, 1660, 298)), ("A", 21, 2, (80, 488, 576, 568)), ("A", 21, 3, (78, 1184, 588, 1216)), ("A", 21, 3, (78, 940, 446, 968)),
 ("A", 21, 4, (826, 584, 932, 634)), ("A", 21, 4, (1620, 464, 1724, 516)), ("A", 21, 4, (78, 808, 582, 858)),
 ("A", 21, 5, (78, 1058, 580, 1150)), ("A", 21, 6, (80, 1304, 480, 1334)), ("A", 21, 7, (940, 292, 1650, 342)), ("A", 21, 10, (1495, 490, 1625, 625)),
 ("A", 21, 12, (935, 562, 1002, 604)),
 ("A", 22, 1, (1530, 246, 1672, 282)), ("A", 22, 2, (1250, 1120, 1730, 1196)), ("A", 22, 11, (65, 1338, 1735, 1372)),
 ("A", 23, 1, (1520, 262, 1668, 296)), ("A", 23, 2, (68, 38, 556, 158)), ("A", 23, 11, (65, 1338, 1735, 1370)),
 ("A", 14, 13, ("find", ["7600", "MẶT ĐỨNG CẢI TẠO 1-6 KARAOKE"], (-5, -4, 5, 4))),
 ("A", 15, 13, ("find", ["7600", "MẶT ĐỨNG CẢI TẠO 6-1 KARAOKE"], (-5, -4, 5, 4))),
 ("A", 16, 13, ("find", ["7600", "MẶT ĐỨNG CẢI TẠO F-A KARAOKE"], (-5, -4, 5, 4))),
 ("A", 17, 13, ("find", ["7600", "MẶT ĐỨNG CẢI TẠO A-F KARAOKE"], (-5, -4, 5, 4))),
 ("P", 16, 15, (120, 666, 300, 681)), ("P", 16, 15, (120, 705, 300, 720)), ("P", 16, 15, (120, 760, 418, 775)), ("P", 16, 15, (120, 787, 262, 800)),
 ("P", 44, 14, (562, 172, 640, 203)), ("P", 44, 14, (562, 355, 640, 385)), ("P", 44, 14, (535, 808, 762, 826)),
 ("P", 45, 14, (582, 171, 660, 203)), ("P", 45, 14, (582, 354, 660, 385)),
]
# vùng trống để ghi danh sách: A px 120 dpi, P điểm PDF
BLANK = {("A", 20): (1190, 905, 1735, 1150), ("A", 21): (790, 960, 1735, 1150), ("A", 22): (800, 930, 1235, 1195), ("A", 23): (800, 955, 1735, 1195),
         ("A", 14): (100, 70, 830, 160), ("A", 15): (100, 70, 830, 160), ("A", 16): (100, 70, 830, 160), ("A", 17): (100, 70, 830, 160),
         ("P", 16): (688, 684, 968, 812), ("P", 44): (458, 560, 990, 612), ("P", 45): (458, 560, 990, 612)}
ARCH_PAGES = [14, 15, 16, 17, 20, 21, 22, 23]
PCCC_PAGES = [16, 44, 45]

# ---- các dòng của bảng B15: số dòng (lệnh khung) -> (thiết kế, kết luận, lý do, khung, chỉnh bản vẽ)
DONG = {
 1: ("Karaoke 2 tầng, khối tích 4 055,76 m³ (bảng thống kê trang 10).", D, "Khối tích 4 055,76 m³ ≥ 1 500 m³ nên thuộc diện thẩm duyệt.", "", ""),
 2: ("2 tầng nổi (trệt, lầu 1); tầng áp mái BTCT không sử dụng; không có tầng hầm, tầng nửa hầm.", D, "Số tầng ghi đúng bảng thống kê; không hầm.", "", ""),
 3: ("Chiều cao PCCC 7,6 m; chiều cao mái 9,1 m (bảng thống kê); đã xác nhận 7,6 m đúng.", D, "Số liệu đúng theo xác nhận. Các mặt đứng chưa ghi chiều cao PCCC.", "", "13"),
 4: ("F2.1 karaoke, công trình một công năng.", D, "Karaoke thuộc F2.1 (Bảng 6).", "", ""),
 5: ("S0; cột chịu lực và tường ngoài ghi K0 (thuyết minh trang 5, 10).", D, "Cấp S0 yêu cầu các cấu kiện K0; thiết kế ghi K0.", "", ""),
 6: ("Bậc II: cột BTCT R90, tường ngoài gạch 200 mm REI150 (yêu cầu E15), sàn BTCT 100 mm REI45, mái BTCT.", X, "Bảng 4 và Bảng H.7 (sức chứa) chưa nạp; chưa đối chiếu bậc II với 105 người.", "", ""),
 8: ("Cách công trình phụ trợ 0,75 m (tường 100 mm REI90 hoặc 200 mm REI150 cao và rộng hơn, không ô cửa); các mặt khác cách ranh đất ≥ 3 m (trang 9).", X, "Phụ lục E chưa nạp; thiết kế viện dẫn chú thích 4 Bảng E1 (không quy định khoảng cách khi tường cao và rộng hơn).", "", ""),
 12: ("Sân bê tông trước công trình rộng hơn 3,5 m (đường ĐH-405 rộng 3,5 m).", D, "Yêu cầu bề rộng thông thủy ≥ 3,5 m.", "", ""),
 13: ("Chiều cao thông thủy lớn hơn 4,5 m, không có kết cấu chặn phía trên (ghi chú trang 8).", D, "Yêu cầu ≥ 4,5 m.", "", ""),
 16: ("Cao PCCC 7,6 m; đường xe tiếp cận trong bán kính nhỏ hơn 60 m (trang 8).", D, "Nhà F2 cao ≤ 15 m không yêu cầu bãi đỗ xe chữa cháy (6.2.2.1).", "", ""),
 17: ("Cao PCCC 7,6 m.", N, "Nhà cao ≤ 15 m.", "", ""),
 18: ("Cao PCCC 7,6 m.", N, "Nhà cao ≤ 15 m.", "", ""),
 19: ("Cao PCCC 7,6 m.", N, "Nhà cao ≤ 15 m.", "", ""),
 20: ("Cao PCCC 7,6 m.", N, "Nhà cao ≤ 15 m.", "", ""),
 22: ("Thiết kế ghi cao PCCC nhỏ hơn 10 m nên không yêu cầu lối lên mái (6.6).", X, "Điều 6.3 và 6.6 chưa nạp; chưa kiểm tra yêu cầu lối vào từ trên cao.", "", ""),
 36: ("Không có tầng hầm.", N, "Không có tầng hầm, tầng nửa hầm.", "", ""),
 37: ("Karaoke F2.1, 2 tầng, sức chứa 92–105 người.", X, "Phụ lục H chưa nạp; chưa đối chiếu Bảng H.2, H.7.", "", ""),
 38: ("Có hạng mục phòng trực PCCC (bản vẽ trang 54–58); tủ điều khiển quạt hút khói đặt tại phòng trực (24/24).", X, "Điều 6.17 chưa nạp.", "", ""),
 41: ("Không có tầng hầm.", N, "Không có tầng hầm.", "", ""),
 42: ("Chưa đối chiếu.", X, "Phụ lục H chưa nạp.", "", ""),
 44: ("Mái kính lấy sáng trục (C–D)/1 đã đổi thành sàn BTCT lầu 1; không có sảnh thông tầng.", N, "Không có sảnh thông tầng.", "", ""),
 45: ("Có chữa cháy sprinkler; thiết kế ghi không yêu cầu giải pháp ngăn cháy phương đứng theo 4.33.1–4.33.3 (trang 14–17).", X, "Điều 4.33 chưa nạp.", "", ""),
 46: ("Karaoke một công năng; tầng trệt có P.kỹ thuật nước 9,52 m², Lầu 1 có phòng kho trục (A–C)/(5–6).", X, "Cần xét miễn trừ ngăn cháy theo công năng (Đ.4.5) cho phòng kho và phòng kỹ thuật nước.", "", ""),
 47: ("Tường gạch 200 mm REI150; cửa phòng karaoke FD1 EI60 tự đóng; cửa D3 0,8×2,1 m (GHCL '-') mở ra hành lang E–D tại khu WC.", K, "Cửa D3 mở vào hành lang không phải cửa chống cháy (GHCL '-'); karaoke bắt buộc ngăn cách hành lang bằng bộ phận ngăn cháy (Đ.3.3.5).", "1", ""),
 50: ("Phòng karaoke: gian phòng chung có sprinkler (miễn theo 3.5.10). Hành lang: trần thạch cao không cháy, tường gạch trát xi măng; vật liệu sàn không ghi.", X, "Bảng B.8: hành lang chung F2.1 cần tường, trần CV1 và sàn CV2; thiếu vật liệu phủ sàn hành lang.", "8", ""),
 51: ("Cửa FD1 EI60 có tay co thủy lực, khe cửa chèn kín (chi tiết FD1, trang 10 và 22).", D, "Cửa FD1 có cơ cấu tự đóng (3.2.11). Riêng cửa D3 không phải cửa ngăn cháy (xem dòng 6.4).", "", ""),
 55: ("Tầng trệt: TL1 9,84%, TL2 10,35%, TL3 10,35%. Lầu 1: TL1 10,94%, TL2 9,72%, TL3 8,57% (đều dưới 25%).", X, "Số học tính lại khớp. Nhưng bảng chỉ tính cửa FD1; tường TL3 Lầu 1 (24,5 m) còn có hai cửa D3 không chống cháy, tầng trệt khu WC nằm ngoài TL3 (13,7 m). Điều 4.19 chưa nạp để so ngưỡng.", "11", ""),
 63: ("Cửa FD1 có tay co thủy lực tự đóng; khe cửa chèn kín.", D, "Phù hợp 3.2.11 đối với cửa FD1.", "", ""),
 64: ("FD1 EI60.", D, "EI60 không thấp hơn giới hạn EI15 của bộ phận bao che hành lang bậc II (3.3.5). Riêng cửa D3 xem dòng 6.4.", "", ""),
 67: ("Như dòng 6.4: tường 200 mm REI150, cửa FD1 EI60, riêng D3 không chống cháy.", K, "Cửa D3 mở vào hành lang không phải cửa chống cháy (Đ.3.3.5).", "1", ""),
 71: ("Không có tầng hầm.", N, "Không có tầng hầm.", "", ""),
 72: ("Tầng trệt: D1 (1,9×2,3 m) và D2 (1,5×2,1 m) ra ngoài qua hành lang; FD1 0,9×2,1 m từ buồng thang CT1 ra ngoài qua 3 bậc tam cấp trục (A–B)/1.", D, "Lối ra từ tầng 1 ra ngoài qua hành lang (3.2.1a); buồng thang CT1 có lối ra ngoài trực tiếp (3.4.7). Cửa FD1 cạnh P.kỹ thuật nước là cửa phòng dưới thang CT2, không tính là lối thoát nạn (khung 10).", "10", ""),
 73: ("Lầu 1: lối 1 vào buồng thang CT1 qua FD1 EI60; lối 2 ra D2 sang lối đi ngoài nhà có mái che rồi vào CT2 (cửa 900).", D, "Lối ra từ tầng khác vào buồng thang loại 1 (3.2.1b); đường tới cửa ra ngoài D2 tính theo quy ước, không tính tiếp trong buồng thang.", "", ""),
 75: ("Mỗi phòng một cửa FD1; phòng 10–13 người, diện tích 20–39 m².", D, "Phòng dưới 50 người, đường tới cửa dưới 25 m: một cửa là đủ (3.2.5d).", "", ""),
 76: ("Như trên.", D, "Phòng dưới 50 người, đường tới cửa dưới 25 m (3.2.5d).", "", ""),
 77: ("Tầng trệt 92 người, Lầu 1 105 người (tổng SL_LN các phòng).", D, "Tầng có từ 50 người trở lên cần ít nhất 2 lối ra (3.2.6.1b): tầng trệt 3 lối, Lầu 1 2 lối.", "", ""),
 78: ("Không có tầng hầm.", N, "Không có tầng hầm.", "", ""),
 79: ("Tầng trệt 3 lối (D1, D2, FD1 buồng thang CT1); Lầu 1 2 lối (CT1, D2 sang CT2).", D, "F2.1 và có từ 50 người: cần ít nhất 2 lối (3.2.6.1a, b).", "", ""),
 80: ("Tầng áp mái BTCT không sử dụng.", N, "Không có tầng kỹ thuật có người.", "", ""),
 81: ("Tầng 92–105 người.", N, "Vượt 20 người nên không đủ điều kiện một lối (3.2.6.2a); thiết kế dùng hai lối trở lên.", "", ""),
 82: ("Tầng trệt 3 lối ra ngoài; Lầu 1 2 lối.", D, "Số lối của nhà không ít hơn số lối của tầng nào (3.2.7).", "", ""),
 83: ("Tầng trệt: D = 32,3 m, khoảng giữa D1 và D2 khoảng 21 m (bản vẽ ghi L = 21 m). Lầu 1: khoảng giữa lối 1 (CT1) và D2 khoảng 21 m (đo ước lượng), D ≈ 31,8 m.", D, "Có sprinkler: yêu cầu L ≥ ⅓D = 10,8 m; thiết kế khoảng 21 m, cũng lớn hơn ½D = 16,2 m. Số đo ước lượng ±1–2 m.", "", ""),
 85: ("D1, D2 cửa kính hai cánh bản lề (luôn đóng, đẩy thủ công mở ra), FD1 cửa thép một cánh bản lề; không có cửa cuốn, cửa quay, cửa trượt trên lối ra.", D, "Phù hợp 3.2.3.", "", ""),
 86: ("Tầng trệt: D1, D2, FD1 (CT1) mở ra ngoài. Lầu 1: FD1 vào CT1 mở vào buồng thang, D2 mở ra ngoài. Cửa phòng FD1 mở vào phòng (phòng ≤ 15 người, miễn). Cửa vào CT2 Lầu 1 để trống không cánh.", D, "Lối vào CT2 Lầu 1 để trống, thông thủy lớn hơn 900 mm và cao hơn 1,9 m nên không còn vấn đề chiều mở; lắp cửa hay không do người thiết kế quyết định.", "", ""),
 88: ("D1 cao 2,3 m; D2 và FD1 cao 2,1 m.", D, "Yêu cầu cao thông thủy ≥ 1,9 m.", "", ""),
 89: ("Trệt: D1 1,9 m, D2 1,5 m (cửa kính hai cánh đẩy mở thủ công, cả hai cánh mở được), FD1 0,9 m. Lầu 1: lối 1 FD1 0,9×2,1 m; lối 2 D2 1,5×2,1 m (nhãn bản vẽ ghi 1,9 và 0,9 m là vẽ nhầm).", D, "Lối ra khỏi nhà (D1, D2) hơn 50 người: ≥ 1,2 m (3.2.9): D1 1,9 m, D2 1,5 m đạt. Lối vào buồng thang và cửa ra ngoài của buồng thang tính theo G.2.1.1 (165 người/m, bậc II): n = 105/165 = 0,64 m (trệt 0,56 m), FD1 0,9 m đạt. Cửa phòng ≥ 0,8 m: FD1 0,9 m đạt.", "", "4, 12"),
 90: ("Trệt: n yêu cầu 92/165 = 0,56 m; nếu D1 bị chặn còn D2 1,5 m và FD1 0,9 m. Lầu 1: n = 105/165 = 0,64 m; nếu D2 bị chặn toàn bộ 105 người qua FD1 0,9 m.", D, "Giả thiết một lối bị chặn (3.2.8): lối còn lại nhận toàn bộ người. Lầu 1: 105 người qua FD1 0,9 m, công suất 0,9 × 165 = 148 người, đạt. Trệt: D2 1,5 m hoặc FD1 0,9 m đều nhận đủ 92 người.", "", "12"),
 91: ("Không có tầng kỹ thuật.", N, "Không có tầng kỹ thuật có người.", "", ""),
 92: ("Trệt: 13,4 m + 7 m = 20,4 m (từ cửa phòng VIP 3 tới D1), về D2 7,4 m. Lầu 1: 13,1 m + 8,4 m = 21,5 m. Mật độ 92/64,46 = 1,43 và 105/60,15 = 1,75 người/m² (tính lại khớp).", D, "Bậc II, mật độ ≤ 2, cửa phòng ở giữa hai lối: giới hạn 60 m (G.2a); cả 20,4 m và 21,5 m đều nhỏ hơn 30 m nếu coi như hành lang cụt. Mẫu bảng ghi 'Bảng G2b' nhưng nội dung là Bảng G.2a.", "", "5"),
 94: ("Không dùng thang máy, thang cuốn; cửa 'chỉ dùng di chuyển nội bộ' (FD1 tầng trệt cạnh CT1) đã loại khỏi lối ra.", D, "Phù hợp 3.3.3.", "", ""),
 95: ("Hành lang rộng 1,7 m (E–D, B–C), chỗ hẹp nhất 1,2 m tại trục C/5–D/5; ghi chú 'bề rộng 1,2 m, cao lớn hơn 2,1 m'.", D, "Yêu cầu ≥ 1,2 m (hơn 50 người, công năng ngoài F1); chỗ hẹp bằng đúng giá trị tối thiểu.", "", ""),
 96: ("Hành lang cao lớn hơn 2,1 m.", D, "Yêu cầu ≥ 2 m.", "", ""),
 97: ("D1: 3 cấp bậc tam cấp vẽ ngoài cửa; FD1 trục (A–B)/1: chi tiết 3 bậc cao 150 mm (sàn +0,450 so với ±0,000); D2: đã xác nhận có bậc tam cấp.", D, "Chỗ giật cấp có từ 3 bậc (3.3.7). Nên ghi kích thước bậc tại D1 và D2 như chi tiết FD1.", "", "9"),
 100: ("CT1: vế thang 1,3 m. CT2: vế thang 0,9 m. Cửa lối ra 0,9 m.", D, "Yêu cầu ≥ 0,9 m và ≥ bề rộng cửa thoát nạn trên thang (3.4.1).", "", ""),
 101: ("Chưa ghi chiều cao bậc.", X, "Thiếu dữ liệu kiểm độ dốc ≤ 1:1 (3.4.2); cần ghi chiều cao bậc trên bản vẽ thang.", "", ""),
 102: ("Mặt bậc 250 mm (điều chỉnh từ 333 mm và 450 mm).", D, "Yêu cầu mặt bậc ≥ 25 cm; bằng đúng giá trị tối thiểu.", "", ""),
 103: ("Chưa ghi chiều cao bậc.", X, "Thiếu dữ liệu: yêu cầu 5–22 cm (3.4.2); cần ghi trên bản vẽ thang.", "", ""),
 104: ("Chưa ghi kích thước chiếu thang.", X, "Thiếu dữ liệu: chiếu thang phải ≥ bề rộng bản thang (3.4.3).", "", ""),
 107: ("P.kỹ thuật nước 9,52 m² và phòng kho nằm cạnh CT2; cửa FD1 cạnh P.kỹ thuật nước.", D, "Phòng nằm dưới thang CT2; cửa FD1 là cửa vào phòng, không phải lối thoát nạn. Nên ghi chú hướng mở không vào buồng thang (3.4.5).", "", "10"),
 109: ("Ô kính, cửa sổ lấy sáng buồng thang ghi lớn hơn 1,2 m² trên tường ngoài mỗi tầng (mặt đứng 1–6, F–A, A–F).", D, "Phù hợp 3.4.8a (L1).", "", ""),
 110: ("Chiếu sáng tự nhiên.", N, "Không dùng chiếu sáng nhân tạo.", "", ""),
 111: ("Cao PCCC 7,6 m, F2.1: CT1, CT2 cầu thang loại 1, buồng thang thông thường L1 (nhận diện từ hình: buồng kín, cửa FD1, ô lấy sáng trên tường ngoài).", D, "Không yêu cầu buồng thang không nhiễm khói N1 vì cao ≤ 28 m (3.4.13).", "", ""),
 112: ("CT1, CT2 loại 1.", N, "Không dùng thang loại 2.", "", ""),
 114: ("Không dùng thang loại 3.", N, "CT2 là buồng thang kín; lối đi ngoài nhà có mái che không phải thang.", "", ""),
 115: ("CT1, CT2 buồng thang L1.", D, "Nhà cao ≤ 28 m được dùng L1 (3.4.11).", "", ""),
 116: ("Không dùng L2.", N, "Không dùng L2.", "", ""),
 117: ("Không có thang cong.", N, "Không có thang cong.", "", ""),
 118: ("Không có N3.", N, "Không có buồng thang không nhiễm khói.", "", ""),
 119: ("Không có N1.", N, "Không có buồng thang không nhiễm khói.", "", ""),
 122: ("Thiết kế ghi cao PCCC nhỏ hơn 10 m nên không yêu cầu lối lên mái.", X, "Điều 6.6 chưa nạp.", "", ""),
 125: ("Công trình không có thang máy; cao PCCC 7,6 m.", N, "Không yêu cầu thang máy chữa cháy.", "", ""),
 138: ("Buồng thang L1, không có N2, N3.", N, "Cao ≤ 28 m: không yêu cầu hệ thống tăng áp.", "", ""),
 142: ("Hành lang trong dài khoảng 20–23 m mỗi nhánh, không có ô cửa mở thông gió tự nhiên. Bộ PCCC (file 02/12/2024, trang 43–48): hút khói cơ khí hành lang tầng trệt, Lầu 1; quạt 14 000 m³/h trên mái; bù khí tự nhiên bằng louver; tủ điều khiển ở phòng trực 24/24, liên động báo cháy.", X, "Hành lang dài hơn 15 m không thông gió tự nhiên phải thoát khói (D.2c): đã có hệ thống. Cần xác nhận số miệng hút theo D.6: hành lang tầng trệt khép vòng (E–D, B–C nối qua sảnh tây và lối trục 5) tổng khoảng 60 m chỉ có 2 miệng hút; D.6 cho mỗi miệng ≤ 45 m (thẳng), ≤ 30 m (gấp khúc), ≤ 20 m (vòng khép kín).", "7, 14", ""),
 143: ("Không có khoảng thông tầng.", N, "Không có sảnh hoặc khoảng thông tầng.", "", ""),
 144: ("Phòng lớn nhất 38,9 m² (Party 1).", N, "Phòng nhỏ hơn 50 m² (D.2g); phòng ≤ 200 m² có sprinkler được miễn (D.3a).", "", ""),
 145: ("Ống gió thép mạ kẽm dày 1,2 mm, toàn bộ chiều dài có sprinkler trên và dưới ống (trang 43–45); bảng bù khí: quạt 3,89 m³/s, lỗ bù 1 m², vận tốc ghi 3,2 m/s.", X, "Miễn GHCL ống theo D.9 chú thích 4 (đủ 3 điều kiện). Bảng bù khí không khớp: 3,89 m³/s chia 1 m² là 3,89 m/s, bảng ghi 3,2 m/s (vẫn nhỏ hơn 6 m/s). D.6 xem dòng 9.2.1.", "14", ""),
 147: ("Quạt hút khói đặt trên mái, có vách lưới B40 tránh người lạ tiếp cận (trang 46).", D, "Quạt đặt trên mái có bao che chống người lạ (D.9).", "", ""),
 148: ("Ống gió thép mạ kẽm 1,2 mm có sprinkler trên và dưới ống.", D, "Không yêu cầu GHCL ống theo D.9 chú thích 4.", "", ""),
 151: ("Thuộc bản vẽ PCCC (bình chữa cháy): chưa đối chiếu.", X, "TCVN 3890:2023 (mục 5.1) chưa nạp; bảng B45.", "", ""),
 157: ("Có hệ thống báo cháy trong bộ PCCC.", X, "Danh mục nhà bắt buộc (Phụ lục A TCVN 3890:2023) chưa nạp; chưa đối chiếu bản vẽ báo cháy với bảng B35.", "", ""),
 165: ("Có chữa cháy sprinkler (ghi chú vật liệu) và họng nước trong bộ PCCC.", X, "Danh mục nhà bắt buộc chưa nạp; chưa đối chiếu với bảng B38, B39.", "", ""),
 174: ("Có sprinkler toàn nhà (ghi chú trang 14–17, 20).", X, "Yêu cầu kỹ thuật theo TCVN 7336:2021 chưa nạp; cờ có sprinkler dùng để áp ⅓D và miễn vật liệu.", "", ""),
 191: ("Thuộc bản vẽ điện PCCC.", X, "Chưa đối chiếu bảng B48.", "", ""),
 195: ("Đèn EXIT, EXIT tầm thấp, đèn sự cố, sơ đồ chỉ dẫn thoát nạn; nguồn dự phòng ≥ 120 phút; biển cao 2,6 m; sơ đồ chỉ dẫn 600 × 400 mm (thuyết minh EX–EM, file PCCC trang 12–17).", D, "Phù hợp 3.3.1 và thuyết minh theo TCVN 13456:2022 (biển cao 2–2,7 m, khoảng cách ≤ 25 m, tầng từ 2 lối ra có sơ đồ chỉ dẫn). Chưa kiểm từng vị trí đèn.", "", ""),
 196: ("Thuyết minh EX–EM tính E = 0,4 × 10 000 / 820, ghi kết quả 12,19 lux; diện tích lối thoát ghi 1 601,7 m²; chiều cao biển tính H = 30/200 trong khi ghi khoảng cách quan sát 85 m.", D, "Yêu cầu độ rọi ≥ 1 lux (TCVN 13456:2022, 5.1.2): với 820 m² tính lại được 4,88 lux, với 1 601,7 m² được 2,50 lux, đều đạt. Biển cao 202 mm đạt nếu L = 30 m (H = 0,15 m); nếu L = 85 m thì cần 0,425 m: không đạt. Mặt bằng cho khoảng xa nhất khoảng 21–23 m nên L = 30 m hợp lý, ghi 85 m là nhầm.", "", "15"),
 201: ("Thuyết minh ghi mặt nạ lọc độc 1 chiếc/người, số lượng theo phòng hát lớn nhất mỗi tầng (trang 5).", X, "Phụ lục E TCVN 3890:2023 chưa nạp.", "", ""),
 203: ("Chống sét hiện hữu (hạng mục trong bộ PCCC).", X, "Chưa đối chiếu bảng B49.", "", ""),
 206: ("Biển 1: 1,5 × 3,5 m (mặt đứng ghi 3,4 m); biển 2: 2 × 20,2 m; ghi chú theo QCVN 17:2018.", X, "QCVN 17 chưa nạp; chiều cao biển 2 m bằng mức tối đa ghi trong ghi chú; mặt đứng và chi tiết lệch 3,4 m và 3,5 m.", "", ""),
}
HEADER = {
 "1. Tên công trình": "1. Tên công trình: Karaoke Hoàng Anh (cải tạo)",
 "2. Địa điểm xây dựng": "2. Địa điểm xây dựng: TĐS 14, TBĐS 30, phường Tân Phước Khánh, TP. Tân Uyên, tỉnh Bình Dương",
 "3. Chủ đầu tư": "3. Chủ đầu tư: Hộ kinh doanh Karaoke Hoàng Anh",
 "4. Cơ quan thiết kế": "4. Cơ quan thiết kế: Công ty TNHH Đầu tư và Phát triển Thương mại Dịch vụ Kiến Trung (bản vẽ kiến trúc, KT-16 đến KT-19, tháng 12/2024); bản vẽ PCCC: Công ty TNHH MTV Hoàng Quân Phát (02/12/2024)",
}
COLORS = {D: RGBColor(0x1B, 0x7F, 0x55), K: RGBColor(0xC0, 0x33, 0x2B), X: RGBColor(0xB3, 0x6B, 0x00), N: RGBColor(0x7B, 0x7A, 0x73), BL: RGBColor(0x24, 0x59, 0xA8)}
PDFCOL = {D: (0.1, 0.5, 0.33), K: (0.85, 0.1, 0.1), X: (0.9, 0.5, 0.0), N: (0.45, 0.45, 0.45), BL: (0.1, 0.35, 0.8)}


def body_rows(doc):
    rows, started = [], False
    for ch in doc.element.body:
        if ch.tag == qn("w:tbl"):
            for tr in ch.findall(qn("w:tr")):
                tcs = tr.findall(qn("w:tc"))
                first = "".join(t.text or "" for t in tcs[0].iter(qn("w:t"))).strip() if tcs else ""
                if first == "TT" and len(tcs) >= 5:
                    started = True
                    continue
                if started:
                    rows.append((tr, ch))
    return rows


def set_cell(tc, table, parts):
    cell = _Cell(tc, table)
    for p in cell.paragraphs[1:]:
        p._element.getparent().remove(p._element)
    p = cell.paragraphs[0]
    for r in list(p.runs):
        r._element.getparent().remove(r._element)
    for text, bold, color in parts:
        r = p.add_run(text)
        r.bold = bold
        if color is not None:
            r.font.color.rgb = color


import unicodedata
def _fold(t):
    t = t.replace("đ", "d").replace("Đ", "D")
    return "".join(c for c in unicodedata.normalize("NFD", t) if unicodedata.category(c) != "Mn").replace("–", "-")

def fill_docx():
    doc = Document(B15)
    for p in doc.paragraphs:
        t = p.text.strip()
        for k, v in HEADER.items():
            if t.startswith(k):
                for r in list(p.runs):
                    r._element.getparent().remove(r._element)
                p.add_run(v)
    rows = body_rows(doc)
    filled = 0
    for idx, (design, st, why, kh, chinh) in DONG.items():
        tr, tbl = rows[idx]
        tcs = tr.findall(qn("w:tc"))
        if len(tcs) < 6:
            print("bỏ qua dòng", idx, "chỉ có", len(tcs), "ô")
            continue
        table = Table(tbl, doc)
        set_cell(tcs[2], table, [(design, False, None)])
        parts = [(st + ". ", True, COLORS[st]), (why, False, None)]
        if kh:
            parts.append((" [Khung " + kh + "]", True, COLORS[K if st == K else X]))
        if chinh:
            parts.append((" [Chỉnh bản vẽ: khung " + chinh + "]", True, COLORS[BL]))
        set_cell(tcs[5], table, parts)
        filled += 1
    out = os.path.join(OUT, "B15_karaoke_Hoang_Anh_1_da_dien.docx")
    doc.save(out)
    print("docx:", out, "dòng đã điền", filled)
    return rows


def tom_tat_md(rows):
    def txt(tr, i):
        tcs = tr.findall(qn("w:tc"))
        return " ".join("".join(t.text or "" for t in tcs[i].iter(qn("w:t")))) if len(tcs) > i else ""
    cnt = {D: 0, K: 0, X: 0, N: 0}
    lines = ["# Bảng đối chiếu B15 đã điền – Karaoke Hoàng Anh 1 (kiến trúc 20-12-2024, PCCC 02-12-2024)", "",
             "Chỉ liệt kê các dòng đã xét. Các dòng còn lại của mẫu B15 chưa xét (xem báo cáo). Khung và văn bản gốc nằm trong file docx cùng thư mục.", "",
             "| # | TT | Nội dung đối chiếu | Khoản, Điều | Nội dung thiết kế | Kết luận và lý do | Khung |", "|---|---|---|---|---|---|---|"]
    for idx in sorted(DONG):
        design, st, why, kh, chinh = DONG[idx]
        cnt[st] += 1
        tr, _ = rows[idx]
        tt = re.sub(r"\s+", " ", txt(tr, 0)).strip()
        nd = re.sub(r"\s+", " ", txt(tr, 1)).strip()[:90]
        dieu = re.sub(r"\s+", " ", txt(tr, 4)).strip()[:50]
        khung = ", ".join(x for x in (("khung " + kh) if kh else "", ("chỉnh bản vẽ: khung " + chinh) if chinh else "") if x)
        lines.append("| %d | %s | %s | %s | %s | **%s.** %s | %s |" % (idx, tt, nd, dieu, design, st, why, khung))
    lines += ["", "## Tổng kết", "- ĐẠT: %d · CHƯA ĐẠT: %d · CẦN XÁC NHẬN: %d · KHÔNG ÁP DỤNG: %d" % (cnt[D], cnt[K], cnt[X], cnt[N])]
    open(os.path.join(OUT, "B15_da_dien_tom_tat.md"), "w", encoding="utf8").write("\n".join(lines) + "\n")
    print("tóm tắt:", cnt)
    return cnt


def resolve(src, page, spec):
    if spec[0] == "find":
        qs = spec[1] if isinstance(spec[1], list) else [spec[1]]
        hits = []
        for q in qs:
            hits = page.search_for(q)
            if hits:
                break
        r = hits[0]
        d = spec[2]
        return fitz.Rect(r.x0 + d[0], r.y0 + d[1], r.x1 + d[2], r.y1 + d[3])
    if src == "A":
        return fitz.Rect(*[v * 0.6 for v in spec])
    return fitz.Rect(*spec)


def ghi_chu_pdf(cnt):
    arch = fitz.open(ARCH_PDF)
    pccc = fitz.open(PCCC_PDF)
    doc = fitz.open()
    plan = []
    for n in ARCH_PAGES:
        doc.insert_pdf(arch, from_page=n - 1, to_page=n - 1)
        plan.append(("A", n))
    for n in PCCC_PAGES:
        doc.insert_pdf(pccc, from_page=n - 1, to_page=n - 1)
        plan.append(("P", n))
    for k, (src, n) in enumerate(plan):
        pg = doc[k]
        used = []
        first_rect = {}
        for (s, pn, num, spec) in KHUNG:
            if s != src or pn != n:
                continue
            st = ITEMS[num][0]
            col = PDFCOL[st]
            rect = resolve(s, pg, spec)
            a = pg.add_rect_annot(rect)
            a.set_colors(stroke=col)
            a.set_border(width=1.8)
            a.set_info(title="Tham dinh", content=_fold("Khung %d – %s: %s" % (num, st, ITEMS[num][1])))
            a.update()
            c = fitz.Point(rect.x0 - 1, rect.y0 - 1)
            pg.draw_circle(c, 6.5 if num < 10 else 7.5, color=col, fill=col)
            pg.insert_text(fitz.Point(c.x - (2.2 if num < 10 else 4.6), c.y + 2.8), str(num), fontsize=8, fontname="arialbd", fontfile=FONTB, color=(1, 1, 1))
            if num not in used:
                used.append(num)
                first_rect[num] = rect
        area = BLANK.get((src, n))
        if area is None:
            # chú thích ngay dưới khung đầu tiên
            for num in used:
                r = first_rect[num]
                st = ITEMS[num][0]
                box = fitz.Rect(r.x0, r.y1 + 6, r.x0 + 330, r.y1 + 6 + 38)
                pg.draw_rect(box, color=PDFCOL[st], fill=(1, 1, 1), width=0.8)
                pg.insert_textbox(box + (3, 2, -3, -1), "%d. [%s] %s" % (num, st, SHORT[num]), fontsize=6.8, fontname="arial", fontfile=FONT, color=PDFCOL[st])
            continue
        if src == "A":
            x0, y0, x1, y1 = [v * 0.6 for v in area]
        else:
            x0, y0, x1, y1 = area
        box = fitz.Rect(x0, y0, x1, y1)
        pg.draw_rect(box, color=(0.6, 0.1, 0.1), fill=(1, 1, 1), width=0.8)
        pg.insert_text(fitz.Point(x0 + 4, y0 + 10), "GHI CHÚ THẨM ĐỊNH (khung đánh số trên bản vẽ)", fontsize=8.0, fontname="arialbd", fontfile=FONTB, color=(0.6, 0.1, 0.1))
        y = y0 + 15
        cpl_unit = 3.55 if src == "A" else 3.45
        for num in sorted(used):
            st = ITEMS[num][0]
            line = "%d. [%s] %s" % (num, st, SHORT[num])
            chars_per_line = max(24, int((x1 - x0 - 8) / cpl_unit))
            nlines = max(1, -(-len(line) // chars_per_line))
            h = nlines * 8.4 + 2
            ret = pg.insert_textbox(fitz.Rect(x0 + 4, y, x1 - 4, y + h), line, fontsize=6.6, fontname="arial", fontfile=FONT, color=PDFCOL[st])
            if ret < 0:
                print(src, n, "khung", num, "tràn chữ", ret)
            y += h
        if y > y1:
            print(src, n, "danh sách vượt khung", round(y - y1, 1))
    # trang tổng hợp
    pg = doc.new_page(width=1191, height=842)
    pg.insert_text(fitz.Point(40, 50), "TỔNG HỢP THẨM ĐỊNH – KARAOKE HOÀNG ANH 1 (kiến trúc 20-12-2024, PCCC 02-12-2024)", fontsize=15, fontname="arialbd", fontfile=FONTB)
    pg.insert_text(fitz.Point(40, 72), "Bảng đối chiếu: mẫu chính thức B15 (karaoke, vũ trường). Số đo là ước lượng ±1–2 m, chưa đo trên CAD. Màu: đỏ CHƯA ĐẠT, cam CẦN XÁC NHẬN, xanh dương CHỈNH BẢN VẼ (sai sót hoặc thiếu ghi chú).", fontsize=9.5, fontname="arial", fontfile=FONT, color=(0.3, 0.3, 0.3))
    pg.insert_text(fitz.Point(40, 94), "Đã xét %d dòng của bảng B15: ĐẠT %d · CHƯA ĐẠT %d · CẦN XÁC NHẬN %d · KHÔNG ÁP DỤNG %d." % (sum(cnt.values()), cnt[D], cnt[K], cnt[X], cnt[N]), fontsize=11, fontname="arialbd", fontfile=FONTB)
    y = 118
    for num in sorted(ITEMS):
        st, text = ITEMS[num]
        col = PDFCOL[st]
        pg.draw_circle(fitz.Point(48, y + 6), 8, color=col, fill=col)
        pg.insert_text(fitz.Point(48 - (3 if num < 10 else 6), y + 10), str(num), fontsize=10, fontname="arialbd", fontfile=FONTB, color=(1, 1, 1))
        pg.insert_text(fitz.Point(66, y + 10), st, fontsize=9.5, fontname="arialbd", fontfile=FONTB, color=col)
        pg.insert_textbox(fitz.Rect(190, y, 1150, y + 40), text, fontsize=9.5, fontname="arial", fontfile=FONT)
        y += 36 if len(text) < 185 else 48
    out = os.path.join(OUT, "HoangAnh1_thoat_nan_co_ghi_chu.pdf")
    doc.save(out, garbage=3, deflate=True)
    print("pdf:", out)
    chk = fitz.open(out)  # xem lại từ file đã lưu (ảnh dựng từ bộ nhớ có thể lỗi font)
    for k, (src, n) in enumerate(plan):
        chk[k].get_pixmap(dpi=90).save(os.path.join(OUT, "_xem_%s%d.png" % (src, n)))
    chk[len(plan)].get_pixmap(dpi=80).save(os.path.join(OUT, "_xem_tong_hop.png"))


if __name__ == "__main__":
    rows = fill_docx()
    cnt = tom_tat_md(rows)
    ghi_chu_pdf(cnt)
