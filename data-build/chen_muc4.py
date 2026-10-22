"""Chèn Mục 4 (đường xe chữa cháy, bãi đỗ, lối vào từ trên cao) cho nhà sản xuất KT17 và nhà kho KT18.
Bảng nguồn (Excel Đồng Nai) không có mục này. Nguồn điều khoản: knowledge/qcvn06-dieu-6.md (QCVN 06:2022/BXD, sửa đổi 1:2023).
Chạy: python data-build/chen_muc4.py  (chạy lại được, dòng cũ idx 18–42 bị thay)."""
import json, os
BANG = os.path.join(os.path.dirname(__file__), "..", "data", "bang")
Q = "QCVN 06:2022/BXD"
def r(tt, nd, qd="", dieu="", goi_y=""):
    return {"tt": tt, "noi_dung": nd, "goi_y": goi_y, "quy_dinh": qd, "khoan_dieu": dieu, "ket_luan_mau": "", "tra_o": "", "so_o": 6}
ROWS = [
 r("4", "Đường giao thông phục vụ xe chữa cháy"),
 r("4.1", "Đường cho xe chữa cháy"),
 r("-", "Chiều rộng", "Chiều rộng thông thủy của mặt đường cho xe chữa cháy không được nhỏ hơn 3,5 m. Khi điều kiện sản xuất không yêu cầu có đường vào thì cho phép bố trí phần đường rộng 3,5 m cho xe chạy, nền đường gia cố bằng vật liệu chịu được tải trọng xe chữa cháy và bảo đảm thoát nước mặt.", f"Đ 6.2.1.1, 6.2.2.3 {Q}", "Hồ sơ cần ghi bề rộng thông thủy của từng đoạn đường chữa cháy (không tính phần bị cây xanh, trụ, rãnh chiếm)."),
 r("-", "Chiều cao thông thủy, kết cấu chặn phía trên", "Chỉ cho phép kết cấu chặn phía trên đường/bãi đỗ xe chữa cháy khi: thông thủy ≥ 4,5 m; kết cấu chặn dài ≤ 10 m; từ hai kết cấu trở lên thì cách nhau ≥ 20 m; đoạn cuối không bị chặn ≥ 20 m; chiều dài bãi đỗ không tính đoạn có kết cấu chặn.", f"Đ 6.2.1.3 {Q}"),
 r("-", "Khoảng cách từ mép đường cho xe chữa cháy đến tường nhà", "Không lớn hơn 5 m với nhà có chiều cao PCCC < 12 m; không lớn hơn 8 m với nhà 12 m đến 28 m; không lớn hơn 10 m với nhà > 28 m. Không quy định khoảng cách này khi không yêu cầu cứu nạn từ trên cao và lực lượng chữa cháy có phương án khác. Trường hợp cần thiết được tăng đến 60 m nếu có đường cụt kèm bãi quay xe và trụ nước; khi đó bãi quay xe cách nhà ≥ 5 m và ≤ 15 m, các đường cụt cách nhau ≤ 100 m.", f"Đ 6.2.2.3 {Q}", "Đo trên mặt bằng tổng thể từ mép đường tới tường ngoài từng hạng mục; ghi chiều cao PCCC từng hạng mục để chọn mức 5/8/10 m."),
 r("-", "Đường cụt, bãi quay xe", "Nếu đường hoặc bãi đỗ xe chữa cháy dạng cụt dài hơn 46 m thì cuối đoạn cụt phải có bãi quay xe, thiết kế phù hợp phương tiện chữa cháy của địa phương.", f"Đ 6.2.5, 6.4 {Q}"),
 r("-", "Đoạn tránh xe", "Đường nhỏ hẹp chỉ đủ một làn xe chạy: cứ ít nhất 100 m phải có đoạn mở rộng dài ≥ 8 m, rộng ≥ 7 m.", f"Đ 6.5 {Q}"),
 r("-", "Độ dốc đường", "Độ dốc của đường cho xe chữa cháy không được quá 1:8,3.", f"Đ 6.2.4 {Q}"),
 r("-", "Tải trọng, thông thoáng, đánh dấu", "Mặt đường và bãi đỗ chịu được tải trọng xe chữa cháy theo yêu cầu thiết kế và phù hợp phương tiện của cơ quan Cảnh sát PCCC và CNCH nơi xây dựng; luôn thông thoáng, khoảng không không bị cây xanh hay vật cố định cản trở; đánh dấu mọi góc bãi đỗ và đường bằng dải sơn phản quang, hai phía, khoảng cách không quá 5 m (trừ đường công cộng dùng làm đường chữa cháy).", f"Đ 6.2.7, 6.2.8, 6.2.9 {Q}"),
 r("4.2", "Bãi đỗ xe chữa cháy"),
 r("-", "Yêu cầu có bãi đỗ xe chữa cháy (nhà nhóm F5)", "Nhà nhóm F5 phải có bãi đỗ xe chữa cháy. Chỉ yêu cầu đường cho xe chữa cháy tiếp cận đến điểm bất kỳ trên hình chiếu bằng của nhà không lớn hơn 60 m (hoặc có phương án chữa cháy phù hợp khác) đối với: nhà F5 hạng A, B tổng diện tích sàn đến 300 m2; nhà F5 hạng C, D, E có diện tích và chiều cao không vượt giới hạn của nhà bậc chịu lửa V theo Phụ lục H.", f"Đ 6.2.2.3 c), 6.2.2.1 {Q}", "Cần hạng nguy hiểm cháy nổ, diện tích sàn, chiều cao, bậc chịu lửa của từng hạng mục."),
 r("-", "Chiều rộng bãi đỗ", "Theo Bảng 14 (các nhóm nhà còn lại): chiều cao PCCC ≤ 15 m không yêu cầu; > 15 m đến 28 m và > 28 m: rộng ≥ 6 m.", f"Đ 6.2.1.2, Bảng 14 {Q}"),
 r("-", "Chiều dài bãi đỗ (Bảng 16, theo khối tích)", "Chiều dài tính theo chu vi nhà, căn cứ tổng khối tích của nhà (không gồm tầng hầm). Khối tích ≤ 28.400 m3: 1/6 chu vi và không nhỏ hơn 15 m (cả có và không có sprinkler). > 28.400 đến 56.800: 1/4 chu vi (không sprinkler) | 1/6 chu vi, ≥ 15 m (có sprinkler). > 56.800 đến 85.200: 1/2 | 1/4. > 85.200 đến 113.600: 3/4 | 1/4. > 113.600 đến 170.400: bao quanh | 1/2. > 170.400 đến 227.200: bao quanh | 3/4. > 227.200: bao quanh | bao quanh.", f"Đ 6.2.2.3 c), Bảng 16 {Q}", "Kiểm tra bảng tính của hồ sơ: chu vi, khối tích, có sprinkler hay không, rồi tính lại chiều dài yêu cầu; không dùng 3,5 m x 15 m nếu chiều cao PCCC > 15 m (rộng phải ≥ 6 m)."),
 r("-", "Khoảng cách bãi đỗ tới lối vào từ trên cao", "Khoảng cách theo phương ngang từ mép gần nhà hơn của bãi đỗ đến điểm giữa lối vào từ trên cao không gần hơn 2 m và không xa quá 10 m. Đường giao thông công cộng được dùng làm bãi đỗ nếu thỏa khoảng cách này.", f"Đ 6.2.3, 6.2.6 {Q}"),
 r("-", "Độ dốc bãi đỗ", "Bề mặt bãi đỗ xe chữa cháy phải ngang bằng; nếu nằm trên mặt nghiêng thì độ dốc không quá 1:15.", f"Đ 6.2.4 {Q}"),
 r("4.3", "Lối vào từ trên cao"),
 r("-", "Số lượng, vị trí (nhà F5)", "Nhà nhóm F5: số lượng lối vào từ trên cao tính theo chiều dài bãi đỗ, cứ mỗi đoạn đủ hoặc không đủ 20 m chiều dài bãi đỗ có một lối vào; khoảng cách dọc tường ngoài giữa tâm hai lối liên tiếp không quá 20 m; bố trí lối vào ở phía trên bãi đỗ, lên đến chiều cao PCCC 50 m. Không quy định khi có phương án phù hợp khác để lực lượng chữa cháy tiếp cận.", f"Đ 6.3.5 {Q} và sửa đổi 1:2023"),
 r("-", "Kích thước và đặc điểm lối vào từ trên cao", "Rộng ≥ 850 mm, cao ≥ 1.000 mm, mép dưới cách sàn trong nhà ≤ 1.100 mm, mép trên cách sàn ≥ 1.800 mm; thông thoáng, không để vật cản trong 1 m phía trong; không bố trí ở phòng kho, phòng máy, buồng thang thoát nạn...; mặt ngoài đánh dấu tam giác đều đỏ hoặc vàng cạnh ≥ 150 mm, mặt trong có chữ \"LỐI VÀO TỪ TRÊN CAO - KHÔNG ĐƯỢC GÂY CẢN TRỞ\" cao chữ ≥ 25 mm.", f"Đ 6.3.1 đến 6.3.4 {Q}"),
]
for ma in ("KT17", "KT18"):
    p = os.path.join(BANG, ma + ".json")
    d = json.load(open(p, encoding="utf8"))
    # bỏ các dòng Mục 4 chèn lần trước (idx 18–42 dành riêng cho mục này)
    dong = [x for x in d["dong"] if x["idx"] < 18 or x["idx"] > 42]
    assert len(ROWS) <= 25 and max(x["idx"] for x in dong if x["idx"] < 18) < 18
    # chỉ chèn nếu khoảng idx 18–42 đang trống ở bảng gốc
    moi = [dict(idx=18 + i, **row) for i, row in enumerate(ROWS)]
    pos = next(i for i, x in enumerate(dong) if x["idx"] > 42)
    d["dong"] = dong[:pos] + moi + dong[pos:]
    d["so_dong"] = len(d["dong"])
    json.dump(d, open(p, "w", encoding="utf8", newline=chr(10)), ensure_ascii=False, indent=0)
    print(ma, "so_dong", d["so_dong"])
    ip = os.path.join(BANG, "index.json")
    ix = json.load(open(ip, encoding="utf8"))
    for i in ix:
        if i["ma"] == ma: i["so_dong"] = d["so_dong"]
    json.dump(ix, open(ip, "w", encoding="utf8", newline=chr(10)), ensure_ascii=False, indent=1)
