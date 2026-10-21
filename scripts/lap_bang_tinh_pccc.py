"""Lập file Excel tổng hợp các bảng tính PCCC (công thức rõ, ô nhập màu xanh, ghi nguồn từng công thức).

Chạy: python -X utf8 scripts/lap_bang_tinh_pccc.py [file_ra.xlsx]
Cần: openpyxl, xlrd (đọc bảng chọn dây/MCCB từ file .xls của công ty).
Kiểm công thức (máy không có LibreOffice): python -X utf8 scripts/kiem_bang_tinh_pccc.py file.xlsx

Mức kiểm nguồn ghi ở mỗi sheet:
  A = đối chiếu nguyên văn tiêu chuẩn có trong thư mục tài liệu (TCVN 7336:2021, TCVN 5687:2024, QCVN 10:2025/BCA)
  B = đối chiếu nguồn uy tín bên ngoài (đường dẫn ghi ở sheet HUONG_DAN)
  C = lấy từ bảng tính có sẵn của công ty, chưa đối chiếu được nguồn
"""
import os
import sys

import openpyxl
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.worksheet.datavalidation import DataValidation

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XLS_DAY = r"D:\$.4. QC - TCVN\8_TAILIEUHOCTAP\07_Bang tinh Excel\bang chon day va mcb.xls"
RA = sys.argv[1] if len(sys.argv) > 1 else os.path.join(GOC, "bang_tinh", "BANG_TINH_PCCC.xlsx")

F = "Arial"
f_chu = Font(name=F, size=10)
f_dam = Font(name=F, size=10, bold=True)
f_in = Font(name=F, size=10, color="0000FF")
f_tieude = Font(name=F, size=14, bold=True, color="FFFFFF")
f_muc = Font(name=F, size=10, bold=True)
f_ghi = Font(name=F, size=9, italic=True, color="595959")
fill_tieude = PatternFill("solid", fgColor="1F3864")
fill_muc = PatternFill("solid", fgColor="D9E1F2")
fill_in = PatternFill("solid", fgColor="FFF2CC")
fill_kq = PatternFill("solid", fgColor="E2EFDA")
fill_dau = PatternFill("solid", fgColor="BDD7EE")
vien = Side(style="thin", color="BFBFBF")
khung = Border(left=vien, right=vien, top=vien, bottom=vien)
wrap = Alignment(wrap_text=True, vertical="top")
giua = Alignment(horizontal="center", vertical="center", wrap_text=True)

wb = openpyxl.Workbook()
wb.remove(wb.active)
REF = {}  # REF[sheet][tên] = "D12": để sheet khác liên kết


def tao_sheet(ten, tieu_de, nguon, muc_kiem, rong=(6, 50, 12, 18, 13, 80)):
    ws = wb.create_sheet(ten)
    for i, w in enumerate(rong):
        ws.column_dimensions["ABCDEFGHIJKLMNOP"[i]].width = w
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=6)
    c = ws.cell(1, 1, tieu_de); c.font = f_tieude; c.fill = fill_tieude
    c.alignment = Alignment(vertical="center")
    ws.row_dimensions[1].height = 26
    ws.cell(2, 1, "Nguồn: " + nguon).font = f_ghi
    ws.cell(3, 1, "Mức kiểm nguồn: " + muc_kiem).font = f_ghi
    ws.cell(4, 1, "Ô chữ xanh nền vàng = nhập; ô còn lại là công thức (không sửa). Số trong ô nhập là ví dụ minh hoạ, thay bằng số liệu công trình.").font = f_ghi
    ws.sheet_view.showGridLines = False
    ws.page_setup.orientation = "landscape"; ws.page_setup.fitToWidth = 1; ws.page_setup.fitToHeight = 0
    ws.sheet_properties.pageSetUpPr = openpyxl.worksheet.properties.PageSetupProperties(fitToPage=True)
    REF[ten] = {}
    return ws


def muc(ws, r, text):
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=6)
    c = ws.cell(r, 1, text); c.font = f_muc; c.fill = fill_muc
    return r + 1


def dong(ws, r, stt, ten, ky, gia_tri, don_vi, ghi, loai="tinh", fmt=None, ma=None):
    """loai: nhap (ô nhập), tinh (công thức), kq (kết quả chính)."""
    ws.cell(r, 1, stt).font = f_chu
    ws.cell(r, 2, ten).font = f_dam if loai == "kq" else f_chu
    ws.cell(r, 3, ky).font = f_chu
    c = ws.cell(r, 4, gia_tri)
    c.font = f_in if loai == "nhap" else (f_dam if loai == "kq" else f_chu)
    if loai == "nhap": c.fill = fill_in
    if loai == "kq": c.fill = fill_kq
    c.alignment = Alignment(horizontal="right" if not (isinstance(gia_tri, str) and not gia_tri.startswith("=")) else "center", vertical="top")
    if fmt: c.number_format = fmt
    ws.cell(r, 5, don_vi).font = f_chu
    g = ws.cell(r, 6, ghi); g.font = f_ghi; g.alignment = wrap
    for col in range(1, 7):
        ws.cell(r, col).border = khung
        if col in (2,): ws.cell(r, col).alignment = wrap
    if ma: REF[ws.title][ma] = f"D{r}"
    return r + 1


def r_(ten, ma):  # tham chiếu tuyệt đối tới ô của sheet khác
    return f"'{ten}'!${REF[ten][ma][0]}${REF[ten][ma][1:]}"


def danh_sach(ws, o, ds):
    dv = DataValidation(type="list", formula1='"' + ",".join(str(x) for x in ds) + '"', allow_blank=False)
    ws.add_data_validation(dv); dv.add(o)


def dau_bang(ws, r, cols, row_h=None):
    for i, t in enumerate(cols):
        c = ws.cell(r, 1 + i, t); c.font = f_dam; c.fill = fill_dau; c.alignment = giua; c.border = khung
    if row_h: ws.row_dimensions[r].height = row_h
    return r + 1


# ================= DU_LIEU =================
wd = tao_sheet("DU_LIEU", "DỮ LIỆU TRA CỨU (các bảng trong tiêu chuẩn)",
               "TCVN 7336:2021 Bảng 1, Bảng B.2; QCVN 10:2025/BCA Bảng H.2, H.7; TCVN 5687:2024 Bảng H.1; bảng chọn dây và MCCB của công ty",
               "A (chép từ bản PDF/scan; đối chiếu lại trang gốc khi dùng cho hồ sơ), riêng bảng dây/MCCB: C",
               rong=(14, 14, 14, 14, 14, 14, 14, 14, 14, 14))
wd.sheet_view.showGridLines = True
D = {}  # địa chỉ khối dữ liệu

r = 6
wd.cell(r, 1, "TCVN 7336:2021 – Bảng 1 (chữa cháy bằng nước, nhóm nguy cơ 1 đến 4.1; nhóm 4.2, 5, 6, 7 tra Bảng 2 trong tiêu chuẩn)").font = f_muc; r += 1
r = dau_bang(wd, r, ["Nhóm", "Cường độ phun i (l/s·m²)", "Lưu lượng tối thiểu (l/s)", "Diện tích tính toán tối thiểu (m²)", "Thời gian phun tối thiểu (phút)", "Khoảng cách tối đa giữa đầu phun (m)"], 42)
b1 = [("1", 0.08, 10, 60, 30, 4), ("2", 0.12, 30, 120, 60, 4), ("3", 0.24, 60, 120, 60, 4), ("4.1", 0.30, 110, 180, 60, 4)]
D["b1_dau"] = r
for t in b1:
    for i, v in enumerate(t):
        c = wd.cell(r, 1 + i, v); c.font = f_chu; c.border = khung
        if i == 0: c.number_format = "@"
    r += 1
D["b1_cuoi"] = r - 1
D["nhom"] = f"DU_LIEU!$A${D['b1_dau']}:$A${D['b1_cuoi']}"
for k, col in zip(["i", "Qmin", "Smin", "tmin", "Lmax"], "BCDEF"):
    D["b1_" + k] = f"DU_LIEU!${col}${D['b1_dau']}:${col}${D['b1_cuoi']}"

r += 2
wd.cell(r, 1, "TCVN 7336:2021 – Bảng B.2: đặc tính thuỷ lực KT (l⁶/s²) của ống, giá trị lấy như bảng tính công ty (không nhân 10⁻⁶; kiểm bằng Hazen-Williams ở sheet 1 cho cùng bậc độ lớn)").font = f_muc; r += 1
r = dau_bang(wd, r, ["DN", "Thép hàn điện: OD (mm)", "t (mm)", "KT", "Thép dẫn khí và nước: OD (mm)", "t (mm)", "KT"], 54)
ong = [(15, 18, 2.0, 0.0755, 21.3, 2.5, 0.18), (20, 25, 2.0, 0.75, 26.8, 2.5, 0.926), (25, 32, 2.2, 3.44, 33.5, 2.8, 3.65),
       (32, 40, 2.2, 13.97, 42.3, 2.8, 16.5), (40, 45, 2.2, 28.7, 48, 3.0, 34.5), (50, 57, 2.5, 110, 60, 3.0, 135),
       (65, 76, 2.8, 572, 75.5, 3.2, 517), (80, 89, 2.8, 1429, 88.5, 3.5, 1262), (100, 108, 2.8, 4322, 114, 4.0, 5205),
       (125, 133, 3.2, 13530, 140, 4.0, 16940), (150, 152, 3.2, 28690, 165, 4.0, 43000)]
D["ong_dau"] = r
for t in ong:
    for i, v in enumerate(t):
        c = wd.cell(r, 1 + i, v); c.font = f_chu; c.border = khung
    r += 1
D["ong_cuoi"] = r - 1
for k, col in zip(["DN", "ODh", "th", "KTh", "ODk", "tk", "KTk"], "ABCDEFG"):
    D["ong_" + k] = f"DU_LIEU!${col}${D['ong_dau']}:${col}${D['ong_cuoi']}"

r += 2
wd.cell(r, 1, "QCVN 10:2025/BCA – Bảng H.2: lưu lượng nước chữa cháy ngoài nhà (l/s) cho nhà nhóm F1, F2, F3, F4; cột = khối tích (×1000 m³)").font = f_muc; r += 1
r = dau_bang(wd, r, ["Loại nhà", "Số tầng từ", "≤1", ">1–5", ">5–25", ">25–50", ">50"], 30)
wd.cell(r, 1, "Cận dưới khối tích →").font = f_ghi
for i, v in enumerate([0, 1.000001, 5.000001, 25.000001, 50.000001]):
    c = wd.cell(r, 3 + i, v); c.font = f_chu; c.border = khung
D["h2_can"] = f"DU_LIEU!$C${r}:$G${r}"; r += 1
h2 = {"1": [(0, 10, 10, 15, 15, 20), (4, 10, 15, 15, 20, 20), (13, None, 20, 20, 25, 25), (17, None, 20, 25, 25, 30)],
      "2": [(0, 10, 10, 15, 20, 25), (4, 10, 15, 20, 25, 30), (13, None, 20, 25, 30, 35), (17, None, 25, 30, 30, 35)]}
D["h2_dau"] = {}
for loai, rows in h2.items():
    D["h2_dau"][loai] = r
    for t in rows:
        wd.cell(r, 1, loai).number_format = "@"; wd.cell(r, 1).font = f_chu; wd.cell(r, 1).border = khung
        wd.cell(r, 2, t[0]).font = f_chu; wd.cell(r, 2).border = khung
        for i, v in enumerate(t[1:]):
            c = wd.cell(r, 3 + i, v if v is not None else "-"); c.font = f_chu; c.border = khung
        r += 1
wd.cell(r, 1, "Loại 1 = nhóm F1.3, F1.4; Loại 2 = F1.1, F1.2, F2, F3, F4 (karaoke F2.1 là Loại 2). Số tầng từ: 0 = ≤3 tầng, 4 = 4–12, 13 = 13–16, 17 = trên 16. Ô '-' = không quy định (nhà thấp, khối tích nhỏ): nhập tay. Nông thôn, khối tích ≤5000 m³: 5 l/s.").font = f_ghi
r += 3
D["h2_ma"] = {k: (f"DU_LIEU!$C${v}:$G${v + 3}", f"DU_LIEU!$B${v}:$B${v + 3}") for k, v in D["h2_dau"].items()}

wd.cell(r, 1, "QCVN 10:2025/BCA – Bảng H.7 (chép từ bản scan; ô có dấu ? nghi sai số in: kiểm trang gốc): lưu lượng lăng và áp suất họng theo chiều cao tia nước đặc").font = f_muc; r += 1
r = dau_bang(wd, r, ["Khoá DN|H|D", "DN họng", "Chiều cao tia H (m)", "Đường kính lăng D (mm)", "Lưu lượng (l/s)", "Áp suất, vòi 10 m (MPa)", "Áp suất, vòi 15 m (MPa)", "Áp suất, vòi 20 m (MPa)"], 42)
h7 = {50: {6: {16: (2.6, .092, .096, .100), 19: (3.4, .088, .096, .104)}, 8: {16: (2.9, .120, .125, .130), 19: (4.1, .129, .138, .148)},
           10: {16: (3.3, .151, .157, .164), 19: (4.6, .160, .173, .185)}, 12: {13: (2.6, .202, .206, .210), 16: (3.7, .192, .196, .210), 19: (5.2, .206, .223, .240)},
           14: {13: (2.8, .236, .241, .245), 16: (4.2, .248, .255, .263)}, 16: {13: (3.2, .316, .322, .328), 16: (4.6, .293, .300, .318)},
           18: {13: (3.6, .390, .398, .406), 16: (5.1, .360, .380, .400)}},
      65: {6: {16: (2.6, .088, .089, .090), 19: (3.4, .078, .080, .083)}, 8: {16: (2.9, .110, .112, .114), 19: (4.1, .114, .117, .121)},
           10: {16: (3.3, .140, .143, .146), 19: (4.6, .143, .147, .151)}, 12: {13: (2.6, .198, .199, .201), 16: (3.7, .180, .183, .186), 19: (5.2, .182, .190, .199)},
           14: {13: (2.8, .23, .231, .233), 16: (4.2, .230, .233, .235), 19: (5.7, .218, .224, .230)},
           16: {13: (3.2, .31, .313, .315), 16: (4.6, .276, .280, .284), 19: (6.3, .266, .273, .280)},
           18: {13: (3.6, .38, .383, .385), 16: (5.1, .338, .342, .346), 19: (7.0, .329, .338, .348)},
           20: {13: (4.0, .464, .467, .470), 16: (5.6, .412, .424, .418), 19: (7.5, .372, .385, .397)}}}
