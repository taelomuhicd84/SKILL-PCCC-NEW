import { useEffect, useMemo, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import {
  HE_THONG, NHAN_KET_LUAN, ThongTin, agentById, chonBangChinh, chonBangHeThong, demKetLuan, trichChu, vanBanTrang,
  type BangIndex, type DongKetQua, type Job, type KetQua, type KetQuaDong, type TrangChu,
} from "@pccc/shared";
import { moPdf, type PdfDoc } from "./pdf";
import { taiIndex, taiMau } from "./data";
import { batDauLo, chayJob, kiemGemini, kiemRunner, napCookieGemini, taoPhien, xemLo, type Engine, type Phien, type SucKhoe } from "./runner";
import { LienKet } from "./LienKet";
import { chayMotJob, docHoSo, docTraLoiJob, gop, huongDan as chayHuongDan, promptCua, raSoat, taoJobs, type Goi, type NguCanh } from "./quy_trinh";
import { engineCuaJob, tachJson, nhomTheoCongTrinh, tenCongTrinh } from "@pccc/shared";
import { Viewer } from "./Viewer";
import { TuHoc } from "./TuHoc";
import { mauDong, nhanDong, xuatPdf } from "./xuat_pdf";
import { xuatDocx } from "./xuat_docx";

type TTJob = { job: Job; trang_thai: "cho" | "dang" | "xong" | "loi"; loi?: string };
type NhomHang = { ten: string; files: File[]; tt: "cho" | "dang" | "xong" | "loi" };
type ThuCong = { ten: string; prompt: string; resolve: (s: string) => void; reject: (e: Error) => void };

const taiVe = (blob: Blob, ten: string) => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = ten; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
};
const luu = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* bộ nhớ đầy hoặc bị chặn */ } };
const doc = <T,>(k: string): T | null => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : null; } catch { return null; } };

