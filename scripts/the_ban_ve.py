"""Chuyển MỘT bộ bản vẽ mẫu (PDF vector) thành thẻ tham khảo JSON + MD, đọc một lần, agent dùng lại không cần nạp PDF.
Mỗi trang: mã/tên bản vẽ, hạng mục, loại (mặt bằng, mặt cắt…), ghi chú (đoạn chữ gộp dòng), trích dẫn văn bản pháp luật
kèm câu chứa nó, mã ký hiệu (D2, FD1, W2…), giới hạn chịu lửa (REI150, EI60…), phòng + diện tích, chiều cao PCCC;
mặt bằng có trục + tỷ lệ + cột (scripts/nhan_dien_ket_cau.py). Ẩn danh: bỏ khung tên (trừ tên/mã/hạng mục bản vẽ),
bỏ dòng địa chỉ, thửa đất, MST, chữ ký số, thay các chuỗi --an bằng [TÊN].
Dùng: python -I -X utf8 scripts/the_ban_ve.py <id> <ra_thu_muc> <pdf>... [--an "HOÀNG ANH 2"] [--cong-nang karaoke]
Tra: python -I -X utf8 scripts/the_ban_ve.py tra --agent m07 [--tu-khoa "thang|cửa"] [--cong-nang karaoke]
Tự kiểm: python -I -X utf8 scripts/the_ban_ve.py --tu-kiem
"""
import json
import pathlib
import re
import sys
import unicodedata
import pymupdf as fitz

sys.path.insert(0, str(pathlib.Path(__file__).parent))

# --- VNI -> Unicode (chép từ shared/src/vni.ts) ---
_BANG = []
def _them(goc, dau, dich):
    _BANG.extend((goc + d, dich[i]) for i, d in enumerate(dau))
_DT, _DH = "ùøûõï", "ÙØÛÕÏ"
_MT, _MH = "áàåãä", "ÁÀÅÃÄ"
_TT, _TH = "éèúüë", "ÉÈÚÜË"
for g, d, k in [("a", _DT, "áàảãạ"), ("a", _MT, "ấầẩẫậ"), ("a", _TT, "ắằẳẵặ"), ("e", _DT, "éèẻẽẹ"), ("e", _MT, "ếềểễệ"),
                ("o", _DT, "óòỏõọ"), ("o", _MT, "ốồổỗộ"), ("ô", _DT, "ớờởỡợ"), ("ö", _DT, "ứừửữự"), ("u", _DT, "úùủũụ"), ("y", _DT[:4], "ýỳỷỹ"),
                ("A", _DH, "ÁÀẢÃẠ"), ("A", _MH, "ẤẦẨẪẬ"), ("A", _TH, "ẮẰẲẴẶ"), ("E", _DH, "ÉÈẺẼẸ"), ("E", _MH, "ẾỀỂỄỆ"),
                ("O", _DH, "ÓÒỎÕỌ"), ("O", _MH, "ỐỒỔỖỘ"), ("Ô", _DH, "ỚỜỞỠỢ"), ("Ö", _DH, "ỨỪỬỮỰ"), ("U", _DH, "ÚÙỦŨỤ"), ("Y", _DH[:4], "ÝỲỶỸ")]:
    _them(g, d, k)
_BANG += [("aâ", "â"), ("aê", "ă"), ("eâ", "ê"), ("oâ", "ô"), ("AÂ", "Â"), ("AÊ", "Ă"), ("EÂ", "Ê"), ("OÂ", "Ô")]
_DON = {"ô": "ơ", "ö": "ư", "Ô": "Ơ", "Ö": "Ư", "ñ": "đ", "Ñ": "Đ", "æ": "ỉ", "ó": "ĩ", "ò": "ị", "Æ": "Ỉ", "Ó": "Ĩ", "Ò": "Ị", "î": "ỵ", "Î": "Ỵ"}
_DAU_VNI = re.compile(r"[aeouyôöAEOUYÔÖ][ùøûõïÙØÛÕÏ]|[aeoAEO][âåãäÂÅÃÄ]|[aeAE][áàÁÀ]|[aA][êéèúüëÊÉÈÚÜË]|[ñÑ]")
_UNI = re.compile(r"[ăắằẳẵặạảấầẩẫậđẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹĂẮẰẲẴẶẠẢẤẦẨẪẬĐẸẺẼẾỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴỶỸƠƯơư]")


