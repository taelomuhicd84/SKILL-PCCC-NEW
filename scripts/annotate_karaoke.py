"""Vẽ đường thoát nạn + comment lên mặt bằng Karaoke Hoàng Anh 2 (trang 3 = tầng 1, trang 4 = tầng 2).
Toạ độ nhập tay theo ảnh zoom (Z1/Z2, px hiển thị 2000 rộng) -> đổi sang pt PDF. Chiều dài là ƯỚC LƯỢNG.
"""
import heapq, math, sys
import pymupdf

SRC = r"C:/Users/ADMIN/OneDrive/Clip PCCC/KARAOKE HOÀNG ANH  2/09-12-2024-(11-46-35)-KARAOKE HOANG ANH 2 (KIEN TRUC).pdf"
OUT = r"F:/1_ToolMMo/2_VibeCode/New folder/duong_thoat_nan_karaoke.pdf"
FONT = r"C:/Windows/Fonts/arial.ttf"
FONTB = r"C:/Windows/Fonts/arialbd.ttf"

doc = pymupdf.open(SRC)
W, H = doc[2].rect.width, doc[2].rect.height
K = 2000 / (0.61 * W * 3.473 / 3.473)  # px hiển thị / pt (zoom rộng 0.61W pt -> 2000 px)
ORG = {2: (W * 0.06, H * 0.19), 3: (W * 0.06, H * 0.20)}  # gốc clip của ảnh zoom (page idx)


def calib(pi):
    """mm trên 1 pt: 41000 mm = khoảng cách trục 1 -> 7 (tâm chữ trong vòng tròn trục)."""
    xs = {}
    for w in doc[pi].get_text("words"):
        if w[4] in ("1", "7") and 0.10 * H < (w[1] + w[3]) / 2 < 0.18 * H and w[0] < 0.7 * W:
            xs[w[4]] = (w[0] + w[2]) / 2
    return 41000 / (xs["7"] - xs["1"])


MM_PT = {2: calib(2), 3: calib(3)}
print("mm/pt", MM_PT)


def to_pt(pi, p):
    o = ORG[pi]
    return pymupdf.Point(o[0] + p[0] / K, o[1] + p[1] / K)


def dist(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])


class Net:
    """Mạng hành lang (trục tim) + tìm đường ngắn nhất."""

    def __init__(self):
        self.adj = {}

    def edge(self, a, b):
        self.adj.setdefault(a, {})[b] = dist(a, b)
        self.adj.setdefault(b, {})[a] = dist(a, b)

    def line(self, pts):  # đường gấp khúc, tự chèn điểm giữa các nút trùng đoạn
        for a, b in zip(pts, pts[1:]):
            self.edge(a, b)

    def split(self, p):  # chèn điểm p vào đoạn gần nhất (nếu nằm trên đoạn)
        best = None
        for a in list(self.adj):
            for b in list(self.adj[a]):
                if a < b:
                    t = ((p[0] - a[0]) * (b[0] - a[0]) + (p[1] - a[1]) * (b[1] - a[1])) / max(dist(a, b) ** 2, 1e-9)
                    if 0 < t < 1:
                        q = (a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1]))
                        d = dist(p, q)
                        if d < 1.5 and (best is None or d < best[0]):
                            best = (d, a, b)
        if best:
            _, a, b = best
            del self.adj[a][b], self.adj[b][a]
            self.edge(a, p); self.edge(p, b)

    def path(self, s, t):
        d = {s: 0}; prev = {}; pq = [(0, s)]
        while pq:
            c, u = heapq.heappop(pq)
            if u == t: break
            if c > d[u]: continue
            for v, w in self.adj[u].items():
                if c + w < d.get(v, 1e18):
                    d[v] = c + w; prev[v] = u; heapq.heappush(pq, (c + w, v))
        out = [t]
        while out[-1] != s: out.append(prev[out[-1]])
        return out[::-1], d[t]


def far_corner(rect, door, inset=8):
    x0, y0, x1, y1 = rect
    cs = [(x0 + inset, y0 + inset), (x1 - inset, y0 + inset), (x0 + inset, y1 - inset), (x1 - inset, y1 - inset)]
    return max(cs, key=lambda c: dist(c, door))


