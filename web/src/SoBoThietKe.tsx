// Tab "7. Sơ bộ thiết kế": chat với agent Sơ bộ thiết kế PCCC, hỏi Claude, Gemini hoặc cả hai (không phải thẩm định).
import { useRef, useState } from "react";
import { tachJson, type LuotChat } from "@pccc/shared";

type Nguon = "claude" | "gemini";
export interface DeXuat { loai: string; muc: string; ly_do: string; trang: number; bbox?: number[]; kich_thuoc_trong_m?: string; kich_thuoc_can_m?: string; du?: boolean | null }
type Tin = { vai: "nguoi" | "bot"; nd: string; nguon?: Nguon; loi?: boolean; dx?: DeXuat[] };
const LOAI: Record<string, string> = { thang_thoat_nan: "Thang thoát nạn", thang_may_cc: "Thang máy chữa cháy", bai_do: "Bãi đỗ xe chữa cháy", khoang_cach_pccc: "Khoảng cách PCCC", loi_vao_tren_cao: "Lối vào từ trên cao", khac: "Mục khác" };
/** Lấy danh sách đề xuất từ câu trả lời (khối json); không có hoặc sai thì trả null. */
function docDeXuat(t: string): DeXuat[] | null {
  try { const j = tachJson(t) as { de_xuat?: unknown }; if (!Array.isArray(j.de_xuat)) return null;
    return (j.de_xuat as DeXuat[]).filter((d) => d && typeof d.muc === "string").map((d) => ({ ...d, trang: Math.max(1, Math.round(Number(d.trang) || 1)), bbox: Array.isArray(d.bbox) && d.bbox.length === 4 && d.bbox.every((n) => Number.isFinite(Number(n))) ? d.bbox.map(Number) : undefined })); }
  catch { return null; }
}
const TEN: Record<Nguon, string> = { claude: "Claude", gemini: "Gemini" };

