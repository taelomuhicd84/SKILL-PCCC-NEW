"""Thư viện mẫu giải pháp PCCC (data/mau_giai_phap/*.json): mục lục, lọc theo công trình, sinh HTML.

  python scripts/mau_giai_phap.py muc-luc
  python scripts/mau_giai_phap.py loc --F F2 --cao 13.6 --tang 4 --dt 250 --nguoi 60 --ham 0 --cong-nang karaoke
  python scripts/mau_giai_phap.py html            (ra data/mau_giai_phap/thu_vien.html)
  python scripts/mau_giai_phap.py --tu-kiem
Thiếu số liệu nào thì bỏ tham số đó: mẫu không bị loại, ghi vào 'can_xac_nhan'.
"""
import argparse
import glob
import html
import json
import os
import sys

GOC = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'mau_giai_phap')


def tai():
    return [m for f in sorted(glob.glob(os.path.join(GOC, '*.json'))) for m in json.load(open(f, encoding='utf-8'))['mau']]


def xet(loc, ct):
    """Trả (hợp, thiếu): hợp=False khi công trình vi phạm một điều kiện lọc; thiếu = điều kiện chưa có số liệu."""
    if loc.get('luon'):
        return True, []
    thieu = []

    def can(k):
        if ct.get(k) is None:
            thieu.append(k)
            return False
        return True
    if 'F' in loc and can('F') and not any(ct['F'].startswith(f) or f.startswith(ct['F']) for f in loc['F']):
        return False, []
    for k, kct, lon in (('cao_min', 'cao', True), ('cao_max', 'cao', False), ('tang_min', 'tang', None), ('tang_max', 'tang', False),
                        ('dt_tang_max', 'dt', False), ('nguoi_tang_max', 'nguoi', False)):
        if k in loc and can(kct):
            v = ct[kct]
            if (lon is True and not v > loc[k]) or (lon is None and v < loc[k]) or (lon is False and v > loc[k]):
                return False, []
    if loc.get('ham') and can('ham') and not ct['ham']:
        return False, []
    if 'tu_khoa' in loc and can('cong_nang') and not any(t in ct['cong_nang'].lower() for t in loc['tu_khoa']):
        return False, []
    return True, sorted(set(thieu))


def loc_mau(ct, ds=None):
    ra = []
    for m in ds if ds is not None else tai():
        hop, thieu = xet(m['loc'], ct)
        if hop:
            ra.append(dict(m, can_xac_nhan=thieu) if thieu else m)
    return ra


def html_trang(ds):
    e = html.escape
    muc = {}
    for m in ds:
        muc.setdefault(m['muc'], []).append(m)
    ml = ''.join(f'<li><b>{e(k)}</b><ul>' + ''.join(f'<li><a href="#{m["id"]}">{e(m["ten"])}</a></li>' for m in v) + '</ul></li>' for k, v in muc.items())
    the = []
    for m in ds:
        yc = ''.join(f'<li>{e(y["y"])} <i>({e(y["dieu"])})</i></li>' for y in m['yeu_cau'])
        nd = ''.join(f'<li><b>{k.replace("_", " ")}:</b> {e(v)}</li>' for k, v in m['nhan_dien'].items() if v)
        li = lambda xs: ''.join(f'<li>{e(x)}</li>' for x in xs)  # noqa: E731
        the.append(f'''<section id="{m["id"]}" data-loc='{e(json.dumps(m["loc"], ensure_ascii=False))}'>
<h3>{e(m["ten"])} <small>{e(m["muc"])} · lọc: {e(json.dumps(m["loc"], ensure_ascii=False))}</small></h3>
<p>{e(m["dung_khi"])}</p><h4>Yêu cầu</h4><ul>{yc}</ul><h4>Nhận diện trên bản vẽ</h4><ul>{nd}</ul>
<h4>Lỗi hay gặp</h4><ul>{li(m["loi_hay_gap"])}</ul><h4>Giải pháp</h4><ul>{li(m["giai_phap"])}</ul>
<p class="ng">Nguồn: {e(", ".join(m["nguon"] + ["thẻ " + t for t in m["the"]]))}</p></section>''')
    return f'''<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mẫu giải pháp PCCC</title><style>
:root{{--n:#fff;--c:#1a1a1a;--m:#666;--v:#ddd;--a:#b3261e}}
@media (prefers-color-scheme:dark){{:root{{--n:#161616;--c:#e8e8e8;--m:#999;--v:#333;--a:#ff8a80}}}}
body{{background:var(--n);color:var(--c);font:15px/1.5 system-ui,sans-serif;max-width:960px;margin:auto;padding:16px}}
section{{border-top:1px solid var(--v);padding:8px 0}}section.an{{display:none}}h3 small{{color:var(--m);font-weight:400;font-size:12px}}
h4{{margin:6px 0 2px}}.ng{{color:var(--m);font-size:13px}}a{{color:var(--a)}}form{{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}}
input{{width:110px;padding:4px;background:var(--n);color:var(--c);border:1px solid var(--v)}}</style></head><body>
<h1>Mẫu giải pháp PCCC</h1><p class="ng">Sinh từ data/mau_giai_phap/*.json bằng scripts/mau_giai_phap.py html. Không sửa tay.</p>
<form id="f" oninput="loc()"><input name="F" placeholder="Nhóm F (F2.1)"><input name="cao" placeholder="Cao PCCC m"><input name="tang" placeholder="Số tầng">
<input name="dt" placeholder="m2/tầng"><input name="nguoi" placeholder="Người/tầng"><input name="cong_nang" placeholder="Công năng"><label><input type="checkbox" name="ham" style="width:auto">Có hầm</label></form>
<p id="dem" class="ng"></p><h2>Mục lục</h2><ul>{ml}</ul>{"".join(the)}
<script>
function xet(l,c){{if(l.luon)return true;const s=k=>c[k]!==null&&c[k]!==undefined;
if(l.F&&s('F')&&!l.F.some(f=>c.F.startsWith(f)||f.startsWith(c.F)))return false;
if('cao_min'in l&&s('cao')&&!(c.cao>l.cao_min))return false;if('cao_max'in l&&s('cao')&&c.cao>l.cao_max)return false;
if('tang_min'in l&&s('tang')&&c.tang<l.tang_min)return false;if('tang_max'in l&&s('tang')&&c.tang>l.tang_max)return false;
if('dt_tang_max'in l&&s('dt')&&c.dt>l.dt_tang_max)return false;if('nguoi_tang_max'in l&&s('nguoi')&&c.nguoi>l.nguoi_tang_max)return false;
if(l.ham&&c.ham===false)return false;if(l.tu_khoa&&s('cong_nang')&&!l.tu_khoa.some(t=>c.cong_nang.toLowerCase().includes(t)))return false;return true}}
function loc(){{const f=document.getElementById('f'),c={{}};for(const k of['F','cong_nang']){{const v=f[k].value.trim();c[k]=v||null}}
for(const k of['cao','tang','dt','nguoi']){{const v=parseFloat(f[k].value.replace(',','.'));c[k]=isNaN(v)?null:v}}c.ham=f.ham.checked;let n=0;
document.querySelectorAll('section').forEach(s=>{{const ok=xet(JSON.parse(s.dataset.loc),c);s.classList.toggle('an',!ok);n+=ok;
const a=document.querySelector('a[href="#'+s.id+'"]');if(a)a.parentElement.style.display=ok?'':'none'}});
document.getElementById('dem').textContent=n+' / '+document.querySelectorAll('section').length+' mẫu hợp công trình'}}loc()
</script></body></html>'''


