"""Bố trí báo cháy tự động lên mặt bằng tầng 2 Karaoke SV & Gia Đình (PDF 1 trang, quay 90°).
Toạ độ pt PDF chưa quay, lấy từ cột đen (trục 1-7 theo y; trục C/B/A theo x). 62,8 mm/pt.
Ra: bao_chay_tang2.pdf (trang 1 = mặt bằng, trang 2 = chú giải + thống kê) và .png.
"""
import pymupdf

SRC = r"C:/Users/HP/Downloads/BẢN VẼ KARAOKE SV - GIA ĐÌNH (  TD LẦN 1 ).pdf"
OUT = "ket_qua/karaoke_sv_gia_dinh_bao_chay/bao_chay_tang2"
FONT, FONTB = "C:/Windows/Fonts/arial.ttf", "C:/Windows/Fonts/arialbd.ttf"
MM = 62.8  # mm/pt

doc = pymupdf.open(SRC)
pg = doc[0]
pg.insert_font("ar", FONT)
pg.insert_font("arb", FONTB)
fnt = {"ar": pymupdf.Font(fontfile=FONT), "arb": pymupdf.Font(fontfile=FONTB)}

RED, BLUE, GRN, MAG, ORG = (0.85, 0, 0), (0, 0.25, 0.85), (0, 0.55, 0.15), (0.75, 0, 0.6), (0.9, 0.45, 0)
AX_Y = [240.6, 321.8, 403.0, 484.1, 565.2, 646.4, 727.6]  # trục 1..7
XC = 243.0                       # tim hành lang (rộng 1500)
XL, XR = 213.0, 308.0            # cột đầu báo phòng bên trái / phải (tránh chữ tên phòng)
dem = {"H": 0, "S": 0, "N": 0, "C": 0}


def txt(cx, cy, s, fs, col, font="arb"):
    """Chữ nằm ngang khi xem (trang quay 90°), căn giữa tại (cx, cy)."""
    w = fnt[font].text_length(s, fs)
    pg.insert_text((cx + 0.35 * fs, cy + w / 2), s, fontsize=fs, fontname=font, color=col, rotate=90)


def circle(c, r, col, s, fill=None):
    pg.draw_circle(pymupdf.Point(*c), r, color=col, fill=fill or (1, 1, 1), width=0.9)
    txt(c[0], c[1], s, 6, col)


def square(c, r, col, s):
    pg.draw_rect(pymupdf.Rect(c[0] - r, c[1] - r, c[0] + r, c[1] + r), color=col, fill=col, width=0.8)
    txt(c[0], c[1], s, 6, (1, 1, 1))


def dash(pts, col):
    for a, b in zip(pts, pts[1:]):
        pg.draw_line(pymupdf.Point(*a), pymupdf.Point(*b), color=col, width=0.7, dashes="[2 1.5] 0")


def tag(c, s, col):
    txt(c[0], c[1], s, 5, col, "ar")


# 1. Dây tín hiệu: trục hành lang nối các thiết bị
dash([(XC, 246), (XC, 752)], GRN)

# 2. Đầu báo nhiệt + chuông trong 9 phòng VIP (nhiệt: karaoke hút thuốc, báo giả khói)
left = [(AX_Y[0], AX_Y[1]), (AX_Y[1], AX_Y[2]), (AX_Y[3], AX_Y[4]), (AX_Y[4], AX_Y[5]), (AX_Y[5], AX_Y[6])]
right = [(AX_Y[0], AX_Y[1]), (AX_Y[1], AX_Y[2]), (AX_Y[3], AX_Y[4]), (AX_Y[4], AX_Y[5])]
for x, rooms in ((XL, left), (XR, right)):
    for y0, y1 in rooms:
        yc = (y0 + y1) / 2
        dash([(XC, yc), (x, yc)], GRN)
        circle((x, yc), 4.6, RED, "H")
        circle((x, yc + 21), 3.6, BLUE, "C")
        dem["H"] += 1
        dem["C"] += 1

# 3. Đầu báo khói hành lang: dài ~32,6 m, 4 đầu cách đều 9,0 m, đầu cuối cách đầu hành lang 2,8 m
L = (759.4 - 240.6) * MM / 1000
n, e = 4, 2.8
step = (L - 2 * e) / (n - 1)
for i in range(n):
    y = 240.6 + (e + i * step) * 1000 / MM
    circle((XC, y), 4.6, RED, "S")
    dem["S"] += 1
print(f"hành lang dài {L:.1f} m, khoảng cách đầu khói {step:.1f} m")

# 5. Nút ấn gần 3 lối ra (cầu thang sắt ngoài nhà ở trên, thang ST giữa phải, thang trái dưới), cao 1,4 m
for p in ((251, 262), (234, 693), (234, 745)):
    square(p, 4, MAG, "N")
    dem["N"] += 1

# 6. Chuông + đèn hành lang (khoảng cách ≤ 45 m)
for p in ((251, 360), (234, 560), (251, 650)):
    circle(p, 4, BLUE, "C")
    pg.draw_circle(pymupdf.Point(*p), 5.8, color=BLUE, width=0.6)
    dem["C"] += 1

pg.set_rotation(90)
for tên, kw in (("", {"dpi": 150}),):
    pg.get_pixmap(**kw).save(OUT + ".png")
print(dem)

# Trang 2: chú giải, thống kê, giả định (trang ngang bình thường)
p2 = doc.new_page(width=842, height=595)
p2.insert_font("ar", FONT)
p2.insert_font("arb", FONTB)
P = 40


