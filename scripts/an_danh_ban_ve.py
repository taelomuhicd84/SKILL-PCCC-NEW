"""Ẩn danh lần cuối thư viện thẻ bản vẽ mẫu trước khi đẩy GitHub.
- Đổi id bộ (đang mang tên thư mục dự án) thành mã trung tính <cong_nang>_NN; bảng đối chiếu id cũ -> mới -> thư mục thật ghi ở
  data/ban_ve_mau/_ten_that.local.json (gitignore, chỉ ở máy).
- Thay mọi tên dự án (lấy từ tên thư mục con của các thư mục năm, bỏ từ chung) trong the.json / the.md bằng [TÊN], khớp không phân biệt hoa thường, khoảng trắng.
Dùng: python -I -X utf8 scripts/an_danh_ban_ve.py "<thư mục gốc hồ sơ>"     Tự kiểm: --tu-kiem
"""
import json
import pathlib
import re
import sys

GOC = pathlib.Path(__file__).parent.parent / "data" / "ban_ve_mau"
CHUNG = r"^(KHÁCH SẠN|NHÀ XƯỞNG|XƯỞNG|NHÀ KHO|NHÀ Ở XÃ HỘI|NHÀ Ở|NHÀ TRỌ|CHUNG CƯ|KARAOKE|VĂN PHÒNG|NHÀ HÀNG|THAM KHẢO|CÔNG TY|MẦM NON|TRƯỜNG|PHÒNG KHÁM|CÂY XĂNG|CĂN HỘ DỊCH VỤ|VP|MN|KS|CHO THUÊ|LÒ HƠI|CTY)\s*"
KHONG_AN = {"TRANG", "NGHIỆM THU", "CƠ KHÍ", "BÌNH DƯƠNG", "ĐIỀU CHỈNH", "THẨM DUYỆT", "BẢN VẼ", "HỒ SƠ", "MỚI NHẤT",
            "NHÀ KHO", "NHÀ Ở", "NHÀ XƯỞNG A", "NHÀ XƯỞNG C", "NHÀ XƯỞNG CƠ KHÍ", "PHÒNG MÁY NÉN KHÍ", "KỆ CAO TẦNG", "CẢI TẠO VP 8 TẦNG", "2022 THAM DINH", "MÁY NÉN KHÍ"}


def ten_du_an(goc):
    """Tên riêng từ thư mục dự án (cấp 2 dưới thư mục năm), mỗi tên kèm biến thể bỏ từ chung, tách theo '-' ','."""
    ten = set()
    for nam in pathlib.Path(goc).iterdir():
        if not nam.is_dir():
            continue
        for loai in nam.iterdir():
            for d in (loai.iterdir() if loai.is_dir() else []):
                if not d.is_dir():
                    continue
                for p in [d.name] + re.split(r"\s*[-,]\s*", d.name):
                    for q in (p.strip(), re.sub(CHUNG, "", p.strip(), flags=re.I).strip()):
                        q = re.sub(r"\s+", " ", q)
                        if len(q) >= 4 and not re.fullmatch(r"[\d .]+", q) and q.upper() not in KHONG_AN:
                            ten.add(q)
    return sorted(ten, key=len, reverse=True)


def mau_thay(ten):
    return re.compile("|".join(r"(?<!\w)" + r"\s*".join(map(re.escape, t.split())) + r"(?!\w)" for t in ten), re.I)


def an_danh(goc_ho_so):
    rx = mau_thay(ten_du_an(goc_ho_so))
    so_local = GOC / "_ten_that.local.json"
    cu = json.loads(so_local.read_text(encoding="utf-8")) if so_local.exists() else {}
    da_dung = {v["id_moi"] for v in cu.values()}
    dem = {}
    for d in sorted(x for x in GOC.iterdir() if x.is_dir() and (x / "the.json").exists()):
        th = json.loads((d / "the.json").read_text(encoding="utf-8"))
        cn = th.get("cong_nang") or "khac"
        if d.name in da_dung:  # đã ẩn danh ở lần trước
            moi = d.name
        else:
            dem[cn] = dem.get(cn, sum(1 for v in da_dung if v.startswith(cn + "_")))
            dem[cn] += 1
            moi = f"{cn}_{dem[cn]:02d}"
            while (GOC / moi).exists():
                dem[cn] += 1
                moi = f"{cn}_{dem[cn]:02d}"
            cu[d.name] = {"id_moi": moi}
        # tên file gốc (có số hồ sơ, tên dự án) -> tep_<thứ tự>, giữ thứ tự để biết lần thẩm định trước/sau
        tep = {f: f"tep_{i}.pdf" for i, f in enumerate(dict.fromkeys(t["file"] for t in th["trang"]), 1) if not re.fullmatch(r"tep_\d+\.pdf", f)}
        cu.setdefault(d.name, cu.get(d.name, {})).setdefault("tep", {}).update({v: k for k, v in tep.items()})
        for f in ("the.json", "the.md"):
            s = (d / f).read_text(encoding="utf-8")
            for k, v in sorted(tep.items(), key=lambda x: -len(x[0])):
                s = s.replace(json.dumps(k, ensure_ascii=False)[1:-1], v).replace(k, v)
            s = rx.sub("[TÊN]", s).replace(f'"id": "{d.name}"', f'"id": "{moi}"').replace(f"Thẻ bản vẽ mẫu: {d.name}", f"Thẻ bản vẽ mẫu: {moi}")
            (d / f).write_text(s, encoding="utf-8")
        if moi != d.name:
            d.rename(GOC / moi)
            print(d.name, "->", moi)
    so_local.write_text(json.dumps(cu, ensure_ascii=False, indent=1), encoding="utf-8")
    # sổ vân tay trỏ id cũ -> id mới
    vt = GOC / "_van_tay.json"
    if vt.exists():
        m = json.loads(vt.read_text(encoding="utf-8"))
        vt.write_text(json.dumps({k: cu.get(v, {}).get("id_moi", v) for k, v in m.items()}, ensure_ascii=False, indent=0), encoding="utf-8")


def tu_kiem():
    rx = mau_thay(["LIÊN MINH", "THE SUN"])
    assert rx.sub("[TÊN]", "Xưởng LIÊN  MINH và VP The Sun, liên minh") == "Xưởng [TÊN] và VP [TÊN], [TÊN]"
    assert rx.sub("[TÊN]", "THE SUNNY") == "THE SUNNY"
    print("tu_kiem OK")


if __name__ == "__main__":
    if sys.argv[1:2] == ["--tu-kiem"]:
        tu_kiem(); sys.exit()
    an_danh(sys.argv[1])