def route(net, room, exit_pt):
    """Điểm xa nhất trong phòng -> cửa phòng -> hành lang -> lối ra. Trả (đường gấp khúc, độ dài px)."""
    rect, door, acc = room
    s = far_corner(rect, door)
    pts, L = net.path(acc, exit_pt)
    return [s, door] + pts, dist(s, door) + L


# ------------------------------------------------------------------ TẦNG 2 (Z2) -----------------
E1 = (441, 285)      # cửa ra thang ngoài nhà CT1 (đầu thang +3,800)
E2 = (1222, 338)     # đầu thang sảnh (giả định CT2)
n2 = Net()
top = [(478, 291), (1660, 291)]
n2.line([(478, 291), (478, 573), (1157, 573), (1157, 291)])
n2.line(top)
n2.edge(E1, (478, 291))
rooms2 = {
    "Phòng 17": ((380, 75, 650, 250), (590, 250), (590, 291)),
    "Phòng 18": ((660, 75, 930, 250), (868, 250), (868, 291)),
    "Phòng 19": ((940, 75, 1200, 250), (1148, 250), (1148, 291)),
    "Phòng 20": ((1210, 75, 1455, 250), (1395, 250), (1395, 291)),
    "Phòng 21": ((1465, 75, 1685, 250), (1525, 250), (1525, 291)),
    "Phòng 22": ((1695, 75, 1955, 320), (1692, 312), (1660, 291)),
    "Phòng 15": ((520, 335, 750, 535), (738, 332), (738, 291)),
    "Phòng 16": ((865, 335, 1100, 535), (885, 332), (885, 291)),
    "Phòng 14": ((445, 615, 650, 790), (628, 610), (628, 573)),
    "Phòng 13": ((660, 615, 930, 790), (880, 610), (880, 573)),
    "Phòng 12": ((940, 615, 1200, 790), (1000, 610), (1000, 573)),
}
for r in rooms2.values():
    n2.split(r[2])
n2.split((1157, 291)); n2.split((1222, 291)); n2.edge((1222, 291), E2)

# ------------------------------------------------------------------ TẦNG 1 (Z1) -----------------
D2 = (330, 535)      # cửa D2 (không ghi chú thoát nạn)
D1 = (1352, 650)     # cửa chính D1 (không ghi chú thoát nạn)
n1 = Net()
n1.line([(367, 252), (1575, 252)])
n1.line([(367, 252), (367, 535), (1047, 535), (1047, 252)])
n1.edge(D2, (367, 535))
n1.edge((1047, 420), D1); n1.edge((1047, 535), D1)
n1.split((1047, 420))
rooms1 = {
    "Phòng 6": ((275, 45, 540, 210), (470, 215), (470, 252)),
    "Phòng 7": ((550, 45, 820, 210), (762, 215), (762, 252)),
    "Phòng 8": ((830, 45, 1090, 210), (1035, 215), (1035, 252)),
    "Phòng 9": ((1100, 45, 1350, 210), (1160, 215), (1160, 252)),
    "Phòng 10": ((1360, 45, 1570, 210), (1413, 215), (1413, 252)),
    "Phòng 11": ((1585, 45, 1855, 285), (1578, 267), (1560, 252)),
    "Phòng 4": ((410, 295, 610, 495), (625, 292), (625, 252)),
    "Phòng 5": ((755, 295, 995, 495), (770, 292), (770, 252)),
    "Phòng 3": ((335, 580, 540, 750), (515, 572), (515, 535)),
    "Phòng 2": ((550, 580, 820, 750), (760, 572), (760, 535)),
    "Phòng 1": ((830, 580, 1095, 750), (1035, 572), (1035, 535)),
}
n1.split((1047, 252))
for r in rooms1.values():
    n1.split(r[2])


