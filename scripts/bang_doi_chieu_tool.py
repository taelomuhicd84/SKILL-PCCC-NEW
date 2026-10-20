"""Đọc bảng đối chiếu chính thức (.docx) trong thư mục BANG_DIR, tiết kiệm token.

Cách dùng (chạy bằng Python 3, không cần cài thêm gì):
  python -I -X utf8 bang_doi_chieu_tool.py danhmuc                 # liệt kê các bảng
  python -I -X utf8 bang_doi_chieu_tool.py khung A12               # khung: TT, nội dung đối chiếu, khoản điều
  python -I -X utf8 bang_doi_chieu_tool.py dong A12 "4.1"          # toàn văn một dòng theo TT
  python -I -X utf8 bang_doi_chieu_tool.py tim A12 "hành lang"     # tìm dòng chứa từ khóa
  python -I -X utf8 bang_doi_chieu_tool.py xuat A12 out.md         # xuất toàn bộ bảng ra markdown
  python -I -X utf8 bang_doi_chieu_tool.py lamviec A12 ban_lam_viec.md   # bảng làm việc cho một dự án (cột Tra ở, Thiết kế, Kết luận, Khung)
  Dòng chọn theo TT ("7.1.6") hoặc theo số thứ tự "#85" in ở cột # của lệnh khung.
Mã bảng: A12, B1... (đầu tên file, không phân biệt hoa thường).
Bảng .doc (không phải .docx) chưa đọc được: cần lưu thành .docx trước.
"""
import glob, os, re, sys, zipfile
from xml.etree import ElementTree as ET

BANG_DIR = r"D:\$.4. QC - TCVN\Bảng đối chiếu PCCC Đồng Nai -Nam gửi"
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"


def _text(el):
    out = []
    for n in el.iter():
        if n.tag == W + "t":
            out.append(n.text or "")
        elif n.tag in (W + "tab",):
            out.append(" ")
        elif n.tag == W + "br":
            out.append("\n")
    return "".join(out)


def _cell_text(tc):
    paras = [_text(p).strip() for p in tc.iter(W + "p")]
    return " / ".join(p for p in paras if p)


def find_file(code):
    code = code.lower().rstrip(".")
    for f in sorted(glob.glob(os.path.join(BANG_DIR, "*.docx"))):
        name = os.path.basename(f).lower()
        m = re.match(r"([ab]\d+(?:\.\d+)?)", name)
        if m and m.group(1) == code:
            return f
    raise SystemExit("Không thấy bảng %s (chỉ đọc .docx)" % code)


def load(code):
    path = find_file(code)
    root = ET.fromstring(zipfile.ZipFile(path).read("word/document.xml"))
    body = root.find(W + "body")
    head, rows = [], []
    for ch in body:
        if ch.tag == W + "p":
            t = _text(ch).strip()
            if t:
                head.append(t)
        elif ch.tag == W + "tbl":
            for tr in ch.findall(W + "tr"):
                cells = [_cell_text(tc) for tc in tr.findall(W + "tc")]
                if cells:
                    rows.append(cells)
    return path, head, rows


def main_rows(rows):
    """Chỉ giữ các dòng của bảng nội dung đối chiếu (6 cột hoặc dòng tiêu đề mục)."""
    out, started = [], False
    for r in rows:
        if r and r[0].strip() == "TT" and len(r) >= 5:
            started = True
            continue
        if started:
            out.append(r)
    return out


def short(s, n):
    s = re.sub(r"\s+", " ", s).strip()
    return s if len(s) <= n else s[: n - 1] + "…"


def cmd_danhmuc():
    for f in sorted(glob.glob(os.path.join(BANG_DIR, "*")), key=lambda x: os.path.basename(x)):
        print(os.path.basename(f))


SK = ""
# Điều khoản trong cột "Khoản, Điều" -> module/skill của hệ thống kiểm tra
TRA = [
    (r"3\.2\.8|Bảng G|Phụ lục G|G\.\d", "MOD_tinh_toan + PHU_LUC_G"),
    (r"3\.2\.(5|6|7)\b|3\.2\.6", "MOD_so_luong_loi_ra"),
    (r"3\.[12]\b|3\.1\.|3\.2\.", "MOD_loi_ra_va_cua"),
    (r"3\.3\.4|(?<![\d.])3\.5\b|Bảng B|Phụ lục B", "MOD_vat_lieu"),
    (r"3\.3\.", "MOD_hanh_lang"),
    (r"3\.4\.|2\.4\.", "MOD_cau_thang"),
    (r"\bD\.\d|\bD10|Phụ lục D|D\.2", "MOD_chong_khoi_PL_D"),
    (r"4\.5\b|4\.6\b", "SKILL_ngan_chay"),
    (r"TCVN|QCVN 1[0-9]|QCVN 0[0-9]:20(1|2)[0-9]/B(?!XD)", "bảng hệ thống B1–B14"),
    (r"1\.4\.", "dinh-nghia"),
]


