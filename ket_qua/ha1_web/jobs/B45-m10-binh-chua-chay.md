# Agent Mục 10 – Bình chữa cháy, phương tiện ban đầu
Bạn là cán bộ thẩm duyệt thiết kế PCCC. Việc: Loại, số lượng, khoảng cách bố trí bình chữa cháy.

## Nguyên tắc (bắt buộc)
1. Kết luận mỗi dòng chỉ nhận: DAT · CHUA_DAT · CAN_XAC_NHAN · KHONG_AP_DUNG, kèm lý do có số liệu ngay tại dòng và trích khoản, điều.
2. Thiếu dữ liệu trên bản vẽ, bản vẽ mâu thuẫn, hoặc quy chuẩn chưa có trong tri thức được cung cấp → CAN_XAC_NHAN, nói rõ thiếu gì. Không đoán thành DAT hay CHUA_DAT.
3. Không bịa trị số quy chuẩn: chỉ dùng tri thức được cung cấp và cột "Quy định" của bảng đối chiếu chính thức; không có thì ghi "cần tra".
4. Sai sót hoặc thiếu ghi chú đã rõ cách sửa (vd. ghi nhầm D1 thay FD1, thiếu ghi chú chiều cao PCCC) → ghi vào "chinh_ban_ve", KHÔNG đổi kết luận của thiết kế.
5. Dòng CHUA_DAT, CAN_XAC_NHAN hoặc có chinh_ban_ve: ghi "vi_tri" (trang và chữ bám "anchor" có thật trên trang, hoặc bbox 0–1000) để khoanh khung trên bản vẽ.
6. Dòng tiêu đề mục (không có nội dung cần xét) vẫn trả về với ket_luan KHONG_AP_DUNG và ly_do "dòng tiêu đề".
7. Số đo trên bản vẽ là ước lượng ±1–2 m nếu không có kích thước ghi: ghi chữ "ước lượng".

