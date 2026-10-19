// Runner cục bộ: web (GitHub Pages hoặc localhost) gửi hồ sơ và từng job agent tới đây; runner gọi
// Claude Code hoặc Gemini bằng tài khoản của chính người dùng. Chỉ nghe 127.0.0.1, chỉ nhận origin trong danh sách.
import http from "node:http";
import { writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { luuPhien } from "./phien";
import { THU_MUC_LAM, log } from "./chung";
import { chayClaude, coClaude } from "./engines/claude";
import { chayGemini, coPlaywright } from "./engines/gemini";
import { coFileCookie } from "./engines/gemini_cookies";

const PORT = Number(process.env.PCCC_PORT ?? 8787);
const ORIGINS = ["https://taelomuhicd84.github.io", ...(process.env.PCCC_ORIGINS ?? "").split(",").filter(Boolean)];
const choPhep = (o?: string) => !!o && (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(o) || ORIGINS.includes(o));

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
    if (req.method === "GET" && req.url === "/suc-khoe") return json(200, { ok: true, claude: coClaude(), gemini: await coPlaywright(), ghi_chu: coFileCookie() ? "có file cookie Gemini" : "chưa có file cookie Gemini" });
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
        const t = b.engine === "gemini"
          ? await chayGemini(b.prompt, path.join(dir, "ban_ve.pdf"), path.join(dir, "jobs"), job)
          : await chayClaude(b.prompt, dir);
        log("xong", job, t.length, "ký tự");
        return t;
      });
      writeFileSync(path.join(dir, "jobs", `${job}.tra_loi.txt`), tra_loi, "utf8");
      return json(200, { tra_loi });
    }
    json(404, { loi: "không có đường dẫn " + req.url });
  } catch (e) {
    log("lỗi", e);
    json(500, { loi: String(e) });
  }
});

server.requestTimeout = 0; // job có thể chạy lâu
server.listen(PORT, "127.0.0.1", () => log(`Runner PCCC chạy tại http://127.0.0.1:${PORT} (Claude Code: ${coClaude() ? "có" : "không thấy"})`));
