# Bàn giao sang phiên mới (cập nhật 2026-10-24)

**Mới 2026-10-24 (đọc đầu tiên):** thêm tab 8 Báo cáo khảo sát và báo giá + nút Bắt đầu ở bước 1 + Bài học 26 + hai sơ đồ `so_do/so_do_cong_viec.htm`, `so_do/so_do_quy_trinh_node.htm` (mở qua runner `/so-do/<tên>` để tự lưu; máy khác dùng `node scripts/chia_se_so_do.mjs`). Chi tiết đầu `TIEN_DO.md`. Máy mới: `npm run build`, bật lại runner (có route mới). Sửa md thì chạy `node scripts/sinh_so_do_node.mjs`.

**Mới 2026-10-23:** hôm nay làm bot chat mục 7 Sơ bộ thiết kế PCCC (tab 7 trên web) và Bài học 17–25, chi tiết ở đầu `TIEN_DO.md`. Việc lần sau: bot phải VẼ hướng dẫn lên bản vẽ (bãi đỗ, làn xe, bãi quay xe, tuyến thoát nạn góc vuông, khung tính toán), hiện mới trả chữ và khoanh khung. Cookie Gemini hay bị Google huỷ: khi lỗi 'chế độ khách' thì xuất file cookie mới thả vào `runner/gemini_cookies.json`. Máy mới kéo code: `npm run build`, bật lại runner.

**Mới 2026-10-22:** đọc `NOTE_CUA_TOI.md` trước. Gemini chỉ là dự án thử (`runner/src/thu_gemini_m04.ts`), dự án chính chạy Claude. Chi tiết: đầu `TIEN_DO.md`. Cập nhật từ GitHub: `bash scripts/cap_nhat_github.sh`. Máy mới kéo code phải `npm run build` (web/dist không nằm trong git).

**ĐỌC TRƯỚC:** `CLAUDE.md` (quy tắc), `ROADMAP.md` (tổng quan), rồi khối "BÀN GIAO PHIÊN 2026-10-21" đầu `TIEN_DO.md` (trạng thái, vấn đề mở, bẫy). Đoạn bên dưới là của các ngày trước, một số điểm đã cũ.

Mở phiên mới thì đọc file này trước, rồi đọc `TIEN_DO.md` (lịch sử chi tiết). Người dùng nói tiếng Việt, muốn trả lời ngắn, tiết kiệm token, đã cấp toàn quyền (không hỏi giữa chừng, trừ việc ra bên ngoài như push, deploy, tạo tài khoản).

## ĐỌC TRƯỚC (phiên 2026-10-20 chiều)
Việc đang dở và việc tiếp theo: mục "ĐANG LÀM / VIỆC TIẾP THEO" đầu `TIEN_DO.md`; lịch sử: `LICH_SU.md`. Mới so với đoạn bên dưới: kéo thả nhiều file và tự gộp theo công trình, tab "Tự học" (agent tự học thư mục được cấp quyền, ghi chú phải duyệt), bảng đối chiếu mới A1–A26 và B1–B14, tri thức mới (QCVN 10:2025, NĐ 105/347, TCVN 7568-14:2025). Đoạn "Tiến độ ngày 2026-10-20" bên dưới là của buổi sáng, một số điểm đã cũ (bảng B15, B34–B50 không còn).

## Tiến độ ngày 2026-10-20 (đọc phần này đầu tiên)
Mục tiêu người dùng chốt: **tự động hoá tối đa** — chọn PDF là tự chạy hết, không phải khai báo tay, không có nút "Tiếp".

