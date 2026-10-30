# Thẻ bản vẽ mẫu (hồ sơ đã được thẩm duyệt)

Nguồn: `data/ban_ve_mau/<id>/the.md` (đọc nhanh), `the.json` (đủ trường), `data/ban_ve_mau/muc_luc.json` (danh sách mẫu: công năng, phần, văn bản trích). Sinh bằng `scripts/the_ban_ve.py`, không sửa tay.

## Khi nào dùng
- Cần xem hồ sơ thật cùng loại công trình đã ghi chú, chọn giải pháp, trích điều khoản ra sao (vd. karaoke: thang không dùng thoát nạn, màn ngăn khói E45, tường REI150 cao tới mái khi cách < 6 m).
- Viết hướng dẫn / sơ bộ thiết kế: lấy câu ghi chú mẫu làm khung, thay số liệu công trình đang xét.

## Kho ghi chú gộp (ưu tiên tra ở đây)
`data/ban_ve_mau/kho_ghi_chu.md` / `.json` (sinh bằng `python -I -X utf8 scripts/kho_ghi_chu.py` sau mỗi lần thêm thẻ): mọi ghi chú của các mẫu, đã gộp trùng, đã bỏ ghi chú chỉ dựa văn bản hết hiệu lực (`da_bo`), trang thẩm định lần 1 bị lần 2 thay thì bỏ.
- Phân loại hai chiều: chủ đề `## … [thoat_nan] (m07)` (thoát nạn, ngăn cháy, khoảng cách…) x hạng mục công trình `### cong_trinh_chinh | tong_the | nha_o_nhan_vien | phong_bom_be_nuoc | phong_truc | mai_che_nha_xe`.
- Mỗi dòng: `(loai, n mẫu)`; `lap_luan` = điều kiện => kết luận + căn cứ (học tư duy ở đây), `tinh_toan`, `yeu_cau`. `n mẫu` lớn = cách làm phổ biến đã được chấp thuận.
- `⚠` = có viện dẫn văn bản cũ hoặc chưa rõ hiệu lực: chỉ lấy ý, viện dẫn văn bản hiện hành.
- Tra: Grep `\[thoat_nan\]` hoặc từ khóa trên `kho_ghi_chu.md`, đọc vài chục dòng quanh đó.

## Cách tra thẻ từng bộ (không đọc cả file)
1. `muc_luc.json`: chọn mẫu cùng công năng (cột `cong_nang`), gần chiều cao PCCC.
2. Grep tiêu đề theo agent trong `the.md`: mỗi trang có nhãn `[m07-thoat-nan]`, `[m11-bao-chay]`…; vd. Grep `\[m07` trên `data/ban_ve_mau/*/the.md` với `-A 15`.
3. Grep từ khóa (`thang`, `REI150`, `bãi đỗ`, `màn ngăn khói`) trên `the.md`.
4. Agent có Bash: `python -I -X utf8 scripts/the_ban_ve.py tra --agent m07 --tu-khoa "thang|cửa" --cong-nang karaoke`.
5. Cần hình học (trục, cột, tỷ lệ mm/pt, phòng + diện tích): đọc trang tương ứng trong `the.json` (khóa `hinh_hoc`, `phong`).

## Luật dùng
- Thẻ là THAM KHẢO cách làm, KHÔNG phải căn cứ pháp lý. Kết luận vẫn trích điều khoản từ quy chuẩn hiện hành; ghi "tham khảo hồ sơ mẫu <id> tr<n>" nếu dùng ý từ thẻ.
- Số liệu trong thẻ là của công trình mẫu: không chép sang công trình khác; chỉ lấy cách lập luận.
- Văn bản cũ trong thẻ (vd. TCVN 2622:1995, QCVN 06:2022 trước sửa đổi) phải kiểm hiệu lực trước khi viện dẫn (`knowledge/nghi-dinh-tham-dinh-dieu-chinh.md`, QCVN 10:2025).
- Trích tự động: ghi chú có thể dính chữ hai khối liền nhau; điều khoản lấy theo câu gần nhất. Nghi ngờ thì mở PDF gốc (người dùng giữ) hoặc ghi CẦN XÁC NHẬN.
- Thẻ đã ẩn tên khách, địa chỉ, người ký (`[TÊN]`); không tìm cách khôi phục.
