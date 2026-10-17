# SKILL: Quy trình thẩm định bản vẽ PCCC (điều phối)
Skill này chỉ điều phối thứ tự làm việc. Chi tiết từng chuyên đề nằm ở các module trong `skills/` và tri thức trong `knowledge/`. Mở file nào cần file đó, không đọc hết.

## Nguyên tắc
1. **Thông tin trước, kết luận sau.** Lấy toàn bộ thông tin công trình, ghi một lần vào `knowledge/truong-thong-tin.md` (mỗi trường kèm nguồn và trạng thái). Mọi bước sau chỉ đọc từ đó.
2. **Từ thông tin suy ra yêu cầu, từ yêu cầu mới đối chiếu.** Không so thẳng bản vẽ với điều khoản; luôn qua bước "yêu cầu của công trình này là gì".
3. **Một công năng một bảng đối chiếu** (`bang_doi_chieu/`). Kết luận viết ngay tại dòng của bảng, kèm lý do có số.
4. **Bốn kết luận**: ĐẠT · CHƯA ĐẠT · CẦN XÁC NHẬN · KHÔNG ÁP DỤNG. Thiếu dữ liệu hoặc chưa nạp quy chuẩn thì CẦN XÁC NHẬN, không đoán. Ngoài ra khung trên bản vẽ có nhãn thứ năm **CHỈNH BẢN VẼ** (sai sót hoặc thiếu ghi chú đã rõ cách sửa, vd. ghi nhầm D1 thay FD1, thiếu ghi chú chiều cao PCCC): ghi cạnh kết luận của dòng, không đổi kết luận của thiết kế.
5. **Khoanh trên bản vẽ**: mỗi dòng CHƯA ĐẠT hoặc CẦN XÁC NHẬN có một khung chữ nhật đánh số, số khung trùng số dòng trong bảng, comment ghi lý do và số liệu.
6. **Không bịa trị số quy chuẩn**: tra file nguyên văn; không có thì ghi "cần tra".
7. **Hỏi khi chưa hiểu**: trường `thieu` hoặc bản vẽ mâu thuẫn thì hỏi user, không chọn hộ.
8. **Chuyển dữ liệu giữa các skill được phép**, theo bảng "ai tạo, ai dùng" trong `knowledge/truong-thong-tin.md`; luôn ghi nguồn khi ghi thêm trường.

## Các giai đoạn
| GĐ | Việc | Đầu ra | Dùng |
|---|---|---|---|
| 0 | Nạp hồ sơ: PDF thành ảnh, chữ có vị trí; phân loại trang (mặt bằng từng tầng, mặt cắt, bảng thống kê, ghi chú, bản vẽ hệ thống) | danh sách trang | `scripts/prep_for_llm.py` |
| 1 | Lập thông tin công trình: nhánh A thông số, nhánh B cờ có/không, nhánh C hình học thoát nạn. Dùng cột "Nội dung thiết kế" của bảng chính thức làm danh sách việc cần đọc ở bản vẽ | `truong-thong-tin` đã điền, trường thiếu có danh sách câu hỏi | `knowledge/truong-thong-tin.md`, `bang_doi_chieu/DANH_MUC.md` |
| 2 | **Chọn bộ bảng đối chiếu**: một bảng công năng (karaoke F2.1 dùng B15) và các bảng hệ thống theo cờ có/không (B34 chống tụ khói, B35 báo cháy, B36–B39 chữa cháy, B45 bình chữa cháy, B46 đèn sự cố và loa, B48 nguồn điện, B49 chống sét, B50 thang máy chữa cháy). Rồi suy ra yêu cầu Y01–Y22 từ thông tin | danh sách bảng áp dụng, bảng "yêu cầu của công trình" | `bang_doi_chieu/DANH_MUC.md`, các MOD_* |
| 3 | Yêu cầu hệ thống PCCC: mở các bảng hệ thống đã chọn, đọc cột "Nội dung quy định" (đã trích TCVN 3890:2023, 5738:2021, 13456:2022…) bằng `bang_doi_chieu_tool.py dong`. Danh mục nhà bắt buộc phải có hệ thống nằm ở Phụ lục A TCVN 3890 (chưa nạp): kết luận "có bắt buộc không" là CẦN XÁC NHẬN | các bảng hệ thống đã điền | `bang_doi_chieu/he_thong/B*.md` |
| 4 | Đo hình học: điểm xa nhất, các đoạn L, đường chéo D, khoảng giữa 2 lối | `routes.json`, số đo ước lượng ±1–2 m | `MOD_tinh_toan_khoang_cach.md` |
| 5 | Đối chiếu: tạo bảng làm việc từ mẫu chính thức (`bang_doi_chieu_tool.py lamviec B15 <file>`), điền cột Nội dung thiết kế và Kết luận kèm lý do cho từng dòng. Cột "Tra ở" chỉ ra module hoặc bảng cần mở | bảng đối chiếu đã điền | `bang_doi_chieu/B15_karaoke_vu_truong.md` |
| 6 | Ghi chú lên bản vẽ: khung chữ nhật đánh số trùng cột Khung của bảng, comment, mũi tên đường thoát nạn | PDF có chú thích | `scripts/annotate_karaoke.py` (cần chuyển vào `src/`) |
| 7 | Rà soát chéo: số lệch, ghi chú sai hình, dòng thiếu nguồn, kết luận mâu thuẫn | danh sách lỗi và điểm nghi vấn | `SKILL_thoat_nan.md` mục 5 |
| 8 | Xuất kết quả và học: báo cáo, cập nhật ca mẫu; điều user sửa thì vào memory | báo cáo, ca mẫu, memory | `memory/`, `VI_DU_*` |

