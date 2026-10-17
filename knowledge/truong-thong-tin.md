# Danh mục trường thông tin công trình và quy tắc suy ra yêu cầu
Đây là **nguồn dữ liệu chung duy nhất** của mọi skill và module. Một thông tin chỉ được đọc từ bản vẽ **một lần**, ghi vào đây kèm nguồn; mọi module sau đó đọc lại từ đây, không đọc lại bản vẽ và không tự ghi một bản khác. Module nào tính ra một trường mà module khác cần thì ghi trường đó vào đây (cho phép chuyển dữ liệu giữa các skill).

## Quy tắc ghi mỗi trường
- Mỗi trường có: **giá trị**, **nguồn** (trang, bảng, ghi chú; hoặc "user xác nhận"; hoặc "tạm tính"), **trạng thái**.
- Trạng thái: `doc` (đọc thẳng từ bản vẽ) · `do` (đo, ước lượng ±1–2 m) · `suy` (suy từ trường khác, ghi công thức) · `user` (user xác nhận) · `tam` (giá trị tạm, phải ghi "tạm tính") · `thieu` (chưa có, phải hỏi user).
- Trường `thieu` làm các yêu cầu phụ thuộc có kết luận **CẦN XÁC NHẬN**, không được đoán thành ĐẠT hay CHƯA ĐẠT.
- Lỗi vô ý của bản vẽ (số lệch nhau, ghi nhầm kích thước) ghi vào cột "ghi chú nguồn" và nêu ở GĐ7; không tự chọn số đúng khi user chưa xác nhận.

## Nhánh A – thông số (đọc từ bảng thống kê, mặt cắt, ghi chú)
| Mã | Trường | Nguồn thường gặp | Dùng để suy ra |
|---|---|---|---|
| A01 | Công năng, nhóm nhà (F1.1, F2.1…) | bảng thống kê, tên hạng mục | chọn bảng đối chiếu; Y01–Y05, Y18 |
| A02 | Số tầng nổi, số tầng hầm | bảng thống kê, mặt cắt | Y02, Y03, Y19 |
| A03 | Chiều cao PCCC (m), chiều cao mái | bảng thống kê (ghi riêng "chiều cao PCCC") | Y03, Y12, Y15, Y17, Y18 |
| A04 | Diện tích mỗi tầng (m²), tổng diện tích, khối tích | bảng thống kê | Y02, Y03, Y17 |
| A05 | Bậc chịu lửa (I–V) | bảng thống kê | Y06, Y08, Y13, Y15 |
| A06 | Cấp nguy hiểm cháy kết cấu (S0–S3) | bảng thống kê | Y03, Y06 |
| A07 | Hạng nguy hiểm cháy nổ (chỉ F5: A–E) | bảng phân hạng | Y01, Y02, Y15 |
| A08 | Số người lớn nhất của nhà, của từng tầng | bảng thống kê, khối tính toán | Y01–Y03, Y07, Y08 |
| A09 | Số người từng phòng (SL_LV), diện tích phòng | ghi trong phòng, bảng GHSN | Y01, Y07, Y08 |
| A10 | Đường chéo lớn nhất D của tầng, của phòng | đo trên mặt bằng hoặc ghi trên bản vẽ | Y05 |

## Nhánh B – cờ có/không (hiện trạng thiết kế)
| Mã | Trường | Nguồn | Dùng để suy ra |
|---|---|---|---|
| B01 | Toàn nhà có chữa cháy tự động sprinkler | bản vẽ chữa cháy, ghi chú | Y05 (⅓D), Y17 (miễn hút khói), Y18 (miễn vật liệu) |
| B02 | Có báo cháy tự động (đầu khói/nhiệt) | bản vẽ báo cháy | Y03, Y17, Y24 |
| B03 | Hành lang bên hay hành lang trong | mặt bằng (có lỗ mở tường ngoài hay không) | Y13, Y14 |
| B04 | Có sảnh thông tầng, khoang cháy riêng, nhiều công năng | mặt bằng | Y20 |
| B05 | Có tầng hầm/nửa hầm | mặt cắt | Y19 |
| B06 | Có thang máy, thang máy chữa cháy | mặt bằng | Y15, Y17 |
| B07 | Tường ngoài có ô cửa mở được (thoát khói tự nhiên) | mặt đứng, mặt bằng | Y17 |
| B08 | Có phòng trực PCCC, bơm, bể nước | bản vẽ riêng | Y24 |

