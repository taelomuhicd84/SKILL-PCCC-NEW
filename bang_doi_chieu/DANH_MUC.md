# Danh mục bảng đối chiếu thẩm định PCCC (Đồng Nai)
Nguồn: `D:\$.4. QC - TCVN\Bảng đối chiếu PCCC Đồng Nai -Nam gửi\`. Đây là **mẫu chính thức** của quy trình thẩm định: giữ nguyên khung và thứ tự dòng, chỉ thêm cột "Tra ở", "Nội dung thiết kế", "Kết luận và lý do", "Khung".
Dữ liệu web nằm ở `data/bang/*.json`, `data/mau/*.docx`, sinh bằng `data-build/build_data.py`. Công cụ đọc: `scripts/bang_doi_chieu_tool.py`.

Hai nhóm bảng, tách riêng:
- **A1–A26: theo công năng.** Mục 1 xác định chiều cao PCCC, số tầng, nhóm nhà; các mục sau xét từng hệ thống theo công năng (báo cháy, chữa cháy, đèn sự cố, bình chữa cháy, dụng cụ phá dỡ, điện PCCC, biển quảng cáo…). Không chia theo chiều cao.
- **B1–B14: theo hệ thống.** Mỗi hệ thống một bảng, chọn theo cờ trong thông tin công trình.

## Bảng công năng
| Công năng | Bảng |
|---|---|
| Hạ tầng kỹ thuật | A1 |
| Chung cư, nhà tập thể | A2 |
| Nhà hỗn hợp | A3 |
| Văn phòng | A4 |
| Khách sạn | A5 |
| Trường mầm non | A6 |
| Trường tiểu học, THCS, THPT | A7 |
| Bệnh viện | A8 |
| Chợ, trung tâm thương mại | A9 |
| Công trình thể thao | A10 |
| Rạp chiếu phim | A11 |
| Karaoke, vũ trường (F2.1) | A12 |
| Gara | A13 |
| Nhà sản xuất | A14 |
| Nhà kho | A15 |
| Cửa hàng xăng dầu | A16 |
| Trạm chiết khí đốt hóa lỏng | A17 |
| Kho xăng dầu | A18 |
| Kho chứa LPG | A19 |
| Kho LNG | A20 |
| Nhà sản xuất, kho chứa vật liệu nổ công nghiệp | A21 |
| Trạm biến áp | A22 |
| Hầm đường bộ | A23 |
| Phương tiện tàu biển | A24 |
| Phương tiện thủy nội địa chở hàng nguy hiểm cháy nổ | A25 |
| Phương tiện thủy nội địa chở khách | A26 |

## Bảng hệ thống
| Hệ thống | Bảng | Dùng khi |
|---|---|---|
| Báo cháy loại thường | B1 | có báo cháy, hoặc chưa rõ |
| Báo cháy loại địa chỉ | B2 | có báo cháy địa chỉ |
| Trạm bơm cấp nước chữa cháy | B3 | có bơm, bể |
| Cấp nước chữa cháy ngoài nhà | B4 | có trụ nước, đường ống ngoài nhà |
| Họng nước chữa cháy trong nhà | B5 | có họng nước, hoặc chưa rõ |
| Chữa cháy tự động bằng nước, bọt (sprinkler) | B6 | có sprinkler, hoặc chưa rõ |
| Chữa cháy bằng bọt cố định | B7 | có |
| Chữa cháy bằng khí hóa lỏng | B8 | có |
| Chữa cháy bằng khí nén | B9 | có |
| Chữa cháy tự động bằng khí CO2 | B10 | có |
| Chữa cháy bằng sol-khí | B11 | có |
| Phương tiện chữa cháy ban đầu: bình, dụng cụ phá dỡ, mặt nạ | B12 | mọi công trình |
| Chiếu sáng sự cố, chỉ dẫn thoát nạn, loa | B13 | mọi công trình |
| Điện phục vụ PCCC | B14 | mọi công trình |

## Đã bỏ so với bản thẩm duyệt cũ
Bảng cũ gộp công năng và hệ thống, đánh số B1–B50. Bản mới tách A/B nên đã bỏ: bảng theo chiều cao (chung cư, hỗn hợp, văn phòng, khách sạn), quy hoạch, chấp thuận địa điểm, điện gió, điện mặt trời, đường ống khí, cửa hàng khí, và các bảng hệ thống chống tụ khói (B34), cấp khí đốt trung tâm (B47), chống sét (B49), thang máy chữa cháy (B50). Các hạng mục m08, m09, m16 không còn bảng riêng, nên phần kiến trúc (bậc chịu lửa, thoát nạn, ngăn cháy…) không nằm trong bảng mới.