## Thông tin công trình (GĐ1, đã qua người dùng rà)
Tên: Cải tạo Karaoke Hoàng Anh · Công năng: karaoke (F2.1), hồ sơ điều chỉnh/cải tạo; phần không điều chỉnh giữ theo GCN thẩm duyệt số 214/TD-PCCC-P2 ngày 12/04/2018 · Địa điểm: KP Bình Hòa 2 (TĐS 14, TBĐS 30), P. Tân Phước Khánh, TP. Tân Uyên, tỉnh Bình Dương
- A01: F2.1 karaoke (nhóm nhà F2.1; công trình phụ trợ: phòng bơm PCCC, phòng trực PCCC, hành lang thoát nạn có mái che) [doc; trang 10 và 11, bảng thống kê (NHÓM NHÀ F2.1). Trang 9 (KT-05) ghi karaoke là (F1.2) trong bảng khoảng cách]
- A02: 2 tầng nổi (trệt, lầu 1), 0 tầng hầm, 0 tầng nửa hầm. Có tầng áp mái và mái BTCT +7.600 [doc; trang 10 và 11 (SỐ TẦNG 02, tham chiếu Bảng H.2/H.7 mục H.2.12.10); trang 12 (KT-08, mặt bằng tầng áp mái); trang 18 và 19 (mặt cắt)]
- A03: 7.6 [doc; trang 10 và 11, bảng thống kê (CHIỀU CAO PCCC 7.6 m; CHIỀU CAO MÁI 9.1 m). Cao độ sàn lầu 1 +4.000, mái BTCT +7.600, áp mái +8.500 (trang 12, 26). Trang 12 ghi chú: chiều cao PCCC < 10 m]
- A04: Diện tích 471.6 m² (bảng ghi chung, không nói rõ một tầng hay tổng); khối tích 4055.76 m³; mặt bằng trục 24.6 m x 20.2 m (khoảng 497 m² theo trục) [doc; trang 10 và 11, bảng thống kê; kích thước trục trang 12, 20. 4055.76 / 471.6 = 8.6 (suy)]
- A05: II [doc; trang 10 và 11 (BẬC CHỊU LỬA II); trang 5 (KT-01): yêu cầu thiết kế bậc II; cột/dầm R90, sàn REI45, tường ngoài E15, tường gạch 200 mm REI150. Mái che hành lang thoát nạn: bậc IV]
- A06: S0 [doc; trang 5 (KT-01, mục II, Bảng 5), trang 10 và 11 (CẤP NGUY HIỂM CHÁY S0); kết cấu chịu lực và tường ngoài K0]
- A07: Không áp dụng (không phải F5) [suy; suy từ A01 = F2.1]
- A08: Tầng trệt 93 người (bảng, trang 10; trang 20 tính toán dùng 92 và ghi chú 93). Lầu 1 105 người (trang 11, 21). Tổng số người lớn nhất của cả nhà chưa ghi rõ [doc; trang 10, 11, 20, 21]
- A09: Phòng VIP: 10 người/phòng, S 20.2 đến 26.1 m² (trệt VIP 1-8, lầu 1 VIP 9-16). Party 1: 38.9 m², 13 người. Party 2 và 3: 27.8 m², 12 người. Hạn chế số người ghi ngay trên cửa phòng [doc; trang 20 và 21, mặt bằng thoát nạn (ghi trong phòng: S, Svật dụng, SL)]
- A10: Tầng: D = 32.3 m (bản vẽ ghi). Phòng: không ghi [doc; trang 20, ghi D=32.3M. Kiểm bằng suy: sqrt(24.6² + 20.2²) = 31.8 m (lệch 0.5 m, lấy số bản vẽ ghi). Đường chéo D của từng phòng không có]
- B01: true [doc; trang 20 và 21 ghi chú: các gian phòng karaoke có chữa cháy tự động sprinkler; trang 96-99 mặt bằng sprinkler tầng trệt, lầu 1; trang 101 tính Qsp = 6.96 L/s. Chưa xác nhận bảo vệ toàn nhà (hành lang, WC, kho, thang)]
- B02: true [doc; trang 68-74: tủ trung tâm 08 zone đặt tại phòng trực PCCC, đầu báo nhiệt, nút nhấn, chuông đèn (trang 72, thuyết minh)]
- B03: Hành lang trong (tạm). Hành lang giữa các dãy phòng, có hút khói cơ khí và louver bù khí tự nhiên [tam; trang 20, 21 (mặt bằng thoát nạn); trang 108 (hút khói); chưa thấy ô cửa mở ra ngoài trực tiếp từ hành lang]
- B04: Không có sảnh thông tầng, 1 công năng (karaoke), 1 khoang cháy (tạm) [tam; trang 20, 21, 22. Không thấy lỗ thông tầng trên mặt bằng; công trình phụ trợ tách riêng bằng tường ngăn cháy 100 mm REI90 (trang 9)]
- B05: false [doc; trang 18 và 19 (mặt cắt A-A, B-B), trang 10 (SỐ TẦNG 02): không có tầng hầm hay nửa hầm]
- B06: Không có thang máy, không có thang máy chữa cháy [doc; không thấy thang máy ở mặt bằng và mặt cắt (trang 10-23); tìm chữ 'thang máy' trong cả bộ không có kết quả]
- B07: true [doc; trang 10 và 11 bảng ký hiệu: cửa sổ W1 1x1.4 m, W3 0.9x1 m, ô kính lấy sáng W2, W4, W5. Louver bù khí 500x1000 mm (SL 4, trang 16, 108, 111). Chưa xác nhận ô nào mở được]
- B08: Có phòng trực PCCC, phòng bơm PCCC, bể nước ngầm 45 m³ [doc; trang 9 (phòng bơm, phòng trực PCCC); trang 45-58 (kiến trúc phòng bơm, phòng trực); trang 101 (bể 45 m³ hiện hữu); trang 103 (chi tiết trạm bơm)]
- C01: Trệt: 2 lối ra ngoài, thoát nạn thứ 1 cửa D1 kính 1.9x2.3 m, thứ 2 cửa D2 kính 1.5x2.1 m; ghi 'cửa thoát nạn FD1 0.9x2.1 m'. Cửa phòng karaoke FD1 0.9x2.1 m EI60 tự đóng. Lầu 1: 2 lối qua thang CT1 và CT2, dòng chữ ghi '1 lối rộng 0.9 và 1 lối rộng 0.9 m' nhưng hình ghi lối thứ 1 là 1.9x2.1 m, thứ 2 là 0.9x2.1 m. Bề rộng yêu cầu n = 0.56 m (trệt), 0.64 m (lầu 1). Chiều mở cửa: chưa ghi [doc; trang 10, 20 (trệt); trang 11, 21 (lầu 1)]
- C02: Hai thang bộ CT1 và CT2 là thang thoát nạn, bê tông cốt thép, trong buồng thang kín có ô kính lấy sáng S ≥ 1.2 m² mỗi tầng (kiểu L1), cửa vào buồng thang EI60 tự đóng. Loại thang 1/2/3: chưa ghi, suy là loại 2 (trong buồng thang) [suy; trang 5 (ghi chú chung 3); trang 10 và 11 (nội dung điều chỉnh, chiếu sáng thang theo Điều 3.4.8 Sửa đổi 1); trang 25, 26 (chi tiết thang)]
- C03: Hành lang thoát nạn rộng 1.2 m, cao > 2.1 m (ghi chú). Tính S1 dùng các đoạn rộng 1.7 / 1.9 / 1.2 / 2.9 m. Trên đường thoát nạn không bố trí vật cản [doc; trang 20 và 21, ghi chú; trang 10 và 11 (điều chỉnh hành lang 1.8 thành 1.7 m, lối đi trục C/5 và D/5 1.4 thành 1.2 m)]
- C04: Cửa phòng karaoke dùng FD1 (EI60, cơ cấu tự đóng, khe cửa chèn kín). Cửa WC D4 0.8x1.9 m và cửa D3 0.8x2.1 m ghi GHCL '-' [doc; trang 10 và 11 (bảng ký hiệu, ghi chú 'các cửa gian phòng karaoke đều là cửa chống cháy'); trang 20-22 (ghi chú về cửa chống cháy)]
- C05: Tường bao che hành lang và gian phòng: tường gạch 200 mm trát 2 mặt, REI150; sàn BTCT REI150 (ghi chú trang 20 và 21, trong khi bảng kết cấu ghi sàn REI45); trần thạch cao không cháy. Ghi chú KT-18 kết luận 'không yêu cầu giải pháp ngăn cháy hành lang' vì L = 20.4 m [doc; trang 20, 21, 22]
- C06: Điểm xa nhất so với lối thoát nạn gần nhất: trệt L = 13.4 + 7 = 20.4 m; lầu 1 L = 13.1 + 8.4 = 21.5 m; cho phép 40 m (Bảng G.2a) [doc; trang 20 và 21, mục 'Tính toán khoảng cách thoát nạn']
- C07: S1 trệt = 13.4x1.7 + 7x4.1 + 1.4x1.7 + 4x1.2 + 2x2.9 = 64.46 m²; S1 lầu 1 = 13.1x1.7 + 8.4x1.9 + 4.5x1.7 + 1.5x1.2 + 4.3x2.9 = 60.15 m². Mật độ: trệt 1.43, lầu 1 1.75 người/m² (< 2) [doc; trang 20 và 21; kiểm tính lại các phép nhân đều khớp]
- C08: Trệt: khoảng cách giữa hai lối ra L = 21 m so với ⅓D (ghi 'L=21M > ⅓*D', D = 32.3 m nên ⅓D = 10.8 m). Lầu 1: không ghi [doc; trang 20 (đọc từ chữ trên hình)]
- C09: Gian phòng karaoke xem là gian phòng chung, có sprinkler, theo Điều 3.5.10 Sửa đổi 1 nên kết luận 'không yêu cầu cấp nguy hiểm cháy' đối với vật liệu hoàn thiện; trần thạch cao không cháy. Vật liệu hoàn thiện hành lang, buồng thang: chưa ghi [thieu; trang 20 và 21, 'Ghi chú vật liệu hoàn thiện']
- C10: CT2: bậc 250 mm x cao 160 mm, dốc 33°, vế thang 0.9 m (điều chỉnh từ 1.2 m), bậc thang đổi từ 450 mm thành 250 mm. CT1: bậc 250 mm (từ 333 mm), vế thang 1.3 m (từ 1.2 m), chiều cao bậc chưa đọc được [doc; trang 10 và 11 (nội dung điều chỉnh); trang 26 (chi tiết CT2); trang 25 (chi tiết CT1)]
- C11: Có hút khói cơ khí hành lang tầng trệt và lầu 1: miệng hút 400x400 mm, bù khí tự nhiên bằng louver (SL 4). Tủ điều khiển quạt đặt tại phòng trực PCCC, liên động báo cháy; không yêu cầu GHCL ống gió vì ống được bảo vệ bằng sprinkler. Công suất quạt chưa trích [doc; trang 107-115 (đặc biệt 107, 108, 112, 114)]
- C12: Có hệ thống đèn EX-EM (mặt bằng tầng trệt, lầu 1 và tầng khác, sơ đồ nguyên lý, thuyết minh). Chưa trích số lượng và độ rọi [doc; trang 76-81]
Hệ thống PCCC: Báo cháy tự động: có; Chữa cháy tự động sprinkler (nước, bọt): có; Họng nước chữa cháy trong nhà: có; Cấp nước chữa cháy ngoài nhà (trụ, ống): có; Trạm bơm, bể nước chữa cháy: có; Chống tụ khói (hút khói, tăng áp): có; Thang máy chữa cháy: không; Chống sét: có; Chữa cháy bọt cố định: không; Chữa cháy bằng khí (CO2, khí hoá lỏng, khí nén): không; Chữa cháy sol-khí: không; Cấp khí đốt trung tâm: không
Phân loại trang: 1: bìa – Hồ sơ xin phép thẩm duyệt PCCC, hạng mục kiến trúc; 2: bìa – Bìa phụ, chủ đầu tư và đơn vị tư vấn thiết kế; 3: khác – Tờ phân cách: Kiến trúc; 4: khác – Tờ phân cách: Karaoke; 5: thuyết minh – Thuyết minh công trình KT-01; 6: mặt bằng – Mặt bằng tổng thể cải tạo KT-02; 7: mặt bằng – Mặt bằng tổng thể cải tạo mái KT-03; 8: mặt bằng – Mặt bằng tổng thể cải tạo giao thông KT-04; 9: mặt bằng – Mặt bằng cải tạo khoảng cách an toàn PCCC KT-05; 10: bảng thống kê – Bảng thống kê và mặt bằng cải tạo tầng trệt karaoke KT-06; 11: mặt bằng – Mặt bằng cải tạo lầu 1 karaoke KT-07; 12: mặt bằng – Mặt bằng cải tạo tầng áp mái karaoke KT-08; 13: mặt bằng – Mặt bằng cải tạo tầng mái karaoke KT-09; 14: mặt đứng – Mặt đứng cải tạo 1-6 KT-10; 15: mặt đứng – Mặt đứng cải tạo 6-1 KT-11; 16: mặt đứng – Mặt đứng cải tạo F-A KT-12; 17: mặt đứng – Mặt đứng cải tạo A-F KT-13; 18: mặt cắt – Mặt cắt cải tạo A-A và ống xuyên sàn, xuyên tường ngăn cháy KT-14; 19: mặt cắt – Mặt cắt cải tạo B-B và ống xuyên sàn, xuyên tường ngăn cháy KT-15; 20: mặt bằng – Mặt bằng thoát nạn cải tạo tầng trệt karaoke KT-16; 21: mặt bằng – Mặt bằng thoát nạn cải tạo lầu 1 karaoke KT-17; 22: mặt bằng – Mặt bằng ngăn cháy cải tạo tầng trệt karaoke KT-18; 23: mặt bằng – Mặt bằng thoát nạn/ngăn cháy cải tạo lầu 1 karaoke KT-19; 24: mặt đứng – Chi tiết biển quảng cáo, mặt đứng F-A KT-20; 25: khác – Chi tiết cải tạo thang CT1 KT-21; 26: khác – Chi tiết cải tạo thang CT2 KT-22; 27: khác – Tờ phân cách: Công trình phụ trợ; 28: mặt bằng – Mặt bằng công trình phụ trợ KT-23; 29: mặt bằng – Mặt bằng mái công trình phụ trợ KT-24; 30: mặt đứng – Mặt đứng công trình phụ trợ trục 4-1 KT-25; 31: mặt đứng – Mặt đứng công trình phụ trợ trục 1-4 KT-26; 32: mặt đứng – Mặt đứng công trình phụ trợ trục A-B KT-27; 33: mặt đứng – Mặt đứng công trình phụ trợ trục B-A KT-28; 34: mặt cắt – Mặt cắt A-A công trình phụ trợ KT-29; 35: mặt cắt – Mặt cắt B-B công trình phụ trợ KT-30; 36: khác – Tờ phân cách: Khu vực mái che hành lang thoát nạn; 37: mặt bằng – Mặt bằng khu vực mái che hành lang thoát nạn KT-31; 38: mặt bằng – Mặt bằng mái khu vực mái che hành lang thoát nạn KT-32; 39: mặt đứng – Mặt đứng mái che hành lang thoát nạn trục B-A và A-B KT-33; 40: mặt đứng – Mặt đứng mái che hành lang thoát nạn trục 1-7 KT-34; 41: mặt đứng – Mặt đứng mái che hành lang thoát nạn trục 7-1 KT-35; 42: mặt cắt – Mặt cắt A-A mái che KT-36; 43: mặt cắt – Mặt cắt B-B khu vực mái che hành lang thoát nạn KT-37; 44: khác – Tờ phân cách: Phòng bơm PCCC; 45: mặt bằng – Mặt bằng phòng bơm KT-38; 46: mặt bằng – Mặt bằng mái phòng bơm KT-39; 47: mặt đứng – Mặt đứng 1-2 phòng bơm KT-40; 48: mặt đứng – Mặt đứng 2-1 phòng bơm KT-41; 49: mặt đứng – Mặt đứng B-A phòng bơm KT-42; 50: mặt đứng – Mặt đứng A-B phòng bơm KT-43; 51: mặt cắt – Mặt cắt A-A phòng bơm KT-44; 52: mặt cắt – Mặt cắt B-B phòng bơm KT-45; 53: khác – Tờ phân cách: Phòng trực PCCC; 54: mặt bằng – Mặt bằng phòng trực PCCC KT-46; 55: mặt bằng – Mặt bằng phòng trực PCCC KT-47; 56: mặt đứng – Mặt đứng A-B phòng trực PCCC KT-48; 57: mặt đứng – Mặt đứng 1-2 và 2-1 phòng trực PCCC KT-49; 58: mặt cắt – Mặt cắt A-A và B-B phòng trực PCCC KT-50; 59: khác – Tờ phân cách: Mái che; 60: mặt bằng – Mặt bằng mái che KT-51; 61: mặt bằng – Mặt bằng mái, mái che KT-52; 62: mặt đứng – Mặt đứng mái che KT-53; 63: mặt đứng – Mặt đứng mái che KT-54; 64: mặt cắt – Mặt cắt mái che KT-55; 65: bìa – Hồ sơ xin phép thẩm duyệt PCCC, hạng mục hệ thống PCCC; 66: bìa – Bìa phụ hạng mục PCCC (chủ đầu tư, đơn vị tư vấn PCCC); 67: khác – Tờ phân cách: Báo cháy; 68: báo cháy – Mặt bằng báo cháy; 69: báo cháy – Mặt bằng báo cháy, tầng trệt cải tạo; 70: báo cháy – Mặt bằng báo cháy (tầng khác); 71: báo cháy – Mặt cắt lắp đặt đầu báo cháy; 72: thuyết minh – Thuyết minh hệ thống báo cháy BC-05; 73: báo cháy – Sơ đồ nguyên lý hệ thống báo cháy; 74: báo cháy – Chi tiết lắp đặt hệ thống báo cháy; 75: khác – Tờ phân cách: Đèn EX-EM; 76: EX-EM – Mặt bằng đèn EX-EM; 77: EX-EM – Mặt bằng đèn EX-EM; 78: EX-EM – Mặt bằng đèn EX-EM; 79: EX-EM – Sơ đồ nguyên lý hệ thống đèn EX-EM; 80: EX-EM – Thuyết minh hệ thống đèn EX-EM; 81: EX-EM – Chi tiết lắp đặt hệ thống đèn EX-EM; 82: khác – Tờ phân cách: Bình chữa cháy; 83: chữa cháy – Mặt bằng bình chữa cháy (bột ABC, CO2 hiện hữu); 84: chữa cháy – Mặt bằng bình chữa cháy; 85: chữa cháy – Mặt bằng bình chữa cháy; 86: chữa cháy – Chi tiết lắp đặt bình chữa cháy; 87: khác – Tờ phân cách: Hệ thống âm thanh; 88: điện – Mặt bằng hệ thống âm thanh PCCC; 89: điện – Mặt bằng hệ thống âm thanh PCCC; 90: điện – Sơ đồ nguyên lý hệ thống âm thanh PCCC; 91: điện – Chi tiết lắp đặt hệ thống âm thanh PCCC; 92: khác – Tờ phân cách: Chữa cháy; 93: chữa cháy – Mặt bằng chữa cháy, trụ nước ngoài nhà và tuyến ống; 94: thuyết minh – Thuyết minh hệ thống chữa cháy CC-02; 95: chữa cháy – Mặt bằng chữa cháy (họng tiếp nước, tủ chữa cháy, bể ngầm); 96: chữa cháy – Mặt bằng chữa cháy sprinkler hướng xuống, tầng trệt; 97: chữa cháy – Mặt bằng chữa cháy sprinkler; 98: chữa cháy – Mặt bằng chữa cháy sprinkler; 99: chữa cháy – Mặt bằng chữa cháy sprinkler; 100: chữa cháy – Sơ đồ nguyên lý chữa cháy; 101: thuyết minh – Thuyết minh chữa cháy, tính bể nước và bơm CC-09; 102: chữa cháy – Mặt cắt lắp đặt đầu phun sprinkler; 103: chữa cháy – Chi tiết trạm bơm PCCC; 104: chữa cháy – Chi tiết lắp đặt 01; 105: chữa cháy – Chi tiết lắp đặt 02; 106: khác – Tờ phân cách: Hút khói; 107: hút khói – Mặt bằng hút khói tổng thể; 108: hút khói – Mặt bằng hút khói tầng trệt; 109: hút khói – Mặt bằng hút khói; 110: hút khói – Mặt bằng hút khói; 111: hút khói – Mặt đứng bố trí louver bù khí tự nhiên; 112: hút khói – Tính toán hệ thống hút khói HK-06; 113: chữa cháy – Mặt cắt lắp đặt đầu phun sprinkler phía trên và phía dưới ống gió; 114: hút khói – Sơ đồ nguyên lý hệ thống hút khói; 115: hút khói – Chi tiết lắp đặt hệ thống hút khói; 116: khác – Tờ phân cách: Chống sét hiện hữu; 117: điện – Mặt bằng chống sét hiện hữu (kim thu sét LIVA Rp = 35 m); 118: khác – Tờ phân cách: Cấp điện; 119: điện – Sơ đồ nguyên lý cấp điện PCCC; 120: thuyết minh – Thuyết minh hệ thống cấp điện PCCC

