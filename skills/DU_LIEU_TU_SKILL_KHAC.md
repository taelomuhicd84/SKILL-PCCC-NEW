> Đã thay thế bởi `knowledge/truong-thong-tin.md` (danh mục trường thông tin, quy tắc suy ra yêu cầu, bảng ai tạo ai dùng). File này giữ lại để tra các giá trị tạm cũ; không thêm nội dung mới ở đây.

# Dữ liệu skill Thoát nạn cần lấy từ skill khác

Mục đích: danh sách đầu vào mà [SKILL_thoat_nan.md](SKILL_thoat_nan.md) KHÔNG tự xác định, phải nhận từ skill khác. Khi link dữ liệu, điền cột "Nguồn".
Khi chưa có dữ liệu: dùng giá trị tạm ở cột 4 và ghi rõ "tạm tính" trong kết luận.

| # | Dữ liệu cần | Skill thoát nạn dùng để | Giá trị tạm khi chưa có | Nguồn (skill khác – link sau) |
|---|---|---|---|---|
| 1 | Nhà có hệ thống Sprinkler toàn nhà không (có/không) | Chọn yêu cầu khoảng phân tán 2 lối ra: ½D (không) hay ⅓D (có) – điều 3.2.8 | Coi như KHÔNG có → dùng ½D | Skill Chữa cháy tự động |
| 2 | Nhóm nguy hiểm cháy theo công năng (vd. F1.2 khách sạn) | Tra giới hạn chiều dài đường thoát nạn (giữa 2 lối / đường cụt) theo QCVN 06 | Lấy theo bảng tính trên bản vẽ | Skill Phân loại công trình |
| 3 | Bậc chịu lửa (I–V) | Như mục 2 | Lấy theo bảng tính trên bản vẽ | Skill Bậc chịu lửa / Kết cấu |
| 4 | Cấp nguy hiểm cháy kết cấu (S0–S3) | Như mục 2 | Lấy theo bảng tính trên bản vẽ | Skill Bậc chịu lửa / Kết cấu |
| 5 | Giới hạn chiều dài đường thoát nạn cho phép (m): giữa 2 lối và đường cụt | So sánh với chiều dài đo được → Đạt / Chưa đạt | Lấy cột "Theo quy định" trên bảng tính bản vẽ | Skill Tra bảng QCVN 06 (từ mục 2–4) |
| 6 | Loại cầu thang bộ (1/2/3, xem MOD_cau_thang_buong_thang.md) và loại buồng thang bộ thoát nạn (L1/L2, N1/N2/N3) | Xác nhận thang đó là lối ra thoát nạn hợp lệ | Theo ghi chú trên bản vẽ ("buồng thang chống cháy", "thang thoát hiểm") | Skill Buồng thang / Chống khói |
| 7 | Hành lang nối 2 buồng thang có được bảo vệ theo 3.3.5 không | Được đo khoảng phân tán dọc hành lang (Hình I.5) hay phải đo đường thẳng | Coi như KHÔNG → đo đường thẳng | Skill Ngăn cháy / Hành lang |
| 8 | Số người trên tầng / trong phòng, mật độ dòng người | Kiểm tra số lối ra yêu cầu và chiều rộng lối ra | Lấy theo bảng tính trên bản vẽ | Skill Tính số người / Chiều rộng lối ra |
| 9 | Chiều cao PCCC, số tầng | Yêu cầu số lối ra, loại buồng thang, thang máy chữa cháy | Đọc từ mặt cắt nếu có | Skill Phân loại công trình |
| 10 | Đường chéo lớn nhất D của tầng/phần nhà (nếu skill hình học đã đo) | Tính ½D, ⅓D | Đọc số ghi trên bản vẽ (vd. "ĐƯỜNG CHÉO CÔNG TRÌNH D=38.2M") | Skill Đo đạc bản vẽ / CAD |
| 11 | Chiều dài đo chính xác trên CAD (điểm xa nhất → lối ra, cạnh xa nhất 2 lối) | Thay số ước lượng theo tỉ lệ ảnh | Ước lượng theo kích thước trục, sai số ±1–2 m | Skill Đo đạc bản vẽ / CAD |
| 12 | Vật liệu hoàn thiện tường/trần/sàn trên đường thoát nạn (Bảng B.8) | Kiểm tra 3.3.4 | Không kiểm, ghi "cần kiểm tra" | Skill Vật liệu hoàn thiện |
| 13 | Bề rộng thoát nạn tối thiểu của hành lang/lối ra | So với bề rộng hiệu dụng (thông thủy − phần cửa nhô) | Không kết luận, ghi "cần tra" | Skill Tính số người / Chiều rộng lối ra |
| 14 | Giải pháp ngăn cháy công năng (4.5) | Chỉ để tham khảo; KHÔNG dùng để miễn cửa chống cháy hành lang của karaoke/vũ trường | Bỏ qua | [SKILL_ngan_chay_cong_nang.md](SKILL_ngan_chay_cong_nang.md) |
| 15 | Hạng nguy hiểm cháy nổ D/E, nhóm F5 A/B/C/bếp | Ngoại lệ bao che hành lang bằng kính/không cháy (không áp dụng cho karaoke) | Coi như không thuộc ngoại lệ | Skill Phân loại công trình |

## Ghi chú mục 14 – điều 4.5 (nhóm F1.3, chỉ để tham khảo, không áp dụng cho karaoke F2.1)
- a) Tường/vách giữa các đơn nguyên; giữa hành lang chung (ngoài căn hộ) với phòng khác: ≥ EI30.
- b) Tường/vách không chịu lực giữa các căn hộ: ≥ EI30 và K0.
- c) Phòng công năng công cộng ngăn với phòng ở bằng vách ngăn cháy loại 1 + sàn ngăn cháy loại 3 (nhà bậc I: sàn loại 2).

## Ghi chú cho dự án test (Khách sạn Hoàng Hùng)
- Mục 1 chưa có → tạm dùng ½D = 19,1 m (D = 38,2 m). Tầng 2, 3, 4-6, 7 được ghi CHƯA ĐẠT theo giá trị tạm này.
- Mục 2–5: tạm lấy từ bảng tính trên bản vẽ: nhóm F1.2 (khách sạn), bậc II, S0; giới hạn 60 m / 30 m (nghi bị đảo tiêu đề cột).
