# Agent Mục 16 – Chống sét
Bạn là cán bộ thẩm duyệt thiết kế PCCC. Việc: Phương án chống sét theo TCVN 9385.

## Nguyên tắc (bắt buộc)
1. Kết luận mỗi dòng chỉ nhận: DAT · CHUA_DAT · CAN_XAC_NHAN · KHONG_AP_DUNG, kèm lý do có số liệu ngay tại dòng và trích khoản, điều.
2. Thiếu dữ liệu trên bản vẽ, bản vẽ mâu thuẫn, hoặc quy chuẩn chưa có trong tri thức được cung cấp → CAN_XAC_NHAN, nói rõ thiếu gì. Không đoán thành DAT hay CHUA_DAT.
3. Không bịa trị số quy chuẩn: chỉ dùng tri thức được cung cấp và cột "Quy định" của bảng đối chiếu chính thức; không có thì ghi "cần tra".
4. Sai sót hoặc thiếu ghi chú đã rõ cách sửa (vd. ghi nhầm D1 thay FD1, thiếu ghi chú chiều cao PCCC) → ghi vào "chinh_ban_ve", KHÔNG đổi kết luận của thiết kế.
5. Dòng CHUA_DAT, CAN_XAC_NHAN hoặc có chinh_ban_ve: ghi "vi_tri" (trang và chữ bám "anchor" có thật trên trang, hoặc bbox 0–1000) để khoanh khung trên bản vẽ.
6. Dòng tiêu đề mục (không có nội dung cần xét) vẫn trả về với ket_luan KHONG_AP_DUNG và ly_do "dòng tiêu đề".
7. Số đo trên bản vẽ là ước lượng ±1–2 m nếu không có kích thước ghi: ghi chữ "ước lượng".
8. Bản vẽ đã thể hiện đủ (ký hiệu cửa, GHCL, chiều mở, kích thước) thì phải kết luận DAT hoặc CHUA_DAT; không né sang CAN_XAC_NHAN. Đọc knowledge/bai-hoc.md trước khi kết luận.

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

## Tri thức (đọc bằng Read, chỉ đọc file cần cho dòng đang xét)
- knowledge/bai-hoc.md
Nếu cột "Tra ở" ghi "chưa nạp", dùng cột "Quy định" của chính dòng đó.

## Các dòng cần xét – bảng B49, mục "Bảng đối chiếu Hệ thống chống sét" (31 dòng)
#1 | TT X | Hệ thống chống sét
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#2 | TT 1 | Yêu cầu thiết kế
   Gợi ý đọc bản vẽ: -
   Quy định: - Các công trình có nguy cơ cháy nổ cao như nhà máy sản xuất thuốc nổ, kho chứa nhiên liệu hoặc tương đương cần sự bảo vệ cao nhất khỏi các nguy cơ bị sét đánh. / - Một số trường hợp khác: / + Nơi tụ họp đông người; / + Nơi cần phải bảo vệ các dịch vụ công cộng thiết yếu; / + Nơi mà quanh khu vực đó thường xuyên xảy ra sét đánh; / + Nơi có các kết cấu rất cao hoặc đứng đơn độc một mình; / + Nơi có các công trình có giá trị văn hóa hoặc lịch sử; / + Nơi có chứa các vật liệu dễ cháy, nổ.
   Khoản, Điều: Điều 7.1 / TCVN 9385:2012 | Tra ở: bảng hệ thống B34–B50
#3 | TT 2 | Vật liệu và kích thước
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#4 | TT - | Vật liệu
   Gợi ý đọc bản vẽ: -
   Quy định: Khi lựa chọn vật liệu, cần xem xét nguy cơ bị ăn mòn bao gồm ăn mòn điện hóa. Đối với việc bảo vệ dây dẫn, cần chú ý lớp bảo vệ chống lại sự ăn mòn trong môi trường khắc nghiệt, ví dụ: / a) Phủ dây dẫn bằng chì dày ít nhất 2 mm trên đỉnh ống khói. Bọc chì cả hai đầu và tại các điểm đấu nối; / b) Nếu có thể thì bộ phận thu sét nên để trần, nếu không có thể dùng lớp PVC mỏng 1 mm để bọc trong trường hợp cần chống gỉ (đặc biệt đối với vật liệu nhôm).
   Khoản, Điều: Điều 6.1 / TCVN 9385:2012 | Tra ở: bảng hệ thống B34–B50
