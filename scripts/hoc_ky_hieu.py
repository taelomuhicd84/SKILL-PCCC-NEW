"""Học ký hiệu tường / tường có cửa / vách từ bản vẽ mẫu người dùng tô màu, rồi nhận diện bản vẽ khác. Không tốn token: Claude chỉ đọc điểm số.
Người dùng tô trên ảnh chụp mặt bằng (hoặc vẽ chú thích Line màu trên bản sao PDF: truyền PDF đánh dấu thay ảnh) (cắt từ chính trang PDF, không xoay): ĐỎ = tường, XANH LÁ = tường có lỗ cửa đi/cửa sổ, XANH DƯƠNG = vách (kính, panel).
Ký hiệu học được (PDF vector): tường = cặp nét song song có gạch chéo 45° giữa; vách = cặp nét sát nhau không gạch; tường có cửa = dải tường thẳng hàng
có khe hở >= 0,5 m không gạch (cửa đi, cửa sổ).
  Học:   python -I scripts/hoc_ky_hieu.py hoc <pdf> <trang> <anh_to.png | pdf_danh_dau.pdf> <dap_an.json>   (gộp luật vào data/ky_hieu/luat.json)
  Nhận:  python -I scripts/hoc_ky_hieu.py nhan <pdf> <trang> <ra.json> [ra.png] [dap_an.json để chấm điểm]
  Tự kiểm: python -I scripts/hoc_ky_hieu.py --tu-kiem
"""
import json
import math
import os
import sys
import numpy as np
import pymupdf as fitz

sys.path.insert(0, os.path.dirname(__file__))
import nhan_dien_ket_cau as kc  # noqa: E402

LUAT = os.path.join(os.path.dirname(__file__), '..', 'data', 'ky_hieu', 'luat.json')
MAU = {'tuong': (230, 30, 30), 'tuong_cua': (30, 200, 30), 'vach': (30, 60, 230)}  # màu tô và màu vẽ lại


def mat_na(A):
    R, G, B = A[..., 0], A[..., 1], A[..., 2]
    return {'tuong': (R > 180) & (G < 90) & (B < 90), 'tuong_cua': (G > 150) & (R < 120) & (B < 120), 'vach': (B > 170) & (R < 90) & (G < 120)}


def doc_anh(duong):
    im = fitz.Pixmap(duong)
    return np.frombuffer(im.samples, np.uint8).reshape(im.height, im.width, im.n)[:, :, :3].astype(int)


def anh_tu_pdf_danh_dau(page_dd, zoom=3):
    """Đáp án là PDF đánh dấu (chú thích Line/Ink/PolyLine màu): vẽ lại nét màu thuần lên trang trắng (tọa độ đã xoay) → ảnh tô, khớp sẵn."""
    M, q = page_dd.rotation_matrix, fitz.open().new_page(width=page_dd.rect.width, height=page_dd.rect.height)
    for a in page_dd.annots():
        c = a.colors.get('stroke')
        if not c:
            continue
        loai = max(range(3), key=lambda i: c[i])  # 0 đỏ, 1 xanh lá, 2 xanh dương
        mau = [x / 255 for x in list(MAU.values())[loai]]
        net_ = a.vertices or []
        net_ = net_ if not net_ or not isinstance(net_[0], list) else [v for n in net_ for v in n]  # Ink: nhiều nét
        sh = q.new_shape()
        for P, Q in zip(net_, net_[1:]):
            sh.draw_line(fitz.Point(P) * M, fitz.Point(Q) * M)
        sh.finish(color=mau, width=1.5)
        sh.commit()
    pm = q.get_pixmap(matrix=fitz.Matrix(zoom, zoom))
    return np.frombuffer(pm.samples, np.uint8).reshape(pm.h, pm.w, 3).astype(int), {'s': zoom, 'ox': 0, 'oy': 0, 'trung_khop': 1.0}


