"""Bố trí đầu báo khói theo khoang dầm (TCVN 7568-14:2025 5.9.1.1.6, skill MOD_dau_bao_khoi_khoang_dam) lên một mặt bằng PDF.
Lưới dầm giả định theo trục (dầm sâu d, ô giữa các dầm là mỗi khoang): S >= ngưỡng (4 m² nếu h < 4 m, 9 m² nếu h >= 4 m) => 1 đầu trong ô (xanh); nhỏ hơn => ở mặt dưới dầm (cam).
CHƯA trừ tường ngăn, WC, thang trong ô (tường mặt bằng này chưa nhận diện được): kết quả là số đầu TỐI ĐA theo lưới; phòng nằm gọn trong một ô thì giữ một đầu.
Dùng: python scripts/bo_tri_dau_bao_dam.py <pdf> <trang> <ra.png> --x 236,335,... --y 308,405,... (px ở 110 dpi, tim các trục) --kt 47.7,25 --h 4.5 --d 0.5"""
import sys
import pymupdf

def chay(pdf, trang, ra, xs, ys, kt_m, h, d):
    p = pymupdf.open(pdf)[trang - 1]
    k = 72 / 110
    mx = kt_m[0] / (xs[-1] - xs[0])           # m / px theo chiều ngang (kích thước tổng của lưới)
    my = kt_m[1] / (ys[-1] - ys[0])
    nguong = 9 if h >= 4 else 4
    xanh, cam = (0.05, 0.6, 0.2), (0.95, 0.5, 0.0)
    dem = {'trong': 0, 'duoi': 0}
    bang = []
    for i in range(len(ys) - 1):
        for j in range(len(xs) - 1):
            w, hh = (xs[j + 1] - xs[j]) * mx, (ys[i + 1] - ys[i]) * my
            s = w * hh
            trong = s >= nguong
            dem['trong' if trong else 'duoi'] += 1
            cx, cy = (xs[j] + xs[j + 1]) / 2 * k, (ys[i] + ys[i + 1]) / 2 * k
            p.draw_rect(pymupdf.Rect(xs[j] * k, ys[i] * k, xs[j + 1] * k, ys[i + 1] * k), color=(0.1, 0.3, 0.85), width=0.6, dashes='[3 2] 0')
            p.draw_circle(pymupdf.Point(cx, cy), 4.2, color=xanh if trong else cam, fill=xanh if trong else cam, fill_opacity=0.55, width=1.2)
            bang.append((i, j, round(w, 1), round(hh, 1), round(s, 1), 'trong ô' if trong else 'dưới dầm'))
    p.draw_rect(pymupdf.Rect(40, 40, 330, 92), color=(0.1, 0.3, 0.85), fill=(1, 1, 1), width=0.8)
    p.insert_font(fontname='arial', fontfile=r'C:\Windows\Fonts\arial.ttf')
    p.insert_textbox(pymupdf.Rect(43, 42, 328, 90), f"Dầm giả định theo trục, sâu {d*1000:.0f} mm, trần cao h = {h} m (ngưỡng ô {nguong} m²).\nXanh: 1 đầu trong ô ({dem['trong']}). Cam: dưới dầm ({dem['duoi']}).\nChưa trừ tường ngăn, WC, thang trong ô.", fontname='arial', fontsize=7, color=(0.1, 0.3, 0.85))
    p.get_pixmap(dpi=130).save(ra)
    return dem, bang

if __name__ == '__main__':
    a = sys.argv[1:]
    def opt(n, mac=None):
        return a[a.index(n) + 1] if n in a else mac
    lst = lambda s: [float(v) for v in s.split(',')]
    dem, bang = chay(a[0], int(a[1]), a[2], lst(opt('--x')), lst(opt('--y')), lst(opt('--kt', '47.7,25')), float(opt('--h', 4.5)), float(opt('--d', 0.5)))
    print(dem)
    for b in bang: print(*b)
