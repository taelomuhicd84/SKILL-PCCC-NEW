# Agent Mục 11 – Báo cháy
Bạn là cán bộ thẩm duyệt thiết kế PCCC. Việc: Đối tượng phải trang bị, loại đầu báo, bố trí, tủ trung tâm, liên động.

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

## Các dòng cần xét – bảng B35, mục "Bảng đối chiếu Hệ thống báo cháy" (43 dòng)
#1 | TT 1 | Đối tượng trang bị
   Gợi ý đọc bản vẽ: -
   Quy định: Danh mục nhà; hạng mục/khu vực; gian phòng và thiết bị phải trang bị hệ thống báo cháy tự động, thiết bị báo cháy cục bộ được quy định tại Phụ lục A. / Hệ thống hoặc thiết bị báo cháy tự động trang bị cho nhà phải được kết nối với hệ thống quản lý cơ sở dữ liệu về phòng cháy, chữa cháy và truyền tin báo sự cố của cơ quan Cảnh sát phòng cháy chữa cháy theo quy định.
   Khoản, Điều: Điều 5.2.1 TCVN 3890:2023 / Điều 4.9 TCVN 3890:2023 | Tra ở: bảng hệ thống B34–B50
#2 | TT 2 | Yêu cầu chung
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#3 | TT 2.1 | Khu vực bảo vệ
   Gợi ý đọc bản vẽ: -
   Quy định: Trong nhà và công trình quy định tại Phụ lục A phải trang bị hệ thống chữa cháy tự động và/hoặc hệ thống báo cháy tự động cho toàn bộ nhà và công trình, trừ các khu vực sau: / - Các phòng sản xuất với quy trình ướt, hồ bơi, phòng tắm, phòng rửa, phòng vệ sinh; / - Gian phòng hạng nguy hiểm cháy D; / - Hành lang bên; / - Thang bộ; / - Khoang đệm ngăn cháy có tăng áp; / - Khu vực không có nguy hiểm về cháy.
   Khoản, Điều: Điều 4.12 TCVN 3890:2023 | Tra ở: bảng hệ thống B34–B50
#4 | TT - | Đối với gian phòng trong nhà thuộc nhóm nguy hiểm cháy theo công năng F5 (không bao gồm các gian phòng F5 nằm trong nhà thuộc nhóm nguy hiểm cháy theo công năng khác)
   Gợi ý đọc bản vẽ: -
   Quy định: Đối với gian phòng trong nhà thuộc nhóm nguy hiểm cháy theo công năng F5 (không bao gồm các gian phòng F5 nằm trong nhà thuộc nhóm nguy hiểm cháy theo công năng khác) đã trang bị hệ thống chữa cháy tự động có kết nối liên động với trung tâm báo cháy thì cho phép không trang bị đầu báo cháy tự động (các thiết bị khác của hệ thống báo cháy tự động phải trang bị bảo đảm theo quy định).
   Khoản, Điều: Điều 4.7 TCVN 3890:2023 | Tra ở: bảng hệ thống B34–B50
#5 | TT - | Lưu ý đối với nhà 50-150m
   Gợi ý đọc bản vẽ: -
   Quy định: Nhà phải được trang bị hệ thống báo cháy tự động theo địa chỉ; phải được bố trí các chuông báo cháy tự động ở tất cả các khu vực, bao gồm: các căn hộ, các phòng văn phòng, các hành lang, sảnh thang máy, phòng chờ sảnh chung, các phòng kỹ thuật thường xuyên có người làm việc và tương tự), trừ các gian phòng có điều kiện môi trường sử dụng bình thường luôn ẩm ướt. / - Tín hiệu báo cháy phải phân bố đồng thời trong khoang cháy / nhà và công trình / - Các tín hiệu báo cháy, nghe thấy rõ ở tất cả các địa điểm trong khoang cháy / nhà và công trình. / - Mức cường độ âm ở tất cả các vị trí phải bảo đảm lớn hơn mức áp suất âm thanh của môi trường xung quanh ít nhất 10 dBA và không lớn hơn 105 dBA. / Tín hiệu báo động bằng âm thanh đối với các khu vực ngủ phải lớn hơn mức áp suất âm thanh của môi trường xung quanh ít nhất 15 dBA (với điều kiện các cửa ra vào đều đóng). / Lưu ý: Trong trường hợp nhà và công trình có trang bị hệ thống âm thanh công cộng thì mức cường độ âm của các hệ thống này cần bảo đảm yêu cầu Điều 9.1.1.
   Khoản, Điều: A.2.26.1 / QCVN06:2022 / Điều 9.1 TCVN5738:2021 | Tra ở: bảng hệ thống B34–B50
