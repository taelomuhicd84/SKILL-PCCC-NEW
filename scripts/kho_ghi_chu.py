"""Kho ghi chú từ mọi thẻ bản vẽ mẫu (data/ban_ve_mau/*/the.json): gộp trùng, bỏ ghi chú chỉ dựa văn bản hết hiệu lực,
phân loại hai chiều: chủ đề PCCC (thoát nạn, ngăn cháy…) x hạng mục công trình (công trình chính, nhà ở nhân viên, phòng bơm…),
và loại câu: lap_luan (điều kiện => kết luận), tinh_toan (có phép tính/trị số), yeu_cau (cấu tạo, vật liệu, ghi chú kỹ thuật).
Bộ có nhiều lần thẩm định (lần 1, lần 2): trang cùng mã ở file sau thay trang ở file trước.
Ra: data/ban_ve_mau/kho_ghi_chu.json (+ .md đọc nhanh). Không tốn token: chạy lại mỗi khi thêm thẻ.
Dùng: python -I -X utf8 scripts/kho_ghi_chu.py        Tự kiểm: --tu-kiem
"""
import json
import pathlib
import re
import sys
import unicodedata

GOC = pathlib.Path(__file__).parent.parent / "data" / "ban_ve_mau"

# Văn bản hết hiệu lực / bị thay (knowledge/thuat-ngu-chuan.md mục 4). Ghi chú CHỈ dựa vào các văn bản này thì bỏ.
CU = {
    r"QCVN 06:20(10|20|21)": "QCVN 06 bản cũ, thay bằng QCVN 06:2022/BXD + SĐ1:2023",
    r"NĐ 136/2020|NĐ 50/2024": "nghị định cũ, thay bằng NĐ 105/2025 (sửa bởi NĐ 347/2026)",
    r"TCVN 2622:1995": "thay bằng QCVN 06:2022 và QCVN 10:2025",
    r"TCVN 3890:20(09|23)": "tiêu chuẩn trang bị cũ, thay bằng QCVN 10:2025/BCA",
    r"TCVN 7336:2003": "thay bằng TCVN 7336:2021",
    r"TCVN 5738:2001": "thay bằng TCVN 5738:2021",
    r"TCVN 7568-14:2015": "thay bằng TCVN 7568-14:2025",
    r"TCVN 5687:2010": "thay bằng TCVN 5687:2024",
    r"TCVN 3254:1989": "thay bằng QCVN 06:2022",
}

