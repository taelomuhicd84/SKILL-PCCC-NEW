"""Khoanh kết quả thủy lực lên bản vẽ PDF: đầu chủ đạo (vòng đỏ), vùng tính (khung xanh), điểm phụ (vòng cam), khung ghi chú.
Dùng: python -I scripts/khoanh_thuy_luc.py <ban_ve.pdf> <khoanh.json> <ra.pdf>
khoanh.json (tọa độ pt của trang PDF, đo bằng get_text('words') hoặc ảnh render chia hệ số phóng):
  {"trang": 3, "chu_dao": [x, y], "vung": [[x, y], ...] hoặc [x0, y0, x1, y1], "diem": [[x, y], ...],
   "ghi": ["dòng 1", ...], "khung_ghi": [x0, y0, x1, y1], "co_chu": 8, "xoay": 0}
Xuất kèm ảnh <ra>.png vùng quanh khung tính để kiểm bằng mắt.
"""
import json, sys
import pymupdf as fitz

F = r'C:/Windows/Fonts/arial.ttf'
DO, XANH, CAM, DEN = (1, 0, 0), (0, 0.3, 1), (1, 0.45, 0), (0, 0, 0)


def khoanh(pdf, cfg, ra):
    d = fitz.open(pdf)
    p = d[cfg['trang'] - 1]
    v = cfg.get('vung')
    if v and isinstance(v[0], (int, float)):
        p.draw_rect(fitz.Rect(*v), color=XANH, width=2)
        vung = fitz.Rect(*v)
    elif v:
        p.draw_polyline([*v, v[0]], color=XANH, width=2)
        vung = fitz.Rect(min(x for x, _ in v), min(y for _, y in v), max(x for x, _ in v), max(y for _, y in v))
    for x, y in cfg.get('diem', []):
        p.draw_circle((x, y), 5, color=CAM, width=1.8)
    if cfg.get('chu_dao'):
        p.draw_circle(tuple(cfg['chu_dao']), 9, color=DO, width=2.2)
    ghi, co = cfg.get('ghi', []), cfg.get('co_chu', 8)
    if ghi:
        k = fitz.Rect(*cfg['khung_ghi'])
        p.draw_rect(k, color=DO, fill=(1, 1, 1), width=0.8)
        mau = [DO, XANH, CAM] + [DEN] * len(ghi)
        for i, chu in enumerate(ghi):
            p.insert_text((k.x0 + 6, k.y0 + co * 1.6 * (i + 1)), chu, fontsize=co, fontname='arial', fontfile=F,
                          color=mau[i], rotate=cfg.get('xoay', 0))
    d.save(ra, garbage=3, deflate=True)
    if v:
        p.get_pixmap(matrix=fitz.Matrix(3, 3), clip=vung + (-60, -60, 60, 60)).save(ra[:-4] + '.png')


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    if len(sys.argv) != 4:
        raise SystemExit(__doc__)
    khoanh(sys.argv[1], json.load(open(sys.argv[2], encoding='utf-8')), sys.argv[3])
    print('Đã khoanh:', sys.argv[3])
