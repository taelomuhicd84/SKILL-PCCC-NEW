// Tính thủy lực sprinkler (TCVN 7336 Phụ lục B) và xuất ra Excel mẫu.
// npx tsx scripts/thuy_luc.ts tinh   <so_lieu.json>            [--excel ra.xlsx]   tính/kiểm theo số liệu bản vẽ
// npx tsx scripts/thuy_luc.ts so-bo  <mat_bang.json> <ra.json> [--excel ra.xlsx]   phương án sơ bộ khi chỉ có mặt bằng
// npx tsx scripts/thuy_luc.ts toi-uu <so_lieu.json>  <ra.json> [--excel ra.xlsx]   so 4 phương án, ghi phương án PB thấp nhất
// so_lieu.json theo khóa bang_tinh/thuy_luc/o_nhap.json, hoặc đưa thẳng file .xlsx theo mẫu (tự đọc, tự nhận diện đối xứng, vòng/cụt);
// mat_bang.json theo kiểu MatBang (shared/src/thuy_luc.ts).
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { tinhThuyLuc, soBoThuyLuc, toiUuThuyLuc, nhanDienMang } from "../shared/src/thuy_luc";

const a = process.argv.slice(2);
const iEx = a.indexOf("--excel");
const excel = iEx >= 0 ? a.splice(iEx, 2)[1] : null;
const [viec, vao, ra] = a;
if (!viec || !vao) { console.log(readFileSync(import.meta.filename, "utf8").split("\n").slice(1, 5).join("\n")); process.exit(1); }
function docVao(f: string) {
  if (!/\.xlsx$/i.test(f)) return JSON.parse(readFileSync(f, "utf8"));
  const r = spawnSync("python", [path.join(import.meta.dirname, "doc_thuy_luc_excel.py"), f], { encoding: "utf8", env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
  if (r.status === 2) throw new Error("File Excel không theo mẫu bang_tinh/thuy_luc: đọc tay, ghi so_lieu.json theo o_nhap.json");
  if (r.status) throw new Error(r.stderr);
  return JSON.parse(r.stdout);
}
const doc = docVao(vao);
const tron = (o: unknown) => JSON.stringify(o, (_k, v) => (typeof v === "number" ? +v.toFixed(4) : v), 2);

// Excel mẫu có đúng 4 dòng vòng nối cứng: 3 dòng chia đôi lưu lượng rồi 1 dòng cả lưu lượng (F-J). Đoạn cùng DN cộng dồn chiều dài
// (ΔP tỉ lệ L nên không đổi kết quả), dòng thiếu ghi L = 0.
function vongMau(vong: { dn: number; l: number; ca?: boolean }[]) {
  const gop = (ds: typeof vong) => Object.values(ds.reduce((m, d) => ((m[d.dn] = { dn: d.dn, l: (m[d.dn]?.l ?? 0) + d.l }), m), {} as Record<number, { dn: number; l: number }>));
  const tho = vong.filter((d) => !d.ca).map(({ dn, l }) => ({ dn, l }));
  const nua = tho.length <= 3 ? tho : gop(tho), ca = gop(vong.filter((d) => d.ca)); // giữ nguyên khi đủ chỗ: áp họng so tại cuối đoạn đầu
  if (nua.length > 3 || ca.length > 1) throw new Error("Vòng có quá nhiều cỡ ống cho Excel mẫu (tối đa 3 DN chia đôi + 1 DN cả lưu lượng)");
  const dn0 = nua[0]?.dn ?? ca[0]?.dn ?? 125;
  return [0, 1, 2].map((i) => nua[i] ?? { dn: dn0, l: 0 }).concat(ca[0] ?? { dn: dn0, l: 0 });
}

let soLieu = doc;
if (viec === "tinh") {
  const { hang, ...kq } = tinhThuyLuc(doc);
  console.log(tron({ ...kq, hang: hang.map((h, i) => `nút ${i + 1}: Q=${h.Q.toFixed(2)} P=${h.P.toFixed(4)}`) }));
} else if (viec === "so-bo") {
  const sb = soBoThuyLuc(doc);
  soLieu = sb.so_lieu;
  const { hang, ...kq } = sb.ket_qua;
  console.log(tron({ gia_dinh: sb.gia_dinh, ket_qua: kq }));
} else if (viec === "toi-uu") {
  const pa = toiUuThuyLuc(doc);
  console.log(tron(pa.map(({ so_lieu, ...p }) => p)));
  soLieu = pa.find((p) => !p.canhBao.length)?.so_lieu ?? pa[0].so_lieu;
} else throw new Error(`Việc "${viec}" không có (tinh | so-bo | toi-uu)`);

if (ra) { writeFileSync(ra, JSON.stringify(soLieu, null, 2)); console.log(`Đã ghi số liệu: ${ra}`); }
if (excel) {
  // Khóa không có trong o_nhap.json (kt, ca, PH, K) chỉ dùng cho tính; bỏ trước khi ghi Excel.
  const { K, PH, ...x } = soLieu;
  const sach = (ds?: { dn: number; l: number }[]) => ds?.map(({ dn, l }) => ({ dn, l }));
  const json = { ...x, nhanh_trai: sach(x.nhanh_trai), nhanh_phai: sach(x.nhanh_phai), ong_chinh: sach(x.ong_chinh), vong: vongMau(x.vong ?? []) };
  json.doi_xung = nhanDienMang(soLieu).doi_xung ? "Đối xứng với nhánh phải" : "Không đối xứng với nhánh phải";
  json.mang = soLieu.mang === "cut" ? "Mạch cụt" : "Mạch vòng";
  for (const k of Object.keys(json)) if (json[k] === undefined) delete json[k];
  if (K) console.log("Lưu ý: Excel mẫu dùng K_gpm, không nhận K l/(s·MPa^0,5).");
  const tam = path.join(path.dirname(excel), path.basename(excel, ".xlsx") + "_so_lieu.json");
  writeFileSync(tam, JSON.stringify(json, null, 2));
  const r = spawnSync("python", [path.join(import.meta.dirname, "xuat_thuy_luc_excel.py"), tam, excel], { encoding: "utf8" });
  process.stdout.write(r.stdout + r.stderr);
  if (r.status) process.exit(r.status);
}
