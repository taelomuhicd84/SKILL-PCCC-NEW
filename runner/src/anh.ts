// Dựng ảnh từng trang bản vẽ (anh/trang_N.png) bằng PyMuPDF qua scripts/dung_anh.py, để agent mở ảnh khi chữ có vị trí mơ hồ.
import { spawn } from "node:child_process";
import path from "node:path";
import { GOC_REPO, log } from "./chung";

/** Không có Python hoặc PyMuPDF thì chỉ ghi log và trả null: thẩm định vẫn chạy bằng chữ có vị trí. */
export function dungAnh(pdf: string, thuMucAnh: string): Promise<string | null> {
  return new Promise((xong) => {
    const p = spawn("python", ["-X", "utf8", path.join(GOC_REPO, "scripts", "dung_anh.py"), pdf, thuMucAnh], { windowsHide: true });
    let out = "", err = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (err += d));
    p.on("error", (e) => { log("dựng ảnh trang: không chạy được python:", String(e)); xong(null); });
    p.on("close", (code) => {
      if (code !== 0) { log("dựng ảnh trang lỗi:", err.trim().slice(0, 300)); return xong(null); }
      xong(out.trim());
    });
  });
}