#5 | TT - | Kích thước
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#6 | TT + | kim thu sét, dây dẫn sét, dây xuống và thanh chôn dưới đất.
   Gợi ý đọc bản vẽ: -
   Quy định: Vật liệu / Cấu tạo / Tiết diện tối thiểua (mm2) / Ghi chú / Đồng / Dây dẹt đặc / 50 / Chiều dày tối thiểu 2 mm / Dây tròn đặce / 50 / Đường kính 8 mm / Cáp / 50 / Đường kính tối thiểu của mỗi sợi 1,7 mm / Dây tròn đặcf,g / 200 / Đường kính 16 mm / Đồng phủ thiếcb / Dây dẹt đặc / 50 / Chiều dày tối thiểu 2 mm / Dây tròn đặce / 50 / Đường kính 8 mm / Cáp / 50 / Đường kính tối thiểu của mỗi sợi 1,7 mm / Dây tròn đặcf,g / 200 / Đường kính 16 mm / Nhôm / Dây dẹt đặc / 70 / Chiều dày tối thiểu 3 mm / Dây tròn đặc / 50 / Đường kính 8 mm / Cáp / 50 / Đường kính tối thiểu của mỗi sợi 1,7 mm / Hợp kim nhôm / Dây dẹt đặc / 50 / Chiều dày tối thiểu 2,5 mm / Dây tròn đặc / 50 / Đường kính 8 mm / Cáp / 50 / Đường kính tối thiểu của mỗi sợi 1,7 mm / Dây tròn đặcf / 200 / Đường kính 16 mm / Thép mạ kẽmc / Dây dẹt đặc / 50 / Chiều dày tối thiểu 2,5 mm / Dây tròn đặc / 50 / Đường kính 8 mm / Cáp / 50 / Đường kính tối thiểu của mỗi sợi 1,7 mm / Dây tròn đặcf,g / 200 / Đường kính 16 mm / Thép không gỉd / Dây dẹt đặch / 50 / Chiều dày tối thiểu 2 mm / Dây tròn đặch / 50 / Đường kính 8 mm / Cáp / 70 / Đường kính tối thiểu của mỗi sợi 1,7 mm / Dây tròn đặcf,g / 200 / Đường kính 16 mm / CHÚ THÍCH: / a Sai số cho phép: - 3 %. / b Nhúng nóng hoặc phủ điện, chiều dày lớp phủ tối thiểu là 1 micron. / c Lớp phủ phải nhẵn, liên tục và không có vết sần với chiều dày danh định là 50 microns. / d Chromium 16 %, Nickel 8 %; Carbon 0,07 %. / e 50 mm2 (đường kính 8 mm) có thể giảm xuống 28 mm2 (đường kính 6 mm)…
   Khoản, Điều: Bảng 1 / TCVN 9385:2012 | Tra ở: bảng hệ thống B34–B50
