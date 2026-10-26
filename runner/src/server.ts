// Runner cục bộ: web (GitHub Pages hoặc localhost) gửi hồ sơ và từng job agent tới đây; runner gọi
// Claude Code hoặc Gemini bằng tài khoản của chính người dùng. Chỉ nghe 127.0.0.1, chỉ nhận origin trong danh sách.
import http from "node:http";
import { writeFileSync, existsSync, readFileSync, statSync, readdirSync, mkdirSync } from "node:fs";
import path from "node:path";
import { luuPhien } from "./phien";
import { GOC_REPO, THU_MUC_LAM, log } from "./chung";
import { chayClaudeCho, coClaude, coToken, luuToken, datNhanToken, thongTinToken, taiKhoanCli, kiemTraClaude, hanMucDen } from "./engines/claude";
import { modelCuaJob, tenCongTrinh } from "@pccc/shared";
import { docDem, khoaDem, luuDem } from "./dem";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { chayHonHop, chayLo, taoTrangThai, type EngineLo, type TrangThaiLo, type ViecLo } from "./lo";
import { chayGemini, coPlaywright } from "./engines/gemini";
import { coFileCookie, chuanHoa, FILE_COOKIE } from "./engines/gemini_cookies";
import { giuPhien } from "./engines/gemini";
import { chayGeminiApi, coKey, luuKey } from "./engines/gemini_api";
import { batDauHoc, boThuMuc, capNhatCauHinh, daDuyet, docCauHinh, duyet, hopThoaiThuMuc, khoiDongHoc, kiemLaiBangQuyTac, lietKe, themThuMuc, xemChecklist, khaiNiemChoAgent, xemKhaiNiemHoc, trangThai as ttHoc } from "./hoc";

const PORT = Number(process.env.PCCC_PORT ?? 8787);
const ORIGINS = ["https://taelomuhicd84.github.io", ...(process.env.PCCC_ORIGINS ?? "").split(",").filter(Boolean)];
const choPhep = (o?: string) => !!o && (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(o) || ORIGINS.includes(o));

const DIST = path.join(GOC_REPO, "web", "dist"); // web đã build: runner phục vụ luôn, chỉ cần mở http://127.0.0.1:8787
const MIME: Record<string, string> = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".pdf": "application/pdf", ".woff2": "font/woff2", ".mjs": "text/javascript" };
function tep(url: string): string | null {
  const f = path.join(DIST, decodeURIComponent(url.split("?")[0]).replace(/^\/+$/, "/index.html"));
  return f.startsWith(DIST) && existsSync(f) && statSync(f).isFile() ? f : null;
}

const LO = new Map<string, TrangThaiLo>();
let hangDoi: Promise<unknown> = Promise.resolve(); // chạy tuần tự: tránh giới hạn lượt và hai cửa sổ Gemini cùng lúc
const xepHang = <T>(f: () => Promise<T>): Promise<T> => { const p = hangDoi.then(f, f); hangDoi = p.catch(() => {}); return p; };

