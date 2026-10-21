// Chia sẻ web (chỉ file tĩnh web/dist, KHÔNG có runner) cho máy khác trong cùng mạng LAN: node scripts/chia_se_web.mjs [cổng]
// Máy khác mở http://<IP máy này>:<cổng> xem kết quả (kéo thả JSON kết quả + PDF); không chạy AI vì không có runner.
import http from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { networkInterfaces } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../web/dist");
const PORT = Number(process.argv[2] ?? 8788);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".pdf": "application/pdf", ".woff2": "font/woff2" };

http.createServer((req, res) => {
  let p = decodeURIComponent((req.url ?? "/").split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  const f = path.normalize(path.join(DIST, p));
  if (!f.startsWith(DIST) || !existsSync(f) || !statSync(f).isFile()) { res.writeHead(404).end("không có"); return; }
  res.writeHead(200, { "content-type": MIME[path.extname(f).toLowerCase()] ?? "application/octet-stream" }).end(readFileSync(f));
}).listen(PORT, "0.0.0.0", () => {
  const ip = Object.values(networkInterfaces()).flat().filter((i) => i && i.family === "IPv4" && !i.internal).map((i) => i.address);
  console.log(`Chia sẻ web tĩnh: ${ip.map((a) => `http://${a}:${PORT}`).join("  ")}`);
});
