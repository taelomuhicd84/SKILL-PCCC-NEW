"""Kiểm công thức của BANG_TINH_PCCC.xlsx khi máy không có Excel/LibreOffice:
1) tính toàn bộ workbook bằng thư viện `formulas` (pip install formulas), báo ô lỗi (#REF!, #NAME?, #VALUE!, #DIV/0!, #N/A);
2) so sánh kết quả chính với phép tính độc lập viết bằng Python từ các công thức trong tiêu chuẩn.
Chạy: python -X utf8 scripts/kiem_bang_tinh_pccc.py [file.xlsx]
"""
import math
import os
import sys

import formulas
import openpyxl

F = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "bang_tinh", "BANG_TINH_PCCC.xlsx")
xl = formulas.ExcelModel().loads(F).finish()
sol = xl.calculate()
tmp = os.path.join(os.environ.get("TEMP", "."), "kiem_bt")
os.makedirs(tmp, exist_ok=True)
xl.write(dirpath=tmp)
ra = [f for f in os.listdir(tmp) if f.lower().endswith(".xlsx")]
tinh = openpyxl.load_workbook(os.path.join(tmp, ra[0]), data_only=True)
goc = openpyxl.load_workbook(F)


def v(sheet, o):
    ten = {s.upper(): s for s in tinh.sheetnames}[sheet.upper()]
    return tinh[ten][o].value


loi = []
trong = 0
ten_goc = {n.upper(): n for n in goc.sheetnames}
for ws in tinh.worksheets:
    g_ws = goc[ten_goc[ws.title.upper()]]
    for row in ws.iter_rows():
        for c in row:
            if isinstance(c.value, str) and c.value.startswith("#"):
                loi.append(f"{ws.title}!{c.coordinate} = {c.value}")
            elif c.value is None and str(g_ws[c.coordinate].value or "").startswith("="):
                trong += 1  # công thức cho "" (hàng bảng chưa dùng): chủ ý
print("Ô lỗi (#REF!, #NAME?, #VALUE!, #DIV/0!, #N/A):", len(loi), "· ô trống có chủ ý (hàng chưa dùng):", trong)
for x in loi[:40]:
    print("  ", x)


def tim(sheet, nhan, cot="D"):
    """Giá trị ở cột D của dòng có chữ `nhan` ở cột B."""
    ws = goc[sheet]
    for r in range(1, ws.max_row + 1):
        t = ws.cell(r, 2).value
        if isinstance(t, str) and nhan in t:
            return v(sheet, f"{cot}{r}")
    raise KeyError(nhan)


def so(ten, got, exp, tol=1e-3):
    ok = got is not None and not isinstance(got, str) and abs(got - exp) <= tol * max(1, abs(exp))
    print(("  OK   " if ok else "  LỆCH ") + f"{ten}: bảng={got} kỳ vọng={exp}")
    return ok


bad = 0
# ---- 1. sprinkler ----
print("Sheet 1 Sprinkler")
i, S, n, Kus, H = 0.12, 130, 12, 5.6, 12
q1 = i * S / n
K = Kus * 3.785412 / 60 / math.sqrt(0.0068948)
P1 = (q1 / K) ** 2
tabKT = {25: 3.65, 32: 16.5, 40: 34.5, 80: 1262, 100: 5205}
tabOD = {25: (33.5, 2.8), 32: (42.3, 2.8), 40: (48, 3.0), 80: (88.5, 3.5), 100: (114, 4.0)}
mau = [(25, 1.3, 3.4), (25, 2.7, 3.4), (32, 4.1, 3.4), (40, 5.6, 6.0), (80, 31.5, 10.0), (100, 31.5, 8.0), (100, 31.5, 15.0)]
sdp = sum(q * q * L / (100 * tabKT[dn]) for dn, q, L in mau)
PB = sdp + 0.2 * sdp + P1 + H / 100
bad += not so("q1", tim("1_Sprinkler", "Lưu lượng đầu phun bất lợi nhất"), q1)
bad += not so("K SI", tim("1_Sprinkler", "Hệ số K quy đổi"), K)
bad += not so("P1", tim("1_Sprinkler", "Áp suất đầu phun bất lợi nhất"), P1, 1e-3)
bad += not so("ΣΔP", tim("1_Sprinkler", "Tổng tổn thất dọc đường"), sdp)
bad += not so("PB", tim("1_Sprinkler", "Áp suất cần thiết của bơm"), PB)
bad += not so("Qsp", tim("1_Sprinkler", "Lưu lượng bơm cho sprinkler"), 31.5)

