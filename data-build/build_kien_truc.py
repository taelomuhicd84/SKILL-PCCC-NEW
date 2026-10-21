"""Dựng bảng đối chiếu KIẾN TRÚC (KT<mã cũ>) từ bộ bảng cũ B4–B33 (commit ac9e8f1^).

Cơ sở: NĐ 105/2025 Điều 6 khoản 2 (cơ quan xây dựng thẩm định): khoảng cách, đường/bãi đỗ xe chữa cháy,
thoát nạn + thang máy chữa cháy, bậc chịu lửa + ngăn cháy + công năng, chống khói. Phần hệ thống PCCC của bảng cũ đã cũ nên bỏ
(hệ thống PCCC nay dùng A1–A26, B1–B14). Mục 1 (phân loại) đã có ở bảng A nên không lấy lại.
Ghi data/bang/KT*.json và thêm vào data/bang/index.json. Chạy: python -X utf8 data-build/build_kien_truc.py
"""
import json, os, re, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANG = os.path.join(ROOT, "data", "bang")
COMMIT = "ac9e8f1^"
KIEN_TRUC = re.compile(r"bậc chịu lửa|khoảng cách an toàn|đường giao thông|bố trí công năng|ngăn cháy|chống cháy lan|thoát nạn|thang máy|tụ khói|chống khói", re.I)
HE_THONG = re.compile(r"chiếu sáng sự cố|loa thông báo|phá dỡ|báo cháy|chữa cháy bằng|bình chữa cháy", re.I)


def git(*a):
    return subprocess.run(["git", *a], cwd=ROOT, capture_output=True, check=True).stdout.decode("utf8")


def phan_kien_truc(dong):
    """Giữ các mục lớn (TT số nguyên) thuộc kiến trúc cùng các dòng con của chúng."""
    out, trong = [], False
    for d in dong:
        tt, nd = d["tt"].strip(), d["noi_dung"].strip()
        if re.fullmatch(r"\d+", nd) and not tt:  # dòng đánh số cột "1 | 2 | 3"
            continue
        if re.fullmatch(r"\d+", tt):
            trong = bool(KIEN_TRUC.search(nd)) and not HE_THONG.search(nd)
        if trong:
            out.append(d)
    return out


def main():
    files = [f.split("/")[-1] for f in git("ls-tree", "--name-only", COMMIT, "data/bang/").split()]
    index = json.load(open(os.path.join(BANG, "index.json"), encoding="utf8"))
    index = [i for i in index if not i["ma"].startswith("KT")]
    for f in sorted(files):
        m = re.fullmatch(r"B(\d+(?:\.\d+)?)\.json", f)
        if not m or int(m.group(1).split(".")[0]) < 4:  # B1–B3 (quy hoạch, địa điểm, hạ tầng) không phải bảng công năng
            continue
        b = json.loads(git("show", f"{COMMIT}:data/bang/{f}"))
        dong = phan_kien_truc(b["dong"])
        for d in dong:  # TCVN 5687:2010 đã bị TCVN 5687:2024 thay thế
            for k in ("khoan_dieu", "quy_dinh"):
                d[k] = d[k].replace("TCVN 5687:2010", "TCVN 5687:2010 (đã thay bằng TCVN 5687:2024: tra điều tương ứng trong knowledge)")
        if not dong:
            continue
        ma = "KT" + m.group(1)
        ten = "Kiến trúc – " + re.sub(r"^Bảng đối chiếu\s*", "", b["ten"])
        item = {"ma": ma, "ten": ten, "file_goc": b["file_goc"], "so_dong": len(dong), "nguon": "kien_truc"}
        json.dump({**item, "dau_bang": b["dau_bang"], "dong": dong}, open(os.path.join(BANG, ma + ".json"), "w", encoding="utf8"), ensure_ascii=False, indent=0)
        index.append(item)
        print("%-7s %3d dòng  %s | mục: %s" % (ma, len(dong), ten[:45], " ".join(d["tt"] for d in dong if re.fullmatch(r"\d+", d["tt"].strip()))))
    json.dump(index, open(os.path.join(BANG, "index.json"), "w", encoding="utf8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