**Đã làm xong và đã kiểm (build web qua, 10 test `shared` qua; chưa chạy lại cả lô thật sau các sửa cuối):**
1. **Web tự chạy** (`web/src/App.tsx`): chọn PDF → AI đọc hồ sơ → tự chọn bảng công năng + bảng hệ thống B34–B50 → thẩm định song song → rà soát chéo → sang bước 5. Bước 2 và 3 chỉ để xem/sửa; sửa xong bấm "Chạy lại với thông tin đã chỉnh" ở bước 4. Hồ sơ trùng tên đã có kết quả lưu (localStorage `pccc.kq.<tên>`) thì không tự chạy lại, nhảy thẳng bước 5.
2. **Chế độ "Hỗn hợp"** (mặc định, khoá lưu `pccc.engine2`): Claude luôn 3 luồng (đọc hồ sơ, các mục khó, rà soát); Gemini web 10 tab ẩn bằng cookie cho m10, m15, m17, m18 (`AGENT_GEMINI` trong `shared/src/agents.ts`). Tab mở cách nhau 4–7 s, các lần gửi xếp hàng 6–11 s (`runner/src/lo.ts`, `engines/nguoi_that.ts`). Không có thủ thuật né bot; gặp xác minh/captcha thì dừng.
3. **Gemini lỗi tự chuyển sang Claude**: cookie hết hạn thì Gemini chạy ở chế độ khách (có nút "Đăng nhập", mục tải tệp bị khoá). `gemini.ts` nhận ra (selector `chuaDangNhap`) và dừng nhóm Gemini; `chayHonHop` chạy lại các job hỏng bằng Claude (web gửi kèm `prompt_claude`).
4. **Một link, một cú bấm**: runner phục vụ luôn `web/dist` → http://127.0.0.1:8787 (không cần cổng 5173). `chay.bat` ở gốc repo: tự build nếu thiếu, bật runner, mở trình duyệt. Sửa code web xong phải `npm run build`.
5. **Runner không tự sập nữa**: bắt `unhandledRejection/uncaughtException` (`runner/src/chung.ts`), log ra `runner/runner.log` (đã ignore `*.log`); sửa lời hứa Playwright bỏ lửng ở bước tải tệp (nghi nguyên nhân gây "Failed to fetch").
6. **Ô số trang gõ được** ở khung xem bản vẽ (`web/src/Viewer.tsx`): bấm vào số, gõ, Enter.
7. **Xuất PDF dùng comment PDF** (`web/src/xuat_pdf.ts`): bỏ chữ nhãn vẽ đè lên bản vẽ; mỗi khung là chú thích Square (viền màu theo kết luận + Popup), bấm vào khung hiện comment (số khung, kết luận, lý do, điều khoản, chỉnh bản vẽ, hướng dẫn). Vẫn có vòng tròn số khung nhỏ và trang tổng hợp cuối. **CHƯA mở thử file PDF xuất ra** — kiểm bằng Acrobat/Edge/Foxit (Chrome hiện comment kém).

**Kết quả lần chạy HA1 gần nhất (hỗn hợp):** 29/34 job xong; 5 job Gemini (m10, m15, m17, m18, B45) lỗi vì cookie Gemini hết hạn → đã sửa mục 3. Chưa chạy lại 5 job đó sau bản sửa.

**Việc tiếp theo (theo thứ tự):**
1. Người dùng xuất cookie Gemini mới (Cookie-Editor → JSON) nạp ở bước 1, chạy lại bước 4 (job đã xong được giữ). Kiểm hỗn hợp chạy đủ, Gemini 10 tab không bị chặn; nếu hay bị chặn → dùng Gemini API key.
2. Xuất PDF thật, mở bằng Acrobat/Edge, kiểm: viền khung hiện đúng vị trí, bấm khung ra comment, không còn chữ đè.
3. Rà chất lượng chọn bảng tự động ở lần chạy đầu (bước 2 và 3) — phụ thuộc AI đọc hồ sơ đúng.
4. Các việc cũ bên dưới (rà phát hiện HA1, đo lại quy tắc "chỉnh bản vẽ", nạp quy chuẩn thiếu, `bai-hoc.md`…).
5. Việc cố ý chưa làm: lối tắt chạy `chay.bat` khi bật máy (thêm vào thư mục Startup nếu người dùng muốn); test tự động cho web/runner.

**Rủi ro cần nhớ:** tự động hoá giao diện Gemini web trái điều khoản Google, mười tab chung một tài khoản có thể bị khoá → nên dùng tài khoản phụ. Claude 3 luồng song song là bình thường (CLI chính thức) nhưng nhanh chạm hạn mức gói.

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
3. **Nạp quy chuẩn**: đã đủ phần chính; NĐ 105/2025 + NĐ 347/2026 (Phụ lục III dùng bản của NĐ 105) và hai công văn hướng dẫn nằm ở knowledge/nghi-dinh-tham-dinh-dieu-chinh.md. NĐ 136/2020 và NĐ 50/2024 đã hết hiệu lực, không dùng. Đã nạp 2026-10-20: QCVN 10:2025/BCA (6 file `knowledge/qcvn10-2025-*.md`), QCVN 06 Điều 4–7 và Phụ lục H (từ Word), TCVN 7568-14:2025. tiêu chuẩn trang bị cũ đã bỏ. Chưa có thì dòng liên quan ghi CẦN XÁC NHẬN.
4. Cho phép tạo tác vụ hẹn giờ (`mcp__scheduled-tasks__create_scheduled_task` đang bị chặn) nếu muốn tự chạy tiếp khi reset hạn mức.

