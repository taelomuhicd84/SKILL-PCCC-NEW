"""Nhận diện thang (thẳng, cuốn) và lỗ thông tầng (ô X) trên mặt bằng PDF vector, không đọc chữ.
Thang thẳng = chuỗi ô chữ nhật cùng kích thước nối sát (>= 4 bậc), nới ra chiếu nghỉ (ô xám sát + khung đen nhỏ nhất bao quanh).
Thang cuốn = cụm cung đen (>= 6 đường cong). Lỗ thông tầng = hai đường chéo cắt nhau trong một khung; X hẹp xếp nối thì gộp.
Dùng: python -I scripts/nhan_dien_thang_lo.py <pdf> <ra_thu_muc> [dpi]   -> <ra>/trang<N>.png + in danh sách
"""
import sys, os
from collections import defaultdict
import pymupdf as f

def _den(c): return c is not None and max(c) < 0.1
def _xam(c): return c is not None and 0.4 < c[0] < 0.7 and abs(c[0] - c[1]) < 0.05

def thang_thang(p):
    B = []
    for dr in p.get_drawings():
        its = dr['items']
        if len(its) == 1 and its[0][0] in ('qu', 're'):
            r = dr['rect']
            if 2 < r.width < 60 and 2 < r.height < 60: B.append(tuple(r))
    g = defaultdict(list)
    for b in set(B): g[(round(b[2] - b[0]), round(b[3] - b[1]))].append(b)
    out = []
    for L in g.values():
        for ax in (0, 1):
            cols = defaultdict(list)
            for b in L: cols[round(b[0] if ax == 0 else b[1])].append(b)
            for bs in cols.values():
                bs.sort(key=lambda b: b[1] if ax == 0 else b[0]); i = 0
                while i < len(bs):
                    j = i + 1
                    while j < len(bs) and abs((bs[j][1] if ax == 0 else bs[j][0]) - (bs[j - 1][3] if ax == 0 else bs[j - 1][2])) < 0.3: j += 1
                    if j - i >= 3:
                        s = bs[i:j]; out.append([min(b[0] for b in s), min(b[1] for b in s), max(b[2] for b in s), max(b[3] for b in s), j - i])
                    i = j
    grp = []
    for o in sorted(out):
        for G in grp:
            r = G['box']
            if o[0] <= r[2] + 3 and o[2] >= r[0] - 3 and o[1] <= r[3] + 3 and o[3] >= r[1] - 3:
                G['box'] = [min(r[0], o[0]), min(r[1], o[1]), max(r[2], o[2]), max(r[3], o[3])]; G['bac'] += o[4]; break
        else: grp.append(dict(box=o[:4], bac=o[4]))
    gray = [dr['rect'] for dr in p.get_drawings() if _xam(dr.get('color')) and 8 <= dr['rect'].width <= 60 and 8 <= dr['rect'].height <= 60]
    black = [dr['rect'] for dr in p.get_drawings() if _den(dr.get('color')) and dr['rect'].width < 70 and dr['rect'].height < 70]
    for G in grp:
        b = f.Rect(*G['box']); ch = True
        while ch:
            ch = False
            for r in gray:
                if r not in b and (r + (-1, -1, 1, 1)).intersects(b) and not (r.width > b.width * 1.3 and r.height > b.height * 1.3): b |= r; ch = True
        best = None
        for r in black:
            if r.contains(b) and (best is None or r.get_area() < best.get_area()): best = r
        if best is not None: b |= best
        G['box'] = list(b)
    return [G for i, G in enumerate(grp) if all(G['box'] != H['box'] for H in grp[:i])]

