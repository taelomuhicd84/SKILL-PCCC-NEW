# Website thẩm định thiết kế PCCC

Up PDF bản vẽ → AI đọc thông tin công trình → chọn bảng đối chiếu theo nhóm nhà → agent xét từng hạng mục (bảng công năng A1–A26 + bảng hệ thống B1–B14) → ghi chú khung đánh số lên PDF + bảng đối chiếu Word theo mẫu chính thức (ĐẠT / CHƯA ĐẠT / CẦN XÁC NHẬN / KHÔNG ÁP DỤNG, có lý do và điều khoản). Công tắc **Hướng dẫn thiết kế** thêm ghi chú cách thiết kế cho đạt.

- **Web tĩnh** (miễn phí trên GitHub Pages): mọi xử lý PDF, ghi chú, xuất Word chạy trong trình duyệt. Không có máy chủ, không tốn phí duy trì.
- **AI do mỗi người dùng tự đăng nhập** qua **runner** chạy trên máy họ: Claude Code (tài khoản Claude của họ) hoặc Gemini trên trình duyệt (Playwright mở gemini.google.com, họ tự đăng nhập Google). Không cài runner vẫn dùng được chế độ **Thủ công** (copy prompt, dán trả lời).
- Tiến độ phát triển: xem `TIEN_DO.md`.

## Dùng website
1. Mở trang web (GitHub Pages của repo, hoặc chạy tại máy: `npm run dev`).
2. Bước 1 chọn PDF (nhiều file được gộp) và chọn AI. Bước 2 "AI đọc hồ sơ", rà lại bảng thông tin. Bước 3 kiểm bảng đối chiếu được chọn. Bước 4 "Chạy tất cả". Bước 5 tải PDF ghi chú, Word từng bảng, file kết quả .json.

## Cài runner (máy người dùng, Windows/macOS/Linux)
```bash
# cần Node.js 20+ (https://nodejs.org) và git
git clone https://github.com/taelomuhicd84/SKILL-PCCC-NEW && cd SKILL-PCCC-NEW
npm install
npm run runner            # chạy tại http://127.0.0.1:8787 – để cửa sổ này mở khi dùng web
```
- **Liên kết tài khoản ngay trên web** (bước 1, khi runner đang chạy): dán token Claude / API key Gemini, nạp file cookie Gemini `.json`, chọn số luồng song song. Mọi thứ chỉ gửi tới runner ở 127.0.0.1 và lưu trong `runner/` của máy bạn (đã có trong `.gitignore`).
- **Gemini API (khuyên dùng, nhanh nhất)**: lấy key miễn phí tại https://aistudio.google.com/apikey, dán vào web. Runner tải bản vẽ lên Files API một lần rồi chạy các job song song (mặc định 10 luồng, `PCCC_GEMINI_API_LUONG`); vượt hạn mức (429) thì tự lùi lại. Model: `PCCC_GEMINI_MODEL` (mặc định `gemini-2.5-flash`).
- **Claude Code**: máy đã đăng nhập `claude` là dùng được. Liên kết lâu dài: nút "Mở cửa sổ đăng nhập Claude" chạy `claude setup-token`, dán token `sk-ant-…` vào web (hoặc API key). Mặc định 3 luồng (`PCCC_CLAUDE_LUONG`), model `PCCC_CLAUDE_MODEL`.
- **Chạy theo lô**: web gửi cả lô job cho runner; mỗi job xong được lưu tạm ở `runner/work/<phiên>/jobs/` và ghép ngay vào bảng kết quả. Chạy lại thì job đã xong (cùng prompt) được dùng lại, nên bị ngắt giữa chừng vẫn chạy tiếp được. Dòng lệnh: `npm -w runner run cli -- chay ket_qua/<tên> --engine gemini-api|claude [--luong 10]`.
- **Gemini web – đăng nhập bằng file cookie JSON (chậm, chạy tuần tự 1 tab, Chrome ẩn)**:
  1. Mở Chrome **cửa sổ ẩn danh**, đăng nhập Google, vào gemini.google.com cho chắc đã dùng được.
  2. Dùng tiện ích **Cookie-Editor** (hoặc EditThisCookie): ở trang gemini.google.com bấm *Export → JSON*, lưu thành `runner/gemini_cookies.json`. (Nhận cả định dạng Playwright `storageState`.)
  3. **Đóng cửa sổ ẩn danh, KHÔNG bấm đăng xuất.** Đăng xuất sẽ huỷ phiên và file cookie chết ngay.
  4. Kiểm tra: `npm -w runner run gemini-giu-phien` (in "Phiên Gemini còn hiệu lực").
  - Runner tự **ghi đè file bằng cookie Google vừa làm mới** sau mỗi job và mỗi 30 phút khi đang mở, nên file theo kịp việc Google xoay vòng cookie (__Secure-1PSIDTS…).
  - Khi lâu không dùng: đặt Windows Task Scheduler chạy `npm -w runner run gemini-giu-phien` trong thư mục repo 1–2 lần/ngày để phiên không nguội.
  - Phiên vẫn có thể bị Google huỷ (đổi mật khẩu, đăng xuất mọi thiết bị, cảnh báo bảo mật): khi đó xuất lại file. Cách khác: `npm -w runner run gemini-login` mở Chrome để đăng nhập trực tiếp, cookie cũng được ghi ra file.
  - File cookie là thông tin đăng nhập: giữ trên máy mình, không gửi ai (đã có trong `.gitignore`). `PCCC_GEMINI_COOKIES` đổi đường dẫn file; `PCCC_GEMINI_HEADLESS=1` chạy ẩn cửa sổ (Google dễ chặn hơn).
  - Lưu ý: tự động hoá gemini.google.com dễ hỏng khi Google đổi giao diện (sửa `runner/src/engines/gemini_selectors.ts`) và có thể trái điều khoản của Google.