export function SoBoThietKe({ coBanVe, tenBanVe, hoi, datDeXuat, nhayTrang, thaPdf, soTrang }: { coBanVe: boolean; thaPdf: (fs: File[]) => Promise<void>; soTrang: number; tenBanVe: string; hoi: (nguon: Nguon, cau: string, lichSu: LuotChat[], khoanh: boolean) => Promise<string>; datDeXuat: (ds: DeXuat[]) => void; nhayTrang: (n: number) => void }) {
  const [tin, setTin] = useState<Tin[]>([]);
  const [chon, setChon] = useState<"claude" | "gemini" | "ca-hai">("claude");
  const [cau, setCau] = useState("");
  const [dang, setDang] = useState(false);
  const [khoanh, setKhoanh] = useState(false);
  const cuoi = useRef<HTMLDivElement>(null);

  async function gui() {
    const c = cau.trim(); if (!c || dang) return;
    const nguons: Nguon[] = chon === "ca-hai" ? ["claude", "gemini"] : [chon];
    const lichSu: LuotChat[] = tin.filter((t) => !t.loi && (t.vai === "nguoi" || t.nguon === nguons[0])).map((t) => ({ vai: t.vai, nd: t.nd }));
    setTin((x) => [...x, { vai: "nguoi", nd: c }]); setCau(""); setDang(true);
    await Promise.all(nguons.map(async (n) => {
      try {
        const tl = (await hoi(n, c, lichSu, khoanh)).trim();
        const dx = khoanh ? docDeXuat(tl) : null;
        if (dx) datDeXuat(dx);
        const chu = dx ? tl.replace(/```json[\s\S]*?```/g, "").trim() : tl; // phần chữ; khối json đã chuyển thành danh sách khoanh
        setTin((x) => [...x, { vai: "bot", nd: dx && !chu.trim() ? `Đã khoanh ${dx.length} đề xuất (xem danh sách bên dưới và khung trên bản vẽ).` : chu || "(không có câu trả lời)", nguon: n, dx: dx ?? undefined }]);
      }
      catch (e) { setTin((x) => [...x, { vai: "bot", nd: String(e instanceof Error ? e.message : e), nguon: n, loi: true }]); }
    }));
    setDang(false); setTimeout(() => cuoi.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  return (
    <div className="the so-bo">
      <h2>7. Sơ bộ thiết kế PCCC</h2>
      <p className="muted">Hỏi đáp với agent Sơ bộ thiết kế (đường giao thông, bãi đỗ xe chữa cháy, thoát nạn). Đây là đề xuất sơ bộ, không phải kết luận thẩm định. {coBanVe ? `Đang dùng bản vẽ: ${tenBanVe}.` : "Chưa nạp bản vẽ ở bước 1: chỉ hỏi đáp theo quy chuẩn, chưa đọc được bản vẽ."}</p>
      <div className="chon-engine">
        {([["claude", "Claude"], ["gemini", "Gemini web"], ["ca-hai", "Hỏi cả hai"]] as const).map(([v, n]) =>
          <label key={v}><input type="radio" checked={chon === v} onChange={() => setChon(v)} /> {n}</label>)}
      </div>
      <label className="tha tha-ban-ve" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); void thaPdf(Array.from(e.dataTransfer.files)); }}>
        <input type="file" accept="application/pdf,.pdf" multiple hidden onChange={(e) => { void thaPdf(Array.from(e.target.files ?? [])); e.target.value = ""; }} />
        <b>{coBanVe ? `Đã nạp bản vẽ: ${tenBanVe} (${soTrang} trang)` : "Kéo thả file PDF bản vẽ vào đây"}</b>
        <span className="muted">{coBanVe ? "Thả PDF khác để đổi bản vẽ." : "hoặc bấm để chọn; bản vẽ hiện bên phải, hỏi ở khung chat bên dưới."}</span>
      </label>
      <label className="toggle"><input type="checkbox" checked={khoanh} onChange={(e) => setKhoanh(e.target.checked)} /> Khoanh đề xuất trên bản vẽ: các mục chưa đạt và vị trí đề xuất thang thoát nạn / thang máy chữa cháy (xét chỗ trống của lô đất, ước lượng kích thước)</label>
      {khoanh && !coBanVe && <p className="c-cam">Cần nạp bản vẽ ở bước 1 để khoanh lên bản vẽ.</p>}
      <div className="chat">
        {tin.length === 0 && <p className="muted">Ví dụ: “Nhà kho F5 770 m², chu vi 120,8 m, có sprinkler: bãi đỗ xe chữa cháy dài bao nhiêu?” hoặc “Vẽ tuyến thoát nạn xa nhất tầng 2 và so với giới hạn”.</p>}
        {tin.map((t, i) => (
          <div key={i} className={"tin " + t.vai + (t.loi ? " loi" : "")}>
            <b>{t.vai === "nguoi" ? "Bạn" : TEN[t.nguon!]}</b>
            <div className="nd">{t.nd}</div>
            {t.dx && t.dx.length > 0 && (
              <ol className="de-xuat">{t.dx.map((d, k) => (
                <li key={k} onClick={() => nhayTrang(d.trang)} title="Bấm để nhảy tới trang trên bản vẽ">
                  <b>{LOAI[d.loai] ?? d.loai}: {d.muc}</b> (trang {d.trang}) – {d.ly_do}
                  {(d.kich_thuoc_trong_m || d.kich_thuoc_can_m) && <div>Chỗ trống ≈ {d.kich_thuoc_trong_m ?? "?"} · cần ≈ {d.kich_thuoc_can_m ?? "?"} · <b className={d.du === true ? "c-xanh" : d.du === false ? "c-do" : ""}>{d.du === true ? "đủ" : d.du === false ? "không đủ" : "chưa rõ"}</b> (ước lượng)</div>}
                </li>))}</ol>)}
          </div>))}
        {dang && <p className="muted">Đang hỏi {chon === "ca-hai" ? "Claude và Gemini" : TEN[chon]}… (Gemini web có thể mất vài chục giây)</p>}
        <div ref={cuoi} />
      </div>
      <textarea rows={3} value={cau} disabled={dang} placeholder="Gõ câu hỏi, Enter để gửi (Shift+Enter xuống dòng)"
        onChange={(e) => setCau(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void gui(); } }} />
      <div><button className="chinh" disabled={dang || !cau.trim()} onClick={() => void gui()}>Gửi</button> <button disabled={dang || !tin.length} onClick={() => setTin([])}>Xoá hội thoại</button></div>
    </div>
  );
}