def vni(s):
    s = unicodedata.normalize("NFC", s)
    if not _DAU_VNI.search(s) or _UNI.search(s):
        return s
    out, i = [], 0
    while i < len(s):
        k = next(((a, b) for a, b in _BANG if s.startswith(a, i)), None)
        if k:
            out.append(k[1]); i += len(k[0])
        else:
            out.append(_DON.get(s[i], s[i])); i += 1
    return "".join(out)


# --- chữ in theo số glyph (PDF xuất từ CAD mất bảng mã: "7rQ\x03%ҧQ" = "Tên Bản"): đổi GID -> Unicode bằng arial.ttf ---
_GID = None
_CYR = re.compile(r"[\u0400-\u052f]")


def gid(t):
    global _GID
    ctrl = any(ord(c) < 0x20 for c in t)
    if not ctrl and not _CYR.search(t):
        return t
    if _GID is None:
        _GID = {}
        try:
            F = fitz.Font(fontfile="C:/Windows/Fonts/arial.ttf")
            for a, b in [(0x20, 0x250), (0x300, 0x530), (0x1E00, 0x1F00), (0x2000, 0x2070)]:
                for u in range(a, b):
                    g = F.has_glyph(u)
                    if g:
                        _GID.setdefault(g, chr(u))
        except Exception:  # không có Arial: để nguyên
            pass
    # có ký tự điều khiển: cả chuỗi là GID; chỉ có ký tự Kirin: phần ASCII đúng, chỉ chữ có dấu là GID
    return "".join(_GID.get(ord(c), c) if (ctrl or ord(c) >= 0x100 or c == "ÿ") else c for c in t)


# --- nhận dạng nội dung ---
VAN_BAN = re.compile(r"((?:QCVN|QC)\s*\d+\s*[:：/.]\s*\d{4}(?:\s*[/-]\s*BXD)?|TCVN\s*\d+(?:-\d+)*\s*[:：]\s*\d{4}|N[ĐD]\s*\d+\s*/\s*\d{4}(?:\s*/\s*NĐ-CP)?|Nghị định\s*(?:số\s*)?\d+/\d{4}|Thông tư\s*(?:số\s*)?\d+/\d{4}|TT\s*\d+/\d{4})", re.I)
DIEU = re.compile(r"(?:điều|Đ\.\s?|mục|khoản|bảng|phụ lục|hình)\s*[A-Z]?\d+(?:\.\d+)*(?:\s*[a-zđ]\))?", re.I)
GHCL = re.compile(r"\b(R?EI?W?\s?\d{2,3})\b")
MA_KH = re.compile(r"\b((?:FD|D|W|LV|VK|S|TG|CT|MFD)\d{1,2})\b")
DT = re.compile(r"S\s*=\s*([\d.,]+)\s*M\s*2|([\d.,]+)\s*M2", re.I)
CAO = re.compile(r"CHIỀU CAO PCCC\s*(?:LÀ|=|:)?\s*([\d.,]+)\s*M", re.I)
TEN_BV = re.compile(r"MẶT BẰNG|MẶT CẮT|MẶT ĐỨNG|CHI TIẾT|THUYẾT MINH|SƠ ĐỒ|BẢNG|DANH MỤC|TỔNG THỂ|NGUYÊN LÝ", re.I)
LOAI = [("mat_bang", r"MẶT BẰNG|TỔNG THỂ"), ("mat_cat", r"MẶT CẮT"), ("mat_dung", r"MẶT ĐỨNG"), ("so_do", r"SƠ ĐỒ|NGUYÊN LÝ"),
        ("thuyet_minh", r"THUYẾT MINH|TÍNH TOÁN|BẢNG|DANH MỤC"), ("chi_tiet", r"CHI TIẾT")]
