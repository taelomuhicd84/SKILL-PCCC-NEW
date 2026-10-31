# Tư vấn thiết kế PCCC – Khách sạn Hoàng Hùng (lần 3, áp thư viện mẫu giải pháp)

> **Đã lệch so với hồ sơ người thiết kế (30/10):** BTB2 có bậc chéo ở chiếu nghỉ nên không thoát nạn (3.4.4); bậc II S0 đạt Bảng H.2; sức chứa hội trường ghi theo thiết kế; sân thượng ghi "không có người thường xuyên". Xem bài học ở `knowledge/hoc/du-an/so-bo-thiet-ke.md`.
Bản vẽ: `26-10-2026-(14-52-20)-kien truc KS Hoàng Hùng 25-06.pdf` (18 trang, trùng `ban_ve.pdf`). Ngày 30/10/2026.

Đây là tư vấn sơ bộ cho người thiết kế, không phải kết luận thẩm định. Số đo đọc từ bản vẽ sai số ±1 m. Bảng thông tin, giao thông xe chữa cháy, khoảng cách giáp ranh, hệ thống PCCC đã có ở `so_bo_pccc.md` và `../hoang_hung_so_bo/tu_van_pccc.md`. Bản này chỉ giữ số liệu nền và đi sâu phần thoát nạn: mỗi mục ghi Hiện trạng, Đánh giá và Giải pháp.

## 0. Số liệu nền và bộ lọc mẫu
- **Phân loại:** khách sạn F1.2. Tầng 2 là hội trường đãi tiệc F3.2. Có 1 bán hầm đỗ xe 454 m².
- **Quy mô:** 10 tầng nổi, khoảng 454 m²/tầng.
- **Chiều cao PCCC:** 34,05 m nếu sân thượng T10 có khai thác; 30,55 m nếu không. Cả hai đều > 28 m.
- **Số người:**
  - T3–T9: khoảng 20 người/tầng (10 phòng).
  - T2 hội trường: khoảng 280 người, tính theo Bảng G.9 dòng 3 (phòng ăn 1,5 m²/người, khoảng 425 m² sàn sau khi trừ thang, WC). Nếu tính là hội trường (1,0 m²/người) thì khoảng 425 người.
- Lệnh lọc: `python scripts/mau_giai_phap.py loc --F F1.2 --cao 34 --tang 11 --dt 454 --nguoi 20 --ham 1`.
- Kết quả: 10/17 mẫu hợp:
  - cửa thoát nạn;
  - 2 lối tầng;
  - 2 lối gian phòng;
  - buồng thang N1;
  - thang hầm;
  - thang loại 3;
  - hành lang bên;
  - lối ra khẩn cấp;
  - lối ra mái;
  - lối vào trên cao.
- Bị loại đúng 7 mẫu:
  - 3 mẫu 1 lối (nhà > 25 m);
  - L1, L2, thang loại 2 (nhà > 28 m);
  - karaoke.

## 1. Buồng thang BTB1, BTB2: phải là buồng thang không nhiễm khói (mẫu tn-buong-thang-N1)
- **Hiện trạng:** hai buồng thang thường, ghi "BTB". Bản vẽ không có khoang đệm, tăng áp, hay khoảng đệm hở.
  - BTB1 ở góc Đông Bắc, sát nhà dân.
  - BTB2 nằm giữa nhà, cạnh thang máy, không có tường ngoài.
- **Đánh giá: CHƯA ĐẠT.** Nhà cao PCCC > 28 m phải có buồng thang không nhiễm khói (3.4.13). Bản vẽ đang làm buồng thang thường.
- **Giải pháp (đề xuất N2 hoặc N3 cho cả hai):**
  - Mỗi tầng làm khoang đệm ≥ 3,0 m² trước cửa buồng thang (3.4.9).
  - Khoang đệm cạnh thang máy chữa cháy thì ≥ 6,0 m², dùng chung làm sảnh thang máy chữa cháy.
  - Tăng áp cả khoang đệm và buồng thang, cấp khí độc lập (Phụ lục D).
  - Điện ưu tiên 2 nguồn: lưới và máy phát (3.4.13).
  - Không chọn N1 (khoảng đệm hở ra trời): BTB2 không có tường ngoài; BTB1 hướng ra nhà dân, sát ranh.
