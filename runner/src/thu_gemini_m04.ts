// AGENT THỬ NGHIỆM RIÊNG CỦA GEMINI: Mục 4 (đường, bãi đỗ xe chữa cháy) chạy bằng Playwright + Chrome ẩn, 10 tab song song.
// Tách biệt hoàn toàn với agent Claude `m04-giao-thong`: không nằm trong shared/src/agents.ts, không sinh .claude/, không đụng lô/đệm của runner.
// Mục đích: so sánh Claude và Gemini ở cùng một việc (thời gian, số dòng khớp, độ ổn định) để chọn phương án.
//   npx tsx runner/src/thu_gemini_m04.ts <thu_muc_phien> [--bang KT18] [--luong 10 (tối đa)] [--gioi-han 32000] [--gian-cach-tab 15-30] [--che-do chia|lap] [--so-sanh <ket_qua.json>] [--thu-kho] [--chi-ghep]
//  <thu_muc_phien>: thư mục đã có ban_ve.pdf + thong_tin.json (do `cli chuan-bi` + agent doc-ho-so tạo).
//  --che-do chia (mặc định): gói các dòng tới sát giới hạn token đầu vào của Gemini (--gioi-han: 32000 không gói AI, 128000 AI Plus, 1000000 AI Pro/Ultra), số tab = số gói (việc ít thì ít tab, tối đa --luong).
//  --che-do lap: mỗi tab chạy ĐỦ mục 4 (10 lần giống nhau) để đo độ ổn định, kết luận theo đa số.
//  --so-sanh: ket_qua.json của Claude (đọc tay hoặc agent) để đếm số dòng Gemini khớp kết luận.
//  --thu-kho: chỉ ghi prompt, không mở Chrome.
// Cần cookie Gemini (runner/gemini_cookies.json). Ra: <thu_muc_phien>/gemini_m04/{jobs/, ket_qua.json, bao_cao.md}.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { AGENTS, agentById, chiaMuc, demKetLuan, docKetQuaJob, gop, promptJob, tachJson, ThongTin, type Bang, type DongBang, type Job, type KetQua, type KetQuaDong, type PromptCtx } from "@pccc/shared";
import { GOC_REPO, log } from "./chung";
import { BiChan, chayTrenTab, dongTrinhDuyet, moTab } from "./engines/gemini";
import { nghi } from "./engines/nguoi_that";

// Agent riêng: bản sao việc + tri thức + luật đã train của m04, thêm dặn dò cho Gemini web (chỉ có PDF đính kèm, không có file chữ).
const goc = agentById("m04-giao-thong");
const AGENT_ID = "m04-gemini";
AGENTS.push({
  id: AGENT_ID, ten: "Mục 4 – Đường, bãi đỗ xe chữa cháy (thử Gemini web)", viec: goc.viec, tri_thuc: goc.tri_thuc.filter((f) => !f.includes("hoc/_da_duyet")), // bỏ ghi chú tự học tổng hợp (hàng trăm KB): dán vào Gemini rất nặng, luật Mục 4 đã nằm trong luu_y
 
  luu_y: `${goc.luu_y ?? ""} Bạn đọc bản vẽ từ file PDF đính kèm (không có file chữ có vị trí): phóng to từng mặt bằng, đọc nhãn kích thước trên hình, đọc hết MỌI trang rồi mới kết luận. Trả lời đúng MỘT khối json.`,
});

const a = process.argv.slice(2);
const dir = a[0] ? path.resolve(GOC_REPO, a[0]) : "";
const arg = (k: string) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : undefined; };
if (!dir || !existsSync(path.join(dir, "ban_ve.pdf")) || !existsSync(path.join(dir, "thong_tin.json"))) {
  console.log(readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(0, 12).join("\n"));
  process.exit(dir ? 1 : 0);
}
const maBang = arg("--bang") ?? "KT18", luong = Number(arg("--luong") ?? 10), cheDo = arg("--che-do") ?? "chia";
const bang: Bang = JSON.parse(readFileSync(path.join(GOC_REPO, "data", "bang", `${maBang}.json`), "utf8"));
const tt = ThongTin.parse(tachJson(readFileSync(path.join(dir, "thong_tin.json"), "utf8")));
const muc = chiaMuc(bang).find((m) => /đường giao thông|xe chữa cháy|bãi đỗ|lối vào/i.test(m.tieu_de));
if (!muc?.dong.length) throw new Error(`Bảng ${maBang} không có mục đường/bãi xe chữa cháy`);
const mucDong: DongBang[] = muc.dong, tieuDe = muc.tieu_de;