def khop_anh(page, A):
    """Ảnh = trang đã xoay x s + (ox, oy). Thô: FFT trên ảnh thu nhỏ 4 lần; tinh: dò ±3 % và ±6 px."""
    den = (A.max(2) - A.min(2) < 40) & (A.mean(2) < 200)  # nét xám/đen gốc (nét tô màu bị loại)

    def ve(s):
        pm = page.get_pixmap(matrix=fitz.Matrix(s, s), colorspace=fitz.csGRAY)
        return np.frombuffer(pm.samples, np.uint8).reshape(pm.height, pm.width) < 200

    h4, w4 = den.shape[0] // 4, den.shape[1] // 4
    d4 = den[:h4 * 4, :w4 * 4].reshape(h4, 4, w4, 4).any((1, 3)).astype(float)
    tot = None
    for s in np.geomspace(0.8, 8, 120):
        B = ve(s / 4).astype(float)
        if B.shape[0] < h4 or B.shape[1] < w4:
            continue
        F = np.fft.irfft2(np.fft.rfft2(B) * np.conj(np.fft.rfft2(d4, B.shape)), B.shape)
        y, x = np.unravel_index(F.argmax(), F.shape)
        diem = F[y, x] / math.sqrt(B.sum())  # chuẩn hoá: tỷ lệ lớn có nhiều nét hơn
        if tot is None or diem > tot[0]:
            tot = (diem, s, -x * 4, -y * 4)
    _, s0, ox0, oy0 = tot
    tot = None
    for s in np.linspace(s0 * 0.97, s0 * 1.03, 21):
        B = ve(s)
        for ox in range(int(ox0 * s / s0) - 6, int(ox0 * s / s0) + 7):
            for oy in range(int(oy0 * s / s0) - 6, int(oy0 * s / s0) + 7):
                sub = B[-oy:-oy + den.shape[0], -ox:-ox + den.shape[1]]
                if -ox < 0 or -oy < 0 or sub.shape != den.shape:
                    continue
                d = (sub & den).sum()
                if tot is None or d > tot[0]:
                    tot = (d, s, ox, oy)
    d, s, ox, oy = tot
    return {'s': round(float(s), 4), 'ox': ox, 'oy': oy, 'trung_khop': round(float(d / den.sum()), 3)}


def net(page, mm):
    """Nét liền đen/xám trong tọa độ trang chưa xoay: đoạn dài >= 0,3 m; trung điểm gạch chéo (30–60°, < 0,5 m); đầu mút cung cửa."""
    doan, gach, cung, ban_le = [], [], [], []
    ve_ = page.get_drawings()
    mau_cung = [round(max(dr['color']), 1) for dr in ve_ if dr['color'] for it in dr['items']
                if it[0] == 'c' and 0.6 <= abs(it[4] - it[1]) * mm / 1000 <= 2.3]  # chỉ cung cỡ cánh cửa (bỏ vòng tròn trục, ký hiệu)
    mau_cua = max(set(mau_cung), key=mau_cung.count) if mau_cung else None  # màu cung cửa đi phổ biến nhất; khác màu (cửa buồng WC) bỏ
    for dr in ve_:
        c = dr['color']
        if c is None or max(c) > 0.85 or max(c) - min(c) > 0.05 or (dr.get('dashes') or '[] 0') not in ('[] 0', '[]0'):
            continue
        for it in dr['items']:
            if it[0] == 'c' and round(max(c), 1) == mau_cua:
                cung += [(it[1].x, it[1].y), (it[4].x, it[4].y)]  # hai đầu cung: một đầu là bản lề trên mép khe
                A, B, C = it[1], it[4], (it[2] + it[3]) / 2  # bản lề = tâm cung phần tư: từ giữa dây cung đi ngược phía phình
                m, h = (A + B) / 2, (A + B) / 2 - C
                if abs(h) > 0:
                    H = m + h / abs(h) * abs(B - A) / 2
                    ban_le += [(H.x, H.y, A.x, A.y), (H.x, H.y, B.x, B.y)]  # bản lề + một đầu cung
            if it[0] in ('re', 'qu'):  # tường vẽ bằng khung chữ nhật: tách 4 cạnh
                q = it[1].quad if it[0] == 're' else it[1]
                doan += [(A, B, 1) for A, B in ((q.ul, q.ur), (q.ur, q.lr), (q.lr, q.ll), (q.ll, q.ul)) if abs(B - A) * mm >= 300]  # 1 = cạnh khung
                continue
            if it[0] != 'l':
                continue
            P, Q = it[1], it[2]
            L = abs(Q - P) * mm
            a = math.degrees(math.atan2(Q.y - P.y, Q.x - P.x)) % 180
            if L < 500 and 30 < a % 90 < 60:
                gach.append(((P.x + Q.x) / 2, (P.y + Q.y) / 2))
            elif L >= 300:
                doan.append((P, Q, 0))
    return doan, np.array(gach or [(-1e9, -1e9)]), np.array(cung or [(-1e9, -1e9)]), np.array(ban_le or [(-1e9, -1e9, -1e9, -1e9)])