D["h7_dau"] = r
for dn, hs in h7.items():
    for h, ds in hs.items():
        for d, v in ds.items():
            wd.cell(r, 1, f"{dn}|{h}|{d}").number_format = "@"
            for i, x in enumerate([dn, h, d, *v]):
                c = wd.cell(r, 1 if i == -1 else 2 + i, x); c.font = f_chu; c.border = khung
            wd.cell(r, 1).font = f_chu; wd.cell(r, 1).border = khung
            r += 1
D["h7_cuoi"] = r - 1
D["h7_khoa"] = f"DU_LIEU!$A${D['h7_dau']}:$A${D['h7_cuoi']}"
for k, col in zip(["Q", "P10", "P15", "P20"], "EFGH"):
    D["h7_" + k] = f"DU_LIEU!${col}${D['h7_dau']}:${col}${D['h7_cuoi']}"
D["h7_P"] = f"DU_LIEU!$F${D['h7_dau']}:$H${D['h7_cuoi']}"
r += 2

wd.cell(r, 1, "TCVN 5687:2024 – Bảng H.1: hệ số n theo chiều rộng cánh cửa B (m)").font = f_muc; r += 1
r = dau_bang(wd, r, ["Loại", "B = 0,6", "0,9", "1,2", "1,8", "2,4"], 20)
wd.cell(r, 1, "Cận B (m)").font = f_ghi
for i, v in enumerate([0.6, 0.9, 1.2, 1.8, 2.4]):
    c = wd.cell(r, 2 + i, v); c.font = f_chu; c.border = khung
D["h1_B"] = f"DU_LIEU!$B${r}:$F${r}"; r += 1
for ten, vals in (("Nhà ở", [1.00, 0.82, 0.70, 0.51, 0.41]), ("Nhà công cộng", [1.05, 0.91, 0.80, 0.62, 0.50])):
    wd.cell(r, 1, ten).font = f_chu; wd.cell(r, 1).border = khung
    for i, v in enumerate(vals):
        c = wd.cell(r, 2 + i, v); c.font = f_chu; c.border = khung
    D["h1_" + ("o" if ten == "Nhà ở" else "cc")] = f"DU_LIEU!$B${r}:$F${r}"
    r += 1
r += 2

wd.cell(r, 1, "Hằng số chất chữa cháy: S = K1 + K2·T (m³/kg, T °C). HFC-227ea: ISO 14520-9 / NFPA 2001 (S(20 °C) = 0,1372 so với 0,1374 trong ISO 14520-9: khớp). IG-541, IG-55: lấy từ bảng tính công ty, chưa đối chiếu").font = f_muc; r += 1
r = dau_bang(wd, r, ["Chất", "K1", "K2", "Mức kiểm"], 20)
D["khi_dau"] = r
for t in (("HFC-227ea (FM-200)", 0.1269, 0.0005131, "B"), ("IG-55", 0.659, 0.002416, "C"), ("IG-541", 0.65799, 0.00239, "C (nhớ từ tiêu chuẩn, chưa đối chiếu)")):
    for i, v in enumerate(t):
        c = wd.cell(r, 1 + i, v); c.font = f_chu; c.border = khung
    r += 1
D["khi_ten"] = f"DU_LIEU!$A${D['khi_dau']}:$A${r - 1}"
D["khi_K1"] = f"DU_LIEU!$B${D['khi_dau']}:$B${r - 1}"
D["khi_K2"] = f"DU_LIEU!$C${D['khi_dau']}:$C${r - 1}"
r += 2

# bảng dây, MCCB (đọc từ .xls của công ty)
wd.cell(r, 1, "Bảng chọn dây dẫn và MCCB theo công suất (bảng của công ty, mức C). Cột dây: mm² (số lõi x tiết diện); MCCB: số cực-dòng định mức (A)").font = f_muc; r += 1
r = dau_bang(wd, r, ["Công suất P (kW) từ", "Dây, tải thường", "MCCB, tải thường", "Dây, tải động cơ", "MCCB, tải động cơ"], 42)
D["day_dau"] = r
try:
    import xlrd
    sh = xlrd.open_workbook(XLS_DAY).sheet_by_index(0)
    for i in range(6, sh.nrows):
        p = sh.cell_value(i, 1)
        if p == "": continue
        p = 0.5 if str(p).strip().startswith("<") else float(p)
        vals = [p, sh.cell_value(i, 3), sh.cell_value(i, 5), sh.cell_value(i, 7), sh.cell_value(i, 9)]
        for k, v in enumerate(vals):
            c = wd.cell(r, 1 + k, v); c.font = f_chu; c.border = khung
        r += 1
except Exception as e:  # thiếu file nguồn: sheet 10 vẫn tính dòng điện, chỉ không tra được dây
    wd.cell(r, 1, f"(không đọc được {XLS_DAY}: {e})").font = f_ghi; r += 1
D["day_cuoi"] = max(r - 1, D["day_dau"])
for k, col in zip(["P", "d1", "m1", "d2", "m2"], "ABCDE"):
    D["day_" + k] = f"DU_LIEU!${col}${D['day_dau']}:${col}${D['day_cuoi']}"
r += 2
wd.cell(r, 1, "Dãy dòng định mức MCCB/MCB tiêu chuẩn (A)").font = f_muc; r += 1
D["mcb_dau"] = r
for i, v in enumerate([6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 320, 400, 500, 630, 800, 1000, 1250, 1600, 2000]):
    c = wd.cell(r, 1, v); c.font = f_chu; c.border = khung; r += 1
D["mcb"] = f"DU_LIEU!$A${D['mcb_dau']}:$A${r - 1}"
r += 2
wd.cell(r, 1, "Dãy công suất máy phát điện thương mại thông dụng (kVA)").font = f_muc; r += 1
D["mpd_dau"] = r
for v_ in [10, 15, 20, 25, 30, 40, 50, 63, 75, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000]:
    c = wd.cell(r, 1, v_); c.font = f_chu; c.border = khung; r += 1
D["mpd"] = f"DU_LIEU!$A${D['mpd_dau']}:$A${r - 1}"

# ================= 1_Sprinkler =================
S1 = "1_Sprinkler"
ws = tao_sheet(S1, "1. THỦY LỰC SPRINKLER – TCVN 7336:2021 Phụ lục B",
               "TCVN 7336:2021 Bảng 1; Phụ lục B (B.2.2, B.2.5, B.3.2, B.3.8, B.3.9, B.3.11, B.3.13); đối chiếu chéo Hazen-Williams (NFPA 13; hệ SI: 6,05×10⁵·Q^1,85/(C^1,85·d^4,87), bar/m, Q l/phút, d mm)",
               "A (TCVN 7336:2021 nguyên văn) + B (công thức Hazen-Williams: canutesoft.com, meyerfire.com; xem HUONG_DAN)")
r = 6
r = muc(ws, r, "I. Dữ liệu thiết kế")
r = dong(ws, r, 1, "Nhóm nguy cơ phát sinh cháy (Phụ lục A TCVN 7336; karaoke, vũ trường: nhóm 2)", "Nhóm", "2", "", "Chọn 1, 2, 3 hoặc 4.1. Nhóm 4.2, 5, 6, 7: tra Bảng 2 trong tiêu chuẩn rồi nhập tay ở mục 2 và 3.", "nhap", ma="nhom")
danh_sach(ws, REF[S1]["nhom"], ["1", "2", "3", "4.1"])
N = REF[S1]["nhom"]
mt = lambda col: f"INDEX({D[col]},MATCH({N},{D['nhom']},0))"
r = dong(ws, r, 2, "Cường độ phun tối thiểu", "i", f"={mt('b1_i')}", "l/s·m²", "Bảng 1", fmt="0.00", ma="i")
r = dong(ws, r, 3, "Lưu lượng tối thiểu", "Qmin", f"={mt('b1_Qmin')}", "l/s", "Bảng 1", ma="Qmin")
r = dong(ws, r, 4, "Diện tích tính toán tối thiểu", "Smin", f"={mt('b1_Smin')}", "m²", "Bảng 1", ma="Smin")
r = dong(ws, r, 5, "Thời gian phun tối thiểu", "t", f"={mt('b1_tmin')}", "phút", "Bảng 1", ma="t")
r = dong(ws, r, 6, "Khoảng cách tối đa giữa các đầu phun", "Lmax", f"={mt('b1_Lmax')}", "m", "Bảng 1", ma="Lmax")
r = dong(ws, r, 7, "Diện tích tính toán thực tế (theo bố trí trên bản vẽ)", "Stt", 130, "m²", "Lấy từ bản vẽ: vùng ít nhất 4 đầu phun liền nhau theo hình chữ nhật; nhập tay.", "nhap", ma="Stt")
r = dong(ws, r, 8, "Số đầu phun hoạt động đồng thời trong diện tích tính toán", "n", 12, "cái", "Đếm trên bản vẽ", "nhap", ma="n")
r = dong(ws, r, 9, "Khoảng cách thực tế giữa các đầu phun", "L", 3.4, "m", "Lớn nhất trên bản vẽ", "nhap", ma="L")
r = dong(ws, r, 10, "Hệ số K của đầu phun (hệ Mỹ)", "K_US", 5.6, "gpm/psi^0,5", "Theo catalogue (K5.6 = đầu phun DN15 thông dụng)", "nhap", ma="KUS")
r = dong(ws, r, 11, "Chênh cao từ trục bơm đến đầu phun bất lợi nhất (đầu phun cao hơn trục bơm thì dương)", "H", 12, "m", "Z = H/100 (B.3.9)", "nhap", ma="H")
r = dong(ws, r, 12, "Áp suất đầu vào máy bơm (bể đặt thấp hơn bơm: 0)", "PH", 0, "MPa", "B.3.9: PH", "nhap", fmt="0.000", ma="PH")
r = dong(ws, r, 13, "Tổn thất cục bộ (tính gần đúng theo % tổn thất dọc đường)", "kcb", 0.2, "", "B.3.13: 20 % (đã gồm bộ điều khiển)", "nhap", fmt="0%", ma="kcb")
r = dong(ws, r, 14, "Hệ số nhám C (Hazen-Williams, chỉ để đối chiếu)", "C", 120, "", "NFPA 13: thép đen hệ ướt 120; hệ khô, kích hoạt trước 100; đồng 150", "nhap", ma="C")

r = muc(ws, r + 1, "II. Kiểm tra số lượng đầu phun và đầu phun bất lợi nhất")
Sd = f"MAX({REF[S1]['Stt']},{REF[S1]['Smin']})"
r = dong(ws, r, 15, "Diện tích dùng để tính", "S", f"={Sd}", "m²", "Lấy giá trị lớn hơn giữa thực tế và tối thiểu", ma="S")
r = dong(ws, r, 16, "Số đầu phun tối thiểu n ≥ S/Ω, Ω = L²", "nmin", f"=ROUNDUP({REF[S1]['Smin']}/{REF[S1]['L']}^2,0)", "cái", "B.3.2 (S = diện tích tối thiểu theo Bảng 1)", ma="nmin")
r = dong(ws, r, 17, "Kết luận số đầu phun", "", f'=IF({REF[S1]["n"]}>={REF[S1]["nmin"]},"ĐẠT","KHÔNG ĐẠT: thêm đầu phun")', "", "", "kq")
r = dong(ws, r, 18, "Kết luận khoảng cách đầu phun", "", f'=IF({REF[S1]["L"]}<={REF[S1]["Lmax"]},"ĐẠT","KHÔNG ĐẠT: L lớn hơn Lmax")', "", "Bảng 1", "kq")
r = dong(ws, r, 19, "Lưu lượng yêu cầu của hệ thống", "Qyc", f"=MAX({REF[S1]['Qmin']},{REF[S1]['i']}*{REF[S1]['S']})", "l/s", "Lớn hơn giữa lưu lượng tối thiểu Bảng 1 và i·S (B.3.1: QH ≤ QC). Lưu lượng thực tế tính ở mục III có thể lớn hơn.", "kq", fmt="0.0", ma="Qyc")
r = dong(ws, r, 20, "Lưu lượng đầu phun bất lợi nhất", "q1", f"={REF[S1]['i']}*{REF[S1]['S']}/{REF[S1]['n']}", "l/s", "q1 = i·S/n", fmt="0.000", ma="q1")
r = dong(ws, r, 21, "Hệ số K quy đổi sang hệ SI", "K", f"={REF[S1]['KUS']}*3.785412/60/SQRT(0.0068948)", "l/s/MPa^0,5", "1 gpm = 3,785412/60 l/s; 1 psi = 0,0068948 MPa; tiêu chuẩn viết q = 10·K'·√P với K' = K/10", fmt="0.000", ma="K")
r = dong(ws, r, 22, "Áp suất đầu phun bất lợi nhất", "P1", f"=({REF[S1]['q1']}/{REF[S1]['K']})^2", "MPa", "B.2.2: q1 = K√P → P1 = (q1/K)²", "kq", fmt="0.0000", ma="P1")