## Nhánh C – hình học và thiết bị trên đường thoát nạn (đọc hoặc đo từng tầng)
| Mã | Trường | Nguồn | Dùng để suy ra |
|---|---|---|---|
| C01 | Danh sách lối ra thoát nạn mỗi tầng: tên, cửa, bề rộng, loại cửa, GHCL, chiều mở | mặt bằng, bảng ký hiệu cửa | Y01, Y04, Y08, Y10, Y11, Y12, Y14 |
| C02 | Loại cầu thang (1/2/3) và loại buồng thang (L1/L2/N1–N3) | mặt bằng, hình | Y14, Y15, Y16 |
| C03 | Bề rộng, bề cao hành lang; vật cản | mặt bằng | Y09 |
| C04 | Cửa mở ra hành lang: GHCL, cơ cấu tự đóng | bảng ký hiệu cửa | Y12, Y13 |
| C05 | Đoạn tường bao che hành lang: vật liệu, GHCL | ghi chú, bảng ngăn cháy | Y13 |
| C06 | Điểm xa nhất, các đoạn L, đường đi | đo trên mặt bằng | Y06 |
| C07 | Diện tích đường thoát nạn S1 | tính từ các đoạn hành lang | Y07 |
| C08 | Khoảng cách giữa 2 lối ra (cạnh xa, cạnh gần) | đo | Y05 |
| C09 | Vật liệu hoàn thiện tường, trần, sàn: hành lang, buồng thang, phòng | ghi chú vật liệu | Y18 |
| C10 | Bản thang: bề rộng, bậc, chiều cao bậc | mặt bằng thang | Y22 |
| C11 | Hệ thống hút khói/thoát khói hiện có | bản vẽ hút khói | Y17 |
| C12 | Hệ thống đèn chỉ dẫn, đèn sự cố | bản vẽ EX–EM | Y23 |

## Quy tắc suy ra yêu cầu (từ trường thông tin → yêu cầu theo QCVN 06)
Mỗi dòng là một yêu cầu cần xét. Cột "Tra ở" là file chứa nguyên văn điều khoản và bảng.
| Mã | Yêu cầu cần suy ra | Đầu vào | Quy tắc tóm tắt | Điều | Tra ở |
|---|---|---|---|---|---|
| Y01 | Gian phòng cần mấy lối ra | A01, A08, A09, A07, C06 | ≥ 2 lối nếu phòng ≥ 50 người, hoặc F1.1 > 15, hầm > 15, khoảng cách tới lối ra > 25 m, … | 3.2.5 | MOD_so_luong_loi_ra |
| Y02 | Tầng cần mấy lối ra | A01, A04, A08 | F1.1, F1.2, F2.1, F2.2, F3, F4 hoặc ≥ 50 người → ≥ 2 | 3.2.6.1 | MOD_so_luong_loi_ra |
| Y03 | Có được chỉ 1 lối không | A01–A06, A08, B01, B02 | các điều kiện diện tích, số người, chiều cao, sprinkler của 3.2.6.2 | 3.2.6.2 | MOD_so_luong_loi_ra |
| Y04 | Số lối của nhà không ít hơn tầng nào | Y02, Y03 | so sánh | 3.2.7 | MOD_so_luong_loi_ra |
| Y05 | Khoảng phân tán 2 lối | A10, B01, C08 | L ≥ ½D, nếu sprinkler toàn nhà ≥ ⅓D; cạnh xa ≥ 7 m, nhỏ hơn 7 m thì đo cạnh gần | 3.2.8, I.4, I.5 | MOD_tinh_toan_khoang_cach |
| Y06 | Chiều dài thoát nạn cho phép | A05, A06, C06, C07 | theo Bảng G.2a: bậc, mật độ, cửa ở giữa 2 lối hay hành lang cụt; karaoke đo từ cửa phòng | G.1.2.1, G.2a | PHU_LUC_G_QCVN06 |
| Y07 | Mật độ dòng người | A08, C07 | số người / S1 | G.2a ghi chú 1 | PHU_LUC_G_QCVN06 |
| Y08 | Bề rộng lối ra | A05, A08, A09, C01 | n = N/165 (bậc I–II), 115 (III–IV), 80 (V); cửa ≥ 0,8 m, ≥ 1,2 m khi > 50 người | G.2.1.1, 3.2.9 | PHU_LUC_G, MOD_loi_ra_va_cua |
| Y09 | Bề rộng hành lang | C03, A08 | ≥ 1,2 m khi > 50 người (công năng khác F1), cao ≥ 2 m; không vật cản | 3.3.6 | MOD_hanh_lang_bao_che |
| Y10 | Loại cửa trên lối ra | C01 | không cửa cuốn, cửa quay; cửa trượt, xếp theo điều kiện | 3.2.3 | MOD_loi_ra_va_cua |
| Y11 | Chiều mở cửa | C01 | mở theo chiều thoát; trừ phòng ≤ 15 người, WC, kho ≤ 200 m², F1.3, F1.4 | 3.2.10 | MOD_loi_ra_va_cua |
| Y12 | Cửa mở ra hành lang có phải cửa chống cháy | C04, A01 | karaoke: mọi cửa mở ra hành lang phải chống cháy, kể cả WC, kho; GHCL "-" là chưa đạt | 3.3.5 | MOD_hanh_lang_bao_che |
| Y13 | Hành lang có được bao che đúng không | C05, A05, B03 | bậc I EI30; bậc II–IV vật liệu không cháy/cháy yếu; karaoke bắt buộc bao che | 3.3.5 | MOD_hanh_lang_bao_che |
| Y14 | Lối ra có hợp lệ theo loại thang và tầng | C01, C02, B03, A03 | theo bảng "từ loại thang → lối ra" | 3.2.1, 3.2.2 | MOD_cau_thang_buong_thang |
| Y15 | Phải dùng loại buồng thang nào | A03, A01, A07, C02 | > 28 m hoặc F5 A/B → N1 (hoặc thay thế); ≤ 28 m: L1, thang loại 3 được | 3.4.13, 3.4.11, 3.4.12 | MOD_cau_thang_buong_thang |
| Y16 | Buồng thang có đủ chiếu sáng | C02 | L1: lỗ ≥ 1,2 m² tường ngoài mỗi tầng; L2: mái ≥ 4 m² | 3.4.8 | MOD_cau_thang_buong_thang |
| Y17 | Hút xả khói hay thoát khói tự nhiên | A01, A03, A04, A08, B01, B07, C11 | hành lang dài > 15 m không thông gió tự nhiên; phòng ≥ 50 m² đông người; miễn nếu sprinkler (phòng ≤ 200 m²) | PL D (D.2, D.3) | MOD_chong_khoi_PL_D |
| Y18 | Cấp vật liệu hoàn thiện | A01, A03, B01, C09 | Bảng B.8 cho đường thoát nạn; Bảng B.9 và 3.5.10 cho gian phòng chung | 3.3.4, 3.5, PL B | MOD_vat_lieu_hoan_thien |
| Y19 | Lối ra tầng hầm | B05, A02 | theo 3.2.2 | 3.2.2 | MOD_loi_ra_va_cua |
| Y20 | Lối ra khi nhiều công năng, khoang cháy | B04 | khoang cháy có lối riêng; ≤ 50% lối qua khoang lân cận; F5 lối riêng | 3.2.4 | MOD_loi_ra_va_cua |
| Y21 | Đường thoát nạn có đi qua nơi không được tính | C01, C02 | thang máy, thang cuốn, mái không dùng… | 3.3.3 | MOD_hanh_lang_bao_che |
| Y22 | Bản thang, bậc thang | C10, A08 | bản thang ≥ 0,9 m (hoặc theo 3.4.1); bậc, dốc theo 3.4.2 | 3.4.1, 3.4.2 | MOD_cau_thang_buong_thang |
| Y23 | Chiếu sáng sự cố, chỉ dẫn thoát nạn, loa thông báo | C12 | đối chiếu bảng B46: độ rọi 1 lux đường thoát nạn (đến 2 m rộng), 0,5 lux gian phòng, biển EXIT, sơ đồ chỉ dẫn; loa theo TCVN 3890:2023 mục 5.7.2 | 3.3.1, TCVN 3890:2023, TCVN 13456:2022 | bang_doi_chieu/he_thong/B46.md (nguyên văn quy định nằm trong bảng) |
| Y24 | Hệ thống PCCC theo công năng (báo cháy, chữa cháy, họng nước, bình chữa cháy, chống tụ khói, nguồn điện, chống sét, thang máy chữa cháy) | A01, A03, A04, B01, B02 | mở bảng hệ thống tương ứng (B34, B35, B36–B39, B45, B48, B49, B50): yêu cầu kỹ thuật so theo nguyên văn trong bảng. Danh mục nhà bắt buộc phải có hệ thống nằm ở Phụ lục A TCVN 3890:2023 (chưa nạp): 'có bắt buộc không' là CẦN XÁC NHẬN | 3.1.8, 4.31, TCVN 3890:2023, TCVN 5738:2021, TCVN 7336:2021 | bang_doi_chieu/he_thong/ |

