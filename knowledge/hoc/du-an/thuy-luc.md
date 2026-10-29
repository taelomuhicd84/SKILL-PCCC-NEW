# Bài học từ dự án – Tính toán thủy lực chữa cháy
Chỉ áp dụng bài có "Trạng thái: da_duyet". Ghi bởi agent pccc-hoc-du-an, kiểm bằng `npx tsx runner/src/hoc_du_an.ts kiem`.

### Không có quy định "lưu lượng hàng I ≤ 10 l/s" (2026-10-29, nguồn: kho Liên Minh 54x30)
- Trạng thái: da_duyet
- Căn cứ: đã tra TCVN 7336:2021 Phụ lục B, tập huấn C07, QCVN 10:2025/BCA Phụ lục H: không có điều khoản giới hạn lưu lượng một hàng; người dùng chốt 2026-10-29
- Nội dung: Khi người thiết kế hoặc thẩm định viện "lưu lượng tại hàng I không quá 10 l/s", không coi là yêu cầu bắt buộc; chỉ kiểm vận tốc ≤ 10 m/s (B.1.9, B.2.4) và số đầu theo DN ống (Bảng B.3). Gặp văn bản có điều khoản này thì ghi lại nguồn.

### Mạch họng riêng: kiểm áp tĩnh tại họng thấp nhất (2026-10-29, nguồn: kho Liên Minh 54x30)
- Trạng thái: da_duyet
- Căn cứ: QCVN 10:2025/BCA H.2.6; người dùng chốt 2026-10-29
- Nội dung: Hệ thống họng nước chữa cháy riêng biệt: áp suất thủy tĩnh đo tại họng đặt ở mức thấp nhất không vượt 0,6 MPa; áp giữa van và đầu nối họng > 0,45 MPa thì phải có giải pháp giảm áp lực dư. Khi bơm chung chọn theo sprinkler, tính áp tĩnh tại họng thấp nhất (cột áp bơm lúc Q = 0 trừ chênh cao) và ghi biện pháp giảm áp nếu vượt.

### Đầu chủ đạo: q1 = Ω·i cố định, thiếu Qmin thì tăng số đầu theo C07 (2026-10-29, nguồn: kho Liên Minh 54x30)
- Trạng thái: da_duyet
- Căn cứ: TCVN 7336:2021 Bảng 1, B.2.2; tập huấn sprinkler C07 mục b, e; người dùng chốt 2026-10-29
- Nội dung: q1 = I·Fv với Fv là diện tích bảo vệ một đầu (12 m² nhóm 1–3, 9 m² nhóm 4–7), không tự nâng q1 hay áp đầu chủ đạo. Số đầu vùng tính n ≥ S/Ω; các nhánh xa lấy đầy đủ, hàng cuối chỉ lấy các đầu gần nút ống chính nhất. Σqi < QTT thì tăng n thêm từng đầu tới khi đạt (`chon-dau`). Nâng áp chỉ là phương án, phải ghi rõ P1 cho người thiết kế xác nhận.

### Lưu lượng họng: QBmin theo H.6, bơm và bể theo lăng H.7 (2026-10-29, nguồn: kho Liên Minh 54x30)
- Trạng thái: da_duyet
- Căn cứ: QCVN 10:2025/BCA Bảng H.6, H.7; người dùng chốt 2026-10-29
- Nội dung: QBmin = Qsp + QHR + QNN với QHR = số tia × lưu lượng 1 tia theo Bảng H.6 (thường 2 × 2,5 = 5 l/s; Excel H18 = I160*2.5). Lưu lượng họng cộng vào bơm và bể = số tia × lưu lượng lăng tra H.7 tại chiều cao tia đặc cần (thường 2,6 l/s).

### Excel: hàng cuối thiếu đầu trình bày như khối hàng I, mọi số là công thức (2026-10-29, nguồn: kho Liên Minh 54x30)
- Trạng thái: da_duyet
- Căn cứ: TCVN 7336:2021 B.2.10.9, B.2.11.2, B.2.11.3; người dùng chốt 2026-10-29
- Nội dung: Hàng cuối chỉ lấy một phần đầu có đặc tính Bp riêng, không nhập số tay. Chèn dòng ngay tại nút đó theo kiểu bảng nhánh I: nhánh trái rồi phải liền nhau, đoạn cuối mỗi nhánh có ghi chú đặc tính nhánh ở M/N; tiếp phần cân bằng nút như dòng 93–97 (so áp, Q' = Q·√(PA/P), Q hàng, Bp1 = Q²/PA, PA = max) có đơn vị l/s, Mpa. Dùng `scripts/chen_hang_cuoi.ps1` (tự gọi khi xuất).

### Excel: giữ form mẫu, không thêm ghi chú, tự căn chỉnh và kiểm bằng ảnh (2026-10-29, nguồn: kho Liên Minh 54x30)
- Trạng thái: da_duyet
- Căn cứ: Người dùng chốt 2026-10-29
- Nội dung: Không thêm dòng/ô ghi chú, giải thích, trích điều khoản vào Excel; B7 chỉ ghi công trình, nhóm, hàng xếp; giải thích để trong chat. Ô đúng cột mẫu (J đơn vị, K ký hiệu, L nguồn). Chữ vừa ô, không tràn, không #NAME?; ô gộp kẻ lại viền. Xuất xong phải xuất vùng sửa ra ảnh tự xem và so số với lõi rồi mới giao.

### Excel: hiện dòng có số liệu, ẩn dòng trống hoặc #N/A, kẻ viền dưới (2026-10-29, nguồn: kho Liên Minh 54x30)
- Trạng thái: da_duyet
- Căn cứ: Người dùng chốt 2026-10-29
- Nội dung: Mẫu có sẵn dòng ẩn; sau xuất phải hiện mọi đầu/đoạn có số liệu và ẩn khối không có DN hoặc ra #N/A (bảng nhánh, khối ống chính), đối xứng thì ẩn phần cân bằng bất đối xứng. Dòng hiện cuối mỗi nhánh nhận viền dưới, ô gộp cột A gộp lại tới đó. Dùng `scripts/hoan_thien_excel.ps1` (tự gọi khi xuất).

### Excel: đánh số đầu và nút (2026-10-29, nguồn: kho Liên Minh 54x30)
- Trạng thái: da_duyet
- Căn cứ: Người dùng chốt 2026-10-29
- Nội dung: Cột "Số lượng đầu phun" là số thứ tự đầu trong từng nhánh, mỗi nhánh bắt đầu từ 1 (công thức mẫu Q60/Q61 dựa vào số này). Cột "Nút": nhánh trái 1-2, 2-3 … n-A với 1 là đầu xa nhất; nhánh phải số nối tiếp nhánh trái, đánh từ đầu xa nhất về nút (trái 4 đầu, phải 2: 6-5, 5-A). Cột số đầu ống chính cộng dồn theo hàng. Bản vẽ người dùng tự thiết kế có đánh số đầu/nút thì lấy theo bản vẽ (`"nut"` từng đoạn trong so_lieu), không có mới tự đánh.
