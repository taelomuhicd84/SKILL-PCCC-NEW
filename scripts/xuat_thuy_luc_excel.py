"""Điền số liệu thủy lực (lấy từ bản vẽ) vào file Excel mẫu, xuất ra file Excel kết quả.
Sửa trực tiếp XML của ô nhập nên giữ nguyên công thức, định dạng, ảnh, ghi chú; Excel tự tính lại khi mở.
Dùng: python scripts/xuat_thuy_luc_excel.py <so_lieu.json> <ra.xlsx> [--mau bang_tinh/thuy_luc/MAU_THUY_LUC_7336.xlsx]
so_lieu.json: khóa theo bang_tinh/thuy_luc/o_nhap.json (vd "K_gpm", "nhanh_trai": [{"dn": 32, "l": 3}, ...]),
và/hoặc "o": {"B7": "chữ", "L200": 0.15} để ghi thẳng vào ô. Giá trị null = xóa ô (đoạn ống bỏ trống thì chuỗi dừng, ra #N/A là chủ ý).
"""
import json, os, re, sys, zipfile

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAU = os.path.join(GOC, 'bang_tinh', 'thuy_luc', 'MAU_THUY_LUC_7336.xlsx')
O_NHAP = os.path.join(GOC, 'bang_tinh', 'thuy_luc', 'o_nhap.json')


def _col(ref):
    c = re.match(r'[A-Z]+', ref).group(0)
    n = 0
    for ch in c:
        n = n * 26 + ord(ch) - 64
    return n


def _esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def set_cell(xml, ref, val):
    """Ghi một ô: số, chữ, '=công thức' hoặc None (xóa nội dung, giữ kiểu ô). Tự chèn ô/dòng nếu chưa có."""
    r = int(re.search(r'\d+', ref).group(0))
    m = re.search(r'<c r="%s"((?: [^>/]*)?)(?:/>|>.*?</c>)' % ref, xml, flags=re.S)
    st = re.search(r' s="\d+"', m.group(1)).group(0) if m and re.search(r' s="\d+"', m.group(1)) else ''
    if val is None:
        new = f'<c r="{ref}"{st}/>'
    elif isinstance(val, str) and val.startswith('='):
        new = f'<c r="{ref}"{st}><f>{_esc(val[1:])}</f></c>'
    elif isinstance(val, str):
        new = f'<c r="{ref}"{st} t="inlineStr"><is><t>{_esc(val)}</t></is></c>'
    else:
        new = f'<c r="{ref}"{st}><v>{repr(float(val)) if isinstance(val, float) else val}</v></c>'
    if m:
        return xml[:m.start()] + new + xml[m.end():]
    rm = re.search(r'<row r="%d"[^>]*?(?:/>|>.*?</row>)' % r, xml, flags=re.S)
    if not rm:  # chèn dòng mới đúng thứ tự
        sau = [x for x in re.finditer(r'<row r="(\d+)"', xml) if int(x.group(1)) > r]
        chen = f'<row r="{r}">{new}</row>'
        pos = sau[0].start() if sau else xml.index('</sheetData>')
        return xml[:pos] + chen + xml[pos:]
    row = rm.group(0)
    if row.endswith('/>'):
        row2 = row[:-2] + '>' + new + '</row>'
    else:
        cells = list(re.finditer(r'<c r="([A-Z]+)\d+"', row))
        sau = [c for c in cells if _col(c.group(1)) > _col(ref)]
        pos = sau[0].start() if sau else row.rindex('</row>')
        row2 = row[:pos] + new + row[pos:]
    return xml[:rm.start()] + row2 + xml[rm.end():]


