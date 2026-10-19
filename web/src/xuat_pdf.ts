// Ghi chú lên bản vẽ: khung đánh số (trùng số khung trong bảng), nhãn ngắn, comment PDF, trang tổng hợp cuối.
import { PDFDocument, PDFName, PDFHexString, PDFFont, PDFPage, rgb, degrees, type RGB } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fontUrl from "dejavu-fonts-ttf/ttf/DejaVuSans.ttf?url";
import fontBoldUrl from "dejavu-fonts-ttf/ttf/DejaVuSans-Bold.ttf?url";
import { NHAN_KET_LUAN, demKetLuan, timAnchor, viewportDung, type DongKetQua, type TrangChu } from "@pccc/shared";
import type { PdfDoc } from "./pdf";

export const MAU: Record<string, [number, number, number]> = {
  CHUA_DAT: [0.85, 0.1, 0.1], CAN_XAC_NHAN: [0.9, 0.5, 0], CHINH: [0.1, 0.35, 0.8], DAT: [0.1, 0.5, 0.33], KHONG_AP_DUNG: [0.45, 0.45, 0.45], HUONG_DAN: [0.05, 0.55, 0.2],
};
export const mauDong = (d: DongKetQua) => (d.ket_luan === "CHUA_DAT" || d.ket_luan === "CAN_XAC_NHAN" ? MAU[d.ket_luan] : d.chinh_ban_ve ? MAU.CHINH : MAU[d.ket_luan]);
export const nhanDong = (d: DongKetQua) =>
  d.ket_luan === "CHUA_DAT" || d.ket_luan === "CAN_XAC_NHAN" ? NHAN_KET_LUAN[d.ket_luan] : d.chinh_ban_ve ? "CHỈNH BẢN VẼ" : NHAN_KET_LUAN[d.ket_luan];

/** Vị trí khung (toạ độ 0–1000 trên trang đã xoay đứng) cho từng dòng có khung. */
export function khungCuaDong(d: DongKetQua, chu: TrangChu[]): { trang: number; r: [number, number, number, number] }[] {
  const out: { trang: number; r: [number, number, number, number] }[] = [];
  for (const v of d.vi_tri ?? []) {
    const t = chu.find((c) => c.trang === v.trang);
    const r = (v.anchor && timAnchor(t, v.anchor)) || (v.bbox?.length === 4 ? (v.bbox as [number, number, number, number]) : null);
    if (r && t) out.push({ trang: v.trang, r });
  }
  return out;
}