# ---- 2. họng nước ----
print("Sheet 2 Họng nước")
bad += not so("q lăng DN50, 6 m, 16 mm", tim("2_Hong_nuoc", "Lưu lượng của lăng"), 2.6)
bad += not so("P họng DN50, 6 m, 16 mm, vòi 20 m", tim("2_Hong_nuoc", "Áp suất cần có tại đầu nối họng"), 0.100)
bad += not so("Q họng", tim("2_Hong_nuoc", "Tổng lưu lượng họng nước"), 2.6)

# ---- 3. bể, bơm ----
print("Sheet 3 Bể, bơm")
Qsp, tsp, Qh, th = 31.5, 1.0, 2.6, 1.0  # t sprinkler nhóm 2 = 60 phút
W = (Qsp * tsp + Qh * th) * 3.6
Qb = Qsp + Qh
bad += not so("Q ngoài nhà (Loại 2, 1 tầng, 3,93 ×1000 m³)", tim("3_Be_Bom", "Lưu lượng nước chữa cháy ngoài nhà"), 10)
bad += not so("W bể", tim("3_Be_Bom", "DUNG TÍCH BỂ"), W)
bad += not so("Q bơm", tim("3_Be_Bom", "LƯU LƯỢNG BƠM"), Qb)
Hb = max(PB * 101.972, 55)
bad += not so("H bơm", tim("3_Be_Bom", "CỘT ÁP BƠM CHỌN"), Hb)
Nt = Qb * Hb / (102 * 0.7)
bad += not so("N động cơ", tim("3_Be_Bom", "CÔNG SUẤT ĐỘNG CƠ"), 1.15 * Nt / 0.9)

# ---- 4. hút khói ----
print("Sheet 4 Hút khói")
G = 678.8 * 12 * 2.5 ** 1.5 * 1.0
bad += not so("G phòng", tim("4_Hut_khoi", "Khối lượng khói cần thải", "D"), G)
bad += not so("ρ khói", tim("4_Hut_khoi", "Khối lượng riêng của khói"), 5 / 9.81)
Q = G / (5 / 9.81)
bad += not so("Q khói", tim("4_Hut_khoi", "Lưu lượng khói tính toán"), Q)
n_ = 0.80 + 0  # nhà công cộng, B = 1,2
G1 = 4300 * 1.0 * 1.2 * n_ * 2.1 ** 1.5
bad += not so("G1 hành lang", tim("4_Hut_khoi", "Khối lượng khói cần hút từ hành lang"), G1)
bad += not so("n tại B=1,2", tim("4_Hut_khoi", "Hệ số n theo chiều rộng"), 0.80)

# ---- 5. thoát khói tự nhiên ----
print("Sheet 5 Thoát khói tự nhiên")
T1, T0, A1, A2, Hh, z1 = 573.15 - 273.15, 40.6, 0.85, 1.989, 4.4, 0.5
r0 = 101325 / ((T0 + 273) * 287.05); r1 = 101325 / ((T1 + 273) * 287.05)
H1 = Hh / (1 + (A1 / A2) ** 2 * r0 / r1); H2 = Hh - H1
P1b = (r0 - r1) * 9.81 * H1; P2b = -(r0 - r1) * 9.81 * H2
v1 = math.sqrt(2 * P1b / r0); v2 = math.sqrt(2 * abs(P2b) / r1)
bad += not so("H1", tim("5_Thoat_khoi_TN", "Khoảng cách tâm cửa bù khí"), H1)
bad += not so("Q1tt", tim("5_Thoat_khoi_TN", "Lưu lượng bù khí tính toán"), A1 * v1)
bad += not so("Q2tt", tim("5_Thoat_khoi_TN", "Lưu lượng thoát khói tính toán"), A2 * v2)
bad += not so("cân bằng khối lượng ρ0·Q1 = ρ1·Q2", r0 * A1 * v1, r1 * A2 * v2)

