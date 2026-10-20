"""Ghi ghi chú tri thức vào knowledge/hoc/ đúng định dạng của runner/src/hoc.ts (trang_thai: cho_duyet) và đánh dấu file nguồn đã đọc.
Dùng: from hoc_ghi import ghi; ghi(id, tieu_de, nguon, hieu_luc, anh_huong, canh_bao, noi_dung, loai='thu-muc')"""
import datetime
import hashlib
import json
import os
import re

GOC = r"C:\Users\HP\Downloads\PCCC_he_thong_2026-10-17\PCCC_he_thong"
DIR = os.path.join(GOC, "knowledge", "hoc")
CM = os.path.join(DIR, "_chi_muc.json")
mot = lambda s: re.sub(r"\s+", " ", str(s or "")).strip()


def ghi(tieu_de, nguon, hieu_luc, anh_huong, canh_bao, noi_dung, loai="thu-muc", trang_thai="cho_duyet"):
    os.makedirs(DIR, exist_ok=True)
    id_ = hashlib.sha1((nguon + "|" + mot(tieu_de)).encode("utf-8")).hexdigest()[:12]
    dau = {"id": id_, "tieu_de": tieu_de, "nguon": nguon, "loai": loai, "hieu_luc": hieu_luc, "trang_thai": trang_thai,
           "ngay": datetime.datetime.utcnow().isoformat() + "Z", "anh_huong": anh_huong, "canh_bao": canh_bao}
    with open(os.path.join(DIR, id_ + ".md"), "w", encoding="utf-8", newline="
") as f:
        f.write("---\n" + "\n".join(f"{k}: {mot(v)}" for k, v in dau.items()) + "\n---\n" + noi_dung.strip() + "\n")
    return id_


def danh_dau_da_doc(duong_dan, id_=None, ghi_chu=None):
    st = os.stat(duong_dan)
    cm = json.load(open(CM, encoding="utf-8")) if os.path.exists(CM) else {"da_doc": {}}
    cm["da_doc"][duong_dan] = {"mtime": st.st_mtime * 1000, "size": st.st_size, **({"id": id_} if id_ else {}), **({"ghi": ghi_chu} if ghi_chu else {})}
    json.dump(cm, open(CM, "w", encoding="utf-8"))
