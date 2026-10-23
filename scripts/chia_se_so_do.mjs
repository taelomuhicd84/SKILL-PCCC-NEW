// Chia sẻ hai sơ đồ (so_do_cong_viec, so_do_quy_trinh_node) cho máy khác trong mạng LAN; dữ liệu vẫn lưu ở máy này (so_do/du_lieu/*.json).
// Chạy: node scripts/chia_se_so_do.mjs [cổng]   (mặc định 8790). KHÔNG mở runner ra mạng: chỉ phục vụ so_do/*.htm và so_do/du_lieu/*.json.
// Không có mật khẩu: ai cùng mạng LAN biết địa chỉ đều sửa được hai file dữ liệu này.
import http from "node:http";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { networkInterfaces } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SO_DO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../so_do");
const PORT = Number(process.argv[2] ?? 8790);
const TEN = /^\/so-do(-du-lieu)?\/([a-z0-9_]+)(?:\?.*)?$/;
const CORS = { "access-control-allow-origin": "*", "access-control-allow-headers": "content-type", "access-control-allow-methods": "GET,POST,OPTIONS" }; // trang mở từ file:// có Origin "null"

http.createServer(async (req, res) => {
  const gui = (code, type, body) => res.writeHead(code, { ...CORS, "content-type": type }).end(body);
  if (req.method === "OPTIONS") return gui(204, "text/plain", "");
  const m = TEN.exec(req.url ?? "");
  if (!m) return gui(404, "text/plain; charset=utf-8", "không có");
  const f = m[1] ? path.join(SO_DO, "du_lieu", m[2] + ".json") : path.join(SO_DO, m[2] + ".htm");
  if (req.method === "GET") return existsSync(f) ? gui(200, m[1] ? "application/json; charset=utf-8" : "text/html; charset=utf-8", readFileSync(f)) : gui(404, "application/json", '{"loi":"chưa có"}');
  if (req.method === "POST" && m[1]) {
    const parts = [];
    for await (const c of req) parts.push(c);
    try { const j = JSON.parse(Buffer.concat(parts).toString("utf8")); mkdirSync(path.dirname(f), { recursive: true }); writeFileSync(f, JSON.stringify(j, null, 1)); return gui(200, "application/json", '{"ok":true}'); }
    catch { return gui(400, "application/json", '{"loi":"JSON sai"}'); }
  }
  gui(405, "text/plain", "không hỗ trợ");
}).listen(PORT, "0.0.0.0", () => {
  const ip = Object.values(networkInterfaces()).flat().filter((i) => i && i.family === "IPv4" && !i.internal).map((i) => i.address);
  for (const a of ip) console.log(`http://${a}:${PORT}/so-do/so_do_cong_viec   http://${a}:${PORT}/so-do/so_do_quy_trinh_node`);
  console.log("Địa chỉ máy chủ để dán vào nút 'Máy chủ…' của file html copy sang máy khác: " + ip.map((a) => `http://${a}:${PORT}`).join("  "));
});