def tra_o(dieu):
    for pat, target in TRA:
        if re.search(pat, dieu):
            return target
    return "chưa nạp: đọc cột quy định của bảng"


def _rows_idx(rows):
    return list(enumerate(main_rows(rows)))


def cmd_khung(code):
    path, head, rows = load(code)
    print("# Khung bảng", os.path.basename(path))
    print("| # | TT | Nội dung đối chiếu | Khoản, Điều | Tra ở |")
    for i, r in _rows_idx(rows):
        tt = r[0]
        nd = r[1] if len(r) > 1 else ""
        dieu = r[4] if len(r) > 4 else ""
        print("| %d | %s | %s | %s | %s |" % (i, short(tt, 8), short(nd, 100), short(dieu, 60), tra_o(dieu) if dieu.strip() else ""))


def cmd_lamviec(code, out):
    """Tạo bảng làm việc cho một dự án: giữ đúng khung bảng chính thức, thêm cột Tra ở, Thiết kế, Kết luận, Khung."""
    path, head, rows = load(code)
    with open(out, "w", encoding="utf8") as f:
        f.write("# Bảng làm việc – %s\n\n" % os.path.basename(path))
        f.write("Công trình: ........   Ngày: ........\n\n")
        f.write("Kết luận chỉ nhận: ĐẠT · CHƯA ĐẠT · CẦN XÁC NHẬN · KHÔNG ÁP DỤNG, kèm lý do có số ngay tại ô. Dòng CHƯA ĐẠT/CẦN XÁC NHẬN ghi số khung.\n\n")
        f.write("| # | TT | Nội dung đối chiếu | Khoản, Điều | Tra ở | Nội dung thiết kế | Kết luận và lý do | Khung |\n|---|---|---|---|---|---|---|---|\n")
        for i, r in _rows_idx(rows):
            dieu = r[4] if len(r) > 4 else ""
            f.write("| %d | %s | %s | %s | %s | | | |\n" % (i, short(r[0], 8), short(r[1] if len(r) > 1 else "", 140), short(dieu, 80), tra_o(dieu) if dieu.strip() else ""))
    print("đã ghi", out)


def cmd_dong(code, tt):
    path, head, rows = load(code)
    mr = main_rows(rows)
    sel = None
    if tt.startswith("#"):
        k = int(tt[1:])
        if 0 <= k < len(mr):
            sel = mr[k]
    else:
        for r in mr:
            if r[0].strip() == tt.strip():
                sel = r
                break
    if sel is None:
        print("Không thấy dòng", tt)
        return
    names = ["TT", "Nội dung đối chiếu", "Nội dung thiết kế (gợi ý cần đọc)", "Quy định", "Khoản, Điều", "Kết luận"]
    for i, c in enumerate(sel):
        print("[%s] %s" % (names[i] if i < len(names) else i, c))


def cmd_tim(code, kw):
    path, head, rows = load(code)
    kw = kw.lower()
    for i, r in enumerate(main_rows(rows)):
        if any(kw in c.lower() for c in r):
            print(i, "|", short(r[0], 6), "|", short(r[1] if len(r) > 1 else "", 100), "|", short(r[4] if len(r) > 4 else "", 50))


def cmd_xuat(code, out):
    path, head, rows = load(code)
    with open(out, "w", encoding="utf8") as f:
        f.write("# " + os.path.basename(path) + "\n\n")
        f.write("\n".join(head) + "\n\n")
        for r in main_rows(rows):
            f.write("| " + " | ".join(c.replace("\n", " ") for c in r) + " |\n")
    print("đã ghi", out)


if __name__ == "__main__":
    a = sys.argv[1:]
    if not a:
        print(__doc__)
    elif a[0] == "danhmuc":
        cmd_danhmuc()
    elif a[0] == "khung":
        cmd_khung(a[1])
    elif a[0] == "lamviec":
        cmd_lamviec(a[1], a[2])
    elif a[0] == "dong":
        cmd_dong(a[1], a[2])
    elif a[0] == "tim":
        cmd_tim(a[1], a[2])
    elif a[0] == "xuat":
        cmd_xuat(a[1], a[2])
    else:
        print(__doc__)
