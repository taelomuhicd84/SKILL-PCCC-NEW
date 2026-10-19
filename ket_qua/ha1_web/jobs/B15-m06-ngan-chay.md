# Agent Mục 6 – Ngăn cháy, chống cháy lan
Bạn là cán bộ thẩm duyệt thiết kế PCCC. Việc: Ngăn cháy ngang, đứng, theo công năng, hành lang; vật liệu; cửa, tường, sàn ngăn cháy; tỉ lệ cửa/tường.

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
- skills/SKILL_ngan_chay_cong_nang.md
- skills/MOD_hanh_lang_bao_che.md
- skills/MOD_vat_lieu_hoan_thien.md
- knowledge/dinh-nghia/dinh-nghia.md
Nếu cột "Tra ở" ghi "chưa nạp", dùng cột "Quy định" của chính dòng đó.

## Các dòng cần xét – bảng B15, mục "Giải pháp ngăn cháy, chống cháy lan" (29 dòng)
#39 | TT 6 | Giải pháp ngăn cháy, chống cháy lan
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#40 | TT 6.1 | Ngăn cháy theo chiều ngang
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#41 | TT - | + Tầng hầm
   Gợi ý đọc bản vẽ: Diện tích khoang cháy tầng hầm khi bố trí công năng khác gara thì căn cứ theo diện tích khoang cháy có thể tham khảo tương ứng đối với nhà một tầng theo quy định tại phụ lục H
   Quy định: -
   Khoản, Điều: Phụ lục H / QCVN 06:2022 | Tra ở: chưa nạp: đọc cột quy định của bảng
#42 | TT - | + Các tầng nổi
   Gợi ý đọc bản vẽ: -
   Quy định: Phụ lục H
   Khoản, Điều: Phụ lục H QCVN 06:2022/BXD | Tra ở: chưa nạp: đọc cột quy định của bảng
#43 | TT 6.2 | Ngăn cháy theo chiều đứng
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#44 | TT - | Ngăn cháy lan sảnh thông tầng
   Gợi ý đọc bản vẽ: Trong đó lưu ý: tại mục d của điều 4.35 Sửa đổi 1: 2023 có dẫn chiếu diện tích tầng trong phạm vi khoang cháy có sảnh thông tầng được xác định theo Phụ lục H
   Quy định: Sảnh thông tầng phải được đặt trong khối tích của một khoang cháy, ở các lỗ mở của các sàn giữa các tầng của nó cho phép bố trí các thang máy cuốn, thang bộ hở và thang máy (kể cả thang máy toàn cảnh)
   Khoản, Điều: Điều 4.35 / QCVN 06:2022 và Sửa đổi 1: 2023 | Tra ở: chưa nạp: đọc cột quy định của bảng
#45 | TT - | Ngăn cháy theo phương đứng của nhà
   Gợi ý đọc bản vẽ: -
   Quy định: Điều 4.33.1 đến điều 4.33.3 / Trong đó lưu ý tại điều 4.33.4 Cho phép không áp dụng các quy định tại 4.33 đối với nhà từ ba tầng trở xuống hoặc có chiều cao PCCC dưới 15 m, ga ra để xe nổi dạng hở, hoặc nhà được trang bị chữa cháy tự động
   Khoản, Điều: Điều 4.33 / QCVN 06:2022 và Sửa đổi 1: 2023 | Tra ở: chưa nạp: đọc cột quy định của bảng
