"""Hình khoanh tư vấn thoát nạn lần 3 (tu_van_thiet_ke_v3.md). Tọa độ theo ảnh render zoom 1,6 (27 px/m)."""
import math
import sys
import os
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
os.chdir(os.path.dirname(os.path.abspath(__file__)))
K = 1 / 1.6
FONT = r'C:\Windows\Fonts\arial.ttf'
GREEN, RED, BLUE, ORANGE = (0.05, 0.6, 0.2), (0.85, 0.1, 0.1), (0.1, 0.3, 0.85), (0.95, 0.5, 0.0)


def P(x, y): return pymupdf.Point(x * K, y * K)
def R(x0, y0, x1, y1): return pymupdf.Rect(x0 * K, y0 * K, x1 * K, y1 * K)


class Pen:
    def __init__(s, page):
        s.p = page
        page.insert_font(fontname='arial', fontfile=FONT)

    def rect(s, r, col, fill=None, w=1.4, dash=None):
        s.p.draw_rect(r, color=col, fill=fill, width=w, fill_opacity=0.25 if fill else 1, dashes=dash)

    def line(s, a, b, col, w=1.4, arrow=False, dash=None):
        s.p.draw_line(a, b, color=col, width=w, dashes=dash)
        if arrow:
            d = math.atan2(b.y - a.y, b.x - a.x)
            for da in (2.7, -2.7):
                s.p.draw_line(b, pymupdf.Point(b.x + 6 * math.cos(d + da), b.y + 6 * math.sin(d + da)), color=col, width=w)

    def cross(s, r, col, w=1.6):
        s.line(r.tl, r.br, col, w)
        s.line(r.tr, r.bl, col, w)

    def text(s, r, t, col, size=7.5):
        s.p.draw_rect(r, color=col, fill=(1, 1, 1), width=0.8, fill_opacity=0.93)
        rc = s.p.insert_textbox(r + (2, 1, -2, -1), t, fontname='arial', fontsize=size, color=col)
        assert rc >= 0, ('chữ tràn khung', t[:40], rc)

    def title(s, t):
        s.text(R(150, 120, 900, 175), t, BLUE, 9)


doc = pymupdf.open('ban_ve.pdf')
out = pymupdf.open()
CHU = 'TƯ VẤN SƠ BỘ THOÁT NẠN (lần 3, 30/10/2026) – tham khảo, không phải kết luận thẩm định. Chi tiết: tu_van_thiet_ke_v3.md'

# ---------- Tầng 1 (trang 6): lối ra BTB1 qua bếp, tiền sảnh BTB2 ----------
p = doc[5]; pen = Pen(p); pen.title(CHU + '\nTẦNG 1: lối ra của buồng thang (3.4.7)')
pen.cross(R(1100, 425, 1124, 455), RED)                      # cửa BTB1 hiện mở vào bếp
pen.rect(R(964, 367, 1105, 548), RED, dash='[4 3] 0')
pen.rect(R(1166, 430, 1206, 995), GREEN, fill=GREEN)        # hành lang ngăn cháy dọc tường Đông
pen.line(P(1186, 960), P(1186, 1035), GREEN, 2, arrow=True)  # cửa mới ra sân đuôi lô
pen.text(R(1260, 380, 1600, 520), 'CHƯA ĐẠT: cửa BTB1 mở vào BẾP, ra ngoài phải đi xuyên bếp (3.4.7).\n'
         'GIẢI PHÁP: chuyển cửa BTB1 sang tường Nam buồng thang; hành lang ngăn cháy rộng >= 1,2 m '
         '(tường ngăn cháy loại 1, cửa tự đóng) dọc tường Đông, dài ~21 m, mở cửa mới ra sân đuôi lô ở tường Nam.', RED)
pen.line(P(1260, 450), P(1206, 470), RED, 1, arrow=True)
pen.rect(R(700, 845, 820, 892), ORANGE, fill=ORANGE, dash='[4 3] 0')   # tiền sảnh BTB2
pen.text(R(420, 1080, 900, 1150), 'BTB2 ra hành lang rồi đại sảnh: CẦN XÁC NHẬN tiền sảnh ngăn cháy.\n'
         'GIẢI PHÁP: vách ngăn cháy loại 1 quanh đoạn hành lang trước BTB2, cửa tự đóng ra đại sảnh (3.4.7).', ORANGE)
pen.line(P(700, 1080), P(750, 895), ORANGE, 1, arrow=True)
out.insert_pdf(doc, from_page=5, to_page=5)

# ---------- Tầng 2 (trang 8): hội trường ~280 người ----------
p = doc[7]; pen = Pen(p); pen.title(CHU + '\nTẦNG 2: hội trường đãi tiệc ~280 người (Bảng G.9, 1,5 m²/người)')
for r in (R(764, 848, 792, 878), R(1092, 425, 1126, 457)):  # cửa D07 vào hai buồng thang
    pen.rect(r, RED, fill=RED, w=1.6)
