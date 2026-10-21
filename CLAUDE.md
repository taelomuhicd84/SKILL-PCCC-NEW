# Website thẩm định PCCC – quy tắc cho Claude
Người dùng: kỹ sư thẩm định PCCC, nói tiếng Việt, muốn trả lời ngắn, tiết kiệm token. Đã cấp toàn quyền trong repo; hỏi trước khi push, deploy, gửi ra ngoài.

## Đầu mỗi phiên đọc
1. `ROADMAP.md` – đang ở giai đoạn nào, còn việc gì.
2. `TIEN_DO.md` mục "ĐANG LÀM" – chi tiết kỹ thuật việc đang dở.
3. `BAT_DAU_PHIEN_MOI.md` khi cần cách chạy, bẫy đã gặp.

## Bản đồ repo
- `shared/src/` – lõi dùng chung: `agents.ts` (nguồn duy nhất của agent), `chon_bang.ts`, `chia_muc.ts`, `prompt.ts`, `gop.ts`, `schema.ts`.
- `web/src/` – giao diện React 6 tab; build ra `web/dist`.
- `runner/src/` – server 127.0.0.1:8787, engine Claude/Gemini, chạy lô, tự học (`hoc.ts`, `kiem_soat.ts`).
- `data/bang/` – bảng đối chiếu JSON (A*, B* hệ thống Đồng Nai; KT* xây dựng). Sinh từ `data-build/`.
- `knowledge/` – quy chuẩn, bài học (`bai-hoc.md`), ghi chú tự học (`hoc/`).
- `.claude/agents`, `.claude/skills` – sinh bằng `npm run gen:claude`, không sửa tay.
- `ket_qua/` – kết quả thẩm định; `bang_tinh/` – Excel tính toán; `so_do/` – sơ đồ kiến trúc.

## Roadmap Sync (luật bắt buộc)
- Code xong một tính năng (đã chạy thử) → trong cùng lượt: đánh dấu ✅ trong `ROADMAP.md`, thêm một dòng vào `LICH_SU.md`.
- Người dùng thêm tính năng / ý tưởng mới → ghi ngay vào `ROADMAP.md` đúng giai đoạn (hoặc "Ý tưởng chờ") với ⏳.
- Giữ nguyên cấu trúc `ROADMAP.md` (6 giai đoạn, ký hiệu ✅ 🔄 ⏳ 👤); chỉ đổi trạng thái, thêm/bớt dòng.
- Trước khi kết thúc lượt có sửa code: roadmap đã khớp thực tế chưa? Việc chưa kiểm ghi rõ "chưa kiểm".

## Sửa lỗi và đẩy GitHub
- Lỗi test/build/runner: giao agent `pccc-tu-sua`. Đẩy code: `bash scripts/day_github.sh "<commit>" [file mới…]` (tài khoản taelomuhicd84; mã thoát 3 = cần người dùng đăng nhập GitHub một lần).

## Luật khác
- Bí mật không commit: `runner/*cookie*`, `runner/claude_token.json`, `runner/gemini_key.json`, `runner/.profile*/`. Trước commit: `git diff --cached --name-only | grep -iE "profile|cookie|token|key"`.
- Sửa `shared/src/agents.ts` → `npm run gen:claude`. Sửa `web/` → `npm run build`. Sửa `runner/` → khởi động lại runner.
- Test: `npx vitest run`.
- Kết luận thẩm định phải trích điều khoản; thiếu dữ liệu thì CẦN XÁC NHẬN, không đoán.
