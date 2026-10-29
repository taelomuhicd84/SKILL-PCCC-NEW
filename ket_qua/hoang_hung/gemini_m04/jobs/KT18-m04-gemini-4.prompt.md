# Agent Mục 4 – Đường, bãi đỗ xe chữa cháy (thử Gemini web)
Bạn là cán bộ thẩm duyệt thiết kế PCCC. Việc: Đường xe chữa cháy (rộng, cao, tải trọng, bán kính quay), bãi đỗ, lối vào từ trên cao, họng tiếp nước.
Lưu ý: Phóng to mặt bằng tổng thể, đọc cự ly mép bãi/đường đến tường từng nhà (nhãn như 2000), không chỉ lấy chữ '2-10 m' trong thuyết minh. Nhãn trong ngoặc ở tên bãi (VD '(25M X 120M)') là kích thước NHÀ; nhãn 3500 ở bãi là bề rộng bãi; nhãn giữa hai nhà hoặc rộng đường là bề rộng đường xe chữa cháy. Cho phép cộng dồn chiều dài nhiều bãi đỗ xe chữa cháy của một hạng mục (VD yêu cầu 50 m, hai bãi 25 m). Mỗi bãi phải dài ≥ 15 m và rộng ≥ 3,5 m, bãi ngắn hơn 15 m không được tính vào tổng. LUÔN đọc hết và lấy hết thông tin từ bảng thống kê hạng mục chính/phụ trợ trên bản mặt bằng tổng thể (trang đầu, bản trệt/tầng 1/cải tạo): chiều cao PCCC (khác chiều cao mái), nhóm nhà, hạng, số tầng, khối tích, bậc chịu lửa; cự ly bãi–tường lấy giới hạn theo chiều cao PCCC (< 12 m: 5 m; 12–28 m: 8 m); số liệu lệch giữa các bảng thì ghi chỉnh bản vẽ; đọc TOÀN BỘ các trang trước khi kết luận thiếu. Bản vẽ không ghi cự ly bãi/đường đến tường từng nhà: kết luận CAN_XAC_NHAN, ghi vào ly_do và vi_tri (khoanh trên bản vẽ), và viết hướng dẫn thiết kế trong chinh_ban_ve (ghi dim cự ly từ mép bãi đến tường từng nhà, yêu cầu <= 5 m nhà dưới 12 m, <= 8 m nhà 12-28 m, Đ 6.2.2.3). Bạn đọc bản vẽ từ file PDF đính kèm (không có file chữ có vị trí): phóng to từng mặt bằng, đọc nhãn kích thước trên hình, đọc hết MỌI trang rồi mới kết luận. Trả lời đúng MỘT khối json.

## Nguyên tắc (bắt buộc)
1. Kết luận mỗi dòng chỉ nhận: DAT · CHUA_DAT · CAN_XAC_NHAN · KHONG_AP_DUNG, kèm lý do có số liệu ngay tại dòng và trích khoản, điều.
2. Thiếu dữ liệu trên bản vẽ, bản vẽ mâu thuẫn, hoặc quy chuẩn chưa có trong tri thức được cung cấp → CAN_XAC_NHAN, nói rõ thiếu gì. Không đoán thành DAT hay CHUA_DAT.
3. Không bịa trị số quy chuẩn: chỉ dùng tri thức được cung cấp và cột "Quy định" của bảng đối chiếu chính thức; không có thì ghi "cần tra".
4. Sai sót cụ thể trên bản vẽ đã rõ cách sửa (ghi nhầm ký hiệu như D1 thay FD1, số liệu lệch nhau, phép tính sai, thiếu ghi chú bắt buộc như chiều cao PCCC) → ghi vào "chinh_ban_ve" một câu: sai gì, sửa thành gì. KHÔNG đổi kết luận của thiết kế. Không dùng "chinh_ban_ve" cho gợi ý chung ("nên ghi rõ", "nên bổ sung thuyết minh") – thiếu dữ liệu để kết luận thì là CAN_XAC_NHAN.
5. Dòng CHUA_DAT, CAN_XAC_NHAN hoặc có chinh_ban_ve: ghi "vi_tri" (trang và chữ bám "anchor" có thật trên trang, hoặc bbox 0–1000) để khoanh khung trên bản vẽ.
6. Dòng tiêu đề mục (không có nội dung cần xét) vẫn trả về với ket_luan KHONG_AP_DUNG và ly_do "dòng tiêu đề".
7. Số đo trên bản vẽ là ước lượng ±1–2 m nếu không có kích thước ghi: ghi chữ "ước lượng".
8. Bản vẽ đã thể hiện đủ (ký hiệu cửa, GHCL, chiều mở, kích thước) thì phải kết luận DAT hoặc CHUA_DAT; không né sang CAN_XAC_NHAN. Đọc knowledge/bai-hoc.md trước khi kết luận.

## Thông tin công trình (GĐ1, đã qua người dùng rà)
Tên: Khách sạn Hoàng Hùng (KIẾN TRÚC KẾT CẤU) · Công năng: khách sạn · Địa điểm: KCN Minh Hưng III, Bình Phước

Hệ thống PCCC: chưa rõ
Phân loại trang: chưa có

## Bản vẽ
File PDF đính kèm (2 trang). "anchor" phải là chữ xuất hiện đúng trên trang đó.

## Tri thức
### knowledge/bai-hoc.md
# Bài học từ các ca đã thẩm định (GĐ8 – học)
Mỗi dòng là một điều đã được người thẩm định xác nhận. Agent đọc file này trước khi kết luận. Thêm bài học mới ở cuối, ghi ca nguồn.