- **Vị trí khoang đệm:**
  - BTB2: dùng phần trống phía Đông vế thang trong buồng thang, khoảng 2,7 x 2,3 m ≈ 6 m². Cửa từ hành lang vào khoang đệm rồi vào thang.
  - BTB1: quây đầu hành lang cánh Đông trước cửa D07, khoảng 1,9 x 2,1 m ≈ 4 m², không mất phòng.

## 2. Bề rộng bản thang và cửa: do hội trường T2 quyết định (mẫu tn-cua-thoat-nan, tn-hai-loi-gian-phong)
- **Hiện trạng:**
  - BTB2 ghi "900 100 900": bản thang 0,9 m.
  - BTB1 cũng 2 vế thẳng, khoảng 0,9 m.
  - Cửa vào buồng thang D07 là cửa một cánh, khoảng 0,9 m.
  - Hội trường T2 có 2 lối là cửa BTB1 và cửa BTB2, cách nhau khoảng 21 m.
- **Đánh giá:**
  - Số lối của gian (≥ 50 người phải ≥ 2 lối, 3.2.5): ĐẠT.
  - Bản thang: CHƯA ĐẠT. Trên tầng bất kỳ ngoài tầng 1 có > 200 người thì bản thang ≥ 1,2 m (3.4.1).
  - Cửa: CHƯA ĐẠT. Phòng > 50 người thì cửa thoát nạn ≥ 1,2 m thông thủy (3.2.9). Cửa hai cánh chỉ tính cánh mở.
- **Giải pháp (chọn một):**
  - **a) Giữ công năng tiệc khoảng 280 người:**
    - Mở rộng hai buồng thang thành bản 1,2 m: BTB2 rộng 1,2 + 0,1 + 1,2 = 2,5 m thay 1,9 m, lấy 0,6 m từ phía "BUỒNG THANG"/P. ĐƠN.
    - Cửa vào thang ở T2 ≥ 1,2 m thông thủy (cánh đơn 1,2 m hoặc cửa 2 cánh có cánh mở ≥ 1,2 m), mở theo chiều vào buồng thang, tự đóng, ngăn cháy loại 1 (3.2.10, 3.2.11).
    - Tổng bề rộng lối ra kiểm theo G: 280/165 ≈ 1,7 m ≤ 2 x 1,2 m: ĐẠT.
  - **b) Giới hạn sức chứa T2 ≤ 200 người:** ghi rõ số người thiết kế trên bản vẽ và biển tại cửa. Khi đó bản thang 0,9 m được giữ. Cửa vào thang ở T2 vẫn phải ≥ 1,2 m vì phòng > 50 người.
  - Khuyến nghị **a**, vì "đãi tiệc" thường vượt 200 người vào mùa cưới.

## 3. Số lối và phân tán ở tầng điển hình T3–T9 (mẫu tn-hai-loi-tang)
- **Hiện trạng:** mỗi tầng vào được 2 buồng thang BTB1, BTB2. Thang 2 vế thẳng, không rẽ quạt.
- **Đánh giá:**
  - Số lối: 2 lối sau khi làm xong mục 1 (3.2.6.1). Trước khi sửa thì "đạt chắc: 0, chờ xác nhận: 2" (Bài học 26).
  - Phân tán: ĐẠT. Đường chéo D ≈ √(32,9² + 23,9²) ≈ 40,7 m. Khoảng cách 2 cửa thang L ≈ 20,5 m ≥ 1/2 D = 20,3 m (3.2.8). Có sprinkler toàn nhà thì chỉ cần ≥ 1/3 D = 13,6 m.
- **Giải pháp:** sát ngưỡng 1/2 D nên ghi rõ trên bản vẽ là toàn nhà có sprinkler (bắt buộc vì cao > 25 m) để áp 1/3 D. Không dời thang.

