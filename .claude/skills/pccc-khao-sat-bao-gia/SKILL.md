---
name: pccc-khao-sat-bao-gia
description: Thẩm định PCCC – Báo cáo khảo sát và báo giá PCCC. Mục 8 (không phải thẩm định): từ bản vẽ hoặc thông tin bằng chữ lấy hạng mục, công năng, diện tích, số tầng, chiều cao PCCC, khối tích (không có thì diện tích x chiều cao); công trình có thuộc diện thẩm định không; số lối thoát nạn trên bản vẽ và đã đảm bảo yêu cầu QCVN 06 chưa; thuộc diện lắp đặt hệ thống PCCC nào; có chữa cháy nước thì cần tính bể nước PCCC (skill tính bể làm sau).
---
<!-- Sinh tự động từ shared/src/agents.ts bằng `npm run gen:claude`. Không sửa tay. -->
# Báo cáo khảo sát và báo giá PCCC
**Việc:** Mục 8 (không phải thẩm định): từ bản vẽ hoặc thông tin bằng chữ lấy hạng mục, công năng, diện tích, số tầng, chiều cao PCCC, khối tích (không có thì diện tích x chiều cao); công trình có thuộc diện thẩm định không; số lối thoát nạn trên bản vẽ và đã đảm bảo yêu cầu QCVN 06 chưa; thuộc diện lắp đặt hệ thống PCCC nào; có chữa cháy nước thì cần tính bể nước PCCC (skill tính bể làm sau).
**Lưu ý:** Số lối thoát nạn: cắt phóng to từng thang (scripts/cat_thang.py), xem chiếu nghỉ theo knowledge/nhan-dien-thang-thoat-nan.md (bậc chéo, rẽ quạt, cong, xoắn thường không thoát nạn), rồi xét từng buồng thang theo MOD_cau_thang_buong_thang (thang rẽ quạt thêm 3.4.4) rồi mới đếm. Đếm theo tầng: tầng trên = số buồng thang đạt, tầng trệt = số lối ra ngoài nhà, tầng hầm = số thang lên tầng 1 hoặc lên sân (Bài học 26). Đây là số liệu sơ bộ để khảo sát và báo giá, không phải kết luận thẩm định. Trả lời tiếng Việt, ngắn, theo đúng 8 mục trong knowledge/khao-sat-bao-gia.md và kết thúc bằng MỘT khối json khao_sat. Khối tích không có trên bản vẽ thì tự tính diện tích x chiều cao và ghi rõ. Bản vẽ không có bề rộng thoát nạn thì chỉ ghi yêu cầu theo QCVN 06, không kết luận bề rộng. Bể nước PCCC: chưa tự tính, ghi CẦN TÍNH BỂ NƯỚC PCCC khi có chữa cháy nước. Số liệu thiếu thì ước lượng có nhãn hoặc CẦN XÁC NHẬN; không bịa ngưỡng quy chuẩn.

## Tri thức (nguyên văn điều khoản – chỉ mở file cần cho dòng đang xét)
- `knowledge/khao-sat-bao-gia.md`
- `knowledge/bai-hoc.md`
- `skills/MOD_cau_thang_buong_thang.md`
- `knowledge/nhan-dien-thang-thoat-nan.md`
- `knowledge/dinh-nghia/dinh-nghia.md`
- `knowledge/qcvn06-phu-luc-h.md`
- `knowledge/qcvn10-2025-chung.md`
- `knowledge/qcvn10-2025-bao-chay-chua-chay-tu-dong.md`
- `knowledge/qcvn10-2025-nuoc-chua-chay.md`
- `knowledge/nghi-dinh-tham-dinh-dieu-chinh.md`
- `knowledge/cv-2360-cahn-1183-c07-dien-tham-dinh.md`
- `skills/MOD_so_luong_loi_ra.md`
- `skills/PHU_LUC_G_QCVN06.md`
- `knowledge/so-bo-thiet-ke-pccc.md`
- `knowledge/ban-ve-mau.md`
- `knowledge/hoc/_da_duyet.md`
- `knowledge/hoc/khai-niem/_theo_agent/khao-sat-bao-gia.md`
- `knowledge/hoc/du-an/khao-sat-bao-gia.md`
- Điều khoản chưa nạp (vd. nghị định về diện thẩm duyệt, TCVN 7336, TCVN 13456): dùng cột "Quy định" của dòng bảng; không có thì CAN_XAC_NHAN.

## Nguyên tắc (bắt buộc)
1. Kết luận mỗi dòng chỉ nhận: DAT · CHUA_DAT · CAN_XAC_NHAN · KHONG_AP_DUNG, kèm lý do có số liệu ngay tại dòng và trích khoản, điều.
2. Thiếu dữ liệu trên bản vẽ, bản vẽ mâu thuẫn, hoặc quy chuẩn chưa có trong tri thức được cung cấp → CAN_XAC_NHAN, nói rõ thiếu gì. Không đoán thành DAT hay CHUA_DAT.
3. Không bịa trị số quy chuẩn: chỉ dùng tri thức được cung cấp và cột "Quy định" của bảng đối chiếu chính thức; không có thì ghi "cần tra".
4. Sai sót cụ thể trên bản vẽ đã rõ cách sửa (ghi nhầm ký hiệu như D1 thay FD1, số liệu lệch nhau, phép tính sai, thiếu ghi chú bắt buộc như chiều cao PCCC) → ghi vào "chinh_ban_ve" một câu: sai gì, sửa thành gì. KHÔNG đổi kết luận của thiết kế. Không dùng "chinh_ban_ve" cho gợi ý chung ("nên ghi rõ", "nên bổ sung thuyết minh") – thiếu dữ liệu để kết luận thì là CAN_XAC_NHAN.
5. Dòng CHUA_DAT, CAN_XAC_NHAN hoặc có chinh_ban_ve: ghi "vi_tri" (trang và chữ bám "anchor" có thật trên trang, hoặc bbox 0–1000) để khoanh khung trên bản vẽ.
6. Dòng tiêu đề mục (không có nội dung cần xét) vẫn trả về với ket_luan KHONG_AP_DUNG và ly_do "dòng tiêu đề".
7. Số đo trên bản vẽ là ước lượng ±1–2 m nếu không có kích thước ghi: ghi chữ "ước lượng".
8. Bản vẽ đã thể hiện đủ (ký hiệu cửa, GHCL, chiều mở, kích thước) thì phải kết luận DAT hoặc CHUA_DAT; không né sang CAN_XAC_NHAN. Đọc knowledge/bai-hoc.md trước khi kết luận.

## Quy trình chung
Xem `skills/SKILL_quy_trinh_tham_dinh.md` (8 giai đoạn) và `knowledge/truong-thong-tin.md` (trường A/B/C, quy tắc suy ra Y01–Y24).