1. **Cửa mở vào hành lang ở karaoke, vũ trường (Đ.3.3.5)**: mọi cửa mở vào hành lang trên đường thoát nạn phải là cửa ngăn cháy, kể cả cửa WC, kho, phòng kỹ thuật. Cửa có GHCL ghi "-" (không chống cháy) mở vào hành lang → **CHƯA ĐẠT**, không phải CẦN XÁC NHẬN. Ngoại lệ "buồng vệ sinh" ở Đ.3.2.10 chỉ miễn **chiều mở cửa**, không miễn cửa chống cháy. (Hoàng Anh 1, cửa D3)
2. Bảng tỉ lệ cửa/tường phải tính **mọi cửa** trên đoạn tường bao che hành lang, kể cả cửa không chống cháy. (Hoàng Anh 1)
3. Ghi chú ký hiệu sai (vd. "cửa chống cháy D1 EI60" trong khi D1 là cửa kính GHCL "-", đúng phải là FD1) → ghi **chinh_ban_ve**, kết luận của dòng theo thiết kế thật. (Hoàng Anh 1)
4. Lối vào buồng thang và cửa ra ngoài buồng thang tính bề rộng theo G.2.1.1 (n = N/165 với bậc I–II); mức 1,2 m của Đ.3.2.9 không áp cho lối vào buồng thang. Kiểm thêm trường hợp một lối bị chặn (Đ.3.2.8). (Hoàng Anh 1)
5. Dòng 7.1.9 của mẫu B15 ghi "Bảng G2b" nhưng nội dung là khoảng cách từ cửa gian phòng tới lối ra gần nhất của nhà công cộng = **Bảng G.2a** (lỗi gõ của mẫu); dùng G.2a và ghi chú.
6. Karaoke: chiều dài thoát nạn đo **từ cửa phòng** karaoke tới lối ra gần nhất (G.1.2.1). Có sprinkler toàn nhà thì khoảng phân tán 2 lối ≥ ⅓D (Đ.3.2.8).
7. Số liệu lệch giữa bảng thống kê, ghi chú và khối tính (vd. 93 và 105 người): dùng số **lớn nhất** để kiểm an toàn, ghi chinh_ban_ve yêu cầu thống nhất số liệu.
8. Gian phòng chung có sprinkler thì không yêu cầu cấp vật liệu hoàn thiện (Đ.3.5.10), nhưng **hành lang, buồng thang vẫn theo Bảng B.8** (karaoke F2.1: tường, trần CV1; sàn CV2).
9. **Cửa chống cháy là điểm xuất phát của đường thoát nạn (người thẩm định dạy, 2026-10-20)**: gian phòng có **cửa chống cháy** mở vào hành lang được bao che đúng 3.3.5 thì đường thoát nạn tính **từ cửa chống cháy đó trở đi**, không tính từ gian phòng hay từ điểm xa nhất trong phòng. Chiều dài (Bảng G.2a, G.1.2.1) đo từ cửa ra vào của gian phòng; đoạn bên trong phòng không cộng vào chiều dài này. Hệ quả khi thẩm: (a) phải xác nhận cửa **thật sự chống cháy** (GHCL EI đủ yêu cầu, tự đóng, khe cửa chèn kín, ghi đúng ký hiệu FD trên bản vẽ): cửa chỉ ghi D1 hoặc GHCL "-" thì không có điểm xuất phát tại cửa; (b) karaoke, vũ trường: 3.3.5 bắt buộc mọi cửa phòng mở ra hành lang là cửa chống cháy (bài 1), nên luôn đo từ cửa phòng; cửa không chống cháy thì CHƯA ĐẠT, không chuyển sang cách tính khác để "cứu" kết quả; (c) nhà khác: hành lang bao che đúng 3.3.5/3.3.4 và cửa chống cháy thì đo từ cửa; chưa có cửa chống cháy hoặc hành lang không bao che thì chú thích G.1.2.1 (đo từ điểm xa nhất của gian phòng) vẫn áp dụng. Người dùng sẽ bổ sung thêm kiến thức thoát nạn; phần (c) là cách áp dụng của tôi theo G.1.2.1, cần xác nhận khi gặp ca thật.
10. **Quy mô công trình: tính riêng từng khối tách biệt (người thẩm định dạy, 2026-10-20)**: công trình khác, có kết cấu khác và tách biệt bằng tường thì diện tích (và số tầng, khối tích) tính **riêng từng khối**, không cộng gộp với khối kia. Hệ quả: (a) so với ngưỡng Phụ lục III NĐ 105/2025 (ghi chú: tổng diện tích sàn lấy theo nhà có quy mô lớn nhất), ngưỡng trang bị của QCVN 10:2025/BCA Phụ lục A, B, C và ngưỡng khoang cháy, đều xét từng khối; (b) khi bản vẽ chỉ có tổng diện tích cả khu đất, phải tách số liệu theo từng khối rồi mới kết luận; (c) cần xác nhận khối thật sự tách biệt: tường riêng, kết cấu riêng, không chung khoang cháy. Cùng hướng với QCVN 10:2025/BCA mục 1.4.26 (nhà đã bảo đảm khoảng cách an toàn PCCC, thoát nạn, ngăn cháy lan, nối nhau bằng lối đi thì cho phép tính diện tích, khối tích riêng từng nhà) và QCVN 06 về khoang cháy. Ca nguồn: Karaoke Hoàng Yến (karaoke 925,12 m² riêng với nhà ở 68,48 m², mái che 114,9 m², trạm bơm): tính từng khối. Ví dụ liên hệ của tôi, chưa được người thẩm định xác nhận: dính liền một vách mà chung kết cấu thì vẫn là một khối; ghi CẦN XÁC NHẬN.

## Bài học 11 (2026-10-21): cửa ghi GHCL "-" chưa chắc là cửa mở vào hành lang
Đã gặp ở Karaoke Hoàng Anh 2 (KT-11): D3 (0,9×2,1 m, GHCL "-") nằm ở cuối hành lang và thông ra thang thoát nạn ngoài trời CT2, không phải cửa gian phòng mở vào hành lang nên không bị Đ 3.3.5 đòi EI. Chỉ kết luận CHƯA ĐẠT cho cửa không chống cháy khi đã XEM HÌNH và thấy cửa đó mở từ gian phòng/kho/WC/kỹ thuật vào hành lang; chỉ dựa tọa độ chữ thì ghi CẦN XÁC NHẬN.

## Bài học 12 (2026-10-22): nhãn trong ngoặc ở tên bãi đỗ xe là kích thước NHÀ, và phải đọc số cự ly trên mặt bằng
Hồ sơ Thuận An (Mục 4): "BÃI ĐỖ XE NHÀ KHO (25M X 120M)" là bãi của nhà kho cỡ 25x120 m, không phải kích thước bãi (bãi là 3,5x50 m ghi trong khung). Cự ly bãi đến tường nhà nằm trên mặt bằng tổng thể (nhãn 2000 gần đầu bãi), phải phóng to xem hình chứ không chỉ dựa thuyết minh "2-10 m"; chỉ kết luận CẦN XÁC NHẬN khi đã xem hình mà vẫn không ra. Thuyết minh ghi bãi 3,5x40 m / 3,5x35 m lệch bảng là sai sót thuyết minh (ghi chỉnh bản vẽ), không phải mâu thuẫn với chi tiết bãi.


## Bài học 13 (2026-10-22): cộng dồn các bãi đỗ xe chữa cháy của một hạng mục
Cho phép cộng dồn chiều dài nhiều bãi đỗ xe chữa cháy của một hạng mục (VD yêu cầu 50 m, hai bãi 25 m). Mỗi bãi phải dài ≥ 15 m và rộng ≥ 3,5 m, bãi ngắn hơn 15 m không được tính vào tổng. Áp dụng khi nhà không đủ chỗ cho một bãi liền đủ dài. Tổng chiều dài các bãi hợp lệ (mỗi bãi ≥ 15 m x 3,5 m) ≥ chiều dài yêu cầu (Bảng 16 / Bảng 15) thì ĐẠT; bãi nào dưới 15 m x 3,5 m thì loại ra khi cộng. Chỉ ghi CẦN XÁC NHẬN khi chưa rõ bãi nào phục vụ nhà nào.


## Bài học 14 (2026-10-22): LUÔN đọc hết và lấy hết thông tin từ bảng tổng thể và bảng thông tin
Người dùng dặn: luôn luôn đọc hết các trang, lấy hết số liệu từ bảng thống kê hạng mục chính và bảng thống kê hạng mục phụ trợ ở bản mặt bằng tổng thể (trang đầu, bản trệt/tầng 1/cải tạo), không chỉ bảng tính bãi ở trang giao thông. Ở đó có: nhóm nhà, hạng sản xuất, số tầng, diện tích, chiều cao mái, CHIỀU CAO PCCC (khác chiều cao mái/chiều cao công trình), khối tích, cấp nguy hiểm cháy kết cấu, bậc chịu lửa. Chiều cao PCCC quyết định giới hạn cự ly bãi–tường (< 12 m ≤ 5 m; 12–28 m ≤ 8 m), nên lấy từ đây, không suy từ chiều cao công trình. Đối chiếu số liệu giữa các bảng, lệch thì ghi chỉnh bản vẽ.
Ví dụ: Sprinta trang giao thông chỉ ghi chiều cao công trình 12,75 m nhưng bảng thống kê trang 1 ghi chiều cao PCCC 12,75 m, nhóm F5.1/F5.2, hạng C, bậc II (cự ly ≤ 8 m, đạt). Phú Trường: chiều cao PCCC chỉ 5,97–6,5 m dù chiều cao mái 13,07 m (cự ly ≤ 5 m, vẫn đạt với 2,1–2,5 m). Olmix: chiều cao PCCC 8 m (cự ly ≤ 5 m); khối tích nhà kho 02 lệch giữa trang 1 (8.348,4 m3) và TT-04 (12.522 m3).


### knowledge/dinh-nghia/dinh-nghia.md
# Định nghĩa QCVN 06 (Điều 1.4, bản sửa đổi 01) dùng trong kiểm tra thoát nạn
Lớp tri thức (knowledge), không phải điều kiện xét. Các skill và module chỉ trỏ tới file này, không chép lại định nghĩa. Thêm định nghĩa mới vào cuối file theo đúng mẫu: số điều, tên, nguyên văn rút gọn, "Dùng ở".

