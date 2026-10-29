# Nhận diện kết cấu trên bản vẽ (trục, cột, dầm, khoang dầm, vì kèo)
Dùng để đặt đầu báo, đầu phun theo khoang dầm và khoanh lên bản vẽ. Công cụ: `scripts/nhan_dien_ket_cau.py` (PDF vector, tự động). Tường: `scripts/nhan_dien_tuong.py`.

## Quy tắc người dùng dạy (2026-10-30)
1. Trên bản vẽ kiến trúc, vị trí giao cắt các trục thường có cột; có cột thì có dầm tại vị trí đó (dầm chính theo trục).
2. Bản vẽ đã có cột thì PHẢI nối dầm giữa hai cột liền kề, kể cả khi hai cột lệch trục, dầm chạy xiên (cánh nhà xiên). Không bỏ dầm chỉ vì cột không nằm đúng giao trục.
3. Ngoài dầm chính còn các dầm phụ; người dùng có thể vẽ thêm nét (mặc định màu đỏ) để đánh dấu dầm phụ.
4. Nguồn dầm, vì kèo khác: bản vẽ kết cấu riêng (ký hiệu D1, tiết diện), nét đứt hoặc ghi chú dầm trên kiến trúc, mặt bằng/mặt cắt mái (vì kèo). Người dùng sẽ train riêng; chưa có thì ghi giả định.

## Cách công cụ làm (để agent hiểu kết quả)
- Hai cột nối dầm khi mỗi cột là cột gần nhất của cột kia theo hướng chính (lệch tối đa 25°), xa tối đa 12 m: nối được cột lệch trục, không kéo đường chéo qua ô.
- Khoang dầm = vùng kín do dầm chính và dầm phụ bao quanh (mọi hình dạng), có diện tích và tâm.
- Kích thước dầm (cao, rộng) chưa đọc được: kết luận khoang dầm cho đầu báo (> 0,3 m…) phải ghi giả định hoặc CẦN XÁC NHẬN.

## Đối chiếu đáp án: mặt bằng đà kiềng KS Hoàng Hùng (người dùng đưa 2026-10-30)
Công cụ ra đúng: dầm theo mọi trục giữa hai cột ở cánh 1–7/A–C; dầm xiên theo cột ở cánh 7–8/D–E; dầm nối 6/A sang cột cánh xiên; dầm vùng mái che dưới trục C. Rút kinh nghiệm:
5. Nhịp lớn có DẦM PHỤ giữa nhịp, gối lên dầm chính (không cần cột): cánh 7–8 rộng ≈ 9 m có dầm dọc giữa nhịp DK(400x600) chạy từ trục E xuống C. Khi khoang dầm có cạnh ngắn > khoảng 6–7 m mà bản vẽ không có dầm phụ thì ghi "có thể có dầm phụ giữa nhịp, CẦN XÁC NHẬN"; không coi là một khoang lớn chắc chắn.
6. Lỗ mở có DẦM BO: quanh lõi thang máy (khung dầm kín 4 cạnh) và quanh buồng thang bộ (dầm đỡ thang, chiếu nghỉ). Lõi thang máy là một khung dầm, không phải một cột.
7. Tiết diện ghi trên bản vẽ kết cấu dạng `DK(250x400)`, `D1(220x500)` (b x h, mm), chữ đặt dọc theo dầm (dầm dọc thì chữ xoay 90°); có mặt cắt chi tiết kèm cốt thép và cao độ. Đọc chữ này gán cho dầm gần nhất cùng hướng.
8. Kích thước theo nhịp (dùng khi chưa có bản vẽ kết cấu, ghi "ước lượng"): nhịp 4–6 m: 250x400; nhịp ≈ 7,3 m: 400x600; nhịp ≈ 9 m: 600x800 (h ≈ L/11–L/12, dầm biên và nhịp ngắn dùng tiết diện nhỏ nhất).
9. Mặt bằng ĐÀ KIỀNG (cao độ -1.300) là dầm móng, không phải dầm sàn: bố trí thường giống dầm sàn nhưng tiết diện khác. Đặt đầu báo, đầu phun theo khoang dầm phải dùng mặt bằng dầm SÀN của đúng tầng; chỉ có đà kiềng thì ghi giả định.

## Học từ bộ kết cấu Hoàng Hùng người dùng vẽ (`21412552.pdf`: đà kiềng, dầm sàn tầng 1–9, dầm mái), 2026-10-30
Người dùng chốt: PCCC chỉ cần XÁC NHẬN VỊ TRÍ DẦM; kích thước dầm lấy từ bản vẽ kết cấu nếu có, không thì người dùng nói (vd "dầm cao 500").
10. Mọi trục có cột hai đầu đều có dầm giữa hai cột liên tiếp, cả hai phương (cánh 1–7: dầm ngang theo trục 2…7 và dầm dọc theo A, B, C).
11. Dầm suốt trục giữa hai cột đầu trục dù nhịp dài, không có cột giữa (trục 7' cánh xiên: chỉ có cột ở E và C, dầm dọc chạy suốt, gối lên các dầm ngang D, A, B). Công cụ: lượt 2 của `dam_chinh` (cột thẳng hàng nhất, <= 30 m, đường nối cắt dầm ngang).
12. Lõi thang máy là khung dầm kín bốn cạnh (vẽ đậm). Ô cầu thang, lỗ mở vẽ dấu X (ô trống, không sàn) có dầm bao quanh; ô X không lắp đầu báo/đầu phun theo sàn.
13. Sàn đua ra ngoài cột (sân đón, ban công, ô văng) có dầm biên chạy theo mép sàn + dầm công xôn từ cột ra: tầng 1 có dầm biên quanh sân phía trục 1 (cách trục ≈ 1,2 m, góc bo tròn); tầng 8 có hai ban công bo tròn ở mặt trục 1. Công cụ CHƯA tự vẽ dầm biên: nhìn mép sàn trên kiến trúc, ghi CẦN XÁC NHẬN.
14. Tầng có chia phòng nhỏ (tầng 8 khách sạn) có thêm dầm phụ đỡ tường ngăn giữa các khung (cánh xiên tầng 8 thêm 3 dầm dọc). Dầm phụ thường trùng TƯỜNG XÂY của tầng trên: đọc tường tầng trên để đoán dầm phụ; công cụ chưa làm.
15. Dầm mái chỉ có ở phần mái tum (thang bộ, phòng máy); sân thượng phần còn lại không có dầm trên mặt bằng dầm mái.
16. Mặt bằng kết cấu (nét đôi song song = mép dầm, rộng 200–400 mm; chữ DS(bxh) dọc theo dầm, "DS(20x400)" là gõ thiếu số 0) có thể đọc tự động bằng cặp nét song song; đã thử, bắt được phần lớn dầm nhưng lẫn đường kích thước và mặt cắt chi tiết: chưa đưa vào công cụ.
17. KHÔNG có cột giữa hành lang, lối đi (người dùng sửa 2026-10-30, Karaoke Galaxy): giả định "giao trục có cột" chỉ đúng khi giao điểm nằm TRÊN TƯỜNG hoặc góc tường. Giao trục rơi vào giữa hành lang, lối đi, sảnh trống (vd trục 3, 7, 12 đoạn C–D Galaxy là lối đi dọc giữa các khối phòng) thì KHÔNG đặt cột và không vẽ dầm chạy dọc giữa lối đi đó. Trước khi giả định cột: kiểm giao điểm có nằm trên nét tường không; dầm chính chạy theo tường. Dầm vẫn được vượt ngang qua hành lang (gối hai đầu lên tường/cột hai bên).
