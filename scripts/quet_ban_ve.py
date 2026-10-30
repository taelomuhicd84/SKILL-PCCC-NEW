"""Quét một thư mục hồ sơ đã thẩm duyệt: mỗi thư mục con = một bộ mẫu, chạy the_ban_ve cho từng bộ, rồi dựng lại kho ghi chú.
- Bỏ giấy tờ (giấy chứng nhận, biên bản, công văn, nộp phí, nghiệm thu) theo tên file và trang đầu.
- Bỏ file trùng (cùng kích thước + MD5 2 MB đầu), kể cả trùng với bộ khác trong cùng lần quét.
- File không có lớp chữ (bản scan, chữ vẽ thành nét): ghi vào danh sách can_ocr, không chạy.
- Tên thư mục (bỏ các từ chung như KHÁCH SẠN, NHÀ XƯỞNG) được thêm vào danh sách ẩn danh --an.
Dùng: python -I -X utf8 scripts/quet_ban_ve.py "<thư mục>" <cong_nang> [--tien-to cc]
      python -I -X utf8 scripts/quet_ban_ve.py "<thư mục năm>" --nam n2025   (thư mục con = loại công trình)   (ghi data/ban_ve_mau/_quet_<cong_nang>.json)
Tự kiểm: --tu-kiem
"""
import hashlib
import json
import pathlib
import re
import subprocess
import sys
import time
import unicodedata
import pymupdf as fitz

GOC = pathlib.Path(__file__).parent.parent
GIAY_TO_TEN = re.compile(r"GIẤY|\bGCN\b|CN TD|BIÊN BẢN|\bBBKT|\bBBNT|VBXN|\bCV\b|CÔNG VĂN|NỘP PHÍ|NGHIỆM THU|\bNT\b|NFPA|THÔNG BÁO", re.I)
GIAY_TO_CHU = re.compile(r"GIẤY CHỨNG NHẬN|BIÊN BẢN|Kính gửi|V/v|THÔNG BÁO|VĂN BẢN CHẤP THUẬN|XÁC NHẬN NGHIỆM THU", re.I)
TU_CHUNG = r"^(KHÁCH SẠN|NHÀ XƯỞNG|XƯỞNG|NHÀ Ở|NHÀ TRỌ|CHUNG CƯ|KARAOKE|VĂN PHÒNG|NHÀ HÀNG|THAM KHẢO|CÔNG TY|KS|CC)\s*-?\s*"


def slug(s):
    s = unicodedata.normalize("NFD", s.replace("Đ", "D").replace("đ", "d"))
    s = "".join(c for c in s if unicodedata.category(c) != "Mn").lower()
    return re.sub(r"[^a-z0-9]+", "_", s).strip("_")[:40]


def ten_an(thu_muc):
    """Tên riêng từ tên thư mục: cả tên, tên bỏ từ chung, từng phần tách bởi '-' (>= 4 ký tự)."""
    ds = {thu_muc.strip()}
    for p in re.split(r"\s*-\s*", thu_muc):
        p = re.sub(TU_CHUNG, "", p.strip(), flags=re.I).strip()
        if len(p) >= 4:
            ds.add(p)
    ds.add(re.sub(TU_CHUNG, "", thu_muc.strip(), flags=re.I).strip())
    return sorted((x for x in ds if len(x) >= 4), key=len, reverse=True)


def van_tay(f):
    with open(f, "rb") as fh:
        h = hashlib.md5(fh.read(2_000_000)).hexdigest()
        fh.seek(0, 2)
        return f"{fh.tell()}-{h}"