gv = 353 / (273 + 35) * 9.81
G5 = 3564 * 2.0 * math.sqrt(1.25 * (gv - 5) * (gv / 9.81) ** 2)
bad += not so("G1 theo H.5", v("4_Hut_khoi", "D41"), G5)

# ---- 6. quạt, ống gió ----
print("Sheet 6 Ống gió, quạt")
rho, nu, eps = 1.2, 1.5e-5, 0.09
tot = 0
for q, vv, L in [(60000, 20, 12), (50000, 20, 12), (40000, 20, 12), (30000, 20, 12), (20000, 20, 12), (10000, 15, 12)]:
    A = q / (vv * 3600); D = math.sqrt(4 * A / math.pi) * 1000
    Re = vv * D / 1000 / nu
    lam = 0.25 / (math.log10(eps / (3.7 * D) + 5.74 / Re ** 0.9)) ** 2
    tot += lam * rho * vv ** 2 / (2 * D / 1000) * L
dp = (tot * 1.3 + 40) * 1.1
bad += not so("ΔP quạt", tim("6_Quat_ong_gio", "Cột áp tính toán"), dp)
bad += not so("N trục", tim("6_Quat_ong_gio", "Công suất trục"), 60000 * dp / (3600 * 1000 * 0.6 * 0.95))

# ---- 7. máy phát ----
print("Sheet 7 Máy phát")
Pn = 0.05 + 3 * 3.0 + 1 * (1.15 * Nt / 0.9) + 0.012 + 0.3
Svh = Pn / 0.8 * 1.2
Skd = Svh + max(3.0, 1.15 * Nt / 0.9, 0.3) * 4 * 1.2
bad += not so("Svh", tim("7_May_phat", "Công suất vận hành"), Svh)
bad += not so("Skđ", tim("7_May_phat", "Công suất khi khởi động"), Skd)

# ---- 8. khí chữa cháy ----
print("Sheet 8 Khí CC")
V = 13.4 * 8.8 * 5.8 - 4
S_ = 0.1269 + 0.0005131 * 21
W8 = math.ceil((V / S_ * 7.9 / (100 - 7.9)) * 10) / 10
bad += not so("W FM-200", tim("8_Khi_CC", "Khối lượng halocarbon cần thiết"), W8)

# ---- 9. foam ----
print("Sheet 9 Foam")
Vf = 1000 * 6.5
a = 1.5 * 1.2 * 1.5
n_f = a * Vf * 1000 / (320 * 10 * 650)
nc = math.ceil(n_f); Qf = nc * 320 / 60000
bad += not so("n tạo bọt", tim("9_Foam", "Số thiết bị tạo bọt (tính)"), n_f)
bad += not so("Q bọt", tim("9_Foam", "Lưu lượng dung dịch"), Qf)
bad += not so("V bọt", tim("9_Foam", "Lượng chất tạo bọt (1 lần)"), round(1.2 * 2 * Qf * 10 * 60 / 100, 2))

# ---- 10. dây, MCCB ----
print("Sheet 10 Dây, MCCB")
P10 = 1.15 * Nt / 0.9
I = P10 * 1000 / (math.sqrt(3) * 380 * 0.85 * 0.9)
bad += not so("I", tim("10_Day_MCB", "Dòng điện làm việc"), I)

# ---- 11. kết cấu ----
print("Sheet 11 Kết cấu")
P_ = (4 * 200 + 2 * 300 - 2 * 8) / 1000; A_ = (8 * (300 - 20) + 2 * 200 * 10) / 1e6
bad += not so("Am/V đầu", tim("11_Ket_cau", "Am/V tiết diện đầu"), P_ / A_)

print("\nKẾT QUẢ:", "TẤT CẢ KHỚP" if bad == 0 and not loi else f"{bad} giá trị lệch, {len(loi)} ô lỗi")
sys.exit(0 if bad == 0 and not loi else 1)
