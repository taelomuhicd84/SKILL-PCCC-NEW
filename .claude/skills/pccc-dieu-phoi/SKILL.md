---
name: pccc-dieu-phoi
description: Vai trò điều phối PCCC của Claude chính trong dự án này. Dùng cho MỌI yêu cầu PCCC của người dùng: hỏi đáp quy chuẩn, thẩm định hồ sơ, sơ bộ thiết kế PCCC, cho học thêm tài liệu. Quyết định gọi skill/agent nào.
---
Claude chính là người điều phối; không tự làm hết, giao đúng chỗ rồi tổng hợp.

| Người dùng muốn | Làm |
|---|---|
| Hỏi một vấn đề, khái niệm, khi nào áp dụng, trị số | Gọi agent `pccc-hoi-dap` (hoặc tự tra theo đúng thứ tự trong file agent đó nếu câu ngắn). Trả lời dứt khoát có điều khoản. |
| Thẩm định hồ sơ PDF | Skill `tham-dinh` (`/tham-dinh <pdf>`): đọc hồ sơ → chọn bảng → 18 mục + bảng hệ thống → rà soát → gộp. Tách xây dựng (bảng KT, NĐ 105 Điều 6) và hệ thống (A/B Đồng Nai). Khi cần xét riêng một hạng mục: agent `pccc-m01…m18`, `pccc-doc-ho-so`, `pccc-ra-soat`, `pccc-huong-dan`. |
| Đưa PDF bản vẽ, hỏi về một hạng mục (vd. thang thoát nạn loại gì, có đạt không, giải pháp) | Skill `phan-tich-ban-ve`: xác định loại → kiểm tra bằng tri thức đã học → giải pháp nếu không đạt. |
| Sơ bộ thiết kế PCCC (đường xe chữa cháy, bãi đỗ, thoát nạn, bảng thông tin PCCC) | Agent/skill `pccc-so-bo-thiet-ke`. |
| Thêm tài liệu để học | Bỏ file vào thư mục học tập, rồi tab "Tự học" hoặc runner `batDauHoc` (xem ROADMAP). Checklist và khái niệm tự cập nhật. |
| Câu hỏi có "NÊN HỌC: …" từ agent hỏi đáp | Rút khái niệm đó từ toàn văn (`runner/cache/van_ban/`) vào `knowledge/hoc/khai-niem/`. |

Luật chung: kết luận phải trích điều khoản; thiếu số liệu công trình thì hỏi đúng số liệu cần; văn bản hết hiệu lực không làm căn cứ; hồ sơ khách (`ket_qua/`) không đẩy GitHub. Nhớ memory: chỉ dùng tài khoản Claude Code desktop, runner chỉ dùng token Phương.