r = muc(ws, r + 1, "III. Tổn thất trên tuyến ống từ đầu phun bất lợi nhất đến máy bơm (nhập từng đoạn)")
r = dong(ws, r, 23, "Loại ống", "", "Thép dẫn khí và nước", "", "Chọn loại ống để tra KT và đường kính trong", "nhap", ma="loai")
danh_sach(ws, REF[S1]["loai"], ["Thép dẫn khí và nước", "Thép hàn điện"])
LOAI = REF[S1]["loai"]
r_dau = dau_bang(ws, r, ["Đoạn", "Mô tả", "DN", "Q (l/s)", "L (m)", ""], 30)
# bảng đoạn ống dùng cột riêng (G:M) để gọn
for col, w in zip("GHIJKL", (10, 10, 12, 14, 18, 14)):
    ws.column_dimensions[col].width = w
for i, t in enumerate(["ID (mm)", "KT", "v (m/s)", "ΔP = Q²L/(100·KT) (MPa)", "ΔP Hazen-Williams (MPa)", "Kiểm v ≤ 10 m/s"]):
    c = ws.cell(r_dau - 1, 7 + i, t); c.font = f_dam; c.fill = fill_dau; c.alignment = giua; c.border = khung
r0 = r_dau
mau = [("Đầu phun bất lợi nhất", 25, 1.3, 3.4), ("Nhánh", 25, 2.7, 3.4), ("Nhánh", 32, 4.1, 3.4), ("Nhánh", 40, 5.6, 6.0),
       ("Ống chính (cộng các nhánh)", 80, 31.5, 10.0), ("Ống đứng", 100, 31.5, 8.0), ("Ống dẫn đến bơm", 100, 31.5, 15.0)]
dn_list = [x[0] for x in ong]
for i in range(12):
    rr = r0 + i
    m = mau[i] if i < len(mau) else (None, None, None, None)
    ws.cell(rr, 1, i + 1).font = f_chu
    for col, v in ((2, m[0]), (3, m[1]), (4, m[2]), (5, m[3])):
        c = ws.cell(rr, col, v); c.font = f_in; c.fill = fill_in
    danh_sach(ws, f"C{rr}", dn_list)
    dnrr = f"$C{rr}"
    odh = f"INDEX({D['ong_ODh']},MATCH({dnrr},{D['ong_DN']},0))"
    th = f"INDEX({D['ong_th']},MATCH({dnrr},{D['ong_DN']},0))"
    odk = f"INDEX({D['ong_ODk']},MATCH({dnrr},{D['ong_DN']},0))"
    tk = f"INDEX({D['ong_tk']},MATCH({dnrr},{D['ong_DN']},0))"
    ws.cell(rr, 7, f'=IF(C{rr}="","",IF({LOAI}="Thép hàn điện",{odh}-2*{th},{odk}-2*{tk}))').number_format = "0.0"
    ws.cell(rr, 8, f'=IF(C{rr}="","",IF({LOAI}="Thép hàn điện",INDEX({D["ong_KTh"]},MATCH({dnrr},{D["ong_DN"]},0)),INDEX({D["ong_KTk"]},MATCH({dnrr},{D["ong_DN"]},0))))')
    ws.cell(rr, 9, f'=IF(C{rr}="","",D{rr}/1000/(PI()/4*(G{rr}/1000)^2))').number_format = "0.00"
    ws.cell(rr, 10, f'=IF(C{rr}="",0,D{rr}^2*E{rr}/(100*H{rr}))').number_format = "0.0000"
    ws.cell(rr, 11, f'=IF(C{rr}="",0,0.1*6.05*10^5*(D{rr}*60)^1.85*E{rr}/({REF[S1]["C"]}^1.85*G{rr}^4.87))').number_format = "0.0000"
    ws.cell(rr, 12, f'=IF(C{rr}="","",IF(I{rr}<=10,"ĐẠT","KHÔNG ĐẠT"))')
    for col in range(1, 13):
        ws.cell(rr, col).border = khung
        if col not in (2, 3, 4, 5): ws.cell(rr, col).font = f_chu
rN = r0 + 11
r = rN + 1
ws.cell(r, 6, "Q = lưu lượng chảy qua đoạn (cộng dồn các đầu phun phía sau, B.2.10); đoạn mạng vòng: lấy 50 % lưu lượng cho mỗi nửa vòng (B.2.12). Cột chữ vàng là ô nhập: DN chọn trong danh sách.").font = f_ghi
r += 1
r = dong(ws, r, 24, "Tổng tổn thất dọc đường", "ΣΔP", f"=SUM(J{r0}:J{rN})", "MPa", "B.3.11: ΔPi = Q²·Li/(100·KT)", fmt="0.0000", ma="sum")
r = dong(ws, r, 25, "Đối chiếu Hazen-Williams (cùng tuyến ống)", "ΣΔP_HW", f"=SUM(K{r0}:K{rN})", "MPa", "Chỉ để so sánh. Phương pháp Bảng B.2 dùng ống 'nhám' nên thường lớn hơn Hazen-Williams C=120.", fmt="0.0000")
r = dong(ws, r, 26, "Tổn thất cục bộ", "ΔPcb", f"={REF[S1]['kcb']}*{REF[S1]['sum']}", "MPa", "B.3.13", fmt="0.0000", ma="cb")
r = dong(ws, r, 27, "Áp suất do chênh cao", "Z", f"={REF[S1]['H']}/100", "MPa", "Z = H/100 (B.3.9)", fmt="0.0000", ma="Z")
r = dong(ws, r, 28, "Áp suất cần thiết của bơm", "PB", f"={REF[S1]['sum']}+{REF[S1]['cb']}+{REF[S1]['P1']}+{REF[S1]['Z']}-{REF[S1]['PH']}", "MPa", "B.3.9: PB = PDĐ + PCB + PĐP + Z − PH", "kq", fmt="0.0000", ma="PB")
r = dong(ws, r, 29, "Áp suất cần thiết của bơm", "", f"={REF[S1]['PB']}*10", "bar", "", fmt="0.00")
r = dong(ws, r, 30, "Cột áp cần thiết của bơm", "H_B", f"={REF[S1]['PB']}*101.972", "m cột nước", "1 MPa = 101,972 m", "kq", fmt="0.0", ma="HB")
r = dong(ws, r, 31, "Lưu lượng bơm cho sprinkler", "Q_sp", f"=MAX({REF[S1]['Qyc']},MAX(D{r0}:D{rN}))", "l/s", "Lớn hơn giữa lưu lượng yêu cầu và lưu lượng lớn nhất nhập ở mục III (đoạn cấp cho cả diện tích tính toán)", "kq", fmt="0.0", ma="Qsp")
r = dong(ws, r, 32, "Kiểm tra lưu lượng thực tế so với Bảng 1", "", f'=IF(MAX(D{r0}:D{rN})>={REF[S1]["Qmin"]},"ĐẠT (Q thực tế ≥ Qmin Bảng 1, B.3.1)","KHÔNG ĐẠT: tăng áp suất đầu phun hoặc số đầu phun hoạt động")', "", "Lưu lượng thực tế (tính lặp theo B.2.10) phải không nhỏ hơn Bảng 1", "kq")
r = dong(ws, r, 33, "Kiểm tra vận tốc nước các đoạn", "", f'=IF(COUNTIF(L{r0}:L{rN},"KHÔNG ĐẠT")=0,"ĐẠT (≤ 10 m/s, B.1.9)","KHÔNG ĐẠT: tăng DN đoạn có v > 10 m/s")', "", "", "kq")
r = dong(ws, r, 34, "Kiểm tra áp suất bộ điều khiển", "", f'=IF({REF[S1]["PB"]}<=1,"ĐẠT (≤ 1 MPa, B.3.14)","KIỂM TRA: áp suất bơm > 1 MPa, xem áp tại bộ điều khiển")', "", "B.3.14", "kq")
ws.freeze_panes = "A6"

# ================= 2_Hong_nuoc =================
S2 = "2_Hong_nuoc"
ws = tao_sheet(S2, "2. HỌNG NƯỚC CHỮA CHÁY TRONG NHÀ – QCVN 10:2025/BCA Phụ lục H.2",
               "QCVN 10:2025/BCA Bảng B.1 (đối tượng), H.2.1 đến H.2.9, Bảng H.5, H.6, H.7",
               "A (chép từ bản scan QCVN 10: đối chiếu lại Bảng H.7 trên bản gốc khi lập hồ sơ)")
r = 6
r = muc(ws, r, "I. Số tia phun và lưu lượng yêu cầu (Bảng H.5 nhà ở, công trình công cộng; Bảng H.6 nhà sản xuất, kho)")
r = dong(ws, r, 1, "Số tia phun cùng lúc", "nj", 1, "tia", "H.5: nhà công cộng ≤10 tầng và khối tích ≤25.000 m³: 1 tia; >25.000 m³ hoặc >10 tầng: 2 tia; ≥3 tia: xem Bảng H.5. Hành lang chung chung cư > 10 m: 2 tia. Phần nhà cao > 50 m: 4 tia (H.2.2).", "nhap", ma="nj")
r = dong(ws, r, 2, "Lưu lượng tối thiểu mỗi tia (Bảng H.5, H.6)", "qmin", 2.5, "l/s", "Thông thường 2,5 l/s; rạp, nhà hát >300 chỗ: 5 l/s; nhà sản xuất hạng A, B, C có chiều cao > 50 m: 5 l/s", "nhap", fmt="0.0", ma="qmin")
r = dong(ws, r, 3, "Chiều cao tia nước đặc tối thiểu", "H_tia", 6, "m", "H.2.7: ≥ 6 m (nhà đến 50 m); ≥ 8 m (nhà ở > 50 m); ≥ 16 m (nhà công cộng, sản xuất > 50 m); hầm đường bộ ≥ 6 m. Chọn trong 6, 8, 10, 12, 14, 16, 18.", "nhap", ma="H")
r = dong(ws, r, 4, "DN họng nước", "DN", 50, "mm", "DN50 cho lưu lượng đến 4 l/s; lớn hơn dùng DN65 (H.2.7 chú thích 2)", "nhap", ma="DN")
danh_sach(ws, REF[S2]["DN"], [50, 65])
r = dong(ws, r, 5, "Đường kính đầu lăng", "D", 16, "mm", "13, 16 hoặc 19 mm", "nhap", ma="D")
danh_sach(ws, REF[S2]["D"], [13, 16, 19])
r = dong(ws, r, 6, "Chiều dài cuộn vòi", "Lv", 20, "m", "10, 15 hoặc 20 m (Bảng H.7)", "nhap", ma="Lv")
danh_sach(ws, REF[S2]["Lv"], [10, 15, 20])
KHOA = f'{REF[S2]["DN"]}&"|"&{REF[S2]["H"]}&"|"&{REF[S2]["D"]}'
vt = f"MATCH({KHOA},{D['h7_khoa']},0)"
r = muc(ws, r + 1, "II. Tra Bảng H.7")
r = dong(ws, r, 7, "Tra được trong Bảng H.7", "", f'=IF(ISNUMBER({vt}),"Có","KHÔNG CÓ tổ hợp này trong Bảng H.7: đổi lăng hoặc chiều cao tia")', "", "Ô '-' trong bảng gốc: đầu lăng không đạt chiều cao tia đó", "kq", ma="co")
r = dong(ws, r, 8, "Lưu lượng của lăng theo Bảng H.7", "q_lăng", f'=IF(ISNUMBER({vt}),INDEX({D["h7_Q"]},{vt}),0)', "l/s", "", fmt="0.0", ma="qlang")
r = dong(ws, r, 9, "Áp suất cần có tại đầu nối họng", "P_họng", f'=IF(ISNUMBER({vt}),INDEX({D["h7_P"]},{vt},MATCH({REF[S2]["Lv"]},{{10,15,20}},0)),0)', "MPa", "Bảng H.7: gồm tổn thất vòi và lăng theo chiều dài vòi đã chọn", "kq", fmt="0.000", ma="Ph")
r = dong(ws, r, 10, "Lưu lượng tính toán mỗi tia", "q", f"=MAX({REF[S2]['qmin']},{REF[S2]['qlang']})", "l/s", "Lấy lớn hơn giữa yêu cầu Bảng H.5/H.6 và lưu lượng lăng", fmt="0.0", ma="q")
r = dong(ws, r, 11, "Tổng lưu lượng họng nước", "Q_họng", f"={REF[S2]['nj']}*{REF[S2]['q']}", "l/s", "Qh = nj × q. Đưa sang sheet 3", "kq", fmt="0.0", ma="Qh")
r = dong(ws, r, 12, "Áp suất cần ở van họng thấp nhất ngoài áp lực lăng: cộng tổn thất ống và chênh cao", "", "Cộng thêm tổn thất ống đứng, ống nhánh (tính như sheet 1, Q = Q_họng) và độ cao họng cao nhất so với trục bơm", "", "Họng cao nhất xa nhất là điểm tính cột áp bơm", "tinh")
r = muc(ws, r + 1, "III. Giới hạn áp suất")
r = dong(ws, r, 13, "Áp suất tĩnh lớn nhất tại họng thấp nhất", "P_tĩnh", 0.4, "MPa", "Nhập tay (độ cao bể đến họng thấp nhất cộng áp bơm khi không tải)", "nhap", fmt="0.00", ma="Pt")
r = dong(ws, r, 14, "Kiểm tra áp suất tĩnh", "", f'=IF({REF[S2]["Pt"]}<=0.45,"ĐẠT (≤ 0,45 MPa, hệ kết hợp sinh hoạt; H.2.6)",IF({REF[S2]["Pt"]}<=0.6,"ĐẠT nếu hệ chữa cháy riêng (≤ 0,6 MPa); H.2.6","KHÔNG ĐẠT: cần giảm áp"))', "", "H.2.6: sinh hoạt–chữa cháy kết hợp ≤ 0,45 MPa; riêng ≤ 0,6 MPa; giữa van và đầu nối họng > 0,45 MPa phải giảm áp", "kq")
r = dong(ws, r, 15, "Thời gian làm việc của họng nước", "t", 1, "giờ", "H.2.9: nhà chỉ có họng nước 1 giờ; nhà có sprinkler: bằng thời gian làm việc của sprinkler", "nhap", ma="th")