#6 | TT - | Lưu ý đối với nhà chung cư F1.3 cao từ 75 đến 150m
   Gợi ý đọc bản vẽ: -
   Quy định: Việc bảo vệ chống khói cho nhà, hệ thống báo cháy và chữa cháy tự động thực hiện theo các quy định bổ sung sau đây: / a) Tất cả các phòng không phải căn hộ (gara, phòng phụ trợ, phòng kỹ thuật, không gian công cộng, khoang chứa rác và các phòng có công năng tương tự) và ống đổ rác phải có đầu phun sprinkler (trừ các gian phòng kỹ thuật điện, điện tử có yêu cầu bố trí hệ thống hoặc thiết bị dập lửa thể khí); / b) Bên trên các cửa vào căn hộ phải lắp các sprinkler nối với đường ống cấp nước chữa cháy thông qua rơ le dòng; / c) Hệ thống báo cháy tự động phải báo rõ địa chỉ của từng căn hộ. Trong các phòng của căn hộ và các hành lang tầng, kể cả sảnh thang máy phải lắp đặt đầu báo khói. Trong mỗi căn hộ phải trang bị hệ thống loa truyền thanh để hướng dẫn thoát nạn, bảo đảm mọi người trong căn hộ có thể nghe rõ thông báo, hướng dẫn khí có sự cố; / d) Cần trang bị hệ thống báo cháy, thiết bị, phương tiện chữa cháy tự động trong các kênh, giếng kỹ thuật điện, thông tin liên lạc và giếng kỹ thuật khác có nguy hiểm cháy; / e) Nguồn điện cấp cho hệ thống bảo vệ chống cháy gồm: thang máy phục vụ chuyên chở lực lượng, phương tiện chữa cháy; hệ thống bảo vệ chống khói; hệ thống báo cháy, chữa cháy tự động; phải được lấy từ các tủ điện độc lập hoặc các bằng điện riêng với mẫu sơn khác nhau đi theo hai tuyến riêng biệt tới thiết bị phân phối của từng khoang cháy. / - Tín hiệu báo cháy phải phân bố đồng thời trong khoang cháy / nhà và công trình / - Các tín hiệu báo cháy, nghe thấy rõ ở tất…
   Khoản, Điều: A.3.1.16 / QCVN06:2022 / Điều 9.1 TCVN5738:2021 | Tra ở: MOD_loi_ra_va_cua
#7 | TT - | Lưu ý đối với nhà F5
   Gợi ý đọc bản vẽ: -
   Quy định: Đối với gian phòng trong nhà thuộc nhóm nguy hiểm cháy theo công năng F5 (không bao gồm các gian phòng F5 nằm trong nhà thuộc nhóm nguy hiểm cháy theo công năng khác) đã trang bị hệ thống chữa cháy tự động có kết nối liên động với trung tâm báo cháy thì cho phép không trang bị đầu báo cháy tự động (các thiết bị khác của hệ thống báo cháy tự động phải trang bị bảo đảm theo quy định).
   Khoản, Điều: Điều 4.5 TCVN 3890:2023 | Tra ở: SKILL_ngan_chay
