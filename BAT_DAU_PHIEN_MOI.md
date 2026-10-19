# Bàn giao sang phiên mới (cập nhật 2026-10-19)

Mở phiên mới thì đọc file này trước, rồi đọc `TIEN_DO.md` (lịch sử chi tiết). Người dùng nói tiếng Việt, muốn trả lời ngắn, tiết kiệm token, đã cấp toàn quyền (không hỏi giữa chừng, trừ việc ra bên ngoài như push, deploy, tạo tài khoản).

## Dự án là gì
Website thẩm định thiết kế PCCC: up PDF bản vẽ → AI đọc thông tin công trình → chọn bảng đối chiếu theo nhóm nhà → agent xét từng hạng mục (18 mục bảng công năng + bảng hệ thống B34–B50) → ghi chú khung đánh số lên PDF + bảng Word theo mẫu chính thức (ĐẠT / CHƯA ĐẠT / CẦN XÁC NHẬN / KHÔNG ÁP DỤNG). Có công tắc "Hướng dẫn thiết kế".
Repo: https://github.com/taelomuhicd84/SKILL-PCCC-NEW (nhánh `main`, riêng tư).

## Đã xong (đã commit và push)
- Dữ liệu: 58 bảng đối chiếu → `data/bang/*.json`, mẫu Word `data/mau/*.docx` (`data-build/`).
- `shared/`: schema, 21 cấu hình agent (`src/agents.ts`, nguồn duy nhất), chọn bảng, chia mục, prompt, gộp, trích chữ PDF, đổi font VNI→Unicode. 10 test (`npx vitest run`).
- `web/` (Vite+React): 5 bước, viewer khung đánh số, xuất PDF ghi chú + Word, ô liên kết tài khoản (token Claude, key Gemini, cookie JSON), chạy lô song song.
- `runner/`: server 127.0.0.1:8787, engine Claude Code, Gemini API, Gemini web (Chrome ẩn + cookie JSON tự làm mới), chạy lô có lưu tạm, CLI `/tham-dinh`.
- `.claude/`: 21 agent + 21 skill sinh tự động (`npm run gen:claude`), lệnh `/tham-dinh`.
- Chạy thật Hoàng Anh 1: 34/34 job bằng Claude Sonnet, 15 phút, khớp báo cáo tay (cửa D3 CHƯA ĐẠT…). Kết quả ở `ket_qua/ha1_web/`.
- Sơ đồ ngang chỉnh được: `so_do/so_do_kien_truc_ngang.html`. Cấu hình `netlify.toml`, workflow GitHub Pages.

## Việc người dùng cần làm (tôi không làm thay được)
1. **Bật website**: chuyển repo Public rồi Settings → Pages → Source: GitHub Actions; hoặc kéo thả `web/dist` vào https://app.netlify.com/drop (chạy `npm run build` trước). Chạy runner kèm `PCCC_ORIGINS=https://<tên>.netlify.app`.
2. **Key Gemini API** (aistudio.google.com/apikey) → dán vào web để chạy 10 luồng. Engine này mới qua test giả lập.
3. **Nạp quy chuẩn còn thiếu**: QCVN 10:2025/BCA, Phụ lục A TCVN 3890:2023, nghị định hiện hành về diện thẩm duyệt, Điều 4–7 và Phụ lục H QCVN 06. Chưa có thì dòng liên quan ghi CẦN XÁC NHẬN.
4. Cho phép tạo tác vụ hẹn giờ (`mcp__scheduled-tasks__create_scheduled_task` đang bị chặn) nếu muốn tự chạy tiếp khi reset hạn mức.

## Việc tiếp theo tôi nên làm (theo thứ tự)
1. Rà các phát hiện mới của lần chạy Hoàng Anh 1 với người dùng: cấp nước ngoài nhà 3 giờ, mặt nạ lọc độc thiếu 1 chiếc ở lầu 1, cáp CXV cho báo cháy.
2. Quy tắc "chỉnh bản vẽ" đã siết (`shared/src/prompt.ts` điều 4) nhưng chưa chạy lại để đo; lần trước ra 116 dòng, quá nhiều. Chạy lại vài job và so.
3. Thêm bài học mới vào `knowledge/bai-hoc.md` mỗi khi người dùng sửa kết luận.
4. Chạy thử Gemini API khi có key; chạy thử lô dài Gemini web.
5. Các skill/hook/lệnh còn "chưa" trên sơ đồ ngang (33 mục: hook soát findings, `/kiem-tra`, `/nap-kien-thuc`, `routes.json` đo hình học tự động…) — hỏi người dùng muốn làm mục nào trước.
6. Test thêm cho phần web/runner (hiện chỉ có test cho `shared/` và vài hàm runner).

## Cách chạy
Node cài dạng portable, trong bash: `export PATH="$LOCALAPPDATA/Programs/node-v22.23.3-win-x64:$PATH"`.
- Web: `npm run dev -- --port 5173` → http://localhost:5173. Runner: `npm run runner`.
- Test: `npx vitest run`. Build: `npm run build` (ra `web/dist`).
- Chạy cả lô từ dòng lệnh: `npm -w runner run cli -- chuan-bi ket_qua/<tên> "<pdf>"` → `jobs` → `chay ... --engine claude|gemini-api` → `gop`.
- Thử một prompt: `PCCC_CLAUDE_MODEL=sonnet npx tsx runner/src/thu_claude.ts <prompt.md> <ra.json> <thu_muc_phien>`.

## Bẫy đã gặp
- File bí mật không được commit (đã trong `.gitignore`): `runner/gemini_cookies.json`, `runner/claude_token.json`, `runner/gemini_key.json`, `runner/.profile*/`. Một lần commit lỡ chứa hồ sơ Chrome nhưng chưa lên remote và đã gỡ. Trước khi commit: `git diff --cached --name-only | grep -iE "profile|cookie|token|key"`.
- `git push` có lúc treo vì GitHub đòi đăng nhập lại; người dùng chạy `git push` một lần trong terminal để đăng nhập.
- Bộ phân loại an toàn của app chặn: tác vụ hẹn giờ, gỡ cờ né phát hiện bot, chạy nhiều tab Gemini web song song. Không vòng qua; dùng Gemini API cho chạy song song.
- Gemini web: chọn bảng theo giao diện tiếng Việt, selector ở `runner/src/engines/gemini_selectors.ts`; Google đổi giao diện thì sửa file này.
- Sửa `shared/src/agents.ts` xong phải chạy `npm run gen:claude` rồi commit `.claude/`.
- Sơ đồ `graphify-out/kien_truc/` chỉ lấy từ code, chưa commit (thư mục `graphify-out/` chưa được theo dõi).