## Bản vẽ
- PDF: ket_qua/ha1_web/ban_ve.pdf (120 trang). Đọc bằng Read với tham số pages (tối đa 20 trang mỗi lần); chỉ mở trang cần (xem phân loại trang).
- Chữ có vị trí: ket_qua/ha1_web/chu/trang_<n>.txt, mỗi dòng "x y chữ" (toạ độ 0–1000, gốc trên-trái). Dùng Grep để tìm ký hiệu (cửa D3, FD1, tên phòng, cao độ) và lấy "anchor".

## Tri thức
Không có module riêng: dùng cột "Quy định" của bảng đối chiếu (đã trích sẵn điều khoản) làm căn cứ, ghi nguồn "bảng đối chiếu chính thức".

## Các dòng cần xét – bảng B45, mục "Bảng đối chiếu trang bị phương tiện chữa cháy ban đầu" (34 dòng)
#0 | TT 1 | Bình chữa cháy xách tay
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#1 | TT - | Yêu cầu trang bị
   Gợi ý đọc bản vẽ: -
   Quy định: - Tất cả các khu vực trong nhà và công trình kể cả những nơi đã được trang bị hệ thống chữa cháy phải trang bị bình chữa cháy xách tay hoặc bình chữa cháy có bánh xe.
   Khoản, Điều: Điều 5.1.1.1 / TCVN 3890:2023 | Tra ở: bảng hệ thống B34–B50