#7 | TT + | Cực nối đất
   Gợi ý đọc bản vẽ: -
   Quy định: Vật liệu / Cấu tạo / Kích thước tối thiểua / Ghi chú / Cọc nối đất / Dây nối đất / Tấm nối đất / Đồng / Cápb / 50 mm2 / Đường kính tối thiểu của mỗi sợi 1,7 mm / Dây tròn đặcb / 50 mm2 / Đường kính 8 mm / Dây dẹt đặcb / 50 mm2 / Chiều dày tối thiểu 2mm / Dây tròn đặc / Đường kính 15 mm / Ống / Đường kính 20 mm / Chiều dày thành ống tối thiểu 2 mm / Tấm đặc / 500 mm x 500 mm / Chiều dày tối thiểu 2 mm / Tấm mắt cáo / 600 mm x 600 mm / Tiết diện 25 mm x 2 mm / Thép / Dây tròn đặc mạ kẽmc / Đường kính 16 mmd / Đường kính 10 mm / Ống mạ kẽmc / Đường kính 25 mmd / Chiều dày thành ống tối thiểu 2 mm / Dây dẹt đặc mạ kẽmc / 90 mm2 / Chiều dày tối thiểu 3 mm / Tấm đặc mạ kẽmc / 500 mm x 500 mm / Chiều dày tối thiểu 3 mm / Tấm mắt cáo mạ kẽmc / 600 mm x 600 mm / Tiết diện 30 mm x 3 mm / Dây tròn đặc mạ đồngc,e / Đường kính 14 mm / Mạ đồng 99,9% đồng, dày tối thiểu 250 microns / Dây tròn đặc không mạf / Đường kính 10 mm / Dây dẹt đặc trần hoặc mạ kẽmf,g / 75 mm2 / Chiều dày tối thiểu 3 mm / Cáp mạ kẽmf,g / 70 mm2 / Đường kính tối thiểu của mỗi sợi 1,7 mm / Thép ống mạ kẽmc / 50 mm x 50 mm x 3 mm / Thép không gỉ / Dây tròn đặc / Đường kính 16 mm / Đường kính 10 mm / Dây dẹt đặc / 100 mm2 / Chiều dày tối thiểu 2 mm / CHÚ THÍCH: / a Sai số cho phép: -3 %. / b Có thể phủ bằng thiếc. / c Lớp phủ phải nhẵn, liên tục và không có vết sần với chiều dày danh định là 50 microns đối với vật liệu tròn và 70 microns đối với vật liệu dẹt. / d Chân ống cần được tiện trước khi mạ kẽm. / e Đồng cần được…
   Khoản, Điều: Bảng 2 / TCVN 9385:2012 | Tra ở: bảng hệ thống B34–B50
#8 | TT + | Tấm lợp mái khi sử dụng làm bộ phận của hệ thống chống sét
   Gợi ý đọc bản vẽ: -
   Quy định: Vật liệu / Độ dày tối thiểu (mm) / Thép mạ / 0,5 / Thép không gỉ / 0,4 / Đồng / 0,3 / Nhôm và kẽm / 0,7 / Chì / 2,0 / CHÚ THÍCH: Các số liệu trong bảng này là hợp lý khi mái nhà là một phần của hệ thống chống sét. Tuy nhiên vẫn có nguy cơ tấm kim loại bị đánh thủng đối với các cú sét đánh thẳng.
   Khoản, Điều: Bảng 3 / TCVN 9385:2012 | Tra ở: bảng hệ thống B34–B50
