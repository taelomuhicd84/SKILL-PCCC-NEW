# Tiến độ dự án Website thẩm định PCCC
File này cập nhật sau mỗi mốc việc và trước mỗi lần compact/clear. Đọc file này đầu tiên khi tiếp tục.
Kế hoạch gốc: `C:\Users\HP\.claude\plans\t-i-mu-n-l-m-1-ticklish-gosling.md` (web tĩnh GitHub Pages + runner cục bộ Claude Code / Gemini Playwright).

## Trạng thái các bước
| # | Bước | Trạng thái |
|---|---|---|
| 0 | Môi trường: Node 22 portable tại `%LOCALAPPDATA%\Programs\node-v22.23.3-win-x64` (đã thêm PATH user) | xong |
| 1 | Dữ liệu: `data-build/convert_doc.ps1` (.doc→.docx), `data-build/build_data.py` → `data/bang/*.json`, `data/mau/*.docx` (58 bảng) | xong |
| 2 | shared: schema, agents (cấu hình hạng mục), chọn bảng, chia mục, prompt, gộp, trích chữ PDF – 6 test vitest qua | xong |
| 3 | web (Vite+React): 5 bước, viewer, chế độ thủ công – build qua, CHƯA chạy thử trên trình duyệt | xong phần code |
| 4 | runner: server (127.0.0.1:8787), engine claude -p, engine Gemini Playwright (chưa thử đăng nhập), CLI chuan-bi/jobs/ra-soat/gop (chuan-bi đã chạy với HA1 120 trang) | xong phần code |
| 5 | xuất PDF (web/src/xuat_pdf.ts) và docx (web/src/xuat_docx.ts) – chưa kiểm bằng file thật | xong phần code |
| 6 | .claude agents/skills | chưa |
| 7 | deploy + README | chưa |
| 8 | kiểm tra ca Hoàng Anh 1 | chưa |

Nhịp tim: 2026-10-19 (phiên chính đang làm)

## Lịch sử
- 2026-10-19: lập kế hoạch, user duyệt; cài Node portable (winget lỗi 1618); chuyển 10 bảng .doc bằng Word COM; build 58 bảng JSON.
- 2026-10-19: viết shared/ (test qua), web/ (build qua). Tiếp: runner/ (claude -p, Playwright Gemini), rồi gen .claude, deploy, kiểm Hoàng Anh 1.

## Ghi chú kỹ thuật
- Mục lớn (1–18) của bảng công năng KHÔNG cố định chỉ số và số mục khác nhau giữa các bảng (B15 có 18, B4.1 có 17, B17 có 19) → chia mục theo dòng TT là số nguyên tăng dần, gán agent theo từ khóa tiêu đề.
- Bảng hệ thống (B34–B50) chỉ có vài mục (Đối tượng trang bị, Yêu cầu chung…) → mỗi bảng là một job của agent hệ thống tương ứng.