CHU_DE = [  # (mã, tên, regex trên câu ghi chú); một câu có thể thuộc nhiều chủ đề
    ("phan_loai", "Phân loại, bậc chịu lửa", r"nhóm nhà|nhóm F|\bF\d\.\d|bậc chịu lửa|chiều cao PCCC|khối tích|cấp nguy hiểm cháy|\bS0\b|hạng nguy hiểm|diện tích (xây dựng|sàn|khoang)|thẩm (định|duyệt)"),
    ("khoang_cach", "Khoảng cách an toàn PCCC", r"khoảng cách|ranh giới|lỗ mở không được bảo vệ|bảng E\d|cách .{0,30}\d+(\.\d+)?\s*m\s*[<>]"),
    ("giao_thong", "Giao thông, bãi đỗ, lối vào trên cao", r"xe chữa cháy|bãi đỗ|bãi quay|đường giao thông|lối vào từ trên cao|ô cửa cứu nạn|cửa sổ cứu nạn|tải trọng"),
    ("cong_nang", "Bố trí công năng", r"phòng hát|công năng|bố trí .{0,20}(phòng|kho|bếp)|không chứa xe|để xe|phòng kỹ thuật|kho\b"),
    ("ngan_chay", "Ngăn cháy, chống cháy lan", r"ngăn cháy|chống cháy lan|\bR?EI\s?\d{2,3}\b|GHCL|giới hạn chịu lửa|khoang cháy|tường .{0,15}(gạch|bê tông).{0,30}(cao tới|mái)|chèn bịt|xuyên qua"),
    ("thoat_nan", "Lối ra, đường thoát nạn", r"thoát nạn|lối ra|thoát hiểm|cầu thang|buồng thang|\bthang\b|hành lang|chiều mở|mở theo|chiếu nghỉ|bậc thang|thông thủy|độ rộng|bề rộng .{0,15}(cửa|vế|lối)"),
    ("vat_lieu", "Vật liệu hoàn thiện", r"vật liệu|\bCh\d\b|\bV\d\b|\bLV\d\b|\bCV\d\b|cháy lan bề mặt|trần thạch cao|ốp|hoàn thiện"),
    ("chong_khoi", "Chống tụ khói, thông gió", r"khói|thông gió|louver|bù khí|tăng áp|cửa sổ mở|lỗ mở thoát"),
    ("bao_chay", "Báo cháy", r"báo cháy|đầu báo|tủ trung tâm|\bzone\b|nút ấn|nút nhấn|chuông"),
    ("chua_chay", "Chữa cháy nước (sprinkler, họng, ngoài nhà, bơm)", r"sprinkler|đầu phun|họng|cuộn vòi|lăng|bơm|bể nước|trụ (nước|PCCC|chữa cháy)|lưu lượng|\bDN\s?\d+|van (cổng|giảm áp|báo động)"),
    ("binh_cnch", "Bình chữa cháy, phá dỡ, mặt nạ", r"bình chữa cháy|bình bột|bình khí|\bMFZ|\bMT\d|mặt nạ|phá dỡ"),
    ("den_loa", "Đèn sự cố, EXIT, loa", r"\bEXIT\b|đèn sự cố|chiếu sáng sự cố|chỉ dẫn thoát nạn|\bloa\b|âm thanh|\bEM\b"),
    ("dien", "Cấp điện PCCC", r"cáp chống cháy|cáp chịu lửa|nguồn (điện|dự phòng|ưu tiên)|máy phát|\bATS\b|\bCXV|cấp điện|ắc quy|tủ điện"),
    ("chong_set", "Chống sét", r"chống sét|tiếp địa|kim thu|điện trở"),
    ("quang_cao", "Biển quảng cáo", r"quảng cáo"),
]
AGENT_CD = {"phan_loai": "m01/m02", "khoang_cach": "m03", "giao_thong": "m04", "cong_nang": "m05", "ngan_chay": "m06", "thoat_nan": "m07",
            "vat_lieu": "m06/m07", "chong_khoi": "m09", "bao_chay": "m11", "chua_chay": "m12", "binh_cnch": "m10/m15", "den_loa": "m14",
            "dien": "m13", "chong_set": "m16", "quang_cao": "m18", "khac": "chung"}
CD_TU_AGENT = {"m01": "phan_loai", "m02": "phan_loai", "m03": "khoang_cach", "m04": "giao_thong", "m05": "cong_nang", "m06": "ngan_chay",
               "m07": "thoat_nan", "m08": "thoat_nan", "m09": "chong_khoi", "m10": "binh_cnch", "m11": "bao_chay", "m12": "chua_chay",
               "m13": "dien", "m14": "den_loa", "m15": "binh_cnch", "m16": "chong_set", "m17": "dien", "m18": "quang_cao"}

