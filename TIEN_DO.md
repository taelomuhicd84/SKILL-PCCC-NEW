# Tiến độ dự án Website thẩm định PCCC
Phiên mới: đọc BAT_DAU_PHIEN_MOI.md trước.
File này cập nhật sau mỗi mốc việc và trước mỗi lần compact/clear. Đọc file này đầu tiên khi tiếp tục.
Kế hoạch gốc: `C:\Users\HP\.claude\plans\t-i-mu-n-l-m-1-ticklish-gosling.md` (web tĩnh GitHub Pages + runner cục bộ Claude Code / Gemini Playwright).

## ĐANG LÀM / VIỆC TIẾP THEO (cập nhật 2026-10-20, đọc trước)
Lịch sử đầy đủ: `LICH_SU.md`. Người dùng dặn: khi sắp hết token thì ghi file này + `LICH_SU.md` rồi push GitHub.
0a-ter. **2026-10-20 ~13:54: runner đã chạy (chay.bat) và đã bấm học thư mục (50 file); Claude hết hạn mức đến 15:22 nên runner tự chờ rồi tự chạy tiếp, không cần người. Kiểm soát viên AI + tự duyệt chạy trong lần học này. Nếu mở phiên mới sau 15:22: xem tab 6 hoặc GET /hoc xem trạng thái, rồi bấm 'Học ngay' tiếp (còn ~224 file, mỗi lần 50).**
0a-bis. **Người dùng đã duyệt đợt đầu (20 duyệt, 2 bỏ) và giao quyền: từ nay agent tự học + kiểm soát viên TỰ DUYỆT, chỉ hỏi người dùng khi `can_sua`, hiệu lực đề xuất/chưa rõ, hoặc việc quá hóc búa.**
0a. **KIỂM SOÁT VIÊN cho agent tự học (người dùng yêu cầu 2026-10-20): XONG code, chưa chạy phần AI.** `runner/src/kiem_soat.ts` + tích hợp `runner/src/hoc.ts` (`kiemSoatGhiChu`): mỗi ghi chú mới phải qua (1) lint quy tắc thuật ngữ/số hiệu/hiệu lực (không tốn hạn mức), (2) kiểm soát viên AI đối chiếu văn bản nguồn (thuật ngữ, số hiệu, trị số, hiệu lực), (3) gỡ **xung đột** với ghi chú khác và với `knowledge/` chính thức theo thứ tự ưu tiên (văn bản gốc hiện hành > công văn chính thức mới > tập huấn > đề xuất; cùng cấp thì mới thắng cũ; khác phạm vi không phải xung đột): bên sai bị gạch và chèn bản đúng, ghi `knowledge/hoc/_nhat_ky_kiem_soat.md`; không phân xử được thì trạng thái `can_sua` và hỏi người thẩm định. Ghi chú `can_sua` không vào `_da_duyet.md`, không tự duyệt (tab 6 có nút "Duyệt ép"). Bảng thuật ngữ chuẩn: `knowledge/thuat-ngu-chuan.md`. Kiểm lại bằng quy tắc: `npx tsx runner/src/kiem_soat_cli.ts` hoặc GET `/hoc/kiem-lai`. Test: `runner/test/kiem_soat.test.ts`. **Đã gỡ 3 xung đột thật trong 24 ghi chú:** (a) QĐ 4158/QĐ-BCA hết hiệu lực (công văn C07) mà ghi chú tập huấn sprinkler + TCVN 14496 còn ghi là chấp thuận; (b) TCVN 4513:1988 bị ghi "cũ, bỏ" trong ghi chú QCVN 02 nhưng cơ quan PCCC 2026 vẫn viện dẫn; (c) tập huấn báo cháy (quy tắc dầm 25%/40%, 20 phòng/kênh, âm thanh thiếu 65/75 dBA) khác TCVN 7568-14:2025 nguyên văn nên đã đính chính theo 7568-14. Việc còn: chạy phần AI trên toàn bộ ghi chú đã có khi Claude có hạn mức (bấm lại học hoặc viết lệnh kiểm lại AI).
0. **Tự học thủ công (Claude đọc tay vì `claude -p` còn bị chặn hạn mức) — ĐÃ GHI 24 ghi chú `knowledge/hoc/*.md` (trạng thái cho_duyet, chưa duyệt ở tab 6; từ nay được commit):** C07 chuyên đề QCVN 06 SĐ1; tập huấn BCTD; sprinkler; khí; sol-khí; QCVN 06 SĐ1 cấp nước; cấp nước ngoài/trong nhà; nhà công nghiệp; QCVN 02 trạm bơm; QCVN 13 gara; TCVN 7435 bình chữa cháy; TCVN 13456 đèn sự cố; TCVN 7336 (Bảng 1–3, PL A: **karaoke = nhóm 2**) + bảng đầu báo khói; TCVN 13967 (Điều 9, **9.3.1.4 karaoke: sân thượng thoáng, chuông đèn từng phòng, ngắt điện âm thanh liên động, hướng dẫn thoát nạn cho khách**); TCVN 14496:2025 kho giá kệ; TCVN 5687:2024 mục 7; **hồ sơ 2026 (công văn hướng dẫn/thẩm định/nghiệm thu của PC07 TP.HCM: mẫu nhận xét + danh sách điều khoản hay bị yêu cầu + 'không thuộc diện' + cơ quan vẫn viện dẫn TCVN 4513:1988)**; TCVN 4513 điều 7.13–7.22, 8.9; hồ sơ 2025 (giấy chứng nhận thẩm duyệt + quy mô karaoke); **Karaoke Hoàng Yến 2024 (mốc tham chiếu đã nghiệm thu: 16 phòng/925 m2, 60 đầu nhiệt, 124 sprinkler K5.6, bể 45 m3, 2 lối thoát)** và 3 karaoke 2024 khác (Thanh Liêm, Hoàng Anh 1, SV). Đã đánh dấu đọc trong `_chi_muc.json`. **Còn lại:** hồ sơ 2025 và 2024: phần có lớp chữ đã xong (2025); **2024: mới đọc 4 karaoke (giấy + biên bản nghiệm thu); còn ~125 PDF scan (nhà xưởng, văn phòng, khách sạn, trường…), cùng các PDF scan 2025/2026 chưa đọc** — cần đọc ảnh trang (PyMuPDF dựng PNG rồi Read), ưu tiên văn bản thẩm duyệt/công văn trước, bản vẽ sau; script mẫu `ex25.py` trích chữ file < 1,5 MB (Drive đọc chậm, chạy nền); 2026: còn bản scan biên bản kiểm tra (BBKT), công văn NLMT, hồ sơ bản vẽ. Excel đã xong; video bỏ. Việc tiếp: duyệt ghi chú ở tab 6, rồi chạy lại Karaoke Hoàng Yến.
1. **Agent tự học đang chờ Claude reset 15:22** rồi tự học 48 file ở `8_TAILIEUHOCTAP` (đã sắp thành 8 thư mục, xem `_MUC_LUC.md` trong thư mục đó). Sau đó 3 thư mục hồ sơ cũ 2024/2025/2026 (đã cấp quyền; bấm "Học ngay" ở tab 6, hoặc đợi chu kỳ tự học mỗi ngày). Runner phải đang chạy (`chay.bat`). Học xong: mở tab 6 "Tự học", duyệt ghi chú (chưa duyệt thì agent thẩm định không dùng). Kho hồ sơ cũ là **bản scan** (136 PDF năm 2024): agent chỉ đọc file có lớp chữ; file scan chưa học được (cần OCR; máy chưa có tesseract/poppler). Quy tắc học kho cũ (người dùng chốt): QCVN 06 vẫn dùng; kiến thức hệ thống PCCC chỉ lấy phần còn dùng được hiện tại; 2026 là mới nhất, luật mới học, cũ bỏ.
2. **File Excel mới: XONG bản đầu** (`bang_tinh/BANG_TINH_PCCC.xlsx`, bản sao ở `8_TAILIEUHOCTAP/07_Bang tinh Excel/BANG_TINH_PCCC_TONG_HOP.xlsx`). 13 sheet: HUONG_DAN (nguồn, mức kiểm A/B/C, lỗi tìm thấy ở bảng cũ), 1 Sprinkler (TCVN 7336 PL B + Hazen-Williams), 2 Họng nước (QCVN 10 H.7), 3 Bể và bơm, 4 Hút khói (TCVN 5687:2024 PL H), 5 Thoát khói tự nhiên, 6 Ống gió và quạt, 7 Máy phát, 8 Khí chữa cháy, 9 Foam (TCVN 7336 PL C), 10 Dây và MCCB, 11 Kết cấu Am/V, DU_LIEU. Sinh bằng `python -X utf8 scripts/lap_bang_tinh_pccc.py`; kiểm bằng `scripts/kiem_bang_tinh_pccc.py` (thư viện `formulas`; 0 ô lỗi, mọi kết quả chính khớp phép tính độc lập). Chưa mở thử trong Excel thật (máy không có Excel/LibreOffice): người dùng mở và báo lỗi hiển thị nếu có. Việc còn lại: đối chiếu mức C (khí trơ IG-541/IG-55, thoát khói tự nhiên, máy phát, dây/MCCB, Am/V); thêm áp suất nổ dư nếu cần; bảng tra tổn thất cục bộ ống gió.
3. **Chạy lại Karaoke Hoàng Yến** bằng bảng mới A12 + B1–B14, bật "Hướng dẫn thiết kế" (người dùng muốn test). Kéo thả PDF vào web http://127.0.0.1:8787. Cookie Gemini hết hạn dễ gây lỗi job Gemini: chọn chế độ Claude nếu cần.
4. Việc cũ còn mở: bật Pages/Netlify; rà phát hiện HA1; đo lại quy tắc "chỉnh bản vẽ"; thêm bảng chống tụ khói, thang máy chữa cháy, chống sét nếu người dùng gửi; thêm bài học thoát nạn người dùng đang dạy (vào `knowledge/bai-hoc.md`).