#2 | TT - | Phân loại đám cháy
   Gợi ý đọc bản vẽ: -
   Quy định: Kí hiệu lọai đám cháy / Đặc tính của loại đám cháy / Kí hiệu nhóm đám cháy / Đặc tính của nhóm đám cháy / A / Cháy chất rắn / A1 / Cháy các chất rắn với quá trình cháy âm ỉ (Thí dụ : gỗ, giấy, cỏ khô, rơm rạ, than, sản phẩm dệt) / A2 / Cháy các chất rắn nhưng không có quá trình cháy âm ỉ. (Thí dụ : Chất dẻo) / B / Cháy chất lỏng / B1 / Cháy chất lỏng không tan trong nước (Thí dụ : xăng ete, nhiên liệu dầu mỏ); cháy chất rắn hóa lỏng (thí dụ : paraphin) / B2 / Cháy các chất lỏng hòa tan trong nước (thí dụ : rượu, Metanol, glyxêrin) / C / Cháy các chất khí (thí dụ : Metan, hyđro, Propan...) / D / Cháy các kim loại / D1 / Cháy các chất kim loại nhẹ (Thí dụ: nhôm, manhê và hợp kim của chúng) / D2 / Cháy kim loại kiềm và các kim loại đồng dạng khác (thí dụ: natri, kali) / D3 / Cháy các hợp chất có chứa kim loại (Thí dụ: các hợp chất hữu cơ kim loại, hydrua kim loại)
   Khoản, Điều: Điều 2, Bảng 1 TCVN 5760:1993 | Tra ở: bảng hệ thống B34–B50
#3 | TT - | Loại mức nguy hiểm
   Gợi ý đọc bản vẽ: -
   Quy định: - Loại mức nguy hiểm được xác định theo bảng D.1 TCVN 7435-2 / Bảng D.1 - ví dụ tiêu chí đặc biệt để lựa chọn các loại mức nguy hiểm. / Thông số / Loại mức nguy hiểm / Thấp / Trung bình / Cao / Chiều cao công trình / Đến 25 / Không quy định / Trên 25 / Số lượng người / Dưới 15 / Từ 15 đến 250 / Trên 250 / Diện tích bề mặt công trình (m2) / Dưới 300 / Từ 300 đến 3000 / Trên 3000 / Khí dễ cháy (lít) / Dưới 500 / Từ 500 đến 3000 / Trên 3000 / Chất lỏng dễ cháy (lít) / Dưới 250 / Từ 250 đến 1000 / Trên 1000 / Chất lỏng cháy được (lít) / Dưới 500 / Từ 1000 đến 2000 / Trên 2000
   Khoản, Điều: bảng D.1 TCVN 7435-2 | Tra ở: MOD_chong_khoi_PL_D
