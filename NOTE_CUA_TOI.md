# Note của tôi – vào dự án nhanh
File này Claude cập nhật. Mỗi lần tôi bảo "cập nhật từ github", Claude báo đã ghi gì mới ở đây, ở `TIEN_DO.md` và `BAT_DAU_PHIEN_MOI.md`. Gần hết usage thì Claude ghi xong việc đã làm vào ba file này rồi mới đẩy TOÀN BỘ code lên GitHub (trừ `ket_qua/`).

## Việc đang theo dõi
1. Test Gemini thay Claude phần Mục 4 (bãi đỗ xe chữa cháy): tạm thấy ổn, nhưng CHƯA thay, để từ từ thay luôn. Khi nào tôi bảo mới chuyển; trước đó dự án chính vẫn chạy Claude.
2. Bán kính quay xe chữa cháy ở bãi quay xe (neo lại, chưa làm): thử mô phỏng với xe giả định dài 7 m, rộng 2,5 m, cơ sở bánh 4,5 m, bán kính quay tâm trục sau 7 m thì không tìm ra cách quay đầu trong tam giác 7x7x7 m (tìm ngẫu nhiên, chưa chứng minh tuyệt đối). Cần số xe chữa cháy thật của PCCC địa phương (dài, rộng, bán kính quay) mới vẽ lại quỹ đạo; hoặc thử bãi lớn hơn theo quy định cũ (vuông 12 m, tròn 10 m). Hình tham khảo: `ket_qua/cong_trinh_test/minh_hoa_quay_xe_v2.png`.
3. **Lần sau: vẽ hướng dẫn lên bản vẽ cho bot chat mục 7.** Hôm nay mới làm sơ bộ con bot (chat Claude/Gemini, khoanh khung đề xuất, kéo thả PDF); chưa hướng dẫn kỹ bằng cách vẽ lên bản vẽ (bãi đỗ, làn xe, bãi quay xe, tuyến thoát nạn góc vuông ghi L từng đoạn, chú giải, khung tính toán). Hãy cố vẽ vào lần sau. Sau đó làm báo cáo khảo sát và báo giá dựa trên bot.
4. **Định nghĩa lại buồng thang xoắn và thang rẽ quạt bằng hình ảnh và mô tả** (chưa làm). Hiện `skills/MOD_cau_thang_buong_thang.md` (3.4.4) chỉ có điều kiện bằng chữ về thang cong, bậc chéo, rẻ quạt; cần bổ sung phần định nghĩa nhận dạng trên bản vẽ (hình minh hoạ + mô tả): thế nào là thang xoắn, thế nào là thang rẽ quạt, khác thang 2 vế thường ra sao, rồi nối vào Bài học 26 (xét từng thang trước khi đếm lối thoát nạn). Lần sau: người dùng đưa hình, Claude viết định nghĩa vào skill và `dinh-nghia`.

## Chạy dự án
- Bấm đúp `chay.bat` → http://127.0.0.1:8787 (runner + web trong một). Web ra bản mới sau `npm run build`, runner phải bật lại sau khi sửa `runner/`.
- Kéo code từ GitHub: bảo Claude "cập nhật từ github" (hoặc `bash scripts/cap_nhat_github.sh`).
- Xem kết quả có bản vẽ: web → bước 1 → "Đã có kết quả?" → chọn `ket_qua.json` (web tự tìm PDF theo tên công trình; tên trong JSON phải khớp tên file PDF).

## Quy tắc làm việc
- **Dự án chính = Claude** (`/tham-dinh`, `cli chay --engine claude`). Gemini chỉ là dự án thử các skill: chỉ chạy khi tôi nói "dùng Gemini".
- Agent thử Gemini: `npm -w runner run thu-gemini-m04 -- ket_qua/<ten> --gioi-han 1000000`. Cookie ở `runner/gemini_cookies.json` (không commit). Bị CAPTCHA thì `npm -w runner run gemini-login`, tự xác minh trong cửa sổ hiện ra.
- Kiến thức dạy agent: `knowledge/bai-hoc.md` + `luu_y` trong `shared/src/agents.ts` (sửa xong chạy `npm run gen:claude`). Dùng chung Claude và Gemini.
- Bí mật không commit: cookie, token, key, `runner/.profile*/`.

## Đã dạy agent (Mục 4 – đường, bãi đỗ xe chữa cháy)
- Nhãn trong ngoặc ở tên bãi: đối chiếu với dim cạnh hình để biết là nhà hay bãi. Cự ly bãi–tường đọc từ nhãn nhỏ (VD 2000, 5385). Nhà <12 m: ≤5 m, 12–28 m: ≤8 m, >28 m: ≤10 m.
- Được cộng dồn nhiều bãi; mỗi bãi ≥15 m dài, ≥3,5 m rộng.
- Đọc hết bảng thống kê (chiều cao PCCC, nhóm nhà, bậc chịu lửa) trên mặt bằng tổng thể.
- Xưởng hay nhà phố; bãi/đường trong công trình hay ngoài đường lộ. Chỉ trong công trình mới xét bãi quay xe, đoạn tránh xe.

