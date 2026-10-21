// Lịch sử chạy ngay mục 1: đọc runner.log qua runner, tự làm mới; giúp biết job nào xong, lỗi, dùng đệm, chuyển Claude.
import { useEffect, useMemo, useRef, useState } from "react";
import { docLog, type DongLog } from "./runner";

type Loai = "loi" | "xong" | "dang" | "dem" | "canh-bao" | "tt";
const NHAN: Record<Loai, string> = { loi: "lỗi", xong: "xong", dang: "bắt đầu", dem: "đệm", "canh-bao": "cảnh báo", tt: "khác" };
const phanLoai = (nd: string): Loai =>
  /dùng đệm|dùng lại/.test(nd) ? "dem"
    : /lỗi|Error|uncaught|unhandled/i.test(nd) ? "loi"
    : /Hết hạn mức|chuyển sang Claude|hết hạn/.test(nd) ? "canh-bao"
    : /xong/.test(nd) ? "xong"
    : /bắt đầu/.test(nd) ? "dang" : "tt";

export function LichSu() {
  const [dong, setDong] = useState<DongLog[] | null>(null);
  const tuLuc = useRef(new Date().toISOString()); // F5 (tải lại trang) thì lịch sử bắt đầu lại từ đầu; runner.log vẫn giữ đủ
  const [loc, setLoc] = useState<"tat-ca" | "job" | "loi">("job");
  useEffect(() => {
    let ngung = false;
    const tai = () => docLog(400).then((d) => { if (!ngung) setDong(d); });
    tai();
    const t = setInterval(tai, 3000);
    return () => { ngung = true; clearInterval(t); };
  }, []);
  const ds = useMemo(() => (dong ?? []).filter((d) => d.luc >= tuLuc.current).map((d) => ({ ...d, loai: phanLoai(d.nd) })), [dong]);
  const dem = (l: Loai) => ds.filter((d) => d.loai === l).length;
  const hien = ds.filter((d) => loc === "tat-ca" || (loc === "loi" ? d.loai === "loi" || d.loai === "canh-bao" : d.loai !== "tt")).slice(-150).reverse();
  return (
    <details className="lich-su" open>
      <summary><b>Lịch sử chạy</b> <span className="muted">(từ lúc mở trang, tự làm mới 3 giây; tải lại trang thì bắt đầu lại, log đầy đủ ở runner/runner.log)</span></summary>
      {dong === null ? <p className="muted">Không kết nối được runner.</p> : (<>
        <div className="ls-dem">
          <span className="xong">xong {dem("xong")}</span> · <span className="dang">bắt đầu {dem("dang")}</span> · <span className="dem">đệm {dem("dem")}</span> · <span className="canh-bao">cảnh báo {dem("canh-bao")}</span> · <span className="loi">lỗi {dem("loi")}</span>
          <span className="ls-loc">{([["job", "Job"], ["loi", "Lỗi + cảnh báo"], ["tat-ca", "Tất cả"]] as const).map(([v, n]) => <button key={v} className={loc === v ? "on" : ""} onClick={() => setLoc(v)}>{n}</button>)}</span>
        </div>
        <ul className="ls-ds">
          {hien.length === 0 && <li className="muted">Chưa có hoạt động nào từ lúc mở trang.</li>}
          {hien.map((d, i) => (
            <li key={d.luc + i} className={d.loai}>
              <time>{new Date(d.luc).toLocaleTimeString("vi-VN")}</time> <b>{NHAN[d.loai]}</b> {d.nd.replace(/^(bắt đầu|lỗi|xong) /i, "")}
            </li>))}
        </ul>
      </>)}
    </details>
  );
}