#46 | TT 6.3 | Ngăn cháy theo công năng
   Gợi ý đọc bản vẽ: -
   Quy định: - Các phần nhà và các gian phòng thuộc các nhóm nguy hiểm cháy theo công năng khác nhau phải được ngăn cách với nhau bằng các bộ phận ngăn chia với giới hạn chịu lửa và cấp nguy hiểm cháy kết cấu theo quy định hoặc ngăn cách nhau bằng bộ phận ngăn cháy có giới hạn chịu lửa tối thiểu El 45 đối với nhà có bậc chịu lửa I đến III; tối thiểu El 15 đối với nhà có bậc chịu lửa IV; hoặc giải pháp ngăn cháy tương đương khác, trừ khi có quy định khác trong quy chuẩn này hoặc các quy chuẩn, tiêu chuẩn chuyên ngành. Khi đó, yêu cầu đối với các kết cấu ngăn cách và bộ phận ngăn cháy này được xem xét có kể đến tính nguy hiểm cháy theo công năng của các gian phòng, giá trị tải trọng cháy, bậc chịu lửa và cấp nguy hiểm cháy kết cấu của nhà. / - Đối với một tầng nhà có từ hai công năng khác nhau trở lên, trong đó có một công năng chính chiếm tối thiểu 90 % diện tích sàn tầng và các công năng còn lại là phụ trợ cho công năng chính, cho phép không cần phân chia các khu vực thuộc các nhóm nguy hiểm cháy theo công năng khác nhau bằng bộ phận ngăn cháy, khi đó toàn bộ tầng nhà này phải tuân thủ các yêu cầu an toàn cháy tương ứng với nhóm nguy hiểm cháy theo công năng chính. Quy định này không áp dụng cho trường hợp các gian phòng với công năng phụ trợ có hạng nguy hiểm cháy và cháy nổ cao hơn các gian phòng với công năng chính. / Trong các nhà nhóm F1, F2, F3, F4, không yêu cầu ngăn cháy với các công năng khác đối với các gian phòng sau (trừ các trường hợp riêng được quy định trong quy chuẩn này h…
   Khoản, Điều: Đ 4.5 QCVN 06:2022 và Sửa đổi 1: 2023 | Tra ở: SKILL_ngan_chay
#47 | TT 6.4 | Ngăn cháy hành lang giữa thoát nạn
   Gợi ý đọc bản vẽ: Riêng các nhà kinh doanh dịch vụ karaoke, vũ trường phải bảo đảm việc ngăn cách hành lang, gian phòng trên đường thoát nạn bằng các bộ phận ngăn cháy như quy định của điều 3.3.5 QCVN 06:2022/BXD và sửa đổi 1
   Quy định: Các hành lang, sảnh, phòng chung trên đường thoát nạn phải được bao che bằng các bộ phận ngăn cháy phù hợp quy định trong các quy chuẩn cho từng loại công trình. Bộ phận ngăn cháy bao che đường thoát nạn của nhà có bậc chịu lửa I phải làm bằng vật liệu không cháy với giới hạn chịu lửa ít nhất EI 30, và của nhà có bậc chịu lửa II, III, IV phải làm bằng vật liệu không cháy hoặc cháy yếu (Ch1) với giới hạn chịu lửa ít nhất EI 15. Riêng nhà có hạng nguy hiểm cháy và cháy nổ D, E có thể bao che hành lang bằng tường kính hoặc bộ phận bao che từ vật liệu không cháy. Không yêu cầu giới hạn chịu lửa của tường ngăn và các ô cửa giữa các gian phòng và hành lang bên (trừ các gian phòng nhóm F5 hạng A, B, C hoặc bếp). / Đối với các tầng nhà có hành lang, gian phòng không được bao che bằng các bộ phận ngăn cháy theo quy định tại điểm 3.3.5 hoặc không tuân thủ yêu cầu tại 3.3.4 thì khoảng cách giới hạn cho phép của đường thoát nạn (Phụ lục G) phải tính từ điểm xa nhất có thể có người của gian phòng trên tầng nhà đó. Riêng các nhà kinh doanh dịch vụ karaoke, vũ trường phải bảo đảm việc ngăn cách hành lang, gian phòng trên đường thoát nạn bằng các bộ phận ngăn cháy như quy định ở trên. Các nhà nhóm F1.3 phải tuân thủ quy định tại 4.5.”.
   Khoản, Điều: Đ 3.3.5 / QCVN 06:2022 và sửa đổi 1:2023 | Tra ở: MOD_hanh_lang
#48 | TT 6.5 | Đường ống kỹ thuật, cáp
   Gợi ý đọc bản vẽ: -
   Quy định: Khi bố trí các đường ống kỹ thuật, đường cáp đi xuyên qua các kết cấu tường, sàn, vách, thì chỗ tiếp giáp giữa các đường ống, đường cáp với các kết cấu này phải được chèn bịt hoặc xử lý thích hợp để không làm giảm các chỉ tiêu kỹ thuật về cháy theo yêu cầu của kết cấu.
   Khoản, Điều: Đ4.12 / QCVN 06:2022 | Tra ở: chưa nạp: đọc cột quy định của bảng
#49 | TT 6.6 | Trong các trần treo
   Gợi ý đọc bản vẽ: -
   Quy định: Các vách ngăn cháy trong các gian phòng có trần treo phải ngăn chia cả không gian phía trên trần treo, và trong không gian này không cho phép bố trí các kênh và đường ống dẫn để vận chuyển các chất cháy dạng khí, hỗn hợp bụi – khí, chất lỏng và vật liệu cháy. / Không được bố trí trần treo trong các gian phòng hạng A hoặc B. / Nếu sử dụng trần treo để tăng giới hạn chịu lửa của sàn giữa các tầng và sàn mái, thì các trần treo này phải phù hợp với các yêu cầu về tính nguy hiểm cháy đối với sàn giữa các tầng và sàn mái này.
   Khoản, Điều: Đ 4.15 / QCVN 06:2022 | Tra ở: chưa nạp: đọc cột quy định của bảng
#50 | TT 6.7 | Vật liệu hoàn thiện
   Gợi ý đọc bản vẽ: Trong đó lưu ý tại điều 3.5.10 Sửa đổi 1: 2023 / Cho phép áp dụng các yêu cầu về an toàn cháy đối với vật liệu hoàn thiện, trang trí, vật liệu ốp lát, vật liệu phủ sàn và các tiêu chí thử nghiệm tương ứng theo các tài liệu chuẩn được phép áp dụng để thay thế cho các yêu cầu từ 3.5.1 đến 3.5.9 và Phụ…
   Quy định: Điều 3.5.1 đến 3.5.10
   Khoản, Điều: Điều 3.5 / QCVN 06:2022 / Bảng B.6 , bảng B8 / QCVN 06:2022/BXD / và Sửa đổi 1: 2023 | Tra ở: MOD_vat_lieu
#51 | TT 6.8 | Cơ cấu tự đóng
   Gợi ý đọc bản vẽ: -
   Quy định: - Các lỗ thông trong các bộ phận ngăn cháy phải được đóng kín khi có cháy. / - Các cửa sổ trong các bộ phận ngăn cháy phải là các cửa không mở được, còn các cửa đi, cổng, cửa nắp và van phải có cơ cấu tự đóng và các khe cửa phải được chèn kín. / - Các cửa đi, cổng, cửa nắp và van nếu cần mở để khai thác sử dụng thì phải được lắp các thiết bị tự động đóng kín khi có cháy
   Khoản, Điều: Đ 4.18 / QCVN 06:2022 | Tra ở: chưa nạp: đọc cột quy định của bảng
#52 | TT 6.9 | Bố trí kênh giếng kỹ thuật
   Gợi ý đọc bản vẽ: -
   Quy định: - Không cho phép bố trí các kênh, giếng và đường ống vận chuyển khí cháy, hỗn hợp bụi – khí cháy, chất lỏng cháy, chất và vật liệu cháy xuyên qua các tường và sàn ngăn cháy loại 1. / - Đối với các kênh, giếng và đường ống để vận chuyển các chất và vật liệu khác với các loại nói trên thì tại các vị trí giao cắt với các bộ phận ngăn cháy này phải có thiết bị tự động ngăn cản sự lan truyền của các sản phẩm cháy theo các kênh, giếng và ống dẫn / - Cho phép đặt ống thông gió và ống khói trong tường ngăn cháy của nhà ở, công trình công cộng và nhà phụ trợ khi chiều dầy tối thiểu của tường ngăn cháy (trừ tiết diện đường ống) ở chỗ đó không được dưới 25 cm, còn bề dày phần ngăn giữa ống khói và ống thông hơi tối thiểu là 12 cm
   Khoản, Điều: Đ4.22 / QCVN 06:2022 | Tra ở: chưa nạp: đọc cột quy định của bảng
#53 | TT 6.10 | Tường ngăn cháy
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#54 | TT - | Chiều cao tường ngăn cháy
   Gợi ý đọc bản vẽ: -
   Quy định: Các tường ngăn cháy mà phân chia nhà thành các khoang cháy phải được thi công trên toàn bộ chiều cao nhà và phải bảo đảm không để cháy lan truyền từ phía nguồn cháy vào khoang cháy liền kề khi các kết cấu nhà ở phía có cháy bị sụp đổ
   Khoản, Điều: Đ4.17 / QCVN 06:2022 | Tra ở: chưa nạp: đọc cột quy định của bảng
#55 | TT - | Tỷ lệ cửa trên tường ngăn cháy
   Gợi ý đọc bản vẽ: Lưu ý: / - Tính diện tích cửa trên các tường tiếp giáp giữa 2 khoang cháy không quá 25%.
   Quy định: Tổng diện tích các lỗ cửa trong các bộ phận ngăn cháy, trừ kết cấu bao che của các giếng thang máy, không được vượt quá 25 % diện tích của bộ phận ngăn cháy
   Khoản, Điều: Đ 4.19 / QCVN 06:2022 | Tra ở: chưa nạp: đọc cột quy định của bảng
#56 | TT - | Yêu cầu thiết kế
   Gợi ý đọc bản vẽ: -
   Quy định: ﻿Tường ngăn cháy loại 1 phải chia cắt các tường ngoài có cấp nguy hiểm cháy K1, K2, K3 và vươn ra khỏi mặt phẳng tường ngoài tối thiểu 30 cm. / Cho phép không chia cắt các tường ngoài nếu tường ngoài có cấp nguy hiểm cháy K0, hoặc tường ngăn cháy loại 1 tiếp giáp với dải tường ngoài theo phương đứng (dải ngăn cháy theo phương đứng) có chiều rộng tối thiểu 1,2 m, có giới hạn chịu lửa không thấp hơn E 60 và có cấp nguy hiểm cháy K0. / Tường ngăn cháy loại 2 và vách ngăn cháy loại 1, nếu có giao với tường ngoài thì phải tiếp giáp với dải ngăn cháy theo phương đứng, có bề rộng không nhỏ hơn 1 m, có giới hạn chịu lửa quy định cho tường ngoài theo Bảng 4 hoặc Bảng A.1 tùy chiều cao nhà. Vách ngăn cháy loại 2 phải tiếp xúc với dải tường ngoài đặc theo phương đứng, có bề rộng không nhỏ hơn 1 m, có giới hạn chịu lửa quy định cho tường ngoài theo Bảng 4 hoặc Bảng A.1 tùy chiều cao nhà. / Cho phép không áp dụng các quy định tại 4.32.1 nếu nhà được trang bị chữa cháy tự động
   Khoản, Điều: Đ 4.32 / QCVN 06:2022 và Sửa đổi 1: 2023 | Tra ở: chưa nạp: đọc cột quy định của bảng
#57 | TT - | Trần treo
   Gợi ý đọc bản vẽ: Lưu ý: Trường hợp thiết kế giải pháp phân chia các gian phòng thành gian phòng được ngăn cách với nhau bằng vách ngăn cháy loại 1 để tính toán lưu lượng nước chữa cháy cho gian phòng lớn nhất của hệ thống chữa cháy tự động sprinkler thì vách ngăn cháy giữa các gian phòng, gian phòng với hành lang ph…
   Quy định: Các vách ngăn cháy trong các gian phòng có trần treo phải ngăn chia cả không gian phía trên trần treo, và trong không gian này không cho phép bố trí các kênh và đường ống dẫn để vận chuyển các chất cháy dạng khí, hỗn hợp bụi - khí, chất lỏng và vật liệu cháy. / Nếu sử dụng trần treo để tăng giới hạn chịu lửa của sàn giữa các tầng và sàn mái, thì các trần treo này phải phù hợp với các yêu cầu về tính nguy hiểm cháy đối với sàn giữa các tầng và sàn mái này.
   Khoản, Điều: Đ 4.15 QCVN 06:2022/BXD | Tra ở: chưa nạp: đọc cột quy định của bảng
#58 | TT 6.11 | Ngăn cháy thang máy
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#59 | TT - | 
   Gợi ý đọc bản vẽ: Chỉ yêu cầu GHCL của cửa tầng thang máy trường hợp kết cấu bao che thang máy có yêu cầu giới hạn chịu lửa. Khi đó GHCL của cửa tầng thang máy xác định theo bảng 1 và bảng 2, tức là E30. / Trường hợp trước sảnh thang máy có khoang đệm ngăn cháy hoặc sảnh được bao che bởi các bộ phận ngăn cháy như tại…
   Quy định: Các kết cấu bao che của các giếng thang máy (trừ các giếng đã nêu tại 3.4.6) và các phòng máy của thang máy (trừ các phòng trên mái), cũng như của các kênh, giếng và hộp kỹ thuật phải đáp ứng các yêu cầu đặt ra như đối với các vách ngăn cháy loại 1 và các sàn ngăn cháy loại 3. Không quy định giới hạn chịu lửa của các kết cấu bao che giữa giếng thang máy và phòng máy của thang máy. Không yêu cầu giới hạn chịu lửa đối với cửa giếng thang máy mở ra hành lang bên / - Khi không thể lắp các cửa ngăn cháy trong các kết cấu bao che các giếng thang máy, phải bố trí các khoang đệm hoặc các sảnh với các vách ngăn cháy loại 1 hoặc màn ngăn cháy với giới hạn chịu lửa tương đương, hoặc màn nước drencher như quy định tại H.2.12.7 và sàn ngăn cháy loại 3 hoặc các màn chắn tự động đóng các lỗ cửa đi của giếng thang khi cháy, có GHCL không nhỏ hơn E 30 / - Trong các nhà có buồng thang bộ không nhiễm khói phải bố trí bảo vệ chống khói tự động cho các giếng thang máy mà tại cửa ra của chúng không có các khoang đệm ngăn cháy với áp suất không khí dương khi cháy
   Khoản, Điều: Đ 4.23 / QCVN 06:2022 / và Sửa đổi 1: 2023 | Tra ở: chưa nạp: đọc cột quy định của bảng
#60 | TT 6.12 | Bố trí khoang đệm trước lối vào thang máy hầm
   Gợi ý đọc bản vẽ: -
   Quy định: Trong tầng hầm hoặc tầng nửa hầm, trước lối vào các thang máy phải bố trí các khoang đệm ngăn cháy loại 1 có áp suất không khí dương khi cháy. / Cửa và van ngăn cháy của khoang đệm phải có giới hạn chịu lửa EI30.
   Khoản, Điều: Đ 4.28 Bảng 3; / 2.4.3; / QCVN 06:2022 | Tra ở: MOD_cau_thang
#61 | TT 6.13 | Buồng rác
   Gợi ý đọc bản vẽ: Có thể xem xét bố trí phòng rác tại tầng hầm 1 khi đảm bảo theo điều 4.24 QCVN 06:2022
   Quy định: - Các ống đổ rác và buồng chứa rác ngăn cách với phần khác của ngôi nhà bằng các bộ phận ngăn cháy; cửa thu rác ở các là cửa ngăn cháy tự động đóng kín / - Ống đổ rác phải được làm bằng vật liệu không cháy. / - Không được đặt các ống đổ rác và buồng chứa rác bên trong các buồng thang bộ, sảnh đợi hoặc khoang đệm được bao bọc ngăn cháy dùng cho thoát nạn / - Các buồng có chứa ống đổ rác hoặc để chứa rác phải bảo đảm có lối vào trực tiếp qua một khoảng thông thoáng bên ngoài nhà hoặc qua một khoang đệm ngăn cháy được thông gió thường xuyên / - Cửa vào buồng chứa rác không được đặt liền kề với các lối thoát nạn hoặc cửa ra bên ngoài của nhà hoặc đặt gần với cửa sổ của nhà ở
   Khoản, Điều: Đ 4.24 QCVN 06:2022 | Tra ở: chưa nạp: đọc cột quy định của bảng
#62 | TT 6.14 | Cửa ngăn cháy
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#63 | TT - | Bộ tự đóng
   Gợi ý đọc bản vẽ: - Cửa các buồng đệm, thang bộ, cửa phòng rác có cơ cấu tự đóng; / - Cửa các gian phòng, cửa ngăn cháy hành lang có bảo vệ chống khói cưỡng bức
   Quy định: Các cửa của lối ra thoát nạn từ các gian phòng hay các hành lang được bảo vệ chống khói cưỡng bức, phải là cửa đặc được trang bị cơ cấu tự đóng và khe cửa phải được chèn kín. Các cửa này nếu cần để mở khi sử dụng, thì phải được trang bị cơ cấu tự động đóng khi có cháy
   Khoản, Điều: Đ3.2.11 / QCVN 06:2022 | Tra ở: MOD_loi_ra_va_cua
#64 | TT - | Giới hạn chịu lửa của cửa
   Gợi ý đọc bản vẽ: -
   Quy định: - Các cửa ngăn cháy phải phù hợp với GHCL của bộ phận ngăn cháy
   Khoản, Điều: QCVN 06:2022 | Tra ở: chưa nạp: đọc cột quy định của bảng
#65 | TT 6.15 | Vách ngăn cháy
   Gợi ý đọc bản vẽ: -
   Quy định: -
   Khoản, Điều: - | Tra ở: -
#66 | TT - | Vách ngăn cháy thang bộ tầng hầm với tầng 1
   Gợi ý đọc bản vẽ: -
   Quy định: Cho phép bố trí các thang bộ riêng biệt để lưu thông giữa các tầng hầm hoặc tầng nửa hầm với tầng một. Các thang bộ này phải được bao che bằng các vách ngăn cháy loại 1 với khoang đệm ngăn cháy có áp suất không khí dương khi cháy
   Khoản, Điều: Đ 4.25 / QCVN 06:2022 | Tra ở: chưa nạp: đọc cột quy định của bảng
#67 | TT - | Vách ngăn cháy hành lang
   Gợi ý đọc bản vẽ: Lưu ý trong trường hợp áp dụng ngăn cháy hành lang bằng vách, màn ngăn khói thì phải đảm bảo điều kiện biên dưới của lớp khói không thấp hơn 2m hoặc lấy theo giá trị quy định trong tài liệu chuẩn áp dụng so với mặt sàn cao nhất có thể đi bộ trong gian phòng hoặc trong hành lang được bảo vệ chống khó…
   Quy định: Các hành lang dài hơn 60 m phải được phân chia bằng các vách ngăn cháy loại 2 hoặc bằng các vách ngăn khói, màn ngăn khói, có mép dưới cách sàn hành lang tối đa 2,5 m thành các đoạn có chiều dài được xác định theo yêu cầu bảo vệ chống khói nêu tại Phụ lục D, nhưng không được vượt quá 60 m
   Khoản, Điều: Đ 3.3.5 QCVN 06:2022 và Sửa đổi 1: 2023 | Tra ở: MOD_hanh_lang

## Định dạng trả lời
Chỉ trả về MỘT khối ```json, không viết gì ngoài khối đó:
{"dong":[{"bang":"B15","idx":90,"tt":"7.2.3","noi_dung_thiet_ke":"thiết kế có gì (số liệu, trang)","ket_luan":"DAT|CHUA_DAT|CAN_XAC_NHAN|KHONG_AP_DUNG","ly_do":"lý do có số","dieu_khoan":"Đ 3.2.8 QCVN 06:2022/SĐ1:2023","chinh_ban_ve":"(nếu có)","nguon":[{"trang":12,"ghi_chu":"mặt bằng tầng 1"}],"vi_tri":[{"trang":12,"anchor":"D3"}],"huong_dan":"cách thiết kế cho đạt: giải pháp cụ thể, trị số yêu cầu, điều khoản"}],"ghi_chu":"điều cần lưu ý chung (nếu có)"}
Trả về đủ MỌI dòng được giao (theo "idx"), đúng thứ tự.
Hướng dẫn thiết kế đang BẬT: mọi dòng CHUA_DAT, CAN_XAC_NHAN, có chinh_ban_ve, và các dòng yêu cầu chính (dù DAT) phải có "huong_dan" viết cho người thiết kế.