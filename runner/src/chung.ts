import { fileURLToPath } from "node:url";
import path from "node:path";

export const GOC_REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const THU_MUC_LAM = path.join(GOC_REPO, "runner", "work");
export const log = (...a: unknown[]) => console.log(new Date().toLocaleTimeString("vi-VN"), ...a);
