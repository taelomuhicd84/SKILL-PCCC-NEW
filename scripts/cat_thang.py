"""Cắt phóng to từng cầu thang trên bản vẽ PDF để kiểm hình dạng bậc (knowledge/nhan-dien-thang-thoat-nan.md).

  python scripts/cat_thang.py <ban_ve.pdf> <thu_muc_ra> [--trang 3,6,10] [--zoom 5] [--o 140]
  python scripts/cat_thang.py --tu-kiem
Tìm nhãn thang (BTB1, TB3, CT1, "BUỒNG THANG", "THANG BỘ", kể cả font VNI), cắt ô vuông --o điểm quanh nhãn,
lưu <trang>_<nhãn>.png. Nhãn cách nhau < 60 điểm trên cùng trang thì gộp. Không bắt "THANG MÁY".
"""
import os
import re
import sys

import pymupdf

NHAN = re.compile(r'\b(BTB\s*\d+|TB\s*\d+|CT\s*\d+|CTB\s*\d+)\b|BUỒNG\s+THANG|BUOÀNG\s+THANG|THANG\s+BỘ|THANG\s+BOÄ|CẦU\s+THANG|CAÀU\s+THANG|THANG\s+XOẮN|THANG\s+SẮT|THANG\s+DI\s+CHUYỂN|THANG\s+THOÁT', re.I)


def tim(doc, trang=None):
    """Trả [(số trang 1-based, nhãn, tâm Point)], đã gộp nhãn gần nhau."""
    ra = []
    for i, p in enumerate(doc):
        if trang and i + 1 not in trang:
            continue
        cu = []
        for b in p.get_text('dict')['blocks']:
            for ln in b.get('lines', []):
                chu = ''.join(s['text'] for s in ln['spans'])
                m = NHAN.search(chu)
                if not m or re.search(r'MÁY|MAÙY', chu, re.I):
                    continue
                c = pymupdf.Rect(ln['bbox']).tl + (pymupdf.Rect(ln['bbox']).br - pymupdf.Rect(ln['bbox']).tl) * 0.5
                if all(abs(c - q) >= 60 for q in cu):
                    cu.append(c)
                    ra.append((i + 1, re.sub(r'\W+', '_', m.group(0)).strip('_'), c))
    return ra


def cat(pdf, ra_dir, trang=None, zoom=5, o=140):
    doc = pymupdf.open(pdf)
    os.makedirs(ra_dir, exist_ok=True)
    files = []
    for so, nhan, c in tim(doc, trang):
        p = doc[so - 1]
        # trang xoay: tọa độ chữ chưa xoay, clip cần tọa độ đã xoay
        r = (pymupdf.Rect(c.x - o / 2, c.y - o / 2, c.x + o / 2, c.y + o / 2) * p.rotation_matrix) & p.rect
        if r.is_empty:
            continue
        f = os.path.join(ra_dir, f'{so:02d}_{nhan}_{int(c.x)}_{int(c.y)}.png')
        p.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), clip=r).save(f)
        files.append(f)
    return files


def tu_kiem():
    import tempfile
    d = pymupdf.open()
    p = d.new_page()
    p.insert_text((100, 100), 'BTB2')
    p.insert_text((103, 120), 'BUONG')         # gần BTB2, không phải nhãn
    p.insert_text((300, 300), 'THANG MÁY')     # bỏ
    p.insert_text((400, 500), 'TB3')
    q = d.new_page()
    q.insert_text((200, 700), 'BTB1')
    q.set_rotation(90)                       # trang xoay như bản vẽ A3 ngang
    t = tempfile.mkdtemp()
    f = os.path.join(t, 'a.pdf')
    d.save(f)
    kq = tim(pymupdf.open(f))
    assert [n for _, n, _ in kq] == ['BTB2', 'TB3', 'BTB1'], kq
    assert len(cat(f, os.path.join(t, 'ra'))) == 3
    print('tự kiểm đạt')


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    a = sys.argv[1:]
    if a == ['--tu-kiem']:
        tu_kiem()
        sys.exit()
    tr = [int(x) for x in a[a.index('--trang') + 1].split(',')] if '--trang' in a else None
    z = float(a[a.index('--zoom') + 1]) if '--zoom' in a else 5
    o = float(a[a.index('--o') + 1]) if '--o' in a else 140
    for f in cat(a[0], a[1], tr, z, o):
        print(f)