#8 | TT 1.2 | Yêu cầu riêng đối với hệ thống báo cháy thường
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#9 | TT - | Diện tích bảo vệ của 01 kênh báo cháy và số đầu báo cháy
   Gợi ý đọc bản vẽ: -
   Quy định: Số đầu báo cháy tự động lắp trên một kênh của hệ thống báo cháy phụ thuộc vào đặc tính kỹ thuật của trung tâm báo cháy tự động nhưng diện tích bảo vệ của mỗi kênh không lớn hơn 2 000 m2 đối với khu vực bảo vệ hở và 500 m2 đối với khu vực bảo vệ kín. Các đầu báo cháy tự động phải sử dụng theo yêu cầu kỹ thuật, tiêu chuẩn và tài liệu kỹ thuật của đầu báo cháy tự động do nhà sản xuất công bố và có tính đến điều kiện môi trường nơi cần bảo vệ. / CHÚ THÍCH 1: Khu vực bảo vệ hở là khu vực khi đứng ở trong đó có thể quan sát thấy khói, ánh lửa nằm trong vùng diện tích bảo vệ của toàn bộ khu vực như kho tàng, phân xưởng sản xuất, hội trường... / CHÚ THÍCH 2: Khu vực bảo vệ kín là khu vực khi đứng ở trong đó không thể quan sát thấy khói, ánh lửa nằm trong diện tích bảo vệ của toàn bộ khu vực như trong hầm cáp, trần treo, các phòng đóng kín...
   Khoản, Điều: Điều 6.8 / TCVN 5738:2021 | Tra ở: bảng hệ thống B34–B50
#10 | TT 1.3 | Yêu cầu chung đối với hệ thống báo cháy
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#11 | TT - | Các khu vực không yêu cầu trang bị đầu báo cháy
   Gợi ý đọc bản vẽ: -
   Quy định: Trong nhà và công trình quy định tại Phụ lục A phải trang bị hệ thống chữa cháy tự động và/hoặc hệ thống báo cháy tự động cho toàn bộ nhà và công trình, trừ các khu vực sau: / - Các phòng sản xuất với quy trình ướt, hồ bơi, phòng tắm, phòng rửa, phòng vệ sinh; / - Gian phòng hạng nguy hiểm cháy D; / - Hành lang bên; / - Thang bộ; / - Khoang đệm ngăn cháy có tăng áp; / - Khu vực không có nguy hiểm về cháy.
   Khoản, Điều: Điều 4.12 TCVN 3890:2023 | Tra ở: bảng hệ thống B34–B50
#12 | TT - | Lắp đặt đầu báo tại các không gian bị che kín
   Gợi ý đọc bản vẽ: -
   Quy định: Số lượng đầu báo cháy tự động cần phải lắp đặt cho một khu vực bảo vệ phụ thuộc vào yêu cầu phát hiện cháy trên toàn bộ diện tích của khu vực đó và phải bảo đảm yêu cầu kỹ thuật của thiết bị. / Trường hợp nhà có trần treo giữa các lớp trần có lắp đặt các hệ thống kỹ thuật, cáp điện, cáp tín hiệu thì phải lắp bổ sung đầu báo cháy ở trần phía trên.
   Khoản, Điều: Điều 6.3 / TCVN5738:2021 | Tra ở: bảng hệ thống B34–B50
#13 | TT - | Cách lắp đặt đầu báo cháy tại các vị trí có dầm xà cột lớn
   Gợi ý đọc bản vẽ: -
   Quy định: Các đầu báo cháy khói và đầu báo cháy nhiệt được lắp dưới trần nhà hoặc mái nhà. Trong trường hợp không lắp được trên trần nhà hoặc mái nhà cho phép lắp trên dầm, xà, cột hoặc treo các đầu báo cháy trên dây dưới trần nhà nhưng phải cách trần nhà không quá 0,3 m tính cả kích thước của đầu báo cháy tự động và lưu ý các nội dung sau: / - Đối với nhà mái dốc và nhà mái đỉnh chữ A, vị trí lắp đặt đầu báo cháy đầu tiên phải nằm trong phạm vi khu vực 0,9 m tính từ đỉnh mái, ngoại trừ khu vực dưới mái và cách đỉnh mái 0,1 m theo phương ngang (đây được coi là vùng không khí chết, không chuyển động nên khi cháy nhiệt độ và khói khó xâm nhập được vào vùng này). Các đầu báo cháy còn lại được xác định vị trí và khoảng cách trên cơ sở hình chiếu bằng của mái, các thông số tính toán như trường hợp trần phẳng.
   Khoản, Điều: 6.4 / TCVN 5738:2021 | Tra ở: bảng hệ thống B34–B50
