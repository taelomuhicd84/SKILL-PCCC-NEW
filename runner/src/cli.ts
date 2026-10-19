// CLI cho luồng chạy hoàn toàn trong Claude Code (lệnh /tham-dinh). Mọi đường dẫn tính từ gốc repo.
//   npm -w runner run cli -- chuan-bi <thu_muc_ra> <pdf1> [pdf2…]   gộp PDF, trích chữ có vị trí, ghi prompt đọc hồ sơ
//   npm -w runner run cli -- jobs <thu_muc_ra> [--bang B15] [--he-thong B35,B39] [--huong-dan]   chọn bảng, ghi prompt từng job
//   npm -w runner run cli -- ra-soat <thu_muc_ra>                   ghi prompt rà soát từ các câu trả lời đã có
//   npm -w runner run cli -- gop <thu_muc_ra>                       gộp jobs/*.json (+ ra_soat.json) → ket_qua.json, tom_tat.md
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import {
  ThongTin, chonBangChinh, chonBangHeThong, demKetLuan, docKetQuaJob, gop, lapJobs, promptDocHoSo, promptJob, promptRaSoat,
  tachJson, trichChu, NHAN_KET_LUAN, type Bang, type Job, type KetQua, type KetQuaDong, type PromptCtx,
} from "@pccc/shared";
import { GOC_REPO } from "./chung";
import { luuPhien } from "./phien";

const rel = (p: string) => path.relative(GOC_REPO, p).replace(/\\/g, "/");
const bang = (ma: string): Bang => JSON.parse(readFileSync(path.join(GOC_REPO, "data", "bang", `${ma}.json`), "utf8"));
const docJson = <T>(f: string): T => JSON.parse(readFileSync(f, "utf8"));
const arg = (a: string[], k: string) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : undefined; };

async function chuanBi(out: string, pdfs: string[]) {
  const doc = await PDFDocument.create();
  for (const f of pdfs) {
    const src = await PDFDocument.load(readFileSync(f), { ignoreEncryption: true });
    (await doc.copyPages(src, src.getPageIndices())).forEach((p) => doc.addPage(p));
  }
  const bytes = pdfs.length === 1 ? readFileSync(pdfs[0]) : Buffer.from(await doc.save());
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(bytes), useSystemFonts: true, disableFontFace: true, verbosity: 0 }).promise;
  const chu = await trichChu(pdf, (i, n) => process.stdout.write(`\rđọc chữ trang ${i}/${n}`));
  console.log();
  const p = luuPhien(path.basename(pdfs[0]), Buffer.from(bytes), chu, "", out);
  const ctx: PromptCtx = { che_do: "tep", thong_tin: null, so_trang: pdf.numPages, huong_dan: false, tep: { pdf: rel(p.pdf), chu_dir: rel(p.chu_dir) } };
  const goiY = bang("B15").dong.map((d) => d.goi_y).filter(Boolean).slice(0, 40);
  writeFileSync(path.join(out, "prompt_doc_ho_so.md"), promptDocHoSo(ctx, goiY), "utf8");
  writeFileSync(path.join(out, "nguon.json"), JSON.stringify({ pdfs: pdfs.map((f) => path.resolve(f)), so_trang: pdf.numPages }, null, 1));
  console.log(`Đã ghi ${rel(out)}: ban_ve.pdf (${pdf.numPages} trang), chu/, prompt_doc_ho_so.md.\nViệc tiếp: agent pccc-doc-ho-so đọc prompt và ghi ${rel(out)}/thong_tin.json`);
}

function jobs(out: string, a: string[]) {
  const tt = ThongTin.parse(tachJson(readFileSync(path.join(out, "thong_tin.json"), "utf8")));
  const ma = arg(a, "--bang") ?? chonBangChinh(tt).ma;
  const ht = arg(a, "--he-thong")?.split(",") ?? chonBangHeThong(tt).map((b) => b.ma);
  const ds = lapJobs(ma ? bang(ma) : null, ht.filter((m) => existsSync(path.join(GOC_REPO, "data", "bang", `${m}.json`))).map(bang));
  const { so_trang } = docJson<{ so_trang: number }>(path.join(out, "nguon.json"));
  const ctx: PromptCtx = { che_do: "tep", thong_tin: tt, so_trang, huong_dan: a.includes("--huong-dan"), tep: { pdf: rel(path.join(out, "ban_ve.pdf")), chu_dir: rel(path.join(out, "chu")) } };
  mkdirSync(path.join(out, "jobs"), { recursive: true });
  for (const j of ds) writeFileSync(path.join(out, "jobs", `${j.id}.md`), promptJob(ctx, j), "utf8");
  writeFileSync(path.join(out, "jobs.json"), JSON.stringify({ bang_chinh: ma, bang_he_thong: ht, huong_dan: ctx.huong_dan, jobs: ds.map((j) => ({ id: j.id, agent: j.agent, bang: j.bang, idx: j.dong.map((d) => d.idx) })) }, null, 1));
  console.log(`Bảng chính ${ma}, hệ thống ${ht.join(", ")}: ${ds.length} job.`);
  for (const j of ds) console.log(`  ${j.id}\tagent pccc-${j.agent}\t${j.dong.length} dòng\t→ ghi ${rel(out)}/jobs/${j.id}.json`);
}

