# Note của tôi – vào dự án nhanh
File này Claude cập nhật. Mỗi lần tôi bảo "cập nhật từ github", Claude báo đã ghi gì mới ở đây, ở `TIEN_DO.md` và `BAT_DAU_PHIEN_MOI.md`. Gần hết usage thì Claude ghi xong việc đã làm vào ba file này rồi mới đẩy TOÀN BỘ code lên GitHub (trừ `ket_qua/`).

## Việc đang theo dõi
1. Test Gemini thay Claude phần Mục 4 (bãi đỗ xe chữa cháy): tạm thấy ổn, nhưng CHƯA thay, để từ từ thay luôn. Khi nào tôi bảo mới chuyển; trước đó dự án chính vẫn chạy Claude.

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
### 2026-10-22
- Tạo agent thử Gemini cho Mục 4 (10 tab ẩn, gói theo giới hạn token). Chạy thật hồ sơ Hoàng Hùng: 18/18 dòng, nhưng Gemini bỏ sót nhãn cự ly 2000/5385 và hay bị Google đòi CAPTCHA khi nhiều tab. Chưa so được với Claude vì chưa chạy Claude cùng hồ sơ.
- Khung vị trí đã sửa tay đúng toạ độ: `ket_qua/hoang_hung/gemini_m04/ket_qua_khoanh.json` (thư mục `ket_qua/` không lên GitHub).
- Web build lại (`web/dist` không nằm trong git: máy nào kéo code mới cũng phải `npm run build`).
- Runner tự học tự sửa `knowledge/hoc/*.md` khi bật: xem trước khi commit.