def lo_x(p):
    dg = []
    for dr in p.get_drawings():
        if not _den(dr.get('color')): continue
        for i in dr['items']:
            if i[0] == 'l':
                a, b = i[1], i[2]; dx, dy = abs(a.x - b.x), abs(a.y - b.y)
                if dx > 2.5 and dy > 7 and dx * dy > 30: dg.append((min(a.x, b.x), min(a.y, b.y), max(a.x, b.x), max(a.y, b.y), (a.x - b.x) * (a.y - b.y) > 0))
    X = []
    for A in dg:
        for B in dg:
            if A[4] != B[4] and all(abs(A[k] - B[k]) < max(2.0, 0.1 * max(A[2] - A[0], A[3] - A[1])) for k in range(4)) and not any(abs(A[0] - c[0]) < 3 and abs(A[1] - c[1]) < 3 for c in X):
                X.append(list(A[:4]))
    def _iou(a, b):
        w = min(a[2], b[2]) - max(a[0], b[0]); h = min(a[3], b[3]) - max(a[1], b[1])
        return 0 if w <= 0 or h <= 0 else w * h / ((a[2] - a[0]) * (a[3] - a[1]))
    def _luoi(a):  # có ô X cùng cỡ lệch < 0,6 cạnh = lưới gạch chéo (đất trống, mái)
        w, h = a[2] - a[0], a[3] - a[1]
        return any(b is not a and abs(b[2] - b[0] - w) < 2 and abs(b[3] - b[1] - h) < 2 and (0 < abs(b[0] - a[0]) < 0.6 * w or 0 < abs(b[1] - a[1]) < 0.6 * h) and abs(b[0] - a[0]) < 2 * w and abs(b[1] - a[1]) < 2 * h for b in X)
    X = [a for a in X if not _luoi(a)]
    X = [a for i, a in enumerate(X) if not any(_iou(a, b) > 0.8 and _iou(b, a) > 0.8 for b in X[:i])]  # lưới gạch chéo (đất trống, mái) không phải lỗ
    ch = True  # gộp X hẹp xếp nối
    while ch:
        ch = False
        for i, a in enumerate(X):
            for b in X[i + 1:]:
                if a[0] < b[2] + 3 and b[0] < a[2] + 3 and a[1] < b[3] + 3 and b[1] < a[3] + 3 and min(a[2] - a[0], b[2] - b[0]) < 6:
                    X.remove(b); a[:] = [min(a[0], b[0]), min(a[1], b[1]), max(a[2], b[2]), max(a[3], b[3])]; ch = True; break
            if ch: break
    return X

def thang_cuon(p):
    R = [dr['rect'] for dr in p.get_drawings() if _den(dr.get('color')) and any(i[0] == 'c' for i in dr['items']) and 6 < dr['rect'].width < 60 and 6 < dr['rect'].height < 60]
    out = []
    for r in R:
        for G in out:
            if (r + (-8, -8, 8, 8)).intersects(G[0]): G[0] |= r; G[1] += 1; break
        else: out.append([f.Rect(r), 1])
    return [list(G[0]) + [G[1]] for G in out if G[1] >= 8]

if __name__ == '__main__':
    d = f.open(sys.argv[1]); os.makedirs(sys.argv[2], exist_ok=True); dpi = int(sys.argv[3]) if len(sys.argv) > 3 else 100
    for n, p in enumerate(d, 1):
        T, X, C = thang_thang(p), lo_x(p), thang_cuon(p)
        print(f'trang {n}: {len(T)} thang thang, {len(C)} thang cuon, {len(X)} lo X')
        for G in T: print('  thang', [round(v) for v in G['box']], G['bac'], 'bac')
        for c in C: print('  cuon ', [round(v) for v in c[:4]])
        for x in X: print('  lo X ', [round(v) for v in x])
        sh = p.new_shape()
        for col, L in (((1, 0, 0), [G['box'] for G in T]), ((1, .5, 0), [c[:4] for c in C]), ((0, .4, 1), X)):
            for b in L: sh.draw_rect(f.Rect(*b)); sh.finish(color=col, width=1.5)
        sh.commit(); p.get_pixmap(dpi=dpi).save(os.path.join(sys.argv[2], f'trang{n}.png'))