type JobsFile = { bang_chinh: string | null; bang_he_thong: string[]; huong_dan: boolean; jobs: (Pick<Job, "id" | "agent" | "bang"> & { idx: number[] })[] };

function docTraLoi(out: string): { nhom: KetQuaDong[][]; loi: { job: string; loi: string }[] } {
  const jf = docJson<JobsFile>(path.join(out, "jobs.json"));
  const nhom: KetQuaDong[][] = [], loi: { job: string; loi: string }[] = [];
  for (const j of jf.jobs) {
    const f = path.join(out, "jobs", `${j.id}.json`);
    if (!existsSync(f)) { loi.push({ job: j.id, loi: "chưa có câu trả lời" }); continue; }
    try {
      const raw = readFileSync(f, "utf8");
      const tt = new Map(bang(j.bang).dong.map((d) => [d.idx, d.tt]));
      nhom.push(docKetQuaJob(tachJson(raw), j.bang, j.idx).map((d) => ({ ...d, tt: d.tt || tt.get(d.idx) || "" })));
    } catch (e) { loi.push({ job: j.id, loi: String(e).slice(0, 300) }); }
  }
  return { nhom, loi };
}

function raSoat(out: string) {
  const { nhom } = docTraLoi(out);
  const tt = ThongTin.parse(tachJson(readFileSync(path.join(out, "thong_tin.json"), "utf8")));
  const ctx: PromptCtx = { che_do: "tep", thong_tin: tt, so_trang: 0, huong_dan: false };
  writeFileSync(path.join(out, "prompt_ra_soat.md"), promptRaSoat(ctx, gop(nhom).filter((d) => d.ket_luan !== "KHONG_AP_DUNG")), "utf8");
  console.log(`Đã ghi ${rel(out)}/prompt_ra_soat.md → agent pccc-ra-soat ghi ${rel(out)}/ra_soat.json`);
}

function gopKq(out: string) {
  const jf = docJson<JobsFile>(path.join(out, "jobs.json"));
  const { nhom, loi } = docTraLoi(out);
  const rs = path.join(out, "ra_soat.json");
  if (existsSync(rs)) {
    try {
      const raw = tachJson(readFileSync(rs, "utf8")) as { dong?: { bang?: string }[] };
      for (const b of new Set(jf.jobs.map((j) => j.bang)))
        nhom.push(docKetQuaJob({ dong: (raw.dong ?? []).filter((d) => d.bang === b) }, b, jf.jobs.filter((j) => j.bang === b).flatMap((j) => j.idx)));
    } catch (e) { loi.push({ job: "ra-soat", loi: String(e).slice(0, 300) }); }
  }
  const dong = gop(nhom);
  const tt = docJson<unknown>(path.join(out, "thong_tin.json"));
  const kq: KetQua = { phien_ban: 1, ten_cong_trinh: (tt as { ten_cong_trinh?: string }).ten_cong_trinh ?? "", bang_chinh: jf.bang_chinh, bang_he_thong: jf.bang_he_thong, thong_tin: tt, dong, loi_job: loi, ngay: new Date().toISOString() };
  writeFileSync(path.join(out, "ket_qua.json"), JSON.stringify(kq, null, 1), "utf8");
  const c = demKetLuan(dong);
  const md = [`# Kết quả thẩm định – ${kq.ten_cong_trinh}`, "", `Đã xét ${dong.length} dòng: ĐẠT ${c.DAT} · CHƯA ĐẠT ${c.CHUA_DAT} · CẦN XÁC NHẬN ${c.CAN_XAC_NHAN} · KHÔNG ÁP DỤNG ${c.KHONG_AP_DUNG} · chỉnh bản vẽ ${c.chinh_ban_ve}.`,
    loi.length ? `\nJob lỗi/thiếu: ${loi.map((l) => l.job).join(", ")}` : "", "", "| Khung | Bảng | TT | Kết luận | Lý do | Điều |", "|---|---|---|---|---|---|",
    ...dong.filter((d) => d.khung).map((d) => `| ${d.khung} | ${d.bang} | ${d.tt} | ${NHAN_KET_LUAN[d.ket_luan]}${d.chinh_ban_ve ? " · chỉnh bản vẽ" : ""} | ${(d.ly_do + (d.chinh_ban_ve ? " Chỉnh: " + d.chinh_ban_ve : "")).replace(/\|/g, "/")} | ${d.dieu_khoan} |`)];
  writeFileSync(path.join(out, "tom_tat.md"), md.join("\n"), "utf8");
  console.log(md.slice(0, 4).join("\n"));
  console.log(`Ghi ${rel(out)}/ket_qua.json. Mở web, nạp lại PDF + ket_qua.json để tải PDF ghi chú và Word.`);
}

const [cmd, out, ...rest] = process.argv.slice(2);
const dir = out ? path.resolve(GOC_REPO, out) : "";
if (cmd === "chuan-bi") await chuanBi(dir, rest.map((f) => path.resolve(process.env.INIT_CWD ?? process.cwd(), f)));
else if (cmd === "jobs") jobs(dir, rest);
else if (cmd === "ra-soat") raSoat(dir);
else if (cmd === "gop") gopKq(dir);
else { console.log(readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(0, 6).join("\n")); process.exit(cmd ? 1 : 0); }