## Ghi chú theo ngày (Claude thêm mỗi phiên, mới nhất ở trên)
### 2026-10-26
- **Tự học tài liệu (việc lớn trong ngày):** sổ tài liệu nằm trong thư mục học tập (`_PCCC_so_hoc.json`), checklist `_CHECKLIST_TAI_LIEU.md` (ngày cập nhật, loại, tính năng, ghi chú thay thế); trùng tên/số hiệu thì loại, văn bản thay thế/sửa đổi thì thay tại dòng cũ. Đã chuyển 50 file cũ sang sổ không tốn token.
- **Kho khái niệm:** mỗi khái niệm có định nghĩa, cách xác định, khi nào áp dụng/không, yêu cầu, cách kiểm, dễ nhầm, liên quan. Rút sâu 45 file + học nốt khái niệm còn thiếu: 378 thẻ (`knowledge/hoc/khai-niem/`). Thử với "sảnh thông tầng": có đủ định nghĩa và yêu cầu.
- **Hợp nhất văn bản:** Word gạch ngang chỉ lấy phần mới (QCVN 06 + SĐ1:2023 → `knowledge/hoc/hop-nhat/qcvn-6.md`); văn bản sửa đổi bằng chữ tự gộp đúng điều/khoản (chưa chạy thật, mới có test).
- **Kho toàn văn** 48 tài liệu để tra (`runner/cache/van_ban`); 5 file scan không đọc được (NĐ 105, TT 103, TCVN 13581, SP241, TCVN 14496), cần OCR.
- **Agent mới:** `pccc-hoi-dap` (trả lời dứt khoát, có điều khoản), skill `pccc-dieu-phoi` (Claude chính điều phối), skill `phan-tich-ban-ve` (PDF → xác định loại hạng mục → kiểm → giải pháp; chưa chạy thử bản vẽ thật).
- **Sơ bộ PCCC khách sạn Hoàng Hùng (bản KT 06/2025):** bảng thông tin, bãi xe chữa cháy 6×20 m phía Tây, thoát nạn tầng 3, lối ra BTB1 qua bếp, buồng thang phải là N1/N2 (>28 m). Hồ sơ `ket_qua/hoang_hung_so_bo2/` (không lên GitHub).
- **Bạn dạy hôm nay (đã ghi Bài học 27):** (1) "nhà hỗn hợp" chỉ khi mỗi công năng ≤ 70% sàn, không phải cứ nhiều công năng; (2) luôn nêu căn cứ diện thẩm định (Phụ lục III NĐ 105, khách sạn mục 7a); (3) hai nhánh: cơ quan xây dựng (Điều 6) = thẩm định về xây dựng, Công an (Điều 9) = thẩm định về PCCC, test thì làm cả hai; (4) phải tự xác định nhóm nhà F từ công năng để bắt lỗi người thiết kế, không bỏ trống nhóm; (5) hết usage thì ghi tiến độ, đẩy GitHub, reset tự chạy tiếp.
- **Xem thử hồ sơ nhà kho Liên Minh Xưởng 01 (14 trang):** thẩm duyệt điều chỉnh (đã có GCN 58/TD-PCCC, 248/TD-PCCC). Nhóm F5.2, hạng C3, 1.630,8 m². Tính lại đạt: thoát nạn, bãi xe 29 m. Lệch số liệu: diện tích 1.603,8 ≠ 1.630,8, số người 30 ≠ 10, hạng C ≠ C3, "phòng ngủ" trong kho. Khối tích: hình học ≈ 12.641 m³, người thiết kế 13.046 m³ (công thức mái chữ A). Chiều cao PCCC theo QCVN 06 = 4,0 m, người thiết kế ghi 7 m. Có ghi chú lên bản vẽ (ket_qua/lien_minh_xuong01/).
- **Bạn dạy thêm (Bài học 28–29):** khối tích mái chữ A = S x (cao mép + cao đỉnh)/2, kiểm chéo bằng hình học mặt cắt; xem hồ sơ phải xét đủ 8 nhóm (phân loại, khoảng cách PCCC, đường bãi, khoang cháy/ngăn cháy gian phòng, phương ngang/đứng, thoát nạn, thoát khói, hệ thống).
- Cập nhật sơ đồ: `so_do_quy_trinh_node.htm` thêm bước 9 (tự học) và 10 (hỏi đáp, điều phối); `so_do_cong_viec.htm` thêm bộ phận 7. Dữ liệu cũ của bạn được giữ, chỉ thêm mục mới.
- Đã đẩy GitHub 2 lần (commit 1ace89f, 3e47ba3). Chưa đẩy: bài học 27, sơ đồ, sơ bộ Hoàng Hùng (ket_qua không đẩy).
### 2026-10-24
- Làm tab 8 Báo cáo khảo sát + báo giá, nút Bắt đầu ở bước 1, Bài học 26 (đếm lối thoát nạn theo từng tầng và từng buồng thang), hai sơ đồ html tự lưu (công việc và node). Thử tư vấn + vẽ sơ bộ hồ sơ Hoàng Hùng (thư mục `ket_qua/hoang_hung_so_bo/`, hồ sơ khách nên không đẩy GitHub). Việc theo dõi mới: mục 4 ở trên (định nghĩa buồng thang xoắn, thang rẽ quạt bằng hình và mô tả).