const kb = Object.fromEntries(agentById(AGENT_ID).tri_thuc.map((f) => [f, existsSync(path.join(GOC_REPO, f)) ? readFileSync(path.join(GOC_REPO, f), "utf8") : "(chưa có)"]));
const soTrang = existsSync(path.join(dir, "nguon.json")) ? (JSON.parse(readFileSync(path.join(dir, "nguon.json"), "utf8")).so_trang as number) : 0;
const ctx: PromptCtx = { che_do: "kem", thong_tin: tt, so_trang: soTrang, huong_dan: false, kb };
/** Ước lượng token phần dòng bảng trong prompt (tiếng Việt ~3 ký tự/token; cắt giống bangDong ở prompt.ts). */
const tokenDong = (d: DongBang) => Math.ceil((Math.min(d.noi_dung.length, 300) + Math.min(d.goi_y.length, 300) + Math.min(d.quy_dinh.length, 1500) + (d.khoan_dieu?.length ?? 0) + 40) / 3);
/** Giới hạn đầu vào của Gemini web theo gói của người dùng (token, dùng chung cho câu lệnh + tệp + câu trả lời): 32000 không có gói AI, 128000 AI Plus, 1000000 AI Pro/Ultra. Mặc định lấy mức thấp nhất cho an toàn. */
const gioiHan = Number(arg("--gioi-han") ?? 32000);
const TOKEN_TRA_LOI_MOI_DONG = 150, TOKEN_MOI_TRANG_PDF = 1000; // ước lượng thận trọng: JSON trả về mỗi dòng; mỗi trang bản vẽ
/** Ngân sách dành cho dòng bảng của một job = giới hạn × 90% − phần cố định (luật + tri thức + thông tin công trình, đo từ prompt thật) − bản vẽ. */
const coDinh = Math.ceil(promptJob(ctx, { id: "x", agent: AGENT_ID, bang: maBang, muc: tieuDe, dong: [] }).length / 3) + soTrang * TOKEN_MOI_TRANG_PDF;
const nganSach = Math.floor(gioiHan * 0.9) - coDinh;
if (nganSach <= 0) throw new Error(`Phần cố định ~${coDinh} token đã vượt giới hạn ${gioiHan}: dùng --gioi-han lớn hơn (128000 nếu có AI Plus, 1000000 nếu AI Pro/Ultra) hoặc rút gọn tri thức.`);
/** chia: gói các dòng liên tiếp sát ngân sách (dòng + chỗ cho câu trả lời) mỗi job; số job = số gói, tối đa `luong`; lap: mỗi tab đủ mọi dòng. */
function goiDong(): DongBang[][] {
  const goi: DongBang[][] = [[]]; let tong = 0;
  for (const d of mucDong) {
    const t = tokenDong(d) + TOKEN_TRA_LOI_MOI_DONG;
    if (tong > 0 && tong + t > nganSach) { goi.push([]); tong = 0; }
    goi[goi.length - 1].push(d); tong += t;
  }
  while (goi.length > luong) { const [x, y] = goi.splice(goi.length - 2, 2); goi.push([...x, ...y]); } // quá nhiều gói: nhập hai gói cuối (có thể vượt giới hạn: cảnh báo ở log)
  return goi;
}
const nhomDong: DongBang[][] = cheDo === "lap" ? Array.from({ length: luong }, () => mucDong) : goiDong();

const out = path.join(dir, "gemini_m04"), jobsDir = path.join(out, "jobs");
mkdirSync(jobsDir, { recursive: true });
const viec = nhomDong.map((dong, k) => {
  const job: Job = { id: `${maBang}-${AGENT_ID}-${k + 1}`, agent: AGENT_ID, bang: maBang, muc: tieuDe, dong };
  const prompt = promptJob(ctx, job);
  writeFileSync(path.join(jobsDir, `${job.id}.prompt.md`), prompt, "utf8");
  return { job, prompt };
});
log(`m04-gemini: ${viec.length} job (${cheDo}), ${mucDong.length} dòng mục 4 (giới hạn ${gioiHan} token/job: phần cố định ~${coDinh}, ngân sách dòng bảng ${nganSach}), ${Math.min(luong, viec.length)} tab`);
if (a.includes("--thu-kho")) { console.log(`Đã ghi ${viec.length} prompt vào ${jobsDir}`); process.exit(0); }

