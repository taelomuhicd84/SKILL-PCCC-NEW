// Tab "8. Báo cáo khảo sát và báo giá": đầu vào sơ bộ (3 loại), ước lượng chiều cao, chat Claude/Gemini, xuất khung Excel.
import { useRef, useState } from "react";
import { tachJson, type LuotChat } from "@pccc/shared";
import { taoXlsx, type O } from "./xuat_xlsx";

export type Nguon = "claude" | "gemini";
export interface DauVao { loai: 1 | 2 | 3; soTang: string; dienTich: string; ghiChu: string; ai: Nguon }
export const DAU_VAO_MAC_DINH: DauVao = { loai: 1, soTang: "", dienTich: "", ghiChu: "", ai: "claude" };

const LOAI = {
  1: "Có mặt bằng và mặt đứng: chiều cao đọc từ mặt đứng",
  2: "Chỉ có mặt bằng các tầng, không có mặt đứng: số tầng theo số mặt bằng, ước lượng chiều cao",
  3: "Chỉ có diện tích và số tầng bằng chữ (hoặc một mặt bằng điển hình): ước lượng chiều cao",
} as const;
const H_MIN = 3.3, H_MAX = 3.8; // chiều cao một tầng giả định quanh 3,5 m

const soTangHieuLuc = (dv: DauVao, soTrang: number) => Number(dv.soTang) || (dv.loai === 2 ? soTrang : 0);
const m = (x: number) => x.toFixed(1).replace(".", ",");

/** Khoảng chiều cao ước lượng; chiều cao PCCC tính tới sàn tầng trên cùng (số tầng - 1). Loại 1 đọc từ mặt đứng nên không ước. */
export function uocChieuCao(dv: DauVao, soTrang: number): { cao: string; pccc: string } | null {
  const n = soTangHieuLuc(dv, soTrang);
  if (dv.loai === 1 || n < 1) return null;
  return { cao: `${m(n * H_MIN)}–${m(n * H_MAX)} m`, pccc: `${m(Math.max(n - 1, 0) * H_MIN)}–${m(Math.max(n - 1, 0) * H_MAX)} m` };
}

/** Phần "thông tin đầu vào" đưa vào prompt của agent. */
export function chuDauVao(dv: DauVao, soTrang: number, coBanVe: boolean, tenBanVe: string): string {
  const u = uocChieuCao(dv, soTrang), n = soTangHieuLuc(dv, soTrang);
  return [
    `Loại đầu vào: ${LOAI[dv.loai]}.`,
    coBanVe ? `Có bản vẽ PDF: ${tenBanVe} (${soTrang} trang).` : "Không có bản vẽ PDF, chỉ có thông tin bằng chữ.",
    n ? `Số tầng: ${n}${dv.soTang ? "" : " (đếm theo số mặt bằng, ước lượng)"}.` : "Số tầng: chưa có.",
    dv.dienTich ? `Diện tích công trình: ${dv.dienTich} m2.` : "",
    u ? `Ước lượng chiều cao (giả định 1 tầng ${m(H_MIN)}–${m(H_MAX)} m, tâm 3,5 m): công trình ${u.cao}; chiều cao PCCC ${u.pccc}. Đây là khoảng ước lượng, ghi rõ khi dùng.` : "",
    dv.ghiChu ? `Công năng và thông tin thêm: ${dv.ghiChu}` : "",
  ].filter(Boolean).join("\n");
}

/** Form đầu vào dùng ở bước 1 (khi tích tuỳ chọn) và ở tab 8. */
export function FormDauVao({ dv, setDv, coBanVe, soTrang }: { dv: DauVao; setDv: (d: DauVao) => void; coBanVe: boolean; soTrang: number }) {
  const u = uocChieuCao(dv, soTrang);
  return (
    <div className="khao-sat-form">
      <div className="chon-engine">
        {([1, 2, 3] as const).map((v) => <label key={v}><input type="radio" checked={dv.loai === v} onChange={() => setDv({ ...dv, loai: v })} /> {v}/ {LOAI[v]}</label>)}
      </div>
      <label>Số tầng: <input type="number" min={1} value={dv.soTang} placeholder={dv.loai === 2 && coBanVe ? `${soTrang} (theo số trang PDF)` : ""} onChange={(e) => setDv({ ...dv, soTang: e.target.value })} /></label>
      {" "}<label>Diện tích (m²): <input type="number" min={0} value={dv.dienTich} onChange={(e) => setDv({ ...dv, dienTich: e.target.value })} /></label>
      {u && <p className="muted">Ước lượng (1 tầng {m(H_MIN)}–{m(H_MAX)} m): chiều cao công trình ≈ <b>{u.cao}</b>; chiều cao PCCC ≈ <b>{u.pccc}</b>.</p>}
      <textarea rows={3} value={dv.ghiChu} placeholder="Công năng và thông tin thêm nếu có (vd. nhà ở kết hợp kinh doanh, có hầm, nằm trong khu dân cư…)" onChange={(e) => setDv({ ...dv, ghiChu: e.target.value })} />
      <div className="chon-engine">
        <b>AI trả lời:</b>
        {([["claude", "Claude"], ["gemini", "Gemini web"]] as const).map(([v, n]) => <label key={v}><input type="radio" checked={dv.ai === v} onChange={() => setDv({ ...dv, ai: v })} /> {n}</label>)}
      </div>
    </div>
  );
}