#4 | TT - | Lựa chọn, tính toán bình chữa cháy
   Gợi ý đọc bản vẽ: -
   Quy định: Lựa chọn bình chữa cháy / - Loại bình chữa cháy được lựa chọn phải có chất chữa cháy phù hợp với loại đám cháy, hiệu quả các chất chữa cháy quy định tại bảng 1 TCVN 3890:2023 / Bảng 1 – Hiệu quả chữa cháy của các chất chữa cháy / Chất chữa cháy / Hiệu quả chữa cháy các loại đám cháy / A / B / C / D / A1 / A2 / B1 / B2 / D1 / D2 / D3 / Nước / ++ / - / - / - / Bọt, chất chữa cháy gốc nước / Chất chữa cháy gốc nước / ++ / + / - / - / Bọt có bội số nở cao / + / - / ++ / + / - / - / Bọt có bội số nở thấp và trung bình / + / + / ++ / + / - / - / Khí / CO2 / - / + / + / - / Nitơ, HFC-227ea, Inergen, Argon, FK 5-1-12… / + / + / + / - / Bột / Bột BC / - / ++ / ++ / - / Bột ABC / + / - / Bột ABCD / ++ / - / Aerosol (Sol khí) / + / + / + / - / CHÚ THÍCH: / Phân loại cháy theo quy định của TCVN 4878 và TCVN 5760. / Dấu “++” Rất hiệu quả. / Dấu “+” Chữa cháy thích hợp. / Dấu “-“ Chữa cháy không thích hợp. / Bột BC Bột dùng chữa các đám cháy có ký hiệu B, C. / Bột ABC Bột dùng chữa các đám cháy có ký hiệu A, B, C. / Bột ABCD Bột dùng chữa các đám cháy có ký hiệu A, B, C và D / - Chất chữa cháy khí chỉ trang bị cho khu vực đảm bảo thời gian duy trì nồng độ dập tắt theo quy định tại TCVN 7161-1, TCVN 6101, TCVN 13333. Chất chữa cháy CO2 chỉ sử dụng tại các khu vực thường xuyên không có người.
   Khoản, Điều: Điều 4.4 / TCVN 3890:2023; | Tra ở: bảng hệ thống B34–B50
#5 | TT - | Tính toán số lượng bình chữa cháy
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#6 | TT + | Tính toán số bình chữa cháy với mối nguy hiểm loại A.
   Gợi ý đọc bản vẽ: -
   Quy định: - Bình chữa cháy đối với các loại nguy hiểm khác nhau được cung cấp trên cơ sở bảng 1 / Loại nguy hiểm / Công suất bình chữa cháy nhỏ nhất / Khoảng cách di chuyển lớn nhất tới bình chữa cháy, m / Diện tích bảo vệ lớn nhất của 1 bình chữa cháy, m2 / Thấp / 2-A / 20 / 300 / Trung bình / 3-A* / 20 / 150 / Cao / 4-A* / 15 / 100 / * Hai bình chữa cháy kiểu nước công suất 2-A được bố trí liền kề có thể được sử dụng để thực hiện các yêu cầu đối với bình chữa cháy công suất 3-A hoặc 4-A. / - Mỗi tầng (sàn) phải được trang bị ít nhất hai bình chữa cháy như quy định trong bảng 1 TCVN 7435-1:2004
Lưu ý: Đối với tầng có diện tích nhỏ hơn 100m2 có thể chỉ trang bị 1 bình chữa cháy / - Các yêu cầu bảo vệ có thể được thực hiện bằng các bình chữa cháy có công suất lớn hơn, miễn là khoảng cách di chuyển tới các bình chữa cháy không vượt quá khoảng cách quy định trong bảng 1 TCVN 7435-1:2004
   Khoản, Điều: Điều 7.2.1 TCVN 7435-1:2004 / Điều 7.2.2 TCVN 7435-1:2004 / Điều 7.2.3 TCVN 7435-1:2004 | Tra ở: bảng hệ thống B34–B50
#7 | TT + | Tính toán số bình chữa cháy với mối nguy hiểm loại B (trừ mối nguy hiểm của chất lỏng cháy có chiều dày quá 0,6 cm) và đối với mối nguy hiểm loại C
   Gợi ý đọc bản vẽ: -
   Quy định: - Các bình chữa cháy dùng cho các loại nguy hiểm này phải được trang bị trên cơ sở bảng 2 TCVN 7435-1:2004 / Loại nguy hiểm / Công suất chữa cháy lớn nhất / Khoảng cách di chuyển lớn nhất tới bình chữa cháy, m / Diện tích bảo vệ lớn nhất của 1 bình chữa cháy, m2 / Thấp / 55 B / 15 / 300 / Trung bình / 144 B / 15 / 150 / Cao / 233 B / 15 / 100 / Lưu ý: Bình chữa cháy công suất nhỏ hơn, dùng cho các mối nguy hiểm riêng nhỏ bên trong khu vực nguy hiểm chung, có thể được sử dụng nhưng không được xem xét như là thực hiện bất kỳ phần nào của các yêu cầu trong bảng 2. / - Đối với đám cháy chất khí và chất lỏng cháy nén: / + Bình chữa cháy chứa chất chữa cháy khác bột nói chung không có hiệu quả đối với đám cháy khí nén và chất lỏng cháy nén. Việc lựa chọn bình chữa cháycho loại nguy hiểm này được thực hiện trên cơ sở các khuyến nghị của nhà sản xuất các thiết bị chuyên dùng này. Hệ thống bình chữa cháy có lưu lượng phun hiệu quả đối với đám cháy loại B không sử dụng cho loại đám cháy này. Việc sử dụng vòi phun đặc biệt và công suất của chất chữa cháy được quy định để đối phó với các mối nguy hiểm đó. / Cảnh báo: Không mong muốn cố gắng dập tắt loại đám cháy này trừ khi có đảm bảo hợp lý rằng có thể ngắt ngay lập tức nguồn năng lượng này. / +  Bình chữa cháy trang bị ở khu vực có mối nguy hiểm loại B ba chiều bao gồm: vật liệu loại B di động, như chất lỏng cháy đang rót, chuyển động hoặc chảy nhỏ giọt, phải được lựa chọn trên cơ sở các khuyến nghị của nhà chế tạo bình chữa cháy. Hệ t…
   Khoản, Điều: Điều 7.3.1 TCVN 7435-1:2004 / Điều 6.4 TCVN 7435-1:2004 / Điều 7.3.2 TCVN 7435-1:2004 / Điều 7.3.3 TCVN 7435-1:2004 / Điều 7.3.4 TCVN 7435-1:2004 | Tra ở: MOD_loi_ra_va_cua
