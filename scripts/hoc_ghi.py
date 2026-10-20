"""Ghi một ghi chú tri thức vào knowledge/hoc/ đúng định dạng runner/src/hoc.ts, và đánh dấu file nguồn đã đọc.

Dùng (từ thư mục scripts/ hoặc thêm vào sys.path):
    from hoc_ghi import ghi, danh_dau_da_doc
    id_ = ghi(tieu_de, nguon, hieu_luc, anh_huong, canh_bao, noi_dung, loai="thu-muc", trang_thai="cho_duyet")
    danh_dau_da_doc(duong_dan_file, id_)

Quy trình bắt buộc sau khi ghi (người dùng đã giao quyền tự duyệt, 2026-10-20):
1. `npx tsx runner/src/kiem_soat_cli.ts` ở thư mục gốc repo: sửa mọi lỗi thuật ngữ/số hiệu/hiệu lực.
2. Đối chiếu xung đột với ghi chú khác và knowledge/ chính thức theo thứ tự ưu tiên (xem THU_TU_UU_TIEN trong runner/src/kiem_soat.ts); sửa phía sai, ghi vào knowledge/hoc/_nhat_ky_kiem_soat.md.
3. Sạch và chắc chắn thì đặt trang_thai "da_duyet" (ghi lại bằng ghi(..., trang_thai="da_duyet")); chưa chắc / đề xuất / không phân xử được thì để "cho_duyet" hoặc "can_sua" và hỏi người dùng.
"""
import datetime
import hashlib
import json
import os
import re

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(GOC, "knowledge", "hoc")
CM = os.path.join(DIR, "_chi_muc.json")
mot = lambda s: re.sub(r"\s+", " ", str(s or "")).strip()


def ghi(tieu_de, nguon, hieu_luc, anh_huong, canh_bao, noi_dung, loai="thu-muc", trang_thai="cho_duyet"):
    os.makedirs(DIR, exist_ok=True)
    id_ = hashlib.sha1((nguon + "|" + mot(tieu_de)).encode("utf-8")).hexdigest()[:12]
    dau = {"id": id_, "tieu_de": tieu_de, "nguon": nguon, "loai": loai, "hieu_luc": hieu_luc, "trang_thai": trang_thai,
           "kiem_soat": "", "ngay": datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z"),
           "anh_huong": anh_huong, "canh_bao": canh_bao}
    with open(os.path.join(DIR, id_ + ".md"), "w", encoding="utf-8", newline="\n") as f:
        f.write("---\n" + "\n".join(f"{k}: {mot(v)}" for k, v in dau.items()) + "\n---\n" + noi_dung.strip() + "\n")
    return id_


def danh_dau_da_doc(duong_dan, id_=None, ghi_chu=None):
    st = os.stat(duong_dan)
    cm = json.load(open(CM, encoding="utf-8")) if os.path.exists(CM) else {"da_doc": {}}
    cm["da_doc"][duong_dan] = {"mtime": st.st_mtime * 1000, "size": st.st_size, **({"id": id_} if id_ else {}), **({"ghi": ghi_chu} if ghi_chu else {})}
    json.dump(cm, open(CM, "w", encoding="utf-8"))
