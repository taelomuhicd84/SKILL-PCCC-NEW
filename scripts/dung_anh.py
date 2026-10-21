"""Dựng ảnh PNG từng trang PDF: python -X utf8 scripts/dung_anh.py <pdf> <thu_muc_anh> [dpi].
Agent không có pdftoppm nên mở ảnh bằng Read khi chữ có vị trí mơ hồ (vị trí cửa, hướng mở, ký hiệu). Bỏ qua trang đã có ảnh."""
import os, sys
try:
    import pymupdf
except ImportError:
    sys.exit("thiếu PyMuPDF: pip install pymupdf")

pdf, out = sys.argv[1], sys.argv[2]
dpi = int(sys.argv[3]) if len(sys.argv) > 3 else 110
os.makedirs(out, exist_ok=True)
moi = 0
with pymupdf.open(pdf) as doc:
    for i, trang in enumerate(doc, 1):
        f = os.path.join(out, f"trang_{i}.png")
        if os.path.exists(f):
            continue
        trang.get_pixmap(dpi=dpi).save(f)
        moi += 1
    print(f"{moi} ảnh mới, {len(doc)} trang -> {out}")
