"""Gỡ TCVN 3890 và TCVN 5687:2010 khỏi các bảng đối chiếu (đã bị QCVN 10:2025/BCA thay thế, người dùng chốt không dùng nữa).
- dau_bang: bỏ dòng liệt kê TCVN 3890 và TCVN 5687:2010.
- TCVN 5687:2010 (đã bị TCVN 5687:2024 thay): "Đ x.y TCVN 5687:2010" đổi thành "TCVN 5687:2024 (tra điều tương ứng)".
- Mọi ô chữ của dòng: câu "Điều/mục/bảng X của TCVN 3890:YYYY" đổi thành "QCVN 10:2025/BCA (tra điều tương ứng)" (số điều của 3890 không khớp QCVN 10 nên không giữ).
Chạy lại sau data-build/build_data.py và build_kien_truc.py: python -X utf8 data-build/bo_tcvn3890.py"""
import glob, json, os, re

BANG = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "bang")
THAY = "QCVN 10:2025/BCA (tra điều tương ứng)"
VT = r"(?:theo quy định tại |quy định tại |tại )?(?:mục|Mục|bảng|Bảng|Điều|điều|Phụ lục|khoản|Khoản)\s+[\w.]+(?:\s*(?:,|và)\s*[\w.]+)*\s*/?\s*(?:của\s+)?"
RE = re.compile(r"(?:" + VT + r")?TCVN\s*3890(?:\s*:\s*\d{4})?")


RE5687 = re.compile(r"(?:(?:Đ|Điều|điều|mục|Mục)\s*[\d.]+\s*/?\s*)?TCVN\s*5687\s*:\s*2010(?:\s*\(đã thay bằng TCVN 5687:2024:[^)]*\))?")
THAY5687 = "TCVN 5687:2024 (tra điều tương ứng)"


def sua(s: str) -> str:
    s = RE5687.sub(THAY5687, RE.sub(THAY, s))
    return re.sub(r"(" + re.escape(THAY) + r")(?:\s*/\s*" + re.escape(THAY) + r")+", r"\1", s)  # "X / X" -> "X"


tong = 0
for f in sorted(glob.glob(os.path.join(BANG, "*.json"))):
    if f.endswith("index.json"):
        continue
    b = json.load(open(f, encoding="utf8"))
    doi = False
    dau = [x for x in b["dau_bang"] if "3890" not in x and "5687:2010" not in x]
    if len(dau) != len(b["dau_bang"]):
        b["dau_bang"], doi = dau, True
    for d in b["dong"]:
        for k, v in d.items():
            if isinstance(v, str) and ("3890" in v or "5687:2010" in v):
                d[k], doi, tong = sua(v), True, tong + 1
    if doi:
        json.dump(b, open(f, "w", encoding="utf8"), ensure_ascii=False, indent=0)
print("đã sửa", tong, "ô")