def analyse(net, rooms, ex_a, ex_b, dead_names, mm_pt):
    res = {}
    for name, rm in rooms.items():
        ra = route(net, rm, ex_a); rb = route(net, rm, ex_b)
        res[name] = (ra, rb)
    k = mm_pt / K / 1000  # px hiển thị -> m
    out = {"k": k}
    dead = max(dead_names, key=lambda n: min(res[n][0][1], res[n][1][1]))
    mid = max([n for n in res if n not in dead_names], key=lambda n: min(res[n][0][1], res[n][1][1]))
    out["dead"] = dead; out["mid"] = mid; out["res"] = res
    for n, (ra, rb) in res.items():
        print(f"  {n:9s} a={ra[1]*k:5.1f} m  b={rb[1]*k:5.1f} m  min={min(ra[1], rb[1])*k:5.1f}")
    print("  dead:", dead, " mid:", mid)
    return out


print("TẦNG 2")
A2 = analyse(n2, rooms2, E1, E2, ["Phòng 20", "Phòng 21", "Phòng 22"], MM_PT[3])
print("TẦNG 1")
A1 = analyse(n1, rooms1, D2, D1, ["Phòng 9", "Phòng 10", "Phòng 11"], MM_PT[2])

# D = đường chéo lớn nhất của tầng (dài theo bao hình mặt bằng, px Z -> m)
def diag(k, x0, y0, x1, y1):
    return math.hypot((x1 - x0) * k, (y1 - y0) * k)


D_t2 = diag(A2["k"], 445, 70, 1960, 795)
D_t1 = diag(A1["k"], 330, 40, 1860, 757)
disp2 = dist(E1, E2) * A2["k"]
disp1 = dist(D1, D2) * A1["k"]
print(f"D t2={D_t2:.1f} t1={D_t1:.1f}; phân tán t2={disp2:.1f} t1={disp1:.1f}")

# ------------------------------------------------------------------ VẼ -------------------------
RED = (0.85, 0, 0); ORG_ = (1, 0.5, 0); BLUE = (0, 0.25, 0.9); GRN = (0, 0.5, 0.15)


def vi(m):  # 12.3 -> "12,3"
    return f"{m:.1f}".replace(".", ",")


class Pg:
    def __init__(self, pi, zp):
        self.pg = doc[pi]; self.zp = zp
        self.pg.insert_font(fontname="ar", fontfile=FONT); self.pg.insert_font(fontname="arb", fontfile=FONTB)

    def P(self, p): return to_pt(self.zp, p)

    def poly(self, pts, color, dash=None, w=1.6, arrow=True):
        q = [self.P(p) for p in pts]
        self.pg.draw_polyline(q, color=color, width=w, dashes=(dash + " 0") if dash else None, closePath=False)
        if arrow:
            a, b = q[-2], q[-1]
            ang = math.atan2(b.y - a.y, b.x - a.x); L = 7
            p1 = pymupdf.Point(b.x - L * math.cos(ang - .45), b.y - L * math.sin(ang - .45))
            p2 = pymupdf.Point(b.x - L * math.cos(ang + .45), b.y - L * math.sin(ang + .45))
            self.pg.draw_polyline([p1, b, p2, p1], color=color, fill=color, width=.5)

    def dot(self, p, color):
        self.pg.draw_circle(self.P(p), 3.2, color=color, fill=color)

    def rect(self, r, color, num, w=1.4):
        a, b = self.P(r[:2]), self.P(r[2:])
        self.pg.draw_rect(pymupdf.Rect(a, b), color=color, width=w)
        self.pg.draw_circle(a, 5.5, color=color, fill=(1, 1, 1), width=1)
        self.pg.insert_text((a.x - (2.5 if num < 10 else 4.2), a.y + 2.6), str(num), fontname="arb", fontsize=7.5, color=color)

    def label(self, p, text, color, size=6.8):
        pt = self.P(p)
        w = len(text) * size * 0.50 + 6
        r = pymupdf.Rect(pt.x, pt.y, pt.x + w, pt.y + size + 4)
        self.pg.draw_rect(r, color=color, fill=(1, 1, 1), width=.6)
        self.pg.insert_text((r.x0 + 3, r.y0 + size + 0.8), text, fontname="arb", fontsize=size, color=color)

    def commit(self):
        pass

    def legend(self, x0, y0, title, lines, wid=212):
        pg = self.pg
        pg.insert_text((x0, y0), title, fontname="arb", fontsize=8.5, color=(0, 0, 0))
        y = y0 + 8
        for num, color, txt in lines:
            nlines = max(1, math.ceil(len(txt) * 3.15 / (wid - 14)))
            h = nlines * 7.9 + 2.5
            pg.insert_textbox(pymupdf.Rect(x0 + 12, y, x0 + wid, y + h + 6), txt, fontname="ar", fontsize=6.3, color=(0, 0, 0))
            if num:
                pg.draw_circle((x0 + 5, y + 4.5), 4.6, color=color, fill=(1, 1, 1), width=1)
                pg.insert_text((x0 + 5 - (1.9 if num < 10 else 3.6), y + 7), str(num), fontname="arb", fontsize=6.3, color=color)
            y += h + 2
        return y


