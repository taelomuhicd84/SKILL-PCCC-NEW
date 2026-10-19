import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { vanBanTrang, type TrangChu } from "@pccc/shared";
import { THU_MUC_LAM } from "./chung";

/** Lưu hồ sơ của một phiên: bản vẽ + chữ có vị trí, để agent đọc bằng file. */
export function luuPhien(ten: string, pdf: Buffer, chu: TrangChu[], id = randomUUID().slice(0, 8), dir = path.join(THU_MUC_LAM, id)) {
  mkdirSync(path.join(dir, "chu"), { recursive: true });
  mkdirSync(path.join(dir, "jobs"), { recursive: true });
  writeFileSync(path.join(dir, "ban_ve.pdf"), pdf);
  writeFileSync(path.join(dir, "chu.json"), JSON.stringify(chu));
  for (const t of chu) writeFileSync(path.join(dir, "chu", `trang_${t.trang}.txt`), vanBanTrang(t), "utf8");
  writeFileSync(path.join(dir, "ten.txt"), ten, "utf8");
  return { phien: id, pdf: path.join(dir, "ban_ve.pdf"), chu_dir: path.join(dir, "chu") };
}