RIENG_TU = re.compile(r"CÔNG TY|ĐƠN VỊ T|Digitally|DN:|CN=|GIÁM ĐỐC|ĐỊA (CHỈ|ĐIỂM)|THỬA ĐẤT|\bTĐS\b|TBĐS|TỜ BẢN ĐỒ|MST|Reason:|Date:|Location:|OID\.|CHỦ ĐẦU TƯ|HỘ KINH DOANH|@|ĐIỆN THOẠI\s*:|\b0\d{9}\b|\b(Tel|Fax|E-?mail|Website|Address|Head Office|Ward|Province|Street)\b|www\.|\.com|\b(KTS|KS|THS|TS)\s*\.|\bCOMPANY\b|\bCO\.,? ?LTD", re.I)
GHI_CHU = re.compile(r"^\s*([-+*•=]|=>|GHI CH[ÚU]|LƯU Ý|KẾT LUẬN|NOTE)", re.I)


# trang -> agent hạng mục (theo tên bản vẽ + phần), để agent Grep "[m07" trong the.md
AGENT = [("m01-phan-loai", r"THUYẾT MINH CÔNG TRÌNH|ĐỊNH VỊ"), ("m02-bac-chiu-lua", r"THUYẾT MINH CÔNG TRÌNH|KẾT CẤU"),
         ("m03-khoang-cach", r"KHOẢNG CÁCH"), ("m04-giao-thong", r"GIAO THÔNG|^MẶT BẰNG TỔNG THỂ$|^MẶT ĐỨNG (TRỤC|THOÁT NẠN|\w+-\w+)"),
         ("m05-cong-nang", r"MẶT BẰNG TẦNG|MẶT BẰNG MÁI|ÁP MÁI|PHÒNG BƠM|PHÒNG TRỰC"), ("m06-ngan-chay", r"NGĂN CHÁY|VẬT LIỆU|CỬA CHỐNG CHÁY|MẶT CẮT [A-Z]-[A-Z]$|KHOẢNG CÁCH"),
         ("m07-thoat-nan", r"THOÁT NẠN|THANG|VẬT LIỆU"), ("m08-thang-may-cc", r"THANG MÁY"), ("m09-chong-khoi", r"THÔNG GIÓ|HÚT KHÓI|BÙ KHÍ|SẢNH THÔNG TẦNG"),
         ("m10-binh-chua-chay", r"BÌNH CHỮA CHÁY"), ("m11-bao-chay", r"BÁO CHÁY"), ("m12-chua-chay", r"(?<!BÌNH )CHỮA CHÁY|SPRINKLER|VÁCH TƯỜNG|PHÒNG BƠM|THỦY LỰC"),
         ("m13-cap-dien", r"CẤP ĐIỆN|ĐIỆN PCCC"), ("m14-den-su-co", r"EXIT|EX - EM|EM TỔNG|ÂM THANH|CHIẾU SÁNG"), ("m15-cnch", r"BÌNH CHỮA CHÁY|PHÁ DỠ|MẶT NẠ"),
         ("m16-chong-set", r"CHỐNG SÉT"), ("m17-lien-lac", r"LIÊN LẠC|ĐIỆN THOẠI|PHÒNG TRỰC"), ("m18-quang-cao", r"QUẢNG CÁO")]


def agent_trang(ten, phan):
    s = f"{ten or ''} | {phan or ''}"
    return [a for a, r in AGENT if any(re.search(r, x, re.I) for x in s.split(" | ") if x)] or ["chung"]


def loai_trang(ten):
    return next((k for k, p in LOAI if re.search(p, ten or "", re.I)), "khac")


def dong(page):
    """Dòng chữ: (x0, y0, x1, y1, cỡ, chữ) đã đổi VNI."""
    out, m = [], page.rotation_matrix  # trang /Rotate: chữ trả về theo hệ chưa xoay, đổi sang hệ hiển thị
    goc = fitz.Point(0, 0) * m
    for b in page.get_text("dict")["blocks"]:
        for l in b.get("lines", []):
            t = vni("".join(gid(s["text"]) for s in l["spans"])).strip()
            if t and (fitz.Point(l["dir"]) * m - goc).x > 0.9:  # chỉ chữ nằm ngang khi xem; chữ xoay là kích thước/nhãn trục
                out.append((*(fitz.Rect(l["bbox"]) * m), round(l["spans"][0]["size"], 1), re.sub(r"\s+", " ", t)))
    return out


