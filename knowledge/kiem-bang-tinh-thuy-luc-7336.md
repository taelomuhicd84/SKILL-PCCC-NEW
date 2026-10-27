# Kiểm bảng tính thủy lực sprinkler theo TCVN 7336:2021 (rút từ 3 bảng Excel người dùng đưa, 2026-10-27)
Dùng khi người dùng đưa bảng Excel/PDF tính thủy lực và hỏi "đúng chưa". Toàn văn: `runner/cache/van_ban/TCVN 7336_2021.pdf.txt` (Phụ lục B, Bảng 1–3, B.2). Kho giá kệ cao > 5,5 m: TCVN 14496:2025 (`knowledge/hoc/_da_duyet.md`, mục 5).

## Công thức chuẩn (đúng thì ghi ĐÚNG, không nghi ngờ thừa)
- q = 10·K·√P (K theo l/(s·MPa^0,5) của tài liệu hãng; dạng K' = K gpm/psi^0,5 × 0,7598 rồi q = K'·√P), ΔP = Q²·L/(100·KT) với KT Bảng B.2, Bp = Q²/Pa, mạng cụt không đối xứng Q' = Q·√(Pa/P'a) (B.2.11.3), mạng vòng chia 50% lưu lượng mỗi nửa (B.2.12), PB = ΣΔP + ΣPCB + PĐP + Z − PH (B.3.9), cục bộ gần đúng 20% ΣΔP (B.3.13), vận tốc ≤ 10 m/s (B.1.9), áp tại bộ điều khiển ≤ 1 MPa (B.3.14), điều kiện QH ≤ QC (B.3.1), họng trong nhà dùng chung bơm: Q = QCCTĐ + QTN, thời gian họng = thời gian sprinkler (B.3.8, B.3.16).
- Bảng 1: cao phòng < 10 m; từ 10 đến 20 m dùng Bảng 3 (nhóm 1–4), nhóm 5–7 dùng Bảng 2 (hàng ≤ 5,5 m) hoặc TCVN 14496. qcđ (14496, h 5,5–12,5 m, H 6,4–14 m) = [5,3 + 0,19(h − 5,5)]·[1 + 0,06(H − 10)] (nhóm 5).
- KT lấy đúng loại ống (thép hàn điện hay thép dẫn khí và nước) và đúng DN; dòng có dấu * là mạng ngoài nhà.

## Lỗi hay gặp (đã gặp thật)
1. Nhánh không đối xứng: cộng nhầm lưu lượng nhánh bên kia vào đoạn của nhánh này (copy công thức) hoặc Bp tính bằng áp của nhánh khác nên không điều chỉnh gì; kết quả lưu lượng hàng sai vài %, có thể làm tổng tụt dưới mức tối thiểu Bảng 1.
2. Chuỗi áp suất cột "áp đầu" bị đứt (áp đoạn sau không lấy áp cuối đoạn trước): ΔP tổng vẫn đúng nhưng bảng trình bày sai.
3. Số trừ hay cộng gõ cứng trong công thức (−0,02, −0,011, +3 l/s) không có trong tiêu chuẩn: hỏi nguồn, không chấp nhận.
4. Tổng lưu lượng tính ra nhỏ hơn yêu cầu Bảng 1 mà vẫn "chọn" số yêu cầu để chọn bơm (vi phạm B.3.1). Tăng ống KHÔNG làm tăng lưu lượng (ít tổn thất → áp các đầu sau thấp đi); phải tăng áp/lưu lượng đầu chủ đạo hoặc số đầu.
5. KT sai DN (DN125 dùng 5872 của DN100); tra Bảng 1 khi cao phòng đúng 10 m (phải Bảng 3).
6. Cộng áp họng vách tường vào áp sprinkler. Đúng: tại nút họng rẽ ra, áp cần PVT = áp lăng + tổn thất cuộn vòi + tổn thất ống nhánh + Z; áp cột bơm theo max(đường sprinkler, đường họng); lưu lượng họng cộng vào đoạn ống từ nút rẽ về bơm. Không so họng với áp đầu phun chủ đạo (chỉ đúng khi họng đặt ngay đó).
7. Lưu lượng họng: số tia × lưu lượng mỗi tia lấy theo QCVN 10:2025 Bảng H.5/H.6 (tối thiểu 2,5 l/s) và lăng phun chọn ở H.7 (vd 2,6 l/s ở tia 12 m, lăng 13 mm); tia ≥ chiều cao từ sàn đến xà (H.2.7); ghi lưu lượng thực của lăng đã chọn vào bơm và bể; S2/S3 bậc III, IV tăng thêm 5 l/s (H.2.3). Không dùng QCVN 06 Điều 5 (đã chuyển sang QCVN 10:2025).
8. Bơm: Q150% cho điểm 65% cột áp; hệ số 1,4 sai nếu nhãn ghi 150%. Đổi MPa ra mét cột nước dùng 101,97. Bể = Q × 60 phút (+ họng cùng thời gian).
9. Tham chiếu cũ: QCVN 06:2022 Bảng 9, 12, 13, QCVN 06:2021 → thay bằng QCVN 10:2025 Phụ lục H.
10. Công thức bảng chỉ đúng với số đầu cố định (dùng cờ Q60 = 2, 3…): đổi số đầu thì hỏng. Ô trống cho ra #N/A là CHỦ Ý để người dùng điền thêm hàng; không xóa. Tổng hợp dùng AGGREGATE/MAX bỏ qua lỗi, nối qua ô "Tổng lưu lượng" lấy giá trị hợp lệ cuối.

## Việc chưa làm
Skill/script tự kiểm bảng tính thủy lực (đọc Excel, tính lại, báo lệch); skill tính bể nước PCCC. Xem `ROADMAP.md`.
