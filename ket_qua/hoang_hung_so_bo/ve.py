import pymupdf, glob, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
src = glob.glob(r'C:\Users\ADMIN\Downloads\23-10-2026*Ho*ng H*ng 25-06.pdf')[0]
K = 72 / 110                       # px của ảnh 110 dpi -> điểm PDF
FONT = r'C:\Windows\Fonts\arial.ttf'
GREEN, RED, BLUE, ORANGE = (0.05, 0.6, 0.2), (0.85, 0.1, 0.1), (0.1, 0.3, 0.85), (0.95, 0.5, 0.0)

def P(x, y): return pymupdf.Point(x * K, y * K)
def R(x0, y0, x1, y1): return pymupdf.Rect(x0 * K, y0 * K, x1 * K, y1 * K)

class Pen:
    def __init__(s, page):
        s.p = page; page.insert_font(fontname='arial', fontfile=FONT)
    def rect(s, r, col, fill=None, w=1.6, dash=None):
        s.p.draw_rect(r, color=col, fill=fill, width=w, fill_opacity=0.25 if fill else 1, dashes=dash)
    def line(s, a, b, col, w=1.6, arrow=False, dash=None):
        s.p.draw_line(a, b, color=col, width=w, dashes=dash)
        if arrow:
            import math
            d = math.atan2(b.y - a.y, b.x - a.x)
            for da in (2.7, -2.7):
                s.p.draw_line(b, pymupdf.Point(b.x + 7 * math.cos(d + da), b.y + 7 * math.sin(d + da)), color=col, width=w)
    def poly(s, pts, col, w=2.0):
        for a, b in zip(pts, pts[1:]): s.line(a, b, col, w)
        s.line(pts[-2], pts[-1], col, w, arrow=True)
    def text(s, r, t, col, size=8.5, fill=(1, 1, 1), border=True):
        s.p.draw_rect(r, color=col if border else None, fill=fill, width=0.9, fill_opacity=0.92)
        s.p.insert_textbox(r + (2, 1, -2, -1), t, fontname='arial', fontsize=size, color=col)

doc = pymupdf.open(src)
out = pymupdf.open()

# ---------- Hình 1: mặt bằng tổng thể ----------
p = doc[0]; pen = Pen(p)
# Bãi đỗ xe chữa cháy trên đường công cộng trước mặt tiền Tây: 20 m x 6 m (10,8 px/m), mép gần cách tường ngoài 3,9 m
pen.rect(R(618, 462, 683, 678), GREEN, fill=GREEN)
pen.text(R(170, 880, 560, 990), "BÃI ĐỖ XE CHỮA CHÁY (đề xuất) 20 x 6 m\n- Dài: 1/6 chu vi nhà ≈ 114/6 = 19 m, lấy 20 m (>= 15 m)\n- Rộng >= 6 m (Bảng 14, cao PCCC > 15 m)\n- Đặt trên đường công cộng (6.2.6), sát lộ giới phía Tây,\n  giữa mặt tiền (trục B)\n- Mép gần cách tường ngoài 3,9 m: trong 2–10 m (6.2.3)", GREEN, 8.5)
pen.line(P(360, 880), P(640, 700), GREEN, 1.2, arrow=True)
# đường vào phụ phía Đông (rộng 3,5 m, dài ~26 m)
pen.line(P(1120, 720), P(1030, 720), ORANGE, 2.2, arrow=True, dash='[4 3] 0')
pen.line(P(1030, 720), P(990, 650), ORANGE, 2.2, arrow=True, dash='[4 3] 0')
pen.text(R(1060, 905, 1500, 1010), "Lối phụ phía Đông (rộng 3,5 m từ đường BT 12 m, dài ~26 m < 46 m):\nchỉ là đường tiếp cận tới cửa Nam sảnh T1 và phòng bơm,\nKHÔNG đủ rộng làm bãi đỗ (cần >= 6 m).", ORANGE, 8.3)
pen.line(P(1280, 905), P(1030, 725), ORANGE, 1.0, arrow=True)
pen.text(R(1090, 330, 1500, 410), "Nhà chỉ có MỘT mặt tiếp giáp đường (mặt Tây, rộng 10 m); Bắc, Nam, Đông giáp nhà dân.\nMọi tiếp cận xe thang/xe bơm phải qua mặt Tây.", RED, 8.3)
pen.text(R(160, 120, 560, 200), "THIẾT KẾ SƠ BỘ PCCC (tham khảo, chưa phải kết luận thẩm định)\nKhách sạn Hoàng Hùng – cao PCCC 34,05 m (> 28 m)", BLUE, 9.5)
out.insert_pdf(doc, from_page=0, to_page=0)
pen2 = None