pen.rect(R(758, 880, 816, 990), RED, dash='[4 3] 0')         # bản thang BTB2 0,9 m
pen.rect(R(1124, 357, 1212, 423), RED, dash='[4 3] 0')       # bản thang BTB1
pen.text(R(420, 1040, 960, 1130), 'CHƯA ĐẠT: cửa vào thang (D07) ~0,9 m và bản thang 0,9 m.\n'
         '- Phòng > 50 người: cửa thoát nạn >= 1,2 m thông thủy (3.2.9).\n'
         '- Tầng có > 200 người: bản thang >= 1,2 m (3.4.1).\n'
         'GIẢI PHÁP a: BTB2 nới thành 1,2 + 0,1 + 1,2 = 2,5 m (lấy 0,6 m phía Đông), cửa >= 1,2 m, mở vào thang, tự đóng.\n'
         'GIẢI PHÁP b: giới hạn T2 <= 200 người (ghi bản vẽ + biển); cửa vẫn >= 1,2 m.', RED)
pen.line(P(780, 1040), P(780, 992), RED, 1, arrow=True)
pen.text(R(1260, 300, 1600, 360), 'Cửa BTB1 >= 1,2 m, bản thang BTB1 >= 1,2 m (như BTB2).', RED)
pen.line(P(1260, 330), P(1212, 380), RED, 1, arrow=True)
pen.line(P(778, 863), P(1109, 441), BLUE, 1.2, dash='[3 2] 0')
pen.text(R(930, 600, 1120, 640), 'Hai lối cách ~20,5 m: gian >= 50 người có 2 lối (3.2.5) ĐẠT', BLUE)
for r in (R(330, 745, 362, 805), R(330, 906, 362, 966)):
    pen.rect(r, GREEN, fill=GREEN)
pen.text(R(120, 600, 330, 690), 'LỐI VÀO TỪ TRÊN CAO T2: cửa D03 phía trục A (hoặc cả hai). Tam giác + chữ (6.3.3), 1 m phía trong không kê bàn tiệc (6.3.1).', GREEN)
pen.line(P(250, 690), P(332, 770), GREEN, 1, arrow=True)
out.insert_pdf(doc, from_page=7, to_page=7)

# ---------- Tầng 3 điển hình (trang 10): khoang đệm N2/N3, phân tán, lối vào trên cao ----------
p = doc[9]; pen = Pen(p); pen.title(CHU + '\nTẦNG 3 (điển hình T3–T9): buồng thang không nhiễm khói (3.4.13)')
pen.rect(R(818, 872, 892, 935), GREEN, fill=GREEN)           # khoang đệm BTB2
pen.rect(R(1035, 362, 1085, 418), GREEN, fill=GREEN)         # khoang đệm BTB1
pen.text(R(820, 1030, 1260, 1110), 'KHOANG ĐỆM BTB2 (đề xuất) ~2,7 x 2,3 m ≈ 6 m² (>= 3 m², 3.4.9): dùng phần trống phía Đông vế thang '
         'trong buồng thang; cửa từ hành lang vào khoang đệm rồi vào thang. Tăng áp khoang đệm + buồng thang, cấp khí độc lập, '
         'điện 2 nguồn (3.4.13, Phụ lục D).', GREEN)
pen.line(P(860, 1030), P(858, 937), GREEN, 1, arrow=True)
pen.text(R(1260, 300, 1600, 380), 'KHOANG ĐỆM BTB1 (đề xuất) ~1,9 x 2,1 m ≈ 4 m²: quây đầu hành lang cánh Đông trước cửa D07, '
         'không mất phòng. Tăng áp như BTB2. Không làm N1: sát nhà dân.', GREEN)
pen.line(P(1260, 360), P(1087, 392), GREEN, 1, arrow=True)
pen.rect(R(1080, 345, 1212, 420), RED, dash='[4 3] 0')
pen.rect(R(758, 870, 816, 978), RED, dash='[4 3] 0')
pen.text(R(420, 1150, 800, 1200), 'Bản thang 0,9 m -> 1,2 m vì T2 > 200 người (3.4.1), suốt chiều cao nhà.', RED)
pen.line(P(600, 1150), P(770, 980), RED, 1, arrow=True)
pen.line(P(778, 858), P(1090, 400), BLUE, 1.2, dash='[3 2] 0')
pen.line(P(352, 982), P(1245, 337), BLUE, 0.8, dash='[1 2] 0')
pen.text(R(560, 380, 900, 440), 'PHÂN TÁN (3.2.8): D ≈ 40,6 m; L hai cửa thang ≈ 20,5 m >= D/2 = 20,3 m (sát). '
         'Có sprinkler toàn nhà: L >= D/3 = 13,6 m. Ghi rõ sprinkler trên bản vẽ.', BLUE)
