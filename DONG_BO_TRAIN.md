# Đồng bộ train giữa hai máy

Người dùng train ở hai máy. Máy nào làm xong buổi train thì ghi vào đây và đẩy GitHub; máy kia khi được bảo "cập nhật từ github" thì đọc file này và làm các mục chưa tích `[ ]`.

## Claude làm gì khi người dùng bảo "cập nhật từ github"
1. Chạy `bash scripts/cap_nhat_github.sh` (in dòng mới của file này cùng ba file ghi chú).
2. Đọc mục "Việc chờ" dưới đây. Mục nào làm được trên máy này thì làm rồi đổi `[ ]` thành `[x]` kèm ngày giờ và tên máy. Mục cần người dùng thì nhắc ngắn.
3. Máy đang có train chưa đẩy (file trong `knowledge/`, `data/`, `scripts/`, mẫu trong `ket_qua/` người dùng cho phép đẩy) thì liệt kê, hỏi người dùng rồi đẩy bằng `scripts/day_github.sh`.
4. Báo người dùng: đã đồng bộ gì, còn thiếu gì.

## Việc chờ
- [x] (đẩy 31/10, commit 14e888e) **Máy train chiều 30/10 (máy kia):** đẩy mẫu báo cáo tư vấn KS Hoàng Hùng lên GitHub. `LICH_SU.md` có ghi nhưng máy này (F:\1_ToolMMo\2_VibeCode\Webpccc) không có: `ket_qua/hoang_hung_so_bo2/` (`tu_van_thiet_ke_v3.md`, `tu_van_v3_khoanh.pdf`, `ve_v3.py`) và `ket_qua/hoang_hung_final/`. `day_github.sh` không tự thêm `ket_qua/`, nên phải truyền đường dẫn: `bash scripts/day_github.sh "Day mau tu van Hoang Hung" ket_qua/hoang_hung_so_bo2 ket_qua/hoang_hung_final`. Hồ sơ khách: hỏi người dùng trước khi đẩy (ngày 30/10 người dùng đã cho phép đẩy ket_qua Hoàng Hùng).
- [x] **Máy kia (xong 31/10 trên máy C:\Users\HP, form đã khớp lời người dùng):** tìm form "tư vấn thiết kế PCCC" 7 mục người dùng đưa tối 30/10, hoặc bài train khác chưa đẩy: `git status`, `git log origin/main..HEAD`, và memory Claude của máy đó (`~/.claude/projects/<repo>/memory/`). Có gì chưa nằm trong repo thì chép vào `knowledge/` rồi đẩy. Form đã ghi lại ở `knowledge/khao-sat-bao-gia.md` mục "Form tư vấn thiết kế PCCC": đối chiếu, nếu lệch thì sửa theo bản của người dùng.
- [ ] **Máy này, sau khi máy kia đẩy mẫu Hoàng Hùng:** trình bày lại `ket_qua/thanh_trieu/bao_cao_khao_sat.md` theo đúng form 7 mục và văn phong mẫu `tu_van_thiet_ke_v3.md`; đi đủ mục 7 (các mục khác trong bảng đối chiếu).

## Nhật ký train (mới nhất trên cùng)
### 31/10 – máy C:\Users\HP\Downloads\PCCC_he_thong (Claude Sonnet)
- Sửa form 7 mục trong `knowledge/khao-sat-bao-gia.md` theo thứ tự người dùng nói lại (thông tin, thẩm định, bãi đỗ, thoát nạn, ngăn cháy, khoảng cách, hệ thống + mục bổ sung).
- Thêm 3 bài học vào `knowledge/hoc/du-an/so-bo-thiet-ke.md`: công năng đọc từ nhãn phòng; thang rẻ quạt 3.4.4 + Hình A.12; N1/N2/N3, hút khói hành lang, phân tán lối ra. Chi tiết rẻ quạt ở `knowledge/nhan-dien-thang-thoat-nan.md`.
- Roy PPS: người dùng bảo báo cáo khảo sát xlsx sai (huỷ); số tầng, công năng đúng chờ người dùng đưa. Khách sạn Duy Anh đã đối chiếu thang (`ket_qua/khach_san_duy_anh/`, hồ sơ khách, không đẩy).
- Đã đẩy `ket_qua/hoang_hung_so_bo2`, `ket_qua/hoang_hung_final` (commit 14e888e) sau khi người dùng xác nhận.
### 30/10 tối – máy F:\1_ToolMMo\2_VibeCode\Webpccc (Claude Opus)
- Người dùng chốt: diện thẩm định xét theo CÔNG NĂNG THỰC TẾ; giấy phép xây dựng chưa khớp thì chỉ ghi chú chủ đầu tư làm lại để hợp thức hóa (đã ghi vào `knowledge/cv-2360-cahn-1183-c07-dien-tham-dinh.md`, `nghi-dinh-tham-dinh-dieu-chinh.md`).
- Nạp công văn 2360/CAHN-PC07 + 1183/C07-P4 (C07 thống nhất) thành `knowledge/cv-2360-cahn-1183-c07-dien-tham-dinh.md` (không lưu PDF). Máy kia nếu có ghi chú nào còn coi 2360 là "chưa chính thức" thì sửa theo file này.
- Người dùng chốt **form tư vấn thiết kế PCCC 7 mục**, đã ghi vào `knowledge/khao-sat-bao-gia.md` và `knowledge/so-bo-thiet-ke-pccc.md`.
- Bắt buộc trước khi tư vấn: chạy `scripts/mau_giai_phap.py loc`, tra thẻ bản vẽ mẫu cùng công năng (`data/ban_ve_mau`), đọc bài học `knowledge/hoc/du-an/so-bo-thiet-ke.md`. Lần đầu làm Thanh Triều Claude bỏ bước này nên sót phân tán lối ra (3.2.8).
- Đã làm thử: Phòng khám/Nha khoa Thanh Triều 7 tầng → `ket_qua/thanh_trieu/bao_cao_khao_sat.md` (hồ sơ khách, không đẩy).
