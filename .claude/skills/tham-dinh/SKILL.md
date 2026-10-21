---
name: tham-dinh
description: Thẩm định hồ sơ thiết kế PCCC từ file PDF hoàn toàn trong Claude Code - đọc hồ sơ, chọn bảng đối chiếu, chạy agent từng hạng mục (18 mục + bảng hệ thống), rà soát, gộp kết quả. Dùng khi người dùng gõ /tham-dinh <pdf…> hoặc nhờ thẩm định bản vẽ PCCC.
---
# /tham-dinh <pdf1> [pdf2…] [--huong-dan] [--bang Bxx]
Điều phối. Mỗi bước nặng giao cho subagent `pccc-*` (sinh từ `shared/src/agents.ts`). Thiếu dữ liệu thì CẦN XÁC NHẬN và chạy tiếp, không dừng hỏi.
**Tiết kiệm token:** phiên điều phối chỉ chạy lệnh CLI và giao việc; KHÔNG tự mở bản vẽ, `chu/`, file tri thức hay JSON job (chỉ đếm/kiểm file tồn tại). Mỗi subagent đã gắn model sonnet trong frontmatter; giữ nguyên, không ép model khác. Nên chạy phiên điều phối bằng Sonnet.
Lệnh CLI: `npm -w runner run cli -- <lệnh> …` (đường dẫn tính từ gốc repo). Đặt `<ra>` = `ket_qua/<tên_ngắn_không_dấu>`.

1. **Chuẩn bị**: `npm -w runner run cli -- chuan-bi <ra> "<pdf1>" "<pdf2>"` → `<ra>/ban_ve.pdf`, `<ra>/chu/trang_N.txt`, `<ra>/prompt_doc_ho_so.md`.
2. **Đọc hồ sơ**: subagent `pccc-doc-ho-so`, giao: "Đọc <ra>/prompt_doc_ho_so.md, làm theo, ghi JSON vào <ra>/thong_tin.json". Xem nhanh thong_tin.json (công năng, A03 chiều cao PCCC, he_thong); nếu sai rõ ràng thì sửa và ghi trạng thái "user".
3. **Lập job**: `npm -w runner run cli -- jobs <ra> [--huong-dan] [--bang Axx] [--he-thong B1,B6]` → in danh sách job, agent, file trả lời.
4. **Chạy job**: với mỗi job, subagent `pccc-<agent>` (đúng tên in ra), giao: "Đọc <ra>/jobs/<id>.md, làm theo, ghi JSON vào <ra>/jobs/<id>.json". Chạy song song tối đa 4 subagent một lượt. Job có sẵn file .json hợp lệ thì bỏ qua (chạy tiếp được sau khi gián đoạn).
5. **Rà soát**: `npm -w runner run cli -- ra-soat <ra>` rồi subagent `pccc-ra-soat`: "Đọc <ra>/prompt_ra_soat.md, ghi JSON vào <ra>/ra_soat.json".
5b. **Hướng dẫn** (chỉ khi có `--huong-dan`): `npm -w runner run cli -- huong-dan <ra>` rồi subagent `pccc-huong-dan`: "Đọc <ra>/prompt_huong_dan.md, ghi JSON vào <ra>/huong_dan.json". Hướng dẫn cho người thiết kế (bổ sung đường thoát nạn, bề rộng thoát nạn, ghi chú còn thiếu…) hiện trong comment bản vẽ, dưới phần ghi chú của khung.
6. **Gộp**: `npm -w runner run cli -- gop <ra>` → `<ra>/ket_qua.json`, `<ra>/tom_tat.md`. Job lỗi được liệt kê: chạy lại bước 4 cho job đó rồi gộp lại.
7. **Báo cáo** ngắn cho người dùng: số dòng theo kết luận, các khung CHƯA ĐẠT, đường dẫn tom_tat.md. Để có PDF ghi chú và Word theo mẫu: mở website, nạp lại PDF gốc và `ket_qua.json` (bước 1 → "Đã có kết quả?") rồi tải ở bước 5.
