// Điền kết quả vào bản mẫu bảng đối chiếu chính thức (.docx): giữ nguyên khung, chỉ ghi cột
// "Nội dung thiết kế" (ô 3) và "Kết luận" (ô 6) — cùng cách đếm dòng với scripts/bang_doi_chieu_tool.py main_rows().
import JSZip from "jszip";
import type { DongKetQua, ThongTin } from "@pccc/shared";
import { nhanDong } from "./xuat_pdf";

const W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const MAU_CHU: Record<string, string> = { "ĐẠT": "1B7F55", "CHƯA ĐẠT": "C0332B", "CẦN XÁC NHẬN": "B36B00", "KHÔNG ÁP DỤNG": "7B7A73", "CHỈNH BẢN VẼ": "2459A8" };

const con = (el: Element, ten: string) => Array.from(el.children).filter((c) => c.localName === ten && c.namespaceURI === W);
const chu = (el: Element) => Array.from(el.getElementsByTagNameNS(W, "t")).map((t) => t.textContent ?? "").join("");

function dongBang(xml: Document): Element[] {
  const body = xml.getElementsByTagNameNS(W, "body")[0];
  const out: Element[] = [];
  let bat = false;
  for (const tbl of con(body, "tbl")) for (const tr of con(tbl, "tr")) {
    const tcs = con(tr, "tc");
    if (!tcs.length) continue;
    if (chu(tcs[0]).trim() === "TT" && tcs.length >= 5) { bat = true; continue; }
    if (bat) out.push(tr);
  }
  return out;
}

function ghiO(xml: Document, tc: Element, phan: { t: string; b?: boolean; mau?: string; i?: boolean }[]) {
  const ps = con(tc, "p");
  const p0 = ps[0] ?? tc.appendChild(xml.createElementNS(W, "w:p"));
  ps.slice(1).forEach((p) => tc.removeChild(p));
  Array.from(p0.children).filter((c) => c.localName !== "pPr").forEach((c) => p0.removeChild(c));
  for (const ph of phan) {
    const r = xml.createElementNS(W, "w:r");
    const rpr = xml.createElementNS(W, "w:rPr");
    if (ph.b) rpr.appendChild(xml.createElementNS(W, "w:b"));
    if (ph.i) rpr.appendChild(xml.createElementNS(W, "w:i"));
    if (ph.mau) { const c = xml.createElementNS(W, "w:color"); c.setAttributeNS(W, "w:val", ph.mau); rpr.appendChild(c); }
    r.appendChild(rpr);
    const t = xml.createElementNS(W, "w:t");
    t.setAttribute("xml:space", "preserve");
    t.textContent = ph.t;
    r.appendChild(t);
    p0.appendChild(r);
  }
}

/** Ghi phần đầu (tên công trình, địa điểm…) vào đoạn văn bắt đầu bằng nhãn tương ứng. */
function ghiDau(xml: Document, tt: ThongTin | null) {
  if (!tt) return;
  const map: [RegExp, string][] = [[/^1\.\s*Tên công trình/, tt.ten_cong_trinh], [/^2\.\s*Địa điểm/, tt.dia_diem], [/^3\.\s*Chủ đầu tư/, tt.chu_dau_tu], [/^4\.\s*Cơ quan thiết kế/, tt.don_vi_thiet_ke]];
  const body = xml.getElementsByTagNameNS(W, "body")[0];
  for (const p of con(body, "p")) {
    const t = chu(p).trim();
    for (const [re, v] of map) if (v && re.test(t)) {
      const nhan = t.split(":")[0];
      ghiO(xml, p as Element, [{ t: `${nhan}: ${v}` }]);
    }
  }
}

export async function xuatDocx(mau: ArrayBuffer, dong: DongKetQua[], tt: ThongTin | null, huongDan: boolean): Promise<Blob> {
  const zip = await JSZip.loadAsync(mau);
  const xml = new DOMParser().parseFromString(await zip.file("word/document.xml")!.async("string"), "application/xml");
  ghiDau(xml, tt);
  const rows = dongBang(xml);
  for (const d of dong) {
    const tr = rows[d.idx];
    if (!tr) continue;
    const tcs = con(tr, "tc");
    if (tcs.length < 6) continue; // dòng tiêu đề gộp ô
    ghiO(xml, tcs[2], [{ t: d.noi_dung_thiet_ke }]);
    const nhan = nhanDong(d);
    const kl = d.ket_luan === "DAT" ? "ĐẠT" : d.ket_luan === "KHONG_AP_DUNG" ? "KHÔNG ÁP DỤNG" : nhan;
    const phan: { t: string; b?: boolean; mau?: string; i?: boolean }[] = [{ t: kl + ". ", b: true, mau: MAU_CHU[kl] }, { t: d.ly_do }];
    if (d.khung) phan.push({ t: ` [Khung ${d.khung}]`, b: true, mau: MAU_CHU[nhan] });
    if (d.chinh_ban_ve) phan.push({ t: ` [Chỉnh bản vẽ: ${d.chinh_ban_ve}]`, b: true, mau: MAU_CHU["CHỈNH BẢN VẼ"] });
    if (huongDan && d.huong_dan) phan.push({ t: ` Hướng dẫn thiết kế: ${d.huong_dan}`, i: true, mau: "0B8C33" });
    ghiO(xml, tcs[5], phan);
  }
  zip.file("word/document.xml", new XMLSerializer().serializeToString(xml));
  return zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}