# ---------- Hình 2: mặt bằng tầng 2 (điển hình): thang, tuyến thoát nạn, lối vào từ trên cao ----------
p = doc[6]; pen = Pen(p)
for y in (740, 880):   # hai cửa ban công mặt Tây
    pen.rect(R(298, y - 28, 352, y + 28), GREEN, fill=GREEN, w=1.4)
pen.text(R(120, 560, 420, 640), "LỐI VÀO TỪ TRÊN CAO (mỗi tầng 2–10)\n2 cửa ban công mặt Tây, đối diện bãi\nđỗ xe chữa cháy, mở được hai phía,\ncách 1 m phía trong không đặt đồ đạc (6.3.1)", GREEN, 8.2)
pen.line(P(250, 640), P(300, 735), GREEN, 1.1, arrow=True)
# tuyến thoát nạn xa nhất (góc vuông, ghi L từng đoạn)
pen.rect(R(1160, 915, 1190, 945), RED, fill=RED, w=1.4)
pen.poly([P(1175, 930), P(1175, 790), P(740, 790), P(740, 828)], BLUE, 2.2)
pen.text(R(1182, 835, 1290, 860), "L = 5,4 m", BLUE, 8, border=False)
pen.text(R(900, 758, 1020, 783), "L = 16,9 m", BLUE, 8, border=False)
pen.text(R(690, 800, 735, 822), "1,5", BLUE, 8, border=False)
pen.poly([P(1175, 930), P(1175, 435), P(1068, 435)], ORANGE, 2.2)
pen.text(R(1182, 560, 1290, 585), "L = 19,2 m", ORANGE, 8, border=False)
pen.text(R(1070, 440, 1130, 462), "4,2", ORANGE, 8, border=False)
pen.text(R(1180, 900, 1310, 925), "Điểm xa nhất (ước lượng)", RED, 8, border=False)
pen.text(R(1195, 640, 1500, 740), "Tuyến từ điểm xa nhất (SE) tới 2 buồng thang:\n- BTB2: ≈ 24 m (xanh)    - BTB1: ≈ 23 m (cam)\nSo giới hạn Bảng G.2 theo mật độ người và bậc chịu lửa\n(CẦN XÁC NHẬN: chưa có số người, bậc chịu lửa).", BLUE, 8.2)
pen.text(R(560, 1010, 1100, 1090), "BTB1 và BTB2: thang 2 vế thẳng, bản thang 0,9 m (BTB2), 21 bậc/tầng 4,1 m.\nChưa thể hiện khoang đệm, tăng áp, lỗ lấy sáng ngoài tường: chưa chứng minh N1\n(bắt buộc khi cao PCCC > 28 m, 3.4.13) => 2 lối chờ xác nhận.", RED, 8.2)
pen.text(R(1195, 740, 1500, 800), "BTB1: cửa mở vào bếp/sảnh tầng 1, không ra ngoài trực tiếp (3.4.7).", RED, 8.2)
pen.text(R(160, 120, 700, 190), "TẦNG 2 (điển hình) – THIẾT KẾ SƠ BỘ PCCC (tham khảo)", BLUE, 9.5)
out.insert_pdf(doc, from_page=6, to_page=6)
doc.close()
for i, pg in enumerate(out):
    pg.get_pixmap(dpi=120).save(f'so_bo_{i + 1}.png')
out.save('thiet_ke_so_bo_pccc.pdf')
print('ok')