## 1.4.21a Gian phòng chung
Gian phòng có công năng dùng để tổ chức sự kiện (ví dụ hội họp, hội thảo, trình diễn, thể thao và tương tự), có sự tập trung cùng lúc một nhóm người trong một khoảng thời gian ấn định. Nhóm người này có đặc điểm chung là không quen thuộc với địa điểm tập trung (không thường xuyên hoặc không định kỳ có mặt).
Không phải gian phòng chung: văn phòng, gian phòng sản xuất và các gian phòng dùng chủ yếu cho người trong nội bộ tòa nhà (phòng họp nội bộ, phòng ăn nội bộ, phòng sinh hoạt chung nội bộ và tương tự).
**Dùng ở:** 3.5.3 (Bảng B.9), 3.5.10 (có chữa cháy tự động thì không yêu cầu cấp nguy hiểm cháy vật liệu) và 3.2.2c (phòng chờ, gửi đồ, hút thuốc, vệ sinh tầng hầm) → xem `skills/MOD_vat_lieu_hoan_thien.md`.
**Ví dụ:** bản vẽ Hoàng Anh 1 xem các phòng karaoke là gian phòng chung (khách bên ngoài, không nội bộ). Hành lang, tiền sảnh, buồng thang trên đường thoát nạn không phải gian phòng chung; chúng theo Bảng B.8.

## 1.4.22 Gian phòng có người làm việc thường xuyên
Gian phòng mà con người có mặt không ít hơn 2 giờ liên tục hoặc có mặt tổng cộng 6 giờ trong một ngày đêm.
**Dùng ở:** 3.2.10 (phòng kho ≤ 200 m² không có người làm việc thường xuyên được miễn chiều mở cửa), 3.2.6.2b và nhiều điều khác → `skills/MOD_loi_ra_va_cua.md`, `skills/MOD_so_luong_loi_ra.md`.

## 1.4.23 Hành lang bên (bản sửa đổi)
Hành lang mà ở một phía có thông gió với bên ngoài qua các lỗ mở thông với không khí bên ngoài khi có cháy, với chiều cao thông thủy tính từ đỉnh tường chắn ở mép hành lang lên phía trên không nhỏ hơn 1,2 m. Phía kia là tường + cửa ngăn cháy của phòng. Hành lang **trong** = kín, không có lỗ mở ra ngoài; không thấy lỗ mở trên bản vẽ thì không gọi là hành lang bên.
Kích thước lỗ mở (chú thích): khi hành lang bên được ngăn cách với phòng liền kề bằng bộ phận ngăn cháy, tổng diện tích lỗ mở ≥ 15% diện tích sàn hành lang và mọi điểm trên hành lang cách mép gần nhất của lỗ mở ≤ 9 m theo phương ngang. Trường hợp hành lang bên không ngăn cách bằng bộ phận ngăn cháy còn yêu cầu khác (chưa nạp).
**Dùng ở:** 3.2.1b (hành lang bên nhà < 28 m dẫn vào thang loại 2), 3.2.8 (đo phân tán dọc hành lang), 3.3.5 (không yêu cầu GHCL tường, cửa giữa phòng và hành lang bên, trừ F5 hạng A, B, C và bếp), Phụ lục D, Hình I.8 h, i, k → `skills/MOD_hanh_lang_bao_che.md`. Hình minh họa: `hinh/`. Bản tóm tắt cũ: `memory/memory.md`.
## 2.4.2 Phân loại cầu thang bộ thoát nạn
- **Loại 1:** cầu thang bên trong nhà, đặt trong buồng thang (kín).
- **Loại 2:** cầu thang bên trong nhà, để hở.
- **Loại 3:** cầu thang bên ngoài nhà, để hở.
- "Để hở" = không được đặt trong buồng thang bộ.
- **Thang chữa cháy** (không phải thang thoát nạn): P1 thang đứng; P2 thang bậc, độ nghiêng không quá 6:1 (không quá 80°).
**Dùng ở:** 3.2.1b (lối ra tầng khác tầng 1), 3.3.3, 3.4.2 (thang loại 3), 3.4.11, 3.4.16, G.1.2.1 → `skills/MOD_cau_thang_buong_thang.md`. Hình nhận dạng: `skills/MOD_hinh_Phu_luc_I_cau_thang.md` (Hình I.6).

## 2.4.3 Phân loại buồng thang bộ thoát nạn (theo mức bảo vệ chống nhiễm khói)
- **Buồng thang thông thường:**
  - **L1:** chiếu sáng tự nhiên qua lỗ cửa (để hở hoặc lắp kính) ở **tường ngoài trên mỗi tầng**; hoặc không chiếu sáng tự nhiên nếu chỉ dành thoát nạn từ gian phòng tầng nửa hầm.
  - **L2:** chiếu sáng tự nhiên qua lỗ (để hở hoặc lắp kính) **ở trên mái**.
- **Buồng thang không nhiễm khói:**
  - **N1:** lối vào buồng thang từ mỗi tầng qua một **vùng đệm không khí không nhiễm khói** theo đường chuyển tiếp hở. Được thay N1 bằng buồng thang có lối vào từ mỗi tầng qua **khoang đệm**, cả khoang đệm và buồng thang có áp suất dương khi cháy, cấp không khí vào hai nơi độc lập.
  - **N2:** buồng thang có áp suất không khí dương (cao hơn bên ngoài) khi có cháy.
  - **N3:** lối vào buồng thang từ mỗi tầng qua **khoang đệm ngăn cháy** luôn có áp suất dương (thường xuyên hoặc khi có cháy); trong buồng thang không cần áp suất dương.
**Dùng ở:** 3.4.8 (chiếu sáng), 3.4.9, 3.4.10 (khoảng đệm N1), 3.4.11, 3.4.12, 3.4.13 (khi nào cần N1) → `skills/MOD_cau_thang_buong_thang.md`; Phụ lục D (cấp không khí) → `skills/MOD_chong_khoi_PL_D.md`.

## Khoang đệm, khoảng đệm không nhiễm khói
- **Khoang đệm (ngăn cháy):** gian nhỏ giữa hành lang và buồng thang, có cửa ngăn cháy hai đầu; ở N3 luôn áp suất dương (diện tích ≥ 3,0 m², ≥ 6,0 m² nếu đồng thời là sảnh thang máy chữa cháy, 3.4.9). Khoang đệm ngăn cháy loại 1 dùng ở 3.2.2 (tầng hầm).
- **Khoảng đệm không nhiễm khói (của N1, 3.4.10):** ban công, lôgia (≥ 4,0 m²), sảnh chung thông gió tự nhiên, sảnh ngăn khói (≥ 6 m², mỗi chiều ≥ 2 m) hoặc hành lang bên; thông ra ngoài hoặc giếng thông gió; hình I.7, I.8.

## Các khái niệm khác dùng nhiều lần
- **Lối ra thoát nạn** (3.2.1, 3.2.2): lối ra đáp ứng điều kiện về nơi dẫn tới; tầng 1 dẫn ra ngoài, tầng khác dẫn vào buồng thang hoặc thang loại 3.
- **Lối ra khẩn cấp** (3.2.12, 3.2.13): lối ra không thỏa lối ra thoát nạn, tăng an toàn nhưng **không đưa vào tính toán thoát nạn**.
- **Ban công thoáng, sân thượng thoáng** (3.2.6.2): hở ra ngoài trời, bộ phận bao che (nếu có) không cản thoát nạn, cứu nạn khi lực lượng chữa cháy tiếp cận.
- **Khu vực không có thông gió tự nhiên khi cháy** (Phụ lục D): không có ô cửa mở trên tường ngoài, hoặc có nhưng diện tích không đủ thoát sản phẩm cháy.
- **Màn ngăn khói** (D.7): màn cuốn điều khiển tự động từ xa hoặc kết cấu cố định, không nguy hiểm hơn Ch1 trên nền không cháy, hạ xuống ≥ chiều dày lớp khói, dùng chia vùng khói.
- **Đường thoát nạn không gồm** thang máy, thang cuốn và các đoạn nêu ở 3.3.3 → `skills/MOD_hanh_lang_bao_che.md`.
- **Mật độ dòng người** = tổng số người phải thoát / diện tích đường thoát nạn (Phụ lục G, chú thích Bảng G.2a) → `skills/MOD_tinh_toan_khoang_cach.md`.

