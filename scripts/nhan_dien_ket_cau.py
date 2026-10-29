"""Nhận diện kết cấu trên mặt bằng PDF vector (tự động): trục, tỷ lệ, cột, dầm chính, dầm phụ, khoang dầm.
- Trục: nhãn (1, 2, 4', A, B…) nằm trong vòng tròn; hướng trục là hướng có nhiều nét mảnh thẳng hàng đi qua tâm vòng (nét trục CAD bị cắt thành đoạn ngắn).
- Tỷ lệ: số kích thước (500–20000 mm) nằm giữa hai trục liền kề, lấy trung vị mm/pt.
- Cột: khối tô đậm (xám hoặc đen) cạnh 0,2–1,2 m; cột "ở giao trục" khi giao điểm nằm trong khối nở 0,35 m (cột thường đặt lệch, mép trùng trục).
- Dầm chính (quy tắc người dùng 2026-10-30): giao trục có cột thì có dầm chạy theo trục giữa hai cột liền kề.
- Dầm phụ: nét người dùng vẽ thêm bằng màu riêng (mặc định đỏ), dài >= 1 m.
- Khoang dầm: ô giữa hai trục dọc và hai trục ngang liền kề có đủ dầm bốn cạnh (chưa chia theo dầm phụ).
Tường: dùng scripts/nhan_dien_tuong.py (MatBang). Vì kèo, DXF, bản scan: chưa làm.
Dùng: python -I scripts/nhan_dien_ket_cau.py <pdf> <trang 1..n> <ra.json> [--anh ra.png] [--mau-dam-phu 1,0,0]
Tự kiểm: python -I scripts/nhan_dien_ket_cau.py --tu-kiem
"""
import json
import re
import statistics
import sys
import pymupdf as fitz

NHAN = re.compile(r"[A-Z]'?|\d{1,2}'?")


def _doan(page):
    """Mọi đoạn thẳng trên trang: (x0, y0, x1, y1, màu, độ dày)."""
    out = []
    for d in page.get_drawings():
        for it in d['items']:
            if it[0] == 'l':
                out.append((it[1].x, it[1].y, it[2].x, it[2].y, d.get('color'), d.get('width') or 0))
    return out


def tim_truc(page, doan=None):
    doan = doan if doan is not None else _doan(page)
    vong = [d['rect'] for d in page.get_drawings()
            if len(d['items']) >= 4 and all(i[0] == 'c' for i in d['items']) and 6 < d['rect'].width < 30 and abs(d['rect'].width - d['rect'].height) < 1.5]
    truc = []
    for w in page.get_text('words'):
        if not NHAN.fullmatch(w[4]):
            continue
        cx, cy = (w[0] + w[2]) / 2, (w[1] + w[3]) / 2
        v = next((r for r in vong if r.contains(fitz.Point(cx, cy))), None)
        if v is None:
            continue
        cx, cy, rv = v.x0 + v.width / 2, v.y0 + v.height / 2, v.width / 2
        # nét mảnh thẳng hàng qua tâm vòng, ngoài vòng: dọc (x = cx) hay ngang (y = cy)
        doc = [d for d in doan if abs(d[0] - d[2]) < 0.3 and abs(d[0] - cx) < 0.8 and min(abs(d[1] - cy), abs(d[3] - cy)) > rv]
        ngang = [d for d in doan if abs(d[1] - d[3]) < 0.3 and abs(d[1] - cy) < 0.8 and min(abs(d[0] - cx), abs(d[2] - cx)) > rv]
        Ld, Ln = sum(abs(d[1] - d[3]) for d in doc), sum(abs(d[0] - d[2]) for d in ngang)
        if max(Ld, Ln) < 50:
            continue
        huong, ds = ('doc', doc) if Ld >= Ln else ('ngang', ngang)
        k = (1, 3) if huong == 'doc' else (0, 2)
        tu, den = min(min(d[k[0]], d[k[1]]) for d in ds), max(max(d[k[0]], d[k[1]]) for d in ds)
        pos = cx if huong == 'doc' else cy
        cu = next((t for t in truc if t['nhan'] == w[4] and t['huong'] == huong and abs(t['pos'] - pos) < 1.5), None)
        if cu:  # vòng đầu kia của cùng trục
            cu['tu'], cu['den'] = min(cu['tu'], tu), max(cu['den'], den)
        else:
            truc.append({'nhan': w[4], 'huong': huong, 'pos': round(pos, 2), 'tu': round(tu, 2), 'den': round(den, 2)})
    return sorted(truc, key=lambda t: (t['huong'], t['pos']))