#14 | TT - | 
   Gợi ý đọc bản vẽ: -
   Quy định: Phải lắp đặt bổ sung đầu báo cháy khói, đầu báo cháy nhiệt kiểu điểm ở bên dưới cấu trúc có chiều cao lớn hơn 0,4 m tính từ trần nhà đến vị trí thấp nhất của phần nhô ra và chiều rộng lớn hơn hoặc bằng 0,75 m. / Trường hợp trần nhà có những phần nhô ra về phía dưới từ 0,08 m đến 0,4 m thì việc lắp đặt đầu báo cháy tự động được tính như trần nhà không có các phần nhô ra nói trên nhưng diện tích bảo vệ của một đầu báo cháy tự động giảm 25 %. / Trường hợp trần nhà có những phần nhô ra về phía dưới trên 0,4 m và độ rộng nhỏ hơn 0,75 m thì việc lắp đặt đầu báo cháy tự động được tính như trần nhà không có các phần nhô ra nói trên nhưng diện tích bảo vệ của một đầu báo cháy tự động giảm 40 %.
   Khoản, Điều: 6.5 / TCVN 5738:2021 | Tra ở: bảng hệ thống B34–B50
#15 | TT - | Yêu cầu đối với trần dạng hở
   Gợi ý đọc bản vẽ: -
   Quy định: Đầu báo cháy khói, đầu báo cháy nhiệt kiểu điểm khi lắp đặt trên trần nhà cho phép được sử dụng để bảo vệ không gian bên dưới trần treo hở, nếu đáp ứng được đồng thời các điều kiện sau: / - Khoảng hở có cấu trúc tuần hoàn và diện tích của nó vượt quá 40 % bề mặt; / - Kích thước tối thiểu của mỗi khoảng hở trong bất kỳ phần nào không nhỏ hơn 10 mm; / - Độ dầy của tấm trần treo không lớn hơn ba lần kích thước tối thiểu của lỗ hở. / Nếu một trong những điều kiện trên không được đáp ứng, các đầu báo cháy phải được lắp đặt trong vị trí chính dưới trần treo, trường hợp cần thiết phải lắp đặt bổ sung đầu báo cháy bảo vệ khu vực trên trần treo.
   Khoản, Điều: Điều 6.7 / TCVN 5738:2021 | Tra ở: bảng hệ thống B34–B50
#16 | TT 1.3 | Tủ trung tâm báo cháy
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#17 | TT - | Vị trí lắp đặt
   Gợi ý đọc bản vẽ: -
   Quy định: Trung tâm báo cháy tự động phải đặt ở những nơi thường xuyên có người trực suốt ngày đêm. Trong trường hợp không có người trực suốt ngày đêm, trung tâm báo cháy phải có chức năng truyền các tín hiệu báo cháy và báo sự cố đến nơi trực cháy hay nơi có người thường trực suốt ngày đêm và phải có biện pháp phòng ngừa người không có nhiệm vụ tiếp xúc với trung tâm báo cháy. / Trung tâm báo cháy tự động phải có chức năng tự động truyền tin báo cháy đến đơn vị Cảnh sát Phòng cháy, chữa cháy và cứu nạn, cứu hộ. / Nơi đặt các trung tâm báo cháy phải có điện thoại liên lạc trực tiếp với đơn vị Cảnh sát Phòng cháy, chữa cháy và cứu nạn, cứu hộ hay nơi nhận tin báo cháy.
   Khoản, Điều: Điều 5.2 / TCVN 5738:2021 | Tra ở: bảng hệ thống B34–B50