## Bảng đối chiếu chính thức
- Dùng nguyên khung của bảng "đối chiếu / thẩm duyệt thiết kế về phòng cháy và chữa cháy" (thư mục `D:\$.4. QC - TCVN\Bảng đối chiếu sửa đổi 1\`), cột TT, Nội dung đối chiếu, Nội dung thiết kế, Quy định, Khoản Điều, Kết luận. Không tự đặt khung khác.
- Đọc bảng bằng `scripts/bang_doi_chieu_tool.py` (lệnh `khung`, `dong`, `tim`, `lamviec`) để không nạp cả file vào ngữ cảnh. Bảng .doc (B20, B26–B30, B40–B44, B47) chưa đọc được, cần lưu thành .docx.
- Dòng nào thuộc phần đã nạp (Điều 3, Phụ lục B, D, G) thì tra module ở cột "Tra ở". Dòng thuộc phần chưa nạp (Điều 4–7, Phụ lục A, C, E, F, H, tiêu chuẩn hệ thống) thì đọc cột "Quy định" của chính bảng, kết luận theo đó và ghi nguồn là "bảng đối chiếu chính thức".
- Kết luận trong cột Kết luận gồm trạng thái và lý do có số. Dòng CHƯA ĐẠT và CẦN XÁC NHẬN ghi số khung.
## Cách chọn module cho mỗi giai đoạn
Xem bảng mở file ở `SKILL_thoat_nan.md` (lối ra, cửa, số lối, tính toán, hành lang, thang, chống khói, vật liệu, hình Phụ lục I) và `knowledge/dinh-nghia/dinh-nghia.md` (định nghĩa).

## Khi học thêm điều khoản
Điều khoản mới nạp vào **file nguyên văn tương ứng** (module hoặc Phụ lục), định nghĩa vào `knowledge/dinh-nghia/`, trường thông tin mới vào `knowledge/truong-thong-tin.md`, dòng kiểm tra mới vào `bang_doi_chieu/` của công năng liên quan. Không chép cùng một nội dung vào hai nơi.
- Khi nạp từ PDF quy chuẩn hợp nhất có chữ gạch: **dò chữ gạch theo từng chữ, không theo dòng** (một dòng có thể chỉ gạch một nửa; bỏ cả dòng sẽ mất phần còn hiệu lực, ví dụ EI15 ở 3.3.5). Có thể dùng get_text('words') cùng đường kẻ ngang qua giữa chữ.