### 2026-10-23
- Chiều tối: làm xong bản sơ bộ bot chat mục 7 (tab 7: chat Claude/Gemini/cả hai, kéo thả PDF, ô tích Khoanh đề xuất, form Bảng thông tin PCCC trong kiến thức bot), cột Ghi chú và kéo cột ở bước 5, engine mặc định Gemini web. Việc lần sau xem mục 3 ở "Việc đang theo dõi" (vẽ hướng dẫn lên bản vẽ). Chưa commit/push.
- Bài học 17–18 (Mục 4): đọc hatch + chú giải để xác định đường xe chữa cháy; bãi quay xe tam giác đều 7 m, vuông 12 m, tròn 10 m, chữ nhật 5x20 m (quy định cũ đã bị 6.4 hiện hành thay, dùng THAM KHẢO; nhỏ hơn thì CXN); làn 3,5 m là khoảng giữa hai nhãn 3500; cự ly mép bãi–tường đọc từ nhãn (4500 = 4,5 m); bãi đỗ chia nhiều bãi >=15 m cộng dồn đủ chu vi/6; bãi tránh xe chỉ khi đường một làn >=100 m.
- Hồ sơ test (`ket_qua/cong_trinh_test`, cao PCCC 11,5 m, chu vi 144 m, khối tích 16.105,7 m3): bãi đỗ yêu cầu >=24 m x 3,5 m. Thiết kế đề xuất `thiet_ke_bai_do_v3.png`: bãi Bắc 15 m (làn giữa hai hàng xe 40'', cách tường 4,5 m) + bãi Nam 15 m (cách tường 3,0 m), hai bãi quay xe tam giác 7 m ở hai góc phía tây, không cần bãi tránh xe.
- So Claude với Gemini trên hồ sơ test: khớp 12/14 dòng; Claude đọc nhãn nhỏ và hình học tốt hơn, Gemini khoanh vùng sai nhiều. Đã bỏ hướng Gemini cho việc khoanh.
- Sửa `runner/src/server.ts` (`/ban-ve`): web nạp lại bản vẽ khi mở kết quả JSON theo cả tên công trình trong `thong_tin.json` (trước chỉ theo `ten.txt`). Runner phải bật lại; chưa thử trên web.
- Chưa commit/push các thay đổi trên (chờ bạn bảo).
### 2026-10-22
- Tạo agent thử Gemini cho Mục 4 (10 tab ẩn, gói theo giới hạn token). Chạy thật hồ sơ Hoàng Hùng: 18/18 dòng, nhưng Gemini bỏ sót nhãn cự ly 2000/5385 và hay bị Google đòi CAPTCHA khi nhiều tab. Chưa so được với Claude vì chưa chạy Claude cùng hồ sơ.
- Khung vị trí đã sửa tay đúng toạ độ: `ket_qua/hoang_hung/gemini_m04/ket_qua_khoanh.json` (thư mục `ket_qua/` không lên GitHub).
- Web build lại (`web/dist` không nằm trong git: máy nào kéo code mới cũng phải `npm run build`).
- Runner tự học tự sửa `knowledge/hoc/*.md` khi bật: xem trước khi commit.

### 2026-10-27
- **Bạn dạy:** giáp ranh/khoảng cách PCCC (khoảng cách tính từ tường công trình, không phải ranh đất; kính cường lực ≥ 6 mm + sprinkler mới miễn E60), lối vào từ trên cao trên mặt đứng (ký hiệu + ghi chú + kích thước tối thiểu), QCVN 06 Điều 5 đã chuyển sang QCVN 10:2025, chống trùng lặp tri thức (mỗi quy tắc một file nguồn, agent chỉ giữ con trỏ). Chi tiết: `TIEN_DO.md` mục 2026-10-27.
- **Kiểm bảng tính thủy lực:** lỗi nặng ở nhánh phải, cộng áp họng vách tường, hệ số bơm; checklist ở `knowledge/kiem-bang-tinh-thuy-luc-7336.md`. Bạn tự chỉnh thiết kế (H13, số hàng); ô `#N/A` để trống là chủ ý.
- **Chưa làm:** skill tự kiểm bảng tính thủy lực, skill tính bể nước PCCC, gộp 2 cặp skill trùng. Sơ đồ đã cập nhật, đã đẩy GitHub (ket_qua không đẩy).