def cap(doan, gach, mm, day_max=350, chong_min=300):
    """Cặp nét song song cách 30..day_max mm, chồng nhau >= chong_min mm (mẩu tường cạnh cửa WC ~0,4 m). Trả về trục giữa, bề dày, mật độ gạch chéo/m."""
    kq = []
    for i, (P, Q, k1) in enumerate(doan):
        u = (Q - P) / abs(Q - P)
        n = fitz.Point(-u.y, u.x)
        for P2, Q2, k2 in doan[i + 1:]:
            u2 = (Q2 - P2) / abs(Q2 - P2)
            if abs(u.x * u2.y - u.y * u2.x) > 0.035:  # lệch > 2°
                continue
            d = (P2 - P).x * n.x + (P2 - P).y * n.y
            if not 30 <= abs(d) * mm <= day_max:
                continue
            t = sorted([0, (Q - P).x * u.x + (Q - P).y * u.y])
            t2 = sorted([(X - P).x * u.x + (X - P).y * u.y for X in (P2, Q2)])
            lo, hi = max(t[0], t2[0]), min(t[1], t2[1])
            if (hi - lo) * mm < chong_min:
                continue
            g = gach - (P.x, P.y)
            gt, gn = g @ (u.x, u.y), g @ (n.x, n.y)
            co = ((gt > lo) & (gt < hi) & (gn * np.sign(d) > 0) & (abs(gn) < abs(d))).sum()
            a, b = P + u * lo + n * (d / 2), P + u * hi + n * (d / 2)
            kq.append({'p0': [round(a.x, 2), round(a.y, 2)], 'p1': [round(b.x, 2), round(b.y, 2)], 'day_mm': round(abs(d) * mm),
                       'dai_m': round((hi - lo) * mm / 1000, 2), 'gach_m': round(float(co / ((hi - lo) * mm / 1000)), 1), 'khung': bool(k1 or k2),
                       'khop': round((hi - lo) / max(abs(Q - P), abs(Q2 - P2)), 2)})  # phần chồng / nét dài hơn: mẩu tường thật ~1
    gon = {}  # bỏ cặp trùng (nét vẽ chồng, đoạn nối của path)
    for c in kq:
        gon.setdefault(tuple(round(v) for v in c['p0'] + c['p1']), c)
    return list(gon.values())


def _diem(c, k=9):
    return [fitz.Point(c['p0'][0] + (c['p1'][0] - c['p0'][0]) * t, c['p0'][1] + (c['p1'][1] - c['p0'][1]) * t) for t in np.linspace(0.05, 0.95, k)]


def gan_nhan(page, cs, A, kh, r=3):
    """Nhãn mỗi cặp = màu tô phủ >= 70 % điểm trên trục giữa; ngoài ảnh: None."""
    M, nm = page.rotation_matrix, mat_na(A)
    for c in cs:
        dem, ngoai = {}, False
        for P in _diem(c):
            q = P * M
            x, y = int(q.x * kh['s'] + kh['ox']), int(q.y * kh['s'] + kh['oy'])
            if not (r <= x < A.shape[1] - r and r <= y < A.shape[0] - r):
                ngoai = True
                break
            for k, m in nm.items():
                if m[y - r:y + r + 1, x - r:x + r + 1].any():
                    dem[k] = dem.get(k, 0) + 1
        c['loai'] = None if ngoai else next((k for k, v in sorted(dem.items(), key=lambda x: -x[1]) if v >= 7), 'khac')
    return [c for c in cs if c['loai']]


def phan_vi(v, q):
    return float(np.percentile(v, q)) if len(v) else None


def rut_luat(dap):
    """Ngưỡng từ đáp án: tường = có gạch, bề dày p10..p90; vách = không gạch, mỏng (<= 120 mm), p10..p90. Nét tô to dính cặp lân cận nên bỏ đuôi."""
    t = [c for c in dap if c['loai'] in ('tuong', 'tuong_cua') and c['gach_m'] >= 2]
    v = [c for c in dap if c['loai'] == 'vach' and c['gach_m'] < 1 and c['day_mm'] <= 120]
    return {'tuong_day_mm': [phan_vi([c['day_mm'] for c in t], 10), phan_vi([c['day_mm'] for c in t], 90)],
            'tuong_gach_min_m': max(1.0, 0.5 * (phan_vi([c['gach_m'] for c in t], 10) or 2)),
            'vach_day_mm': [phan_vi([c['day_mm'] for c in v], 10), phan_vi([c['day_mm'] for c in v], 90)],
            'khe_cua_m': [0.5, 4.0]}


def gop_luat(luat_cu, moi):
    """Gộp nhiều mẫu: lấy khoảng bao, gạch tối thiểu nhỏ nhất."""
    if not luat_cu:
        return moi
    g = dict(luat_cu)
    for k in ('tuong_day_mm', 'vach_day_mm'):
        a, b = luat_cu.get(k) or [None, None], moi.get(k) or [None, None]
        g[k] = [min(x for x in (a[0], b[0]) if x is not None) if a[0] is not None or b[0] is not None else None,
                max(x for x in (a[1], b[1]) if x is not None) if a[1] is not None or b[1] is not None else None]
    g['tuong_gach_min_m'] = min(luat_cu['tuong_gach_min_m'], moi['tuong_gach_min_m'])
    return g


