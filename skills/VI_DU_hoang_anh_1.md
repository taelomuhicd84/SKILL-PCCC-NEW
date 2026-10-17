# VÍ DỤ: Hồ sơ Hoàng Anh 1 (Kiến Trung, KT-17/KT-18/KT-19)
Chỉ mở khi cần đối chiếu cách làm hoặc số liệu mẫu. Không áp số này cho công trình khác.

Nguồn: `KIẾN TRÚC KARAOKE HOÀNG ANH 1 02-12-2024.pdf`, trang 20–23. (File PCCC cùng dự án chỉ có hệ đèn EX-EM, KHÔNG có mặt bằng thoát nạn.) Các trị số QCVN ghi dưới đây trích từ bản vẽ này; khi áp dụng sang công trình khác phải tra lại QCVN 06, không chép nguyên.


1. Bảng ký hiệu: mũi tên đậm = hướng thoát nạn; chấm đen tròn = vị trí lối thoát xa nhất; tam giác = lối ra thoát nạn.
2. Bảng ký hiệu cửa (D1, D2, FD1…) kèm kích thước và GHCL (FD1 = cửa thoát hiểm 0,9×2,1 m, EI60). Ghi chú cửa chống cháy: có cơ cấu tự đóng, khe cửa chèn kín.
3. Ký hiệu GHSN = bảng thông báo hạn chế số người đặt trên cửa từng phòng karaoke; trong phòng ghi S, S sử dụng, S bố trí, SL_LV (số người).
4. Trên mặt bằng: tên lối thoát có kích thước ("Lối thoát nạn thứ 1: 1,9×2,3 m"), từng đoạn L ghi ngay trên đường đi, đường chéo D vẽ ra, L giữa 2 lối ghi so với ⅓D.
5. Các khối tính toán: bề rộng thoát nạn → khoảng cách thoát nạn → ghi chú chung → vật liệu hoàn thiện → kết luận.

### Thông tin công trình đọc từ bảng thống kê (KIẾN TRÚC ... 02-12-2024.pdf, trang 10)
- Công năng karaoke, nhóm nhà F2.1; diện tích 471,6 m²; 2 tầng; chiều cao mái 9,1 m; **chiều cao PCCC 7,6 m**; khối tích 4 055,76 m³; bậc chịu lửa II; cấp nguy hiểm cháy kết cấu S0; số người lớn nhất 93 (theo bảng thống kê).

### Lỗi và điểm nghi vấn đã gặp
- Số người không thống nhất: khối tính 92 (tầng trệt) / 105 (Lầu 1) nhưng ghi chú ghi "lớn nhất 93".
- Bề rộng lối 2 ghi 1,5 m ở tầng trệt nhưng 0,9 m ở Lầu 1 → hỏi người thiết kế có đổi cửa không.
- Luôn tự tính lại S1, MĐ, n; hai bản này khớp phép tính (đã kiểm: 64,46 / 60,15 m²).
- Hệ đèn EX-EM (trang 12–17 file PCCC) là lớp chỉ dẫn: biển EXIT ở cửa lối ra, EXIT tầm thấp có mũi tên dọc hành lang (cách nhau < 10 m, biển thường ≤ 25 m). Tầng trệt: cầu thang không có biển EXIT → không phải lối ra; Lầu 1: thang CT1/CT2 có biển EXIT → là lối ra. Dùng để đối chiếu với bản thoát nạn.

### Quy ước đã xác nhận với user
2. Các điểm "không khớp" đã gặp ở Hoàng Anh 1 là **lỗi vẽ nhầm của người thiết kế (đã được user xác nhận)**: lối thoát 1 Lầu 1 ghi 1,9×2,1 m trong khi cửa FD1 rộng 0,9 m; số người 92/105 và 93 ở phần ghi chú. Khi gặp lại loại sai sót ghi chú này vẫn nêu để chủ nhà soát, nhưng không coi là lỗi thiết kế. Không suy ra số đúng khi chưa được xác nhận.

### Cửa
- Ví dụ Hoàng Anh 1 tầng trệt (KT-17): D1 và D2 có cung quay lệch ra phía ngoài nhà, đúng chiều thoát. FD1 cửa phòng VIP 3 có cung quay hướng vào phòng, nhưng phòng 10 người nên thuộc ngoại lệ ≤ 15 người.
4. Cửa kính D1 1,9×2,3 m và D2 1,5×2,1 m của Hoàng Anh 1 là cửa mở (cánh bản lề), không phải cửa cuốn/quay → hợp lệ theo 3.2.3.

### Lối ra và thang
5. Hoàng Anh 1: tầng trệt đi qua hành lang ra D1/D2 → đúng 3.2.1a. Lầu 1 đi qua hành lang vào CT1 (FD1 EI60) và ra D2 sang CT2 → theo 3.2.1b. Loại thang chưa chắc chắn: bản vẽ không ghi thẳng "loại 1/2/3". Căn cứ trong bản vẽ: CT1, CT2 đều ghi "thang thoát nạn số 01/02", có nhãn "BUỒNG THANG", ghi "đóng kín buồng thang", cửa vào FD1 EI60 và ô kính/cửa sổ lấy sáng buồng thang > 1,2 m² theo 3.4.8a ("trừ buồng thang bộ loại L2 … lấy sáng bằng lỗ ≥ 1,2 m² trên tường ngoài mỗi tầng") → theo phân loại 2.4.2/2.4.3 (mục 15): đây là **cầu thang loại 1 (đặt trong buồng thang)**, buồng thang bộ **thông thường** lấy sáng qua lỗ trên tường ngoài mỗi tầng = **L1** (không phải L2, L2 là lấy sáng qua lỗ trên mái; không phải loại 3 vì đã đóng kín trong buồng thang). Bản vẽ không ghi thẳng loại → vẫn ghi "suy ra từ bản vẽ, cần user xác nhận".

- CT1, CT2: theo 2.4.2/2.4.3 là cầu thang loại 1, buồng thang thông thường L1 (suy từ bản vẽ: buồng kín, cửa FD1, ô lấy sáng trên tường ngoài); cần user xác nhận.

### N1
- Chiều cao PCCC 7,6 m, nhóm F2.1, 2 tầng: thấp hơn 28 m, không thuộc F5 hạng A/B → không yêu cầu buồng thang N1 theo 3.4.13; buồng thang thông thường L1 phù hợp. Vẫn cần user xác nhận nhóm nhà và chiều cao PCCC.

### Kết quả áp dụng quy trình đầy đủ (bản vẽ kiến trúc 20-12-2024)
Xem `ket_qua/hoang_anh_1_20-12/`: `BAO_CAO.md`, bảng B15 đã điền (`.docx`), PDF có khung ghi chú, `thong_tin_cong_trinh.md`. Bản 20-12 có lối thoát FD1 từ buồng thang CT1 ra ngoài qua 3 bậc tam cấp (trục (A–B)/1); nhãn lối thoát Lầu 1 vẫn lệch (1,9 và 0,9 m). Lỗi nổi bật: cửa D3 khu WC không chống cháy mở ra hành lang. Chưa so sánh chi tiết với bản 02-12.