async function docBody(req: http.IncomingMessage): Promise<any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  const parts: Buffer[] = [];
  for await (const c of req) parts.push(c as Buffer);
  return JSON.parse(Buffer.concat(parts).toString("utf8") || "{}");
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin;
  if (origin && !choPhep(origin)) { res.writeHead(403).end("origin không được phép: " + origin); return; }
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Private-Network", "true"); // Chrome: trang https gọi localhost
  }
  if (req.method === "OPTIONS") { res.writeHead(204).end(); return; }
  const json = (code: number, v: unknown) => { res.writeHead(code, { "content-type": "application/json; charset=utf-8" }).end(JSON.stringify(v)); };
  try {
    if (req.method === "GET" && req.url === "/" && !existsSync(path.join(DIST, "index.html"))) { // chưa build web: runner chỉ là API; mở thẳng thì báo trạng thái và chỉ sang web
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(`<!doctype html><meta charset="utf-8"><title>Runner PCCC</title>
<body style="font-family:system-ui;padding:24px"><h2>Runner PCCC đang chạy ✓</h2><p>Đây là máy chủ nền cho website, không phải trang để dùng.</p>
<p>Claude Code: ${coClaude() ? "có" : "không thấy"} · Gemini API key: ${coKey() ? "có" : "chưa"} · cookie Gemini: ${coFileCookie() ? "có" : "chưa"}</p>
<p>Mở website: <a href="http://localhost:5173">http://localhost:5173</a> (chạy <code>npm run dev</code>) hoặc bản GitHub Pages. Để cửa sổ runner mở khi dùng.</p></body>`);
      return;
    }
    if (req.method === "GET" && req.url?.startsWith("/ban-ve")) { // tìm lại bản vẽ đã nạp trước đó theo tên công trình để mở kết quả JSON có kèm bản vẽ
      const u = new URL(req.url, "http://x");
      const goc = (id: string) => { const m = id.match(/^(work|ket_qua)\/([\w.-]+)$/); return m ? path.join(m[1] === "work" ? THU_MUC_LAM : path.join(GOC_REPO, "ket_qua"), m[2]) : null; };
      if (u.pathname === "/ban-ve/file") { const d = goc(u.searchParams.get("id") ?? ""); const f = d && path.join(d, "ban_ve.pdf"); if (!f || !existsSync(f)) return json(404, { loi: "không có bản vẽ" }); res.writeHead(200, { "content-type": "application/pdf" }).end(readFileSync(f)); return; }
      const tu = (t: string) => new Set(tenCongTrinh(t).key.split(" ").filter(Boolean));
      const cua = (t: string[]) => (x: string) => { const b = tu(x); return t.some((n) => { const a = tu(n); return a.size > 0 && b.size > 0 && ([...a].every((w) => b.has(w)) || [...b].every((w) => a.has(w))); }); };
      // ten.txt là tên file PDF; kết quả JSON mang tên công trình từ thong_tin.json nên cũng so với tên đó
      const tenCuaThuMuc = (d: string) => [path.join(d, "ten.txt"), path.join(d, "thong_tin.json")].filter((f) => existsSync(f)).flatMap((f) => { try { const t = readFileSync(f, "utf8"); return [f.endsWith(".txt") ? t.trim() : String(JSON.parse(t).ten_cong_trinh ?? "")].filter(Boolean); } catch { return []; } });
      const khop = cua((u.searchParams.getAll("ten")).filter(Boolean));
      const ds = (["work", "ket_qua"] as const).flatMap((g) => { const r = g === "work" ? THU_MUC_LAM : path.join(GOC_REPO, "ket_qua"); return existsSync(r) ? readdirSync(r).map((n) => ({ id: g + "/" + n, d: path.join(r, n) })) : []; })
        .filter((x) => existsSync(path.join(x.d, "ban_ve.pdf")) && tenCuaThuMuc(x.d).some(khop))
        .sort((a, b) => statSync(path.join(b.d, "ban_ve.pdf")).mtimeMs - statSync(path.join(a.d, "ban_ve.pdf")).mtimeMs);
      if (!ds.length) return json(404, { loi: "không thấy bản vẽ cùng tên" });
      const k = path.join(ds[0].d, "khoang.json");
      return json(200, { id: ds[0].id, ten: tenCuaThuMuc(ds[0].d)[0] ?? "", khoang: existsSync(k) ? JSON.parse(readFileSync(k, "utf8")) : null });
    }
    if (req.method === "GET" && req.url?.startsWith("/log")) { // lịch sử chạy cho web (mục 1): các dòng có giờ của runner.log, mới nhất ở cuối
      const n = Math.min(1000, Math.max(10, Number(new URL(req.url, "http://x").searchParams.get("n")) || 300));
      const f = path.join(GOC_REPO, "runner", "runner.log");
      const dong = (existsSync(f) ? readFileSync(f, "utf8").split(/[\r\n]+/) : []).flatMap((l) => { const m = l.match(/^(\d{4}-\d\d-\d\dT[\d:.]+Z) (.*)$/); return m && !/Đã làm mới file cookie/.test(m[2]) ? [{ luc: m[1], nd: m[2].slice(0, 300) }] : []; });
      return json(200, { dong: dong.slice(-n) });
    }
    if (req.method === "GET" && req.url === "/suc-khoe") return json(200, { ok: true, claude: coClaude(), claude_token: coToken(), gemini: await coPlaywright(), gemini_cookie: coFileCookie(), gemini_key: coKey(), ghi_chu: coFileCookie() ? "có file cookie Gemini" : "chưa có file cookie Gemini" });
    // ---- liên kết tài khoản ----
    if (req.method === "POST" && req.url === "/gemini/cookie") {
      const raw = await docBody(req);
      const ds = chuanHoa(raw);
      if (!ds.some((c) => /PSID$|^SID$/.test(c.name))) return json(400, { loi: "File không có cookie đăng nhập Google (SID / __Secure-1PSID). Xuất lại ở trang gemini.google.com khi đã đăng nhập." });
      writeFileSync(FILE_COOKIE, JSON.stringify({ cookies: ds, nap_luc: new Date().toISOString() }), "utf8");
      return json(200, { ok: true, so_cookie: ds.length });
    }
    if (req.method === "POST" && req.url === "/gemini/key") { luuKey(String((await docBody(req)).key ?? "")); return json(200, { ok: true }); }
    if (req.method === "POST" && req.url === "/gemini/kiem") return json(200, { dang_nhap: await giuPhien() });
    if (req.method === "POST" && req.url === "/claude/token") { const b = await docBody(req); luuToken(String(b.token ?? ""), b.nhan ? String(b.nhan) : undefined); return json(200, { ok: true }); }
    if (req.method === "POST" && req.url === "/claude/nhan") { if (!coToken()) return json(400, { loi: "chưa có token Claude" }); datNhanToken(String((await docBody(req)).nhan ?? "")); return json(200, { ok: true }); }
    if (req.method === "GET" && req.url === "/claude/tai-khoan") return json(200, { token: thongTinToken(), cli: { ...taiKhoanCli(), dung: false }, han_muc_den: hanMucDen });
    if (req.method === "POST" && req.url === "/claude/kiem-tra") return json(200, await kiemTraClaude());
    if (req.method === "POST" && req.url === "/claude/dang-nhap") { // mở cửa sổ terminal chạy `claude setup-token` để người dùng tự đăng nhập
      if (process.platform === "win32") spawn("cmd", ["/c", "start", "Dang nhap Claude", "cmd", "/k", "claude setup-token"], { detached: true, stdio: "ignore" }).unref();
      else spawn("x-terminal-emulator", ["-e", "claude setup-token"], { detached: true, stdio: "ignore" }).unref();
      return json(200, { ok: true, huong_dan: "Làm theo cửa sổ vừa mở, rồi dán token sk-ant-… vào ô Token Claude." });
    }
    // ---- agent tự học (chỉ đọc các thư mục người dùng cấp quyền; ghi chú vào knowledge/hoc/) ----
    if (req.method === "GET" && req.url === "/hoc") return json(200, { cau_hinh: docCauHinh(), ghi_chu: lietKe(), trang_thai: ttHoc });
    if (req.method === "GET" && req.url?.startsWith("/hoc/da-duyet")) {
      const n = Number(new URL(req.url, "http://x").searchParams.get("toi_da")) || undefined;
      res.writeHead(200, { "content-type": "text/markdown; charset=utf-8" }).end(daDuyet(n)); return;
    }
    if (req.method === "POST" && req.url === "/hoc/thu-muc") {
      const b = await docBody(req);
      if (b.chon) { const p = await hopThoaiThuMuc(); return json(200, p ? themThuMuc(p) : docCauHinh()); }
      return json(200, b.bo ? boThuMuc(String(b.bo)) : themThuMuc(String(b.them ?? "")));
    }
    if (req.method === "POST" && req.url === "/hoc/cau-hinh") {
      const b = await docBody(req);
      return json(200, capNhatCauHinh({ ...(typeof b.tu_dong === "boolean" ? { tu_dong: b.tu_dong } : {}), ...(typeof b.tu_duyet === "boolean" ? { tu_duyet: b.tu_duyet } : {}),
        ...(Array.isArray(b.chu_de) ? { chu_de: (b.chu_de as unknown[]).map(String).map((x) => x.trim()).filter(Boolean).slice(0, 10) } : {}) }));
    }
    if (req.method === "POST" && req.url === "/hoc/chay") {
      const b = await docBody(req);
      const nguon = ["thu-muc", "mang", "ca-hai", "khai-niem", "khai-niem-file", "khai-niem-lo-hong"].includes(b.nguon) ? b.nguon : "ca-hai";
      return json(200, { bat_dau: batDauHoc(nguon, Math.max(1, Math.min(50, Number(b.toi_da) || 8))) });
    }
    if (req.method === "GET" && req.url === "/hoc/khai-niem") return json(200, xemKhaiNiemHoc());
    if (req.method === "GET" && req.url?.startsWith("/hoc/khai-niem/agent")) {
      const u = new URL(req.url, "http://x");
      res.writeHead(200, { "content-type": "text/markdown; charset=utf-8" }).end(khaiNiemChoAgent(u.searchParams.get("id") ?? "", Number(u.searchParams.get("toi_da")) || undefined)); return;
    }
    if (req.method === "GET" && req.url === "/hoc/checklist") return json(200, { thu_muc: xemChecklist() });
    if (req.method === "GET" && req.url === "/hoc/kiem-lai") return json(200, { loi: kiemLaiBangQuyTac() });
    if (req.method === "POST" && req.url === "/hoc/duyet") {
      const b = await docBody(req);
      if (!["cho_duyet", "da_duyet", "bo", "can_sua"].includes(b.trang_thai)) return json(400, { loi: "trạng thái không hợp lệ" });
      try { duyet(String(b.id), b.trang_thai, b.ep === true); } catch (e) { return json(400, { loi: e instanceof Error ? e.message : String(e) }); }
      return json(200, { ok: true });
    }
    // ---- chạy lô song song ----
    if (req.method === "POST" && req.url === "/lo") {
      const b = await docBody(req);
      const dir = path.join(THU_MUC_LAM, String(b.phien).replace(/[^\w-]/g, ""));
      if (!existsSync(dir)) return json(404, { loi: "không có phiên " + b.phien });
      const viec = (b.jobs ?? []) as ViecLo[];
      const id = randomUUID().slice(0, 8);
      const tt = taoTrangThai(viec.length);
      LO.set(id, tt);
      (b.engine === "hon-hop" ? chayHonHop(dir, viec, tt) : chayLo((["gemini", "gemini-api"].includes(b.engine) ? b.engine : "claude") as EngineLo, dir, viec, tt, b.luong)).catch((e) => { tt.het = true; log("lô lỗi", e); });
      return json(200, { lo: id });
    }
    if (req.method === "GET" && req.url?.startsWith("/lo/")) {
      const tt = LO.get(req.url.slice(4));
      return tt ? json(200, tt) : json(404, { loi: "không có lô" });
    }
    if (req.method === "POST" && req.url === "/phien") {
      const b = await docBody(req);
      const p = luuPhien(String(b.ten ?? ""), Buffer.from(b.pdf_base64, "base64"), b.chu ?? []);
      if (b.khoang) writeFileSync(path.join(path.dirname(p.pdf), "khoang.json"), JSON.stringify(b.khoang), "utf8");
      log("phiên mới", p.phien, b.ten);
      return json(200, p);
    }
    if (req.method === "POST" && req.url === "/job") {
      const b = await docBody(req);
      const dir = path.join(THU_MUC_LAM, String(b.phien).replace(/[^\w-]/g, ""));
      if (!existsSync(dir)) return json(404, { loi: "không có phiên " + b.phien });
      const job = String(b.job).replace(/[^\w.-]/g, "_");
      writeFileSync(path.join(dir, "jobs", `${job}.prompt.md`), b.prompt, "utf8");
      const model = b.engine === "gemini" || b.engine === "gemini-api" ? String(b.engine) : modelCuaJob(job);
      const khoa = khoaDem(String(b.engine), model, b.prompt, dir);
      const co = b.engine === "thu-cong" ? null : docDem(khoa);
      const tra_loi = co ?? await xepHang(async () => {
        const t0 = Date.now();
        log("bắt đầu", b.engine, model, job);
        const t = b.engine === "gemini" ? await chayGemini(b.prompt, path.join(dir, "ban_ve.pdf"), path.join(dir, "jobs"), job)
          : b.engine === "gemini-api" ? await chayGeminiApi(b.prompt, path.join(dir, "ban_ve.pdf"))
          : await chayClaudeCho(b.prompt, dir, undefined, undefined, undefined, modelCuaJob(job));
        log("xong", job, `${Math.round((Date.now() - t0) / 1000)} s`, t.length, "ký tự");
        luuDem(khoa, t);
        return t;
      });
      if (co != null) log("dùng đệm", job, `(${co.length} ký tự, không gọi AI)`);
      writeFileSync(path.join(dir, "jobs", `${job}.tra_loi.txt`), tra_loi, "utf8");
      return json(200, { tra_loi });
    }
    // Sơ đồ công việc / node (so_do/*.htm): trang mở qua runner tự lưu dữ liệu vào so_do/du_lieu/<ten>.json, không cần xuất/nhập JSON
    const mSoDo = /^\/so-do(-du-lieu)?\/([a-z0-9_]+)(?:\?.*)?$/.exec(req.url ?? "");
    if (mSoDo) {
      const ten = mSoDo[2];
      if (!mSoDo[1] && req.method === "GET") {
        const f = path.join(GOC_REPO, "so_do", ten + ".htm");
        if (!existsSync(f)) return json(404, { loi: "không có sơ đồ " + ten });
        res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(readFileSync(f)); return;
      }
      if (mSoDo[1]) {
        const f = path.join(GOC_REPO, "so_do", "du_lieu", ten + ".json");
        if (req.method === "GET") { if (!existsSync(f)) return json(404, { loi: "chưa có dữ liệu" }); res.writeHead(200, { "content-type": "application/json; charset=utf-8" }).end(readFileSync(f)); return; }
        if (req.method === "POST") { const b = await docBody(req); mkdirSync(path.dirname(f), { recursive: true }); writeFileSync(f, JSON.stringify(b, null, 1)); return json(200, { ok: true }); }
      }
    }
    const f = req.method === "GET" && req.url ? tep(req.url) : null;
    if (f) { res.writeHead(200, { "content-type": MIME[path.extname(f).toLowerCase()] ?? "application/octet-stream" }).end(readFileSync(f)); return; }
    json(404, { loi: "không có đường dẫn " + req.url });
  } catch (e) {
    log("lỗi", e);
    json(500, { loi: String(e) });
  }
});

server.requestTimeout = 0; // job có thể chạy lâu
khoiDongHoc();
server.listen(PORT, "127.0.0.1", () => log(`Runner PCCC chạy tại http://127.0.0.1:${PORT} (Claude Code: ${coClaude() ? "có" : "không thấy"})`));
