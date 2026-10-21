# Báo cáo tiến độ (2026-10-20, cuối phiên)
Trạng thái chi tiết: `TIEN_DO.md`. Lịch sử mốc: `LICH_SU.md`. Phiên sau đọc file này để cùng tối ưu.

## Đã xong trong phiên này
- Agent **Hướng dẫn thẩm định** (`huong-dan`) chạy sau rà soát; chạy thật trên Karaoke Hoàng Yến.
- Tự học scan 2024–2026 xong, kiểm soát viên + tự duyệt hoạt động; sửa BOM `hoc_cau_hinh.json`.
- Lô chạy lúc 16:06 (giờ máy) xong 22/22 job, rà soát và hướng dẫn xong lúc 16:23.
- Sửa lỗi web: nạp PDF báo "Không đọc được PDF … Expected object, received null". Nguyên nhân: kết quả lưu cũ có `thong_tin = null` mà `ThongTin.parse(null)` lỗi. Sửa ở `web/src/App.tsx:97`, đã build lại.

- Thẩm định tách 2 phần: xây dựng PCCC (bảng KT*, từ bảng cũ, đầu mục NĐ 105 Điều 6) và hệ thống PCCC (A/B Đồng Nai, Điều 9). Hai kết quả riêng ở tab 5. Chưa chạy thật phần kiến trúc bằng AI.

## Vấn đề người dùng nêu: ĐỌC HỒ SƠ RẤT LÂU (cần tối ưu phiên sau)
Số đo từ `runner/runner.log` (job `A0-doc-ho-so`, một lệnh `claude -p`, tuần tự, chạy trước mọi job khác):

| Lần chạy (UTC) | Thời gian đọc hồ sơ |
|---|---|
| 03:24 | 2 phút 12 giây |
| 03:29 | 1 phút 57 giây |
| 04:19 | 2 phút 29 giây |
| 08:44 | 2 phút 41 giây |
| 08:58 | 2 phút 42 giây |
| 09:29 | 2 phút 35 giây |

Tổng một lần thẩm định đầy đủ (hồ sơ KT+PCCC, 22 job) khoảng 20–25 phút: đọc hồ sơ ~2,5 phút → 22 job song song ~12 phút → rà soát ~2 phút → hướng dẫn ~2 phút. Đọc hồ sơ là bước tuần tự duy nhất không chạy song song và phải xong trước khi các job khác bắt đầu. Ngoài ra khi nạp lại trang thì mất cả phần chọn bảng/thông tin (phải đọc hồ sơ lại).

Nguyên nhân nghi ngờ (chưa đo, cần kiểm):
1. Một tiến trình `claude -p` đọc toàn bộ chữ của cả hồ sơ (`chu.json` 427 KB) rồi điền A01–A10, B01–B08, C01–C12 và cờ hệ thống trong một lượt.
2. Khởi động `claude -p` mỗi lần tốn thêm.
3. Web mất trạng thái khi F5, buộc đọc lại.

## Ý tưởng tối ưu (chưa làm, phiên sau cùng chọn)
1. **Lưu đệm kết quả đọc hồ sơ** theo hash PDF+chu (như `daCo` của các job): nạp lại cùng file thì dùng ngay, không gọi AI. Rẻ nhất, hiệu quả nhất.
2. **Lưu phiên vào `localStorage` hoặc nạp lại từ `runner/work/<phiên>` khi F5** để không mất kết quả đã ghép.
3. **Chia đọc hồ sơ thành vài job song song** (A theo trang bìa/thuyết minh, B theo kiến trúc, C theo hệ thống PCCC) rồi gộp; hoặc chỉ gửi trang liên quan thay vì toàn bộ chữ.
4. **Đọc hồ sơ bằng Gemini API** (nhanh, song song) rồi các job nặng mới dùng Claude, nếu có key.
5. Đo thật: ghi thời gian từng pha (trích chữ ở trình duyệt, gửi hồ sơ, đọc hồ sơ, từng job) vào log để có số liệu trước khi tối ưu.

## Còn mở
- Chưa mở thử PDF xuất ra bằng Acrobat/Edge; agent hướng dẫn chưa đọc ảnh trang bản vẽ.
- 226 dòng có hướng dẫn nhiều hơn 153 dòng yêu cầu: xem lại.
- Chưa mở lại trang để thử nạp PDF sau khi sửa lỗi `thong_tin = null` (đã build, chưa kiểm bằng trình duyệt).
- Phiên `runner/work/79cba2da` là hồ sơ "PCCC" (4,8 MB), khác `ket_qua/karaoke_hoang_yen` (9,6 MB). Kết quả thô của lần 16:06 vẫn nằm trong `runner/work/79cba2da/jobs`.

## Đo Haiku và Sonnet trên 8 job tra bảng (2026-10-21)
Cùng 8 job Karaoke Hoàng Yến (A12-m10, m13, m15, m18; B12; B14 ×3; 104 dòng), cùng prompt, subagent trong app, 4 job song song. Token đọc từ transcript subagent (`~/.claude/projects/.../subagents/*.jsonl`, mỗi message lấy usage lớn nhất). USD quy đổi theo giá API Haiku $1/$5, Sonnet $3/$15 mỗi triệu token (input/output; cache ghi ×1,25, cache đọc ×0,1); giá của bản 5.5 chưa kiểm lại.

| | Haiku | Sonnet |
|---|---|---|
| Tổng token | 5,73 triệu | 2,62 triệu |
| trong đó cache đọc | 4,51 triệu | 2,06 triệu |
| output (gồm suy nghĩ) | 350 nghìn | 110 nghìn |
| Số lượt gọi model | 84 | 62 |
| Quy đổi USD | 3,29 | 3,93 |
| Tổng thời gian chạy (cộng 8 job) | 1.562 s | 806 s |
| Khớp kết luận với lần chạy cũ | 83/104 (79%) | 90/104 (86%) |
| CHƯA ĐẠT | 5 (giữ 4/5 cũ, thêm B14#42) | 4 (giữ 2/5 cũ, thêm A12#61, A12#62) |
| ĐẠT / CẦN XÁC NHẬN | 12 / 32 | 17 / 24 |

Nhận xét: Haiku rẻ hơn khoảng 16% nhưng dùng gấp 2,2 lần token, chậm gấp 1,9 lần (nhiều lượt, suy nghĩ dài) và hay để CẦN XÁC NHẬN. Sonnet nhanh, gọn, khớp lần cũ hơn nhưng bỏ 2 CHƯA ĐẠT cũ về bình chữa cháy (nhà ở thiếu bình, bình CO2 nơi có người: hạ xuống CẦN XÁC NHẬN). Chi phí chủ yếu là **cache đọc** (mỗi lượt đọc lại toàn bộ ngữ cảnh): giảm số lượt công cụ mới là đòn bẩy lớn nhất. Máy thiếu `pdftoppm` nên mọi agent đều thử mở PDF rồi thất bại, tốn thêm lượt.
Kết quả: `ket_qua/karaoke_haiku/`, `ket_qua/karaoke_sonnet/` (không commit).
