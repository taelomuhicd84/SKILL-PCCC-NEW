// Trích chữ có vị trí từ PDF bằng pdf.js (dùng được cả trên web và Node).
// Trang được "xoay đứng" theo hướng chữ chiếm đa số (như scripts/prep_for_llm.py), toạ độ chuẩn hoá 0–1000.
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Chu { id: number; x0: number; y0: number; x1: number; y1: number; s: string }
export interface TrangChu { trang: number; xoay: number; rong: number; cao: number; chu: Chu[] }

/** Góc xoay (độ, theo chiều kim đồng hồ của pdf.js) để chữ đa số nằm ngang. */
function gocXoay(items: any[]): number {
  const dem = new Map<number, number>();
  for (const it of items) {
    if (!it.str?.trim()) continue;
    const [a, b] = it.transform;
    const g = (Math.round(Math.atan2(b, a) / (Math.PI / 2)) * 90 + 360) % 360; // góc chữ ngược chiều kim đồng hồ
    dem.set(g, (dem.get(g) ?? 0) + it.str.length);
  }
  let best = 0, n = -1;
  for (const [g, c] of dem) if (c > n) { best = g; n = c; }
  return best;
}

export function viewportDung(page: any, xoay: number) {
  return page.getViewport({ scale: 1, rotation: xoay });
}

export async function trichChuTrang(page: any, so: number): Promise<TrangChu> {
  const tc = await page.getTextContent();
  const items = tc.items as any[];
  const xoay = gocXoay(items);
  const vp = viewportDung(page, xoay);
  const W = vp.width, H = vp.height;
  const chu: Chu[] = [];
  for (const it of items) {
    const s = (it.str ?? "").trim();
    if (!s) continue;
    const [a, b, , , e, f] = it.transform;
    const len = Math.hypot(a, b) || 1;
    const dx = a / len, dy = b / len; // hướng chữ
    const w = it.width ?? 0, h = it.height || len;
    const pts = [[e, f], [e + dx * w, f + dy * w], [e - dy * h, f + dx * h], [e + dx * w - dy * h, f + dy * w + dx * h]]
      .map(([x, y]) => vp.convertToViewportPoint(x, y));
    const xs = pts.map((p: number[]) => p[0]), ys = pts.map((p: number[]) => p[1]);
    chu.push({
      id: chu.length, s,
      x0: Math.round((Math.min(...xs) / W) * 1000), y0: Math.round((Math.min(...ys) / H) * 1000),
      x1: Math.round((Math.max(...xs) / W) * 1000), y1: Math.round((Math.max(...ys) / H) * 1000),
    });
  }
  return { trang: so, xoay, rong: W, cao: H, chu };
}

export async function trichChu(pdf: any, onTrang?: (i: number, n: number) => void): Promise<TrangChu[]> {
  const out: TrangChu[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    out.push(await trichChuTrang(await pdf.getPage(i), i));
    onTrang?.(i, pdf.numPages);
  }
  return out;
}

/** Văn bản gọn cho AI: mỗi dòng "x y chữ" (góc trên-trái). Gộp chữ gần nhau cùng hàng để giảm token. */
export function vanBanTrang(t: TrangChu): string {
  const rows = [...t.chu].sort((p, q) => p.y0 - q.y0 || p.x0 - q.x0);
  return rows.map((c) => `${c.x0} ${c.y0} ${c.s}`).join("\n");
}

const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().replace(/\s+/g, " ").trim();

/** Tìm chữ bám (anchor) trên trang → bbox 0–1000 (đã nới rộng một chút). Khớp đúng trước, chứa sau. */
export function timAnchor(t: TrangChu | undefined, anchor: string): [number, number, number, number] | null {
  if (!t || !anchor) return null;
  const q = fold(anchor);
  const hit = t.chu.find((c) => fold(c.s) === q) ?? t.chu.find((c) => fold(c.s).includes(q)) ?? t.chu.find((c) => q.includes(fold(c.s)) && c.s.length >= 3);
  if (!hit) return null;
  const p = 6;
  return [Math.max(0, hit.x0 - p), Math.max(0, hit.y0 - p), Math.min(1000, hit.x1 + p), Math.min(1000, hit.y1 + p)];
}