def xet_file(f):
    """'ban_ve' | 'giay_to' | 'khong_chu' (cần OCR)."""
    if GIAY_TO_TEN.search(f.stem):
        return "giay_to"
    d = fitz.open(f)
    if len(d) <= 6 and GIAY_TO_CHU.search(d[0].get_text()[:3000]):
        return "giay_to"
    mau = [d[i] for i in range(0, len(d), max(1, len(d) // 8))][:8]
    return "ban_ve" if sum(len(p.get_text()) > 300 for p in mau) >= max(1, len(mau) // 3) else "khong_chu"


SO_VT = GOC / "data" / "ban_ve_mau" / "_van_tay.json"  # vân tay file đã học -> id bộ: không chạy lại ở lần quét sau


def quet(thu_muc, cong_nang, tien_to):
    goc = pathlib.Path(thu_muc)
    da_thay = json.loads(SO_VT.read_text(encoding="utf-8")) if SO_VT.exists() else {}
    bao = {"thu_muc": goc.name, "cong_nang": cong_nang, "bo": [], "giay_to": [], "trung": [], "can_ocr": []}
    for du_an in sorted(x for x in goc.iterdir() if x.is_dir()):
        dung = []
        for f in sorted(du_an.rglob("*.pdf")):
            loai = xet_file(f)
            rel = str(f.relative_to(goc))
            if loai == "giay_to":
                bao["giay_to"].append(rel); continue
            vt = van_tay(f)
            if vt in da_thay:
                bao["trung"].append({"file": rel, "trung_voi": da_thay[vt]}); continue
            da_thay[vt] = f"{goc.name}/{rel}"
            if loai == "khong_chu":
                bao["can_ocr"].append(rel); continue
            dung.append(f)
        if not dung:
            continue
        id_ = f"{tien_to}_{slug(du_an.name)}"
        lenh = [sys.executable, "-I", "-X", "utf8", str(GOC / "scripts" / "the_ban_ve.py"), id_, str(GOC / "data" / "ban_ve_mau"), *map(str, dung),
                "--cong-nang", cong_nang, "--khong-hinh-hoc"]
        for t in ten_an(du_an.name):
            lenh += ["--an", t]
        r = subprocess.run(lenh, capture_output=True, text=True, encoding="utf-8")
        bao["bo"].append({"id": id_, "file": [str(f.relative_to(goc)) for f in dung], "loi": r.returncode != 0 and r.stderr[-500:] or None})
        print(id_, len(dung), "file", "LỖI" if r.returncode else "ok", flush=True)
        SO_VT.write_text(json.dumps(da_thay, ensure_ascii=False, indent=0), encoding="utf-8")
    SO_VT.write_text(json.dumps(da_thay, ensure_ascii=False, indent=0), encoding="utf-8")
    return bao


def quet_nam(thu_muc, tien_to):
    """Thư mục năm: mỗi thư mục con '<số>. <LOẠI>' là một loại công trình (cong_nang = slug loại)."""
    out = []
    for loai in sorted(x for x in pathlib.Path(thu_muc).iterdir() if x.is_dir()):
        cn = slug(re.sub(r"^\d+\.\s*", "", loai.name))
        print("==", loai.name, "->", cn, flush=True)
        for lan in range(3):  # ổ Google Drive đôi khi ngắt tạm: thử lại, vẫn lỗi thì bỏ qua loại này
            try:
                b = quet(loai, cn, f"{tien_to}_{cn[:8]}")
                break
            except OSError as e:
                print("  lỗi đọc thư mục, thử lại:", e, flush=True)
                time.sleep(30)
        else:
            out.append({"thu_muc": loai.name, "loi": "không đọc được thư mục"})
            continue
        (GOC / "data" / "ban_ve_mau" / f"_quet_{tien_to}_{cn}.json").write_text(json.dumps(b, ensure_ascii=False, indent=1), encoding="utf-8")
        out.append({k: (len(v) if isinstance(v, list) else v) for k, v in b.items()})
    return out


def tu_kiem():
    assert slug("KHÁCH SẠN HOÀNG GIA") == "khach_san_hoang_gia"
    assert "HOÀNG GIA" in ten_an("KHÁCH SẠN HOÀNG GIA") and "NHÀ TRANG" in ten_an("NHÀ Ở- NHÀ TRANG-TDM")
    assert GIAY_TO_TEN.search("Giấy CN TD Khách sạn") and GIAY_TO_TEN.search("BBKT NGUYỄN") and not GIAY_TO_TEN.search("BV THẨM DUYỆT ĐLMN")
    print("tu_kiem OK")


if __name__ == "__main__":
    a = sys.argv[1:]
    if a[:1] == ["--tu-kiem"]:
        tu_kiem(); sys.exit()
    if a[1:2] == ["--nam"]:  # quet_ban_ve.py "<thư mục năm>" --nam <tiền tố, vd. n2025>
        print(json.dumps(quet_nam(a[0], a[2]), ensure_ascii=False)); sys.exit()
    tt = a[a.index("--tien-to") + 1] if "--tien-to" in a else slug(a[1])[:6]
    bao = quet(a[0], a[1], tt)
    (GOC / "data" / "ban_ve_mau" / f"_quet_{a[1]}.json").write_text(json.dumps(bao, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps({k: (len(v) if isinstance(v, list) else v) for k, v in bao.items()}, ensure_ascii=False))
