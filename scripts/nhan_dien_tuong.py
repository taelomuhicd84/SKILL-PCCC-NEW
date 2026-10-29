"""Nhận diện tường trên mặt bằng PDF (vector) để biết chỗ nào được lắp đầu phun sprinkler.
Tường = nét đen đậm (>= 0,5 pt), mảng gạch chéo xám trong tường, cột tô đen (cạnh 0,2–1,2 m); bỏ nét đứt (trục, đường cắt).
Khép khe cửa/cửa sổ <= 2 x r_khe bằng cách nở nét tường r_khe (phép đóng không lấp được khe giữa hai đầu nét mảnh), rồi chia mặt bằng thành vùng kín. Mỗi vùng:
- ngoài khuôn nhà (khuôn = tường nở r_khuon, lấp kín trong, co lại): ngoài nhà;
- có chữ RAM, TAM CẤP (cả vùng) hoặc WC, VỆ SINH, THANG MÁY, BTB, HỘP KT/GEN trong vùng < dt_phong m²: không lắp; vùng lớn hơn (vách mảnh không khép) chỉ loại quanh chữ (WC 1,2 m, thang 2,5 m);
- vùng < dt_kin m² không có chữ nào và không có cung cửa: khoảng kín (đất đắp, hộp kỹ thuật), không lắp.
Dùng: from nhan_dien_tuong import MatBang; mb = MatBang(page, S_pt_moi_m); ok, ly_do = mb.lap_duoc((x_pt, y_pt))
Tự kiểm: python -I scripts/nhan_dien_tuong.py --tu-kiem   |   Xem vùng: python -I scripts/nhan_dien_tuong.py <pdf> <trang> <ra.png>
"""
import re
import sys
import numpy as np
import pymupdf as fitz
from scipy import ndimage as nd

KHONG_LAP = re.compile(r'RAM|TAM\s*C[ẤA]P|\bW\.?C\b|V[ỆE]\s*SINH|THANG\s*M[ÁA]Y|BTB|H[ỘO]P\s*(KT|K[ỸY])|\bGEN\b', re.I)


def _den(c):
    return c is not None and max(c) < 0.15


def _xam(c):
    return c is not None and 0.4 < c[0] < 0.6 and abs(c[0] - c[1]) < 0.02


CHU_PHONG = re.compile(r'[A-Za-zÀ-ỹ]{2,}')  # chữ tên phòng; bỏ số kích thước, cao độ


def _disk(r):
    yy, xx = np.ogrid[-r:r + 1, -r:r + 1]
    return xx * xx + yy * yy <= r * r