def ty_le(page, truc):
    """mm trên mỗi pt, từ số kích thước nằm giữa hai trục liền kề (trung vị)."""
    so = [((w[0] + w[2]) / 2, (w[1] + w[3]) / 2, int(w[4])) for w in page.get_text('words') if re.fullmatch(r'\d{3,5}', w[4]) and 500 <= int(w[4]) <= 20000]
    r = []
    for h, i in (('doc', 0), ('ngang', 1)):
        p = sorted(t['pos'] for t in truc if t['huong'] == h)
        for a, b in zip(p, p[1:]):
            d = b - a
            if d < 5:
                continue
            for s in so:
                if a + 0.3 * d < s[i] < b - 0.3 * d and 0.85 < s[2] / d / (r and statistics.median(r) or s[2] / d) < 1.15:
                    r.append(s[2] / d)
    return statistics.median(r) if r else None


def tim_cot(page, mm_pt):
    ra = []
    for d in page.get_drawings():
        f, r = d.get('fill'), d['rect']
        if f is None or max(f) > 0.6 or d.get('type') not in ('f', 'fs'):
            continue
        a, b = r.width * mm_pt / 1000, r.height * mm_pt / 1000
        if 0.2 <= a <= 1.2 and 0.2 <= b <= 1.2 and not any(abs(r.x0 - c.x0) < 1.5 and abs(r.y0 - c.y0) < 1.5 for c in ra):
            ra.append(r)
    return ra