function boChu(font: PDFFont, text: string, size: number, maxW: number): string[] {
  const lines: string[] = [];
  for (const para of text.split("\n")) {
    let cur = "";
    for (const w of para.split(/\s+/)) {
      const t = cur ? cur + " " + w : w;
      if (font.widthOfTextAtSize(t, size) > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
    }
    lines.push(cur);
  }
  return lines;
}

/** Khung = chú thích Square của PDF: viền hiện trên bản vẽ, bấm vào khung thì hiện comment (kèm Popup cho trình đọc cần). */
function themComment(doc: PDFDocument, page: PDFPage, rect: number[], tieuDe: string, text: string, c: number[], dayNet: number) {
  const ctx = doc.context;
  const annot = ctx.obj({
    Type: "Annot", Subtype: "Square", Rect: rect, C: c, BS: { Type: "Border", W: dayNet, S: "S" },
    Contents: PDFHexString.fromText(text), T: PDFHexString.fromText("Thẩm định PCCC"), Subj: PDFHexString.fromText(tieuDe), F: 4,
  });
  const ref = ctx.register(annot);
  const popup = ctx.register(ctx.obj({ Type: "Annot", Subtype: "Popup", Rect: [rect[2], rect[3] - 120, rect[2] + 260, rect[3]], Parent: ref, Open: false, F: 28 }));
  annot.set(PDFName.of("Popup"), popup);
  const annots = page.node.lookup(PDFName.of("Annots"));
  if (annots && "push" in annots) { const a = annots as unknown as { push: (r: unknown) => void }; a.push(ref); a.push(popup); }
  else page.node.set(PDFName.of("Annots"), ctx.obj([ref, popup]));
}

export async function xuatPdf(pdfBytes: ArrayBuffer, pdfjsDoc: PdfDoc, chu: TrangChu[], dong: DongKetQua[], tieuDe: string, huongDan: boolean): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  doc.registerFontkit(fontkit);
  const [font, bold] = await Promise.all([fontUrl, fontBoldUrl].map(async (u) => doc.embedFont(await (await fetch(u)).arrayBuffer(), { subset: true })));
  const pages = doc.getPages();
  pages.forEach((p, i) => { const t = chu[i]; if (t) p.setRotation(degrees(t.xoay)); }); // xoay đứng như khi AI đọc

  for (const d of dong) {
    if (!d.khung) continue;
    const [cr, cg, cb] = mauDong(d);
    const col: RGB = rgb(cr, cg, cb);
    for (const k of khungCuaDong(d, chu)) {
      const t = chu.find((c) => c.trang === k.trang)!;
      const page = pages[k.trang - 1];
      if (!page) continue;
      const vp = viewportDung(await pdfjsDoc.getPage(k.trang), t.xoay);
      const W = vp.width, H = vp.height;
      const toPdf = (x: number, y: number) => vp.convertToPdfPoint(x, y) as [number, number];
      const [x0, y0, x1, y1] = [k.r[0] * W / 1000, k.r[1] * H / 1000, k.r[2] * W / 1000, k.r[3] * H / 1000];
      const P = [toPdf(x0, y0), toPdf(x1, y0), toPdf(x1, y1), toPdf(x0, y1)];
      const fs = Math.min(14, Math.max(6, W / 170));
      // số khung trong vòng tròn ở góc trên-trái
      const c0 = toPdf(x0, y0);
      page.drawCircle({ x: c0[0], y: c0[1], size: fs * 0.9, color: col });
      const sNum = String(d.khung);
      const nw = bold.widthOfTextAtSize(sNum, fs);
      const np = toPdf(x0 - nw / 2, y0 + fs * 0.35);
      page.drawText(sNum, { x: np[0], y: np[1], size: fs, font: bold, color: rgb(1, 1, 1), rotate: degrees(t.xoay) });
      const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]);
      themComment(doc, page, [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], `Khung ${d.khung} – ${nhanDong(d)}`,
        `Khung ${d.khung} – ${nhanDong(d)} (${d.bang} TT ${d.tt})\n${d.ly_do}\n${d.dieu_khoan}${d.chinh_ban_ve ? "\nChỉnh bản vẽ: " + d.chinh_ban_ve : ""}${huongDan && d.huong_dan ? "\nHướng dẫn: " + d.huong_dan : ""}`,
        [cr, cg, cb], fs / 4);
    }
  }

  // trang tổng hợp (A4 ngang)
  const c = demKetLuan(dong);
  const muc: { text: string; col: [number, number, number]; b?: boolean }[] = [
    { text: `TỔNG HỢP THẨM ĐỊNH PCCC – ${tieuDe}`, col: [0, 0, 0], b: true },
    { text: `Đã xét ${dong.length} dòng: ĐẠT ${c.DAT} · CHƯA ĐẠT ${c.CHUA_DAT} · CẦN XÁC NHẬN ${c.CAN_XAC_NHAN} · KHÔNG ÁP DỤNG ${c.KHONG_AP_DUNG} · chỉnh bản vẽ ${c.chinh_ban_ve}. Màu: đỏ CHƯA ĐẠT, cam CẦN XÁC NHẬN, xanh dương CHỈNH BẢN VẼ.`, col: [0.3, 0.3, 0.3] },
    { text: "Kết quả do hệ thống hỗ trợ lập, số đo trên bản vẽ là ước lượng; cần người có chuyên môn rà lại trước khi sử dụng.", col: [0.5, 0.2, 0.2] },
    ...dong.filter((d) => d.khung).map((d) => ({
      text: `${d.khung}. [${nhanDong(d)}] ${d.bang} TT ${d.tt || "#" + d.idx}: ${d.ly_do}${d.chinh_ban_ve ? " | Chỉnh bản vẽ: " + d.chinh_ban_ve : ""} (${d.dieu_khoan})`,
      col: mauDong(d),
    })),
  ];
  if (huongDan) {
    const hd = dong.filter((d) => d.huong_dan);
    if (hd.length) muc.push({ text: "HƯỚNG DẪN THIẾT KẾ", col: MAU.HUONG_DAN, b: true },
      ...hd.map((d) => ({ text: `${d.khung ? "Khung " + d.khung + " – " : ""}${d.bang} TT ${d.tt || "#" + d.idx}: ${d.huong_dan}`, col: MAU.HUONG_DAN })));
  }
  let pg = doc.addPage([842, 595]);
  let y = 560;
  for (const m of muc) {
    const f = m.b ? bold : font, size = m.b ? 12 : 8.5;
    for (const ln of boChu(f, m.text, size, 780)) {
      if (y < 30) { pg = doc.addPage([842, 595]); y = 560; }
      pg.drawText(ln, { x: 30, y, size, font: f, color: rgb(...m.col) });
      y -= size * 1.35;
    }
    y -= 3;
  }
  return doc.save();
}