def _thang_hang(a, b, sai):
    """Hai đoạn trục cùng phương, cùng đường thẳng (lệch <= sai pt)."""
    u = fitz.Point(a['p1'][0] - a['p0'][0], a['p1'][1] - a['p0'][1])
    u = u / abs(u)
    v = fitz.Point(b['p1'][0] - b['p0'][0], b['p1'][1] - b['p0'][1])
    if abs(u.x * v.y - u.y * v.x) / abs(v) > 0.035:
        return None
    w = fitz.Point(b['p0'][0] - a['p0'][0], b['p0'][1] - a['p0'][1])
    return u if abs(u.x * w.y - u.y * w.x) <= sai else None


def cum_gach(gach, tuong, mm, r_m=0.25, it_nhat=3):
    """Mẩu tường chỉ có gạch chéo, thiếu nét mặt (mẩu cạnh cửa WC): cụm gạch ngoài mọi cặp tường → đoạn theo cạnh dài khung bao."""
    con = []
    for x, y in gach:
        P = fitz.Point(x, y)
        if not any(_gan_doan(P, c, c['day_mm'] / 2 / mm + 0.1) for c in tuong):
            con.append((x, y))
    if not con:
        return []
    A = np.array(con)
    nhan_ = -np.ones(len(A), int)
    for i in range(len(A)):  # gom cụm lân cận <= r_m
        if nhan_[i] >= 0:
            continue
        nhan_[i], hang = i, [i]
        while hang:
            j = hang.pop()
            for k in np.nonzero((np.hypot(*(A - A[j]).T) <= r_m * 1000 / mm) & (nhan_ < 0))[0]:
                nhan_[k] = i
                hang.append(k)
    kq = []
    for i in set(nhan_):
        B = A[nhan_ == i]
        if len(B) < it_nhat:
            continue
        (x0, y0), (x1, y1) = B.min(0), B.max(0)
        w, h = (x1 - x0) * mm, (y1 - y0) * mm
        if max(w, h) < 200 or min(w, h) > 300:
            continue
        a, b = ((x0, (y0 + y1) / 2), (x1, (y0 + y1) / 2)) if w >= h else (((x0 + x1) / 2, y0), ((x0 + x1) / 2, y1))
        kq.append({'p0': [round(float(a[0]), 2), round(float(a[1]), 2)], 'p1': [round(float(b[0]), 2), round(float(b[1]), 2)], 'day_mm': round(float(max(min(w, h), 100))),
                   'dai_m': round(float(max(w, h)) / 1000, 2), 'gach_m': float(len(B)), 'khung': False, 'khop': 1.0, 'chi_gach': True})
    return kq


def _gan_doan(P, c, sai):
    A, B = fitz.Point(c['p0']), fitz.Point(c['p1'])
    d = B - A
    k = max(0, min(1, ((P - A).x * d.x + (P - A).y * d.y) / max(1e-9, d.x ** 2 + d.y ** 2)))
    return abs(P - (A + d * k)) <= sai