#18 | TT - | Nguồn điện cấp cho tủ báo cháy
   Gợi ý đọc bản vẽ: -
   Quy định: Trung tâm của hệ thống báo cháy tự động phải có hai nguồn điện độc lập: Một nguồn 220 V xoay chiều và một nguồn là ắc quy dự phòng. / Giá trị dao động của hiệu điện thế của nguồn xoay chiều cung cấp cho trung tâm báo cháy không được vượt quá ± 10 %. Trường hợp giá trị dao động này lớn hơn 10 % phải sử dụng ốn áp trước khi cấp cho trung tâm. / Dung lượng của ắc quy dự phòng phải bảo đảm ít nhất 24 h cho thiết bị hoạt động ở chế độ thường trực và 1 h khi có cháy. / Khi sử dụng ắc quy làm nguồn điện, ắc quy phải được nạp điện tự động
   Khoản, Điều: 10.1 / TCVN 5738:2021 | Tra ở: bảng hệ thống B34–B50
#19 | TT - | 
   Gợi ý đọc bản vẽ: Lưu ý đối với nhà cao từ 50-150m
   Quy định: Điện cấp cho các hệ thống thiết bị kỹ thuật nêu dưới đây phải bảo đảm duy trì sự làm việc của các thiết bị đó trong thời gian không ít hơn 3 giờ kể từ khi có cháy và phải được lấy từ 2 nguồn cấp độc lập: / - Thang máy chữa cháy; / - Các thiết bị của hệ thống bảo vệ chống cháy; / - Hệ thống báo cháy tự động và hướng dẫn thoát nạn; / - Các thiết bị của hệ thống chữa cháy tự động và cấp nước chữa cháy; / - Các thiết bị bảo vệ chống cháy cho hệ thống thiết bị kỹ thuật; / - Các trang thiết bị phục vụ cứu hộ - cứu nạn.
   Khoản, Điều: A.2.28.1 / QCVN06:2022 | Tra ở: chưa nạp: đọc cột quy định của bảng
#20 | TT - | Giám sát và điều khiển các hệ thống, thiết bị khác
   Gợi ý đọc bản vẽ: -
   Quy định: - Trường hợp hệ thống báo cháy tự động dùng để điều khiển hệ thống chữa cháy tự động thì mỗi điểm trong khu vực bảo vệ phải được kiểm soát bằng 2 đầu báo cháy tự động thuộc 2 kênh hoặc 2 địa chỉ khác nhau.
   Khoản, Điều: 6.3 / TCVN 5738:2021 | Tra ở: bảng hệ thống B34–B50
#21 | TT 1.5 | Các bộ phận liên kết: Cáp, dây dẫn tín hiệu, dây dẫn nguồn
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#22 | TT - | Yêu cầu về loại cáp, dây dẫn tín hiệu
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#23 | TT + | Cáp, dây tín hiệu điều khiển thiết bị ngoại vi
   Gợi ý đọc bản vẽ: -
   Quy định: - Cáp tín hiệu điều khiển thiết bị ngoại vi, dây tín hiệu nối từ các đầu báo cháy trong hệ thống báo cháy tự động dùng để kích hoạt hệ thống chữa cháy tự động là loại chịu nhiệt cao (cáp, dây tín hiệu chống cháy có thời gian chịu lửa 30 min). Cho phép sử dụng cáp tín hiệu điều khiển thiết bị ngoại vi là loại cáp thường nhưng phải có biện pháp bảo vệ khỏi sự tác động của nhiệt ít nhất trong thời gian 30 min.
   Khoản, Điều: Điều 8.6 / TCVN 5738:2021 | Tra ở: bảng hệ thống B34–B50
#24 | TT - | Nhà hỗn hợp từ 50 đến 150m
   Gợi ý đọc bản vẽ: -
   Quy định: Việc đấu nối dây điện từ thiết bị phân phối đầu vào đến các hệ thống bảo vệ chống
cháy (thiết bị điện của hệ thống chữa cháy, báo cháy, hút xả khói, chiếu sáng thoát nạn...) phải được thực hiện bằng các cáp có khả năng chịu lửa, có lớp khỏang cách điện, có giới hạn chịu lửa không thấp hơn 120 phút
   Khoản, Điều: A.2.28.8 / QCVN06:2022 | Tra ở: chưa nạp: đọc cột quy định của bảng