HANG_MUC = [  # hạng mục công trình theo tên bản vẽ + phần
    ("nha_o_nhan_vien", r"NHÀ Ở|NHÂN VIÊN|KÝ TÚC"),
    ("phong_bom_be_nuoc", r"PHÒNG BƠM|TRẠM BƠM|BỂ NƯỚC"),
    ("phong_truc", r"PHÒNG TRỰC"),
    ("mai_che_nha_xe", r"MÁI CHE|NHÀ XE|ĐỂ XE|CARPARK|PARKING"),
    ("nha_bao_ve", r"BẢO VỆ|GUARD"),
    ("nha_an_nghi", r"NHÀ ĂN|CANTEEN|NHÀ NGHỈ"),
    ("tram_dien_may_phat", r"TRẠM (ĐIỆN|BIẾN ÁP)|MÁY PHÁT|BIẾN ÁP|GENERATOR"),
    ("xu_ly_nuoc_thai", r"NƯỚC THẢI|WWTP"),
    ("van_phong", r"VĂN PHÒNG|NHÀ ĐIỀU HÀNH|OFFICE"),
    ("kho", r"\bKHO\b|WAREHOUSE"),
    ("nha_xuong", r"NHÀ XƯỞNG|\bXƯỞNG\b|WORKSHOP|FACTORY"),
    ("tong_the", r"TỔNG THỂ|ĐỊNH VỊ|GIAO THÔNG|KHOẢNG CÁCH|VỊ TRÍ KHU ĐẤT"),
]
LAP_LUAN = re.compile(r"=>|⇒|kết luận|không yêu cầu|không phải|không cần|do đó|vì vậy|nên\b|đảm bảo|đạt\b|thỏa mãn|áp dụng|theo (điều|mục|bảng)", re.I)
TINH = re.compile(r"\d\s*[x×*/+]\s*\d|=\s*\d|\d\s*(m2|m3|l/s|m3/h|mpa|kg/cm2|pa)\b", re.I)


def khong_dau(s):
    s = unicodedata.normalize("NFD", s.replace("Đ", "D").replace("đ", "d"))
    return "".join(c for c in s if unicodedata.category(c) != "Mn")


_CD_KD = None


def ocr_kem(chu):
    """Lớp chữ OCR sẵn trong PDF scan: nhiều từ lẫn ký hiệu/số giữa chữ ("n9n", "dU'Q'C", "~")."""
    w = chu.split()
    xau = sum(bool(re.search(r"[~{}|\\^`@$]|[a-zA-Z]\d[a-zA-Z]|[a-zA-Z]'[A-Z]|\d[a-z]{2}", x)) for x in w)
    return len(w) >= 4 and xau / len(w) > 0.12


def chu_de(chu, agent_trang):
    """Tối đa 3 chủ đề, xếp theo số lần khớp; hoà thì ưu tiên chủ đề của trang (agent), rồi thứ tự CHU_DE."""
    cua_trang = [CD_TU_AGENT.get(a[:3], "khac") for a in agent_trang]
    chu = re.sub(r"(chỉ dẫn|chiếu sáng|đèn|biển)[^.;]{0,25}thoát nạn", "đèn sự cố", chu, flags=re.I)  # "chỉ dẫn thoát nạn" là đèn/biển, không phải lối thoát
    global _CD_KD
    if _CD_KD is None:  # so trên chữ bỏ dấu: bắt được cả chữ không dấu / OCR mất dấu
        _CD_KD = [(m, re.compile(khong_dau(r), re.I)) for m, _, r in CHU_DE]
    if re.search(r"[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]", chu, re.I):
        diem = [(len(re.findall(r, chu, re.I)), m in cua_trang, -i, m) for i, (m, _, r) in enumerate(CHU_DE)]
    else:  # câu không dấu (OCR mất dấu, ghi chú gõ không dấu)
        diem = [(len(r.findall(chu)), m in cua_trang, -i, m) for i, (m, r) in enumerate(_CD_KD)]
    cd = [m for n, _, _, m in sorted(diem, reverse=True) if n][:3]
    return cd or list(dict.fromkeys(cua_trang)) or ["khac"]


