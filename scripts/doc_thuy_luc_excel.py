"""Đọc file Excel thủy lực theo đúng mẫu bang_tinh/thuy_luc/MAU_THUY_LUC_7336.xlsx thành so_lieu.json (in ra stdout).
Tự nhận diện: nhánh đối xứng (ô D98), mạch vòng hay cụt (ô D182, bản cũ không có ô thì đọc chữ B183).
Dùng: python scripts/doc_thuy_luc_excel.py <file.xlsx>      Thoát 2 nếu không phải mẫu (agent đọc tay theo quy tắc nhận diện).
"""
import json, os, re, sys, warnings
warnings.filterwarnings('ignore')
import openpyxl

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BD = json.load(open(os.path.join(GOC, 'bang_tinh', 'thuy_luc', 'o_nhap.json'), encoding='utf-8'))


def doc(path):
    try:
        wf = openpyxl.load_workbook(path)['SP chung voi HR']
        wv = openpyxl.load_workbook(path, data_only=True)['SP chung voi HR']
    except KeyError:
        raise SystemExit(2)

    # Bản cũ (trước khi chèn dòng 158 "Tổng lưu lượng") lệch dòng: dò dòng nhãn "C-D" của đoạn vòng (mẫu: B184) để bù.
    lech = next((r - 184 for r in range(175, 196) if str(wf[f'B{r}'].value or '').strip() == 'C-D'), None)
    if lech is None:
        raise SystemExit(2)

    def doi(ref):
        c, r = re.match(r'([A-Z]+)(\d+)', ref).groups()
        return f'{c}{int(r) + lech}' if int(r) >= 158 else ref

    def gt(ref):  # số/chữ nhập; ô công thức thì lấy giá trị Excel đã tính, không có thì tính biểu thức số đơn giản
        ref = doi(ref)
        f, v = wf[ref].value, wv[ref].value
        if isinstance(f, str) and f.startswith('='):
            if v is not None:
                return v
            bt = f[1:]
            for r in set(re.findall(r'\b[A-Z]{1,2}\d+\b', bt)):
                bt = re.sub(r'\b%s\b' % r, repr(gt_tho(r)), bt)
            return eval(bt, {'__builtins__': {}}) if re.fullmatch(r'[\d.\s+\-*/()e]+', bt) else None
        return f

    def gt_tho(ref):  # ô tham chiếu trong công thức: đã là địa chỉ thật của file
        v = wv[ref].value
        return v if v is not None else wf[ref].value

    so = lambda x: isinstance(x, (int, float)) and not isinstance(x, bool)
    if not (so(gt('H14')) and so(gt('F62'))):
        raise SystemExit(2)
    sl = {}
    for k in ('mo_ta', 'S', 'i_min', 'n', 'q1', 'K_gpm', 'Q_ngoai_nha', 'Z', 'doi_xung', 'mang'):
        o = BD[k]['o']
        v = gt(o[0] if isinstance(o, list) else o)
        if v is not None:
            sl[k] = v
    sl['Q_min'] = gt('H17')
    for k in ('nhanh_trai', 'nhanh_phai', 'ong_chinh'):
        ds = []
        for h in BD[k]:
            dn, l = gt(h['dn']), gt(h['l'])
            if not (so(dn) and dn > 0):
                break  # DN trống: chuỗi dừng như trong Excel (#N/A); chiều dài trống Excel tính là 0
            ds.append({'dn': dn, 'l': l if so(l) else 0})
        sl[k] = ds
    vong = [{'dn': gt(h['dn']), 'l': gt(h['l']) or 0} for h in BD['vong']]
    vong[-1]['ca'] = True  # dòng F-J: cả lưu lượng từ ống góp bơm
    sl['vong'] = [d for d in vong if d['l']]
    sl['hong'] = {k: gt(v['o']) for k, v in BD['hong'].items() if k in ('so_tia', 'q_tia', 'P_lang', 'L_voi', 'Kp', 'L_1', 'A_1', 'L_2', 'A_2')}
    m = str(sl.get('mang') or wv[doi('B183')].value or '')
    sl['mang'] = 'cut' if re.search(r'cụt', m, re.I) else 'vong'
    return sl


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    print(json.dumps(doc(sys.argv[1]), ensure_ascii=False, indent=1))