# ================= 3_Be_Bom =================
S3 = "3_Be_Bom"
ws = tao_sheet(S3, "3. BỂ NƯỚC, LƯU LƯỢNG VÀ CÔNG SUẤT BƠM CHỮA CHÁY",
               "QCVN 10:2025/BCA H.1.2 (Bảng H.2), H.1.3.3 (3 giờ), H.2.9 (1 giờ), H.3.1, H.3.3; TCVN 7336:2021 B.3.8, B.3.9; QCVN 02:2020/BCA (trạm bơm)",
               "A cho lưu lượng, thời gian, bơm dự phòng; B cho công thức công suất bơm (thủy lực: N = Q·H/(102·η))")
r = 6
r = muc(ws, r, "I. Lưu lượng và thời gian")
r = dong(ws, r, 1, "Lưu lượng sprinkler", "Q_sp", f"={r_(S1, 'Qsp')}", "l/s", "Liên kết sheet 1 (sửa tay được nếu tính bằng phần mềm khác)", fmt="0.0", ma="Qsp")
r = dong(ws, r, 2, "Thời gian chữa cháy sprinkler", "t_sp", f"={r_(S1, 't')}/60", "giờ", "TCVN 7336 Bảng 1", fmt="0.00", ma="tsp")
r = dong(ws, r, 3, "Lưu lượng họng nước", "Q_h", f"={r_(S2, 'Qh')}", "l/s", "Liên kết sheet 2", fmt="0.0", ma="Qh")
r = dong(ws, r, 4, "Thời gian họng nước", "t_h", f"=MAX({r_(S2, 'th')},{REF[S3]['tsp']})", "giờ", "H.2.9: có sprinkler thì bằng thời gian sprinkler (lấy lớn hơn để an toàn)", fmt="0.00", ma="th")
r = dong(ws, r, 5, "Loại nhà (cấp nước ngoài nhà)", "", "2", "", "1 = F1.3, F1.4; 2 = F1.1, F1.2, F2, F3, F4", "nhap", ma="loai")
danh_sach(ws, REF[S3]["loai"], ["1", "2"])
r = dong(ws, r, 6, "Số tầng của nhà", "", 1, "tầng", "", "nhap", ma="tang")
r = dong(ws, r, 7, "Khối tích nhà", "", 3.93, "×1000 m³", "Nhà lớn nhất cần cấp nước: khối tích tính riêng từng khối tách biệt (QCVN 10 mục 1.4.26)", "nhap", ma="V")
lk, ltg = D["h2_ma"]["1"], D["h2_ma"]["1"]
hang = f"IF({REF[S3]['loai']}=\"1\",INDEX({D['h2_ma']['1'][0]},MATCH({REF[S3]['tang']},{D['h2_ma']['1'][1]},1),MATCH({REF[S3]['V']},{D['h2_can']},1)),INDEX({D['h2_ma']['2'][0]},MATCH({REF[S3]['tang']},{D['h2_ma']['2'][1]},1),MATCH({REF[S3]['V']},{D['h2_can']},1)))"
r = dong(ws, r, 8, "Lưu lượng nước chữa cháy ngoài nhà (1 đám cháy)", "Q_nn", f"={hang}", "l/s", "Bảng H.2 (H.1.2.2). Ô '-' trong bảng cho kết quả lỗi: nhập tay giá trị theo ghi chú của Bảng H.2", fmt="0", ma="Qnn")
r = dong(ws, r, 9, "Thời gian chữa cháy ngoài nhà", "t_nn", 3, "giờ", "H.1.3.3: 3 giờ; ngoại lệ 2 giờ (bậc I–II, hạng D, E), 1 giờ (nhà trẻ… nông thôn ≤3 tầng ≤500 m²), hoặc Q ≤ 15 l/s (F1–F4) / ≤ 20 l/s (F5): 1 giờ", "nhap", ma="tnn")
r = dong(ws, r, 10, "Nước ngoài nhà lấy từ bể này (1 = có, 0 = lấy từ trụ, hồ…)", "", 0, "", "2.3.2: không phải trang bị hệ thống ngoài nhà khi có trụ cấp nước thành phố trong 400 m đủ lưu lượng", "nhap", ma="cnn")
danh_sach(ws, REF[S3]["cnn"], [0, 1])
r = muc(ws, r + 1, "II. Dung tích bể và lưu lượng bơm")
r = dong(ws, r, 11, "Có sprinkler đồng thời với họng nước (B.3.8: bơm chung)", "", 1, "", "1 = có: hai hệ chạy đồng thời, cộng lưu lượng; 0 = chỉ tính họng hoặc chỉ sprinkler", "nhap", ma="dt")
danh_sach(ws, REF[S3]["dt"], [0, 1])
r = dong(ws, r, 12, "DUNG TÍCH BỂ CHỮA CHÁY", "W_bể", f"=({REF[S3]['Qsp']}*{REF[S3]['tsp']}+{REF[S3]['dt']}*{REF[S3]['Qh']}*{REF[S3]['th']}+{REF[S3]['cnn']}*{REF[S3]['Qnn']}*{REF[S3]['tnn']})*3.6", "m³", "W = (Q_sp·t_sp + Q_h·t_h·[đồng thời] + Q_nn·t_nn·[lấy từ bể])·3,6. Nhà chỉ có họng nước: đặt dòng 11 = 0 và Q_sp = 0 ở sheet 1. Cộng thêm nước sinh hoạt nếu bể dùng chung (nhập tay)", "kq", fmt="0.0", ma="W")
r = dong(ws, r, 13, "LƯU LƯỢNG BƠM CHỮA CHÁY", "Q_bơm", f"={REF[S3]['Qsp']}+{REF[S3]['dt']}*{REF[S3]['Qh']}+{REF[S3]['cnn']}*{REF[S3]['Qnn']}", "l/s", "B.3.8: Q = Q_CCTĐ + Q_TN. Q_nn chỉ cộng khi bơm cấp cả trụ ngoài nhà", "kq", fmt="0.0", ma="Qb")
r = dong(ws, r, 14, "Lưu lượng bơm", "", f"={REF[S3]['Qb']}*3.6", "m³/h", "", fmt="0.0")
r = dong(ws, r, 15, "Cột áp bơm theo sprinkler", "H_sp", f"={r_(S1, 'HB')}", "m", "Liên kết sheet 1", fmt="0.0", ma="Hsp")
r = dong(ws, r, 16, "Cột áp bơm theo họng nước (áp đầu họng cao nhất, xa nhất + tổn thất ống + chênh cao − áp hút)", "H_h", 55, "m", "Nhập tay: = (P_họng sheet 2 ×101,97) + tổn thất ống + chênh cao họng cao nhất so với trục bơm", "nhap", fmt="0.0", ma="Hh")
r = dong(ws, r, 17, "CỘT ÁP BƠM CHỌN", "H_bơm", f"=MAX({REF[S3]['Hsp']},{REF[S3]['Hh']})", "m", "Lấy lớn hơn; bơm chung phải đạt cả hai điểm làm việc (Q_sp, H_sp) và (Q_h, H_h), hoặc đặt bơm riêng", "kq", fmt="0.0", ma="Hb")
r = dong(ws, r, 18, "Hiệu suất bơm", "η_b", 0.7, "", "Theo đường đặc tính bơm", "nhap", fmt="0.00", ma="eb")
r = dong(ws, r, 19, "Hiệu suất động cơ, truyền động", "η_dc", 0.9, "", "", "nhap", fmt="0.00", ma="edc")
r = dong(ws, r, 20, "Hệ số dự trữ công suất động cơ", "k", 1.15, "", "Thực hành thiết kế (1,10 đến 1,20); không phải điều khoản tiêu chuẩn", "nhap", fmt="0.00", ma="k")
r = dong(ws, r, 21, "CÔNG SUẤT TRỤC BƠM", "N_trục", f"={REF[S3]['Qb']}*{REF[S3]['Hb']}/(102*{REF[S3]['eb']})", "kW", "N = Q[l/s]·H[m]/(102·η)", "tinh", fmt="0.0", ma="Nt")
r = dong(ws, r, 22, "CÔNG SUẤT ĐỘNG CƠ ĐIỆN", "N_đc", f"={REF[S3]['k']}*{REF[S3]['Nt']}/{REF[S3]['edc']}", "kW", "Đưa sang sheet 7 (máy phát) và sheet 10 (dây, MCCB)", "kq", fmt="0.0", ma="Ndc")
r = dong(ws, r, 23, "Số bơm dự phòng tối thiểu theo số bơm chính", "", 1, "bơm", "H.3.1: 1 đến 3 bơm chính: ≥1 bơm dự phòng; ≥4 bơm chính: ≥2 bơm dự phòng. Cột áp và lưu lượng bơm dự phòng không nhỏ hơn bơm chính", "nhap", ma="dp")
r = dong(ws, r, 24, "Số đường ống hút tối thiểu", "", "2 (trạm ≥2 bơm)", "", "H.3.1: trạm có từ 2 bơm trở lên: ≥2 đường hút, mỗi đường đủ lưu lượng lớn nhất", "tinh")
r = dong(ws, r, 25, "Thời gian khởi động bơm", "", "≤ 3 phút", "", "H.3.3: lưu lượng ngoài nhà ≥ 25 l/s phải tự động hoặc điều khiển từ xa và bơm chạy không chậm hơn 3 phút kể từ khi báo cháy", "tinh")
r = dong(ws, r, 26, "Nguồn điện bơm động cơ điện", "", "2 nguồn độc lập", "", "H.3.2; một nguồn nếu bơm dự phòng là động cơ đốt trong", "tinh")

# ================= 4_Hut_khoi =================
S4 = "4_Hut_khoi"
ws = tao_sheet(S4, "4. LƯU LƯỢNG HÚT KHÓI VÀ QUẠT – TCVN 5687:2024 Phụ lục H",
               "TCVN 5687:2024 Phụ lục H (H.1: hành lang, sảnh; H.2: gian phòng; H.3: lối thoát nạn), Bảng H.1; Phụ lục G (G.10 đến G.12)",
               "A cho H.1, H.2, H.3 và Bảng H.1 (đọc trực tiếp ảnh trang 73–76); C cho tỷ lệ bù khí 85 % (bảng tính công ty trích G.7.1, chưa đọc được trang gốc)")