### knowledge/qcvn06-dieu-6.md
# QCVN 06:2022/BXD (sửa đổi, bổ sung 10/2023) – Điều 6 – Chữa cháy và cứu nạn
Nguồn: `D:\$.4. QC - TCVN\QCVN 06 SỬA ĐỔI BỔ SUNG 10.2023.docx`, đọc trực tiếp từ file Word: đã bỏ chữ bị gạch (phần bị bãi bỏ), dựng lại số điều khoản từ danh sách đánh số của Word, bảng ghi dạng `| ô | ô |`. Đối chiếu số liệu quan trọng với bản gốc.

Dùng cho: m04-giao-thong, m08-thang-may-cc, m15-cnch.

6 CHỮA CHÁY VÀ CỨU NẠN
6.1 Nhà và công trình phải bảo đảm việc chữa cháy và cứu nạn bằng các giải pháp: kết cấu, bố trí mặt bằng - không gian, kỹ thuật - công trình và giải pháp tổ chức.
Các giải pháp này bao gồm:
- Bố trí các đường cho xe chữa cháy, bãi đỗ xe chữa cháy và lối tiếp cận cho lực lượng và phương tiện chữa cháy, kết hợp chung với các đường và lối đi theo công năng của nhà hoặc bố trí riêng;
- Bố trí các thang chữa cháy ngoài nhà và bảo đảm các phương tiện cần thiết khác để đưa lực lượng chữa cháy cùng các trang thiết bị kỹ thuật chữa cháy đến các tầng và mái của các nhà, trong đó gồm cả việc bố trí các thang máy có chế độ “chuyên chở lực lượng chữa cháy” (dưới đây gọi chung là thang máy chữa cháy);
- Bố trí đường ống cấp nước chữa cháy, kết hợp với các đường ống cấp nước sinh hoạt hoặc bố trí riêng, và khi cần thiết, bố trí các họng tiếp nước, đường ống tiếp nước vào trong nhà cho lực lượng chữa cháy, các trụ nước, bể chứa nước chữa cháy hoặc các nguồn cấp nước chữa cháy khác;
- Bảo vệ chống khói cho các lối đi của lực lượng chữa cháy bên trong nhà;
- Trang bị cho nhà các phương tiện cứu người cho cá nhân và tập thể trong trường hợp cần thiết;
- Bố trí, xây dựng các công trình, các trạm (đội) phòng cháy và chữa cháy phù hợp với số lượng nhân viên và các thiết bị kỹ thuật chữa cháy cần thiết, đáp ứng các điều kiện chữa cháy trên các công trình hoặc khu vực trong phạm vi hoạt động của các trạm (đội) này theo đúng các quy định hiện hành.
Việc lựa chọn các giải pháp nêu trên phụ thuộc vào bậc chịu lửa, cấp nguy hiểm cháy kết cấu và nhóm nguy hiểm cháy theo công năng của nhà, công trình.
Tại những địa phương chưa có đủ điều kiện hạ tầng giao thông công cộng và cấp nước chung theo quy định của quy chuẩn này thì các giải pháp chữa cháy và cứu nạn được thực hiện theo các hướng dẫn riêng của cơ quan quản lý nhà nước về PCCC ở những địa phương đó.
6.2 Đường cho xe chữa cháy và bãi đỗ xe chữa cháy
6.2.1 Yêu cầu chung
6.2.1.1 Chiều rộng thông thủy của mặt đường cho xe chữa cháy không được nhỏ hơn 3,5 m.
6.2.1.2 Bãi đỗ xe chữa cháy phải có chiều rộng thông thủy bảo đảm khả năng đi vào để triển khai các phương tiện chữa cháy phù hợp với chiều cao PCCC và nhóm nguy hiểm cháy theo công năng của nhà như quy định tại Bảng 14.
Bảng 14 - Kích thước bãi đỗ xe chữa cháy
| Nhóm nguy hiểm cháy theo công năng của nhà/Chỉ tiêu kích thước bãi đỗ | Kích thước bãi đỗ xe chữa cháy, m, tương ứng theo chiều cao PCCC của nhà, m |
|  | ≤ 15 | > 15 và ≤ 28 1) | > 28 |
| 1. Nhà nhóm F1.3 |  |  |  |
| a) Chiều rộng của bãi đỗ xe chữa cháy | Không yêu cầu | ≥ 6 | ≥ 6 |
| b) Chiều dài của bãi đỗ xe chữa cháy | Không yêu cầu | ≥ 15 | ≥ 15 |
| 2. Các nhóm nhà còn lại |  |  |  |
| a) Chiều rộng của bãi đỗ xe chữa cháy | Không yêu cầu | ≥ 6 | ≥ 6 |
| b) Chiều dài của bãi đỗ xe chữa cháy | Theo Bảng 15 và Bảng 16 | Theo Bảng 15 / và Bảng 16 | Theo Bảng 15 / và Bảng 16 |
| 1) Không yêu cầu có bãi đỗ xe chữa cháy đối với nhà có số người sử dụng trên mỗi tầng, tính theo Bảng G.9 (Phụ lục G), không vượt quá 50 người và khoảng cách từ đường cho xe chữa cháy đến / họng tiếp nước vào nhà không được lớn hơn 18 m. |
6.2.1.3 Chỉ cho phép có các kết cấu chặn phía trên đường cho xe chữa cháy và bãi đỗ xe chữa cháy nếu bảo đảm tất cả những yêu cầu sau:
- Chiều cao thông thủy để các phương tiện chữa cháy đi qua không được nhỏ hơn 4,5 m;
- Kích thước của kết cấu chặn phía trên (đo dọc theo chiều dài của đường cho xe chữa cháy và bãi đỗ xe chữa cháy) không được lớn hơn 10 m;
- Nếu có từ hai kết cấu chặn phía trên bắc ngang qua đường cho xe chữa cháy hoặc bãi đỗ xe chữa cháy thì khoảng thông giữa những kết cấu này không được nhỏ hơn 20 m;
- Chiều dài của đoạn cuối của đường cho xe chữa cháy hoặc bãi đỗ xe chữa cháy không bị chặn bởi các kết cấu chặn phía trên không được nhỏ hơn 20 m;
- Chiều dài của bãi đỗ xe chữa cháy không được tính đến những đoạn có kết cấu chặn phía trên.
6.2.1.4 Dọc theo tường ngoài của nhà, tại các vị trí đối diện với bãi đỗ xe chữa cháy phải bố trí các lối xuyên qua tường ngoài vào bên trong nhà từ trên cao (lối vào từ trên cao) phù hợp với quy định tại
6.3 để triển khai các hoạt động chữa cháy và cứu nạn.
6.2.2 Việc bố trí đường cho xe chữa cháy và bãi đỗ xe chữa cháy phải bảo đảm các yêu cầu sau:
6.2.2.1 Nhà nhóm F1, F2, F3 và F4 có chiều cao PCCC không quá 15 m không yêu cầu có bãi đỗ xe chữa cháy, tuy nhiên phải có đường cho xe chữa cháy tiếp cận đến điểm bất kỳ trên hình chiếu bằng của nhà không lớn hơn 60 m , hoặc có phương án chữa cháy phù hợp từ ngoài nhà.
6.2.2.2 Nhà nhóm F1.3 có chiều cao PCCC lớn hơn 15 m phải bảo đảm tất cả những yêu cầu sau:
- Phải có đường cho xe chữa cháy trong phạm vi di chuyển không quá 18 m tính từ điểm cuối của đường đến lối vào tất cả các khoang đệm của thang máy chữa cháy hoặc của buồng thang bộ thoát nạn có bố trí họng chờ cấp nước DN 65 dành cho lực lượng chữa cháy chuyên nghiệp (của hệ thống ống khô);
- Phải có bãi đỗ xe chữa cháy để tiếp cận đến ít nhất toàn bộ một mặt ngoài của mỗi khối nhà. Bãi đỗ xe chữa cháy phải được bố trí ở khoảng không gần hơn 2 m và không xa quá 10 m tính từ tường mặt ngoài của nhà;
- Thiết kế của bãi đỗ xe chữa cháy và đường cho xe chữa cháy phải đáp ứng những quy định nêu trong Bảng 14.
6.2.2.3 Nhà hoặc phần nhà nhóm F1.1, F1.2, F2, F3 và F4 có chiều cao PCCC lớn hơn 15 m thì tại mỗi vị trí có lối vào từ trên cao phải bố trí một bãi đỗ xe chữa cháy để tiếp cận trực tiếp đến các tấm cửa của lối vào từ trên cao. Chiều dài của bãi đỗ xe chữa cháy phải được lấy theo Bảng 15 căn cứ vào diện tích sàn cho phép tiếp cận của tầng có giá trị diện tích sàn cho phép tiếp cận lớn nhất. Đối với trường hợp nhà có sàn thông tầng, giá trị đó được tính như sau:
a) Đối với nhà có các sàn thông tầng, bao gồm cả các tầng hầm thông với các tầng trên mặt đất thì diện tích sàn cho phép tiếp cận lấy bằng diện tích cộng dồn các giá trị diện tích sàn cho phép tiếp cận của tất cả các sàn thông tầng;
b) Đối với các nhà có từ hai nhóm sàn thông tầng trở lên thì diện tích sàn cho phép tiếp cận phải lấy bằng giá trị cộng dồn của nhóm sàn thông tầng có diện tích lớn nhất;
CHÚ THÍCH: Nếu các lỗ thông tầng được bảo vệ chống cháy lan thì diện tích sàn cho phép tiếp cận được tính bằng diện tích một sàn lớn nhất trong số các sàn được nối thông tầng cộng với diện tích các lỗ thông tầng trong phạm vi được bảo vệ.
c) Đối với nhà nhóm F5, phải có một bãi đỗ xe chữa cháy cho các phương tiện chữa cháy (chỉ yêu cầu có đường cho xe chữa cháy tiếp cận như 6.2.2.1 hoặc có phương án chữa cháy phù hợp khác đối với nhà F5 hạng A, B có tổng diện tích sàn đến 300 m2, nhà F5 hạng C, D, E có diện tích và chiều cao không vượt quá giới hạn cho phép lấy theo nhà có bậc chịu lửa V theo Phụ lục H) . Chiều dài của bãi đỗ xe chữa cháy phải được lấy theo Bảng 16, dựa vào tổng quy mô khối tích của nhà (không bao gồm tầng hầm).
Khi điều kiện sản xuất không yêu cầu có đường vào thì đường cho xe chữa cháy được phép bố trí phần đường rộng 3,5 m cho xe chạy, nền đường được gia cố bằng các vật liệu bảo đảm chịu được tải trọng của xe chữa cháy và bảo đảm thoát nước mặt.
Khoảng cách từ mép đường cho xe chữa cháy đến tường của nhà phải không lớn hơn 5 m đối với các nhà có chiều cao PCCC nhỏ hơn 12 m, không lớn hơn 8 m đối với các nhà có chiều cao PCCC từ 12 m đến 28 m và không lớn hơn 10 m đối với các nhà có chiều cao PCCC trên 28 m. Không quy định khoảng cách này khi không có yêu cầu cứu nạn từ trên cao và lực lượng chũ'a cháy có phương án khác để tiếp cận chữa cháy.
Trong những trường hợp cần thiết, khoảng cách từ mép gần nhà của đường xe chạy đến tường ngoài của nhà và công trình được tăng đến 60 m với điều kiện nhà và công trình này có các đường cụt đi vào, kèm theo bãi quay xe chữa cháy và bố trí các trụ nước chữa cháy. Trong trường hợp đó, khoảng cách từ nhà và công trình đến bãi quay xe chữa cháy phải không nhỏ hơn 5 m và không lớn hơn 15 m và khoảng cách giữa các đường cụt không được vượt quá 100 m.
CHÚ THÍCH 1: Chiều rộng của nhà và công trình lấy theo khoảng cách giữa các trục định vị.
Bảng 15 - Chiều dài của bãi đỗ xe chữa cháy đối với nhà hoặc phần nhà nhóm F1.1, F1.2, F2, F3, F4
| Diện tích sàn cho phép tiếp cận, m2 | Chiều dài yêu cầu của bãi đỗ xe chữa cháy, tính theo chu vi nhà, m |
|  | Nhà không được bảo vệ bằng hệ thống sprinkler | Nhà được bảo vệ bằng hệ thống sprinkler |
| ≤ 2 000 | 1/6 chu vi và không nhỏ hơn 15 m | 1/6 chu vi và không nhỏ hơn 15 m |
| > 2 000 và ≤ 4 000 | 1/4 chu vi | 1/6 và không nhỏ hơn 15 m |
| > 4 000 và ≤ 8 000 | 1/2 chu vi | 1/4 chu vi |
| > 8 000 và ≤ 16 000 | 3/4 chu vi | 1/2 chu vi |
| > 16 000 và ≤ 32 000 | Bao quanh mặt bằng nhà 1) | 3/4 chu vi |
| > 32 000 | Bao quanh mặt bằng nhà 1) | Bao quanh mặt bằng nhà 1) |
| 1) Cho phép không đi theo biên của mặt bằng nhưng phải bảo đảm quy định tại 6.2.3. |
Bảng 16 - Chiều dài của bãi đỗ xe chữa cháy đối với nhà nhóm F5
| Quy mô khối tích, m3 | Chiều dài yêu cầu của bãi đỗ xe chữa cháy, tính theo chu vi nhà, / m |
|  | Nhà không được bảo vệ bằng hệ thống sprinkler | Nhà được bảo vệ bằng hệ thống sprinkler |
| ≤ 28 400 | 1/6 chu vi và không nhỏ hơn 15 m | 1/6 chu vi và không nhỏ hơn 15 m |
| > 28 400 và ≤ 56 800 | 1/4 chu vi | 1/6 chu vi và không nhỏ hơn 15 m |
| > 56 800 và ≤ 85 200 | 1/2 chu vi | 1/4 chu vi |
| > 85 200 và ≤ 113 600 | 3/4 chu vi | 1/4 chu vi |
| > 113 600 và ≤ 170 400 | Bao quanh mặt bằng nhà 1) | 1/2 chu vi |
| > 170 400 và ≤ 227 200 | Bao quanh mặt bằng nhà 1) | 3/4 chu vi |
| > 227 200 | Bao quanh mặt bằng nhà 1) | Bao quanh mặt bằng nhà 1) |
| 1) Cho phép không đi theo biên của mặt bằng nhưng phải bảo đảm quy định tại 6.2.3. |
6.2.2.4 Bố trí đường cho xe chữa cháy hoặc bãi đỗ xe chữa cháy cho nhà hỗn hợp phải bảo đảm những yêu cầu sau:
a) Khi phần nhà không để ở (không thuộc nhóm F1.3) chỉ nằm ở phần dưới của nhà thì chiều cao PCCC của nhà để xác định các yêu cầu về đường cho xe chữa cháy hoặc bãi đỗ xe chữa cháy phải căn cứ vào phần nhà không để ở của nhà;
b) Đối với nhà hỗn hợp không có phần nhà thuộc nhóm F1.3 thì chiều dài yêu cầu của đường cho xe chữa cháy hoặc bãi đỗ xe chữa cháy phải được lấy bằng giá trị lớn hơn trong hai giá trị xác định căn cứ vào:
- Tổng quy mô khối tích của các phần nhà thuộc nhóm F5; hoặc
- Xác định được theo Bảng 15;
c) Đối với nhà hỗn hợp có phần nhà thuộc nhóm F1.3, chiều dài của bãi đỗ xe chữa cháy phải được tính theo 6.2.2.3 đồng thời phải đáp ứng được quy định tại 6.2.2.
Đối với các tầng hầm phải có đường cho xe chữa cháy nằm trong phạm vi 18 m tính từ lối vào trên mặt đất của tất cả các khoang đệm của thang máy chữa cháy hoặc của buồng thang bộ thoát nạn có bố trí họng chờ cấp nước DN 65 dành cho lực lượng chữa cháy chuyên nghiệp (của hệ thống ống khô).
6.2.3 Bãi đỗ xe chữa cháy phải được bố trí bảo đảm để khoảng cách đo theo phương nằm ngang từ mép gần nhà hơn của bãi đỗ đến điểm giữa của lối vào từ trên cao không gần hơn 2 m và không xa quá 10 m.
6.2.4 Bề mặt của bãi đỗ xe chữa cháy phải ngang bằng. Nếu nằm trên một mặt nghiêng thì độ dốc không được quá 1:15. Độ dốc của đường cho xe chữa cháy không được quá 1:8,3.
6.2.5 Nếu chiều dài của đường cho xe chữa cháy hoặc bãi đỗ xe chữa cháy dạng cụt lớn hơn 46 m thì ở cuối đoạn cụt phải có bãi quay xe được thiết kế theo quy định tại 6.4.
6.2.6 Đường giao thông công cộng có thể được sử dụng làm bãi đỗ xe chữa cháy, nếu vị trí của đường đó phù hợp với các quy định về khoảng cách đến lối vào từ trên cao tại 6.2.3.
6.2.7 Đường cho xe chữa cháy và bãi đỗ xe chữa cháy phải được bảo đảm thông thoáng tại mọi thời điểm. Khoảng không giữa bãi đỗ xe chữa cháy và lối vào từ trên cao phải bảo đảm không bị cản trở bởi cây xanh hoặc các vật thể cố định khác.
6.2.8 Phải đánh dấu tất cả các góc của bãi đỗ xe chữa cháy và đường cho xe chữa cháy ngoại trừ những đường giao thông công cộng được sử dụng làm bãi đỗ xe chữa cháy hoặc đường cho xe chữa cháy. Việc đánh dấu phải được thực hiện bằng các dải sơn phản quang, bảo đảm có thể nhìn thấy được vào buổi tối và phải bố trí ở cả hai phía của đường cho xe chữa cháy hoặc bãi đỗ xe chữa cháy với khoảng cách không quá 5 m.
Tại các điểm đầu và điểm cuối của đường cho xe chữa cháy hoặc bãi đỗ xe chữa cháy phải có biển báo nền trắng, chữ đỏ với chiều cao chữ không nhỏ hơn 50 mm. Chiều cao từ mặt đất đến điểm thấp nhất của biển báo phải nằm trong khoảng 1,0 m đến 1,5 m. Biển báo phải bảo đảm nhìn thấy được vào buổi tối và không được bố trí cách đường cho xe chữa cháy hoặc bãi đỗ xe chữa cháy quá 3 m. Tất cả các phần của đường cho xe chữa cháy hoặc bãi đỗ xe chữa cháy không được cách biển báo gần nhất quá 15 m.
6.2.9 Mặt đường cho xe chữa cháy và bãi đỗ xe chữa cháy phải bảo đảm chịu được tải trọng của xe chữa cháy theo yêu cầu thiết kế và phù hợp với chủng loại phương tiện của cơ quan Cảnh sát PCCC và CNCH nơi xây dựng công trình.
6.3 Lối vào từ trên cao để phục vụ chữa cháy và cứu nạn
6.3.1 Lối vào từ trên cao phải bảo đảm thông thoáng, không bị cản trở ở mọi thời điểm trong thời gian nhà được sử dụng. Lối vào từ trên cao có thể là các lỗ thông trên tường ngoài, cửa sổ, cửa ban công, các tấm tường lắp kính và các tấm cửa có thể mở được từ bên trong và bên ngoài. Không được bố trí đồ đạc hoặc bất kỳ vật nào có thể gây cản trở trong phạm vi 1 m của phần sàn bên trong nhà tính từ các lối vào từ trên cao.
6.3.2 Lối vào từ trên cao phải được bố trí đối diện với một không gian sử dụng. Không được bố trí ở các phòng kho hoặc phòng máy, buồng thang bộ thoát nạn, sảnh không nhiễm khói, sảnh thang máy chữa cháy hoặc không gian chỉ dẫn đến một điểm cụt.
6.3.3 Mặt ngoài của các tấm cửa của lối vào từ trên cao phải được đánh dấu bằng dấu tam giác đều mầu đỏ hoặc mầu vàng có cạnh không nhỏ hơn 150 mm, đỉnh tam giác có thể hướng lên hoặc hướng xuống. Ở mặt trong phải có dòng chữ “LỐI VÀO TỪ TRÊN CAO - KHÔNG ĐƯỢC GÂY CẢN TRỞ” với chiều cao chữ không nhỏ hơn 25 mm.
6.3.4 Các lối vào từ trên cao phải có chiều rộng không nhỏ hơn 850 mm, chiều cao không nhỏ hơn 1 000 mm, mép dưới của lối vào cách mặt sàn phía trong không lớn hơn 1 100 mm và mép trên cách mặt sàn phía trong không nhỏ hơn 1 800 mm.
6.3.5 Số lượng, vị trí của lối vào từ trên cao đối với mỗi khoang cháy của nhà hoặc phần nhà không thuộc nhóm F1.3 phải bảo đảm những quy định sau:
- Đối với nhà nhóm F1.1, F1.2, F2, F3, F4 và F5 số lượng lối vào từ trên cao phải tính toán dựa vào chiều dài của bãi đỗ xe chữa cháy. Cứ mỗi đoạn đủ hoặc không đủ 20 m chiều dài bãi đỗ xe chữa cháy phải có một vị trí lối vào từ trên cao;
- Lối vào từ trên cao phải được bố trí cách xa nhau, dọc trên cạnh của nhà. Khoảng cách xa nhất đo dọc theo tường ngoài giữa tâm của hai lối vào từ trên cao liên tiếp nhau được phục vụ bởi một bãi đỗ xe chữa cháy không được quá 20 m. Lối vào từ trên cao phải được phân bố bảo đảm để ít nhất phải có 1 lối vào từ trên cao trên mỗi đoạn 20 m chiều dài của bãi đỗ xe chữa cháy, ngoại trừ những phần nhà 1 tầng không thuộc nhóm F5;
- Đối với nhà thuộc nhóm F1.1, F1.2, F2, F3 và F4 có chiều cao PCCC từ trên 15 m đến 50 m, phải có lối vào từ trên cao ở tất cả các tầng trừ tầng 1 và phải nằm đối diện với bãi đỗ xe chữa cháy;
- Đối với nhà nhóm F5, phải bố trí các lối vào từ trên cao ở phía trên một bãi đỗ xe chữa cháy, lên đến chiều cao PCCC 50 m.
Yêu cầu về lối vào từ trên cao không áp dụng đối với các nhà nhóm F1.3, bao gồm cả những khu vực phụ trợ (ví dụ: phòng tập gym, các phòng câu lạc bộ, và các gian phòng có công năng tương tự phục vụ riêng cho cư dân của nhà) trong nhà nhóm F1.3.
CHÚ THÍCH: Không quy định về cách bố trí các lối vào từ trên cao khi có phương án phù hợp khác để lực lượng chữa cháy tiếp cận.
6.4 Thiết kế bãi quay xe phải phù hợp với phương tiện chữa cháy ở địa phương.
6.5 Đối với đường giao thông nhỏ hẹp chỉ đủ cho 1 làn xe chạy thì cứ ít nhất 100 m phải thiết kế một đoạn đường mở rộng có chiều dài tối thiểu 8 m và chiều rộng tối thiểu 7 m để xe chữa cháy và các loại xe khác có thể tránh nhau dễ dàng.
6.6 Đối với các nhà từ 2 tầng trở lên có mái bằng hoặc mái có độ dốc nhỏ hơn 25% với chiều cao lớn hơn hoặc bằng 10 m tính đến diềm mái hoặc mép trên của tường ngoài (tường chắn mái) phải có các lối ra mái trực tiếp từ các buồng thang bộ hoặc đi qua tầng áp mái, hoặc đi theo cầu thang bộ loại 3, hoặc đi theo thang chữa cháy ngoài nhà.
Số lượng lối ra mái và việc bố trí chúng phải dựa trên tính nguy hiểm cháy theo công năng và các kích thước của nhà. Nhà nhóm F1, F2, F3 và F4 phải có ít nhất 1 lối tiếp cận lên mái cho mỗi diện tích đủ hoặc không đủ 9 300 m2 mái. Đối với nhà nhóm F5 thực hiện theo quy định tại A.1.3.1.
Cho phép không bố trí các thang chữa cháy tại mặt chính của nhà nếu chiều rộng nhà không quá 150 m và ở phía trước nhà có tuyến đường ống cấp nước chữa cháy.
6.7 Trong các tầng áp mái của nhà, trừ các nhà nhóm F1.4, phải có các lối ra mái qua các thang cố định và các cửa đi, cửa nắp hoặc cửa sổ có kích thước không nhỏ hơn 0,6 m × 0,8 m.
Các lối ra mái hoặc ra tầng áp mái từ các buồng thang bộ phải được bố trí theo các bản thang có các chiếu thang ở trước lối ra, qua các cửa ngăn cháy loại 2 kích thước không nhỏ hơn 0,75 m × 1,5 m. Các bản thang và chiếu thang nói trên có thể được làm bằng thép nhưng phải có độ dốc (góc nghiêng) không lớn hơn 2:1 (63,5o) và chiều rộng không nhỏ hơn 0,7 m.
Trong các nhà nhóm F1, F2, F3 và F4 có chiều cao PCCC đến 15 m cho phép bố trí các lối ra tầng áp mái hoặc ra mái từ các buồng thang bộ qua các cửa nắp ngăn cháy loại 2 với kích thước 0,6 m × 0,8 m theo các thang leo bằng thép gắn cố định.
6.8 Trong các tầng kỹ thuật, bao gồm cả các tầng hầm kỹ thuật và các tầng áp mái kỹ thuật, chiều cao thông thuỷ của lối đi phải không nhỏ hơn 1,8 m; trong các tầng áp mái dọc theo toàn bộ nhà - không nhỏ hơn 1,6 m. Chiều rộng của các lối đi này phải không nhỏ hơn 1,2 m. Trong các đoạn riêng biệt có chiều dài không lớn hơn 2 m cho phép giảm chiều cao của lối đi xuống 1,2 m, còn chiều rộng tối thiểu là 0,9 m.
6.9 Trong các nhà có tầng gác áp mái phải có các cửa nắp trong các kết cấu bao che các hốc của tầng áp mái.
6.10 Tại các điểm chênh lệch độ cao của mái lớn hơn 1,0 m (trong đó có cả điểm chênh cao để nâng các cửa lấy sáng - thông gió) phải có thang chữa cháy.
Tại khu vực chênh lệch độ cao của mái hơn 10 m, nếu mỗi một phần mái diện tích lớn hơn 100 m2 có cửa ra mái riêng thỏa mãn các yêu cầu tại 6.6, hoặc độ cao phần thấp hơn của mái, xác định theo 6.6 không vượt quá 10 m thì cho phép không bố trí thang chữa cháy.
6.11 Khi bố trí lối tiếp cận lên mái bằng các thang chữa cháy ngoài nhà theo yêu cầu tại 6.6, phải sử dụng các thang chữa cháy loại P1 để lên độ cao đến 20 m và tại các chỗ chênh lệch độ cao của mái từ 1,0 m đến 20 m. Phải sử dụng các thang chữa cháy loại P2 để lên độ cao lớn hơn 20 m và tại các chỗ chênh lệch độ cao trên 20 m.
Các thang chữa cháy phải được làm bằng vật liệu không cháy, đặt ở nơi dễ thấy và cách xa cửa sổ không dưới 1,0 m. Chiều rộng thang 0,7 m. Đối với thang loại P1, từ độ cao 10 m trở lên phải có cung tròn bảo hiểm bán kính 0,35 m, tâm của cung tròn cách thang 0,45 m. Các cung tròn phải được đặt cách nhau 0,7 m, ở nơi ra mái phải đặt chiếu tới có lan can cao ít nhất 0,6 m. Đối với thang P2 phải có tay vịn và có chiếu nghỉ đặt cách nhau không quá 8 m.
6.12 Giữa các bản thang và giữa các lan can tay vịn của bản thang phải có khe hở với chiều rộng thông thủy chiếu trên mặt bằng không nhỏ hơn  75 mm. Trường hợp không thể bảo đảm yêu cầu này thì tại mỗi tầng cần bố trí ít nhất một họng khô để cấp nước chữa cháy cho tầng đó. Không yêu cầu khe hở vế thang đối với cầu thang loại 3.
6.13 Mỗi khoang cháy của các nhà có chiều cao PCCC lớn hơn 28 m (lớn hơn 50 m đối với nhà nhóm F1.3), hoặc nhà có chiều sâu của sàn tầng hầm dưới cùng (tính đến cao độ của lối ra thoát nạn ra ngoài) lớn hơn 9 m phải có tối thiểu một thang máy chữa cháy.
CHÚ THÍCH: Yêu cầu kỹ thuật khác như cấp điện, hệ thống điều khiển, truyền tín hiệu, liên lạc, thiết bị phục vụ bảo vệ chống cháy và những hệ thống tương tự phải bảo đảm theo các tiêu chuẩn kỹ thuật riêng được chọn lựa cho thang máy chữa cháy.
Việc bố trí và lắp đặt các thang máy chữa cháy phải bảo đảm những quy định cơ bản sau:
- Không được sử dụng các thang máy chủ yếu để vận chuyển hàng hóa để làm thang máy chữa cháy;
- Ở điều kiện bình thường, thang máy chữa cháy vẫn được sử dụng để chở người. Thang máy chữa cháy có thể được bố trí với một sảnh thang máy riêng hoặc trong một sảnh chung với các thang máy chở người và hợp lại với nhau bằng một hệ thống điều khiển tự động theo nhóm;
- ; Có số lượng được tính toán đủ để khoảng cách từ vị trí cửa các thang máy đó đến một điểm bất kỳ trên mặt bằng tầng mà nó phục vụ (bán kính phục vụ) không vượt quá 60 m.
- Nếu chỉ có một thang máy chữa cháy thì thang máy đó ít nhất phải đến được tất cả các tầng kế cận với tầng đang cháy của nhà;
- Nếu có nhiều thang máy chữa cháy được bố trí chung trong một giếng thang thì các thang máy có thể phục vụ cho các khu vực khác nhau của nhà với điều kiện phải thể hiện rõ vùng được phục vụ trên mỗi thang máy đó;
- Trong mọi trường hợp, hình thức phục vụ của các thang máy chữa cháy phải giống nhau và thông dụng, ví dụ thang máy chỉ phục vụ các tầng lẻ hoặc các tầng chẵn hoặc tất cả các tầng;
- Nếu có các tầng lánh nạn thì mỗi tầng đó phải được phục vụ bởi ít nhất một thang máy chữa cháy;
- Ở chế độ hoạt động bình thường, cửa các thang máy chữa cháy không được mở vào những tầng lánh nạn đó còn cửa giếng thang máy tại những tầng lánh nạn đó phải thường xuyên được khóa và chỉ được tự động mở khóa khi chuyển sang chế độ phục vụ lực lượng chữa cháy.
Trong trường hợp có cháy, các thang máy chữa cháy phải bảo đảm để người lính chữa cháy:
- Là người duy nhất được quyền kiểm soát và vận hành để cùng với trang thiết bị của mình tiếp cận đến đám cháy một cách dễ dàng, quen thuộc, an toàn và nhanh chóng;
- Được bảo vệ an toàn khi sử dụng trước tác động của lửa và khói bằng các giải pháp thích hợp, đặc biệt là khi ra khỏi các thang máy đó;
- Có lối đi thông thoáng và an toàn để tiếp cận đến các thang máy đó cũng như đến các sàn được những thang máy đó phục vụ;
- Không phải di chuyển quá hai tầng để tiếp cận đến tầng có thể bị cháy bất kỳ của nhà khi có từ 2 thang máy chữa cháy trở lên;
- Được bảo vệ trong các giếng thang máy riêng (không chung với các loại thang máy khác) và trong mỗi giếng thang máy như vậy chỉ được bố trí không quá 3 thang máy chữa cháy. Kết cấu bao che giếng thang máy phải có giới hạn chịu lửa không nhỏ hơn REI 120.
Sảnh thang máy chữa cháy là một khoang đệm bảo đảm tất cả các quy định sau:
- Có diện tích không nhỏ hơn 4 m2;
- Khi kết hợp với các sảnh của buồng thang bộ không nhiễm khói thì diện tích không nhỏ hơn 6 m2;
- Được bao che bằng các vách ngăn cháy loại 1;
- Có lắp đặt họng chờ cấp nước DN 65 dành cho lực lượng chữa cháy chuyên nghiệp;
- Việc bố trí thang máy chữa cháy phải dự tính được đường di chuyển của đội chữa cháy chuyên nghiệp và bảo đảm đội chữa cháy tiếp cận được tất cả các gian phòng trên tất cả các tầng của nhà;
- Sức chở của thang máy chữa cháy không được nhỏ hơn 630 kg đối với nhà chung cư nhóm F1.3 và không nhỏ hơn 1 000 kg đối với nhà sản xuất và nhà công cộng khác;
- Tốc độ di chuyển của thang máy chữa cháy không được nhỏ hơn H/60 (m/s), trong đó H là chiều cao nâng (m);
- Kết cấu bao che của cabin thang máy chữa cháy phải được làm từ vật liệu không cháy hoặc cháy yếu.
6.14 Trong các nhà có độ dốc mái đến 12%, chiều cao đến diềm mái hoặc mép trên của tường ngoài (tường chắn) lớn hơn 10 m, cũng như trong các nhà có độ dốc mái lớn hơn 12% và chiều cao đến diềm mái lớn hơn 7 m, nếu được thiết kế để lực lượng chữa cháy tiếp cận qua mái thì phải có lan can, tay vịn trên mái phù hợp tiêu chuẩn hiện hành. Các lan can, tay vịn loại này cũng phải được bố trí cho các mái phẳng, ban công, lôgia, hành lang bên ngoài, cầu thang bên ngoài loại hở, bản thang bộ và chiếu thang bộ mà không phụ thuộc vào chiều cao PCCC của nhà.
6.15 Các hệ thống cấp nước chữa cháy cho nhà phải bảo đảm để lực lượng và phương tiện chữa cháy có thể tiếp cận và sử dụng ở mọi thời điểm.
6.16 Việc cấp nước chữa cháy cũng như trang bị và bố trí các phương tiện, dụng cụ chữa cháy chuyên dụng khác cho nhà và công trình phải tuân theo những quy định cơ bản trong Phần 5 của quy chuẩn này và của các tiêu chuẩn kỹ thuật có liên quan.
6.17 Phòng trực điều khiển chống cháy
6.17.1 Nhà ở và công trình công cộng cao trên 10 tầng; nhà có từ 2 đến 3 tầng hầm; công trình công cộng tập trung đông người (nhà hát, rạp chiếu phim, vũ trường, các quán karaoke mà phải bố trí từ 2 lối ra thoát nạn trở lên , và các nhà có mục đích sử dụng tương tự, với số người trên mỗi tầng, tính theo Bảng G.9 (Phụ lục G), vượt quá 50 người); gara (chỗ để ô-tô, xe máy, xe đạp), nhà sản xuất, kho có tổng diện tích sàn trên 18 000 m2 phải có phòng trực điều khiển chống cháy và có nhân viên có chuyên môn thường xuyên trực tại phòng điều khiển.
6.17.2 Phòng trực điều khiển chống cháy phải:
- Có diện tích đủ để bố trí các thiết bị theo yêu cầu phòng chống cháy của nhà nhưng không nhỏ hơn 6 m2;
- để thoát nạn; Có ít nhất một lối ra trực tiếp thông với hành lang chính để thoát nạn hoặc lối ra trực tiếp ra ngoài nhà, hoặc thông trực tiếp với cầu thang thoát nạn;
- Được ngăn cách với các phần khác của nhà bằng các bộ phận ngăn cháy loại 1;
- Có lắp đặt các thiết bị thông tin và đầu mối của hệ thống báo cháy liên hệ với tất cả các khu vực của nhà;
- Có bảng theo dõi, điều khiển các thiết bị chữa cháy, thiết bị khống chế khói và có sơ đồ mặt bằng bố trí các thiết bị phòng cháy chữa cháy của nhà.
6.18 Tất cả các tầng hầm trong nhà có từ 2 đến 3 tầng hầm, phải được trang bị hệ thống liên lạc khẩn cấp hai chiều giữa phòng trực điều khiển chống cháy tới những khu vực sau:
- Các phòng thiết bị liên quan đến hệ thống chữa cháy, đặc biệt là các phòng máy bơm của hệ thống sprinkler, phòng máy bơm cấp nước vào hệ thống ống đứng, phòng chuyển mạch, phòng máy phát điện và phòng máy thang máy;
- Tất cả các phòng lắp đặt thiết bị điều khiển hệ thống kiểm soát chống khói;
- Các thang máy chữa cháy;
- Tất cả các gian lánh nạn;
- Các phòng điều khiển hệ thống thông gió.


