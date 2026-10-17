# Hệ thống kiểm tra bản vẽ PCCC – cấu trúc thư mục (cập nhật 17/10/2026)

Mở `so_do/quy_trinh_tham_dinh_chi_tiet.html` để xem quy trình từng giai đoạn kèm giải thích cho người mới. Mở `so_do/so_do_kien_truc_he_thong.html` để xem kiến trúc module.

## Ba lớp, mỗi lớp một việc
| Lớp | Thư mục | Chứa gì | Khi nào mở |
|---|---|---|---|
| Quy trình | `skills/SKILL_quy_trinh_tham_dinh.md`, `skills/SKILL_thoat_nan.md` | thứ tự làm việc, nguyên tắc, bảng chỉ mục | luôn mở đầu tiên |
| Tri thức | `knowledge/` | định nghĩa (`dinh-nghia/`), danh mục trường thông tin (`truong-thong-tin.md`) | khi cần nghĩa của một khái niệm hoặc tên trường |
| Điều khoản | `skills/MOD_*.md`, `skills/PHU_LUC_G_QCVN06.md` | nguyên văn QCVN 06 sửa đổi 01 đã rút gọn, theo chuyên đề | chỉ mở module cần cho dòng đang xét |
| Đối chiếu | `bang_doi_chieu/` | bảng chính thức giữ nguyên khung: `DANH_MUC.md` (chọn bảng), `B15_karaoke_vu_truong.md` (bảng làm việc cho karaoke), `he_thong/` (báo cháy, chữa cháy, đèn sự cố, nguồn điện…). Gốc mẫu: `D:\$.4. QC - TCVN\Bảng đối chiếu sửa đổi 1\` | giai đoạn 2, 3, 5 |
| Ví dụ | `skills/VI_DU_hoang_anh_1.md`, `ket_qua/` | ca đã làm | khi cần so cách làm |

## Module điều khoản (trong `skills/`)
| File | Điều khoản |
|---|---|
| MOD_loi_ra_va_cua | 3.1, 3.2.1–3.2.4, 3.2.9–3.2.14 |
| MOD_so_luong_loi_ra | 3.2.5–3.2.7 |
| MOD_tinh_toan_khoang_cach | 3.2.8, tính số người, mật độ, bề rộng, chiều dài |
| PHU_LUC_G_QCVN06 | Phụ lục G (G.1–G.3, Bảng G.1–G.9) |
| MOD_hanh_lang_bao_che | 3.3.1–3.3.7 |
| MOD_cau_thang_buong_thang | 3.4.1–3.4.17, loại thang, khi nào cần N1 |
| MOD_hinh_Phu_luc_I_cau_thang | Hình I.1–I.9 |
| MOD_vat_lieu_hoan_thien | 3.3.4, 3.5, Phụ lục B |
| MOD_chong_khoi_PL_D | Phụ lục D |
| SKILL_ngan_chay_cong_nang | 4.5, F1.3, tỉ lệ cửa/tường |

## Chưa nạp
Toàn văn TCVN 3890:2023 (đặc biệt Phụ lục A: danh mục nhà phải trang bị hệ thống), TCVN 5738, 7336, 13456 (chỉ có phần đã trích trong bảng đối chiếu chính thức); Phụ lục A, C, E, F, H; Điều 4 đến 7 của QCVN 06 (trừ 4.5; có thể tạm đọc từ cột Quy định của bảng đối chiếu); các bảng .doc.

## Lưu ý
- Bản QCVN dùng là bản hợp nhất có chữ cũ bị gạch: chỉ nạp chữ hiện hành.
- Số đo trên bản vẽ là ước lượng ±1–2 m, chưa đo trên CAD.
- `scripts/bang_doi_chieu_tool.py` đọc bảng đối chiếu .docx tiết kiệm token (khung, một dòng, tìm từ khóa, tạo bảng làm việc); đổi `BANG_DIR` nếu thư mục bảng nằm ở nơi khác.
- `scripts/annotate_karaoke.py` có đường dẫn cứng tới máy cũ (SRC, OUT, FONT).