def seg_len(pts, k):
    return sum(dist(a, b) for a, b in zip(pts, pts[1:])) * k


# ================= TẦNG 2 (page index 3) =================
p = Pg(3, 3)
k2 = A2["k"]
d_name, m_name = A2["dead"], A2["mid"]
rd = A2["res"][d_name]; rm_ = A2["res"][m_name]
# đường cụt -> lối gần nhất
near = rd[0] if rd[0][1] <= rd[1][1] else rd[1]
p.poly(near[0], BLUE, w=1.8); p.dot(near[0][0], BLUE)
# giữa 2 lối -> cả 2
p.poly(rm_[0][0], BLUE, w=1.8); p.poly(rm_[1][0], BLUE, w=1.8); p.dot(rm_[0][0][0], BLUE)
# khoảng cách phân tán E1-E2
p.poly([E1, E2], GRN, dash="[3 3]", w=1.0, arrow=False)
# nhãn
p.label((near[0][0][0] - 150, near[0][0][1] + 12),
        f"{d_name}: đường cụt → E2 = {vi(near[1]*k2)} m", BLUE)
p.label((rm_[0][0][0][0] - 40, rm_[0][0][0][1] + 14),
        f"{m_name}: E1 = {vi(rm_[0][1]*k2)} m / E2 = {vi(rm_[1][1]*k2)} m", BLUE)