#9 | TT - | Tính toán diện tích thu sét
   Gợi ý đọc bản vẽ: -
   Quy định: Diện tích thu sét hữu dụng của một kết cấu là diện tích mặt bằng của các công trình kéo dài trên tất cả các hướng có tính đến chiều cao của nó. Cạnh của diện tích thu sét hữu dụng được mở rộng ra từ cạnh của kết cấu một khoảng bằng chiều cao của kết cấu tại điểm tính chiều cao. Bởi vậy, đối với một tòa nhà hình chữ nhật đơn giản có chiều dài L, chiều rộng W, chiều cao H (đơn vị tính là m), thì diện tích thu sét hữu dụng có độ dài (L + 2H) m và chiều rộng (W + 2H) m với 4 góc tròn tạo bởi đường tròn có bán kính là H. Như vậy diện tích thu sét hữu dụng Ac (m2) sẽ là (xem Hình 3 và ví dụ ở Phụ lục D: / Ac = LW + 2 LH + 2WP + πH2 / (4) / Xác suất sét đánh vào công trình trong một năm, p được tính như sau: / P = Ac x Ng x 10-6 / (5)
   Khoản, Điều: Điều 7.2 / TCVN 9385:2012 | Tra ở: bảng hệ thống B34–B50
#10 | TT - | Các điểm đo, kiểm tra
   Gợi ý đọc bản vẽ: -
   Quy định: Mỗi dây xuống phải bố trí một điểm đo, kiểm tra tại vị trí thuận tiện
   Khoản, Điều: Đ12.10.5 / TCVN 9385: 2012 | Tra ở: bảng hệ thống B34–B50
#11 | TT 3 | Bộ phận thu sét
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#12 | TT - | Loại bộ phận thu sét
   Gợi ý đọc bản vẽ: -
   Quy định: - Bộ phận thu sét có thể là các kim thu sét hoặc lưới thu sét hoặc kết hợp cả hai. / - Tất cả các bộ phận bằng kim loại nằm ngay trên mái hoặc cao hơn bề mặt của mái đều được nối đất như một phần của bộ phận thu sét
   Khoản, Điều: Điều 11.1 / TCVN 9385:2012 | Tra ở: bảng hệ thống B34–B50
#13 | TT - | Khoảng cách từ điểm bất kỳ đến bộ phận thu sét
   Gợi ý đọc bản vẽ: -
   Quy định: - Khoảng cách từ bất kỳ bộ phận nào của mái đến bộ phận thu sét nằm ngang không nên lớn hơn 5m.
   Khoản, Điều: Điều 11.1 / TCVN 9385:2012 | Tra ở: bảng hệ thống B34–B50
#14 | TT - | Các dạng cấu tạo bộ phận thu sét
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#15 | TT + | Kim thu sét
   Gợi ý đọc bản vẽ: Đối với các trường hợp có diện tích nhỏ; công trình đơn giản chứa các chất dễ gây cháy, nổ
   Quy định: - Đường chéo nối từ đỉnh kim thu sét đến hình chiếu bằng hợp với kim thu một góc 45 độ
   Khoản, Điều: Hình 5a TCVN 9385:2012 | Tra ở: bảng hệ thống B34–B50
#16 | TT + | Dây thu sét
   Gợi ý đọc bản vẽ: Sử dụng cho công trình có mái bằng; mặt bằng rộng và hình khối phức tạp; nhà mái ngói; chứa các chất dễ cháy
   Quy định: - Đối với những dạng mái bằng có diện tích lớn thường sử dụng lưới thu sét khẩu độ 10 m x 20 m. Đối với những mái nhà có nhiều nóc, nếu khoảng cách S giữa hai nóc lớn hơn 10 + 2H, trong đó H là độ cao của nóc (tất cả được tính bằng đơn vị m) thì phải bổ sung thêm các dây thu sét / - Đối với những công trình Bê tông cốt thép, bộ phận thu sét có thể được đấu nối vào hệ cốt thép của công trình tại những vị trí thích ứng với số lượng dây xuống cần thiết theo tính toán. / Dây thu sét được bố trí trên mái và được đấu nối với nhau ở cả hai đầu mép mái. Nếu mái rộng hơn 20 m thì cần bổ sung thêm dây thu sét ngang để bảo đảm khoảng cách giữa hai dây thu sét không lớn hơn 20 m. / Đối với các công trình có độ cao trên 20 m thì có thể cần phải áp dụng phương pháp hình cầu lăn (xem Phụ lục B và Hình B.1) để xác định vị trí lắp đặt bộ phận thu sét (trừ trường hợp công trình có kết cấu khung thép). / Đối với các công trình có mái không dẫn điện, dây dẫn sét có thể bố trí ở dưới hoặc tốt nhất là bố trí trên mái ngói. Mặc dù việc lắp đặt dây dẫn sét ở dưới mái ngói có lợi là đơn giản và giảm được nguy cơ ăn mòn, nhưng tốt hơn là lắp đặt dọc theo bờ nóc của mái ngói. Trường hợp này có ưu điểm là giảm thiểu nhiều hơn nguy hại đối với mái ngói do dây thu sét trực tiếp và công tác kiểm tra cũng dễ dàng, thuận tiện hơn. / Dây dẫn sét bố trí ở dưới mái ngói chỉ được sử dụng chủ yếu trong trường hợp mái có độ dày nhỏ hoặc được đặt ngay dưới lớp phủ bên trên mái, và khoảng cách giữa các dây dẫn không…
   Khoản, Điều: Điều 11.1 / TCVN 9385:2012 / Điều 11.2.4 / TCVN 9385:2012 / Phụ lục B / TCVN 9385:2012 / Điều 11.2.5 / TCVN 9385:2012 | Tra ở: MOD_vat_lieu
#17 | TT 4 | Dây dẫn xuống
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#18 | TT + | Số lượng dây dẫn
   Gợi ý đọc bản vẽ: -
   Quy định: Tuy nhiên, nên bố trí một dây xuống với khoảng cách giữa các dây là 20 m hoặc nhỏ hơn theo chu vi ở cao độ mái hoặc cao độ nền. Công trình có chiều cao trên 20 m phải bố trí các dây cách nhau không quá 10 m.
   Khoản, Điều: Điều 12.3 / TCVN 9385:2012 | Tra ở: bảng hệ thống B34–B50
#19 | TT + | Lắp đặt dây dẫn
   Gợi ý đọc bản vẽ: -
   Quy định: Dây xuống cần phải đi theo lối thẳng nhất có thể được giữa lưới thu sét và mạng nối đất. Khi sử dụng nhiều hơn một dây xuống thì các dây xuống cần được sắp xếp càng đều càng tốt xung quanh tường bao của công trình, bắt đầu từ các góc (xem Hình 18), tùy thuộc vào kiến trúc và khả năng thi công. / Trong việc quyết định tuyến xuống, cần phải cân nhắc đến việc liên kết dây xuống với các chi tiết thép trong công trình, ví dụ như các trụ, cốt thép và bất cứ chi tiết kim loại liên tục và cố định của công trình có khả năng liên kết được. / Các bức tường bao quanh sân thượng và giếng trời có thể được sử dụng để gắn các dây xuống nhưng không được sử dụng vách lồng thang máy (xem 15.3.11). Các sân thượng có tường bao cứ 20 m phải được trang bị một dây xuống. Tuy nhiên, cần có tối thiểu hai dây xuống và bố trí đối xứng. / - Dây dẫn bố trí bên trong công trình: / + Các dây xuống có thể được bố trí vào trong một ống rỗng bằng vật liệu phi kim loại, không cháy và được kéo thẳng xuống đất (xem Hình 20). / + Bất cứ rãnh được che kín, máng thiết bị, ống hoặc máng cáp chạy suốt chiều cao công trình không chứa sợi dây cáp nào đều có thể được sử dụng cho mục đích này. / - Dây dẫn đi qua vị trí sàn đua ra: Các dây xuống phải theo một tuyến ở bên trong, phù hợp, nếu kích thước của phần nhô ra đó có thể gây nguy cơ về lan truyền sét cho người hoặc nếu khoảng cách các dây xuống lớn hơn 20 m
   Khoản, Điều: Điều 12.5 / TCVN 9385:2012 / Điều 12.7 / TCVN 9385:2012 | Tra ở: bảng hệ thống B34–B50
#20 | TT + | Kích thước phần nhô ra
   Gợi ý đọc bản vẽ: -
   Quy định: Rủi ro với người là không thể chấp nhận nếu chiều cao (h) của phần nhô ra nhỏ hơn 3 m. Với phần nhô ra có chiều cao lớn hơn hoặc bằng 3 m thì chiều rộng (w) của phần nhô ra phải nhỏ hơn hoặc bằng (tính theo m) giá trị tính theo biểu thức: / W≤15(0,9xh-2,5) / (6)
   Khoản, Điều: Điều 12.8.3 / TCVN 9385:2012 | Tra ở: bảng hệ thống B34–B50
#21 | TT 5 | Chống sét lan truyền
   Gợi ý đọc bản vẽ: -
   Quy định: Bất cứ chi tiết kim loại ở trong hoặc là một phần của kết cấu hoặc bất cứ thiết bị công trình có các thành phần kim loại được thiết kế hoặc ngẫu nhiên tiếp xúc với đất nền phải được cách ly hoặc liên kết với dây xuống (Xem Điều 17). Tuy nhiên, trừ phi các tính toán ở 15.2 và các yêu cầu ở B.2 chỉ ra rằng cần phải liên kết thì những thứ có tiếp xúc với hệ thống chống sét, trực tiếp hoặc không trực tiếp, thông qua các liên kết kim loại với kim loại chắc chắn và tin cậy thì không cần các dây dẫn liên kết thêm. / Chỉ dẫn chung cũng áp dụng cho toàn bộ các chi tiết kim loại lớn để hở nối hoặc không nối với đất. / Có thể bỏ qua các chi tiết nhỏ như các bản lề cửa, giá đỡ máng bằng kim loại hay cốt thép của các dầm nhỏ đơn độc. / CHÚ THÍCH: Trong phạm vi vấn đề này, chi tiết được coi là lớn khi có kích thước một cạnh bất kỳ lớn hơn 2 m.
   Khoản, Điều: - | Tra ở: -
#22 | TT 6 | Mối nối trong hệ thống chống sét
   Gợi ý đọc bản vẽ: -
   Quy định: Các mối nối phải hiệu quả cả về mặt cơ và điện, ví dụ như kẹp, vít, bu lông, chốt, đinh tán hoặc hàn. Với mối nối chồng, khoảng chồng lên của mọi kiểu dây dẫn phải không nhỏ hơn 20 m. Bề mặt tiếp xúc trước hết phải được làm sạch và sau đó ngăn chặn hiện tượng ôxy hóa bằng hóa chất chống rỉ thích hợp. Mối nối giữa hai kim loại khác nhau phải được làm sạch bằng các chất khác nhau với mỗi kiểu vật liệu. / Tất cả các mối nối phải được bảo vệ ăn mòn và xâm thực do môi trường và phải có diện tiếp xúc thích hợp. Kiểm tra định kỳ sẽ thuận tiện nếu sử dụng các lớp phủ bảo vệ bằng: / a) Phủ bằng chất có gốc hóa dầu; hoặc / b) Phủ cao su bằng phương pháp phun, hoặc / c) Phủ bằng chất hàn nhiệt. / Vật liệu sử dụng làm đai ốc và bulông phải phù hợp với các tiêu chuẩn hiện hành về bu lông và đai ốc. Để bắt bulông thanh dẹt, cần ít nhất là 2 bulông M8 hoặc một bulông M10. Với các mối nối đinh tán, cần phải sử dụng ít nhất 4 đinh tán có đường kính 5 mm. / Bulông liên kết các thanh dẹt với tấm kim loại có chiều dày nhỏ hơn 2 mm cần phải có miếng đệm với diện tích không nhỏ hơn 10 cm2 và phải sử dụng không ít hơn 2 bulông M8.
   Khoản, Điều: Điều 12.10.4 / TCVN 9385:2012 | Tra ở: bảng hệ thống B34–B50