r = 6
r = muc(ws, r, "A. Hút khói gian phòng (H.2): G = 678,8 · Pf · Y^1,5 · Ks")
r = dong(ws, r, 1, "Diện tích gian phòng hoặc bể khói", "A", 400, "m²", "Phòng ≥ 1600 m² chia bể khói (số bể ở dòng 8)", "nhap", ma="A")
r = dong(ws, r, 2, "Gian phòng có sprinkler?", "", 1, "1 = có", "Có sprinkler: Pf = 12 m", "nhap", ma="spr")
danh_sach(ws, REF[S4]["spr"], [0, 1])
r = dong(ws, r, 3, "Chu vi đám cháy giai đoạn đầu", "Pf", f"=IF({REF[S4]['spr']}=1,12,MIN(12,MAX(4,0.38*{REF[S4]['A']}^0.5)))", "m", "H.2: sprinkler thì 12 m; không xác định được thì Pf = 0,38·A^0,5, giới hạn 4 đến 12 (H.4)", fmt="0.0", ma="Pf")
r = dong(ws, r, 4, "Khoảng cách từ mép dưới vùng khói đến sàn", "Y", 2.5, "m", "Gian phòng: 2,5 m. Pf > 12 m hay Y > 4 m: tính theo H.3 (H.2 chú thích)", "nhap", fmt="0.0", ma="Y")
r = dong(ws, r, 5, "Hệ số Ks", "Ks", 1.0, "", "1,0; hút tự nhiên kết hợp sprinkler: 1,2", "nhap", fmt="0.0", ma="Ks")
r = dong(ws, r, 6, "Khối lượng khói cần thải", "G", f"=678.8*{REF[S4]['Pf']}*{REF[S4]['Y']}^1.5*{REF[S4]['Ks']}", "kg/h", "Công thức H.3 của tiêu chuẩn", "kq", fmt="#,##0", ma="G")
r = dong(ws, r, 7, "Trọng lượng riêng của khói", "γ", 5, "N/m³", "H.3: 4 N/m³ ở 600 °C (chất cháy khí, lỏng); 5 N/m³ ở 450 °C (vật rắn); 6 N/m³ ở 300 °C (sợi; khói thải từ hành lang, sảnh)", "nhap", ma="gam")
danh_sach(ws, REF[S4]["gam"], [4, 5, 6])
r = dong(ws, r, 8, "Khối lượng riêng của khói", "ρ", f"={REF[S4]['gam']}/9.81", "kg/m³", "ρ = γ/g", fmt="0.000", ma="rho")
r = dong(ws, r, 9, "Số bể khói (phòng lớn hơn 1600 m²)", "Nb", f"=ROUNDUP({REF[S4]['A']}/1600,0)", "bể", "Làm tròn lên (bảng tính cũ để số lẻ). Mỗi bể tính theo G ở dòng 6", ma="Nb")
r = dong(ws, r, 10, "Số bể hút đồng thời", "", 1, "bể", "Thiết kế thường tính 1 bể cháy và bể liền kề theo thiết kế chống khói; nhập theo giải pháp của hồ sơ", "nhap", ma="nbd")
r = dong(ws, r, 11, "Lưu lượng khói tính toán", "Q", f"={REF[S4]['G']}/{REF[S4]['rho']}*{REF[S4]['nbd']}", "m³/h", "Q = G/ρ", "kq", fmt="#,##0", ma="Q")
r = dong(ws, r, 12, "Hệ số dự phòng lưu lượng quạt (rò rỉ ống, sai số)", "kd", 1.1, "", "Bảng tính công ty dùng 1,1 (mức C)", "nhap", fmt="0.00", ma="kd")
r = dong(ws, r, 13, "Số quạt", "", 3, "quạt", "", "nhap", ma="nq")
r = dong(ws, r, 14, "Lưu lượng mỗi quạt", "Q_quạt", f"=ROUNDUP({REF[S4]['Q']}*{REF[S4]['kd']}/{REF[S4]['nq']},-3)", "m³/h", "Làm tròn lên hàng nghìn", "kq", fmt="#,##0", ma="Qq")
r = dong(ws, r, 15, "Lưu lượng bù khí", "Q_bù", f"=0.85*{REF[S4]['Q']}", "m³/h", "85 % lưu lượng thải (bảng tính công ty, trích G.7.1 TCVN 5687:2024: mức C). G.10: Ga = Gsm/(1−n), n ∈ (−0,3; 0,3) là phương pháp cân bằng chung", fmt="#,##0", ma="Qbu")
r = muc(ws, r + 1, "B. Hút khói hành lang, sảnh (H.1) – cho lối ra cầu thang hoặc ra ngoài")
r = dong(ws, r, 16, "Loại nhà", "", "Nhà công cộng", "", "", "nhap", ma="loai")
danh_sach(ws, REF[S4]["loai"], ["Nhà ở", "Nhà công cộng"])
r = dong(ws, r, 17, "Chiều rộng cánh cửa lớn nhất của cửa đi mở từ hành lang", "B", 1.2, "m", "Trong khoảng 0,6 đến 2,4; ngoài khoảng: dùng giá trị biên", "nhap", ma="B")
r = dong(ws, r, 18, "Chiều cao cửa đi", "H", 2.1, "m", "H = 2 nếu < 2; H = 2,5 nếu > 2,5 (H.1)", "nhap", ma="Hc")
r = dong(ws, r, 19, "Số người thoát qua một cửa", "N", 30, "người", "Kd = 1 nếu từ 25 người trở lên; 0,8 nếu dưới 25", "nhap", ma="N")
cB = f"MIN(MAX({REF[S4]['B']},0.6),2.4)"
tabn = f"IF({REF[S4]['loai']}=\"Nhà ở\",{D['h1_o']},{D['h1_cc']})"
i0 = f"MATCH({cB},{D['h1_B']},1)"
i1 = f"MIN({i0}+1,5)"
n_expr = f"IF({i0}>=5,INDEX({tabn},5),INDEX({tabn},{i0})+({cB}-INDEX({D['h1_B']},{i0}))*(INDEX({tabn},{i1})-INDEX({tabn},{i0}))/(INDEX({D['h1_B']},{i1})-INDEX({D['h1_B']},{i0})))"
r = dong(ws, r, 20, "Hệ số n theo chiều rộng cánh cửa", "n", f"={n_expr}", "", "Bảng H.1, nội suy tuyến tính", fmt="0.000", ma="nn")
r = dong(ws, r, 21, "Hệ số Kd (thời gian mở cửa)", "Kd", f'=IF({REF[S4]["N"]}>=25,1,0.8)', "", "Chỉ dùng cho nhà công cộng (H.2)", fmt="0.0", ma="Kd")
r = dong(ws, r, 22, "Khối lượng khói cần hút từ hành lang, sảnh", "G1", f'=IF({REF[S4]["loai"]}="Nhà ở",3420,4300*{REF[S4]["Kd"]})*{REF[S4]["B"]}*{REF[S4]["nn"]}*MIN(MAX({REF[S4]["Hc"]},2),2.5)^1.5', "kg/h", "H.1: nhà ở G1 = 3420·B·n·H^1,5; công cộng G1 = 4300·B·n·H^1,5·Kd", "kq", fmt="#,##0", ma="G1")
r = dong(ws, r, 23, "Lưu lượng thể tích (γ = 6 N/m³ ở 300 °C)", "Q1", f"={REF[S4]['G1']}/(6/9.81)", "m³/h", "ρ = 6/9,81 kg/m³ (khói thải từ hành lang, sảnh, H.3)", "kq", fmt="#,##0")
r = muc(ws, r + 1, "C. Khối lượng khói từ phòng ra lối thoát nạn (H.3, H.5) – dùng cho tính toán chi tiết")
r = dong(ws, r, 24, "Diện tích tương đương các cửa trên lối thoát nạn", "Ad", 2.0, "m²", "H.6 đến H.13: tính riêng; nhập kết quả", "nhap", ma="Ad")
r = dong(ws, r, 25, "Chiều cao cửa cao nhất trên lối thoát nạn", "Hmax", 2.1, "m", "", "nhap", ma="Hmax")
r = dong(ws, r, 26, "Chiều cao tính toán h0", "h0", f"=0.5*{REF[S4]['Hmax']}+0.2", "m", "h0 = 0,5·Hmax + 0,2", fmt="0.00", ma="h0")
r = dong(ws, r, 27, "Nhiệt độ không khí ngoài (mùa tính toán)", "T0", 35, "°C", "Chu kỳ mùa lạnh; kiểm lại mùa nóng nếu gió mùa nóng lớn hơn (H.3)", "nhap", ma="T0")
r = dong(ws, r, 28, "Trọng lượng riêng không khí ngoài", "γv", f"=353/(273+{REF[S4]['T0']})*9.81", "N/m³", "γv = ρ·g, ρ = 353/(273 + t) kg/m³ (công thức không khí khô ở áp suất khí quyển chuẩn)", fmt="0.00", ma="gv")
r = dong(ws, r, 29, "Vận tốc gió (≤ 1 m/s thì lấy 0)", "v", 0, "m/s", "H.3: không quá 5 m/s", "nhap", ma="v")
r = dong(ws, r, 30, "Hệ số Ks", "Ks", 1.0, "", "", "nhap", fmt="0.0", ma="Ks2")
r = dong(ws, r, 31, "Khối lượng khói cần thải", "G1", f"=3564*{REF[S4]['Ad']}*({REF[S4]['h0']}*({REF[S4]['gv']}-{REF[S4]['gam']})*({REF[S4]['gv']}/9.81)^2+0.7*{REF[S4]['v']}^2*({REF[S4]['gv']}/9.81)^2)^0.5*{REF[S4]['Ks2']}", "kg/h", "H.5: G1 = 3564·Ad·[h0(γv − γ)ρv² + 0,7·v²·ρv²]^0,5·Ks; γ là trọng lượng riêng khói (dòng 7), γv của không khí ngoài; γv > γ thì khói nổi lên và thoát. Kết quả lỗi (số âm trong căn) nghĩa là khói không nhẹ hơn không khí ngoài: kiểm tra nhiệt độ", "kq", fmt="#,##0")
ws.freeze_panes = "A6"

# ================= 5_Thoat_khoi_TN =================
S5 = "5_Thoat_khoi_TN"
ws = tao_sheet(S5, "5. THOÁT KHÓI TỰ NHIÊN QUA CỬA BÙ KHÍ VÀ CỬA THOÁT KHÓI (mặt phẳng cân bằng áp suất)",
               "Bảng tính 'hút khói tự nhiên 2025' của công ty (trích TCVN 5687:2024, QCVN 06 Phụ lục D); phương trình dòng chảy qua lỗ Q = A·√(2ΔP/ρ)",
               "C: theo bảng tính công ty. Khác bảng cũ: cân bằng khối lượng giữa hai cửa (có tỷ số ρ0/ρ1) và vận tốc dòng ra tính với khối lượng riêng khói ρ1; bảng cũ dùng ρ ngoài cho cả hai cửa nên lưu lượng vào và ra không cân bằng khối lượng")
r = 6
r = muc(ws, r, "I. Điều kiện")
r = dong(ws, r, 1, "Nhiệt độ khói trong công trình", "T1", 300, "°C", "H.3 TCVN 5687:2024: 300 °C khi khói thải từ hành lang, sảnh; 450 °C vật rắn", "nhap", ma="T1")
r = dong(ws, r, 2, "Nhiệt độ ngoài công trình lớn nhất", "T0", 40.6, "°C", "Bảng A.5 QCVN 02:2022/BXD (chọn nhiệt độ lớn nhất)", "nhap", ma="T0")
r = dong(ws, r, 3, "Diện tích hữu hiệu cửa bù khí", "A1", 0.85, "m²", "Diện tích hình học × 85 %", "nhap", ma="A1")
r = dong(ws, r, 4, "Diện tích hữu hiệu cửa thoát khói", "A2", 1.989, "m²", "Mép dưới cửa thoát khói ≥ 2,2 m so với sàn; diện tích hữu hiệu tổng ≥ 2,5 % diện tích sàn (phương án khác, QCVN 06 D.2)", "nhap", ma="A2")
r = dong(ws, r, 5, "Khoảng cách giữa tâm cửa bù khí và tâm cửa thoát khói", "H", 4.4, "m", "", "nhap", ma="H")
r = dong(ws, r, 6, "Cao độ tâm cửa bù khí so với sàn", "z1", 0.5, "m", "", "nhap", ma="z1")
r = dong(ws, r, 7, "Lưu lượng thoát khói yêu cầu", "Q2yc", 3000, "m³/h", "Lấy từ sheet 4 (hoặc tính toán riêng)", "nhap", ma="Q2")
r = dong(ws, r, 8, "Tỷ lệ bù khí so với thoát khói", "", 0.85, "", "Bảng tính công ty: 85 % (mức C)", "nhap", fmt="0%", ma="tl")
r = muc(ws, r + 1, "II. Tính toán")
r = dong(ws, r, 9, "Khối lượng riêng không khí ngoài", "ρ0", f"=101325/(({REF[S5]['T0']}+273)*287.05)", "kg/m³", "ρ = p/(R·T), R = 287,05 J/kg·K, p = 101325 Pa", fmt="0.000", ma="r0")
r = dong(ws, r, 10, "Khối lượng riêng khói", "ρ1", f"=101325/(({REF[S5]['T1']}+273)*287.05)", "kg/m³", "", fmt="0.000", ma="r1")
r = dong(ws, r, 11, "Khoảng cách tâm cửa bù khí đến mặt phẳng cân bằng", "H1", f"={REF[S5]['H']}/(1+({REF[S5]['A1']}/{REF[S5]['A2']})^2*{REF[S5]['r0']}/{REF[S5]['r1']})", "m", "Cân bằng khối lượng: A1²·ρ0·H1 = A2²·ρ1·H2 và H1 + H2 = H (bảng cũ bỏ tỷ số ρ0/ρ1, cân bằng thể tích)", fmt="0.000", ma="H1")
r = dong(ws, r, 12, "Khoảng cách tâm cửa thoát khói đến mặt phẳng cân bằng", "H2", f"={REF[S5]['H']}-{REF[S5]['H1']}", "m", "H2 = H − H1", fmt="0.000", ma="H2")
r = dong(ws, r, 13, "Cao độ mặt phẳng cân bằng", "z0", f"={REF[S5]['z1']}+{REF[S5]['H1']}", "m", "", fmt="0.00", ma="z0")
r = dong(ws, r, 14, "Kiểm tra mặt phẳng cân bằng cao hơn 2 m", "", f'=IF({REF[S5]["z0"]}>2,"ĐẠT: lớp khói không xuống dưới 2 m","KHÔNG ĐẠT: tính lại")', "", "QCVN 06 D.1: biên dưới lớp khói ≥ 2 m so với sàn", "kq")
r = dong(ws, r, 15, "Áp suất tại cửa bù khí (dương = khí vào)", "P1", f"=({REF[S5]['r0']}-{REF[S5]['r1']})*9.81*({REF[S5]['z0']}-{REF[S5]['z1']})", "Pa", "(ρ0 − ρ1)·g·(z0 − z1)", fmt="0.00", ma="P1")
r = dong(ws, r, 16, "Áp suất tại cửa thoát khói (âm = khói ra)", "P2", f"=({REF[S5]['r0']}-{REF[S5]['r1']})*9.81*({REF[S5]['z0']}-({REF[S5]['z0']}+{REF[S5]['H2']}))", "Pa", "", fmt="0.00", ma="P2")
r = dong(ws, r, 17, "Vận tốc không khí qua cửa bù khí", "v1", f"=SQRT(2*ABS({REF[S5]['P1']})/{REF[S5]['r0']})", "m/s", "v = √(2ΔP/ρ); khí vào có khối lượng riêng ρ0", fmt="0.00", ma="v1")
r = dong(ws, r, 18, "Vận tốc khói qua cửa thoát khói", "v2", f"=SQRT(2*ABS({REF[S5]['P2']})/{REF[S5]['r1']})", "m/s", "khói ra có khối lượng riêng ρ1", fmt="0.00", ma="v2")
r = dong(ws, r, 19, "Lưu lượng bù khí tính toán", "Q1tt", f"={REF[S5]['A1']}*{REF[S5]['v1']}", "m³/s", "", fmt="0.000", ma="Q1tt")
r = dong(ws, r, 20, "Lưu lượng thoát khói tính toán", "Q2tt", f"={REF[S5]['A2']}*{REF[S5]['v2']}", "m³/s", "", fmt="0.000", ma="Q2tt")
r = dong(ws, r, 21, "Kiểm tra lưu lượng thoát khói", "", f'=IF({REF[S5]["Q2tt"]}>={REF[S5]["Q2"]}/3600,"ĐẠT: "&TEXT({REF[S5]["Q2tt"]},"0.00")&" m³/s ≥ "&TEXT({REF[S5]["Q2"]}/3600,"0.00")&" m³/s","KHÔNG ĐẠT: tăng diện tích cửa thoát khói")', "", "", "kq")
r = dong(ws, r, 22, "Kiểm tra lưu lượng bù khí", "", f'=IF({REF[S5]["Q1tt"]}>={REF[S5]["tl"]}*{REF[S5]["Q2"]}/3600,"ĐẠT","KHÔNG ĐẠT: tăng diện tích cửa bù khí")', "", "", "kq")
r = dong(ws, r, 23, "Kiểm tra vận tốc qua cửa bù khí", "", f'=IF({REF[S5]["v1"]}<6,"ĐẠT (< 6 m/s)","KHÔNG ĐẠT: tăng diện tích cửa bù khí")', "", "Bảng tính công ty dùng 6 m/s (mức C)", "kq")