## Trạng thái các bước
| # | Bước | Trạng thái |
|---|---|---|
| 0 | Môi trường: Node 22 portable tại `%LOCALAPPDATA%\Programs\node-v22.23.3-win-x64` (đã thêm PATH user) | xong |
| 1 | Dữ liệu: `data-build/convert_doc.ps1` (.doc→.docx), `data-build/build_data.py` → `data/bang/*.json`, `data/mau/*.docx` (58 bảng) | xong |
| 2 | shared: schema, agents (cấu hình hạng mục), chọn bảng, chia mục, prompt, gộp, trích chữ PDF – 6 test vitest qua | xong |
| 3 | web (Vite+React): 5 bước, viewer, chế độ thủ công – build qua, CHƯA chạy thử trên trình duyệt | xong phần code |
| 4 | runner: server (127.0.0.1:8787), engine claude -p, engine Gemini Playwright (chưa thử đăng nhập), CLI chuan-bi/jobs/ra-soat/gop (chuan-bi đã chạy với HA1 120 trang) | xong phần code |
| 5 | xuất PDF (web/src/xuat_pdf.ts) và docx (web/src/xuat_docx.ts) – chưa kiểm bằng file thật | xong phần code |
| 6 | .claude: 21 agent + 21 skill sinh từ shared/src/agents.ts (`npm run gen:claude`), lệnh /tham-dinh (.claude/skills/tham-dinh) | xong |
| 7 | .github/workflows/pages.yml + README – đã push; chờ user bật Pages | xong |
| 8 | kiểm tra: CHẠY ĐỦ 34/34 job HA1 bằng Claude Sonnet 3 luồng trong 15 phút (606 dòng: ĐẠT 135, CHƯA ĐẠT 7, CXN 154, KAD 310) – khớp báo cáo tay ở D3, EX-EM 4,88 lux, chiều cao PCCC, phân tán; thêm phát hiện mới cần người rà (cấp nước ngoài nhà 3h, mặt nạ lọc độc, cáp CXV báo cháy); 'chỉnh bản vẽ' quá nhiều (116) → đã siết quy tắc 4. Trước đó: web + runner nối được (CORS, /phien); xuất PDF/docx đúng; Claude Sonnet thật trên HA1: đọc hồ sơ đúng (F2.1, 7,6 m, bậc II, sprinkler, B15 + 10 bảng HT), mục 6 bắt D3 CHƯA ĐẠT sau khi thêm knowledge/bai-hoc.md | xong |

