// Runner cục bộ: web (GitHub Pages hoặc localhost) gửi hồ sơ và từng job agent tới đây; runner gọi
// Claude Code hoặc Gemini bằng tài khoản của chính người dùng. Chỉ nghe 127.0.0.1, chỉ nhận origin trong danh sách.
import http from "node:http";
import { writeFileSync, existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { luuPhien } from "./phien";
import { GOC_REPO, THU_MUC_LAM, log } from "./chung";
import { chayClaude, coClaude, coToken, luuToken } from "./engines/claude";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { chayHonHop, chayLo, taoTrangThai, type EngineLo, type TrangThaiLo, type ViecLo } from "./lo";
import { chayGemini, coPlaywright } from "./engines/gemini";
import { coFileCookie, chuanHoa, FILE_COOKIE } from "./engines/gemini_cookies";
import { giuPhien } from "./engines/gemini";
import { chayGeminiApi, coKey, luuKey } from "./engines/gemini_api";

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
    if (req.method === "POST" && req.url === "/gemini/kiem") return json(200, { dang_nhap: await xepHang(() => giuPhien()) });
    if (req.method === "POST" && req.url === "/claude/token") { luuToken(String((await docBody(req)).token ?? "")); return json(200, { ok: true }); }
    if (req.method === "POST" && req.url === "/claude/dang-nhap") { // mở cửa sổ terminal chạy `claude setup-token` để người dùng tự đăng nhập
      if (process.platform === "win32") spawn("cmd", ["/c", "start", "Dang nhap Claude", "cmd", "/k", "claude setup-token"], { detached: true, stdio: "ignore" }).unref();
      else spawn("x-terminal-emulator", ["-e", "claude setup-token"], { detached: true, stdio: "ignore" }).unref();
      return json(200, { ok: true, huong_dan: "Làm theo cửa sổ vừa mở, rồi dán token sk-ant-… vào ô Token Claude." });
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
      log("phiên mới", p.phien, b.ten);
      return json(200, p);
    }
    if (req.method === "POST" && req.url === "/job") {
      const b = await docBody(req);
      const dir = path.join(THU_MUC_LAM, String(b.phien).replace(/[^\w-]/g, ""));
      if (!existsSync(dir)) return json(404, { loi: "không có phiên " + b.phien });
      const job = String(b.job).replace(/[^\w.-]/g, "_");
      writeFileSync(path.join(dir, "jobs", `${job}.prompt.md`), b.prompt, "utf8");
      const tra_loi = await xepHang(async () => {
        log("bắt đầu", b.engine, job);
        const t = b.engine === "gemini" ? await chayGemini(b.prompt, path.join(dir, "ban_ve.pdf"), path.join(dir, "jobs"), job)
          : b.engine === "gemini-api" ? await chayGeminiApi(b.prompt, path.join(dir, "ban_ve.pdf"))
          : await chayClaude(b.prompt, dir);
        log("xong", job, t.length, "ký tự");
        return t;
      });
      writeFileSync(path.join(dir, "jobs", `${job}.tra_loi.txt`), tra_loi, "utf8");
      return json(200, { tra_loi });
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
server.listen(PORT, "127.0.0.1", () => log(`Runner PCCC chạy tại http://127.0.0.1:${PORT} (Claude Code: ${coClaude() ? "có" : "không thấy"})`));