#8 | TT + | Tính toán số bình chữa cháy với mối nguy hiểm loại B của chất lỏng cháy có chiều dày quá 0,6 cm
   Gợi ý đọc bản vẽ: -
   Quy định: - Không được bố trí bình chữa cháy như là biện pháp bảo vệ duy nhất đối với mối nguy hiểm do chất lỏng cháy ở độ sâu, có thể xác định được (lớn hơn 0,6cm) khi diện tích bề mặt lớn hơn 1m2. / - Đối với chất lỏng cháy ở độ sâu có thể xác định được như ở trong thùng nhúng hoặc thùng tôi, phải trang bị bình chữa cháy loại B trên cơ sở thế chữa cháy ít nhất 144B trên 1 mét vuông (144B/m2) của diện tích cháy ước lượng lớn nhất. / Chú thích 1: Khi hệ thống hoặc thiết bị chữa cháy tự động được chuẩn y lắp đặt đối với mối nguy hiểm chất lỏng cháy, có thể bỏ bình chữa cháy xách tay loại B. Khi bị loại bỏ, bình chữa cháy loại B được trang bị theo phạm vi của 7.3.1 để bảo vệ các vùng nguy hiểm riêng của các mối nguy hiểm được bảo vệ đó. / Chú thích 2: Bình chữa cháy loại AFFF hoặc FFFP có thể được trang bị trên cơ sở 89B cho 1m2 của nơi có mối nguy hiểm. / - Không được sử dụng hai hoặc nhiều hơn bình chữa cháy có công suất thấp hơn để thay thế bình chữa cháy được quy định với thùng chứa lớn nhất. / Chú thích: Có thể sử dụng đến 3 bình chữa cháy loại AFFF hoặc FFFP để thực hiện các yêu cầu của một bình chữa cháy có công suất quy định, nếu tổng công suất của các bình đó bằng hoặc lớn hơn công suất quy định nhỏ nhất. / - Khi kích thước của mối nguy hiểm loại B có ở độ sâu có thể xác định được không thể bảo vệ được bằng bình chữa cháy xách tay, có thể xem xét việc sử dụng xe đẩy chữa cháy nếu chúng có khả năng chống lại mối nguy hiểm đó. Khi sử dụng các xe đẩy chữa cháy như vậy, bình chữa ch…
   Khoản, Điều: Điều 7.4 TCVN 7435-1:2004 | Tra ở: bảng hệ thống B34–B50
#9 | TT + | Tính toán số bình chữa cháy với mối nguy hiểm điện
   Gợi ý đọc bản vẽ: -
   Quy định: - Mối nguy hiểm điện bao gồm cả mối nguy hiểm trực tiếp xung quanh thiết bị điện. / - Tùy theo mối nguy hiểm là loại A hoặc loại B, kích cỡ và nơi bố trí các bình chữa cháy phải trên cơ sở mối nguy hiểm loại A hoặc loại B đã biết. / - Nơi có các thiết bị điện, các bình chữa cháy phải được đảm bảo là thích hợp cho việc sử dụng trên các thiết bị điện và được ghi nhãn như vậy. / - Thiết bị điện phải được ngắt càng nhanh càng tốt để chống cháy lại.
   Khoản, Điều: Điều 7.5 TCVN 7435-1:2004 | Tra ở: bảng hệ thống B34–B50
#10 | TT + | Tính toán số bình chữa cháy đối với mối nguy hiểm loại D
   Gợi ý đọc bản vẽ: -
   Quy định: - Phải trang bị bình chữa cháy loại D đối với các mối nguy hiểm do kim loại cháy gây ra. / - Khoảng cách di chuyển tới bình chữa cháy loại D không được quá 20m. / - Cỡ và số lượng bình chữa cháy được xác định trên cơ sở kim loại cháy riêng, cỡ hạt vật lý của chúng và diện tích bao phủ
   Khoản, Điều: Điều 7.6 TCVN 7435-1:2004 | Tra ở: bảng hệ thống B34–B50
#11 | TT - | Tính năng và cấu tạo
   Gợi ý đọc bản vẽ: -
   Quy định: Bình chữa cháy xách tay và bình chữa cháy có bánh xe phải đảm bảo tính năng và cấu tạo được quy định tại TCVN 7026, TCVN 7027.
   Khoản, Điều: Điều TCVN 3890:2023 | Tra ở: bảng hệ thống B34–B50
#12 | TT - | Bố trí
   Gợi ý đọc bản vẽ: -
   Quy định: 5.1.1.6 Bình chữa cháy được bố trí theo thiết kế, ở vị trí dễ thấy, dễ lấy và nên có màu đỏ, trường hợp khó nhận biết có thể sử dụng các chỉ dẫn vị trí và theo các quy định tại Điều 5 TCVN 7435-1. Không được để bình chữa cháy tập trung một chỗ trừ trường hợp để trong kho dự trữ theo quy định tại 5.1.1.5. / Bình chữa cháy phải luôn sẵn sàng để sử dụng ngay lập tức và được bố trí tại: / a) Nơi mà những người theo đường thoát nạn sẽ dễ dàng nhìn thấy chúng; / b) Phù hợp nhất, gần lối ra vào phòng, cầu thang, hành lang và lối đi; / c) Ở các vị trí tương tự trên mỗi tầng, nơi các tầng có cấu trúc giống nhau. / Không đặt các bình chữa cháy ở các khu vực, vị trí sau: / a) Khi đám cháy tiềm ẩn có thể ngăn cản việc tiếp cận chúng; / b) Gần các thiết bị sinh nhiệt mà có thể làm ảnh hưởng chất lượng, hiệu quả của bình chữa cháy; / c) Ở những vị trí khuất sau cửa ra vào, trong tủ không quan sát được bình chữa cháy hoặc hốc sâu; / d) Nơi chúng có thể gây cản trở lối thoát nạn; / e) Ở các vị trí trong phòng hoặc hành lang cách xa lối ra trừ trường hợp cần thiết đối với nguy hiểm cháy; / f) Nơi chúng có thể bị hỏng do các hoạt động thường ngày.
   Khoản, Điều: Điều 5.1.1.5 TCVN 3890:2023 | Tra ở: bảng hệ thống B34–B50
#13 | TT - | Lượng dự trữ
   Gợi ý đọc bản vẽ: -
   Quy định: Phải có số lượng bình chữa cháy dự trữ không ít hơn 10% tổng số bình theo tính toán để trang bị thay thế khi cần thiết (cho phép không quá 100 bình mỗi loại).
   Khoản, Điều: Điều 5.1.1.5 TCVN 3890:2023 | Tra ở: bảng hệ thống B34–B50
#14 | TT 2 | Trang bị, bố trí bình bột chữa cháy tự động kích hoạt loại treo
   Gợi ý đọc bản vẽ: Việc trang bị, bố trí bình bột chữa cháy tự động kích hoạt loại treo phải theo quy định tại mục 5.1.2 của TCVN 3890:2023. Trong đó lưu ý, bình bột chữa cháy tự động kích hoạt loại treo được khuyến khích trang bị nhằm bảo vệ cho các khu vực bếp, các phòng nồi hơi, giặt là có diện tích không quá 100 m…
   Quy định: Các bình bột chữa cháy tự động kích hoạt loại treo phải phù hợp với TCVN 12314-1. / Căn cứ điều kiện thực tế của nhà và công trình, có thể lắp đặt ở mặt tường hoặc treo trên trần nhà, với chiều cao thích hợp sao cho đảm bảo diện tích bảo vệ hữu hiệu theo công bố của đơn vị sản xuất. Trong bất kỳ trường hợp nào phải đảm bảo khoảng cách từ bộ phận cảm biến nhiệt đến trần nhà là không quá 40 cm. / Bình bột chữa cháy tự động kích hoạt loại treo có thể được trang bị tại khu vực bếp của nhà hàng, các phòng nồi hơi, giặt là có diện tích không quá 100 m2. Nếu lắp đặt tại khu vực có diện tích trên 100 m2 thì nên phân chia thành các khu vực có diện tích đến 100 m2 bằng tường ngăn cháy (có giới hạn chịu lửa không thấp hơn REI 45) hoặc vách ngăn cháy (có giới hạn chịu lửa không thấp hơn EI 45).
   Khoản, Điều: Điều 5.1.2.1 TCVN 3890:2023 / Điều 5.1.2.2 TCVN 3890:2023 / Điều 5.1.2.3 TCVN 3890:2023 | Tra ở: bảng hệ thống B34–B50