class MatBang:
    def __init__(self, page, S, r_khe=0.65, r_khuon=2.0, dt_phong=12.0, dt_kin=15.0, zoom=1.0):
        self.S, self.z = S, zoom
        q = fitz.open().new_page(width=page.rect.width, height=page.rect.height)
        cua = []  # cung cửa (đường cong): có cửa thì là phòng dùng được
        for dr in page.get_drawings():
            w, col, fill, r = dr.get('width') or 0, dr.get('color'), dr.get('fill'), dr['rect']
            if (dr.get('dashes') or '[] 0') not in ('[] 0', '[]0'):
                continue  # nét đứt: trục, đường cắt, mép mái
            if not fill and any(it[0] == 'c' for it in dr['items']) and 0.6 * S <= max(r.width, r.height) <= 1.8 * S:
                cua.append(((r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2))
            tuong = (_den(col) and w >= 0.5) or _xam(fill) or (_den(fill) and 0.2 * S <= min(r.width, r.height) and max(r.width, r.height) <= 1.2 * S)
            if not tuong:
                continue
            sh = q.new_shape()
            for it in dr['items']:
                if it[0] == 'l':
                    sh.draw_line(it[1], it[2])
                elif it[0] == 're':
                    sh.draw_rect(it[1])
                elif it[0] == 'qu':
                    sh.draw_quad(it[1])
            sh.finish(color=(0, 0, 0), fill=(0, 0, 0) if fill else None, width=max(w, 0.8))
            sh.commit()
        pix = q.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
        self.tuong = np.frombuffer(pix.samples, np.uint8).reshape(pix.h, pix.w, 3)[..., 0] < 128
        px = S * zoom
        self.kin = nd.binary_dilation(self.tuong, structure=_disk(max(1, int(r_khe * px))))  # khép khe cửa <= 2 r_khe
        rk = max(1, int(r_khuon * px))  # khuôn nhà: nở 2 m (khép cả lối ram, cửa lớn), lấp kín trong, co lại
        self.khuon = nd.binary_erosion(nd.binary_fill_holes(nd.binary_dilation(self.tuong, structure=_disk(rk))), structure=_disk(rk))
        lab, n = nd.label(~self.kin & self.khuon)
        kc, (iy, ix) = nd.distance_transform_edt(lab == 0, return_indices=True)  # trả dải tường đã nở (<= r_khe) về vùng gần nhất: diện tích thật
        self.lab = np.where(~self.tuong & self.khuon & (kc <= r_khe * px + 1), lab[iy, ix], 0)  # khu gạch dày (ram, thang) vẫn là 0
        self.lab0, n0 = nd.label(~self.tuong)  # vùng chưa nở tường: hộp kỹ thuật nhỏ bị nở lấp mất
        self.dt0 = nd.sum(np.ones_like(self.lab0), self.lab0, index=np.arange(n0 + 1)) / px ** 2
        dt = nd.sum(np.ones_like(self.lab), self.lab, index=np.arange(n + 1)) / px ** 2
        self.chu = [(((w[0] + w[2]) / 2, (w[1] + w[3]) / 2), w[4]) for w in page.get_text('words')]  # mọi chữ (cả "V.I.P 01")
        self.chu0 = {self._o(self.lab0, c) for c, _ in self.chu}
        chu, co_cua = {}, set()
        for c, t in self.chu:
            chu.setdefault(self._vung(c), []).append(t)
        for c in cua:
            co_cua.add(self._vung(c, tim=1.5))
        self.vung = {}
        for v in range(1, n + 1):
            t = ' '.join(chu.get(v, []))
            m = KHONG_LAP.search(t)
            if m and (dt[v] < dt_phong or re.match(r'RAM|TAM', m.group(0), re.I)):
                ly = f'không lắp ({m.group(0)})'  # cả vùng: WC, hộp, giếng thang nhỏ; ram, tam cấp
            elif dt[v] < dt_kin and not t and v not in co_cua:
                ly = f'khoảng kín {dt[v]:.1f} m² không chữ, không cửa'
            else:
                ly = None
            self.vung[v] = {'dt': float(dt[v]), 'chu': t, 'khong_lap': ly}

    def _o(self, lab, pt):
        x, y = int(pt[0] * self.z), int(pt[1] * self.z)
        return int(lab[y, x]) if 0 <= y < lab.shape[0] and 0 <= x < lab.shape[1] else 0

    def _vung(self, pt, tim=None):
        """Vùng chứa điểm (pt trang); 0 = trên nét tường hoặc ngoài khuôn."""
        return self._o(self.lab, pt)

    def lap_duoc(self, pt):
        if not self._o(self.khuon.astype(int), pt):
            return False, 'ngoài khuôn nhà'
        v0 = self._o(self.lab0, pt)
        if v0 and self.dt0[v0] < 6 and v0 not in self.chu0:
            return False, f'khoảng kín {self.dt0[v0]:.1f} m² không có chữ (hộp kỹ thuật)'
        v = self._vung(pt)
        if not v:
            return False, 'nằm trong tường'
        i = self.vung[v]
        if i['khong_lap']:
            return False, i['khong_lap']
        for c, t in self.chu:  # vùng lớn chứa chữ WC, thang… (vách mảnh không nhận là tường): chỉ loại quanh chữ
            m = KHONG_LAP.search(t)
            r = 1.2 if m and re.match(r'W|V', m.group(0), re.I) else 2.5  # WC ~ 1,5 x 2 m; buồng thang lớn hơn
            if m and np.hypot(pt[0] - c[0], pt[1] - c[1]) < r * self.S and self._vung(c) == v:
                return False, f'gần chữ {m.group(0)}'
        return True, f"trong nhà (vùng {i['dt']:.0f} m²)"

    def anh(self, ra):
        rng = np.random.default_rng(1)
        mau = rng.integers(70, 255, (len(self.vung) + 1, 3)).astype(np.uint8)
        mau[0] = 0
        for v, i in self.vung.items():
            if i['khong_lap']:
                mau[v] = (235, 235, 235)
        img = np.ascontiguousarray(mau[self.lab])
        fitz.Pixmap(fitz.csRGB, img.shape[1], img.shape[0], img.tobytes(), 0).save(ra)


def tu_kiem():
    """Nhà 20 x 10 m: phòng lớn có chữ SẢNH và cửa, WC, hộp kỹ thuật kín 1 x 1 m, ram có khe hở ra ngoài."""
    S = 10.0
    d = fitz.open()
    p = d.new_page(width=400, height=300)
    X, Y = lambda m: 50 + m * S, lambda m: 50 + m * S
    sh = p.new_shape()
    for a, b in [((0, 0), (20, 0)), ((20, 0), (20, 10)), ((20, 10), (0, 10)), ((0, 10), (0, 0)),
                 ((14, 0), (14, 4)), ((14, 6), (14, 10)),  # tường WC, cửa 2 m … khép lại vì vẫn lớn? dùng khe 1 m:
                 ((14, 4), (17, 4)), ((18, 4), (20, 4)),   # WC 6 x 4 m ở góc, cửa 1 m
                 ((3, 3), (4, 3)), ((4, 3), (4, 4)), ((4, 4), (3, 4)), ((3, 4), (3, 3))]:  # hộp kỹ thuật kín
        sh.draw_line((X(a[0]), Y(a[1])), (X(b[0]), Y(b[1])))
    sh.finish(color=(0, 0, 0), width=1.0)
    sh.commit()
    p.insert_text((X(6), Y(7)), 'SẢNH', fontsize=8)
    p.insert_text((X(16), Y(2)), 'WC', fontsize=8)
    mb = MatBang(p, S, r_khe=0.65)
    assert mb.lap_duoc((X(8), Y(5)))[0], mb.lap_duoc((X(8), Y(5)))
    assert not mb.lap_duoc((X(16.5), Y(1.5)))[0], 'WC phải không lắp'
    assert not mb.lap_duoc((X(3.5), Y(3.5)))[0], 'hộp kỹ thuật kín phải không lắp'
    assert not mb.lap_duoc((X(25), Y(5)))[0], 'ngoài nhà phải không lắp'
    print('tự kiểm đạt')


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    if sys.argv[1:] == ['--tu-kiem']:
        tu_kiem()
    elif len(sys.argv) == 4:
        mb = MatBang(fitz.open(sys.argv[1])[int(sys.argv[2]) - 1], 405.1 / 23.9)
        mb.anh(sys.argv[3])
        for v, i in mb.vung.items():
            if i['dt'] > 1:
                print(v, f"{i['dt']:.1f} m²", i['khong_lap'] or 'lắp được', '|', i['chu'][:60])
    else:
        raise SystemExit(__doc__)