## 4. Tầng 1: BTB1 thoát qua bếp (mẫu tn-buong-thang-N1, 3.4.7)
- **Hiện trạng:** ở T1, cửa BTB1 mở vào BẾP (đã đọc lại trên mặt bằng). Ra ngoài phải đi xuyên bếp rồi qua SẢNH. BTB2 ra hành lang, đại sảnh, rồi tam cấp mặt Tây.
- **Đánh giá: CHƯA ĐẠT.** Buồng thang phải có lối ra ngoài trực tiếp, hoặc đi qua tiền sảnh ngăn bằng vách ngăn cháy loại 1, cửa tự đóng (3.4.7). Đi qua bếp không đạt điều kiện này. BTB2 cũng chưa có tiền sảnh ngăn cháy: CẦN XÁC NHẬN.
- **Giải pháp:**
  - BTB1: mở cửa ra ngoài trực tiếp ở tường Bắc hoặc Đông. Nếu không được (sát nhà dân) thì làm hành lang ngăn cháy rộng ≥ 1,2 m, dài khoảng 6 m, dọc tường Đông từ cửa BTB1 xuống SẢNH. Tường ngăn cháy loại 1, cửa tự đóng, tách hẳn khỏi bếp. Bếp lùi vào khoảng 1,3 m.
  - BTB2: dựng vách ngăn cháy loại 1 quanh đoạn hành lang trước thang máy thành tiền sảnh, cửa tự đóng ra đại sảnh.

## 5. Sân thượng T10: chỉ có 1 buồng thang lên (mẫu tn-hai-loi-tang, tn-loi-ra-mai)
- **Hiện trạng:** mặt bằng T10 chỉ có BTB2 lên tới sân thượng. Cánh Đông là hồ nước trang trí, BTB1 dừng ở T9. Thang sắt 1 lên mái +37,45.
- **Đánh giá:**
  - Nếu sân thượng có khai thác (có WC, hồ cảnh quan): tầng của nhà F1.2 phải ≥ 2 lối (3.2.6.1), nên **CHƯA ĐẠT**.
  - Lối ra mái từ buồng thang (6.6, 6.7): ĐẠT qua BTB2, với điều kiện cửa ra là cửa ngăn cháy loại 2, kích thước ≥ 0,75 x 1,5 m.
- **Giải pháp (chọn một):**
  - Kéo BTB1 lên T10 có tum, cửa ra sân thượng. Hồ nước thu ngắn khoảng 3 m ở đầu Bắc.
  - Hoặc ghi sân thượng là mái không khai thác: khóa cửa, bỏ WC, chỉ cho bảo trì. Khi đó chiều cao PCCC = 30,55 m, vẫn > 28 m nên mục 1 không đổi.
  - Thang sắt lên mái chỉ dùng bảo trì, không tính thoát nạn.

## 6. Lối vào từ trên cao (mẫu tn-loi-vao-tren-cao, knowledge/loi-vao-tren-cao.md)
- **Hiện trạng:** mặt Tây là mặt đứng trục A-C, trang 3, hướng ra bãi đỗ đề xuất trên đường KCN.
  - Mỗi tầng T3–T9 có 2 cửa đi ban công 2 cánh (phòng VIP 01, VIP 02), trước cửa có lan can ban công nhỏ.
  - Giữa hai cửa là cửa sổ 1.500 x 1.250–1.300, mép dưới 900–950: đây là cửa sổ WC của phòng VIP.
  - T2 có 2 cửa D03 của hội trường.
  - Không ô nào có tam giác ▼ hay chữ đánh dấu.
- **Đánh giá: CHƯA ĐẠT.** Nhà F1.2 cao > 15 m phải có lối vào từ trên cao ở mọi tầng trừ tầng 1 (6.3.1, 6.3.5). Bản vẽ chưa thể hiện.
- **Giải pháp, tận dụng ô có sẵn (quy tắc 6a):**
  - Mỗi tầng T2–T9 chọn **cửa ban công VIP 01** (phía trục A) làm lối vào trên cao. T2 dùng D03 phía A.
  - Bãi 20 m nên 1 vị trí/tầng là đủ (6.3.5).
  - Cửa đi ban công cao hơn 1.800, mép dưới ở sàn, rộng hơn 850: đạt kích thước 6.3.4.
  - Phải mở được từ trong và ngoài, không song sắt.
  - Dán tam giác đỏ/vàng ≥ 150 mm mặt ngoài, chữ "LỐI VÀO TỪ TRÊN CAO - KHÔNG ĐƯỢC GÂY CẢN TRỞ" ≥ 25 mm mặt trong (6.3.3).
  - Phạm vi 1 m phía trong không kê đồ (6.3.1, 6.3.2).
  - Không dùng cửa sổ giữa vì đó là WC.