p.label((620, 305), f"L phân tán E1–E2 ≈ {vi(disp2)} m", GRN)
# khung comment
p.rect((390, 255, 475, 330), ORG_, 1)            # E1 + đầu thang CT1
p.rect((1200, 325, 1465, 450), ORG_, 2)          # đầu thang sảnh E2
p.rect((1690, 70, 1960, 330), ORG_, 3)           # phòng 22 đường cụt
rr = rooms2[m_name][0]
p.rect(rr, ORG_, 4)                              # phòng điểm giữa
p.rect((600, 296, 1160, 330), ORG_, 5)           # phân tán
p.rect((580, 232, 650, 262), ORG_, 6)            # FD1 ghi "cửa thoát hiểm" nhưng là cửa phòng
p.rect((380, 440, 440, 540), ORG_, 7)            # thang ngoài nhà CT1: cao độ
p.commit()
ys = p.legend(W * 0.668, H * 0.318, "GHI CHÚ ĐƯỜNG THOÁT NẠN – TẦNG 2", [
    (1, ORG_, f"E1: cửa ra thang thoát hiểm ngoài nhà CT1 (thang thoát nạn số 01) – lối thoát nạn xác định được. Dùng làm lối thoát tầng 2."),
    (2, ORG_, "E2: đầu thang sảnh – GIẢ ĐỊNH là CT2 (thang thoát nạn số 02). NGHI VẤN: chú giải CT1/CT2 không ký hiệu lên mặt bằng; thang sảnh là thang hở, thông tầng, không phải buồng thang ngăn cháy. Cần xác nhận."),
    (3, ORG_, f"Đường cụt: điểm xa nhất {d_name} → E2 = {vi(near[1]*k2)} m (ước lượng, cần đo lại trên CAD). Bản vẽ không có bảng tính chiều dài; giới hạn cho phép cần tra QCVN 06 (F2.1, bậc II, S0)."),
    (4, ORG_, f"Giữa 2 lối: điểm xa nhất {m_name} → E1 = {vi(rm_[0][1]*k2)} m, → E2 = {vi(rm_[1][1]*k2)} m (ước lượng). Cần đối chiếu giới hạn QCVN 06."),
    (5, ORG_, f"Phân tán 2 lối: L(E1–E2) ≈ {vi(disp2)} m (≥ 7 m). D ≈ {vi(D_t2)} m → ⅓D = {vi(D_t2/3)} m (có Sprinkler, ghi ở mặt đứng) → ĐẠT. Nếu không tính Sprinkler: ½D = {vi(D_t2/2)} m → {'CHƯA ĐẠT' if disp2 < D_t2/2 else 'ĐẠT'} (Khoảng cách thiết kế {vi(disp2)} m bé hơn số liệu yêu cầu {vi(D_t2/2)} m). Sát giới hạn."),
    (6, ORG_, "Chú giải FD1 ghi 'Cửa thoát hiểm EI60' nhưng dùng cho cửa của MỌI phòng ra hành lang → nghi ghi nhầm / không phải lối ra thoát nạn. Các cửa FD1, D-cửa khác KHÔNG tính là lối thoát."),
    (7, ORG_, "Chi tiết thang thoát hiểm (trang 11): cao độ -0,050 → +3,800 (21 bậc × 183 mm) nhưng sàn tầng 2 = +4,300 (mặt đứng/mặt bằng) → lệch ~0,5 m. NGHI VẤN thiết kế thang."),
])
p.legend(W * 0.668, ys + 8, "Ghi chú chung", [
    (0, (0, 0, 0), "Mũi tên xanh = đường thoát nạn tính từ điểm xa nhất trong phòng. Chiều dài đo theo trục tim hành lang, ước lượng từ tỉ lệ trục (41000 mm), sai số ±1–2 m."),
    (0, (0, 0, 0), "Sprinkler lấy từ ghi chú mặt đứng trục A-F / 1-7 (trang 6, 7); nhóm F2.1, bậc II, S0, 93 người theo bảng thống kê."),
])