#25 | TT 1.6 | Hộp Nút ấn báo cháy
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#26 | TT - | Hộp nút ấn báo cháy lắp đặt bên ngoài nhà
   Gợi ý đọc bản vẽ: -
   Quy định: Trường hợp nút ấn báo cháy được lắp ở bên ngoài tòa nhà thì khoảng cách tối đa giữa các nút ấn báo cháy là 150 m và phải có ký hiệu, chỉ thị vị trí rõ ràng. Nút ấn báo cháy lắp ngoài nhà phải là loại chống thấm nước hoặc phải có biện pháp chống nước mưa cũng như các tác động từ môi trường. Nơi lắp đặt các nút ấn báo cháy phải được chiếu sáng liên tục vào ban đêm.
   Khoản, Điều: Điều 7.3 / TCVN 5738:2021 | Tra ở: bảng hệ thống B34–B50
#27 | TT - | Độ cao lắp đặt của hộp nút ấn báo cháy
   Gợi ý đọc bản vẽ: -
   Quy định: Nút ấn báo cháy được lắp bên trong, bên ngoài nhà và công trình, được lắp trên tường và các cấu kiện xây dựng ở độ cao 1,4 m ± 0,2 m tính từ mặt sàn hay mặt đất và có một không gian trống dạng nửa đường tròn bán kính 0,6 m xung quanh mặt trước của nút ấn báo cháy
   Khoản, Điều: Điều 7.1 / TCVN 5738:2021 | Tra ở: bảng hệ thống B34–B50
#28 | TT - | Khoảng cách giới hạn cho phép đến hộp nút ấn báo cháy
   Gợi ý đọc bản vẽ: -
   Quy định: Trong trường hợp xét thấy cần thiết có thể lắp trong từng phòng. Khoảng cách giữa các nút ấn báo cháy không quá 45 m và khoảng cách từ nút ấn báo cháy đến lối ra của mọi gian phòng không quá 30 m.
   Khoản, Điều: Điều 7.2 / TCVN 5738:2021 | Tra ở: bảng hệ thống B34–B50
#29 | TT 1.7 | Các loại đầu báo cháy
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#30 | TT 1.7.1 | Đầu báo khói kiểu điểm
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#31 | TT - | Khoảng cách lắp đặt của đầu báo cháy khói kiểu điểm
   Gợi ý đọc bản vẽ: -
   Quy định: Diện tích bảo vệ của một đầu báo cháy khói, khoảng cách tối đa giữa các đầu báo cháy khói với nhau và giữa đầu báo cháy khói với tường nhà phải xác định theo Bảng 1, nhưng không được lớn hơn các trị số ghi trong tài liệu kỹ thuật của đầu báo cháy khói.
   Khoản, Điều: Điều 6.13 / TCVN 5738:2021 | Tra ở: bảng hệ thống B34–B50
#32 | TT - | 
   Gợi ý đọc bản vẽ: -
   Quy định: Khi lắp đặt đầu báo cháy khói kiểu điểm tại các khu vực có chiều rộng dưới 3 m, hoặc dưới sàn nâng hoặc trên trần treo và trong các không gian khác có chiều cao dưới 1,7 m, khoảng cách giữa các đầu báo cháy quy định tại Bảng 1 được phép tăng 1,5 lần.
   Khoản, Điều: Điều 6.6 / TCVN 5738:2021 | Tra ở: bảng hệ thống B34–B50
#33 | TT 1.7.2 | Đầu báo cháy khói tia chiếu
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#34 | TT - | 
   Gợi ý đọc bản vẽ: -
   Quy định: Các đầu báo cháy khói tia chiếu được sử dụng cho các khu vực bảo vệ có độ cao đến 21 m. Khoảng cách giữa các tia chiếu với tường không lớn hơn 4,5 m và giữa các tia chiếu không lớn hơn 9,0 m. Đối với khu vực mái dốc hoặc mái chữ A, khoảng cách trên được xác định theo phương ngang.
   Khoản, Điều: 6.14 / TCVN 5738:2021 | Tra ở: bảng hệ thống B34–B50
