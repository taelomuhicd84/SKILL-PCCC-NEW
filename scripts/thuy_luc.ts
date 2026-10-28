// Tính thủy lực sprinkler (TCVN 7336 Phụ lục B) và xuất ra Excel mẫu.
// npx tsx scripts/thuy_luc.ts tinh   <so_lieu.json>            [--excel ra.xlsx]   tính/kiểm theo số liệu bản vẽ
// npx tsx scripts/thuy_luc.ts so-bo  <mat_bang.json> <ra.json> [--excel ra.xlsx]   phương án sơ bộ khi chỉ có mặt bằng
// npx tsx scripts/thuy_luc.ts toi-uu <so_lieu.json>  <ra.json> [--excel ra.xlsx]   so 4 phương án, ghi phương án PB thấp nhất
// so_lieu.json theo khóa bang_tinh/thuy_luc/o_nhap.json, hoặc đưa thẳng file .xlsx theo mẫu (tự đọc, tự nhận diện đối xứng, vòng/cụt);
// mat_bang.json theo kiểu MatBang (shared/src/thuy_luc.ts).
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { tinhThuyLuc, soBoThuyLuc, toiUuThuyLuc, nhanDienMang, ONG_THEP } from "../shared/src/thuy_luc";

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

// Excel mẫu có đúng 4 dòng vòng nối cứng: 3 dòng chia đôi lưu lượng rồi 1 dòng cả lưu lượng (F-J). Dòng thiếu ghi L = 0.
// Thừa đoạn thì quy về chiều dài tương đương cùng DN (cùng Q nên ΔP = Q²·L/(100·KT) không đổi: L' = L·KT(DN')/KT(DN)).
function vongMau(vong: { dn: number; l: number; kt?: number; ca?: boolean }[]) {
  const kt = (d: { dn: number; kt?: number }) => d.kt ?? ONG_THEP[d.dn].kt;
  const quy = (ds: typeof vong) => (ds.length ? [{ dn: ds[0].dn, l: +ds.reduce((t, d) => t + (d.l * kt(ds[0])) / kt(d), 0).toFixed(2) }] : []);
  const tho = vong.filter((d) => !d.ca).map(({ dn, l, kt }) => ({ dn, l, kt }));
  const nua = tho.length <= 3 ? tho : quy(tho), ca = vong.filter((d) => d.ca);
  const caMau = ca.length > 1 ? quy([...ca].sort((x, y) => kt(y) - kt(x))) : ca;
  if (ca.length > 1) console.log(`Lưu ý: ${ca.length} đoạn cả lưu lượng gộp thành DN${caMau[0].dn} dài tương đương ${caMau[0].l} m trong Excel (cùng tổn thất).`);
  if (tho.length > 3) console.log(`Lưu ý: ${tho.length} đoạn chia đôi gộp thành DN${nua[0].dn} dài tương đương ${nua[0].l} m trong Excel.`);
  const dn0 = nua[0]?.dn ?? caMau[0]?.dn ?? 125;
  return [0, 1, 2].map((i) => (nua[i] ? { dn: nua[i].dn, l: nua[i].l } : { dn: dn0, l: 0 })).concat(caMau[0] ? { dn: caMau[0].dn, l: caMau[0].l } : { dn: dn0, l: 0 });
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
  const nd = nhanDienMang(soLieu);
  json.doi_xung = nd.doi_xung && !nd.mot_phia ? "Đối xứng với nhánh phải" : "Không đối xứng với nhánh phải";
  json.so_nhanh = nd.mot_phia ? "1 nhánh" : "2 nhánh";
  if (nd.mot_phia) json.nhanh_phai = [];
  delete json.mot_phia;
  json.mach_vt = soLieu.vt_rieng ? "SP và VT riêng" : "SP + VT chung";
  delete json.vt_rieng;
  json.mang = soLieu.mang === "cut" ? "Mạch cụt" : "Mạch vòng";
  for (const k of Object.keys(json)) if (json[k] === undefined) delete json[k];
  if (K) console.log("Lưu ý: Excel mẫu dùng K_gpm, không nhận K l/(s·MPa^0,5).");
  const tam = path.join(path.dirname(excel), path.basename(excel, ".xlsx") + "_so_lieu.json");
  writeFileSync(tam, JSON.stringify(json, null, 2));
  const r = spawnSync("python", [path.join(import.meta.dirname, "xuat_thuy_luc_excel.py"), tam, excel], { encoding: "utf8", env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
  process.stdout.write(r.stdout + r.stderr);
  if (r.status) process.exit(r.status);
}
