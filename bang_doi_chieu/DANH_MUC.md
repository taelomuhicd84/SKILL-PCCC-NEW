# Danh mục bảng đối chiếu chính thức (Sửa đổi 1)
Nguồn: `D:\$.4. QC - TCVN\Bảng đối chiếu sửa đổi 1\` (bảng "đối chiếu / thẩm duyệt thiết kế về phòng cháy và chữa cháy"). Đây là **mẫu bảng chính thức** của quy trình: giữ nguyên khung và thứ tự dòng, chỉ thêm cột "Tra ở", "Nội dung thiết kế", "Kết luận và lý do", "Khung".
Công cụ đọc: `scripts/bang_doi_chieu_tool.py` (lệnh `danhmuc`, `khung`, `dong`, `tim`, `xuat`, `lamviec`). Mã bảng là đầu tên file (B15, B35…).

## Cấu trúc chung của bảng công năng (ví dụ B15 karaoke, vũ trường: khoảng 205 dòng)
Phần đầu: tên công trình, địa điểm, chủ đầu tư, cơ quan thiết kế, cán bộ thẩm duyệt; mục 6 danh mục quy chuẩn, tiêu chuẩn áp dụng; mục 7 quy mô, sự phù hợp của tiêu chuẩn, danh mục bản vẽ; mục 8 nội dung kiểm tra, với các cột **TT | Nội dung đối chiếu | Nội dung thiết kế | Nội dung quy định của quy chuẩn, tiêu chuẩn | Khoản, Điều | Kết luận**.
Các mục lớn của mục 8 (B15):
1 xác định chiều cao PCCC, số tầng, nhóm nhà, cấp nguy hiểm cháy · 2 bậc chịu lửa · 3 khoảng cách an toàn PCCC · 4 đường giao thông, bãi đỗ xe chữa cháy, lối vào từ trên cao · 5 bố trí công năng · 6 ngăn cháy, chống cháy lan (ngang, đứng, công năng, hành lang, vật liệu, cửa, tường) · **7 lối, đường thoát nạn (lối ra, số lối, phân tán, cửa, chiều rộng, khoảng cách, đường thoát nạn, cầu thang, buồng thang, lối lên mái)** · 8 thang máy chữa cháy · 9 chống tụ khói (tăng áp, hút khói) · 10 bình chữa cháy · 11 báo cháy · 12 chữa cháy (sprinkler, họng nước, cấp nước ngoài nhà, trạm bơm, khí, bọt) · 13 cấp điện · 14 đèn chiếu sáng sự cố, chỉ dẫn, loa thông báo · 15 dụng cụ phá dỡ, bảo hộ chống khói · 16 chống sét · 17 liên lạc · 18 biển quảng cáo.
Mục 7 (thoát nạn) và 14 là phần các module điều khoản hiện có đã nạp nguyên văn. Các mục 1–6, 8–13, 15–18 cần đọc cột "Nội dung quy định" của chính bảng (đã trích sẵn điều khoản và bảng) bằng lệnh `dong`.

## Chọn bảng chính theo công năng và chiều cao
| Công năng | Bảng |
|---|---|
| Karaoke, vũ trường (F2.1) | **B15** |
| Chung cư (F1.3) đến 28 m; trên 28 đến 75 m; trên 75 đến 150 m | B4.1; B4.2; B4.3 |
| Nhà hỗn hợp đến 28 m; trên 28 đến 50 m; trên 50 đến 150 m | B5.1; B5.2; B5.3 |
| Văn phòng đến 28 m; trên 28 đến 50 m; trên 50 đến 150 m | B6.1; B6.2; B6.3 |
| Khách sạn đến 28 m; trên 28 đến 50 m; trên 50 đến 150 m | B7.1; B7.2; B7.3 |
| Nhà trẻ, mẫu giáo, mầm non | B8 |
| Trường tiểu học, THCS, THPT, phổ thông | B9 |
| Bệnh viện | B10 |
| Chợ | B11 |
| Trung tâm thương mại | B12 |
| Công trình thể thao (sân vận động, nhà thi đấu…) | B13 |
| Rạp chiếu phim | B14 |
| Gara | B16 |
| Nhà sản xuất | B17 |
| Nhà kho | B18 |
| Quy hoạch; chấp thuận địa điểm; hạ tầng kỹ thuật | B1; B2; B3 |
| Cửa hàng xăng dầu, kho xăng dầu, khí đốt, LPG, LNG, vật liệu nổ, điện gió, điện mặt trời, trạm biến áp, hầm đường bộ, phương tiện tàu thủy | B19–B33 (một số là file .doc, cần lưu lại thành .docx mới đọc được) |

## Bảng theo hệ thống (đặt song song với bảng công năng, dùng cho giai đoạn 3)
Chọn theo cờ có/không trong bảng thông tin công trình và theo "đối tượng trang bị" của bảng công năng. File làm việc đã tạo sẵn trong `bang_doi_chieu/he_thong/`.
| Hệ thống | Bảng | Dùng khi |
|---|---|---|
| Chống tụ khói (tăng áp, hút khói) | B34 | công trình có hút xả khói, tăng áp (mục 9 của bảng công năng) |
| Báo cháy | B35 | công trình có hoặc phải có báo cháy tự động |
| Trạm bơm, bể nước chữa cháy | B36 | có bơm, bể |
| Cấp nước chữa cháy ngoài nhà | B37 | có trụ nước, đường ống ngoài nhà |
| Họng nước chữa cháy trong nhà | B38 | có họng nước vách tường |
| Chữa cháy tự động bằng nước, bọt (sprinkler) | B39 | có sprinkler |
| Phương tiện chữa cháy ban đầu (bình, xe đẩy) | B45 | mọi công trình |
| Chiếu sáng sự cố, chỉ dẫn thoát nạn, loa thông báo | B46 | mọi công trình có đường thoát nạn |
| Nguồn điện cho hệ thống PCCC | B48 | mọi công trình có hệ thống PCCC |
| Chống sét | B49 | có chống sét |
| Thang máy chữa cháy | B50 | có thang máy chữa cháy |
| Bọt cố định, khí hóa lỏng, khí nén, CO2, sol-khí, cấp khí đốt trung tâm | B40–B44, B47 | file .doc, chưa đọc được; lưu thành .docx khi cần |

## Lưu ý đã phát hiện khi đọc mẫu
- Dòng 7.1.9 của B15 ghi "Bảng G2b" nhưng nội dung ghi là "khoảng cách giới hạn cho phép từ cửa ra vào của gian phòng tới lối ra thoát nạn gần nhất đối với nhà công cộng", đúng với tiêu đề **Bảng G.2a**. Coi là lỗi gõ của mẫu, vẫn dùng G.2a; ghi chú vào cột kết luận để người dùng biết.
- Cột "Nội dung thiết kế" của mẫu chứa **gợi ý cần đọc ở bản vẽ** (ví dụ "lưu ý xét số tầng của các nhà theo bảng H.2, H.7"). Dùng làm danh sách việc cho giai đoạn 1.
- Mục 6 của mẫu liệt kê tiêu chuẩn áp dụng cho karaoke: TCVN 3890:2023, TCVN 13456:2022, TCVN 5738:2021, TCVN 7336:2021, QCVN 17:2018/BXD và các tiêu chuẩn khác "nếu có". Toàn văn các tiêu chuẩn này chưa nạp riêng, nhưng cột "Nội dung quy định" của bảng B35, B38, B39, B45, B46, B48 đã trích sẵn điều khoản và là nguồn dùng cho giai đoạn 3.

- Cột quy định của dòng 'Đối tượng trang bị' (báo cháy, chữa cháy, đèn sự cố…) chỉ viết 'theo Phụ lục A TCVN 3890:2023', không liệt kê danh mục. Danh mục nhà phải trang bị hệ thống nằm ở Phụ lục A của TCVN 3890:2023 (chưa nạp). Vì vậy 'công trình này có bắt buộc phải có hệ thống X không' vẫn là CẦN XÁC NHẬN cho đến khi nạp Phụ lục A đó; các dòng yêu cầu kỹ thuật (độ rọi, khoảng cách đầu báo cháy…) thì đã có nguyên văn để so.