Nhịp tim: 2026-10-19 (sau reset hạn mức: hết việc tự làm được, chờ user)

## Lịch sử
- 2026-10-19: lập kế hoạch, user duyệt; cài Node portable (winget lỗi 1618); chuyển 10 bảng .doc bằng Word COM; build 58 bảng JSON.
- 2026-10-19: viết shared/ (test qua), web/ (build qua). Tiếp: runner/ (claude -p, Playwright Gemini), rồi gen .claude, deploy, kiểm Hoàng Anh 1.
- 2026-10-19: runner + CLI xong; gen .claude; workflow Pages; kiểm xuất PDF/docx trên trình duyệt (dev: `npm run dev -- --port 5173`, file thử data/_test.pdf không commit). Tác vụ hẹn giờ tự làm tiếp bị hệ thống chặn (cần user cho phép).
- 2026-10-19: push lên GitHub; thêm đăng nhập Gemini bằng cookie JSON dùng lâu dài.
- 2026-10-19: thêm đổi font VNI→Unicode khi trích chữ PDF (10 test qua); push lại thành công.
- 2026-10-19: SỰ CỐ: commit lỡ chứa hồ sơ Chrome thử (runner/.profile_thu, có phiên Google) – push treo ở xác thực nên remote KHÔNG nhận; đã gỡ khỏi commit, xoá thư mục, ignore runner/.profile*/.
- 2026-10-19: bộ chạy lô song song (runner/src/lo.ts: lưu tạm từng job, dùng lại khi chạy lại), engine Gemini API, endpoint /lo /gemini/cookie /gemini/key /claude/token /claude/dang-nhap, web: LienKet.tsx (liên kết tài khoản, số luồng) + chạy lô có ghép dần. Tác vụ hẹn giờ tự làm tiếp bị chặn lần 2.
- 2026-10-19: sửa gán mục 15; thêm knowledge/bai-hoc.md (8 bài học HA1) + quy tắc 8 'đủ dữ liệu thì kết luận rõ'; chạy thật A0 + mục 6 (Sonnet) – khớp kết quả tay.