# ================= 6_Quat_ong_gio =================
S6 = "6_Quat_ong_gio"
ws = tao_sheet(S6, "6. ỐNG GIÓ VÀ QUẠT HÚT KHÓI (cột áp, công suất)",
               "Phương pháp vận tốc không đổi; Darcy–Weisbach + Swamee–Jain; công suất quạt N = Q·ΔP/(η·3,6×10⁶); phụ kiện 30 % theo bảng tính công ty",
               "B cho công thức thủy khí; C cho hệ số phụ kiện 30 %, áp tại miệng quạt 40 Pa, hệ số an toàn 1,1 (bảng tính công ty). Tính ở điều kiện không khí chuẩn, chưa hiệu chỉnh nhiệt độ khói")
r = 6
r = muc(ws, r, "I. Thông số chung")
r = dong(ws, r, 1, "Độ nhám tuyệt đối ống thép tráng kẽm", "ε", 0.09, "mm", "ASHRAE: 0,09 mm", "nhap", fmt="0.00", ma="eps")
r = dong(ws, r, 2, "Độ nhớt động học của không khí", "ν", 1.5e-5, "m²/s", "20 °C; khói nóng lớn hơn (kết quả thiên an toàn nhẹ)", "nhap", fmt="0.0E+00", ma="nu")
r = dong(ws, r, 3, "Khối lượng riêng không khí", "ρ", 1.2, "kg/m³", "", "nhap", fmt="0.00", ma="rho")
r = dong(ws, r, 4, "Hệ số tổn thất phụ kiện (cút, tê, côn…)", "kpk", 0.3, "", "30 % tổn thất đường ống (bảng tính công ty)", "nhap", fmt="0%", ma="kpk")
r = dong(ws, r, 5, "Áp suất tại miệng hút hoặc xả, van, lưới", "Pm", 40, "Pa", "Bảng tính công ty", "nhap", ma="Pm")
r = dong(ws, r, 6, "Hệ số an toàn cột áp", "ks", 1.1, "", "", "nhap", fmt="0.00", ma="ks")
r = muc(ws, r + 1, "II. Tuyến ống bất lợi nhất (nhập lưu lượng, vận tốc chọn, chiều dài)")
r = dau_bang(ws, r, ["Đoạn", "Lưu lượng Q (m³/h)", "Vận tốc chọn v (m/s)", "Chiều dài L (m)", "Tiết diện A (m²)", "Đường kính tương đương D (mm)"], 42)
for i, t in enumerate(["Re", "λ (Swamee–Jain)", "Tổn thất đơn vị (Pa/m)", "Tổn thất đoạn (Pa)"]):
    c = ws.cell(r - 1, 7 + i, t); c.font = f_dam; c.fill = fill_dau; c.alignment = giua; c.border = khung
for col, w in zip("GHIJ", (12, 14, 16, 16)): ws.column_dimensions[col].width = w
q0 = r
mq = [(60000, 20, 12), (50000, 20, 12), (40000, 20, 12), (30000, 20, 12), (20000, 20, 12), (10000, 15, 12)]
for i in range(8):
    rr = q0 + i
    m = mq[i] if i < len(mq) else (None, None, None)
    ws.cell(rr, 1, i + 1).font = f_chu
    for col, v in ((2, m[0]), (3, m[1]), (4, m[2])):
        c = ws.cell(rr, col, v); c.font = f_in; c.fill = fill_in
    ws.cell(rr, 5, f'=IF(B{rr}="","",B{rr}/(C{rr}*3600))').number_format = "0.000"
    ws.cell(rr, 6, f'=IF(B{rr}="","",SQRT(4*E{rr}/PI())*1000)').number_format = "0"
    ws.cell(rr, 7, f'=IF(B{rr}="","",C{rr}*F{rr}/1000/{REF[S6]["nu"]})').number_format = "#,##0"
    ws.cell(rr, 8, f'=IF(B{rr}="","",0.25/(LOG10({REF[S6]["eps"]}/(3.7*F{rr})+5.74/G{rr}^0.9))^2)').number_format = "0.0000"
    ws.cell(rr, 9, f'=IF(B{rr}="","",H{rr}*{REF[S6]["rho"]}*C{rr}^2/(2*F{rr}/1000))').number_format = "0.00"
    ws.cell(rr, 10, f'=IF(B{rr}="",0,I{rr}*D{rr})').number_format = "0.0"
    for col in range(1, 11):
        ws.cell(rr, col).border = khung
        if col not in (2, 3, 4): ws.cell(rr, col).font = f_chu
qN = q0 + 7
r = qN + 2
r = dong(ws, r, 7, "Tổng tổn thất đường ống", "ΣΔP", f"=SUM(J{q0}:J{qN})", "Pa", "", fmt="0.0", ma="sum")
r = dong(ws, r, 8, "Tổn thất phụ kiện", "ΔPpk", f"={REF[S6]['kpk']}*{REF[S6]['sum']}", "Pa", "", fmt="0.0", ma="pk")
r = dong(ws, r, 9, "Cột áp tính toán", "ΔP", f"=({REF[S6]['sum']}+{REF[S6]['pk']}+{REF[S6]['Pm']})*{REF[S6]['ks']}", "Pa", "(ΣΔP + ΔPpk + Pm)·ks", "kq", fmt="0", ma="dp")
r = dong(ws, r, 10, "Lưu lượng quạt", "Q", f"=B{q0}", "m³/h", "Đoạn đầu (lớn nhất)", fmt="#,##0", ma="Q")
r = dong(ws, r, 11, "Hiệu suất quạt", "η_q", 0.6, "", "Theo đường đặc tính quạt", "nhap", fmt="0.00", ma="eq")
r = dong(ws, r, 12, "Hiệu suất truyền động", "η_td", 0.95, "", "", "nhap", fmt="0.00", ma="etd")
r = dong(ws, r, 13, "Công suất trục", "N", f"={REF[S6]['Q']}*{REF[S6]['dp']}/(3600*1000*{REF[S6]['eq']}*{REF[S6]['etd']})", "kW", "N = Q·ΔP/(3600·1000·η)", "kq", fmt="0.00", ma="N")
r = dong(ws, r, 14, "Công suất động cơ chọn (dự trữ 15 %)", "N_đc", f"=1.15*{REF[S6]['N']}", "kW", "Chọn bậc công suất chuẩn kế tiếp (sheet 10)", "kq", fmt="0.00", ma="Ndc")
r = dong(ws, r, 15, "Kiểm tra vận tốc ống", "", f'=IF(MAX(C{q0}:C{qN})<=20,"ĐẠT (≤ 20 m/s)","KIỂM TRA: vận tốc > 20 m/s, ồn và tổn thất lớn")', "", "Mức 20 m/s lấy từ bảng tính công ty (C)", "kq")
ws.freeze_panes = "A6"

# ================= 7_May_phat =================
S7 = "7_May_phat"
ws = tao_sheet(S7, "7. MÁY PHÁT ĐIỆN CHO HỆ THỐNG PCCC",
               "Bảng tính 'Máy phát điện TCVN 9206' của công ty: Kđt = 1; cos φ = 0,8; kdp = 1,2; khởi động = vận hành + P_động cơ lớn nhất × K_mở × kdp",
               "C: phương pháp của công ty, chưa đối chiếu được nguồn (TCVN 9206 quy định lắp đặt điện nhà ở, công trình công cộng, chưa kiểm xem có nêu công thức chọn máy phát)")
r = 6
r = muc(ws, r, "I. Thông số chung")
r = dong(ws, r, 1, "Hệ số đồng thời", "Kđt", 1, "", "", "nhap", fmt="0.00", ma="kdt")
r = dong(ws, r, 2, "Hệ số công suất", "cos φ", 0.8, "", "", "nhap", fmt="0.00", ma="cos")
r = dong(ws, r, 3, "Hệ số dự phòng", "kdp", 1.2, "", "", "nhap", fmt="0.00", ma="kdp")
r = dong(ws, r, 4, "Bội số dòng khởi động động cơ lớn nhất (bảng tính công ty dùng 4)", "K_mở", 4, "", "Khởi động trực tiếp 5–7; sao-tam giác 2–2,5; khởi động mềm ~3; biến tần ~1,5 (kinh nghiệm thiết kế)", "nhap", ma="km")
r = muc(ws, r + 1, "II. Phụ tải PCCC")
r = dau_bang(ws, r, ["STT", "Thiết bị", "", "Số lượng", "Công suất mỗi thiết bị (kW)", "Công suất (kW)"], 30)
tb = [("Tủ trung tâm báo cháy", 1, 0.05), ("Quạt hút khói", 3, 3.0), ("Quạt tăng áp", 0, 3.0), ("Bơm chữa cháy", 1, f"={r_(S3, 'Ndc')}"),
      ("Đèn sự cố, chỉ dẫn, biển báo", 1, 0.012), ("Cửa cuốn chống cháy", 1, 0.3), ("Van điện từ", 0, 0.002), ("Thang máy chữa cháy", 0, 0)]
p0 = r
for i, (t, n, p) in enumerate(tb):
    rr = p0 + i
    ws.cell(rr, 1, i + 1).font = f_chu; ws.cell(rr, 2, t).font = f_chu
    c = ws.cell(rr, 4, n); c.font = f_in; c.fill = fill_in
    c = ws.cell(rr, 5, p); c.font = f_chu if isinstance(p, str) else f_in
    if not isinstance(p, str): c.fill = fill_in
    c.number_format = "0.000"
    ws.cell(rr, 6, f"=D{rr}*E{rr}").number_format = "0.000"
    for col in range(1, 7): ws.cell(rr, col).border = khung
pN = p0 + len(tb) - 1
r = pN + 2
r = dong(ws, r, 1, "Tổng công suất điện", "ΣP", f"=SUM(F{p0}:F{pN})", "kW", "", fmt="0.00", ma="P")
r = dong(ws, r, 2, "Công suất động cơ lớn nhất", "Pmax", f"=MAX(E{p0}:E{pN})", "kW", "", fmt="0.00", ma="Pm")
r = dong(ws, r, 3, "Công suất biểu kiến tính toán", "Stt", f"={REF[S7]['kdt']}*{REF[S7]['P']}/{REF[S7]['cos']}", "kVA", "S = Kđt·ΣP/cos φ", fmt="0.00", ma="S")
r = dong(ws, r, 4, "Công suất vận hành có dự phòng", "Svh", f"={REF[S7]['S']}*{REF[S7]['kdp']}", "kVA", "", fmt="0.00", ma="Svh")
r = dong(ws, r, 5, "Công suất khi khởi động động cơ lớn nhất", "Skđ", f"={REF[S7]['Svh']}+{REF[S7]['Pm']}*{REF[S7]['km']}*{REF[S7]['kdp']}", "kVA", "Bảng tính công ty", fmt="0.00", ma="Skd")
r = dong(ws, r, 6, "Công suất máy phát yêu cầu", "S_mpđ", f"=MAX({REF[S7]['Svh']},{REF[S7]['Skd']})", "kVA", "SMPĐ ≥ max(Stt, Skđ) × kdp (theo kết luận của bảng tính công ty)", "kq", fmt="0.0", ma="Smp")
r = dong(ws, r, 7, "Công suất máy phát chuẩn gần nhất", "", f"=INDEX({D['mpd']},COUNTIF({D['mpd']},\"<\"&{REF[S7]['Smp']})+1)", "kVA", "Dãy công suất thương mại thông dụng (DU_LIEU)", "kq")

