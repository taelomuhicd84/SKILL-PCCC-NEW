"""Chuẩn bị bản vẽ PDF cho Gemini/LLM: mỗi trang -> ảnh dựng đứng 300dpi + danh sách chữ kèm vị trí.
Dùng: python prep_for_llm.py "ban_ve.pdf" [thu_muc_ra]
"""
import sys, collections, pathlib
import pymupdf

sys.path.insert(0, str(pathlib.Path(__file__).parent / "pccc-checker" / "src"))
try:  # sửa chữ font VNI (vd. "MAËT BAÈNG") bằng bộ chuyển có sẵn của pccc-checker
    from pccc_checker.pdf.vn_encoding import fix_span
except ImportError:
    fix_span = lambda text, font: text

src = sys.argv[1]
out = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else pathlib.Path(src).stem + "_llm")
out.mkdir(exist_ok=True)
# hướng chữ chiếm đa số -> góc cần xoay để chữ nằm ngang, đọc trái sang phải
ROT = {(1, 0): 0, (0, -1): 90, (-1, 0): 180, (0, 1): 270}

for i, page in enumerate(pymupdf.open(src), 1):
    lines = [l for b in page.get_text("dict")["blocks"] for l in b.get("lines", [])]
    dirs = collections.Counter((round(l["dir"][0]), round(l["dir"][1])) for l in lines)
    rot = ROT.get(dirs.most_common(1)[0][0], 0) if dirs else 0
    page.set_rotation((page.rotation + rot) % 360)
    page.get_pixmap(dpi=300).save(out / f"trang_{i}.png")
    W, H = page.rect.width, page.rect.height  # kích thước sau khi xoay
    rows = []
    for l in lines:
        t = "".join(fix_span(s["text"], s["font"]) for s in l["spans"]).strip()
        if not t:
            continue
        x0, y0, x1, y1 = pymupdf.Rect(l["bbox"]) * page.rotation_matrix
        rows.append((round(min(y0, y1) / H * 100), round(min(x0, x1) / W * 100), t))
    with open(out / f"trang_{i}_chu.txt", "w", encoding="utf-8") as f:
        f.write(f"# Chữ trích nguyên văn từ PDF. Vị trí = % chiều ngang (x) / % chiều dọc (y) của ảnh trang_{i}.png\n")
        for y, x, t in sorted(rows):
            f.write(f"x={x:3d}% y={y:3d}%  {t}\n")
    print(f"trang {i}: xoay {rot}°, {len(rows)} dòng chữ")
print("Xong ->", out.resolve())