pen.rect(R(312, 728, 356, 805), GREEN, fill=GREEN)
pen.text(R(110, 560, 345, 660), 'LỐI VÀO TỪ TRÊN CAO: cửa ban công VIP 01 (mặt Tây, đối diện bãi đỗ) mỗi tầng T3–T9. '
         'Tam giác đỏ/vàng >= 150 mm, chữ >= 25 mm (6.3.3); 1 m phía trong trống (6.3.1).', GREEN)
pen.line(P(230, 660), P(318, 740), GREEN, 1, arrow=True)
pen.cross(R(340, 830, 362, 870), ORANGE)
pen.text(R(110, 1010, 340, 1060), 'Cửa sổ giữa mặt Tây là WC: không chọn làm lối vào trên cao.', ORANGE)
pen.line(P(250, 1010), P(350, 872), ORANGE, 1, arrow=True)
out.insert_pdf(doc, from_page=9, to_page=9)

# ---------- Tầng 10 sân thượng (trang 17) ----------
p = doc[16]; pen = Pen(p); pen.title(CHU + '\nTẦNG 10 (sân thượng): số lối ra')
pen.rect(R(1080, 345, 1212, 420), RED, fill=RED, dash='[4 3] 0')
pen.text(R(1260, 380, 1600, 500), 'CHƯA ĐẠT nếu sân thượng có khai thác (WC, hồ cảnh quan): chỉ BTB2 lên tới T10, '
         'tầng nhà F1.2 phải >= 2 lối (3.2.6.1).\nGIẢI PHÁP 1: kéo BTB1 lên T10 có tum + cửa ra sân thượng; thu ngắn hồ nước ~3 m đầu Bắc.\n'
         'GIẢI PHÁP 2: ghi "mái không khai thác", khóa cửa, bỏ WC -> cao PCCC 30,55 m (vẫn > 28 m).', RED)
pen.line(P(1260, 420), P(1212, 400), RED, 1, arrow=True)
pen.rect(R(760, 840, 815, 880), GREEN, fill=GREEN)
pen.text(R(420, 1040, 820, 1100), 'Lối ra mái qua BTB2 (6.6, 6.7): cửa ngăn cháy loại 2 >= 0,75 x 1,5 m. '
         'Thang sắt lên mái +37,45 chỉ để bảo trì, không tính thoát nạn.', GREEN)
pen.line(P(700, 1040), P(785, 882), GREEN, 1, arrow=True)
pen.rect(R(990, 740, 1032, 848), ORANGE, dash='[4 3] 0')
out.insert_pdf(doc, from_page=16, to_page=16)

# ---------- Mặt đứng trục A-C = mặt Tây (trang 3): lối vào trên cao ----------
p = doc[2]; pen = Pen(p); pen.title(CHU + '\nMẶT ĐỨNG TÂY (trục A-C, hướng bãi đỗ xe chữa cháy): lối vào từ trên cao')
SAN = {2: 1043, 3: 955, 4: 866, 5: 777, 6: 690, 7: 601, 8: 512, 9: 423}   # vạch cao độ sàn (x)
for t, x in SAN.items():
    pen.rect(R(x - 72, 640, x - 6, 725), GREEN, fill=GREEN, w=1.1)
    tx, ty = x - 39, 760                                           # tam giác ▼ đánh dấu
    p.draw_polyline([P(tx - 9, ty - 8), P(tx + 9, ty - 8), P(tx, ty + 8), P(tx - 9, ty - 8)], color=RED, fill=(1, 0.85, 0), width=1)
    pen.p.insert_text(P(x - 50, 790), f'T{t}', fontname='arial', fontsize=7, color=GREEN)
pen.text(R(300, 820, 1060, 920), 'CHƯA ĐẠT: mặt đứng chưa có ký hiệu, ghi chú lối vào từ trên cao (6.3.1, 6.3.3).\n'
         'GIẢI PHÁP: mỗi tầng T2–T9 dùng cửa ban công VIP 01 (khung xanh; T2 là cửa D03 hội trường): rộng >= 850, cao >= 1000, '
         'mép dưới <= 1100, mép trên >= 1800 mm (6.3.4); mở được trong và ngoài, không song sắt; tam giác đỏ/vàng >= 150 mm mặt ngoài.\n'
         'Bãi 20 m -> 1 vị trí/tầng (6.3.5). CẦN XÁC NHẬN lan can ban công: cản thì làm cánh lan can mở được hoặc hạ lan can tại ô này.', GREEN)
out.insert_pdf(doc, from_page=2, to_page=2)

out.save('tu_van_v3_khoanh.pdf')
for i, pg in enumerate(out):
    pg.get_pixmap(matrix=pymupdf.Matrix(2, 2)).save(f'tu_van_v3_khoanh_{i + 1}.png')
print('đã ghi tu_van_v3_khoanh.pdf +', len(out), 'ảnh')
