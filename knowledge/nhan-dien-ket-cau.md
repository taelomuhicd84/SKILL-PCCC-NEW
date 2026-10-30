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

## Học ký hiệu tường / tường có cửa / vách từ bản vẽ tô màu (`scripts/hoc_ky_hieu.py`, 2026-10-30)
Người dùng tô trên ảnh chụp mặt bằng: ĐỎ tường, XANH LÁ tường có lỗ cửa đi/cửa sổ, XANH DƯƠNG vách (kính, panel). Script tự khớp ảnh với trang PDF (FFT, sai <= vài px), gán màu cho từng cặp nét, rút luật vào `data/ky_hieu/luat.json` (gộp nhiều mẫu), nhận diện trang khác và tự chấm điểm theo chiều dài. Claude chỉ đọc dòng điểm, không xem PDF.
Ký hiệu học được (Karaoke Hoàng Anh 11, KT, 1:100):
1. Tường = cặp nét liền song song (đen hoặc XÁM, tường xám vẫn là tường) cách 99–225 mm, giữa có gạch chéo 45° (~3–10 nét/m). TG1 = 200, TG2 = 100.
2. Tường có cửa = dải tường thẳng hàng có (a) khe 0,5–4 m mà một đầu cung cửa đi nằm trên đoạn khe (cung của cửa phòng bên cạnh KHÔNG tính: hành lang không phải cửa), hoặc (b) cặp nét không gạch (~100 mm) nằm trên trục tường = cửa sổ/ô kính (nét mặt tường ngoài vẫn liền qua cửa sổ). Cả dải thẳng hàng tô xanh lá như người dùng.
3. Vách = cặp nét sát nhau ~50 mm không gạch, không nằm trên trục tường (vách WC, vách kính).
Điểm tự chấm trên chính trang mẫu (bản đầu, trước mẫu 2): tường phủ 0,82 / đúng 0,92; tường có cửa 0,91 / 0,64; vách 0,39 / 0,30. Còn sai: lan can thang, khung giếng thang máy (dấu X) bị nhận là vách; vách cạnh cửa D2 sót.
Mẫu 2 Karaoke Hoàng Yến (người dùng vẽ chú thích Line màu trên bản sao PDF, 2026-10-30; script đọc thẳng, không cần khớp ảnh). THỬ KHÁCH QUAN bằng luật chỉ học từ mẫu 1: tường 0,86/0,87; tường có cửa 0,88/0,59; vách ban đầu nhận nhầm 185 m (dòng kẻ bảng, khung tên) → thêm luật 4.
4. Vách phải tì ít nhất một đầu vào tường (<= 0,4 m). Sau luật này vách Hoàng Yến 1,0/1,0; Hoàng Anh 0,30/0,55 (sót vách đứng tự do).
5. QUY ƯỚC (người dùng chốt 2026-10-30, sửa cùng ngày): tường có cửa = MẢNG tường (giữa hai chỗ tường vuông góc giao vào) có lỗ cửa đi, cửa sổ; không lan cả đường thẳng hàng. Dải cắt tại điểm giao (kể cả khi mặt tường vẽ liền qua) và khe trống > 4 m.
6. Tường có thể vẽ bằng KHUNG CHỮ NHẬT (item re/qu, mẫu Karaoke SV - Gia Đình 2026-10-30) thay vì hai nét rời: tách 4 cạnh làm nét tường. Cạnh khung chỉ dùng cho tường có gạch; KHÔNG dùng cho vách/cửa sổ (khung cánh cửa, ký hiệu làm sai). Hoàng Yến tường độ đúng 0,85 → 0,75: phần dư phần lớn là tường thật người dùng không đánh dấu (vách WC 96 mm, tường giữa phòng VIP) và mẩu 0,6 m quanh cột.