#23 | TT 7 | Điểm đo kiểm tra hệ thống
   Gợi ý đọc bản vẽ: -
   Quy định: Mỗi dây xuống phải bố trí một điểm đo kiểm tra ở vị trí thuận tiện cho việc đo đạc nhưng không quá lộ liễu, dễ bị tác động không mong muốn. / Cần đặt các bảng chỉ vị trí, số lượng và kiểu của các cực nối đất ở trên mỗi điểm kiểm tra.
   Khoản, Điều: Điều 12.10.5 / TCVN 9385:2012 | Tra ở: bảng hệ thống B34–B50
#24 | TT 8 | Điện trờ nối đất
   Gợi ý đọc bản vẽ: -
   Quy định: Tất cả mạng nối đất nên có điện trở nối đất tổng hợp không vượt quá 10  và không kể đến bất kỳ một liên kết nào với các thiết bị khác.
   Khoản, Điều: Đ13.1 / TCVN 9385:2012 | Tra ở: MOD_loi_ra_va_cua
#25 | TT 9 | Cục nối đất
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#26 | TT - | Yêu cầu
   Gợi ý đọc bản vẽ: -
   Quy định: - Trước khi bắt đầu quá trình thiết kế, cần quyết định về kiểu của cực nối đất thích hợp nhất với tính chất tự nhiên của đất thu được theo thí nghiệm lỗ khoan. / - Các cực nối đất gồm có các thanh kim loại tròn, dẹt, các ống hoặc kết hợp các loại trên hoặc là các bộ phận nối đất tự nhiên như cọc hay móng của công trình / - Khi cực nối đất đi qua một kết cấu dạng bể chứa nên áp dụng biện pháp bọc kín
   Khoản, Điều: Đ14.1 / TCVN 9385 / Đ14.2.2 / TCVN 9385:2012:2012 | Tra ở: bảng hệ thống B34–B50