def nhan_dien(page, luat, mm=None):
    """Phân loại cặp nét theo luật; dải tường thẳng hàng có khe >= khe_cua_m[0] không gạch → tường có cửa."""
    mm = mm or kc.ty_le(page, kc.tim_truc(page))
    doan, gach, cung, ban_le = net(page, mm)
    cs = cap(doan, gach, mm)
    t0, t1 = luat['tuong_day_mm']
    v0, v1 = luat['vach_day_mm'] if luat.get('vach_day_mm') and luat['vach_day_mm'][0] else (30, 100)
    tuong = [c for c in cs if t0 * 0.9 <= c['day_mm'] <= t1 * 1.1 and c['gach_m'] >= luat['tuong_gach_min_m'] and (c['dai_m'] >= 0.5 or c['khop'] >= 0.7)]
    vach = [c for c in cs if v0 * 0.8 <= c['day_mm'] <= v1 * 1.2 and c['gach_m'] < 1 and not c['khung'] and c['dai_m'] >= 0.5]  # khung chữ nhật (cánh cửa, ký hiệu) không phải vách/cửa sổ
    tuong += cum_gach(gach, tuong, mm)
    # dải tường: gom đoạn thẳng hàng, xét khe giữa hai đoạn liên tiếp
    k0, k1 = luat['khe_cua_m']
    nhom = []
    for c in tuong:
        for g in nhom:
            if _thang_hang(g[0], c, 0.15 * 1000 / mm):
                g.append(c)
                break
        else:
            nhom.append([c])
    khe_cua = []
    for g in nhom:
        u = _thang_hang(g[0], g[0], 1e9)
        O = fitz.Point(g[0]['p0'])
        day = max(c['day_mm'] for c in g) / mm
        n0 = (O.x * -u.y + O.y * u.x)

        tg = [(P2 - O).x * u.x + (P2 - O).y * u.y for c2 in tuong if c2 not in g for P2 in (fitz.Point(c2['p0']), fitz.Point(c2['p1']))
              if abs(P2.x * -u.y + P2.y * u.x - n0) <= day / 2 + c2['day_mm'] / 2 / mm + 100 / mm]  # điểm tường vuông góc tì vào trục dải
        for c2 in tuong:  # tường vuông góc cắt ngang trục dải (vách ô kỹ thuật xuyên qua) cũng là chỗ giao
            A2, B2 = fitz.Point(c2['p0']), fitz.Point(c2['p1'])
            na, nb = A2.x * -u.y + A2.y * u.x - n0, B2.x * -u.y + B2.y * u.x - n0
            if c2 not in g and na * nb < 0 and abs(na - nb) > 1e-6:
                X = A2 + (B2 - A2) * (na / (na - nb))
                tg.append((X - O).x * u.x + (X - O).y * u.y)

        def giao(t_lo, t_hi):
            return any(t_lo - day <= t2 <= t_hi + day for t2 in tg)
        doan_t = []
        for c in g:  # cắt đoạn tại chỗ giao (mặt tường vẽ liền qua chỗ giao)
            a, b = sorted((fitz.Point(c[k]) - O).x * u.x + (fitz.Point(c[k]) - O).y * u.y for k in ('p0', 'p1'))
            moc = [a] + sorted(t2 for t2 in tg if a + day < t2 < b - day) + [b]
            for x0, x1 in zip(moc, moc[1:]):
                if x1 - x0 < 1e-6:
                    continue
                if len(moc) == 2:
                    doan_t.append((a, b, c))
                    continue
                P_, Q_ = O + u * x0 + fitz.Point(-u.y, u.x) * ((fitz.Point(c['p0']) - O).x * -u.y + (fitz.Point(c['p0']) - O).y * u.x), None
                Q_ = P_ + u * (x1 - x0)
                c_ = dict(c, p0=[round(P_.x, 2), round(P_.y, 2)], p1=[round(Q_.x, 2), round(Q_.y, 2)], dai_m=round((x1 - x0) * mm / 1000, 2))
                doan_t.append((x0, x1, c_))
        doan_t.sort(key=lambda x: x[:2])
        g[:] = [c for _, _, c in doan_t]
        chay, het = [], None  # mảng tường: cắt ở chỗ tường vuông góc giao vào (người dùng 2026-10-30) và khe trống > k1; nối qua khe cửa
        for a, b, c in doan_t:
            khe = None if het is None else (a - het) * mm / 1000
            if khe is not None and khe < k0 and giao(min(het, a) - day, max(het, a) + day):  # khe âm (đoạn chồng) cũng xét
                chay.append({'ds': [], 'cua': False})
            elif khe is not None and khe >= k0:
                P, Q = O + u * het, O + u * a
                M_ = (P + Q) / 2
                g_ = cung - (P.x, P.y)  # đầu cung nằm trên đoạn khe (lệch <= bề dày tường)
                t_ = g_ @ (u.x, u.y) * np.sign((Q - P).x * u.x + (Q - P).y * u.y)
                cung_ = bool(((t_ >= -day) & (t_ <= abs(Q - P) + day) & (abs(g_ @ (-u.y, u.x)) <= day)).any())
                so_ = sum(1 for X, Y, k_ in doan if not k_ and abs(abs((Y - X).x * u.x + (Y - X).y * u.y) - abs(Q - P)) < 0.3 * abs(Q - P)
                          and abs(((X + Y) / 2 - M_).x * u.y - ((X + Y) / 2 - M_).y * u.x) < day and abs(((X + Y) / 2 - M_).x * u.x + ((X + Y) / 2 - M_).y * u.y) < 0.3 * abs(Q - P))
                if khe <= k1 and (cung_ or so_ >= 2):
                    khe_cua.append({'p0': [round(P.x, 2), round(P.y, 2)], 'p1': [round(Q.x, 2), round(Q.y, 2)], 'dai_m': round(khe, 2),
                                    'loai': 'cua_di' if cung_ else 'cua_so', 'day_mm': round(day * mm)})
                    chay[-1]['cua'] = 'khe cửa giữa mảng'
                elif khe > k1 or giao(het, a):  # hành lang (có tường giao) hoặc khe dài: mảng riêng
                    chay.append({'ds': [], 'cua': False})
                # khe không ký hiệu, không tường giao (nét bị cắt bởi chữ, cột): nối tiếp, chưa coi là lỗ trống
            if not chay:
                chay.append({'ds': [], 'cua': False})
            chay[-1]['ds'].append(c)
            het = b if het is None else max(het, b)
        for r in chay:  # cửa sát góc (chỉ có tường một bên khe): đầu cung nằm trên phần kéo dài của dải, cách đầu dải 0,4..k1 m
            ts = [x for c in r['ds'] for x in [(fitz.Point(c[k]) - O).x * u.x + (fitz.Point(c[k]) - O).y * u.y for k in ('p0', 'p1')]]
            nr = (fitz.Point(r['ds'][0]['p0']) - O).x * -u.y + (fitz.Point(r['ds'][0]['p0']) - O).y * u.x
            tren = lambda X: abs((X - (O.x, O.y)) @ (-u.y, u.x) - nr) <= 0.6 * day  # noqa: E731
            ngoai = lambda X: np.maximum(min(ts) - (X - (O.x, O.y)) @ (u.x, u.y), (X - (O.x, O.y)) @ (u.x, u.y) - max(ts)) * mm / 1000  # noqa: E731
            H_, E_ = ban_le[:, :2], ban_le[:, 2:]  # cánh cửa đóng nằm dọc dải: bản lề và đầu cung đều trên trục, đầu cung ở ngoài đầu dải
            giua = (min(ts) + max(ts)) / 2
            cung_phia = np.sign((H_ - (O.x, O.y)) @ (u.x, u.y) - giua) == np.sign((E_ - (O.x, O.y)) @ (u.x, u.y) - giua)
            ung = tren(H_) & tren(E_) & cung_phia & (np.minimum(ngoai(H_), ngoai(E_)) >= -0.1) & (np.minimum(ngoai(H_), ngoai(E_)) <= 0.3)                 & (np.maximum(ngoai(H_), ngoai(E_)) >= 0.5) & (np.maximum(ngoai(H_), ngoai(E_)) <= 1.5)  # bản lề sát đầu dải hoặc ở mép khe xa
            khac = [sorted((fitz.Point(c[k]) - O).x * u.x + (fitz.Point(c[k]) - O).y * u.y for k in ('p0', 'p1')) for c in g if c not in r['ds']]
            for i in np.nonzero(ung)[0]:  # lỗ cửa phải trống: không có đoạn tường thẳng hàng khác phủ khoảng đầu mảng → mép cửa xa
                tt = sorted((X - (O.x, O.y)) @ (u.x, u.y) for X in (H_[i], E_[i]))
                dau = max(ts) if tt[0] > max(ts) - 1e-6 else min(ts)
                phu = lambda lo, hi: sum(max(0, min(hi, b_) - max(lo, a_)) for a_, b_ in khac) / max(1e-9, hi - lo)  # noqa: E731
                gan, xa = sorted(tt, key=lambda t: abs(t - dau))  # mép cửa gần / xa đầu mảng
                if (abs(gan - dau) * mm < 150 or phu(*sorted((gan, dau))) <= 0.3) and phu(*sorted((xa, dau))) <= 0.3:
                    P, Q = (O + u * t + fitz.Point(-u.y, u.x) * nr for t in (dau, xa))
                    khe_cua.append({'p0': [round(P.x, 2), round(P.y, 2)], 'p1': [round(Q.x, 2), round(Q.y, 2)], 'dai_m': round(abs(xa - dau) * mm / 1000, 2),
                                    'loai': 'cua_di', 'day_mm': round(day * mm), 'sat_goc': True})
                    break
            else:
                continue
            if True:
                r['cua'] = 'cửa sát đầu mảng'
        for v in vach:  # cặp không gạch nằm trên trục dải tường = cửa sổ (nét tường ngoài vẫn liền)
            if v.get('cua_so') or not _thang_hang(g[0], v, day / 2 + 0.05 * 1000 / mm):
                continue
            t = [(fitz.Point(v[k]) - O).x * u.x + (fitz.Point(v[k]) - O).y * u.y for k in ('p0', 'p1')]
            g_ = gach - (O.x, O.y)  # cửa sổ = tường bị khoét: không còn gạch chéo trên đoạn đó (cánh cửa nằm dọc tường thì gạch vẫn còn)
            m_ = (g_ @ (u.x, u.y) > min(t)) & (g_ @ (u.x, u.y) < max(t)) & (abs(g_ @ (-u.y, u.x) - ((fitz.Point(v['p0']) - O).x * -u.y + (fitz.Point(v['p0']) - O).y * u.x)) < day)
            if m_.sum() > max(1, v['dai_m'] * 2):
                continue
            for r in chay:
                ts = [x for c in r['ds'] for x in [(fitz.Point(c[k]) - O).x * u.x + (fitz.Point(c[k]) - O).y * u.y for k in ('p0', 'p1')]]
                if min(ts) - day <= min(t) and max(t) <= max(ts) + day:
                    r['cua'], v['cua_so'] = 'cửa sổ', True
                    khe_cua.append({'p0': v['p0'], 'p1': v['p1'], 'dai_m': v['dai_m'], 'loai': 'cua_so'})
                    break
        for r in chay:
            for c in r['ds']:
                c['loai'], c['ly_do'] = ('tuong_cua', r['cua']) if r['cua'] else ('tuong', None)
    for c in (c for g in nhom for c in g if c['loai'] == 'tuong'):  # mẩu tường lệch trục nhưng chạm mép khe cửa song song (cạnh cửa WC)
        u = fitz.Point(c['p1'][0] - c['p0'][0], c['p1'][1] - c['p0'][1])
        for k in (k for k in khe_cua if not k.get('sat_goc')):  # cửa sát góc đã gán đúng mảng; mảng bên kia chỗ giao không lây
            v = fitz.Point(k['p1'][0] - k['p0'][0], k['p1'][1] - k['p0'][1])
            if abs(u.x * v.y - u.y * v.x) <= 0.035 * abs(u) * abs(v) and min(math.dist(a, b) for a in (c['p0'], c['p1']) for b in (k['p0'], k['p1'])) <= (c['day_mm'] + 150) / mm:
                c['loai'], c['ly_do'] = 'tuong_cua', 'chạm mép khe cửa'
                break
    # vách nằm trong khe cửa = khuôn cửa sổ, không phải vách
    trong_khe = lambda c: any(_thang_hang(k, c, 0.15 * 1000 / mm) for k in khe_cua)  # noqa: E731
    tuong_all = [c for g in nhom for c in g]

    def tua_tuong(c, sai=0.4 * 1000 / mm):  # vách phải tì một đầu vào tường (loại dòng kẻ bảng, khung tên, ký hiệu)
        for P in (fitz.Point(c['p0']), fitz.Point(c['p1'])):
            for t in tuong_all:
                A_, B_ = fitz.Point(t['p0']), fitz.Point(t['p1'])
                d_ = B_ - A_
                k = max(0, min(1, ((P - A_).x * d_.x + (P - A_).y * d_.y) / (d_.x ** 2 + d_.y ** 2)))
                if abs(P - (A_ + d_ * k)) <= sai + t['day_mm'] / 2 / mm:
                    return True
        return False
    vach = [dict(c, loai='vach') for c in vach if not c.get('cua_so') and not trong_khe(c) and tua_tuong(c)]
    lo_cua = [dict(k, loai='tuong_cua', lo_cua=k['loai']) for k in khe_cua if 'day_mm' in k]  # lỗ cửa thuộc mảng tường có cửa: vẽ xanh liền qua lỗ
    return {'mm_moi_pt': round(mm, 3), 'luat': luat, 'doi_tuong': tuong_all + lo_cua + vach, 'khe_cua': khe_cua}