#15 | TT 3 | Trang bị, bố trí bình khí chữa cháy tự động kích hoạt.
   Gợi ý đọc bản vẽ: -
   Quy định: Bình khí chữa cháy tự động kích hoạt phải phù hợp với TCVN 12314-2. / Cho phép trang bị bình khí chữa cháy tự động kích hoạt (có thiết kế bổ sung chức năng giám sát xả, tín hiệu xả phải được truyền về tủ trung tâm báo cháy) thay thế hệ thống chữa cháy tự động bằng khí tại các khu vực không thường xuyên có người với diện tích không quá 100 m2. Nếu lắp đặt tại khu vực có diện tích trên 100 m2 thì phải phân chia thành các khu vực có diện tích không quá 100 m2 bằng tường ngăn cháy (có giới hạn chịu lửa không thấp hơn REI 45) hoặc vách ngăn cháy (có giới hạn chịu lửa không thấp hơn EI 45).
   Khoản, Điều: Điều 5.1.3.1 TCVN 3890:2023 / Điều 5.13.2 TCVN 3890:2023 | Tra ở: MOD_loi_ra_va_cua
#16 | TT 4 | Phương tiện chữa cháy cơ giới
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#17 | TT - | Yêu cầu trang bị
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: Bảng D.1 TCVN 3890:2023 | Tra ở: MOD_chong_khoi_PL_D
#18 | TT - | Yêu cầu kỹ thuật
   Gợi ý đọc bản vẽ: -
   Quy định: Các kho, cảng hàng không, cảng biển, cơ sở trọng điểm về kinh tế, chính trị, văn hoá - xã hội, khu công nghiệp, khu chế xuất, khu công nghệ cao, cụm công nghiệp ngoài việc trang bị hệ thống chữa cháy, phải trang bị phương tiện chữa cháy cơ giới theo Tiêu chuẩn TCVN 13316 Phòng cháy chữa cháy – Xe ô tô chữa cháy các phần và các tiêu chuẩn quốc gia, các tiêu chuẩn quốc tế, tiêu chuẩn nước ngoài được phép áp dụng tại Việt Nam. Phương tiện chữa cháy cơ giới trang bị phải đáp ứng số lượng tối thiểu theo quy định tại Phụ lục D. / TT / Đối tượng / Quy mô / Xe chữa cháy, chiếc / Tàu chữa cháy, chiếc / Máy bơm chữa cháy loại khiêng tay, chiếc / 1 / Kho / 1.1 / Kho dự trữ / cấp Quốc gia / 1 / 1.2 / Kho dự trữ / cấp Bộ, ngành / 1 / 1.3 / Kho dầu mỏ và các sản phẩm dầu mỏ / Tổng dung tích trên / 100 000 m3 / 2 / 1.4 / Kho dầu mỏ và các sản phẩm dầu mỏ / Tổng dung tích từ / 50 000 đến 100 000 m3 / 1 / 1.5 / Kho dầu mỏ và các sản phẩm dầu mỏ / Tổng dung tích nhỏ hơn 50 000 m3 / 1 / 2 / Cảng hàng không, cảng biển / 2.1 / Cảng hàng không / Quốc tế / 3 / 2.2 / Cảng hàng không / Nội địa / 2 / 2.3 / Cảng biển / Loại đặc biệt, loại I / 2 / 1 / 2.4 / Cảng biển / Loại II / 1 / 1 / 2.5 / Cảng biển / Loại III / 1 / 3 / Cơ sở sản xuất / 3.1 / Nhà máy nhiệt điện1) / Công suất từ 200 MW trở lên / 1 / 3.2 / Nhà máy thuỷ điện1) / Công suất từ 300 MW trở lên / 1 / 3.3 / Nhà máy nhiệt điện, thủy điện / Có công suất nhỏ hơn công suất trên / 1 / 3.4 / Nhà máy điện hạt nhân / Không phụ thuộc vào công suất / 2…
   Khoản, Điều: Điều 5.5.1 TCVN 3890:2023 | Tra ở: bảng hệ thống B34–B50
#19 | TT - | 
   Gợi ý đọc bản vẽ: -
   Quy định: Xe chữa cháy, tàu chữa cháy, máy bơm chữa cháy loại khiêng tay trang bị cho nhà, công trình đảm bảo các yêu cầu sau: / a) Có đặc tính kỹ thuật và tính năng chữa cháy phù hợp với loại nhà, công trình cần bảo vệ; / b) Có chất chữa cháy, phương tiện, dụng cụ trang bị kèm theo đúng quy định; / c) Máy bơm chữa cháy loại khiêng tay phải đáp ứng yêu cầu kỹ thuật quy định tại TCVN 12110.
   Khoản, Điều: Điều 5.5.2 TCVN 3890:2023 | Tra ở: bảng hệ thống B34–B50
#20 | TT 3 | Phương tiện, dụng cụ phá dỡ thô sơ; mặt nạ lọc độc và mặt nạ phòng độc cách ly.
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#21 | TT 3.1 | Phương tiện, dụng cụ phá dỡ thô sơ.
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#22 | TT - | Yêu cầu trang bị
   Gợi ý đọc bản vẽ: -
   Quy định: Nhà, công trình phải trang bị phương tiện, dụng cụ phá dỡ thô sơ được quy định tại Phụ lục E. / STT / Đối tượng / Quy mô / Số lượng / Nhà sản xuất / Không phụ thuộc quy mô / 1 bộ dụng cụ phá dỡ thô sơ gồm: / + Rìu cứu nạn (trọng lượng 2 kg, cán dài 90 cm, chất liệu thép cacbon cường độ cao); / + Xà beng (một đầu nhọn, một đầu dẹt, dài 100 cm); / + Búa tạ (thép cacbon cường độ cao, nặng 5kg, cán dài 50 cm); / + Kìm cộng lực (dài 60 cm, tải cắt 60 kg). / Nhà kho / Nhà ở tập thể, khách sạn, chung cư, cửa hàng ăn uống / Các cơ quan hành chính, trường học, bệnh viện / Nhà ga, các loại công trình công cộng khác / Nhà hát, rạp chiếu phim, hội trường, kinh doanh dịch vụ karaoke, vũ trường, quán bar, hộp đêm / Chợ, trung tâm thương mại kiên cố và bán kiên cố
   Khoản, Điều: Phụ lục E TCVN 3890:2023 | Tra ở: bảng hệ thống B34–B50
#23 | TT - | Bố trí
   Gợi ý đọc bản vẽ: -
   Quy định: Phương tiện, dụng cụ phá dỡ thô sơ trang bị cho nhà, công trình được bố trí tại khu vực thường trực về phòng cháy và chữa cháy.
   Khoản, Điều: Điều 5.6.1.2 TCVN 3890:2023 | Tra ở: bảng hệ thống B34–B50
