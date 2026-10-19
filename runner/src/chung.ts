import { appendFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export const GOC_REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const THU_MUC_LAM = path.join(GOC_REPO, "runner", "work");
export const log = (...a: unknown[]) => {
  console.log(new Date().toLocaleTimeString("vi-VN"), ...a);
  try { appendFileSync(path.join(GOC_REPO, "runner", "runner.log"), new Date().toISOString() + " " + a.map((x) => (x instanceof Error ? x.stack : typeof x === "string" ? x : JSON.stringify(x))).join(" ") + "\n"); } catch { /* không ghi được log thì thôi */ }
};
// Một lỗi lạc của Playwright/mạng không được làm sập cả runner (web sẽ báo "Failed to fetch"): ghi log rồi chạy tiếp.
process.on("unhandledRejection", (e) => log("unhandledRejection:", e));
process.on("uncaughtException", (e) => log("uncaughtException:", e));