def cham(du, dap, sai_pt=1.0):
    """So theo chiều dài trục, từng điểm (mỗi 0,1 đoạn): độ phủ = % đáp án có dự đoán cùng loại sát bên; độ đúng = % dự đoán có đáp án cùng loại sát bên."""
    def ti_le(a, b):
        tong = trung = 0.0
        for c in a:
            ok = [any(min(math.dist((P.x, P.y), (Q.x, Q.y)) for Q in _diem(d, 21)) <= sai_pt for d in b) for P in _diem(c, 11)]
            tong += c['dai_m']
            trung += c['dai_m'] * sum(ok) / len(ok)
        return trung / max(1e-9, tong)
    kq = {}
    for k in MAU:
        a = [c for c in dap if c['loai'] == k]
        b = [c for c in du if c['loai'] == k and not c.get('lo_cua')]  # đáp án dựng từ cặp nét tường không có đoạn lỗ cửa
        kq[k] = {'do_phu': round(ti_le(a, b), 2), 'do_dung': round(ti_le(b, a), 2), 'm_dap_an': round(sum(c['dai_m'] for c in a), 1), 'm_du_doan': round(sum(c['dai_m'] for c in b), 1)}
    return kq


def ve(page, ds, ra, zoom=3):
    sh = page.new_shape()
    for c in sorted(ds, key=lambda c: c['loai'] == 'tuong_cua'):  # xanh lá vẽ sau cùng, không bị đỏ của cặp trùng che
        sh.draw_line(fitz.Point(c['p0']), fitz.Point(c['p1']))
        sh.finish(color=[x / 255 for x in MAU[c['loai']]], width=1.6, stroke_opacity=0.75)
    sh.commit(overlay=True)
    page.get_pixmap(matrix=fitz.Matrix(zoom, zoom)).save(ra)