### knowledge/hoc/_da_duyet.md
(chưa có)

## Các dòng cần xét – bảng KT18, mục "Đường giao thông phục vụ xe chữa cháy" (2 dòng)
#23 | TT - | Đường cụt, bãi quay xe
   Gợi ý đọc bản vẽ: -
   Quy định: Nếu đường hoặc bãi đỗ xe chữa cháy dạng cụt dài hơn 46 m thì cuối đoạn cụt phải có bãi quay xe, thiết kế phù hợp phương tiện chữa cháy của địa phương.
   Khoản, Điều: Đ 6.2.5, 6.4 QCVN 06:2022/BXD | Tra ở: -
#24 | TT - | Đoạn tránh xe
   Gợi ý đọc bản vẽ: -
   Quy định: Đường nhỏ hẹp chỉ đủ một làn xe chạy: cứ ít nhất 100 m phải có đoạn mở rộng dài ≥ 8 m, rộng ≥ 7 m.
   Khoản, Điều: Đ 6.5 QCVN 06:2022/BXD | Tra ở: -

## Định dạng trả lời
Chỉ trả về MỘT khối ```json, không viết gì ngoài khối đó:
{"dong":[{"bang":"A12","idx":90,"tt":"7.2.3","noi_dung_thiet_ke":"thiết kế có gì (số liệu, trang)","ket_luan":"DAT|CHUA_DAT|CAN_XAC_NHAN|KHONG_AP_DUNG","ly_do":"lý do có số","dieu_khoan":"Đ 3.2.8 QCVN 06:2022/SĐ1:2023","chinh_ban_ve":"(nếu có)","nguon":[{"trang":12,"ghi_chu":"mặt bằng tầng 1"}],"vi_tri":[{"trang":12,"anchor":"D3"}]}],"ghi_chu":"điều cần lưu ý chung (nếu có)"}
Trả về đủ MỌI dòng được giao (theo "idx"), đúng thứ tự.