def doan(ds):
    """Gộp dòng thành đoạn: cùng lề trái (±4pt), cỡ chữ gần nhau, khoảng cách dòng < 2 lần cỡ chữ."""
    ds = sorted(ds, key=lambda d: (round(d[0] / 4), d[1]))
    nhom = []
    for d in sorted(ds, key=lambda d: (d[1], d[0])):
        g = next((g for g in nhom if abs(g[-1][0] - d[0]) < 4 and abs(g[-1][4] - d[4]) < 1 and 0 <= d[1] - g[-1][3] < 1.2 * d[4]), None)
        (g.append(d) if g else nhom.append([d]))
    return [{"xy": [round(g[0][0]), round(g[0][1])], "co": g[0][4], "chu": " ".join(x[5] for x in g)} for g in nhom]


MA_BV = re.compile(r"[A-Z]{1,5}\s?-\s?\d{1,3}(?:[.-]\d{1,3}){0,3}[A-Z]?")


def khung_ten(ds, W):
    """Khung tên ở dải phải trang (từ nhãn 'TÊN BẢN VẼ' hoặc x0 > 87% bề rộng): lấy mã, tên bản vẽ, hạng mục; còn lại bỏ (tên người, công ty)."""
    la_nhan = lambda d, lb: re.sub(r"\W", "", d[5]).upper().startswith(lb)
    x0 = min([d[0] - 25 for d in ds if la_nhan(d, "TÊNBẢNVẼ") and d[0] > 0.6 * W] + [0.87 * W])
    k = sorted([d for d in ds if d[0] > x0], key=lambda d: d[1])
    NHAN = ("TÊNBẢNVẼ", "HẠNGMỤC", "KÍHIỆUBV", "KÝHIỆUBV", "SỐBẢNVẼ", "NGÀYHOÀNTHÀNH", "TỶLỆ", "TỈLỆ", "DRAWINGNO", "CATEGORIES")

    def sau(lb, toi=60):
        n = next((d for d in k if la_nhan(d, lb)), None)
        if not n:
            return []
        het = min([d[1] for d in k if d[1] > n[1] + 1 and any(la_nhan(d, x) for x in NHAN)] + [n[1] + toi])  # dừng ở nhãn kế tiếp
        return [d[5] for d in k if n[1] < d[1] < het - 1 and abs(d[0] - n[0]) < 0.12 * W and not any(la_nhan(d, x) for x in NHAN)]
    ma = next((re.sub(r"\s", "", d[5]) for d in k if MA_BV.fullmatch(d[5])), None)
    ten = [t for t in sau("TÊNBẢNVẼ", 70) if not RIENG_TU.search(t) and not MA_BV.fullmatch(t)]
    if not ten:  # tên không có chữ trong khung (vẽ thành nét): lấy dòng tiêu đề chữ to nhất ngoài khung
        to = sorted([d for d in ds if d[0] <= x0 and TEN_BV.search(d[5]) and len(d[5]) < 80], key=lambda d: -d[4])
        if to and to[0][4] >= 1.5 * sorted(x[4] for x in ds)[len(ds) // 2]:
            ten = [to[0][5]]
    hm = [t for t in sau("HẠNGMỤC", 30) if t != ma and not RIENG_TU.search(t)]
    return ma, " ".join(dict.fromkeys(ten)) or None, (hm[0] if hm else None), {id(d) for d in k}


def an(s, ten_an):
    for t in ten_an:
        s = re.sub(re.escape(t), "[TÊN]", s, flags=re.I)
    return s


def trich(chu):
    """Trích dẫn: văn bản + điều/mục/bảng đứng gần (trong cùng câu)."""
    out = []
    for m in VAN_BAN.finditer(chu):
        vb = re.sub(r"[/-]BXD|/NĐ-CP", "", re.sub(r"\s+", "", m.group(1).upper().replace("ND", "NĐ").replace("：", ":")))
        vb = re.sub(r"^(QCVN|TCVN|NĐ|TT|NGHỊĐỊNH(?:SỐ)?|THÔNGTƯ(?:SỐ)?)", lambda x: {"NGHỊĐỊNH": "NĐ", "NGHỊĐỊNHSỐ": "NĐ", "THÔNGTƯ": "TT", "THÔNGTƯSỐ": "TT"}.get(x.group(1), x.group(1)) + " ", vb)
        # điều đứng trước ("theo điều 6.4 QCVN…") gần nhất, không có thì điều ngay sau ("QCVN… điều 3.5.10")
        truoc = DIEU.findall(chu[max(0, m.start() - 80): m.start()])
        sau = DIEU.findall(chu[m.end(): m.end() + 30])
        dieu = truoc[-1] if truoc else (sau[0] if sau else None)
        vb = re.sub(r"^QC(?:VN)? ?(\d+)[/.:](\d{4})", r"QCVN \1:\2", vb)
        out.append({"van_ban": vb, "dieu": re.sub(r"^đ\.\s?", "điều ", re.sub(r"\s+", " ", dieu).lower()) if dieu else None})
    return out


def the_trang(page, so, ten_an, hinh_hoc=True):
    W = page.rect.width
    ds = dong(page)
    ma, ten, hm, bo = khung_ten(ds, W)
    ds = [d for d in ds if id(d) not in bo and not RIENG_TU.search(d[5])]
    ps = [dict(p, chu=an(p["chu"], ten_an)) for p in doan(ds)]
    tat_ca = " ".join(p["chu"] for p in ps)
    loai = loai_trang(ten)
    t = {"trang": so, "ma": ma, "ten": ten, "hang_muc": hm, "loai": loai}
    chu_cai = lambda c: sum(bool(re.search(r"[^\W\d_]{2}", w)) for w in c.split())  # số từ có chữ cái, loại cao độ "+0.500", "-"
    gc = [p for p in ps if chu_cai(p["chu"]) >= 8 or (GHI_CHU.match(p["chu"]) and chu_cai(p["chu"]) >= 3)]
    t["ghi_chu"] = [{"chu": p["chu"], "xy": p["xy"], "trich_dan": trich(p["chu"])} for p in gc]
    t["trich_dan"] = sorted({(x["van_ban"], x["dieu"] or "") for p in gc for x in trich(p["chu"])})
    t["ghcl"] = sorted(set(re.sub(r"\s", "", g) for g in GHCL.findall(tat_ca) if re.match(r"R?EI|E\d|REI", g.replace(" ", ""))))
    t["ky_hieu"] = sorted(set(MA_KH.findall(tat_ca)))
    t["cao_pccc_m"] = sorted({float(x.replace(",", ".")) for x in CAO.findall(tat_ca) if re.fullmatch(r"\d+([.,]\d+)?", x)})
    if loai == "mat_bang":
        # phòng: dòng "S=..M2" ghép nhãn ngay trên (cách < 2 cỡ chữ, chồng theo x)
        phong = []
        for i, d in enumerate(ds):
            m = re.fullmatch(r"S\s*=\s*([\d.,]+)\s*M2?", d[5], re.I)
            if not m:
                continue
            tren = [e for e in ds if 0 <= d[1] - e[3] < 2 * d[4] and e[0] < d[2] and e[2] > d[0] and not DT.search(e[5])]
            phong.append({"ten": an(tren[-1][5], ten_an) if tren else None, "dt_m2": float(m.group(1).replace(",", ".").rstrip(".")), "xy": [round(d[0]), round(d[1])]})
        t["phong"] = phong
        if hinh_hoc:
            from nhan_dien_ket_cau import nhan_dien
            kq = nhan_dien(page)
            t["hinh_hoc"] = {"mm_moi_pt": kq.get("mm_moi_pt"), "truc": kq.get("truc"), "cot": [{"ten": c["ten"], "canh_m": c["canh_m"], "rect": c["rect"]} for c in kq.get("cot", [])],
                             "so_dam_chinh": len(kq.get("dam_chinh", [])), "so_khoang_dam": len(kq.get("khoang", [])), "loi": kq.get("loi")}
    return t


def the_bo(id_, pdfs, ten_an, cong_nang=None, hinh_hoc=True):
    trang = []
    for f in pdfs:
        doc = fitz.open(f)
        hm_bia = None
        for i, p in enumerate(doc, 1):
            nd = len(p.get_drawings())
            chu_tr = " ".join(d[5] for d in dong(p))
            if (nd < 10 and len(chu_tr) < 1500) or (nd < 40 and re.search(r"CỘNG HÒA XÃ HỘI|Độc lập - Tự do", chu_tr)):  # tờ bìa (trang thuyết minh nhiều chữ thì giữ), trang chữ ký số: chỉ lấy hạng mục cho các trang sau, không lưu chữ (tên, địa chỉ khách)
                ls = [d[5] for d in sorted(dong(p), key=lambda d: d[1])]
                j = next((j for j, x in enumerate(ls) if re.match(r"\(?HẠNG MỤC\s*:", x)), None)
                if j is not None:
                    hm_bia = re.sub(r"^\(?HẠNG MỤC\s*:\s*|\)$", "", ls[j]).strip()
                    if hm_bia.endswith("+") and j + 1 < len(ls):
                        hm_bia += " " + ls[j + 1]
                trang.append({"trang": i, "loai": "bia", "phan": hm_bia, "file": an(pathlib.Path(f).name, ten_an)})
                continue
            t = the_trang(p, i, ten_an, hinh_hoc)
            t["phan"] = hm_bia
            t["agent"] = agent_trang(t["ten"], hm_bia)
            t["file"] = an(pathlib.Path(f).name, ten_an)
            trang.append(t)
            print(f"{t['file']} tr{i} {t['ma']} {t['loai']} {t['ten']}", file=sys.stderr)
    vb = {}
    for t in trang:
        for v, d in t.get("trich_dan", []):
            vb.setdefault(v, set()).add(d)
    return {"id": id_, "cong_nang": cong_nang, "so_trang": len(trang),
            "phan": list(dict.fromkeys(t["phan"] for t in trang if t["phan"])),
            "cao_pccc_m": sorted({h for t in trang for h in t.get("cao_pccc_m", [])}),
            "ghcl": sorted({g for t in trang for g in t.get("ghcl", [])}),
            "van_ban_trich": {v: sorted(x for x in d if x) for v, d in sorted(vb.items())},
            "luu_y": "Trích tự động từ PDF; mọi số liệu là CẦN XÁC NHẬN khi dùng cho dự án khác. Hình học: tọa độ pt PDF, mm_moi_pt để đổi ra mm.",
            "trang": trang}


def md(the):
    L = [f"# Thẻ bản vẽ mẫu: {the['id']}", "", f"- Công năng: {the['cong_nang']}; {the['so_trang']} trang; phần: {', '.join(the['phan'])}",
         f"- Chiều cao PCCC ghi trên bản vẽ: {the['cao_pccc_m']} m", f"- GHCL xuất hiện: {', '.join(the['ghcl'])}", "", "## Văn bản được trích", ""]
    L += [f"- {v}: {', '.join(d) or '(không ghi điều)'}" for v, d in the["van_ban_trich"].items()]
    L += ["", "## Ghi chú theo bản vẽ", ""]
    for t in the["trang"]:
        if not t.get("ghi_chu"):
            continue
        L.append(f"### {t['file']} tr{t['trang']} {t['ma'] or ''} – {t['ten'] or ''} ({t['phan'] or ''}) " + " ".join(f"[{x}]" for x in t.get('agent', [])))
        L += [f"- {g['chu']}" for g in t["ghi_chu"]]
        if t.get("phong"):
            L.append("- Phòng: " + "; ".join(f"{p['ten']} {p['dt_m2']} m2" for p in t["phong"]))
        L.append("")
    return "\n".join(L)


def muc_luc(goc):
    ds = []
    for f in sorted(pathlib.Path(goc).glob("*/the.json")):
        th = json.loads(f.read_text(encoding="utf-8"))
        ds.append({k: th[k] for k in ("id", "cong_nang", "so_trang", "phan", "cao_pccc_m")} | {"van_ban": list(th["van_ban_trich"]), "the": f"{f.parent.name}/the.json"})
    (pathlib.Path(goc) / "muc_luc.json").write_text(json.dumps(ds, ensure_ascii=False, indent=1), encoding="utf-8")


def tra(goc, agent=None, tu_khoa=None, cong_nang=None):
    """Ghi chú các thẻ mẫu cho một agent (vd. m07-thoat-nan, chỉ cần tiền tố m07) và/hoặc chứa từ khóa."""
    out = []
    for f in sorted(pathlib.Path(goc).glob("*/the.json")):
        th = json.loads(f.read_text(encoding="utf-8"))
        if cong_nang and cong_nang.lower() not in (th["cong_nang"] or "").lower():
            continue
        for t in th["trang"]:
            if agent and not any(x.startswith(agent) for x in t.get("agent", [])):
                continue
            gc = [g for g in t.get("ghi_chu", []) if not tu_khoa or re.search(tu_khoa, g["chu"], re.I)]
            if gc:
                out.append({"mau": th["id"], "trang": t["trang"], "file": t["file"], "ma": t["ma"], "ten": t["ten"], "ghi_chu": [g["chu"] for g in gc]})
    return out


def tu_kiem():
    assert vni("MAËT BAÈNG") == "MẶT BẰNG", vni("MAËT BAÈNG")
    assert vni("MẶT BẰNG") == "MẶT BẰNG"
    x = trich("=> Không yêu cầu bãi đỗ xe PCCC ( theo điều 6.2.2.1 Sửa đổi 01 QCVN 06: 2022/BXD )")
    assert x == [{"van_ban": "QCVN 06:2022", "dieu": "điều 6.2.2.1"}], x
    assert loai_trang("MẶT BẰNG TẦNG 1") == "mat_bang" and loai_trang("CHI TIẾT CỬA") == "chi_tiet"
    ds = [(10, 10, 100, 18, 8, "- Bề rộng đường"), (10, 20, 100, 28, 8, "tối thiểu 3.5m"), (300, 10, 400, 18, 8, "khác")]
    assert [p["chu"] for p in doan(ds)] == ["- Bề rộng đường tối thiểu 3.5m", "khác"], doan(ds)
    assert an("KARAOKE HOÀNG ANH 2", ["HOÀNG ANH 2"]) == "KARAOKE [TÊN]"
    if pathlib.Path("C:/Windows/Fonts/arial.ttf").exists():
        assert gid("7rQ\x03%ҧQ\x039Ӂ") == "Tên Bản Vẽ" and gid("Tên Bҧn VӁ") == "Tên Bản Vẽ" and gid("MẶT BẰNG") == "MẶT BẰNG", gid("Tên Bҧn VӁ")
    assert agent_trang("MẶT BẰNG THOÁT NẠN TẦNG 1", "KIẾN TRÚC") == ["m07-thoat-nan"], agent_trang("MẶT BẰNG THOÁT NẠN TẦNG 1", "KIẾN TRÚC")
    assert "m11-bao-chay" in agent_trang("MẶT BẰNG TỔNG THỂ", "BÁO CHÁY") and agent_trang("BÌA", None) == ["chung"]
    print("tu_kiem OK")


if __name__ == "__main__":
    a = sys.argv[1:]
    if a[:1] == ["--tu-kiem"]:
        tu_kiem(); sys.exit()
    if a[:1] == ["tra"]:  # tra [--agent m07] [--tu-khoa "thang|cửa"] [--cong-nang karaoke]
        o = dict(zip(a[1::2], a[2::2]))
        goc = pathlib.Path(__file__).parent.parent / "data" / "ban_ve_mau"
        print(json.dumps(tra(goc, o.get("--agent"), o.get("--tu-khoa"), o.get("--cong-nang")), ensure_ascii=False, indent=1)); sys.exit()
    ten_an, cn, pos, hh = [], None, [], True
    while a:
        x = a.pop(0)
        if x == "--an":
            ten_an.append(a.pop(0))
        elif x == "--cong-nang":
            cn = a.pop(0)
        elif x == "--khong-hinh-hoc":  # bộ nặng (nhà xưởng): bỏ nhận diện trục/cột cho nhanh
            hh = False
        else:
            pos.append(x)
    id_, ra, pdfs = pos[0], pathlib.Path(pos[1]), pos[2:]
    th = the_bo(id_, pdfs, sorted(ten_an, key=len, reverse=True), cn, hh)
    (ra / id_).mkdir(parents=True, exist_ok=True)
    (ra / id_ / "the.json").write_text(json.dumps(th, ensure_ascii=False, indent=1), encoding="utf-8")
    (ra / id_ / "the.md").write_text(md(th), encoding="utf-8")
    muc_luc(ra)
    print(f"Xong: {ra / id_}/the.json, the.md, {ra}/muc_luc.json")