def gop_cot(cot, mm_pt, cach_m=0.6):
    """Gộp các khối tô sát nhau (cột vẽ nhiều mảnh, lõi thang máy) thành một cột: tâm cách nhau <= cach_m."""
    ra = []
    for c in sorted(cot, key=lambda r: -r.width * r.height):
        t = ((c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2)
        g = next((i for i, r in enumerate(ra) if abs((r.x0 + r.x1) / 2 - t[0]) * mm_pt <= cach_m * 1000 and abs((r.y0 + r.y1) / 2 - t[1]) * mm_pt <= cach_m * 1000), None)
        if g is None:
            ra.append(fitz.Rect(c))
        else:
            ra[g] |= c
    return ra


def ten_cot(truc, cot, mm_pt):
    """Tên cột theo giao trục (vd "3/B") khi giao điểm nằm trong cột nở 0,35 m; cột lệch trục thì "C<số>"."""
    nor = 350 / mm_pt
    ten = {}
    for a in (t for t in truc if t['huong'] == 'doc'):
        for b in (t for t in truc if t['huong'] == 'ngang'):
            p = fitz.Point(a['pos'], b['pos'])
            if a['tu'] - 2 <= p.y <= a['den'] + 2 and b['tu'] - 2 <= p.x <= b['den'] + 2:
                i = next((i for i, c in enumerate(cot) if (c + (-nor, -nor, nor, nor)).contains(p)), None)
                if i is not None:
                    ten.setdefault(i, f"{a['nhan']}/{b['nhan']}")
    return [ten.get(i, f'C{i + 1}') for i in range(len(cot))]


def dam_chinh(cot, ten, mm_pt, gioi_han_m=12, goc=25, them=()):
    """Dầm giữa hai cột liền kề, kể cả khi xiên (quy tắc người dùng 2026-10-30: bản vẽ đã có cột thì nối dầm giữa hai cột đó dù xiên).
    Hai cột nối khi MỖI cột là cột gần nhất của cột kia theo hướng chính tương ứng (phải-trái, xuống-lên; lệch tối đa `goc` độ), không xa quá `gioi_han_m`:
    cột lệch trục vẫn nối, nhưng không kéo đường chéo qua ô (cột chéo không phải gần nhất theo cả hai phía)."""
    import math
    tam = [((c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2) for c in cot]
    gan = {}
    for i, (x, y) in enumerate(tam):
        for hx, hy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            tot = None
            for j, (u, v) in enumerate(tam):
                dx, dy = u - x, v - y
                d = math.hypot(dx, dy)
                if j == i or d == 0 or d * mm_pt / 1000 > gioi_han_m:
                    continue
                if (dx * hx + dy * hy) / d >= math.cos(math.radians(goc)) and (tot is None or d < tot[0]):
                    tot = (d, j)
            if tot:
                gan[(i, hx, hy)] = tot[1]
    canh = {tuple(sorted((i, j))) for (i, hx, hy), j in gan.items() if gan.get((j, -hx, -hy)) == i} | {tuple(sorted(c)) for c in them}

    def cat(p, q, a, b):  # đoạn pq cắt đoạn ab (không tính chạm đầu)
        d = lambda u, v, w: (v[0] - u[0]) * (w[1] - u[1]) - (v[1] - u[1]) * (w[0] - u[0])
        return d(p, q, a) * d(p, q, b) < 0 and d(a, b, p) * d(a, b, q) < 0

    def co_canh(i, hx, hy):
        return any(math.dist(tam[i], tam[j]) > 0 and ((tam[j][0] - tam[i][0]) * hx + (tam[j][1] - tam[i][1]) * hy) / math.dist(tam[i], tam[j]) >= math.cos(math.radians(goc))
                   for e in canh if i in e for j in [e[0] + e[1] - i])
    # Lượt 2 (đáp án người dùng 2026-10-30, trục 7' Hoàng Hùng): cột chưa có dầm theo một hướng mà xa hơn có cột thẳng hàng (lệch <= 12°, <= 30 m)
    # và đường nối cắt qua dầm ngang đã có thì vẫn có dầm dọc suốt, gối lên các dầm ngang.
    them2 = set()
    for i in range(len(tam)):
        for hx, hy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            if co_canh(i, hx, hy):
                continue
            ung = [(abs((tam[j][0] - tam[i][0]) * hy - (tam[j][1] - tam[i][1]) * hx), j) for j in range(len(tam)) if j != i and math.dist(tam[i], tam[j]) * mm_pt / 1000 <= 30  # cột THẲNG HÀNG nhất (lệch ngang nhỏ nhất), không phải gần nhất
                   and ((tam[j][0] - tam[i][0]) * hx + (tam[j][1] - tam[i][1]) * hy) / math.dist(tam[i], tam[j]) >= math.cos(math.radians(12))]
            if not ung:
                continue
            j = min(ung)[1]
            if not co_canh(j, -hx, -hy) and any(cat(tam[i], tam[j], tam[a], tam[b]) for a, b in canh):
                them2.add(tuple(sorted((i, j))))
    canh |= them2
    return [{'tu_cot': ten[i], 'den_cot': ten[j], 'p0': [round(tam[i][0], 2), round(tam[i][1], 2)], 'p1': [round(tam[j][0], 2), round(tam[j][1], 2)],
             'dai_m': round(math.dist(tam[i], tam[j]) * mm_pt / 1000, 2)} for i, j in sorted(canh)]


def dam_theo_truc(truc, ten, cot, mm_pt, gioi_han_m=30):
    """Dầm chạy suốt một trục giữa hai cột liên tiếp TRÊN CÙNG TRỤC, kể cả nhịp dài không có cột giữa (gối lên dầm ngang):
    vd trục 7' cánh Hoàng Hùng chỉ có cột ở E và C nhưng vẫn có dầm dọc suốt (đáp án người dùng 2026-10-30)."""
    import math
    tam = [((c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2) for c in cot]
    ra = []
    for t in truc:
        o = t['huong'] == 'doc'
        ds = sorted((tam[i][1] if o else tam[i][0], i) for i, n in enumerate(ten) if '/' in n and n.split('/')[0 if o else 1] == t['nhan'])
        for (_, i), (_, j) in zip(ds, ds[1:]):
            if math.dist(tam[i], tam[j]) * mm_pt / 1000 <= gioi_han_m:
                ra.append((i, j))
    return ra


def loi_thang_may(page, mm_pt):
    """Khung lõi thang máy: chữ "THANG MÁY" + các mảng tô (tường lõi) trong bán kính 2 m -> khung chữ nhật cạnh 1,2–4 m."""
    ra = []
    fill = [d['rect'] for d in page.get_drawings() if d.get('fill') is not None and max(d['fill']) <= 0.6]
    for b in page.search_for('THANG MÁY') + page.search_for('THANG MAÙY'):
        c = fitz.Point((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2)
        r = 2000 / mm_pt
        gan = [f for f in fill if abs((f.x0 + f.x1) / 2 - c.x) < r and abs((f.y0 + f.y1) / 2 - c.y) < r and (f.width < 400 / mm_pt or f.height < 400 / mm_pt)]
        if not gan:
            continue
        k = fitz.Rect(gan[0])
        for f in gan[1:]:
            k |= f
        if 1.2 <= k.width * mm_pt / 1000 <= 4 and 1.2 <= k.height * mm_pt / 1000 <= 4 and not any(k.intersects(x) for x in ra):
            ra.append(k)
    return ra


def dam_loi(cot, mm_pt, canh_min_m=1.2):
    """Lõi thang máy / hộp kỹ thuật (khối tô gộp lại > canh_min_m): là KHUNG DẦM bốn cạnh, không phải một cột."""
    ra = []
    for c in cot:
        if max(c.width, c.height) * mm_pt / 1000 > canh_min_m:
            for a, b in ((c.tl, c.tr), (c.tr, c.br), (c.br, c.bl), (c.bl, c.tl)):
                ra.append({'tu_cot': 'lõi', 'den_cot': 'lõi', 'p0': [round(a.x, 2), round(a.y, 2)], 'p1': [round(b.x, 2), round(b.y, 2)],
                           'dai_m': round(abs(b - a) * mm_pt / 1000, 2), 'loai': 'dầm bo lõi'})
    return ra


def dam_phu(doan, mm_pt, mau=(1, 0, 0), sai=0.15):
    return [{'p0': [round(d[0], 2), round(d[1], 2)], 'p1': [round(d[2], 2), round(d[3], 2)],
             'dai_m': round(((d[2] - d[0]) ** 2 + (d[3] - d[1]) ** 2) ** 0.5 * mm_pt / 1000, 2)}
            for d in doan if d[4] and all(abs(a - b) <= sai for a, b in zip(d[4], mau)) and ((d[2] - d[0]) ** 2 + (d[3] - d[1]) ** 2) ** 0.5 * mm_pt >= 1000]


def khoang_dam(dam, mm_pt, o_m=0.1, dt_min=1.0):
    """Khoang = vùng kín do dầm (chính + phụ) bao quanh, kể cả hình xiên: vẽ dầm lên lưới ô 0,1 m, tô vùng không chạm mép."""
    import numpy as np
    from scipy import ndimage as nd
    if not dam:
        return []
    xs = [v for d in dam for v in (d['p0'][0], d['p1'][0])]
    ys = [v for d in dam for v in (d['p0'][1], d['p1'][1])]
    k = o_m * 1000 / mm_pt  # pt mỗi ô
    x0, y0 = min(xs) - 2 * k, min(ys) - 2 * k
    W, H = int((max(xs) - x0) / k) + 3, int((max(ys) - y0) / k) + 3
    m = np.zeros((H, W), bool)
    for d in dam:
        n = int(max(abs(d['p1'][0] - d['p0'][0]), abs(d['p1'][1] - d['p0'][1])) / k * 2) + 2
        cx = ((np.linspace(d['p0'][0], d['p1'][0], n) - x0) / k).round().astype(int)
        cy = ((np.linspace(d['p0'][1], d['p1'][1], n) - y0) / k).round().astype(int)
        m[cy, cx] = True
    m = nd.binary_dilation(m)  # nét dầm liền, không rò qua đường chéo
    nhan, so = nd.label(~m)
    bien = set(nhan[0]) | set(nhan[-1]) | set(nhan[:, 0]) | set(nhan[:, -1])
    ra = []
    for i in range(1, so + 1):
        if i in bien:
            continue
        yy, xx = np.nonzero(nhan == i)
        dt = len(xx) * o_m * o_m
        if dt < dt_min:
            continue
        ra.append({'dien_tich_m2': round(dt, 1), 'tam': [round(x0 + xx.mean() * k, 2), round(y0 + yy.mean() * k, 2)],
                   'rect': [round(x0 + xx.min() * k, 2), round(y0 + yy.min() * k, 2), round(x0 + (xx.max() + 1) * k, 2), round(y0 + (yy.max() + 1) * k, 2)]})
    return ra


def nhan_dien(page, mau_dam_phu=(1, 0, 0)):
    doan = _doan(page)
    truc = tim_truc(page, doan)
    mm_pt = ty_le(page, truc)
    if not mm_pt:
        return {'loi': 'Không tìm được tỷ lệ (thiếu trục có nhãn trong vòng tròn hoặc số kích thước giữa trục)', 'truc': truc}
    cot = gop_cot(tim_cot(page, mm_pt), mm_pt)
    if truc:  # bỏ khối tô ngoài vùng lưới trục (logo, khung tên)
        vung = fitz.Rect(min(t['pos'] if t['huong'] == 'doc' else t['tu'] for t in truc), min(t['pos'] if t['huong'] == 'ngang' else t['tu'] for t in truc),
                         max(t['pos'] if t['huong'] == 'doc' else t['den'] for t in truc), max(t['pos'] if t['huong'] == 'ngang' else t['den'] for t in truc))
        vung += (-1000 / mm_pt, -1000 / mm_pt, 1000 / mm_pt, 1000 / mm_pt)
        cot = [c for c in cot if vung.contains(c)]
    ten = ten_cot(truc, cot, mm_pt)
    dam = dam_chinh(cot, ten, mm_pt, them=dam_theo_truc(truc, ten, cot, mm_pt)) + dam_loi(cot + loi_thang_may(page, mm_pt), mm_pt)
    phu = dam_phu(doan, mm_pt, mau_dam_phu)
    return {'mm_moi_pt': round(mm_pt, 3), 'truc': truc,
            'cot': [{'ten': t, 'rect': [round(c.x0, 2), round(c.y0, 2), round(c.x1, 2), round(c.y1, 2)], 'canh_m': [round(c.width * mm_pt / 1000, 2), round(c.height * mm_pt / 1000, 2)]} for t, c in zip(ten, cot)],
            'cot_giao_truc': sorted(t for t in ten if '/' in t), 'dam_chinh': dam, 'dam_phu': phu, 'khoang': khoang_dam(dam + phu, mm_pt),
            'gia_dinh': 'Dầm chính nối giữa hai cột liền kề, kể cả xiên (chưa có mặt bằng kết cấu); kích thước dầm chưa biết.'}


def ve(page, kq, ra, dpi=110):
    for k in kq.get('khoang', []):
        page.insert_text((k['tam'][0] - 8, k['tam'][1] + 3), f"{k['dien_tich_m2']}", fontsize=6, color=(0, 0.5, 0.1))
    for t in kq['truc']:
        a, b = ((t['pos'], t['tu']), (t['pos'], t['den'])) if t['huong'] == 'doc' else ((t['tu'], t['pos']), (t['den'], t['pos']))
        page.draw_line(a, b, color=(0.1, 0.3, 0.9), width=0.6, dashes='[4 2] 0')
    for c in kq.get('cot', []):
        page.draw_rect(fitz.Rect(c['rect']), color=(0.9, 0, 0), width=1.2)
    for d in kq.get('dam_chinh', []):
        page.draw_line(d['p0'], d['p1'], color=(1, 0.5, 0), width=2.2)
    for d in kq.get('dam_phu', []):
        page.draw_line(d['p0'], d['p1'], color=(0.8, 0, 0.8), width=2.2)
    page.get_pixmap(dpi=dpi).save(ra)


def tu_kiem():
    doc = fitz.open()
    p = doc.new_page(width=600, height=400)
    S = 100 / 4000  # 4000 mm = 100 pt -> 40 mm/pt
    xs, ys = [100, 200, 300], [100, 200]
    for i, x in enumerate(xs):  # trục dọc: nét đứt cắt đoạn + vòng nhãn
        for y in range(80, 260, 10):
            p.draw_line((x, y), (x, y + 6), width=0)
        p.draw_circle((x, 300), 8)
        p.insert_text((x - 3, 303), str(i + 1), fontsize=8)
    for j, y in enumerate(ys):
        for x in range(80, 360, 10):
            p.draw_line((x, y), (x + 6, y), width=0)
        p.draw_circle((40, y), 8)
        p.insert_text((37, y + 3), 'AB'[j], fontsize=8)
    for a, b in zip(xs, xs[1:]):
        p.insert_text(((a + b) / 2 - 8, 290), '4000', fontsize=6)
    for x in xs:
        for y in ys:
            p.draw_rect(fitz.Rect(x, y, x + 10, y + 10), color=None, fill=(0.5, 0.5, 0.5))  # cột 0,4 m, mép trùng trục
    p.draw_line((150, 100), (150, 200), color=(1, 0, 0), width=0.5)  # dầm phụ màu đỏ
    kq = nhan_dien(p)
    assert abs(kq['mm_moi_pt'] - 1 / S) < 0.5, kq['mm_moi_pt']
    assert [t['nhan'] for t in kq['truc']] == ['1', '2', '3', 'A', 'B'], kq['truc']
    assert len(kq['cot']) == 6 and len(kq['cot_giao_truc']) == 6
    assert len(kq['dam_chinh']) == 7, len(kq['dam_chinh'])  # 3 cột dọc x 1 + 2 hàng x 2, không nối chéo
    assert len(kq['dam_phu']) == 1 and len(kq['khoang']) == 3, kq['khoang']  # dầm phụ chia ô đầu làm hai
    # cột xiên (lệch 1,2 m khỏi trục) vẫn nối dầm
    p2 = fitz.open().new_page(width=200, height=200)
    for x, y in ((20, 20), (120, 50), (30, 120), (130, 150)):
        p2.draw_rect(fitz.Rect(x, y, x + 10, y + 10), color=None, fill=(0, 0, 0))
    c2 = tim_cot(p2, 40)
    assert len(dam_chinh(c2, [str(i) for i in range(4)], 40)) == 4
    print('tự kiểm: ĐẠT')


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')  # -I bỏ PYTHONIOENCODING
    a = sys.argv[1:]
    if a[:1] == ['--tu-kiem']:
        tu_kiem()
        sys.exit()
    anh = a[a.index('--anh') + 1] if '--anh' in a else None
    mau = tuple(float(x) for x in a[a.index('--mau-dam-phu') + 1].split(',')) if '--mau-dam-phu' in a else (1, 0, 0)
    pdf, trang, ra = a[0], int(a[1]), a[2]
    page = fitz.open(pdf)[trang - 1]
    kq = nhan_dien(page, mau)
    json.dump(kq, open(ra, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    if anh and 'loi' not in kq:
        ve(page, kq, anh)
    print(kq.get('loi') or f"tỷ lệ {kq['mm_moi_pt']} mm/pt; {len(kq['truc'])} trục, {len(kq['cot'])} cột ({len(kq['cot_giao_truc'])} ở giao trục), "
          f"{len(kq['dam_chinh'])} dầm chính, {len(kq['dam_phu'])} dầm phụ, {len(kq['khoang'])} khoang")