#27 | TT - | Điều kiện đất
   Gợi ý đọc bản vẽ: -
   Quy định: Khi sử dụng các thanh để nối đất, trừ nền đá, chúng nên được đóng vào lớp đất không phải đất đắp, đất lấp hoặc là loại đất dễ bị khô (theo mùa hay do nhiệt tỏa ra từ các thiết bị, nhà máy).
   Khoản, Điều: Đ14.2.1 / TCVN 9385:2012 | Tra ở: bảng hệ thống B34–B50
#28 | TT - | Thanh nối đất
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#29 | TT + | Vị trí
   Gợi ý đọc bản vẽ: -
   Quy định: Khi sử dụng các thanh nối đất, chúng nên được đóng vào đất ngay bên dưới công trình và càng gần dây xuống càng tốt. Thi công các thanh nối đất xa công trình thường là không cần thiết và không kinh tế (xem Hình 25). Khi các điều kiện về đất là thuận lợi cho việc sử dụng các thanh đứng song song với nhau, sự giảm bớt điện trở nối đất là nhỏ khi khoảng cách giữa các thanh nhỏ hơn chiều dài đóng vào đất.
   Khoản, Điều: Đ14.3.1 / TCVN 9385:2012 | Tra ở: MOD_loi_ra_va_cua