def line(y, s, fs=10, font="ar", col=(0, 0, 0)):
    p2.insert_text((P, y), s, fontsize=fs, fontname=font, color=col)
    return y + fs + 5


y = line(50, "BỐ TRÍ BÁO CHÁY TỰ ĐỘNG – MẶT BẰNG TẦNG 2 KARAOKE SV & GIA ĐÌNH (bản vẽ TD lần 1)", 13, "arb")
y = line(y + 4, "Hệ thống: báo cháy tự động địa chỉ hoặc thường (tuỳ người thiết kế), tủ trung tâm đặt tầng trệt (ngoài bản vẽ này).", 9)
y += 4
y = line(y, "CHÚ GIẢI", 11, "arb")
rows = [
    (RED, "H", "Đầu báo cháy NHIỆT điểm, trong 9 phòng VIP (VIP 8–16)", dem["H"]),
    (RED, "S", "Đầu báo cháy KHÓI quang điện: hành lang 4 đầu", dem["S"]),
    (MAG, "N", "Hộp nút ấn báo cháy, cao 1,4 ± 0,2 m, gần lối ra từng lối", dem["N"]),
    (BLUE, "C", "Chuông báo cháy (phòng VIP 9 cái, hành lang 3 cái kèm đèn chớp)", dem["C"]),
]
for col, s, mota, sl in rows:
    p2.draw_circle(pymupdf.Point(P + 8, y - 3), 5, color=col, fill=(1, 1, 1), width=0.9)
    p2.insert_text((P + 5.5, y), s, fontsize=7, fontname="arb", color=col)
    y = line(y, f"      {mota}:  {sl} cái", 10)
y = line(y, "      Đường nét đứt xanh lá: tuyến cáp tín hiệu chịu lửa dọc hành lang, nhánh vào từng phòng.", 10)
y += 6
y = line(y, "CĂN CỨ BỐ TRÍ", 11, "arb")
for s in (
    "1. Phòng hát karaoke: đầu báo NHIỆT (khói thuốc, máy khói gây báo giả; TCVN 7568-14:2025 mục 4.1.5.4, Phụ lục A mục C.4; chốt của người dùng 2026-10-30).",
    "   Mỗi phòng 20,18 m² (≈ 4,2 × 4,8 m): 1 đầu ở điểm xa nhất cách đầu báo ≈ 4,1 m ≤ 5,1 m; tới tường ≥ 0,3 m (mục 5.9.2.1.1, .2, .4).",
    "2. Hành lang thoát nạn (rộng 1,5 m, dài ≈ 32,6 m): đầu báo KHÓI (mục 5.8.2.1.1 b). 4 đầu, cách nhau 9,0 m ≤ 10,2 m; đầu cuối cách đầu hành lang 2,8 m ≤ 5,1 m.",
    "3. Phòng vệ sinh (WC nam/nữ) và buồng thang bộ thoát nạn (thang trái dưới, thang ST, thang sắt ngoài nhà): miễn lắp (QCVN 10:2025 mục 1.5.11).",
    "4. Nút ấn: ở lối ra của tầng, khoảng cách giữa hai nút ≤ 45 m (mục 5.10.1, 5.10.3, 5.10.4); từ nút trên cùng tới nút dưới cùng ≈ 31 m.",
    "5. Chuông: tiếng nhạc karaoke át tiếng chuông hành lang, nên mỗi phòng 1 chuông; hành lang 3 chuông-đèn (≤ 45 m, mục 5.11).",
)[0:]:
    y = line(y, s, 9)
y += 6
y = line(y, "GIẢ ĐỊNH VÀ CẦN XÁC NHẬN (bản vẽ kiến trúc thiếu)", 11, "arb")
for s in (
    "a. Chiều cao trần, loại trần và dầm: bản vẽ không ghi. Giả định trần thạch cao phẳng, h ≤ 4 m, dầm sâu ≤ 0,3 m (đầu nhiệt đặt cách trần 15–100 mm).",
    "   Nếu không đóng trần hoặc có dầm sâu > 0,3 m: mỗi khoang dầm 1 đầu, nhiệt giảm khoảng cách 30 % (5.9.2.1.5) → cần mặt bằng dầm.",
    "b. Khoảng không trên trần giả có ống bọc cháy được hoặc máng cáp ≥ 220 V không: nếu có, thêm đầu báo KHÓI trong khoảng không (QCVN 10 Bảng A.3 mục 7.1, 7.2).",
    "c. Thang xoắn nội bộ là lỗ thông tầng (không có trần để lắp): không đặt đầu báo; phát hiện khói nhờ đầu khói hành lang và các tầng liên quan.",
    "d. Tầng 3 trở lên và tầng trệt chưa nằm trong file; tủ trung tâm, loa/chuông liên động ngắt nhạc, nguồn dự phòng 2 nguồn (xem m13) làm ở bước sau.",
    "e. Vị trí thiết bị lấy theo tỷ lệ bản vẽ (±0,3 m); các thiết bị đặt cạnh cửa cần dịch khi triển khai thi công cho khỏi cánh cửa và đèn chiếu sáng (≥ 0,1 m, mục 5.8.2.1.1 d).",
):
    y = line(y, s, 9)
y += 6
y = line(y, f"TỔNG: đầu nhiệt {dem['H']}, đầu khói {dem['S']}, nút ấn {dem['N']}, chuông {dem['C']} (trong đó {dem['C'] - 9} chuông-đèn hành lang).", 10, "arb")

doc.save(OUT + ".pdf")
p2.get_pixmap(dpi=100).save(OUT + "_trang2.png")
print("xong")
