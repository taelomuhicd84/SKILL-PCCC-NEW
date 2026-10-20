# Tri thức agent tự học
Runner ghi vào đây: mỗi văn bản đã học là một file `<id>.md` (đầu file có nguồn, hiệu lực, trạng thái duyệt), `_chi_muc.json` (file nào đã đọc), `_da_duyet.md` (gộp ghi chú đã duyệt; mọi agent thẩm định đọc file này).
Các ghi chú `<id>.md` (tóm tắt văn bản pháp luật/tiêu chuẩn, không chứa bí mật) được commit để lưu tiến độ học (người dùng yêu cầu 2026-10-20). Không commit `_da_duyet.md` (sinh ra từ ghi chú đã duyệt) và `_chi_muc.json` (đường dẫn máy cục bộ). Nếu học từ hồ sơ riêng của khách hàng thì xoá ghi chú đó khỏi git trước khi đẩy.
Duyệt hoặc bỏ ghi chú ở tab "Tự học" của web. Ghi chú chưa duyệt không được dùng làm căn cứ kết luận.