# ================= 8_Khi_CC =================
S8 = "8_Khi_CC"
ws = tao_sheet(S8, "8. CHỮA CHÁY BẰNG KHÍ (khí sạch, khí trơ) – lượng chất chữa cháy",
               "ISO 14520-1, ISO 14520-9, ISO 14520-15; TCVN 7161 (các phần); NFPA 2001. Halocarbon: W = V/S·C/(100−C), S = K1 + K2·T. Khí trơ: X = V·(Sr/S)·ln(100/(100−C))",
               "B cho halocarbon (engineersuniverse.com; S(20 °C) khớp ISO 14520-9); C cho khí trơ IG-541, IG-55 (hằng số lấy từ bảng tính công ty). Nồng độ thiết kế C: lấy theo tiêu chuẩn và loại đám cháy (nồng độ dập tắt × hệ số an toàn, vd. 1,2 cho đám cháy loại B)")
r = 6
r = muc(ws, r, "I. Thông số phòng")
r = dong(ws, r, 1, "Chất chữa cháy", "", "HFC-227ea (FM-200)", "", "Chọn trong danh sách", "nhap", ma="chat")
danh_sach(ws, REF[S8]["chat"], ["HFC-227ea (FM-200)", "IG-55", "IG-541"])
r = dong(ws, r, 3, "Chiều dài", "a", 13.4, "m", "", "nhap", ma="a")
r = dong(ws, r, 4, "Chiều rộng", "b", 8.8, "m", "", "nhap", ma="b")
r = dong(ws, r, 5, "Chiều cao", "h", 5.8, "m", "", "nhap", ma="h")
r = dong(ws, r, 6, "Thể tích thiết bị, kết cấu chiếm chỗ (không thấm khí)", "V2", 4, "m³", "", "nhap", ma="V2")
r = dong(ws, r, 7, "Thể tích chữa cháy", "V", f"={REF[S8]['a']}*{REF[S8]['b']}*{REF[S8]['h']}-{REF[S8]['V2']}", "m³", "V = V1 − V2", "tinh", fmt="0.0", ma="V")
r = dong(ws, r, 8, "Nồng độ thiết kế", "C", 7.9, "%", "Theo TCVN 7161-9 (HFC-227ea) hoặc tiêu chuẩn tương ứng và loại đám cháy", "nhap", fmt="0.0", ma="C")
r = dong(ws, r, 9, "Nhiệt độ phòng tính toán (nhỏ nhất)", "T", 21, "°C", "", "nhap", ma="T")
ch = f"MATCH({REF[S8]['chat']},{D['khi_ten']},0)"
r = dong(ws, r, 10, "Hằng số K1", "K1", f"=INDEX({D['khi_K1']},{ch})", "m³/kg", "Bảng hằng số ở DU_LIEU", fmt="0.00000", ma="K1")
r = dong(ws, r, 11, "Hằng số K2", "K2", f"=INDEX({D['khi_K2']},{ch})", "m³/(kg·°C)", "", fmt="0.0000000", ma="K2")
r = dong(ws, r, 12, "Thể tích riêng ở nhiệt độ phòng", "S", f"={REF[S8]['K1']}+{REF[S8]['K2']}*{REF[S8]['T']}", "m³/kg", "S = K1 + K2·T", fmt="0.00000", ma="S")
r = dong(ws, r, 13, "Thể tích riêng ở 20 °C", "Sr", f"={REF[S8]['K1']}+{REF[S8]['K2']}*20", "m³/kg", "Dùng cho khí trơ", fmt="0.00000", ma="Sr")
r = muc(ws, r + 1, "II. Lượng chất chữa cháy")
r = dong(ws, r, 14, "Khối lượng halocarbon cần thiết", "W", f'=IF({REF[S8]["chat"]}="HFC-227ea (FM-200)",ROUNDUP({REF[S8]["V"]}/{REF[S8]["S"]}*{REF[S8]["C"]}/(100-{REF[S8]["C"]}),1),"không áp dụng")', "kg", "W = V/S·C/(100−C)", "kq", fmt="0.0", ma="W")
r = dong(ws, r, 15, "Khối lượng halocarbon", "", f'=IF({REF[S8]["chat"]}="HFC-227ea (FM-200)",{REF[S8]["W"]}*2.20462,"")', "lb", "1 kg = 2,20462 lb", fmt="0.0")
r = dong(ws, r, 16, "Thể tích khí trơ ở 20 °C, 1,013 bar", "X", f'=IF({REF[S8]["chat"]}="HFC-227ea (FM-200)","không áp dụng",{REF[S8]["V"]}*({REF[S8]["Sr"]}/{REF[S8]["S"]})*LN(100/(100-{REF[S8]["C"]})))', "m³", "X = V·(Sr/S)·ln(100/(100−C)) (= 2,303·V·log10 …)", "kq", fmt="0.0", ma="X")
r = dong(ws, r, 17, "Dung tích mỗi bình", "", 80, "lít", "", "nhap", ma="vb")
r = dong(ws, r, 18, "Lượng khí của một bình (khí trơ, ở 20 °C, 1,013 bar)", "", 20, "m³", "Theo catalogue bình (vd. 80 lít chứa 20 m³ khí ở 150–200 bar)", "nhap", ma="xb")
r = dong(ws, r, 19, "Số bình khí trơ", "", f'=IF({REF[S8]["chat"]}="HFC-227ea (FM-200)","",ROUNDUP({REF[S8]["X"]}/{REF[S8]["xb"]},0))', "bình", "", "kq")
r = dong(ws, r, 20, "Mật độ nạp tối đa / tối thiểu của bình halocarbon", "", "tối đa 1,0 kg/lít; tối thiểu 0,4 kg/lít", "", "Ghi chú của bảng tính công ty (C); theo catalogue nhà sản xuất cụ thể có thể đến 1,15 kg/lít", "tinh")
r = dong(ws, r, 21, "Thời gian xả", "", "10 giây (halocarbon); 60 giây (khí trơ)", "", "ISO 14520-1 (kiểm tiêu chuẩn)", "tinh")

# ================= 9_Foam =================
S9 = "9_Foam"
ws = tao_sheet(S9, "9. CHỮA CHÁY BẰNG BỌT BỘI SỐ NỞ CAO – TCVN 7336:2021 Phụ lục C",
               "TCVN 7336:2021 Phụ lục C (C.1 đến C.6)",
               "A (đọc nguyên văn); hệ số dự trữ 100 % lấy từ bảng tính công ty (C): không thấy trong Phụ lục C")
r = 6
r = muc(ws, r, "I. Thông số")
r = dong(ws, r, 1, "Diện tích sàn khu vực bảo vệ", "S", 1000, "m²", "50 × 20 m", "nhap", ma="S")
r = dong(ws, r, 2, "Chiều cao đầy bọt (không gian bảo vệ)", "h", 6.5, "m", "C.1: chiều cao khi chứa đầy bọt", "nhap", ma="h")
r = dong(ws, r, 3, "Thể tích kết cấu không thấm nước (cột, dầm, móng)", "Vkc", 0, "m³", "C.1: trừ đi", "nhap", ma="Vkc")
r = dong(ws, r, 4, "Thể tích tính toán", "V", f"={REF[S9]['S']}*{REF[S9]['h']}-{REF[S9]['Vkc']}", "m³", "", fmt="#,##0", ma="V")
r = dong(ws, r, 5, "Bội số nở của bọt", "K", 650, "lần", "Theo thiết bị tạo bọt", "nhap", ma="K")
r = dong(ws, r, 6, "Thời gian lấp đầy tối đa", "τ", 10, "phút", "Không quá 10 phút (C.3)", "nhap", ma="tau")
r = dong(ws, r, 7, "Hiệu suất thiết bị tạo bọt (lưu lượng dung dịch)", "q", 320, "l/phút", "Theo thiết bị tạo bọt", "nhap", ma="q")
r = dong(ws, r, 8, "Hệ số co của bọt a1", "a1", 1.5, "", "1,2 nếu cao đến 4 m; 1,5 nếu cao đến 10 m; trên 10 m: thử nghiệm", "nhap", fmt="0.0", ma="a1")
r = dong(ws, r, 9, "Hệ số rò rỉ bọt a2", "a2", 1.2, "", "1,2 khi không có lỗ mở; có lỗ mở: thử nghiệm", "nhap", fmt="0.0", ma="a2")
r = dong(ws, r, 10, "Hệ số ảnh hưởng của khói a3", "a3", 1.5, "", "1,5 với hydrocacbon lỏng; chất cháy khác: thử nghiệm", "nhap", fmt="0.0", ma="a3")
r = dong(ws, r, 11, "Nồng độ thể tích dung dịch chất tạo bọt", "c", 2, "%", "Theo tài liệu kỹ thuật chất tạo bọt (C.5)", "nhap", ma="c")
r = dong(ws, r, 12, "Hệ số dự trữ chất tạo bọt", "kdt", 2, "", "Bảng tính công ty: dự trữ 100 % (mức C)", "nhap", ma="kdt")
r = muc(ws, r + 1, "II. Kết quả")
r = dong(ws, r, 13, "Hệ số phá huỷ bọt", "a", f"={REF[S9]['a1']}*{REF[S9]['a2']}*{REF[S9]['a3']}", "", "(D.2) a = a1·a2·a3", fmt="0.000", ma="a")
r = dong(ws, r, 14, "Số thiết bị tạo bọt (tính)", "n", f"={REF[S9]['a']}*{REF[S9]['V']}*1000/({REF[S9]['q']}*{REF[S9]['tau']}*{REF[S9]['K']})", "cái", "(D.1) n = a·V·10³/(q·τ·K)", fmt="0.00", ma="n")
r = dong(ws, r, 15, "Số thiết bị tạo bọt chọn", "", f"=ROUNDUP({REF[S9]['n']},0)", "cái", "", "kq", ma="nc")
r = dong(ws, r, 16, "Lưu lượng dung dịch chất tạo bọt", "Q", f"={REF[S9]['nc']}*{REF[S9]['q']}/(60*1000)", "m³/s", "C.4: Q = n·q/(60·10³)", "kq", fmt="0.000", ma="Q")
r = dong(ws, r, 17, "Lượng chất tạo bọt (1 lần)", "V_bọt", f"=ROUND(1.2*{REF[S9]['c']}*{REF[S9]['Q']}*{REF[S9]['tau']}*60/100,2)", "m³", "C.6: V = 1,2·c·Q·τ·10⁻²·60 (τ phút, c %, Q m³/s)", fmt="0.00", ma="Vb")
r = dong(ws, r, 18, "Lượng chất tạo bọt kể cả dự trữ", "", f"={REF[S9]['Vb']}*{REF[S9]['kdt']}", "m³", "", "kq", fmt="0.00")

# ================= 10_Day_MCB =================
S10 = "10_Day_MCB"
ws = tao_sheet(S10, "10. DÒNG ĐIỆN, CHỌN MCCB VÀ DÂY DẪN CHO THIẾT BỊ PCCC",
               "I = P/(√3·U·cos φ·η) (ba pha), I = P/(U·cos φ·η) (một pha); bảng chọn dây và MCCB của công ty (DU_LIEU)",
               "C: bảng chọn dây, MCCB theo công suất của công ty; cáp cấp điện cho thiết bị PCCC phải chống cháy (TCVN 9207:2012 mục 5.3, nêu ở kết quả thẩm định); kiểm sụt áp, tia chớp, dòng ngắn mạch riêng")
r = 6
r = muc(ws, r, "I. Thiết bị")
r = dong(ws, r, 1, "Công suất thiết bị", "P", f"={r_(S3, 'Ndc')}", "kW", "Liên kết công suất bơm (sheet 3); sửa tay cho thiết bị khác", "tinh", fmt="0.0", ma="P")
r = dong(ws, r, 2, "Loại tải", "", "Động cơ", "", "", "nhap", ma="tai")
danh_sach(ws, REF[S10]["tai"], ["Động cơ", "Thường"])
r = dong(ws, r, 3, "Số pha", "", 3, "pha", "", "nhap", ma="pha")
danh_sach(ws, REF[S10]["pha"], [1, 3])
r = dong(ws, r, 4, "Điện áp", "U", 380, "V", "3 pha 380 V; 1 pha 220 V", "nhap", ma="U")
r = dong(ws, r, 5, "Hệ số công suất", "cos φ", 0.85, "", "", "nhap", fmt="0.00", ma="cos")
r = dong(ws, r, 6, "Hiệu suất", "η", 0.9, "", "Động cơ 0,88 đến 0,95; tải thường 1,0", "nhap", fmt="0.00", ma="eta")
r = dong(ws, r, 7, "Hệ số an toàn khi chọn MCCB", "kat", 1.25, "", "In ≥ kat·I (kinh nghiệm thiết kế); kiểm đặc tính cắt, chỉnh định theo khởi động động cơ", "nhap", fmt="0.00", ma="kat")
r = muc(ws, r + 1, "II. Kết quả")
r = dong(ws, r, 8, "Dòng điện làm việc", "I", f'=IF({REF[S10]["pha"]}=3,{REF[S10]["P"]}*1000/(SQRT(3)*{REF[S10]["U"]}*{REF[S10]["cos"]}*{REF[S10]["eta"]}),{REF[S10]["P"]}*1000/({REF[S10]["U"]}*{REF[S10]["cos"]}*{REF[S10]["eta"]}))', "A", "", "kq", fmt="0.0", ma="I")
r = dong(ws, r, 9, "Dòng định mức MCCB tính toán", "", f"={REF[S10]['kat']}*{REF[S10]['I']}", "A", "", fmt="0.0", ma="In0")
r = dong(ws, r, 10, "Dòng định mức MCCB chọn", "In", f"=INDEX({D['mcb']},COUNTIF({D['mcb']},\"<\"&{REF[S10]['In0']})+1)", "A", "Cấp tiêu chuẩn kế tiếp", "kq", ma="In")
idx = f"COUNTIF({D['day_P']},\"<\"&{REF[S10]['P']})+1"
r = dong(ws, r, 11, "Dây dẫn theo bảng công ty", "", f'=IF({REF[S10]["tai"]}="Động cơ",INDEX({D["day_d2"]},{idx}),INDEX({D["day_d1"]},{idx}))', "mm²", "Bảng công ty theo cấp công suất (mức C)", "kq")
r = dong(ws, r, 12, "MCCB theo bảng công ty", "", f'=IF({REF[S10]["tai"]}="Động cơ",INDEX({D["day_m2"]},{idx}),INDEX({D["day_m1"]},{idx}))', "", "So với cấp dòng ở dòng 10: dùng cấp lớn hơn trong hai kết quả", "kq")