## Bảng "ai tạo, ai dùng" – chuyển dữ liệu giữa skill
| Trường | Do ai tạo | Ai dùng |
|---|---|---|
| A01–A07 | GĐ1 (đọc bảng thống kê) | mọi module |
| A08, A09 | GĐ1; tổng hợp từ ghi chú phòng | tính toán, số lối ra |
| A10, C06, C07, C08 | GĐ4 (đo hình học) | tính toán khoảng cách, phân tán |
| B01 | GĐ1, kiểm với bản vẽ chữa cháy | phân tán, chống khói, vật liệu |
| C01, C02, C04 | GĐ1 (đọc mặt bằng, ký hiệu) | lối ra và cửa, thang, hành lang |
| Y01–Y24 | GĐ2, GĐ3 | GĐ5 (bảng đối chiếu) |
Khi một module cần trường mà trường đó `thieu`: không tự đọc lại bản vẽ trong module; báo lại GĐ1 để hỏi user, rồi trường được ghi bổ sung ở đây.

## Liên hệ với bảng đối chiếu chính thức
- Bảng chính theo công năng: ang_doi_chieu/DANH_MUC.md (karaoke F2.1 dùng B15). Mỗi dòng bảng có cột Khoản Điều; mã Y01–Y24 ở trên là cách nhóm các dòng đó theo quy tắc suy ra, không thay thế khung bảng.
- Khi lập bảng thông tin, đọc cột "Nội dung thiết kế" của bảng chính thức: đó là gợi ý của chính mẫu về thứ phải lấy từ bản vẽ (ví dụ số tầng theo Bảng H.2, H.7; chiều cao PCCC; tường ngoài có ô cửa mở).