- 2026-10-19: so_do/so_do_kien_truc_ngang.html – sơ đồ ngang dạng node, thêm/sửa/xoá/nối module, thống kê, xuất/nhập JSON (80 module: 35 có, 12 một phần, 33 chưa). Netlify: netlify.toml + web/dist; chờ user kéo thả/nối repo.
- 2026-10-20: web tự chạy toàn bộ khi chọn PDF; chế độ Hỗn hợp (Claude 3 luồng + Gemini web 10 tab, lỗi Gemini tự chuyển Claude); runner phục vụ web ở :8787 + chay.bat; runner không sập khi lỗi lạc; ô số trang gõ được; xuất PDF dùng comment Square + Popup. Chi tiết và việc tiếp: BAT_DAU_PHIEN_MOI.md.

## Ghi chú kỹ thuật
- Mục lớn (1–18) của bảng công năng KHÔNG cố định chỉ số và số mục khác nhau giữa các bảng (B15 có 18, B4.1 có 17, B17 có 19) → chia mục theo dòng TT là số nguyên tăng dần, gán agent theo từ khóa tiêu đề.
- Bảng hệ thống (B34–B50) chỉ có vài mục (Đối tượng trang bị, Yêu cầu chung…) → mỗi bảng là một job của agent hệ thống tương ứng.

## Việc tiếp theo (chờ user nghiệm thu)
0. Push: đã chạy lại bình thường sau khi user đăng nhập GitHub (2026-10-19).
0b. Tự làm tiếp khi reset hạn mức: tác vụ hẹn giờ bị bộ phân loại an toàn chặn 2 lần. User thêm quyền cho mcp__scheduled-tasks__create_scheduled_task (hoặc tự tạo tác vụ trong mục Scheduled của app) với nội dung: 'Đọc TIEN_DO.md và làm tiếp'.
1. Đã push 2026-10-19. User cần bật Pages (Settings → Pages → Source: GitHub Actions).
2. ~~Chạy đủ 34 job HA1~~ XONG (xem dòng 8). Còn: user rà các phát hiện mới.
3. Engine Gemini web (Chrome ẩn, 1 tab tuần tự, có nghỉ): đã thử headless + cookie thật OK (đăng nhập, tải tệp, gửi, đọc JSON 14 s). Chạy lô nhiều tab + né phát hiện bot bị bộ phân loại an toàn chặn → đã gỡ cờ né phát hiện, thay bằng engine **Gemini API** (runner/src/engines/gemini_api.ts, 10 luồng, chờ user dán key). Trước đó: đăng nhập bằng file cookie JSON (runner/src/engines/gemini_cookies.ts: nạp, tự ghi lại cookie đã làm mới sau mỗi job + 30 phút, lệnh gemini-giu-phien). CHƯA thử với cookie thật – chờ user xuất file.
4. ~~Nạp QCVN 10:2025/BCA, Điều 4–7 + PL H QCVN 06~~ XONG 2026-10-20 (TCVN 3890 đã bỏ). Đã nạp NĐ 105/2025 + NĐ 347/2026 + Phụ lục III + 2 công văn (knowledge/nghi-dinh-tham-dinh-dieu-chinh.md); NĐ 136, NĐ 50 đã hết hiệu lực.
5. ~~Font VNI~~ XONG: shared/src/vni.ts đổi VNI→Unicode khi trích chữ (HA1 có 368 cụm VNI ở khung tên, thuyết minh); không đụng chữ Unicode.

## Cách chạy nhanh (dev)
- Web: `npm run dev -- --port 5173`; runner: `npm run runner`; test: `npx vitest run`; build: `npm run build`.
- Node portable: `export PATH="$LOCALAPPDATA/Programs/node-v22.23.3-win-x64:$PATH"` (bash).
- Thử một prompt bằng Claude: `PCCC_CLAUDE_MODEL=sonnet npx tsx runner/src/thu_claude.ts <prompt.md> <ra.json> <thu_muc_phien>`.