# ================= TẦNG 1 (page index 2) =================
q = Pg(2, 2)
k1 = A1["k"]
d1, m1 = A1["dead"], A1["mid"]
rd1 = A1["res"][d1]; rm1 = A1["res"][m1]
near1 = rd1[0] if rd1[0][1] <= rd1[1][1] else rd1[1]
dash = None
q.poly(near1[0], BLUE, dash=dash, w=1.8); q.dot(near1[0][0], BLUE)
q.poly(rm1[0][0], BLUE, dash=dash, w=1.8); q.poly(rm1[1][0], BLUE, dash=dash, w=1.8); q.dot(rm1[0][0][0], BLUE)
q.poly([D2, D1], GRN, dash="[3 3]", w=1.0, arrow=False)
q.label((1395, 305), f"{d1}: đường cụt → {'D1' if near1 is rd1[1] else 'D2'} = {vi(near1[1]*k1)} m", BLUE)
q.label((rm1[0][0][0][0] - 260, rm1[0][0][0][1] + 10), f"{m1}: D2 = {vi(rm1[0][1]*k1)} m / D1 = {vi(rm1[1][1]*k1)} m", BLUE)
q.rect((1325, 595, 1400, 705), ORG_, 1)      # D1
q.rect((285, 495, 345, 570), ORG_, 2)        # D2
q.rect((270, 285, 335, 480), ORG_, 3)       # KHO dưới thang CT1
q.rect((1095, 292, 1352, 360), ORG_, 4)     # KHO dưới thang sảnh
q.rect(rooms1[d1][0], ORG_, 5)
q.rect(rooms1[m1][0], ORG_, 6)
q.rect((330, 515, 1095, 555), ORG_, 7)      # phân tán (đường nối D2-D1 chạy hành lang dưới)
# chú giải CT1/CT2 trên bản vẽ (toạ độ pt trang 3: x 5-12%, y 70.5-73%)
leg = pymupdf.Rect(W * 0.045, H * 0.700, W * 0.20, H * 0.735)
q.pg.draw_rect(leg, color=ORG_, width=1.4)
q.pg.draw_circle((leg.x0, leg.y0), 5.5, color=ORG_, fill=(1, 1, 1), width=1)
q.pg.insert_text((leg.x0 - 2.5, leg.y0 + 2.6), "8", fontname="arb", fontsize=7.5, color=ORG_)
q.commit()
ys = q.legend(W * 0.668, H * 0.318, "GHI CHÚ ĐƯỜNG THOÁT NẠN – TẦNG 1", [
    (1, ORG_, "D1 (cửa chính) – theo xác nhận của người thẩm định được coi là lối thoát nạn tầng 1 (L1). NGHI VẤN: bản vẽ chưa ghi chú 'lối thoát nạn' trên cửa → cần bổ sung ghi chú."),
    (2, ORG_, "D2 (cạnh chân thang CT1) – theo xác nhận được coi là lối thoát nạn tầng 1 (L2). NGHI VẤN: cũng chưa ghi chú thoát nạn trên bản vẽ → cần bổ sung ghi chú/đổi ký hiệu cửa."),
    (3, ORG_, "Phòng KHO nằm DƯỚI thang thoát hiểm CT1 (cửa D3) → NGHI VẤN: không nên bố trí kho/vật liệu cháy dưới thang thoát nạn."),
    (4, ORG_, "KHO dưới thang sảnh (cửa D4) – nếu thang sảnh là CT2 thì cùng lưu ý như mục 3."),
    (5, ORG_, f"Đường cụt: điểm xa nhất {d1} → {'D1' if near1 is rd1[1] else 'D2'} = {vi(near1[1]*k1)} m (ước lượng). Giới hạn cho phép cần tra QCVN 06; bản vẽ không có bảng tính."),
    (6, ORG_, f"Giữa 2 lối: điểm xa nhất {m1} → D2 = {vi(rm1[0][1]*k1)} m, → D1 = {vi(rm1[1][1]*k1)} m (ước lượng)."),
    (7, ORG_, f"Phân tán 2 lối: L(D2–D1) ≈ {vi(disp1)} m ≥ ⅓D = {vi(D_t1/3)} m và ≥ ½D = {vi(D_t1/2)} m (D ≈ {vi(D_t1)} m) → ĐẠT."),
    (8, ORG_, "Chú giải CT1/CT2 (thang thoát nạn số 01, 02) không có ký hiệu CT1/CT2 trên mặt bằng; cửa FD1 ghi 'cửa thoát hiểm' nhưng gắn cho cửa phòng → nên ký hiệu rõ lối thoát nạn và vị trí CT1, CT2 trên từng tầng."),
])
q.legend(W * 0.668, ys + 8, "Ghi chú chung", [
    (0, (0, 0, 0), "Mũi tên xanh = đường thoát nạn từ điểm xa nhất trong phòng tới D1/D2 (D1, D2 coi là lối thoát nạn theo xác nhận, chưa ghi chú trên bản vẽ). Chiều dài đo theo trục tim hành lang, ước lượng theo tỉ lệ trục 41000 mm, sai số ±1–2 m."),
    (0, (0, 0, 0), "Có Sprinkler (ghi chú mặt đứng trang 6, 7) → dùng ⅓D; ½D nêu để tham khảo."),
])

new = pymupdf.open()
new.insert_pdf(doc, from_page=2, to_page=3)
new.save(OUT, garbage=3, deflate=True)
for i in (0, 1):
    new[i].get_pixmap(dpi=170).save(rf"C:/Users/ADMIN/AppData/Local/Temp/claude/F--1-ToolMMo-2-VibeCode-New-folder/bb4f93df-bbb6-49d3-9ef1-ba79d1611b36/scratchpad/out_{i+1}.png")
print("saved", OUT)