def tu_kiem():
    ds = [{'id': 'a', 'loc': {'luon': True}}, {'id': 'b', 'loc': {'F': ['F2', 'F3'], 'cao_max': 15, 'nguoi_tang_max': 20}},
          {'id': 'c', 'loc': {'cao_min': 28}}, {'id': 'd', 'loc': {'tu_khoa': ['karaoke']}}, {'id': 'e', 'loc': {'ham': True}}]
    ids = lambda ct: [m['id'] for m in loc_mau(ct, ds)]  # noqa: E731
    assert ids({'F': 'F2.1', 'cao': 13.6, 'nguoi': 15, 'cong_nang': 'Karaoke', 'ham': False}) == ['a', 'b', 'd'], ids
    assert ids({'F': 'F2.1', 'cao': 13.6, 'nguoi': 60, 'cong_nang': 'nhà hàng', 'ham': True}) == ['a', 'e']
    assert ids({'F': 'F1.3', 'cao': 28}) == ['a', 'd', 'e']  # 28 m không "lớn hơn 28"; thiếu công năng, hầm thì giữ
    assert loc_mau({}, ds)[1]['can_xac_nhan'] == ['F', 'cao', 'nguoi']
    that = tai()
    assert len({m['id'] for m in that}) == len(that), 'trùng id'
    for m in that:
        assert {'id', 'ten', 'muc', 'loc', 'dung_khi', 'yeu_cau', 'nhan_dien', 'loi_hay_gap', 'giai_phap', 'nguon', 'the'} <= m.keys(), m['id']
    print('tự kiểm đạt,', len(that), 'mẫu')


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    if sys.argv[1:] == ['--tu-kiem']:
        tu_kiem()
        sys.exit()
    p = argparse.ArgumentParser()
    p.add_argument('lenh', choices=['muc-luc', 'loc', 'html'])
    p.add_argument('ra', nargs='?')
    p.add_argument('--F'), p.add_argument('--cao', type=float), p.add_argument('--tang', type=int)
    p.add_argument('--dt', type=float), p.add_argument('--nguoi', type=int), p.add_argument('--ham', type=int), p.add_argument('--cong-nang')
    a = p.parse_args()
    if a.lenh == 'muc-luc':
        for m in tai():
            print(f"{m['id']} | {m['muc']} | {m['ten']} | {json.dumps(m['loc'], ensure_ascii=False)}")
    elif a.lenh == 'loc':
        ct = {'F': a.F, 'cao': a.cao, 'tang': a.tang, 'dt': a.dt, 'nguoi': a.nguoi,
              'ham': None if a.ham is None else bool(a.ham), 'cong_nang': a.cong_nang}
        print(json.dumps(loc_mau(ct), ensure_ascii=False, indent=1))
    else:
        ra = a.ra or os.path.join(GOC, 'thu_vien.html')
        open(ra, 'w', encoding='utf-8').write(html_trang(tai()))
        print('đã ghi', ra)