## Việc tiếp theo tôi nên làm (theo thứ tự)
1. Rà các phát hiện mới của lần chạy Hoàng Anh 1 với người dùng: cấp nước ngoài nhà 3 giờ, mặt nạ lọc độc thiếu 1 chiếc ở lầu 1, cáp CXV cho báo cháy.
2. Quy tắc "chỉnh bản vẽ" đã siết (`shared/src/prompt.ts` điều 4) nhưng chưa chạy lại để đo; lần trước ra 116 dòng, quá nhiều. Chạy lại vài job và so.
3. Thêm bài học mới vào `knowledge/bai-hoc.md` mỗi khi người dùng sửa kết luận.
4. Chạy thử Gemini API khi có key; chạy thử lô dài Gemini web.
5. Các skill/hook/lệnh còn "chưa" trên sơ đồ ngang (33 mục: hook soát findings, `/kiem-tra`, `/nap-kien-thuc`, `routes.json` đo hình học tự động…) — hỏi người dùng muốn làm mục nào trước.
6. Test thêm cho phần web/runner (hiện chỉ có test cho `shared/` và vài hàm runner).

## Cách chạy
Máy khác có thể đã cài Node sẵn (`node -v`). Nếu dùng Node portable, trong bash: `export PATH="$LOCALAPPDATA/Programs/node-v22.23.3-win-x64:$PATH"`.
- **Cách nhanh nhất: bấm đúp `chay.bat`** → http://127.0.0.1:8787 (runner + web trong một). Dev web riêng: `npm run dev -- --port 5173` → http://localhost:5173; runner: `npm run runner`.
- Test: `npx vitest run`. Build: `npm run build` (ra `web/dist`).
- Chạy cả lô từ dòng lệnh: `npm -w runner run cli -- chuan-bi ket_qua/<tên> "<pdf>"` → `jobs` → `chay ... --engine claude|gemini-api` → `gop`.
- Thử một prompt: `PCCC_CLAUDE_MODEL=sonnet npx tsx runner/src/thu_claude.ts <prompt.md> <ra.json> <thu_muc_phien>`.

## Bẫy đã gặp
- File bí mật không được commit (đã trong `.gitignore`): `runner/gemini_cookies.json`, `runner/claude_token.json`, `runner/gemini_key.json`, `runner/.profile*/`. Một lần commit lỡ chứa hồ sơ Chrome nhưng chưa lên remote và đã gỡ. Trước khi commit: `git diff --cached --name-only | grep -iE "profile|cookie|token|key"`.
- `git push` có lúc treo vì GitHub đòi đăng nhập lại; người dùng chạy `git push` một lần trong terminal để đăng nhập.
- Bộ phân loại an toàn của app từng chặn: tác vụ hẹn giờ, gỡ cờ né phát hiện bot. Không vòng qua. Chạy nhiều tab Gemini web nay đã làm ở chế độ Hỗn hợp theo yêu cầu người dùng (chỉ giãn cách thao tác, không né bot); vẫn nên ưu tiên Gemini API nếu có key.
- `.claude/launch.json` còn trỏ tới đường dẫn Node của máy cũ (`C:\Users\HP\...`); sửa lại nếu dùng preview ở máy khác.
- Cổng 8787/5173 có thể còn tiến trình cũ chạy code cũ: tắt (`Stop-Process`) rồi bật lại runner sau khi sửa code `runner/`.
- Gemini web: chọn bảng theo giao diện tiếng Việt, selector ở `runner/src/engines/gemini_selectors.ts`; Google đổi giao diện thì sửa file này.
- Sửa `shared/src/agents.ts` xong phải chạy `npm run gen:claude` rồi commit `.claude/`.
- Sơ đồ `graphify-out/kien_truc/` chỉ lấy từ code, chưa commit (thư mục `graphify-out/` chưa được theo dõi).