- Web ở địa chỉ khác (vd. fork của bạn): đặt `PCCC_ORIGINS=https://<tên>.github.io` trước khi chạy runner.

## Chạy hoàn toàn trong Claude Code
Mở repo bằng Claude Code, gõ `/tham-dinh "<đường dẫn pdf>"` (xem `.claude/skills/tham-dinh/SKILL.md`). Kết quả ở `ket_qua/<tên>/ket_qua.json`, mở bằng web để tải PDF ghi chú và Word.

## Cấu trúc mới
| Thư mục | Nội dung |
|---|---|
| `shared/` | schema kết quả, cấu hình agent theo hạng mục (`src/agents.ts` – nguồn duy nhất), chọn bảng, chia mục, dựng prompt, gộp, trích chữ PDF |
| `web/` | ứng dụng React (Vite) |
| `runner/` | server cục bộ, engine Claude/Gemini, CLI cho `/tham-dinh` |
| `data/` | sinh bởi `data-build/build_data.py` từ thư mục bảng mẫu: `bang/*.json` (58 bảng), `mau/*.docx` |
| `.claude/agents`, `.claude/skills/pccc-*` | sinh bởi `npm run gen:claude` |

Cập nhật bảng mẫu: `powershell -File data-build\convert_doc.ps1` (bảng .doc) rồi `python -X utf8 data-build/build_data.py "<thư mục bảng>"`. Thêm quy chuẩn mới (vd. QCVN 10:2025/BCA): đặt file nguyên văn vào `skills/`, thêm đường dẫn vào `tri_thuc` của agent trong `shared/src/agents.ts`, chạy `npm run gen:claude`.

---

# Hệ thống kiểm tra bản vẽ PCCC – cấu trúc thư mục (cập nhật 17/10/2026)

Mở `so_do/quy_trinh_tham_dinh_chi_tiet.html` để xem quy trình từng giai đoạn kèm giải thích cho người mới. Mở `so_do/so_do_kien_truc_he_thong.html` để xem kiến trúc module.

## Ba lớp, mỗi lớp một việc
| Lớp | Thư mục | Chứa gì | Khi nào mở |
|---|---|---|---|
| Quy trình | `skills/SKILL_quy_trinh_tham_dinh.md`, `skills/SKILL_thoat_nan.md` | thứ tự làm việc, nguyên tắc, bảng chỉ mục | luôn mở đầu tiên |
| Tri thức | `knowledge/` | định nghĩa (`dinh-nghia/`), danh mục trường thông tin (`truong-thong-tin.md`) | khi cần nghĩa của một khái niệm hoặc tên trường |
| Điều khoản | `skills/MOD_*.md`, `skills/PHU_LUC_G_QCVN06.md` | nguyên văn QCVN 06 sửa đổi 01 đã rút gọn, theo chuyên đề | chỉ mở module cần cho dòng đang xét |
| Đối chiếu | `bang_doi_chieu/` | bảng chính thức giữ nguyên khung: `DANH_MUC.md` (chọn bảng), danh mục bảng A (công năng) và B (hệ thống). Gốc mẫu: `D:\$.4. QC - TCVN\Bảng đối chiếu PCCC Đồng Nai -Nam gửi\` | giai đoạn 2, 3, 5 |
| Ví dụ | `skills/VI_DU_hoang_anh_1.md`, `ket_qua/` | ca đã làm | khi cần so cách làm |

## Module điều khoản (trong `skills/`)
| File | Điều khoản |
|---|---|
| MOD_loi_ra_va_cua | 3.1, 3.2.1–3.2.4, 3.2.9–3.2.14 |
| MOD_so_luong_loi_ra | 3.2.5–3.2.7 |
| MOD_tinh_toan_khoang_cach | 3.2.8, tính số người, mật độ, bề rộng, chiều dài |
| PHU_LUC_G_QCVN06 | Phụ lục G (G.1–G.3, Bảng G.1–G.9) |
| MOD_hanh_lang_bao_che | 3.3.1–3.3.7 |
| MOD_cau_thang_buong_thang | 3.4.1–3.4.17, loại thang, khi nào cần N1 |
| MOD_hinh_Phu_luc_I_cau_thang | Hình I.1–I.9 |
| MOD_vat_lieu_hoan_thien | 3.3.4, 3.5, Phụ lục B |
| MOD_chong_khoi_PL_D | Phụ lục D |
| SKILL_ngan_chay_cong_nang | 4.5, F1.3, tỉ lệ cửa/tường |

## Chưa nạp
Toàn văn TCVN 7336, 13456 (chỉ có phần đã trích trong bảng đối chiếu chính thức); Phụ lục III mới của NĐ 347/2026 (diện thẩm định). Đã nạp: NĐ 105/2025 + NĐ 347/2026 về thẩm định và điều chỉnh, QCVN 06 Điều 4 đến 7 và Phụ lục H (từ file Word 10/2023), QCVN 10:2025/BCA (toàn văn), TCVN 7568-14:2025. TCVN 3890 đã bỏ.

## Lưu ý
- Bản QCVN dùng là bản hợp nhất có chữ cũ bị gạch: chỉ nạp chữ hiện hành.
- Số đo trên bản vẽ là ước lượng ±1–2 m, chưa đo trên CAD.
- `scripts/bang_doi_chieu_tool.py` đọc bảng đối chiếu .docx tiết kiệm token (khung, một dòng, tìm từ khóa, tạo bảng làm việc); đổi `BANG_DIR` nếu thư mục bảng nằm ở nơi khác.
- `scripts/annotate_karaoke.py` có đường dẫn cứng tới máy cũ (SRC, OUT, FONT).