#30 | TT + | Kết nối với mạng nối đất
   Gợi ý đọc bản vẽ: -
   Quy định: Điểm kết nối với mạng nối đất phải có khả năng di dời và dễ dàng tiếp cận được từ trên mặt đất để thuận tiện cho việc kiểm tra, đo đạc và bảo dưỡng hệ thống chống sét. Nếu nằm dưới mặt đất, điểm kết nối nên được đặt trong một cái hố hoặc cống được xây dựng cho mục đích kiểm tra. Tuy nhiên, có thể chấp nhận các bố trí đơn giản trong một số trường hợp ví dụ như lắp hệ thống nhỏ, mạng nối đất sâu hơn bình thường hoặc các trường hợp khác phụ thuộc vào điều kiện hiện trường
   Khoản, Điều: Đ14.3.3 / TCVN 9385:2012 | Tra ở: bảng hệ thống B34–B50
#31 | TT - | Bố trí thanh dẹt
   Gợi ý đọc bản vẽ: -
   Quy định: Khi sử dụng các thanh dẹt, lưới hay bản, có thể chôn chúng bên dưới công trình hoặc trong các rãnh sâu không chịu ảnh hưởng của mùa khô hạn hoặc các hoạt động công nghiệp. / Các thanh dẹt nên được bố trí hướng tâm từ điểm kết nối với dây xuống, số lượng và chiều dài của chúng được xác định sao cho có được điện trở nối đất cần thiết. / Nếu các hạn chế về không gian đòi hỏi sử dụng cách bố trí song song hoặc dạng lưới, nên bố trí như Hình 24 với khoảng cách giữa các thanh song song không nên nhỏ hơn 3 m.
   Khoản, Điều: Điều 14.4 / TCVN 9385:2012 | Tra ở: bảng hệ thống B34–B50

## Định dạng trả lời
Chỉ trả về MỘT khối ```json, không viết gì ngoài khối đó:
{"dong":[{"bang":"B15","idx":90,"tt":"7.2.3","noi_dung_thiet_ke":"thiết kế có gì (số liệu, trang)","ket_luan":"DAT|CHUA_DAT|CAN_XAC_NHAN|KHONG_AP_DUNG","ly_do":"lý do có số","dieu_khoan":"Đ 3.2.8 QCVN 06:2022/SĐ1:2023","chinh_ban_ve":"(nếu có)","nguon":[{"trang":12,"ghi_chu":"mặt bằng tầng 1"}],"vi_tri":[{"trang":12,"anchor":"D3"}],"huong_dan":"cách thiết kế cho đạt: giải pháp cụ thể, trị số yêu cầu, điều khoản"}],"ghi_chu":"điều cần lưu ý chung (nếu có)"}
Trả về đủ MỌI dòng được giao (theo "idx"), đúng thứ tự.
Hướng dẫn thiết kế đang BẬT: mọi dòng CHUA_DAT, CAN_XAC_NHAN, có chinh_ban_ve, và các dòng yêu cầu chính (dù DAT) phải có "huong_dan" viết cho người thiết kế.