#24 | TT 3.2 | Mặt nạ lọc độc và mặt nạ phòng độc cách ly.
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#25 | TT - | Yêu cầu trang bị
   Gợi ý đọc bản vẽ: -
   Quy định: 5.6.2.1 Nhà, công trình phải trang bị mặt nạ lọc độc và mặt nạ phòng độc cách ly được quy định tại Phụ lục F. / Đối với các nhà, công trình khác: chung cư, bệnh viện, văn phòng, nhà hát, rạp chiếu phim... khuyến khích việc trang bị mặt nạ lọc độc. / STT / Đối tượng / Quy mô / Số lượng, chiếc / Khách sạn, nhà khách, nhà nghỉ; nhà trọ, và cơ sở lưu trú khác theo quy định [1] (ngoại trừ bãi cắm trại du lịch) cao từ 3 tầng trở lên / Không phụ thuộc quy mô / Trang bị mặt nạ lọc độc tại tất cả các tầng nhà với định mức 1 chiếc/1 người (bao gồm cả khách lưu trú và nhân viên phục vụ có mặt thường xuyên) / Cơ sở kinh doanh dịch vụ karaoke, vũ trường, quán bar, hộp đêm / Không phụ thuộc quy mô / Trang bị mặt nạ lọc độc tại tất cả các tầng nhà. Số lượng mặt nạ trên một tầng được tính toán theo số người có mặt đồng thời trong một phòng có diện tích lớn nhất của tầng đó với định mức 01 người/ chiếc / Cơ sở hạt nhân. / Không phụ thuộc quy mô / Trang bị tối thiểu 03 bộ mặt nạ phòng độc cách ly / Cảng hàng không, cảng biển. / Không phụ thuộc quy mô / Cơ sở khai thác và chế biến dầu mỏ, khí đốt. / Không phụ thuộc quy mô / Cơ sở khai thác than. / Không phụ thuộc quy mô / Cơ sở sản xuất, kho vũ khí, vật liệu nổ / Không phụ thuộc quy mô / Kho dự trữ cấp quốc gia; kho dầu mỏ, sản phẩm dầu mỏ / Tổng dung tích 15 000 m3 trở lên / Nhà máy thủy điện / Công suất 300 MW trở lên / nhà máy nhiệt điện / Công suất 200 MW trở lên / Cơ sở sản xuất giấy / Công suất 35 000 tấn/năm trở lên / Cơ sở dệt / Công su…
   Khoản, Điều: Phụ lục F TCVN 3890:2023 | Tra ở: bảng hệ thống B34–B50
#26 | TT - | Định mức trang bị
   Gợi ý đọc bản vẽ: -
   Quy định: Trang bị tối thiểu một bộ dụng cụ phá dỡ thông thường cho nhà và công trình quy định tại 10.1.7 và bố trí tại khu vực thường trực về phòng cháy và chữa cháy.
   Khoản, Điều: Điều 10.1.8 TCVN 3890:2023 | Tra ở: bảng hệ thống B34–B50
#27 | TT 3.3 | Phương tiện bảo hộ chống tụ khói
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#28 | TT - | Yêu cầu trang bị
   Gợi ý đọc bản vẽ: -
   Quy định: Phương tiện bảo hộ chống khói được trang bị cho các khách sạn và bố trí trong phòng tại ví trí dễ thấy, dễ lấy
   Khoản, Điều: Điều 10.1.9 TCVN 3890:2023 | Tra ở: bảng hệ thống B34–B50
#29 | TT - | Định mức trang bị
   Gợi ý đọc bản vẽ: Lưu ý: Cơ sở kinh doanh dịch vụ karaoke, dịch vụ vũ trường không phụ thuộc quy mô đều phải trang bị mặt nạ lọc độc tại tất cả các tầng nhà. Số lượng mặt nạ trên một tầng được tính toán theo số người có mặt đồng thời trong phòng có diện tích lớn nhất của tầng đó với định mức 01 chiếc/người.
   Quy định: Trang bị tối thiểu một người một khẩu trang lọc độc, khuyến khích trang bị thêm mặt trùm lọc độc.
   Khoản, Điều: Điều 10.1.9 TCVN 3890:2023 | Tra ở: bảng hệ thống B34–B50
#30 | TT 3.4 | Phương tiện, dụng cụ chữa cháy ban đầu
   Gợi ý đọc bản vẽ: -
   Quy định: Phương tiện, dụng cụ chữa cháy ban đầu trang bị cho nhà kho, cửa hàng, cơ sở sản xuất theo quy định tại Phụ lục H. / STT / Tên hạng mục công trình / Thùng cát, m3 / Xẻng, chiếc / Chăn sợi 1x2(m), chiếc / Kho, cửa hàng chứa hàng hoá là chất lỏng có nhiệt độ bắt cháy > 45oC / 1 m3 trên mỗi 350 m2 sàn / 2 chiếc trên mỗi 350 m2 sàn / 1 chiếc trên mỗi 350 m2 sàn / Phân xưởng sản xuất, chế biến có sử dụng thiết bị cơ khí, lò sấy, máy hàn / 1 chiếc trên mỗi 200 m2 sàn
   Khoản, Điều: Điều 5.8.1 TCVN 3890:2023 | Tra ở: bảng hệ thống B34–B50
#31 | TT - | Lưu ý: Về việc trang bị phương tiện chữa cháy cơ giới / - Việc trang bị phương tiện chữa cháy cơ giới phải bảo đảm theo quy định tại Bảng 6 của TCVN 3890:2023. Trong đó lưu ý khu công nghiệp có diện tích nhỏ hơn 50 ha không bắt buộc trang bị xe chữa cháy nhưng phải trang bị tối thiểu 01 máy bơm chữa…
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#32 | TT ……(3)…… | ……(4)……
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#33 | TT (Chữ ký và họ tên) | (Chữ ký và họ tên)
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -

## Định dạng trả lời
Chỉ trả về MỘT khối ```json, không viết gì ngoài khối đó:
{"dong":[{"bang":"B15","idx":90,"tt":"7.2.3","noi_dung_thiet_ke":"thiết kế có gì (số liệu, trang)","ket_luan":"DAT|CHUA_DAT|CAN_XAC_NHAN|KHONG_AP_DUNG","ly_do":"lý do có số","dieu_khoan":"Đ 3.2.8 QCVN 06:2022/SĐ1:2023","chinh_ban_ve":"(nếu có)","nguon":[{"trang":12,"ghi_chu":"mặt bằng tầng 1"}],"vi_tri":[{"trang":12,"anchor":"D3"}],"huong_dan":"cách thiết kế cho đạt: giải pháp cụ thể, trị số yêu cầu, điều khoản"}],"ghi_chu":"điều cần lưu ý chung (nếu có)"}
Trả về đủ MỌI dòng được giao (theo "idx"), đúng thứ tự.
Hướng dẫn thiết kế đang BẬT: mọi dòng CHUA_DAT, CAN_XAC_NHAN, có chinh_ban_ve, và các dòng yêu cầu chính (dù DAT) phải có "huong_dan" viết cho người thiết kế.