# ================= 11_Ket_cau =================
S11 = "11_Ket_cau"
ws = tao_sheet(S11, "11. KẾT CẤU THÉP – TỈ SỐ MẶT CẮT Am/V (kiểm tra R15)",
               "Bảng tính 'Kết cấu R15' của công ty: tiết diện chữ I bốn mặt lộ lửa; Am = 4b + 2h − 2tw; V (tiết diện) = tw(h − 2tf) + 2b·tf",
               "C: ngưỡng Am/V < 250 lấy từ bảng tính công ty; tìm nguồn trên mạng chưa xác nhận được: đối chiếu QCVN 06:2022 Bảng 4 và TCVN 5575:2024 trước khi dùng kết luận ĐẠT trong hồ sơ")
r = 6
r = muc(ws, r, "I. Tiết diện chữ I (đầu và cuối cấu kiện)")
r = dong(ws, r, 1, "Chiều cao tiết diện đầu (tính cả cánh)", "h1", 300, "mm", "", "nhap", ma="h1")
r = dong(ws, r, 2, "Chiều cao tiết diện cuối", "h2", 750, "mm", "Dầm vát thay đổi tiết diện; nhập h1 = h2 nếu không đổi", "nhap", ma="h2")
r = dong(ws, r, 3, "Chiều rộng cánh", "b", 200, "mm", "", "nhap", ma="b")
r = dong(ws, r, 4, "Chiều dày bụng", "tw", 8, "mm", "", "nhap", ma="tw")
r = dong(ws, r, 5, "Chiều dày cánh", "tf", 10, "mm", "", "nhap", ma="tf")
r = dong(ws, r, 6, "Số mặt lộ lửa", "", 4, "mặt", "", "nhap", ma="sm")
r = dong(ws, r, 7, "Ngưỡng Am/V", "", 250, "1/m", "Bảng tính công ty", "nhap", ma="ng")
r = muc(ws, r + 1, "II. Kết quả")
for ten, h in (("đầu", "h1"), ("cuối", "h2")):
    P = f"(4*{REF[S11]['b']}+2*{REF[S11][h]}-2*{REF[S11]['tw']})/1000"
    A = f"({REF[S11]['tw']}*({REF[S11][h]}-2*{REF[S11]['tf']})+2*{REF[S11]['b']}*{REF[S11]['tf']})/1000000"
    r = dong(ws, r, 8 if h == "h1" else 11, f"Chu vi lộ lửa tiết diện {ten} (Am)", "P", f"={P}", "m", "Am = 4b + 2h − 2tw", fmt="0.000", ma="P" + h)
    r = dong(ws, r, 9 if h == "h1" else 12, f"Diện tích tiết diện {ten}", "A", f"={A}", "m²", "tw(h − 2tf) + 2b·tf", fmt="0.00000", ma="A" + h)
    r = dong(ws, r, 10 if h == "h1" else 13, f"Am/V tiết diện {ten}", "Am/V", f"={REF[S11]['P' + h]}/{REF[S11]['A' + h]}", "1/m", "", "kq", fmt="0.0", ma="k" + h)
r = dong(ws, r, 14, "Kết luận", "", f'=IF(AND({REF[S11]["kh1"]}<{REF[S11]["ng"]},{REF[S11]["kh2"]}<{REF[S11]["ng"]}),"ĐẠT","KHÔNG ĐẠT")', "", "", "kq")

# ================= HUONG_DAN =================
wh = wb.create_sheet("HUONG_DAN", 0)
wh.sheet_view.showGridLines = False
for i, w in enumerate((6, 28, 62, 22, 70)):
    wh.column_dimensions["ABCDE"[i]].width = w
wh.merge_cells("A1:E1")
c = wh.cell(1, 1, "BẢNG TÍNH PCCC TỔNG HỢP – HƯỚNG DẪN, NGUỒN VÀ MỨC KIỂM"); c.font = f_tieude; c.fill = fill_tieude
wh.row_dimensions[1].height = 26
lines = [
    "Cách dùng: mỗi sheet là một bài tính. Ô chữ xanh nền vàng là ô nhập, ô còn lại là công thức. Số trong ô nhập là ví dụ minh hoạ (karaoke một tầng), thay bằng số liệu công trình. Kết quả chính nền xanh lá.",
    "Liên kết giữa các sheet: Q và cột áp sprinkler (1) và họng nước (2) đi sang bể, bơm (3); công suất bơm (3) đi sang máy phát (7) và dây, MCCB (10). Sửa tay được ô liên kết khi tính bằng phần mềm khác.",
    "Mức kiểm nguồn: A = đối chiếu nguyên văn tiêu chuẩn có trong thư mục tài liệu; B = đối chiếu nguồn uy tín bên ngoài; C = lấy từ bảng tính có sẵn của công ty, chưa đối chiếu được nguồn (dùng thận trọng, ghi rõ nguồn trong hồ sơ).",
    "Tiêu chuẩn đang dùng: QCVN 10:2025/BCA (thay tiêu chuẩn trang bị cũ), TCVN 7336:2021, TCVN 5687:2024, QCVN 06:2022/BXD sửa đổi 1:2023, TCVN 7568-14:2025. Không dùng văn bản đã hết hiệu lực.",
]
rr = 3
for t in lines:
    wh.merge_cells(start_row=rr, start_column=1, end_row=rr, end_column=5)
    c = wh.cell(rr, 1, t); c.font = f_chu; c.alignment = wrap; wh.row_dimensions[rr].height = 32; rr += 1
rr += 1
rr = dau_bang(wh, rr, ["STT", "Sheet", "Nội dung", "Mức kiểm", "Căn cứ"], 24)
ds = [("1_Sprinkler", "Thủy lực sprinkler: đầu phun bất lợi nhất, tổn thất, cột áp bơm; đối chiếu Hazen-Williams", "A + B", "TCVN 7336:2021 Bảng 1, Phụ lục B (B.2.2, B.2.5, B.3.2 đến B.3.14); NFPA 13 (Hazen-Williams)"),
      ("2_Hong_nuoc", "Họng nước trong nhà: số tia, lưu lượng, áp suất đầu họng theo Bảng H.7", "A", "QCVN 10:2025/BCA H.2.1 đến H.2.9, Bảng H.5, H.6, H.7"),
      ("3_Be_Bom", "Dung tích bể, lưu lượng bơm, cột áp, công suất động cơ, bơm dự phòng", "A + B", "QCVN 10 H.1, H.2, H.3; TCVN 7336 B.3.8, B.3.9; QCVN 02:2020/BCA"),
      ("4_Hut_khoi", "Khối lượng khói hành lang, phòng; số quạt; bù khí", "A (C cho bù khí 85 %)", "TCVN 5687:2024 Phụ lục H (H.1 đến H.3), Phụ lục G"),
      ("5_Thoat_khoi_TN", "Thoát khói tự nhiên: mặt phẳng cân bằng, lưu lượng qua cửa", "C", "Bảng tính công ty; QCVN 06 Phụ lục D"),
      ("6_Quat_ong_gio", "Ống gió: đường kính, tổn thất; cột áp và công suất quạt", "B + C", "Darcy–Weisbach, Swamee–Jain; ASHRAE"),
      ("7_May_phat", "Công suất máy phát cho phụ tải PCCC", "C", "Bảng tính công ty"),
      ("8_Khi_CC", "Khí chữa cháy: halocarbon (FM-200), khí trơ IG-541, IG-55", "B + C", "ISO 14520, TCVN 7161, NFPA 2001"),
      ("9_Foam", "Bọt bội số nở cao: số thiết bị, lưu lượng, lượng bọt", "A", "TCVN 7336:2021 Phụ lục C"),
      ("10_Day_MCB", "Dòng điện, chọn MCCB và dây theo công suất", "C", "Bảng công ty"),
      ("11_Ket_cau", "Am/V thép chữ I kiểm R15", "C", "Bảng công ty (ngưỡng chưa có nguồn)"),
      ("DU_LIEU", "Các bảng tra: TCVN 7336 Bảng 1, B.2; QCVN 10 H.2, H.7; TCVN 5687 H.1; hằng số khí; bảng dây", "A, C", "Xem tiêu đề từng bảng")]
for i, (s, nd, mk, cc) in enumerate(ds, 1):
    for k, v in enumerate([i, s, nd, mk, cc]):
        c = wh.cell(rr, 1 + k, v); c.font = f_chu; c.border = khung; c.alignment = wrap
    rr += 1
rr += 1
wh.merge_cells(start_row=rr, start_column=1, end_row=rr, end_column=5)
wh.cell(rr, 1, "Phát hiện khi đối chiếu 15 file Excel cũ (để biết khi còn dùng bảng cũ)").font = f_muc; wh.cell(rr, 1).fill = fill_muc; rr += 1
loi = [
    "Sheet 'Nuoc' (file SP241): VLOOKUP trỏ vào sheet 'Du lieu' không có dữ liệu, cho #N/A ở các ô tổn thất và cột áp bơm.",
    "File 'Cột Áp Quạt Hút Khói': ô O4 = #REF!, nhiều ô #DIV/0! do hàng trống.",
    "Công suất quạt hút khói: số bể khói để số lẻ (3500/1600 = 2,19) rồi nhân; ở đây làm tròn lên và cho chọn số bể hút đồng thời.",
    "Hằng số K2 của HFC-227ea: bảng cũ 0,000513, tiêu chuẩn 0,0005131 (chênh nhỏ).",
    "Thoát khói tự nhiên: bảng cũ dùng khối lượng riêng không khí ngoài cho cả dòng khói ra; ở đây dòng khói ra dùng khối lượng riêng của khói.",
    "Bảng Bọt: hệ số dự trữ 2 không thấy trong Phụ lục C TCVN 7336:2021; để thành ô nhập riêng.",
    "Bảng R15: ngưỡng Am/V < 250 chưa tìm được nguồn tiêu chuẩn.",
    "Bảng B.2 TCVN 7336 ghi KT '× 10⁻⁶' nhưng các bảng tính đều dùng giá trị thô (vd. DN50 = 135): kiểm bằng Hazen-Williams cho cùng bậc độ lớn, dùng giá trị thô.",
    "Không đưa vào: tính áp suất nổ dư (SP 12.13130, tiêu chuẩn Nga cho nhà hạng A, B); chọn ống gió bằng bảng 'Công thức tính ống' (1 400 dòng công thức tổn thất cục bộ, chưa kiểm).",
]
for t in loi:
    wh.merge_cells(start_row=rr, start_column=1, end_row=rr, end_column=5)
    c = wh.cell(rr, 1, "• " + t); c.font = f_chu; c.alignment = wrap; wh.row_dimensions[rr].height = 28; rr += 1
rr += 1
wh.merge_cells(start_row=rr, start_column=1, end_row=rr, end_column=5)
wh.cell(rr, 1, "Nguồn bên ngoài đã đối chiếu").font = f_muc; wh.cell(rr, 1).fill = fill_muc; rr += 1
for t in ["Hazen-Williams hệ SI (6,05×10⁵, bar/m, l/phút, mm), hệ số C theo NFPA 13: https://canutesoft.com/support/basic-hydraulics/the-hazen-williams-formula-for-use-in-fire-sprinkler-systems",
          "Halocarbon W = V/S·C/(100−C): https://engineersuniverse.com/studios/fire-suppression/fs-clean-agent-suppression",
          "ISO 14520-9: thể tích riêng HFC-227ea 0,1374 m³/kg ở 20 °C, 1,013 bar: https://iteh.es/catalog/standards/iso/66211495-7bc3-4544-9dff-c1ef074bb063/iso-14520-9-2006",
          "Chưa xác nhận được trên mạng mở: hằng số IG-541, IG-55; công thức khí trơ ISO 14520-1 (kiến thức tiêu chuẩn, hằng số lấy từ bảng công ty); ngưỡng Am/V."]:
    wh.merge_cells(start_row=rr, start_column=1, end_row=rr, end_column=5)
    c = wh.cell(rr, 1, "• " + t); c.font = f_chu; c.alignment = wrap; wh.row_dimensions[rr].height = 28; rr += 1

# thứ tự sheet
thu_tu = ["HUONG_DAN", S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, "DU_LIEU"]
wb._sheets = [wb[n] for n in thu_tu]
wb.calculation.fullCalcOnLoad = True
os.makedirs(os.path.dirname(RA), exist_ok=True)
wb.save(RA)
print("đã ghi", RA)