#35 | TT - | 
   Gợi ý đọc bản vẽ: -
   Quy định: Khoảng cách từ tia chiếu đến trần phải trong khoảng 0,025 m đến 0,6 m. Cho phép tia chiếu cách trần lớn hơn 0,6 m khi khoảng cách giữa các tia chiếu không lớn hơn 25 % chiều cao lắp đặt của đầu báo cháy khói tia chiếu và khoảng cách giữa tia chiếu với tường không lớn hơn 12,5 % chiều cao lắp đặt đầu báo cháy khói tia chiếu, khi đó khoảng cách của tia chiếu theo phương đứng đến điểm cao nhất của chất cháy không nhỏ hơn 2 m.
   Khoản, Điều: 6.14 | Tra ở: chưa nạp: đọc cột quy định của bảng
#36 | TT 1.7.3 | Đầu báo cháy nhiệt
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#37 | TT - | Khoảng cách giữa các đầu báo cháy nhiệt kiểu điểm trên bề mặt bằng phẳng
   Gợi ý đọc bản vẽ: -
   Quy định: Diện tích bảo vệ của một đầu báo cháy nhiệt, khoảng cách tối đa giữa các đầu báo cháy nhiệt với nhau và giữa đầu báo cháy nhiệt với tường nhà phải xác định theo Bảng 2, nhưng không được lớn hơn các trị số ghi trong tài liệu kỹ thuật của đầu báo cháy nhiệt.
   Khoản, Điều: 6.15 / TCVN 5738:2021 | Tra ở: bảng hệ thống B34–B50
#38 | TT 1.7.4 | Đầu báo cháy lửa
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#39 | TT - | Vị trí lắp đặt
   Gợi ý đọc bản vẽ: -
   Quy định: Các đầu báo cháy lửa trong các phòng hoặc khu vực bảo vệ phải được lắp trên trần nhà, tường nhà và các cấu kiện xây dựng khác hoặc lắp ngay trên thiết bị cần bảo vệ. Trường hợp phát sinh khói trong giai đoạn đầu của đám cháy thì khoảng cách của đầu báo cháy lửa đến trần không nhỏ hơn 0,8 m.
   Khoản, Điều: Điều 6.16.1 / TCVN 5738:2021 | Tra ở: bảng hệ thống B34–B50
#40 | TT 1.7.5 | Đầu báo cháy khói kiểu hút
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: Điều 6.17 / TCVN 5738:2021 | Tra ở: bảng hệ thống B34–B50
#41 | TT - | Chiều cao bố trí đầu báo cháy
   Gợi ý đọc bản vẽ: -
   Quy định: Loại A: đến 30 m / Loại B: đến 18 m / Loại C: đến 12 m
   Khoản, Điều: - | Tra ở: -
#42 | TT - | Khoảng cách giữa các lỗ hút
   Gợi ý đọc bản vẽ: -
   Quy định: Giữa các lỗ hút tối đa 9m / Khoảng cách từ lỗ hút đến tường 4,5m
   Khoản, Điều: - | Tra ở: -
#43 | TT ……(3)…… / (Chữ ký và họ tên) | ……(4)…… / (Chữ ký và họ tên)
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -

## Định dạng trả lời
Chỉ trả về MỘT khối ```json, không viết gì ngoài khối đó:
{"dong":[{"bang":"B15","idx":90,"tt":"7.2.3","noi_dung_thiet_ke":"thiết kế có gì (số liệu, trang)","ket_luan":"DAT|CHUA_DAT|CAN_XAC_NHAN|KHONG_AP_DUNG","ly_do":"lý do có số","dieu_khoan":"Đ 3.2.8 QCVN 06:2022/SĐ1:2023","chinh_ban_ve":"(nếu có)","nguon":[{"trang":12,"ghi_chu":"mặt bằng tầng 1"}],"vi_tri":[{"trang":12,"anchor":"D3"}],"huong_dan":"cách thiết kế cho đạt: giải pháp cụ thể, trị số yêu cầu, điều khoản"}],"ghi_chu":"điều cần lưu ý chung (nếu có)"}
Trả về đủ MỌI dòng được giao (theo "idx"), đúng thứ tự.
Hướng dẫn thiết kế đang BẬT: mọi dòng CHUA_DAT, CAN_XAC_NHAN, có chinh_ban_ve, và các dòng yêu cầu chính (dù DAT) phải có "huong_dan" viết cho người thiết kế.