// ---- chạy: Chrome ẩn, mỗi tab một việc, mở tab cách nhau 4–7 s như engine Gemini web
const tra: Record<string, string> = {}, loi: Record<string, string> = {}, giay: Record<string, number> = {};
const chiGhep = a.includes("--chi-ghep"); // không mở Chrome, ghép lại từ jobs/*.tra_loi.txt đã có
const hang = chiGhep ? [] : [...viec];
if (chiGhep) for (const v of viec) { const f = path.join(jobsDir, `${v.job.id}.tra_loi.txt`); if (existsSync(f)) { tra[v.job.id] = readFileSync(f, "utf8"); giay[v.job.id] = 0; } }
/** Gemini hay in một khối JSON dở rồi in lại khối đầy đủ sau ```json: lấy khối cuối khi cách thường không đọc được. */
const docTra = (raw: string): unknown => { try { return tachJson(raw); } catch (e) { const k = raw.lastIndexOf("```json"); if (k < 0) throw e; return JSON.parse(raw.slice(k + 7).replace(/```\s*$/, "").trim()); } };
let dung: string | null = null;
const t0 = Date.now();
// Giãn cách ngẫu nhiên: mỗi tab mở cách tab trước một khoảng ngẫu nhiên trong [min, max] giây (--gian-cach-tab 15-30), giữa hai job cùng tab nghỉ thêm 20–60 s. Chỉ giảm nhịp gọi, không đảm bảo Google không đòi xác minh.
const [gMin, gMax] = (arg("--gian-cach-tab") ?? "15-30").split("-").map(Number);
let tich = 0;
const troMo = Array.from({ length: Math.min(luong, viec.length) }, (_, i) => (i ? (tich += gMin * 1000 + Math.random() * (gMax - gMin) * 1000) : 0));
const worker = async (i: number) => {
  await nghi(troMo[i], troMo[i]);
  let tab: Awaited<ReturnType<typeof moTab>> | null = null;
  while (!dung) {
    const v = hang.shift();
    if (!v) break;
    const t1 = Date.now();
    for (let thu = 1; thu <= 2; thu++) {
      try {
        tab ??= await moTab();
        tra[v.job.id] = await chayTrenTab(tab, v.prompt, path.join(dir, "ban_ve.pdf"), jobsDir, v.job.id);
        writeFileSync(path.join(jobsDir, `${v.job.id}.tra_loi.txt`), tra[v.job.id], "utf8");
        delete loi[v.job.id];
        giay[v.job.id] = Math.round((Date.now() - t1) / 1000);
        log(`m04-gemini: xong ${v.job.id} (tab ${i + 1}) ${giay[v.job.id]} s`);
        break;
      } catch (e) {
        if (e instanceof BiChan) { dung = e.message; loi[v.job.id] = dung; break; }
        loi[v.job.id] = String(e).slice(0, 300);
        log(`m04-gemini: lỗi ${v.job.id} lần ${thu}:`, String(e).slice(0, 200));
        await tab?.close().catch(() => {}); tab = null;
        await nghi(5000, 15000);
      }
    }
    if (!dung && hang.length) await nghi(20_000, 60_000);
  }
  await tab?.close().catch(() => {});
};
if (!chiGhep) { await Promise.all(Array.from({ length: Math.min(luong, viec.length) }, (_, i) => worker(i))); await dongTrinhDuyet(); }
const phut = ((Date.now() - t0) / 60000).toFixed(1);

// ---- ghép kết quả
const idxHopLe = mucDong.map((d) => d.idx);
const theoIdx = new Map<number, KetQuaDong[]>(); // idx → các câu trả lời (lap: nhiều bản)
const loiParse: Record<string, string> = {};
for (const v of viec) {
  if (tra[v.job.id] == null) continue;
  try { for (const d of docKetQuaJob(docTra(tra[v.job.id]), maBang, v.job.dong.map((x) => x.idx))) theoIdx.set(d.idx, [...(theoIdx.get(d.idx) ?? []), d]); }
  catch (e) { loiParse[v.job.id] = "không đọc được JSON: " + String(e).slice(0, 200); }
}
const donDong: KetQuaDong[] = [];
const khongDongThuan: number[] = [];
for (const idx of idxHopLe) {
  const ds = theoIdx.get(idx);
  if (!ds?.length) continue;
  const dem = new Map<string, number>();
  ds.forEach((d) => dem.set(d.ket_luan, (dem.get(d.ket_luan) ?? 0) + 1));
  const [thang] = [...dem.entries()].sort((x, y) => y[1] - x[1])[0];
  if (dem.size > 1) khongDongThuan.push(idx);
  donDong.push(ds.find((d) => d.ket_luan === thang)!);
}
const dong = gop([donDong.map((d) => ({ ...d, nhom: "kien_truc" as const }))]);
const kq: KetQua = { phien_ban: 1, ten_cong_trinh: tt.ten_cong_trinh ?? "", bang_chinh: null, bang_he_thong: [], bang_kien_truc: maBang, thong_tin: tt, dong, loi_job: [...Object.entries({ ...loi, ...loiParse }).map(([job, l]) => ({ job, loi: l }))], ngay: new Date().toISOString() };
writeFileSync(path.join(out, "ket_qua.json"), JSON.stringify(kq, null, 1), "utf8");

// ---- báo cáo
const c = demKetLuan(dong);
const dsGiay = Object.values(giay);
const md = [`# Thử Gemini web – Mục 4 (${maBang}) – ${kq.ten_cong_trinh}`, "",
  `- Chế độ: ${cheDo}; ${viec.length} job; ${Math.min(luong, viec.length)} tab song song; tổng ${phut} phút.`,
  `- Job xong ${Object.keys(giay).length}/${viec.length}${dsGiay.length ? `; mỗi job ${Math.min(...dsGiay)}–${Math.max(...dsGiay)} s, trung bình ${Math.round(dsGiay.reduce((s, x) => s + x, 0) / dsGiay.length)} s` : ""}.`,
  `- Lỗi: ${Object.keys({ ...loi, ...loiParse }).length ? JSON.stringify({ ...loi, ...loiParse }) : "không"}`,
  `- Dòng có kết luận ${dong.length}/${idxHopLe.length}: ĐẠT ${c.DAT} · CHƯA ĐẠT ${c.CHUA_DAT} · CẦN XÁC NHẬN ${c.CAN_XAC_NHAN} · KHÔNG ÁP DỤNG ${c.KHONG_AP_DUNG} · chỉnh bản vẽ ${c.chinh_ban_ve}.`];
if (cheDo === "lap") md.push(`- Độ ổn định: ${idxHopLe.length - khongDongThuan.length}/${idxHopLe.length} dòng cả ${viec.length} lần cùng một kết luận${khongDongThuan.length ? `; dòng lệch: ${khongDongThuan.join(", ")}` : ""}.`);
const ss = arg("--so-sanh");
if (ss && existsSync(ss)) {
  const ref = new Map((JSON.parse(readFileSync(ss, "utf8")) as KetQua).dong.filter((d) => d.bang === maBang).map((d) => [d.idx, d]));
  const chung = dong.filter((d) => ref.has(d.idx)), khop = chung.filter((d) => ref.get(d.idx)!.ket_luan === d.ket_luan);
  md.push(`- So với ${path.basename(path.dirname(path.resolve(ss)))}: khớp ${khop.length}/${chung.length} dòng.`, "", "| idx | Nội dung | Claude | Gemini |", "|---|---|---|---|",
    ...chung.filter((d) => ref.get(d.idx)!.ket_luan !== d.ket_luan).map((d) => `| ${d.idx} | ${(d.noi_dung ?? "").slice(0, 60).replace(/\|/g, "/")} | ${ref.get(d.idx)!.ket_luan} | ${d.ket_luan} |`));
}
md.push("", "| idx | Kết luận | Lý do |", "|---|---|---|", ...dong.map((d) => `| ${d.idx} | ${d.ket_luan} | ${d.ly_do.slice(0, 160).replace(/\|/g, "/")} |`));
writeFileSync(path.join(out, "bao_cao.md"), md.join("\n"), "utf8");
console.log(md.slice(0, 7).join("\n"));
process.exit(0);