## Nhận diện thang và lỗ thông tầng bằng hình học (Karaoke SV - Gia Đình, người dùng chốt 2026-10-30)
18. Mọi ô vẽ dấu X (hai đường chéo cắt nhau trong một khung) là LỖ THÔNG TẦNG (giếng trời lấy sáng), kể cả ô cạnh WC nam, ô góc trục 8, khe hẹp giữa WC nữ/nam (hai X hẹp ~3 pt xếp nối nhau) và ô cạnh thang cuốn. X cạnh thang cuốn bị cung thang cắt cụt đường chéo: khoanh theo cả hộp X, không theo góc còn thấy.
19. Thang thẳng = chuỗi ô chữ nhật (`qu`/`re`) cùng kích thước nối sát nhau, >= 4 bậc, xám. Khung thang PHẢI gồm cả chiếu nghỉ: nới ra các ô xám sát dãy bậc rồi tới khung đen nhỏ nhất bao quanh; không khoanh riêng dãy bậc.
20. Thang cuốn = cụm cung đen quanh lỗ X, không có dãy ô bậc. Nét xám chéo ngắn là gạch tường, không dùng nhận thang.
Mã thử nằm ở thư mục tạm của phiên, chưa đưa vào `scripts/`.
7. Cửa sổ chỉ khi đoạn trên trục tường MẤT gạch chéo (tường bị khoét); cánh cửa vẽ sát dọc tường không phải cửa sổ (lỗi cũ làm xanh cả tường giữa phòng SV - Gia Đình).
8. Cửa sát góc (chỉ có tường một bên khe): bản lề và một đầu cung đều nằm trên trục mảng, một cái sát đầu mảng (<= 0,3 m), cái kia cách 0,5–1,5 m cùng phía. Cửa của tường vuông góc có bản lề ở góc: đầu cung nằm TRONG mảng nên không tính.
9. Mẩu tường chỉ có gạch chéo, thiếu nét mặt (mẩu ~0,4 m cạnh cửa Dw WC, người dùng chỉ 2026-10-30): cụm gạch ngoài mọi cặp tường → mẩu tường theo khung bao (`cum_gach`).
Điểm sau các luật 5–9 (chấm theo từng điểm trên đoạn): Hoàng Anh tường 0,95/0,67, tường có cửa 0,75/0,73; Hoàng Yến tường 0,80/0,51, tường có cửa 0,81/0,51 (đáp án Hoàng Yến thiếu nhiều tường giữa phòng nên độ đúng thấp). SV - Gia Đình chưa có đáp án; người dùng soát bằng mắt.

21. Thử trên Karaoke Thanh Liêm (3 trang) + KT11 (2026-10-30), bài học cho `scripts/nhan_dien_thang_lo.py`: (a) ô X LỚN chiếm gần cả mặt bằng gác lửng / tầng kỹ thuật = phần không có sàn (lỗ thông tầng lớn), có thể chia 2–3 ô X cạnh nhau; (b) hai đường chéo của một X có thể lệch cạnh tới ~10% cạnh dài (ngưỡng ghép: max(2 pt, 10%)); (c) lưới gạch chéo vùng "đất trống", mái (nhiều ô X cùng cỡ xếp sát) KHÔNG phải lỗ; còn sót vài ô nhỏ ~14 pt nhận nhầm, chưa lọc; (d) thang sắt nhỏ CT2 chỉ 3 bậc (ô 3x7 pt), thang BTCT CT1 vẽ kiểu khác, chưa nhận; (e) thang cuốn chưa tự nhận được: đếm cung bị nhầm cung cửa WC (6 cung), cần dò cung đồng tâm kèm nét tỏa tròn.
10. Theo ghi chú người dùng trên bản SV - Gia Đình (2026-10-30): (a) lỗ cửa thuộc mảng có cửa, vẽ xanh LIỀN qua lỗ (đường từ tường hành lang qua cửa Dw tới mẩu tường); (b) tường hộp kỹ thuật (ô dấu X) là tường đỏ, kể cả mẩu cạnh cửa: tường vuông góc CẮT NGANG trục cũng là chỗ giao; (c) cửa sát góc chỉ tính khi khoảng từ đầu mảng tới hai mép cửa trống (không có tường thẳng hàng khác phủ > 30 %), loại cửa của tường vuông góc có cánh mở dọc phần kéo dài; (d) chỉ tính cung cửa có màu phổ biến nhất trên trang trong các cung cỡ cánh cửa 0,6–2,3 m (Hoàng Yến cửa nét xám; SV cửa nét đen, cửa buồng WC nét xám bị bỏ). Kết quả: 8/8 nét ghi chú khớp (độ phủ 0,82–1,0); Hoàng Anh, Hoàng Yến giữ điểm (chấm bỏ đoạn lỗ cửa vì đáp án dựng từ cặp nét).

