"""Chuyển bảng đối chiếu chính thức (.docx) thành dữ liệu cho website.

Ghi ra (đều được commit, vì GitHub Actions không đọc được ổ D:):
  data/bang/index.json        danh sách bảng: mã, tên, số dòng
  data/bang/<MA>.json         đầu bảng + các dòng của bảng nội dung đối chiếu
  data/mau/<MA>.docx          bản mẫu gốc, để web điền kết luận vào đúng khung
Dùng lại load(), main_rows(), tra_o() của scripts/bang_doi_chieu_tool.py nên chỉ số dòng (idx) trùng cột # của lệnh `khung`.

Chạy: python -X utf8 data-build/build_data.py ["<thư mục bảng>"]
Bảng .doc phải chuyển trước bằng data-build/convert_doc.ps1 (ghi vào data-build/doc_converted/).
"""
import glob, json, os, re, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "scripts"))
import bang_doi_chieu_tool as bt  # noqa: E402

SRC = sys.argv[1] if len(sys.argv) > 1 else bt.BANG_DIR
CONVERTED = os.path.join(ROOT, "data-build", "doc_converted")
OUT = os.path.join(ROOT, "data")


def code_of(name):
    m = re.match(r"\s*(b\s*\.?\s*\d+(?:\.\d+)?)", name.lower())
    return m and m.group(1).replace(" ", "").replace("b.", "b").upper()


def title_of(name):
    t = re.sub(r"^\s*B\s*\.?\s*\d+(?:\.\d+)?\s*\.?\s*", "", os.path.splitext(name)[0])
    return re.sub(r"\s+", " ", t).strip()


def clean(s):
    return re.sub(r"[ \t]+", " ", s).strip()


def build_one(path):
    bt.find_file = lambda code, _p=path: _p  # load() đọc đúng file này
    _, head, rows = bt.load("")
    out = []
    for i, r in enumerate(bt.main_rows(rows)):
        r = r + [""] * (6 - len(r))
        dieu = clean(r[4])
        out.append({
            "idx": i, "tt": clean(r[0]), "noi_dung": clean(r[1]), "goi_y": clean(r[2]),
            "quy_dinh": clean(r[3]), "khoan_dieu": dieu, "ket_luan_mau": clean(r[5]),
            "tra_o": bt.tra_o(dieu) if dieu else "", "so_o": len([c for c in r if c is not None]),
        })
    return head, out


def main():
    files = [f for f in glob.glob(os.path.join(SRC, "*.docx")) if not os.path.basename(f).startswith("~$")]
    files += glob.glob(os.path.join(CONVERTED, "*.docx"))
    os.makedirs(os.path.join(OUT, "bang"), exist_ok=True)
    os.makedirs(os.path.join(OUT, "mau"), exist_ok=True)
    index = []
    for f in sorted(files, key=lambda p: os.path.basename(p)):
        name = os.path.basename(f)
        code = code_of(name)
        if not code:
            print("bỏ qua (không có mã):", name)
            continue
        try:
            head, rows = build_one(f)
        except Exception as e:  # file hỏng hoặc không phải bảng
            print("lỗi", name, e)
            continue
        item = {"ma": code, "ten": title_of(name), "file_goc": name, "so_dong": len(rows),
                "nguon": "doc_converted" if f.startswith(CONVERTED) else "docx"}
        with open(os.path.join(OUT, "bang", code + ".json"), "w", encoding="utf8") as fh:
            json.dump({**item, "dau_bang": head, "dong": rows}, fh, ensure_ascii=False, indent=0)
        shutil.copyfile(f, os.path.join(OUT, "mau", code + ".docx"))
        index.append(item)
        print("%-6s %4d dòng  %s" % (code, len(rows), name))
    with open(os.path.join(OUT, "bang", "index.json"), "w", encoding="utf8") as fh:
        json.dump(index, fh, ensure_ascii=False, indent=1)
    print("tổng", len(index), "bảng ->", OUT)


if __name__ == "__main__":
    main()