# Văn bản còn hiệu lực hoặc cơ quan PCCC còn viện dẫn (knowledge/thuat-ngu-chuan.md mục 4); ngoài danh sách + ngoài CU thì cảnh báo kiểm hiệu lực
HIEN_HANH = r"QCVN 06:2022|QCVN 10:2025|QCVN 17:2018|QCVN 02:2020|QCVN 12:2014|QCVN 13:2018|TCVN 13456:2022|TCVN 7568-14:2025|TCVN 5738:2021|TCVN 7336:2021|TCVN 5687:2024|TCVN 7435-[12]:2004|TCVN 4513:1988|TCVN 7161.*|TCVN 14496:2025|TCVN 13967:2024|TCVN 9206:2012|TCVN 9385:2012|NĐ 105/2025|NĐ 347/2026|TT 36/2025"


def canh_bao(trich):
    out = []
    for t in trich:
        v = t["van_ban"]
        ly = next((x for k, x in CU.items() if re.fullmatch(k, v)), None)
        if ly:
            out.append(f"{v}: hết hiệu lực, {ly}")
        elif not re.fullmatch(HIEN_HANH, v):
            out.append(f"{v}: cần kiểm hiệu lực")
    return sorted(set(out))


def hang_muc(ten, phan):
    s = f"{ten or ''} {phan or ''}"
    return next((m for m, r in HANG_MUC if re.search(r, s, re.I)), "cong_trinh_chinh")


def loai_cau(chu):
    return "lap_luan" if LAP_LUAN.search(chu) else "tinh_toan" if TINH.search(chu) else "yeu_cau"


def cu(trich):
    """Lý do bỏ nếu MỌI văn bản trích đều hết hiệu lực; None nếu giữ (không trích hoặc có văn bản hiện hành)."""
    if not trich:
        return None
    ly = [next((v for k, v in CU.items() if re.fullmatch(k, t["van_ban"])), None) for t in trich]
    return "; ".join(sorted(set(ly))) if all(ly) else None


def chuan(chu):
    c = re.sub(r"(?<!\d)\.|\.(?!\d)", " ", chu.lower())  # giữ dấu chấm thập phân, bỏ chấm câu
    return re.sub(r"\s+", " ", re.sub(r"[^\w\s./=<>%-]", " ", c)).strip()


def giong(a, b):
    """Jaccard từ >= 0.85 và cùng các con số: coi là cùng một ghi chú (khác số = khác nội dung, giữ cả hai)."""
    if re.findall(r"\d+(?:[.,]\d+)?", a) != re.findall(r"\d+(?:[.,]\d+)?", b):
        return False
    x, y = set(a.split()), set(b.split())
    return len(x & y) / max(1, len(x | y)) >= 0.85


def khoa(t):
    if t.get("ma"):
        return t["ma"]
    return re.sub(r"\s+", " ", re.sub(r"ĐIỀU CHỈNH|\(.*?\)", " ", t["ten"])).strip() if t.get("ten") else None


