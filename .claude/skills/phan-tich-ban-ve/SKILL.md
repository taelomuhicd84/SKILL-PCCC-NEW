---
name: phan-tich-ban-ve
description: Từ MỘT bản vẽ PDF, xác định các hạng mục PCCC cụ thể (vd. thang thoát nạn loại gì), kiểm tra đạt hay không bằng tri thức đã học, không đạt thì đưa giải pháp. Dùng khi người dùng đưa PDF bản vẽ và hỏi về một hạng mục (thang thoát nạn, cửa, hành lang, bãi xe chữa cháy…) hoặc muốn xác định + kết luận + giải pháp, không cần thẩm định cả hồ sơ.
---
# /phan-tich-ban-ve <pdf> [hạng mục…]
Claude chính điều phối; nối agent đọc hồ sơ → agent hạng mục → tri thức tự học (khái niệm, bản hợp nhất) → agent hướng dẫn giải pháp. Dùng chung CLI và agent với skill `tham-dinh` (xem `.claude/skills/tham-dinh/SKILL.md` cho lệnh CLI chi tiết); khác ở chỗ chỉ chạy các job của hạng mục được hỏi, và luôn kèm giải pháp. Không hỏi lại khi thiếu số liệu: ghi CẦN XÁC NHẬN rồi làm tiếp.

## Hạng mục → agent
| Hạng mục | Agent chính | Kèm |
|---|---|---|
| Thang thoát nạn, buồng thang, lối ra, hành lang, cửa thoát nạn, chiều rộng, khoảng cách | `pccc-m07-thoat-nan` | `pccc-m06-ngan-chay` (vách, cửa ngăn cháy buồng thang), `pccc-m09-chong-khoi` (tăng áp, hút khói buồng thang) |
| Thang máy chữa cháy | `pccc-m08-thang-may-cc` | |
| Đường, bãi đỗ xe chữa cháy, lối vào từ trên cao | `pccc-m04-giao-thong` | `pccc-so-bo-thiet-ke` nếu cần đề xuất vẽ |
| Khoảng cách, bậc chịu lửa, phân loại | `pccc-m03`, `pccc-m02`, `pccc-m01` | |
| Báo cháy, chữa cháy, đèn sự cố… | `pccc-m11`, `pccc-m12`, `pccc-m14`… | |
Không rõ hạng mục: hỏi `pccc-hoi-dap` hạng mục đó thuộc mục nào, hoặc chạy cả hồ sơ bằng `tham-dinh`.

## Quy trình
1. **Chuẩn bị + đọc hồ sơ** (bước 1–2 của `tham-dinh`): `chuan-bi`, subagent `pccc-doc-ho-so` → `<ra>/thong_tin.json` (chiều cao PCCC, nhóm nhà F, số tầng, công năng, hệ thống PCCC có/không).
2. **XÁC ĐỊNH**: giao `pccc-<agent chính>` kèm yêu cầu thêm: "Trước khi kết luận, liệt kê từng hạng mục tìm thấy trên bản vẽ (mã/tên, tầng, trang) và XÁC ĐỊNH LOẠI theo định nghĩa: thang thoát nạn là thang bộ trong nhà hay ngoài nhà, loại L1/L2/L3 hay buồng thang N1/N2/N3, có lấy sáng tự nhiên, có tăng áp, bề rộng vế, bề rộng chiếu nghỉ, chiếu nghỉ phẳng hay có bậc chéo/rẽ quạt/cong/xoắn (cắt phóng to bằng `scripts/cat_thang.py`, quy tắc `knowledge/nhan-dien-thang-thoat-nan.md`; bậc chéo ở nhà cao > 15 m thì không thoát nạn), độ dốc, số vế, cửa mở theo chiều thoát nạn; dùng `knowledge/hoc/hop-nhat/` và `knowledge/hoc/khai-niem/_theo_agent/<agent>.md` để biết tiêu chí." Việc tìm hạng mục và loại ghi vào JSON job.
3. **KIỂM TRA**: các dòng bảng của job cho kết luận ĐẠT / CHƯA ĐẠT / CẦN XÁC NHẬN, trích điều khoản (số hiệu, điều, khoản, hiệu lực). Job chạy bằng `jobs` + subagent như `tham-dinh`; chỉ lấy job của agent trong bảng trên (đọc `<ra>/jobs.json`).
4. **GIẢI PHÁP** (mọi dòng CHƯA ĐẠT, CẦN XÁC NHẬN): chạy `huong-dan` (bước 5b) và, cho mỗi hạng mục không đạt, hỏi `pccc-hoi-dap`: "Hạng mục <X> không đạt vì <Y> (Điều Z). Có những giải pháp nào theo quy chuẩn hiện hành để đạt? Mỗi giải pháp nêu điều kiện áp dụng, điều khoản, thay đổi bản vẽ cần làm." Giải pháp phải có căn cứ trong tri thức; không bịa. Ưu tiên giải pháp ít thay đổi kiến trúc nhất, nêu ảnh hưởng (diện tích, chi phí hệ thống kèm theo như tăng áp, sprinkler).
5. **Gộp + trả lời** (`gop`, rồi trả lời người dùng): bảng sau cho từng hạng mục.

| Hạng mục (vị trí) | Loại xác định | Yêu cầu (điều khoản) | Thực tế bản vẽ | Kết luận | Giải pháp nếu không đạt |
|---|---|---|---|---|---|

Kèm 3–5 dòng tóm tắt: số hạng mục đạt/không đạt, việc phải sửa trước, số liệu còn thiếu cần hỏi người thiết kế.

## Học ngược
Gặp khái niệm hoặc điều kiện chưa có trong kho (agent ghi "NÊN HỌC: …"): rút vào `knowledge/hoc/khai-niem/` từ toàn văn `runner/cache/van_ban/`, rồi chạy lại hạng mục đó.