- **Lan can trước cửa (quy tắc 6c): CẦN XÁC NHẬN** chiều cao lan can và khoảng ban công. Nếu lan can cản đưa người vào từ thang xe thì làm một cánh lan can mở được, hoặc hạ lan can tại ô đó. Ghi rõ trên mặt đứng.
- **T10:** sân thượng có lan can hở, tiếp cận được. Nếu giữ khai thác thì đánh dấu một vị trí lan can phía Tây.

## 7. Bán hầm (mẫu tn-ham-hai-tang, phần áp dụng được)
- **Hiện trạng:** 1 bán hầm, 454 m², đỗ ô tô. Có dốc phía Tây. Thang từ hầm tách khỏi buồng thang trên bằng tường TG1 ở T1.
- **Đánh giá:** hầm > 300 m² phải ≥ 2 lối (3.2.6.1 e). Có 2 thang và dốc xe nên sơ bộ đạt. Điều kiện "từ 2 tầng hầm thì N2/N3" không áp dụng vì chỉ có 1 bán hầm. CẦN XÁC NHẬN:
  - thang hầm của BTB2 có ra ngoài trực tiếp không, hay nhập vào buồng thang trên;
  - cửa ngăn cháy tự đóng giữa gara và buồng thang.
- **Giải pháp:** ở T1, ngăn thang hầm bằng vách và cửa ngăn cháy, cho ra ngoài hoặc ra tiền sảnh ngăn cháy (như mục 4).

## 8. Mẫu lọc ra nhưng không dùng
- **Thang loại 3 (ngoài nhà):** cho phép ở nhà 28–50 m nếu chống rơi ngã toàn bộ (3.4.11). Ba phía sát nhà dân, mặt Tây là mặt tiền 10 m, nên không khả thi.
- **Hành lang bên:** hành lang ở đây là hành lang trong, không hở.
- **Lối ra khẩn cấp:** không cần, vì đã đủ 2 lối thoát nạn.

## Tóm tắt việc người thiết kế cần sửa (thoát nạn)
1. BTB1, BTB2 thành N2/N3: khoang đệm ≥ 3 m² (≥ 6 m² ở sảnh thang máy chữa cháy), tăng áp, điện 2 nguồn. (3.4.13, 3.4.9)
2. Bản thang 1,2 m cho cả hai buồng thang và cửa vào thang ở T2 ≥ 1,2 m; hoặc giới hạn T2 ≤ 200 người. (3.4.1, 3.2.9)
3. T1: lối ra BTB1 không đi qua bếp; tiền sảnh ngăn cháy cho BTB2. (3.4.7)
4. Sân thượng T10: kéo BTB1 lên, hoặc ghi là mái không khai thác. (3.2.6.1)
5. Lối vào trên cao: cửa ban công VIP 01 mặt Tây mỗi tầng T2–T9, đánh dấu tam giác và chữ, xử lý lan can. (6.3.1–6.3.5)
6. Ghi rõ trên bản vẽ: số người thiết kế T2, sprinkler toàn nhà, nhóm F từng tầng.

## Giả định, chưa kiểm
- Đã đọc lại các trang 3, 6, 8, 10, 17. Các tầng 4–9 coi như giống T3.
- Chưa tính:
  - chiều dài thoát nạn từng phòng theo Bảng G.1/G.2;
  - bề rộng hành lang cánh Đông 1,15 m;
  - hút khói hành lang.
- Số người T2 tính theo phòng ăn 1,5 m²/người. Nếu cơ quan thẩm định coi là hội trường (1,0 m²/người) thì khoảng 425 người. Khi đó tổng bề rộng cần 425/165 ≈ 2,6 m, lớn hơn 2 x 1,2 = 2,4 m, nên phương án a không đủ. Cần mỗi bản thang và cửa ≥ 1,3 m, hoặc giới hạn số người: CẦN XÁC NHẬN với người thiết kế.
- Hình khoanh: `tu_van_v3_khoanh.pdf` (T1, T2, T3, T10, mặt đứng Tây), vẽ bằng `ve_v3.py`.