/** Khối json "khao_sat" mà agent trả cuối câu trả lời (xem knowledge/khao-sat-bao-gia.md). */
export interface KhaoSat {
  hang_muc?: string; cong_nang?: string; dien_tich_m2?: number | string | null; so_tang?: number | string | null; chieu_cao_pccc?: string; khoi_tich?: string;
  dien_tham_dinh?: string; dien_tham_dinh_can_cu?: string; so_loi_thoat_nan?: number | string | null; loi_thoat_nan?: string; thoat_nan_danh_gia?: string; thoat_nan_ghi_chu?: string;
  he_thong?: { ten?: string; co?: string; can_cu?: string; ghi_chu?: string }[]; be_nuoc_pccc?: string;
}
function docKhaoSat(t: string): KhaoSat | null {
  try { const j = tachJson(t) as { khao_sat?: KhaoSat }; return j.khao_sat && typeof j.khao_sat === "object" ? j.khao_sat : null; } catch { return null; }
}
const v = (x: unknown): string | number => (x == null ? "" : typeof x === "number" ? x : String(x));

const HANG_MUC: [string, string][] = [
  ["Hệ thống báo cháy tự động", "hệ thống"], ["Chữa cháy họng nước vách tường", "hệ thống"], ["Chữa cháy tự động sprinkler", "m² sàn"],
  ["Cấp nước chữa cháy ngoài nhà (trụ, bể)", "hệ thống"], ["Trạm bơm chữa cháy", "trạm"], ["Hút xả khói, tăng áp thang", "hệ thống"],
  ["Chiếu sáng sự cố, chỉ dẫn thoát nạn", "bộ"], ["Bình chữa cháy xách tay", "bình"], ["Cấp điện cho hệ thống PCCC", "hệ thống"],
  ["Chống sét", "hệ thống"], ["Thang máy chữa cháy", "cái"], ["Cửa, tường ngăn cháy", "m²"], ["Đường và bãi đỗ xe chữa cháy", "m²"],
];