def lap_kho(goc=GOC):
    muc, bo = [], []
    for f in sorted(goc.glob("*/the.json")):
        th = json.loads(f.read_text(encoding="utf-8"))
        files = list(dict.fromkeys(t["file"] for t in th["trang"]))
        moi_nhat = {}  # mã (hoặc tên bỏ chữ "ĐIỀU CHỈNH") -> file sau cùng có trang đó
        for t in th["trang"]:
            if khoa(t):
                moi_nhat[khoa(t)] = max(moi_nhat.get(khoa(t), 0), files.index(t["file"]))
        for t in th["trang"]:
            if khoa(t) and files.index(t["file"]) < moi_nhat[khoa(t)]:
                continue  # trang đã được bản thẩm định lần sau thay
            for g in t.get("ghi_chu", []):
                if len(g["chu"]) < 15:
                    continue
                nguon = {"mau": th["id"], "cong_nang": th.get("cong_nang"), "file": t["file"], "trang": t["trang"], "ma": t.get("ma"), "ten": t.get("ten")}
                ly = cu(g["trich_dan"])
                if ly:
                    if not any(chuan(b["chu"]) == chuan(g["chu"]) for b in bo):
                        bo.append({"chu": g["chu"], "ly_do": ly, "nguon": nguon})
                    continue
                muc.append({"chu": g["chu"], "trich_dan": g["trich_dan"], "chu_de": chu_de(g["chu"], t.get("agent", [])),
                            "hang_muc_ct": hang_muc(t.get("ten"), t.get("phan")), "cong_nang": [th.get("cong_nang") or "khac"], "loai": loai_cau(g["chu"]), "ocr_kem": ocr_kem(g["chu"]),
                            "canh_bao": canh_bao(g["trich_dan"]), "nguon": [nguon]})
    # gộp trùng: cùng chữ chuẩn hoá, hoặc gần giống (cùng 4 từ đầu, Jaccard >= 0.85, cùng số)
    gop, theo_dau = [], {}
    for m in muc:
        c = chuan(m["chu"])
        dau = " ".join(c.split()[:4])
        cu_ = next((x for x in theo_dau.get(dau, []) if x["_c"] == c or giong(x["_c"], c)), None)
        if cu_:
            if not any(n["mau"] == m["nguon"][0]["mau"] and n["trang"] == m["nguon"][0]["trang"] for n in cu_["nguon"]):
                cu_["nguon"] += m["nguon"]
            cu_["chu_de"] = list(dict.fromkeys(cu_["chu_de"] + m["chu_de"]))
            cu_["cong_nang"] = sorted(set(cu_["cong_nang"]) | set(m["cong_nang"]))
            continue
        m["_c"] = c
        theo_dau.setdefault(dau, []).append(m)
        gop.append(m)
    for m in gop:
        del m["_c"]
        m["so_mau"] = len({n["mau"] for n in m["nguon"]})  # xuất hiện ở nhiều bộ = cách làm phổ biến được chấp thuận
    gop.sort(key=lambda m: (-m["so_mau"], m["chu_de"][0], m["loai"] != "lap_luan"))
    return {"cap_nhat": None, "mau": sorted({n["mau"] for m in gop for n in m["nguon"]}),
            "chu_de": {m: {"ten": t, "agent": AGENT_CD[m]} for m, t, _ in CHU_DE} | {"khac": {"ten": "Khác", "agent": "chung"}},
            "hang_muc_ct": [m for m, _ in HANG_MUC] + ["cong_trinh_chinh"],
            "luu_y": "Tham khảo cách ghi chú/lập luận của hồ sơ đã thẩm duyệt, không phải căn cứ. Số liệu thuộc công trình mẫu. so_mau = số bộ hồ sơ có ghi chú này.",
            "so_ghi_chu": len(gop), "so_bo_vi_tieu_chuan_cu": len(bo), "ghi_chu": gop, "da_bo": bo}


def md(k):
    L = [f"# Kho ghi chú bản vẽ mẫu ({', '.join(k['mau'])})", "", k["luu_y"], "",
         f"{k['so_ghi_chu']} ghi chú sau gộp trùng; {k['so_bo_vi_tieu_chuan_cu']} ghi chú bỏ vì chỉ dựa văn bản hết hiệu lực.", ""]
    for cd, v in k["chu_de"].items():
        ds = [m for m in k["ghi_chu"] if m["chu_de"][0] == cd]
        if not ds:
            continue
        L += [f"## {v['ten']} [{cd}] ({v['agent']})", ""]
        for hm in k["hang_muc_ct"]:
            d2 = [m for m in ds if m["hang_muc_ct"] == hm]
            if not d2:
                continue
            L.append(f"### {hm}")
            for m in d2:
                ng = ", ".join(f"{n['mau']} tr{n['trang']}{' ' + n['ma'] if n['ma'] else ''}" for n in m["nguon"][:4])
                cb = (f" ⚠ {'; '.join(m['canh_bao'])}" if m["canh_bao"] else "") + (" [OCR kém]" if m.get("ocr_kem") else "")
                L.append(f"- ({m['loai']}, {m['so_mau']} mẫu, {'/'.join(m['cong_nang'])}) {m['chu']} — {ng}{cb}")
            L.append("")
    return "\n".join(L)