def o_tu_so_lieu(sl, ban_do):
    """Đổi số liệu theo tên (o_nhap.json) thành {ô: giá trị}."""
    o = {}
    for k, v in sl.items():
        if k == 'o':
            o.update(v)
            continue
        if k == 'hang_cuoi_bp':  # hàng cuối thiếu đầu: Bp (ô J) của khối ống chính cuối trỏ về phụ lục J229, nhãn ở cột B cùng dòng
            j = 105 + 8 * v['chi_so'] if v['chi_so'] < 6 else 154
            o[f'J{j}'] = '=$J$229'
            o[f'B{j}'] = '="Hàng cuối chỉ lấy "&COUNT(D215:D223)&" đầu gần nút nhất (tập huấn C07): Bp riêng tính ở phụ lục dòng 212–229 = "&ROUND(J229,2)'
            if v['chi_so'] == 0:
                o['F106'] = '=ROUND(SQRT(J105*L101),2)'
            continue
        if k not in ban_do or k.startswith('_'):
            raise SystemExit(f'Không có khóa "{k}" trong o_nhap.json')
        bd = ban_do[k]
        if isinstance(bd, dict) and 'o' in bd:  # ô đơn (có thể nhiều ô cùng giá trị)
            for ref in (bd['o'] if isinstance(bd['o'], list) else [bd['o']]):
                o[ref] = v
        elif isinstance(bd, list):  # dãy đoạn ống: phần thiếu thì xóa để chuỗi dừng
            for i, hang in enumerate(bd):
                d = v[i] if i < len(v) else None
                if 'e' in hang:
                    o[hang['e']] = (i + 1) if d else None
                o[hang['dn']] = d['dn'] if d else None
                o[hang['l']] = d['l'] if d else None
        elif isinstance(bd, dict):  # nhóm ô (vd họng nước)
            for kk, vv in v.items():
                if kk not in bd:
                    raise SystemExit(f'Không có khóa "{k}.{kk}" trong o_nhap.json')
                o[bd[kk]['o']] = vv
    return o


def xuat(o, ra, mau=MAU, sheet='SP chung voi HR'):
    zin = zipfile.ZipFile(mau)
    wb = zin.read('xl/workbook.xml').decode('utf-8')
    rid = re.search(r'<sheet name="%s" sheetId="\d+" r:id="(rId\d+)"' % re.escape(sheet), wb).group(1)
    rels = zin.read('xl/_rels/workbook.xml.rels').decode('utf-8')
    target = re.search(r'Id="%s"[^>]*Target="([^"]+)"' % rid, rels) or re.search(r'Target="([^"]+)"[^>]*Id="%s"' % rid, rels)
    sp = 'xl/' + target.group(1).lstrip('/').replace('xl/', '')
    xml = zin.read(sp).decode('utf-8')
    for ref, val in o.items():
        xml = set_cell(xml, ref, val)
    wb = re.sub(r'<calcPr([^>]*?)/>', lambda m: '<calcPr' + re.sub(r' fullCalcOnLoad="\d"', '', m.group(1)) + ' fullCalcOnLoad="1"/>', wb)
    rels = re.sub(r'<Relationship [^>]*calcChain[^>]*/>', '', rels)
    ct = re.sub(r'<Override[^>]*calcChain[^>]*/>', '', zin.read('[Content_Types].xml').decode('utf-8'))
    os.makedirs(os.path.dirname(os.path.abspath(ra)), exist_ok=True)
    tam = ra + '.tmp'
    with zipfile.ZipFile(tam, 'w', zipfile.ZIP_DEFLATED) as zo:
        for it in zin.infolist():
            if it.filename == 'xl/calcChain.xml':
                continue
            data = {sp: xml, 'xl/workbook.xml': wb, 'xl/_rels/workbook.xml.rels': rels, '[Content_Types].xml': ct}.get(it.filename)
            zo.writestr(it, data.encode('utf-8') if data is not None else zin.read(it.filename))
    zin.close()
    os.replace(tam, ra)  # lỗi PermissionError nếu file ra đang mở trong Excel: đổi tên file ra


if __name__ == '__main__':
    a = sys.argv[1:]
    mau = MAU
    if '--mau' in a:
        i = a.index('--mau'); mau = a[i + 1]; del a[i:i + 2]
    if len(a) != 2:
        raise SystemExit(__doc__)
    sl = json.load(open(a[0], encoding='utf-8'))
    o = o_tu_so_lieu(sl, json.load(open(O_NHAP, encoding='utf-8')))
    xuat(o, a[1], mau)
    print(f'Đã ghi {len(o)} ô vào {a[1]}. Mở bằng Excel để tính lại.')
