// Xuất .xlsx tối giản (một sheet, không cần thư viện Excel): chuỗi, số, công thức; dòng in đậm theo chỉ số.
import JSZip from "jszip";

export type O = string | number | { f: string };
const cot = (i: number) => String.fromCharCode(65 + i); // shortcut: tối đa 26 cột (A–Z), cần nhiều hơn thì viết lại
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function taoXlsx(ten: string, dong: O[][], dam: number[] = [], rong: number[] = []): Promise<Blob> {
  const rows = dong.map((r, y) => `<row r="${y + 1}">${r.map((o, x) => {
    const ref = cot(x) + (y + 1), s = dam.includes(y) ? ' s="1"' : "";
    if (typeof o === "number") return `<c r="${ref}"${s}><v>${o}</v></c>`;
    if (typeof o === "string") return o === "" ? "" : `<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${esc(o)}</t></is></c>`;
    return `<c r="${ref}"${s}><f>${esc(o.f)}</f></c>`;
  }).join("")}</row>`).join("");
  const cols = rong.length ? `<cols>${rong.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join("")}</cols>` : "";
  const X = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  const NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main", R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
  const z = new JSZip();
  const put = (f: string, d: string) => z.file(f, d, { createFolders: false }); // Excel không cần mục thư mục
  put("[Content_Types].xml", `${X}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`);
  put("_rels/.rels", `${X}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${R}/officeDocument" Target="xl/workbook.xml"/></Relationships>`);
  put("xl/workbook.xml", `${X}<workbook xmlns="${NS}" xmlns:r="${R}"><sheets><sheet name="${esc(ten.slice(0, 31))}" sheetId="1" r:id="rId1"/></sheets></workbook>`);
  put("xl/_rels/workbook.xml.rels", `${X}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${R}/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="${R}/styles" Target="styles.xml"/></Relationships>`);
  put("xl/styles.xml", `${X}<styleSheet xmlns="${NS}"><fonts count="2"><font><sz val="11"/><name val="Arial"/></font><font><b/><sz val="11"/><name val="Arial"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="2"><xf fontId="0"/><xf fontId="1" applyFont="1"/></cellXfs></styleSheet>`);
  put("xl/worksheets/sheet1.xml", `${X}<worksheet xmlns="${NS}">${cols}<sheetData>${rows}</sheetData></worksheet>`);
  return z.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}