def tu_kiem():
    assert cu([{"van_ban": "TCVN 2622:1995", "dieu": None}]) and not cu([{"van_ban": "TCVN 2622:1995"}, {"van_ban": "QCVN 06:2022"}]) and not cu([])
    assert chu_de("Cửa thoát nạn EI60 mở theo chiều thoát, hành lang thoát nạn", []) == ["thoat_nan", "ngan_chay"], chu_de("Cửa thoát nạn EI60 mở theo chiều thoát, hành lang thoát nạn", [])
    assert canh_bao([{"van_ban": "TCVN 3890:2023"}, {"van_ban": "QCVN 06:2022"}, {"van_ban": "TT 147/2020"}]) == ["TCVN 3890:2023: hết hiệu lực, tiêu chuẩn trang bị cũ, thay bằng QCVN 10:2025/BCA", "TT 147/2020: cần kiểm hiệu lực"]
    assert chu_de("abc", ["m11-bao-chay"]) == ["bao_chay"]
    assert chu_de("Phương tiện chiếu sáng sự cố và chỉ dẫn thoát nạn", [])[0] == "den_loa"
    assert hang_muc("MẶT BẰNG KHO A", None) == "kho" and hang_muc("NHÀ BẢO VỆ", None) == "nha_bao_ve" and hang_muc("MẶT BẰNG XƯỞNG", None) == "nha_xuong"
    assert hang_muc("MẶT BẰNG TẦNG 1 NHÀ Ở NHÂN VIÊN", None) == "nha_o_nhan_vien" and hang_muc("MẶT BẰNG TẦNG 1", "KIẾN TRÚC") == "cong_trinh_chinh"
    assert loai_cau("=> Không yêu cầu bãi đỗ xe") == "lap_luan" and loai_cau("Q = 10 l/s") == "tinh_toan"
    assert giong(chuan("Tường gạch 200mm có GHCL REI150"), chuan("Tường gạch 200mm có GHCL REI150.")) and not giong(chuan("REI150 tường 200"), chuan("REI60 tường 200"))
    assert khoa({"ten": "MẶT BẰNG ĐIỀU CHỈNH TẦNG 1"}) == khoa({"ten": "MẶT BẰNG TẦNG 1"}) == "MẶT BẰNG TẦNG 1"
    assert chu_de("Khong yeu cau ngan chay theo phuong dung", [])[0] == "ngan_chay" and chu_de("lu luong chua chay sprinkler", [])[0] == "chua_chay"
    assert ocr_kem("cau t9i bang B.8 va dU'Q'C lap d~t trong trGim") and not ocr_kem("Tường gạch 200mm có GHCL REI150 cao tới mái")
    print("tu_kiem OK")


if __name__ == "__main__":
    if sys.argv[1:2] == ["--tu-kiem"]:
        tu_kiem(); sys.exit()
    import datetime
    k = lap_kho()
    k["cap_nhat"] = datetime.date.today().isoformat()
    (GOC / "kho_ghi_chu.json").write_text(json.dumps(k, ensure_ascii=False, indent=1), encoding="utf-8")
    (GOC / "kho_ghi_chu.md").write_text(md(k), encoding="utf-8")
    from collections import Counter
    print(k["so_ghi_chu"], "ghi chú;", k["so_bo_vi_tieu_chuan_cu"], "bỏ vì tiêu chuẩn cũ")
    print(Counter(m["chu_de"][0] for m in k["ghi_chu"]).most_common())
    print(Counter(m["hang_muc_ct"] for m in k["ghi_chu"]).most_common())
    print(Counter(m["loai"] for m in k["ghi_chu"]).most_common(), "nhiều mẫu:", sum(m["so_mau"] > 1 for m in k["ghi_chu"]))
