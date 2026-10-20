// Tab "Tự học": cấp quyền thư mục, bật học định kỳ, chạy học từ thư mục / mạng, duyệt ghi chú.
// Ghi chú chưa duyệt không được agent thẩm định dùng làm căn cứ (trừ khi bật "tự duyệt" cho văn bản còn hiệu lực).
import { useEffect, useState } from "react";
import { cauHinhHoc, chayHoc, duyetHoc, thuMucHoc, xemHoc, type CauHinhHoc, type GhiChuHoc, type TrangThaiHoc } from "./runner";

const NHAN_HL: Record<string, string> = { con_hieu_luc: "còn hiệu lực", het_hieu_luc: "hết hiệu lực", de_xuat: "đề xuất", khong_ro: "chưa rõ" };
const NHAN_TT: Record<GhiChuHoc["trang_thai"], string> = { cho_duyet: "chờ duyệt", da_duyet: "đã duyệt", bo: "đã bỏ", can_sua: "kiểm soát: cần sửa" };

export function TuHoc() {
  const [ch, setCh] = useState<CauHinhHoc | null>(null);
  const [ds, setDs] = useState<GhiChuHoc[]>([]);
  const [tt, setTt] = useState<TrangThaiHoc | null>(null);
  const [duong, setDuong] = useState("");
  const [chuDe, setChuDe] = useState("");
  const [loc, setLoc] = useState<"tat-ca" | GhiChuHoc["trang_thai"]>("cho_duyet");
  const [loi, setLoi] = useState("");

  const tai = () => xemHoc().then((r) => { setCh(r.cau_hinh); setDs(r.ghi_chu); setTt(r.trang_thai); setLoi(""); })
    .catch(() => setLoi("Không kết nối được runner (http://127.0.0.1:8787). Bật runner rồi mở lại tab này."));
  useEffect(() => { tai(); }, []);
  useEffect(() => { if (ch) setChuDe(ch.chu_de.join("\n")); }, [ch?.chu_de.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!tt?.dang) return; const t = setInterval(tai, 3000); return () => clearInterval(t); }, [tt?.dang]);
  const lam = (f: () => Promise<unknown>) => f().then(tai).catch((e) => setLoi(e instanceof Error ? e.message : String(e)));

  if (!ch) return <div className="the tu-hoc"><h2>Agent tự học</h2><p className="c-do">{loi || "Đang tải…"}</p></div>;
  const hien = ds.filter((g) => loc === "tat-ca" || g.trang_thai === loc);
  const dem = (t: GhiChuHoc["trang_thai"]) => ds.filter((g) => g.trang_thai === t).length;

  return (
    <div className="the tu-hoc">
      <h2>Agent tự học điều luật</h2>
      <p className="muted">Agent đọc văn bản trong các thư mục bạn cấp quyền (PDF có lớp chữ, Word .docx, .md, .txt; chỉ đọc, không sửa) và tìm văn bản mới trên trang chính thống (*.gov.vn, vbpl.vn…), rút thành ghi chú có nguồn và hiệu lực. Ghi chú <b>chỉ được dùng khi thẩm định sau khi bạn duyệt</b>. Hết hạn mức Claude thì tự chờ rồi chạy tiếp.</p>
      {loi && <p className="c-do" onClick={() => setLoi("")}>{loi}</p>}

      <fieldset><legend>Thư mục được cấp quyền</legend>
        {ch.thu_muc.length ? <ul>{ch.thu_muc.map((d) => <li key={d}><code>{d}</code> <button onClick={() => lam(() => thuMucHoc({ bo: d }))}>Bỏ quyền</button></li>)}</ul>
          : <p className="muted">Chưa cấp quyền thư mục nào.</p>}
        <div className="hang">
          <button onClick={() => lam(() => thuMucHoc({ chon: true }))}>Chọn thư mục…</button>
          <input placeholder="hoặc dán đường dẫn, vd. D:\$.4. QC - TCVN" value={duong} onChange={(e) => setDuong(e.target.value)} />
          <button disabled={!duong.trim()} onClick={() => lam(() => thuMucHoc({ them: duong }).then(() => setDuong("")))}>Cấp quyền</button>
        </div>
      </fieldset>

      <fieldset><legend>Cách học</legend>
        <label className="hang"><input type="checkbox" checked={ch.tu_dong} onChange={(e) => lam(() => cauHinhHoc({ tu_dong: e.target.checked }))} /> Tự học mỗi ngày (khi runner đang chạy){ch.lan_cuoi ? ` · lần cuối ${new Date(ch.lan_cuoi).toLocaleString("vi-VN")}` : ""}</label>
        <label className="hang"><input type="checkbox" checked={ch.tu_duyet} onChange={(e) => lam(() => cauHinhHoc({ tu_duyet: e.target.checked }))} /> Agent tự học + kiểm soát viên tự duyệt ghi chú khi kiểm soát viên không thấy lỗi và hiệu lực rõ. <b>Chỉ hỏi bạn</b> khi: kiểm soát viên báo lỗi/xung đột chưa phân xử ("cần sửa"), văn bản đề xuất hoặc chưa rõ hiệu lực, hoặc kiểm soát viên AI chưa chạy được (hết hạn mức)</label>
        <p className="muted">Chủ đề tìm trên mạng (mỗi dòng một chủ đề; để trống dùng chủ đề mặc định về NĐ, thông tư, QCVN, TCVN, công văn C07):</p>
        <textarea rows={3} style={{ width: "100%" }} value={chuDe} onChange={(e) => setChuDe(e.target.value)} onBlur={() => lam(() => cauHinhHoc({ chu_de: chuDe.split("\n") }))} />
        <div className="hang">
          <button className="chinh" disabled={tt?.dang} onClick={() => lam(() => chayHoc("ca-hai"))}>Học ngay (thư mục + mạng)</button>
          <button disabled={tt?.dang} onClick={() => lam(() => chayHoc("thu-muc"))}>Chỉ thư mục</button>
          <button disabled={tt?.dang} onClick={() => lam(() => chayHoc("mang"))}>Chỉ trên mạng</button>
        </div>
        {tt && (tt.dang || tt.ket_thuc) && <p className={tt.dang ? "ok" : "muted"}>{tt.dang ? "Đang học: " : ""}{tt.viec} · {tt.xong}/{tt.tong} việc · {tt.moi} ghi chú mới</p>}
        {tt?.loi.length ? <details><summary>{tt.loi.length} lưu ý</summary><ul>{tt.loi.map((l, i) => <li key={i}>{l}</li>)}</ul></details> : null}
      </fieldset>

      <h3>Ghi chú đã học</h3>
      <div className="hang">
        {(["cho_duyet", "can_sua", "da_duyet", "bo", "tat-ca"] as const).map((k) => (
          <button key={k} className={loc === k ? "on" : ""} onClick={() => setLoc(k)}>{k === "tat-ca" ? `Tất cả (${ds.length})` : `${NHAN_TT[k]} (${dem(k)})`}</button>))}
      </div>
      {hien.length === 0 ? <p className="muted">Không có ghi chú.</p> : (
        <table>
          <thead><tr><th>Văn bản</th><th>Hiệu lực</th><th>Nguồn</th><th>Trạng thái</th><th></th></tr></thead>
          <tbody>{hien.map((g) => (
            <tr key={g.id}>
              <td><details><summary><b>{g.tieu_de}</b>{g.anh_huong ? <span className="muted"> · {g.anh_huong}</span> : null}</summary><div className="tom-tat">{g.noi_dung}</div></details>
                {g.canh_bao && <div className="c-do">Cảnh báo: {g.canh_bao}</div>}
                {g.kiem_soat === "da_sua" && <div className="muted">Kiểm soát viên đã đính chính xung đột (xem đoạn "Đính chính" trong ghi chú) — đọc lại trước khi duyệt.</div>}</td>
              <td>{NHAN_HL[g.hieu_luc] ?? g.hieu_luc}</td>
              <td className="tom-tat">{g.loai === "mang" ? <a href={g.nguon} target="_blank" rel="noreferrer">{g.nguon.replace(/^https?:\/\//, "").slice(0, 50)}</a> : <code title={g.nguon}>{g.nguon.split(/[\\/]/).pop()}</code>}</td>
              <td>{NHAN_TT[g.trang_thai]}</td>
              <td>
                {g.trang_thai !== "da_duyet" && (g.trang_thai === "can_sua"
                  ? <button title="Kiểm soát viên báo lỗi; chỉ duyệt khi bạn chắc ghi chú đúng" onClick={() => window.confirm("Kiểm soát viên đã báo lỗi ghi chú này (xem Cảnh báo). Duyệt ép?") && lam(() => duyetHoc(g.id, "da_duyet", true))}>Duyệt ép</button>
                  : <button onClick={() => lam(() => duyetHoc(g.id, "da_duyet"))}>Duyệt</button>)}
                {g.trang_thai !== "bo" && <button onClick={() => lam(() => duyetHoc(g.id, "bo"))}>Bỏ</button>}
                {g.trang_thai !== "cho_duyet" && <button onClick={() => lam(() => duyetHoc(g.id, "cho_duyet"))}>Xem lại</button>}
              </td>
            </tr>))}</tbody>
        </table>)}
    </div>
  );
}