export default function App() {
  const [buoc, setBuoc] = useState(1);
  const [ten, setTen] = useState("");
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pdf, setPdf] = useState<PdfDoc | null>(null);
  const [chu, setChu] = useState<TrangChu[]>([]);
  const [tienTrinh, setTienTrinh] = useState("");
  const [engine, setEngine] = useState<Engine>(() => (doc<Engine>("pccc.engine2") ?? "hon-hop"));
  const [luong, setLuong] = useState<number>(() => doc<number>("pccc.luong") ?? 10);
  const [sk, setSk] = useState<SucKhoe | null>(null);
  const [phien, setPhien] = useState<Phien | null>(null);
  const [tt, setTt] = useState<ThongTin | null>(null);
  const [index, setIndex] = useState<BangIndex[]>([]);
  const [bangChinh, setBangChinh] = useState<string | null>(null);
  const [bangHT, setBangHT] = useState<string[]>([]);
  const [huongDan, setHuongDan] = useState(() => doc<boolean>("pccc.huongdan") ?? false);
  const [coRaSoat, setCoRaSoat] = useState(true);
  const [jobs, setJobs] = useState<TTJob[]>([]);
  const [kq, setKq] = useState<DongKetQua[]>([]);
  const [thuCong, setThuCong] = useState<ThuCong | null>(null);
  const [trang, setTrang] = useState(1);
  const [chon, setChon] = useState<DongKetQua | null>(null);
  const [loc, setLoc] = useState("tat-ca");
  const [loi, setLoi] = useState("");
  const dung = useRef(false);
  const [hang, setHang] = useState<NhomHang[]>([]);
  const hangRef = useRef<NhomHang[]>([]);
  const dangChayHang = useRef(false);
  const xongRef = useRef<(() => void) | null>(null);
  const thaRef = useRef<(f: File[]) => void>(() => {});
  const [keo, setKeo] = useState(false);
  const [batDau, setBatDau] = useState(false); // nạp xong hồ sơ → tự chạy cả quy trình (effect chạy sau khi state đã cập nhật)

  useEffect(() => { taiIndex().then(setIndex).catch(() => setLoi("Không tải được danh mục bảng.")); }, []);
  useEffect(() => { luu("pccc.engine2", engine); if (engine !== "thu-cong") kiemRunner().then(setSk); }, [engine]);
  useEffect(() => { luu("pccc.huongdan", huongDan); }, [huongDan]);
  useEffect(() => { luu("pccc.luong", luong); }, [luong]);

  // ---------- gọi AI ----------
  const goi: Goi = async (jobId, tenJob, pt, pk) => {
    if (dung.current) throw new Error("đã dừng");
    if (engine === "thu-cong") return new Promise((resolve, reject) => setThuCong({ ten: tenJob, prompt: pk, resolve, reject }));
    const e = engine === "hon-hop" ? engineCuaJob(jobId) : engine;
    return chayJob(e, phienRef.current!.phien, jobId, e === "claude" ? pt : pk);
  };
  const phienRef = useRef<Phien | null>(null);
  const nc = (): NguCanh => {
    const p = phienRef.current;
    return { so_trang: pdf?.numPages ?? 0, huong_dan: huongDan, tep: p ? { pdf: p.pdf, chu_dir: p.chu_dir } : null };
  };

  // ---------- bước 1: nạp hồ sơ ----------
  async function napHoSo(files: File[], tenNhom?: string) {
    if (!files.length) { xongRef.current?.(); return; }
    setLoi(""); setTienTrinh("Đang gộp PDF…");
    try {
      const out = await PDFDocument.create();
      for (const f of files) {
        const src = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
        (await out.copyPages(src, src.getPageIndices())).forEach((p) => out.addPage(p));
      }
      const bytes = files.length === 1 ? await files[0].arrayBuffer() : ((await out.save()).buffer as ArrayBuffer);
      const d = await moPdf(bytes);
      const c = await trichChu(d, (i, n) => setTienTrinh(`Đang đọc chữ trang ${i}/${n}…`));
      const tenDa = tenNhom ?? files[0].name.replace(/\.pdf$/i, "");
      setTen(tenDa); setPdfBytes(bytes); setPdf(d); setChu(c); setTrang(1);
      const cu = doc<KetQua>("pccc.kq." + tenDa);
      if (cu) { setTt(cu.thong_tin ? ThongTin.parse(cu.thong_tin) : null); setBangChinh(cu.bang_chinh); setBangHT(cu.bang_he_thong); setKq(cu.dong); }
      else { setTt(null); setBangChinh(null); setBangHT([]); setKq([]); setJobs([]); }
      setTienTrinh(`Đã nạp ${d.numPages} trang, ${c.reduce((s, t) => s + t.chu.length, 0)} cụm chữ.${cu ? " Có kết quả lưu từ lần trước." : ""}`);
      setPhien(null); phienRef.current = null;
      setBatDau(true);
    } catch (e) { setLoi("Không đọc được PDF: " + e); setTienTrinh(""); xongRef.current?.(); xongRef.current = null; }
  }

  async function damBaoPhien(): Promise<void> {
    if (engine === "thu-cong" || phienRef.current) return;
    const s = await kiemRunner(); setSk(s);
    if (!s) throw new Error("Không kết nối được runner ở máy bạn. Mở runner (npm run runner) hoặc chọn chế độ Thủ công.");
    setTienTrinh("Đang gửi hồ sơ cho runner…");
    const p = await taoPhien(ten, pdfBytes!, chu);
    phienRef.current = p; setPhien(p);
  }

  // ---------- bước 2: đọc thông tin ----------
  async function chayDocHoSo() {
    setLoi(""); dung.current = false;
    try {
      await damBaoPhien();
      setTienTrinh("Agent Đọc hồ sơ đang làm việc (có thể vài phút)…");
      const t = await docHoSo(goi, nc());
      setTt(t); goiYBang(t); setTienTrinh("Đã lập thông tin công trình. Rà lại, sửa nếu cần rồi sang bước 3.");
    } catch (e) { setLoi(String(e)); setTienTrinh(""); }
  }
  useEffect(() => { if (batDau) { setBatDau(false); chayTuDong(); } }, [batDau]);
  // Tự động toàn bộ: đọc hồ sơ → chọn bảng công năng + bảng hệ thống theo thông tin công trình → thẩm định → rà soát → kết quả.
  async function chayTuDong() {
    try { await chayTuDongTrong(); } finally { xongRef.current?.(); xongRef.current = null; }
  }
  async function chayTuDongTrong() {
    if (kq.length > 0) { setBuoc(5); setTienTrinh("Đã nạp kết quả lưu từ lần trước. Muốn chạy tiếp hoặc chạy lại: bước 4."); return; }
    setLoi(""); dung.current = false; setBuoc(4);
    try {
      let t = tt, bc = bangChinh, bht = bangHT;
      if (!t) {
        await damBaoPhien();
        setTienTrinh("AI đang đọc hồ sơ, lập thông tin công trình (có thể vài phút)…");
        t = await docHoSo(goi, nc());
        setTt(t);
      }
      if (bc == null && bht.length === 0) { bc = chonBangChinh(t).ma; bht = chonBangHeThong(t).map((b) => b.ma); setBangChinh(bc); setBangHT(bht); }
      await chayHet(t, bc, bht);
    } catch (e) { setLoi(String(e)); setTienTrinh(""); }
  }
  function goiYBang(t: ThongTin) {
    setBangChinh(chonBangChinh(t).ma);
    setBangHT(chonBangHeThong(t).map((b) => b.ma));
  }

  // ---------- bước 4: chạy các hạng mục ----------
  async function chayHet(tt: ThongTin, bangChinh: string | null, bangHT: string[]) {
    setLoi(""); dung.current = false;
    try {
      await damBaoPhien();
      const goiP = goi, ncP = nc();
      const ds = await taoJobs(bangChinh, bangHT);
      const st: TTJob[] = ds.map((job) => ({ job, trang_thai: "cho" }));
      setJobs([...st]);
      const nhom: KetQuaDong[][] = [kq];
      const daCo = (j: Job) => kq.length > 0 && j.dong.every((d) => kq.some((k) => k.bang === j.bang && k.idx === d.idx));
      if (engine !== "thu-cong") {
        // chạy lô song song trên runner; job nào xong (đã lưu tạm ở runner) thì ghép ngay vào kết quả
        const can = st.filter((x) => !daCo(x.job));
        st.forEach((x) => { if (daCo(x.job)) x.trang_thai = "xong"; });
        const viec = await Promise.all(can.map(async (x) => { const p = await promptCua(ncP, tt, x.job); const e = engine === "hon-hop" ? engineCuaJob(x.job.id) : engine; return { job: x.job.id, prompt: e === "claude" ? p.pt : p.pk, engine: e === "claude" || e === "gemini" ? e : undefined, prompt_claude: p.pt }; }));
        const { lo } = await batDauLo(engine, phienRef.current!.phien, viec, luong);
        const daGhep = new Set<string>();
        for (;;) {
          const t = await xemLo(lo);
          for (const x of can) {
            const id = x.job.id;
            if (t.xong[id] != null && !daGhep.has(id)) {
              daGhep.add(id);
              try { nhom.push(docTraLoiJob(tachJson(t.xong[id]), x.job)); x.trang_thai = "xong"; }
              catch (e) { x.trang_thai = "loi"; x.loi = "sai định dạng: " + String(e).slice(0, 200); }
            } else if (t.loi[id] && t.xong[id] == null) { x.trang_thai = t.het ? "loi" : "dang"; x.loi = t.loi[id]; }
            else if (t.dang.includes(id)) x.trang_thai = "dang";
          }
          const g = gop(nhom); setKq(g); luuKq(g); setJobs([...st]);
          setTienTrinh(`Đang chạy song song ${engine === "hon-hop" ? "Claude 3 + Gemini 10" : luong} luồng: ${Object.keys(t.xong).length}/${t.tong} job xong${t.dang.length ? " · đang: " + t.dang.join(", ") : ""}`);
          if (t.het || dung.current) break;
          await new Promise((r) => setTimeout(r, 3000));
        }
      }
      for (let i = 0; i < st.length && engine === "thu-cong"; i++) {
        if (dung.current) break;
        if (daCo(st[i].job)) { st[i].trang_thai = "xong"; setJobs([...st]); continue; } // đã có từ lần trước
        st[i].trang_thai = "dang"; setJobs([...st]);
        setTienTrinh(`Đang chạy ${i + 1}/${st.length}: ${agentById(st[i].job.agent).ten} – ${st[i].job.bang}`);
        try {
          nhom.push(await chayMotJob(goiP, ncP, tt, st[i].job));
          st[i].trang_thai = "xong";
          const g = gop(nhom); setKq(g); luuKq(g);
        } catch (e) { st[i].trang_thai = "loi"; st[i].loi = String(e).slice(0, 300); }
        setJobs([...st]);
      }
      if (coRaSoat && !dung.current) {
        setTienTrinh("Agent Rà soát chéo đang làm việc…");
        try { nhom.push(await raSoat(goiP, ncP, tt, gop(nhom))); } catch (e) { setLoi("Rà soát lỗi: " + e); }
      }
      let g = gop(nhom); setKq(g); luuKq(g);
      if (huongDan && !dung.current) {
        setTienTrinh("Agent Hướng dẫn thẩm định đang viết hướng dẫn…");
        try { g = await chayHuongDan(goiP, ncP, tt, g); setKq(g); luuKq(g); } catch (e) { setLoi("Hướng dẫn thẩm định lỗi: " + e); }
      }
      setTienTrinh(`Xong. ${st.filter((s) => s.trang_thai === "loi").length} job lỗi (chạy lại để thử tiếp).`);
      setBuoc(5);
    } catch (e) { setLoi(String(e)); }
  }
  const ketQua = (g: DongKetQua[]): KetQua => ({
    phien_ban: 1, ten_cong_trinh: tt?.ten_cong_trinh || ten, bang_chinh: bangChinh, bang_he_thong: bangHT, thong_tin: tt, dong: g,
    loi_job: jobs.filter((j) => j.trang_thai === "loi").map((j) => ({ job: j.job.id, loi: j.loi ?? "" })), ngay: new Date().toISOString(),
  });
  const luuKq = (g: DongKetQua[]) => luu("pccc.kq." + ten, ketQua(g));

  /** Kết quả JSON thả vào: lưu theo tên công trình; nếu có PDF cùng công trình trong lần thả này thì PDF tự nạp lại kết quả, không chạy lại. */
  async function nhanKetQua(k: KetQua, nhom: { key: string; ten: string }[]): Promise<void> {
    const g = nhom.find((x) => x.key === tenCongTrinh(k.ten_cong_trinh || "").key);
    const tenLuu = g?.ten ?? (k.ten_cong_trinh || "ket_qua");
    luu("pccc.kq." + tenLuu, k);
    if (g) return;
    try {
      setTen(tenLuu); setTt(ThongTin.parse(k.thong_tin)); setBangChinh(k.bang_chinh); setBangHT(k.bang_he_thong); setKq(gop([k.dong])); setBuoc(5);
      setTienTrinh(`Đã mở kết quả "${tenLuu}". Muốn xuất PDF có khung, thả thêm bản vẽ PDF của công trình này.`);
    } catch (e) { setLoi("File kết quả không hợp lệ: " + e); }
  }

  // ---------- thả file: PDF bản vẽ, JSON kết quả, JSON cookie Gemini; một lần thả nhiều file ----------
  async function xuLyTha(ds: File[]) {
    if (!ds.length) return;
    setLoi("");
    const pdfs = ds.filter((f) => /\.pdf$/i.test(f.name) || f.type === "application/pdf");
    const jsons = ds.filter((f) => /\.json$/i.test(f.name));
    const khac = ds.filter((f) => !pdfs.includes(f) && !jsons.includes(f));
    if (khac.length) setLoi("Bỏ qua file không nhận dạng: " + khac.map((f) => f.name).join(", ") + " (chỉ nhận PDF và JSON).");
    const nhom = nhomTheoCongTrinh(pdfs, (f) => f.name);
    const thongBao: string[] = [];
    for (const f of jsons) {
      let j: unknown;
      try { j = JSON.parse(await f.text()); } catch { setLoi(`${f.name}: không phải JSON hợp lệ.`); continue; }
      // cookie Gemini: mảng thuần (EditThisCookie) hoặc {url, cookies:[…]} (Cookie-Editor bản mới, trạng thái Playwright)
      const dsCookie = Array.isArray(j) ? j : j && typeof j === "object" && Array.isArray((j as { cookies?: unknown }).cookies) ? (j as { cookies: unknown[] }).cookies : null;
      if (dsCookie && dsCookie.some((c) => c && typeof c === "object" && "name" in c && "value" in c)) {
        try {
          const r = await napCookieGemini(dsCookie); const k = await kiemGemini();
          thongBao.push(`Đã nạp ${r.so_cookie} cookie Gemini: ${k.dang_nhap ? "đăng nhập được" : "chưa đăng nhập được, xuất lại cookie"}.`);
          kiemRunner().then(setSk);
        } catch (e) { setLoi(`${f.name}: ${e instanceof Error ? e.message : e}`); }
      } else if (j && typeof j === "object" && "dong" in j && "thong_tin" in j) { await nhanKetQua(j as KetQua, nhom); }
      else setLoi(`${f.name}: không phải file kết quả hay cookie Gemini.`);
    }
    if (thongBao.length) setTienTrinh(thongBao.join(" "));
    if (!nhom.length) return;
    setBuoc(1);
    const moi: NhomHang[] = nhom.map((g) => ({ ten: g.ten, files: g.files, tt: "cho" }));
    hangRef.current = [...hangRef.current.filter((x) => !moi.some((m) => m.ten === x.ten)), ...moi];
    setHang([...hangRef.current]);
    xuLyHang();
  }
  /** Chạy lần lượt từng công trình trong hàng đợi (mỗi công trình tự chạy trọn quy trình). Thả thêm khi đang chạy thì xếp vào hàng. */
  async function xuLyHang() {
    if (dangChayHang.current) return;
    dangChayHang.current = true;
    try {
      for (;;) {
        const n = hangRef.current.find((x) => x.tt === "cho");
        if (!n) break;
        const doi = (tt: NhomHang["tt"]) => { n.tt = tt; setHang([...hangRef.current]); };
        doi("dang");
        await new Promise<void>((xong) => { xongRef.current = xong; napHoSo(n.files, n.ten); });
        doi("xong");
        if (dung.current) break;
      }
    } finally { dangChayHang.current = false; }
  }
  function moNhom(n: NhomHang) { // xem lại công trình đã chạy (kết quả lưu sẵn nên mở ngay, không chạy lại)
    if (dangChayHang.current) return;
    hangRef.current = hangRef.current.map((x) => (x === n ? { ...x, tt: "cho" as const } : x));
    setHang([...hangRef.current]); xuLyHang();
  }
  thaRef.current = (f) => { xuLyTha(f); };
  useEffect(() => {
    const chan = (e: DragEvent) => { if (e.dataTransfer?.types.includes("Files")) { e.preventDefault(); setKeo(e.type === "dragover" || e.type === "dragenter"); } };
    const tha = (e: DragEvent) => { if (!e.dataTransfer?.files.length) return; e.preventDefault(); setKeo(false); thaRef.current(Array.from(e.dataTransfer.files)); };
    const ev = ["dragover", "dragenter", "dragleave"] as const;
    ev.forEach((x) => window.addEventListener(x, chan)); window.addEventListener("drop", tha);
    return () => { ev.forEach((x) => window.removeEventListener(x, chan)); window.removeEventListener("drop", tha); };
  }, []);

  // ---------- xuất ----------
  async function taiPdf() {
    if (!pdfBytes || !pdf) return setLoi("Cần nạp lại PDF bản vẽ để ghi chú.");
    setTienTrinh("Đang ghi chú lên PDF…");
    const out = await xuatPdf(pdfBytes, pdf, chu, kq, tt?.ten_cong_trinh || ten, huongDan);
    taiVe(new Blob([out as BlobPart], { type: "application/pdf" }), `${ten}_tham_dinh.pdf`); setTienTrinh("");
  }
  async function taiDocx(ma: string) {
    const b = await xuatDocx(await taiMau(ma), kq.filter((d) => d.bang === ma), tt, huongDan);
    taiVe(b, `${ma}_${ten}_da_dien.docx`);
  }

  const dem = useMemo(() => demKetLuan(kq), [kq]);
  const hien = kq.filter((d) => loc === "tat-ca" || (loc === "khung" ? !!d.khung : d.ket_luan === loc));
  const bangCo = [...new Set(kq.map((d) => d.bang))];

  // ---------- giao diện ----------
  const BUOC = ["Hồ sơ", "Thông tin công trình", "Bảng đối chiếu", "Thẩm định", "Kết quả", "Tự học"];
  return (
    <div className="app">
      <header>
        <h1>Thẩm định thiết kế PCCC</h1>
        <nav>{BUOC.map((b, i) => <button key={b} className={buoc === i + 1 ? "on" : ""} onClick={() => setBuoc(i + 1)}>{i + 1}. {b}</button>)}</nav>
        <label className="toggle"><input type="checkbox" checked={huongDan} onChange={(e) => setHuongDan(e.target.checked)} /> Hướng dẫn thiết kế</label>
      </header>
      {loi && <div className="loi" onClick={() => setLoi("")}>{loi}</div>}
      {tienTrinh && <div className="tien-trinh">{tienTrinh}</div>}

      <main className={pdf && buoc >= 4 ? "hai-cot" : ""}>
        <section className="noi-dung">
          {buoc === 1 && (
            <div className="the">
              <h2>1. Nạp hồ sơ</h2>
              <label className={"tha" + (keo ? " keo" : "")}>
                <input type="file" accept="application/pdf,.pdf,application/json,.json" multiple hidden onChange={(e) => { xuLyTha(Array.from(e.target.files ?? [])); e.target.value = ""; }} />
                <b>Kéo thả file vào đây</b> (hoặc bấm để chọn). Thả được nhiều file một lần: PDF bản vẽ, JSON kết quả, JSON cookie Gemini.
                <span className="muted">File cùng tên công trình (vd. “KT Hoàng Anh”, “PCCC Hoàng Anh”) tự gộp thành một hồ sơ. Hệ thống tự đọc hồ sơ, chọn bảng, thẩm định và ra kết quả, không cần bấm gửi. Chọn AI ở dưới <b>trước</b> khi thả.</span>
              </label>
              {hang.length > 0 && (
                <ul className="hang-doi">
                  {hang.map((n) => (
                    <li key={n.ten} className={n.tt}>
                      <button disabled={n.tt === "dang"} onClick={() => moNhom(n)} title="Mở kết quả công trình này">{n.ten}</button>
                      <span className="muted"> {n.files.length} file: {n.files.map((f) => f.name).join(" · ")}</span>
                      <b> {({ cho: "chờ", dang: "đang chạy", xong: "xong", loi: "lỗi" } as const)[n.tt]}</b>
                    </li>))}
                </ul>)}
              <h3>AI dùng để thẩm định</h3>
              <div className="chon-engine">
                {([["gemini-api", "Gemini API – nhanh, chạy song song (khuyên dùng)"], ["claude", "Claude Code (tài khoản Claude của bạn)"], ["gemini", "Gemini web (chậm, chạy tuần tự)"], ["hon-hop", "Hỗn hợp: Claude 3 luồng + Gemini web 10 tab ẩn (m10, m15, m17, m18)"], ["thu-cong", "Thủ công: copy prompt, dán trả lời"]] as const).map(([v, n]) => (
                  <label key={v}><input type="radio" checked={engine === v} onChange={() => setEngine(v)} /> {n}</label>))}
              </div>
              {engine !== "thu-cong" && <LienKet engine={engine} sk={sk} capNhat={() => kiemRunner().then(setSk)} luong={luong} setLuong={setLuong} />}
            </div>
          )}

          {buoc === 6 && <TuHoc />}

          {buoc === 2 && (
            <div className="the">
              <h2>2. Thông tin công trình</h2>
              <p className="muted">Tự lập khi nạp hồ sơ. Chỉ cần vào đây khi muốn sửa, rồi sang bước 4 bấm “Chạy lại với thông tin đã chỉnh”.</p>
              <button className="chinh" disabled={!pdf} onClick={chayDocHoSo}>{tt ? "Đọc lại bằng AI" : "AI đọc hồ sơ"}</button>
              <button onClick={() => setTt(ThongTin.parse({}))}>Nhập tay</button>
              {tt && <FormThongTin tt={tt} setTt={(t) => { setTt(t); goiYBang(t); }} />}
            </div>
          )}

          {buoc === 3 && (
            <div className="the">
              <h2>3. Bảng đối chiếu</h2>
              <p className="muted">Tự chọn theo công trình. Chỉ sửa khi cần, rồi chạy lại ở bước 4.</p>
              {tt && <p className="muted">Gợi ý: {chonBangChinh(tt).ly_do}</p>}
              <label>Bảng công năng: <select value={bangChinh ?? ""} onChange={(e) => setBangChinh(e.target.value || null)}>
                <option value="">(không dùng)</option>
                {index.filter((b) => !/^B(3[4-9]|4\d|50)$/.test(b.ma)).map((b) => <option key={b.ma} value={b.ma}>{b.ma} – {b.ten} ({b.so_dong} dòng)</option>)}
              </select></label>
              <h3>Bảng hệ thống</h3>
              <div className="luoi">
                {index.filter((b) => /^B(3[4-9]|4\d|50)$/.test(b.ma)).map((b) => (
                  <label key={b.ma}><input type="checkbox" checked={bangHT.includes(b.ma)} onChange={(e) => setBangHT(e.target.checked ? [...bangHT, b.ma] : bangHT.filter((x) => x !== b.ma))} /> {b.ma} – {b.ten}</label>))}
              </div>
            </div>
          )}

          {buoc === 4 && (
            <div className="the">
              <h2>4. Thẩm định theo hạng mục</h2>
              <p>Mỗi mục lớn của bảng là một agent (thoát nạn, ngăn cháy, báo cháy…). Thiếu dữ liệu thì ghi CẦN XÁC NHẬN và chạy tiếp. Kết quả lưu dần, chạy lại sẽ bỏ qua job đã xong.</p>
              <label className="toggle"><input type="checkbox" checked={coRaSoat} onChange={(e) => setCoRaSoat(e.target.checked)} /> Rà soát chéo sau cùng</label>
              <div>
                <button className="chinh" disabled={!tt} onClick={() => tt && chayHet(tt, bangChinh, bangHT)}>Chạy lại với thông tin đã chỉnh</button>
                <button onClick={() => { dung.current = true; thuCong?.reject(new Error("đã dừng")); setThuCong(null); }}>Dừng</button>
                <button onClick={() => { setKq([]); luuKq([]); setJobs([]); }}>Xoá kết quả, chạy lại từ đầu</button>
              </div>
              <ol className="jobs">{jobs.map((j) => <li key={j.job.id} className={j.trang_thai}>{agentById(j.job.agent).ten} – {j.job.bang} ({j.job.dong.length} dòng) · {({ cho: "chờ", dang: "đang chạy…", xong: "xong", loi: "lỗi: " + j.loi })[j.trang_thai]}</li>)}</ol>
            </div>
          )}

          {buoc === 5 && (
            <div className="the">
              <h2>5. Kết quả</h2>
              <p><b>ĐẠT {dem.DAT}</b> · <b className="c-do">CHƯA ĐẠT {dem.CHUA_DAT}</b> · <b className="c-cam">CẦN XÁC NHẬN {dem.CAN_XAC_NHAN}</b> · KHÔNG ÁP DỤNG {dem.KHONG_AP_DUNG} · <b className="c-xanh">chỉnh bản vẽ {dem.chinh_ban_ve}</b></p>
              <div className="xuat">
                <button className="chinh" onClick={taiPdf} disabled={!pdf}>Tải PDF có ghi chú</button>
                {bangCo.map((m) => <button key={m} onClick={() => taiDocx(m)}>Word {m}</button>)}
                <button onClick={() => taiVe(new Blob([JSON.stringify(ketQua(kq), null, 1)], { type: "application/json" }), `${ten || "ket_qua"}.json`)}>Lưu kết quả .json</button>
              </div>
              <label>Lọc: <select value={loc} onChange={(e) => setLoc(e.target.value)}>
                <option value="tat-ca">tất cả</option><option value="khung">có khung</option>
                {Object.entries(NHAN_KET_LUAN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select></label>
              <table className="kq">
                <thead><tr><th>Khung</th><th>Bảng / TT</th><th>Nội dung thiết kế</th><th>Kết luận và lý do</th><th>Điều</th></tr></thead>
                <tbody>{hien.map((d) => {
                  const [r, g, b] = mauDong(d);
                  return (
                    <tr key={d.bang + d.idx} className={chon === d ? "chon" : ""} onClick={() => { setChon(d); const t = d.vi_tri?.[0]?.trang ?? d.nguon?.[0]?.trang; if (t) setTrang(t); }}>
                      <td>{d.khung ?? ""}</td><td>{d.bang} {d.tt || "#" + d.idx}</td><td>{d.noi_dung_thiet_ke}</td>
                      <td><b style={{ color: `rgb(${r * 255},${g * 255},${b * 255})` }}>{nhanDong(d)}.</b> {d.ly_do}
                        {d.chinh_ban_ve && <div className="c-xanh">Chỉnh bản vẽ: {d.chinh_ban_ve}</div>}
                        {huongDan && d.huong_dan && <div className="huong-dan">Hướng dẫn: {d.huong_dan}</div>}</td>
                      <td>{d.dieu_khoan}</td>
                    </tr>);
                })}</tbody>
              </table>
            </div>
          )}
        </section>
        {pdf && buoc >= 4 && <aside><Viewer pdf={pdf} chu={chu} dong={kq} trang={trang} setTrang={setTrang} chon={chon} /></aside>}
      </main>

      {thuCong && <HopThuCong tc={thuCong} chu={chu} onXong={() => setThuCong(null)} />}
    </div>
  );
}

function FormThongTin({ tt, setTt }: { tt: ThongTin; setTt: (t: ThongTin) => void }) {
  const o = (k: keyof ThongTin, nhan: string) => (
    <label>{nhan}<input value={String(tt[k] ?? "")} onChange={(e) => setTt({ ...tt, [k]: e.target.value })} /></label>);
  const MA = ["A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08", "A10", "B01", "B02", "B03", "B05", "B06", "C01", "C02"];
  const truong = { ...Object.fromEntries(MA.map((m) => [m, { gia_tri: null, nguon: "", trang_thai: "thieu" as const }])), ...tt.truong };
  return (
    <div className="form">
      {o("ten_cong_trinh", "Tên công trình")}{o("cong_nang", "Công năng")}{o("dia_diem", "Địa điểm")}{o("chu_dau_tu", "Chủ đầu tư")}{o("don_vi_thiet_ke", "Đơn vị thiết kế")}
      <h3>Trường thông tin (knowledge/truong-thong-tin.md)</h3>
      <table className="kq"><thead><tr><th>Mã</th><th>Giá trị</th><th>Nguồn</th><th>Trạng thái</th></tr></thead>
        <tbody>{Object.entries(truong).sort().map(([k, v]) => (
          <tr key={k} className={v.trang_thai === "thieu" ? "thieu" : ""}><td>{k}</td>
            <td><input value={String(v.gia_tri ?? "")} onChange={(e) => setTt({ ...tt, truong: { ...truong, [k]: { ...v, gia_tri: k === "A03" ? Number(e.target.value.replace(",", ".")) || e.target.value : e.target.value, trang_thai: "user" } } })} /></td>
            <td>{v.nguon}</td><td>{v.trang_thai}</td></tr>))}</tbody></table>
      <h3>Hệ thống PCCC trong thiết kế</h3>
      <div className="luoi">{Object.entries(HE_THONG).map(([k, n]) => (
        <label key={k}>{n}: <select value={String(tt.he_thong[k] ?? "null")} onChange={(e) => setTt({ ...tt, he_thong: { ...tt.he_thong, [k]: e.target.value === "null" ? null : e.target.value === "true" } })}>
          <option value="true">có</option><option value="false">không</option><option value="null">chưa rõ</option></select></label>))}</div>
      {tt.cau_hoi.length > 0 && <><h3>Điểm cần xác nhận</h3><ul>{tt.cau_hoi.map((c, i) => <li key={i}>{c}</li>)}</ul></>}
    </div>
  );
}

function HopThuCong({ tc, chu, onXong }: { tc: ThuCong; chu: TrangChu[]; onXong: () => void }) {
  const [tl, setTl] = useState("");
  const md = tc.prompt + "\n\n## Chữ có vị trí trên bản vẽ\n" + chu.map((t) => `### Trang ${t.trang}\n${vanBanTrang(t)}`).join("\n");
  return (
    <div className="hop-nen"><div className="hop">
      <h2>Thủ công – {tc.ten}</h2>
      <ol>
        <li>Mở Gemini / Claude trên trình duyệt (tài khoản của bạn), đính kèm file PDF bản vẽ.</li>
        <li><button onClick={() => navigator.clipboard.writeText(tc.prompt)}>Copy prompt</button> hoặc <button onClick={() => taiVe(new Blob([md], { type: "text/markdown" }), "ngu_canh.md")}>Tải file ngữ cảnh .md</button> (kèm chữ có vị trí) rồi đính kèm.</li>
        <li>Dán câu trả lời (khối JSON) vào ô dưới.</li>
      </ol>
      <textarea value={tl} onChange={(e) => setTl(e.target.value)} placeholder="Dán câu trả lời của AI…" />
      <div><button className="chinh" disabled={!tl.trim()} onClick={() => { tc.resolve(tl); onXong(); }}>Xong</button>
        <button onClick={() => { tc.reject(new Error("bỏ qua job")); onXong(); }}>Bỏ qua</button></div>
    </div></div>
  );
}