async function taiXuong(blob: Blob, ten: string) {
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = ten; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

/** Báo cáo khảo sát: điền từ khối json của agent (ks); thiếu thì dùng đầu vào và ước lượng chiều cao. Mẫu Excel thật sẽ thay khung này. */
export function khungKhaoSat(ten: string, dv: DauVao, soTrang: number, ks: KhaoSat | null): Promise<Blob> {
  const u = uocChieuCao(dv, soTrang), n = soTangHieuLuc(dv, soTrang);
  const he = ks?.he_thong?.length ? ks.he_thong : HANG_MUC.map(([h]) => ({ ten: h }));
  const dong: O[][] = [
    ["BÁO CÁO KHẢO SÁT PCCC"], [],
    ["I. THÔNG TIN CHUNG"],
    ["Hạng mục", v(ks?.hang_muc) || ten], ["Công năng", v(ks?.cong_nang) || dv.ghiChu],
    ["Diện tích (m²)", v(ks?.dien_tich_m2) || (dv.dienTich ? Number(dv.dienTich) : "")], ["Số tầng", v(ks?.so_tang) || n || ""],
    ["Chiều cao PCCC", v(ks?.chieu_cao_pccc) || (u ? `${u.pccc} (ước lượng)` : "")], ["Khối tích (m³)", v(ks?.khoi_tich)],
    ["Thuộc diện thẩm định PCCC", v(ks?.dien_tham_dinh)], ["Căn cứ", v(ks?.dien_tham_dinh_can_cu)],
    ["Số lối thoát nạn trên bản vẽ", v(ks?.so_loi_thoat_nan)], ["Các lối thoát nạn", v(ks?.loi_thoat_nan)],
    ["Đánh giá thoát nạn", v(ks?.thoat_nan_danh_gia)], ["Yêu cầu / ghi chú thoát nạn (QCVN 06)", v(ks?.thoat_nan_ghi_chu)],
    ["Bể nước PCCC", v(ks?.be_nuoc_pccc) || "Chưa tính (có skill riêng)"], [],
    ["II. HỆ THỐNG PCCC PHẢI LẮP ĐẶT"],
    ["STT", "Hệ thống", "Yêu cầu (CÓ / KHÔNG / CẦN XÁC NHẬN)", "Căn cứ (điều, văn bản)", "Ghi chú"],
    ...he.map((h, i): O[] => [i + 1, v(h.ten), v((h as { co?: string }).co), v((h as { can_cu?: string }).can_cu), v((h as { ghi_chu?: string }).ghi_chu)]),
  ];
  return taoXlsx("Khảo sát", dong, [0, 2, 17, 18], [34, 40, 36, 32, 30]);
}

/** Khối json "bao_gia" của agent báo giá (xem knowledge/bao-gia-pccc.md). */
export interface DongBaoGia { nhom?: string; hang_muc?: string; dvt?: string; khoi_luong?: number | null; don_gia?: number | null; cach_uoc?: string; ghi_chu?: string }
function docBaoGia(t: string): DongBaoGia[] | null {
  try { const j = tachJson(t) as { bao_gia?: { dong?: unknown } }; return Array.isArray(j.bao_gia?.dong) ? (j.bao_gia!.dong as DongBaoGia[]) : null; } catch { return null; }
}
const so = (x: unknown): number | "" => (typeof x === "number" && Number.isFinite(x) ? x : "");

/** Báo giá: dòng từ agent báo giá (bg); chưa có thì lấy hệ thống CÓ / CẦN XÁC NHẬN của khảo sát, khối lượng để trống. Thành tiền, cộng, VAT là công thức. */
export function khungBaoGia(ten: string, ks: KhaoSat | null, bg: DongBaoGia[] | null): Promise<Blob> {
  const hm: DongBaoGia[] = bg?.length ? bg
    : (ks?.he_thong?.length ? ks.he_thong.filter((h) => h.co !== "KHÔNG").map((h): [string, string] => [String(h.ten ?? ""), HANG_MUC.find(([t]) => t === h.ten)?.[1] ?? ""]) : HANG_MUC)
      .map(([h, d]) => ({ hang_muc: h, dvt: d }));
  const dau = 4, cuoi = dau + hm.length; // dòng dữ liệu Excel: dau+1 … cuoi
  const dong: O[][] = [
    ["BÁO GIÁ HỆ THỐNG PCCC"], ["Công trình", ten], [],
    ["STT", "Hạng mục", "ĐVT", "Khối lượng", "Đơn giá (VNĐ)", "Thành tiền (VNĐ)", "Cách ước / ghi chú"],
    ...hm.map((d, i): O[] => [i + 1, [d.nhom, d.hang_muc].filter(Boolean).join(" – "), v(d.dvt), so(d.khoi_luong), so(d.don_gia),
      { f: `D${dau + 1 + i}*E${dau + 1 + i}` }, [d.cach_uoc, d.ghi_chu].filter(Boolean).join("; ")]),
    ["", "Cộng", "", "", "", { f: `SUM(F${dau + 1}:F${cuoi})` }],
    ["", "Thuế VAT (10%)", "", "", "", { f: `F${cuoi + 1}*0.1` }],
    ["", "Tổng cộng", "", "", "", { f: `F${cuoi + 1}+F${cuoi + 2}` }],
  ];
  return taoXlsx("Báo giá", dong, [0, 3, cuoi, cuoi + 1, cuoi + 2], [8, 44, 10, 12, 16, 18, 40]);
}

type Tin = { vai: "nguoi" | "bot"; nd: string; loi?: boolean };

export function KhaoSatBaoGia({ dv, setDv, coBanVe, tenBanVe, soTrang, hoi }: {
  dv: DauVao; setDv: (d: DauVao) => void; coBanVe: boolean; tenBanVe: string; soTrang: number;
  hoi: (nguon: Nguon, cau: string, lichSu: LuotChat[], dauVao: string, agentId: string) => Promise<string>;
}) {
  const [tin, setTin] = useState<Tin[]>([]);
  const [cau, setCau] = useState("");
  const [dang, setDang] = useState(false);
  const [ks, setKs] = useState<KhaoSat | null>(null); // số liệu mới nhất agent trả, để điền báo cáo
  const [bg, setBg] = useState<DongBaoGia[] | null>(null); // dòng báo giá mới nhất của agent báo giá
  const cuoi = useRef<HTMLDivElement>(null);
  const ten = tenBanVe || "Công trình";

  async function gui(c0?: string, agentId = "khao-sat-bao-gia") {
    const c = (c0 ?? cau).trim(); if (!c || dang) return;
    const lichSu: LuotChat[] = tin.filter((t) => !t.loi).map((t) => ({ vai: t.vai, nd: t.nd }));
    setTin((x) => [...x, { vai: "nguoi", nd: c }]); setCau(""); setDang(true);
    try {
      const vao = chuDauVao(dv, soTrang, coBanVe, tenBanVe) + (agentId === "bao-gia" && ks ? `\nSố liệu báo cáo khảo sát (json): ${JSON.stringify(ks)}` : "");
      const tl = (await hoi(dv.ai, c, lichSu, vao, agentId)).trim();
      const k = docKhaoSat(tl), b = docBaoGia(tl); if (k) setKs(k); if (b) setBg(b);
      const chu = k || b ? tl.replace(/```json[\s\S]*?```/g, "").trim() : tl; // khối json đã chuyển vào file Excel
      const them = k ? "\n\n(Số liệu đã ghi vào báo cáo khảo sát, bấm tải .xlsx bên dưới.)" : b ? `\n\n(${b.length} dòng đã ghi vào báo giá, bấm tải .xlsx bên dưới.)` : "";
      setTin((x) => [...x, { vai: "bot", nd: chu ? chu + them : "(không có câu trả lời)" }]);
    } catch (e) { setTin((x) => [...x, { vai: "bot", nd: String(e instanceof Error ? e.message : e), loi: true }]); }
    setDang(false); setTimeout(() => cuoi.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  return (
    <div className="the so-bo">
      <h2>8. Báo cáo khảo sát và báo giá</h2>
      <p className="muted">Số liệu sơ bộ, không phải kết luận thẩm định. {coBanVe ? `Bản vẽ: ${tenBanVe} (${soTrang} trang).` : "Chưa nạp bản vẽ: chỉ dùng thông tin bằng chữ."}</p>
      <FormDauVao dv={dv} setDv={setDv} coBanVe={coBanVe} soTrang={soTrang} />
      <h3>Hỏi đáp</h3>
      <div className="chat">
        {tin.length === 0 && <p className="muted">Bấm “Lập báo cáo khảo sát” (agent đọc bản vẽ và điền các mục) hoặc gõ câu hỏi thêm; báo cáo lấy số liệu từ câu trả lời mới nhất có khối khao_sat.</p>}
        {tin.map((t, i) => <div key={i} className={"tin " + t.vai + (t.loi ? " loi" : "")}><b>{t.vai === "nguoi" ? "Bạn" : dv.ai === "claude" ? "Claude" : "Gemini"}</b><div className="nd">{t.nd}</div></div>)}
        {dang && <p className="muted">Đang hỏi {dv.ai === "claude" ? "Claude" : "Gemini"}… (Gemini web có thể mất vài chục giây)</p>}
        <div ref={cuoi} />
      </div>
      <textarea rows={3} value={cau} disabled={dang} placeholder="Gõ câu hỏi, Enter để gửi (Shift+Enter xuống dòng)"
        onChange={(e) => setCau(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void gui(); } }} />
      <div>
        <button className="chinh" disabled={dang || !cau.trim()} onClick={() => void gui()}>Gửi</button>{" "}
        <button disabled={dang} onClick={() => void gui("Lập báo cáo khảo sát theo đủ 8 mục (hạng mục, công năng, diện tích, số tầng, chiều cao PCCC, khối tích, diện thẩm định, lối thoát nạn và đánh giá, hệ thống PCCC phải lắp đặt, bể nước PCCC) kèm khối json khao_sat.")}>Lập báo cáo khảo sát</button>{" "}
        <button disabled={dang} title={ks ? "Dùng số liệu khảo sát đã có" : "Nên lập báo cáo khảo sát trước"} onClick={() => void gui("Lập báo giá: bảng khối lượng sơ bộ từng hệ thống PCCC phải lắp đặt (theo số liệu khảo sát), đơn vị tính, đơn giá nếu có trong bảng đơn giá, ghi cách ước từng dòng, kèm khối json bao_gia.", "bao-gia")}>Lập báo giá</button>{" "}
        <button disabled={dang || !tin.length} onClick={() => setTin([])}>Xoá hội thoại</button>
      </div>
      <h3>File đầu ra (khung sườn, mẫu Excel thật sẽ gắn sau){` – khảo sát: ${ks ? "đã có số liệu AI" : "khung trống"}; báo giá: ${bg ? `${bg.length} dòng từ AI` : "chưa có khối lượng"}`}</h3>
      <div>
        <button onClick={async () => taiXuong(await khungKhaoSat(ten, dv, soTrang, ks), `bao_cao_khao_sat_${ten}.xlsx`)}>Tải báo cáo khảo sát (.xlsx)</button>{" "}
        <button onClick={async () => taiXuong(await khungBaoGia(ten, ks, bg), `bao_gia_${ten}.xlsx`)}>Tải báo giá (.xlsx)</button>
      </div>
    </div>
  );
}