def hoc(pdf, trang, anh, ra):
    page = fitz.open(pdf)[trang - 1]
    if anh.lower().endswith('.pdf'):
        A, kh = anh_tu_pdf_danh_dau(fitz.open(anh)[trang - 1])
    else:
        A = doc_anh(anh)
        kh = khop_anh(page, A)
    mm = kc.ty_le(page, kc.tim_truc(page))
    doan, gach, _, _ = net(page, mm)
    dap = [c for c in gan_nhan(page, cap(doan, gach, mm), A, kh) if c['loai'] != 'khac']
    luat = rut_luat(dap)
    json.dump({'nguon': {'pdf': os.path.basename(pdf), 'trang': trang, 'anh': os.path.basename(anh)}, 'khop_anh': kh, 'mm_moi_pt': round(mm, 3),
               'luat_mau_nay': luat, 'doi_tuong': dap}, open(ra, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    cu = json.load(open(LUAT, encoding='utf-8')) if os.path.exists(LUAT) else {}
    mau = [m for m in cu.get('mau', []) if m != ra] + [os.path.relpath(ra, os.path.dirname(LUAT)).replace('\\', '/')]
    tong = gop_luat(cu.get('luat'), luat)
    os.makedirs(os.path.dirname(LUAT), exist_ok=True)
    json.dump({'luat': tong, 'mau': mau}, open(LUAT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('khớp ảnh', kh, '| đáp án', {k: sum(1 for c in dap if c['loai'] == k) for k in MAU}, '| luật', luat)


def tu_kiem():
    """Mặt bằng giả: tường 200 có gạch, khe cửa 1 m; vách 50 không gạch. Ảnh tô vẽ từ chính trang."""
    d = fitz.open()
    p = d.new_page(width=300, height=200)
    mm = 100.0  # 1 pt = 100 mm
    sh = p.new_shape()
    for y in (50, 52):  # tường ngang dài 10 m + 10 m, khe cửa 1 m ở giữa (x 150..160)
        sh.draw_line((40, y), (150, y)); sh.draw_line((160, y), (260, y))
    for x in list(range(41, 150, 2)) + list(range(161, 260, 2)):
        sh.draw_line((x, 52), (x + 2, 50))  # gạch chéo 45°
    for y in (120, 122):  # tường kín dài 10 m
        sh.draw_line((40, y), (140, y))
    for x in range(41, 140, 2):
        sh.draw_line((x, 122), (x + 2, 120))
    for x in (200, 200.5):  # vách 50 mm dài 6 m, tì vào tường trên
        sh.draw_line((x, 52), (x, 112))
    for y in (180, 180.5):  # dòng kẻ bảng xa tường: không phải vách
        sh.draw_line((20, y), (100, y))
    sh.draw_bezier((150, 52), (150, 60), (156, 62), (160, 62))  # cung cửa đi ở khe
    sh.finish(color=(0, 0, 0), width=0.24)
    sh.commit()
    luat = {'tuong_day_mm': [190, 210], 'tuong_gach_min_m': 2, 'vach_day_mm': [45, 55], 'khe_cua_m': [0.5, 4]}
    kq = nhan_dien(p, luat, mm)
    loai = sorted((c['loai'], c['dai_m']) for c in kq['doi_tuong'])
    assert ('tuong', 10.0) in loai and ('vach', 6.0) in loai, loai
    assert sum(1 for c in kq['doi_tuong'] if c['loai'] == 'tuong_cua' and not c.get('lo_cua')) == 2 and len(kq['khe_cua']) == 1, loai
    assert ('tuong_cua', 1.0) in loai, 'lỗ cửa 1 m vẽ liền trong mảng có cửa'
    assert cham(kq['doi_tuong'], kq['doi_tuong'])['tuong']['do_phu'] == 1.0
    # khớp ảnh: tô đỏ trên ảnh render rồi khớp lại
    pm = p.get_pixmap(matrix=fitz.Matrix(2.5, 2.5))
    A = np.frombuffer(pm.samples, np.uint8).reshape(pm.h, pm.w, 3).astype(int)[30:, 20:].copy()
    kh = khop_anh(p, A)
    for x, y in ((60, 60), (150, 100), (250, 130)):  # điểm trang ra đúng điểm ảnh (sai <= 4 px)
        assert abs(x * kh['s'] + kh['ox'] - (x * 2.5 - 20)) <= 4 and abs(y * kh['s'] + kh['oy'] - (y * 2.5 - 30)) <= 4, kh
    print('tự kiểm đạt')


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    a = sys.argv[1:]
    if a == ['--tu-kiem']:
        tu_kiem()
    elif a[:1] == ['hoc'] and len(a) == 5:
        hoc(a[1], int(a[2]), a[3], a[4])
    elif a[:1] == ['nhan'] and len(a) >= 4:
        page = fitz.open(a[1])[int(a[2]) - 1]
        kq = nhan_dien(page, json.load(open(LUAT, encoding='utf-8'))['luat'])
        json.dump(kq, open(a[3], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print({k: round(sum(c['dai_m'] for c in kq['doi_tuong'] if c['loai'] == k), 1) for k in MAU}, 'm |', len(kq['khe_cua']), 'khe cửa')
        if len(a) >= 6:
            print('điểm', json.dumps(cham(kq['doi_tuong'], json.load(open(a[5], encoding='utf-8'))['doi_tuong']), ensure_ascii=False))
        if len(a) >= 5:
            ve(page, kq['doi_tuong'], a[4])
    else:
        raise SystemExit(__doc__)
