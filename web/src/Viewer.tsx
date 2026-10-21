// Xem bản vẽ (pdf.js, xoay đứng) kèm khung kết quả.
import { useEffect, useRef, useState } from "react";
import { viewportDung, type DongKetQua, type TrangChu } from "@pccc/shared";
import type { PdfDoc } from "./pdf";
import { khungCuaDong, mauDong, nhanDong } from "./xuat_pdf";

export function Viewer({ pdf, chu, dong, trang, setTrang, chon, khoang, nhan }: {
  pdf: PdfDoc; chu: TrangChu[]; dong: DongKetQua[]; trang: number; setTrang: (n: number) => void; chon?: DongKetQua | null;
  khoang?: [number, number]; nhan?: string; // chỉ xem các trang của bản vẽ thuộc nhóm đang chọn (kiến trúc / hệ thống PCCC)
}) {
  const [lo, hi] = khoang ?? [1, pdf.numPages];
  const keo = useRef<{ x: number; y: number; sl: number; st: number; di: boolean } | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [kt, setKt] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    let huy = false;
    let task: { cancel: () => void; promise: Promise<unknown> } | null = null;
    (async () => {
      const page = await pdf.getPage(trang);
      const t = chu[trang - 1];
      const base = viewportDung(page, t?.xoay ?? page.rotate);
      const cw = (wrap.current?.clientWidth ?? 900) * zoom;
      const vp = page.getViewport({ scale: (cw / base.width) * (window.devicePixelRatio || 1), rotation: t?.xoay ?? page.rotate });
      const c = canvas.current;
      if (!c || huy) return;
      c.width = vp.width; c.height = vp.height;
      const w = cw, h = (vp.height / vp.width) * cw;
      c.style.width = w + "px"; c.style.height = h + "px";
      setKt({ w, h });
      const t2 = page.render({ canvasContext: c.getContext("2d")!, viewport: vp });
      task = t2;
      await t2.promise.catch(() => {});
    })();
    return () => { huy = true; task?.cancel(); };
  }, [pdf, trang, chu, zoom]);

  const tren = dong.flatMap((d) => (d.khung ? khungCuaDong(d, chu).filter((k) => k.trang === trang).map((k) => ({ d, r: k.r })) : []));

  return (
    <div className="viewer">
      <div className="viewer-bar">
        <button onClick={() => setTrang(Math.max(lo, trang - 1))}>‹</button>
        <span>Trang <input key={trang} type="number" min={lo} max={hi} defaultValue={trang} title="Gõ số trang rồi Enter"
          style={{ width: 56, textAlign: "center" }} onFocus={(e) => e.target.select()}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          onBlur={(e) => { const n = Math.round(Number(e.target.value)); if (n >= lo && n <= hi) setTrang(n); else e.target.value = String(trang); }} />/{hi}{khoang ? <span className="muted"> ({nhan}: trang {lo}–{hi})</span> : null}</span>
        <button onClick={() => setTrang(Math.min(hi, trang + 1))}>›</button>
        <button onClick={() => setZoom((z) => Math.max(0.5, z / 1.25))}>−</button>
        <button onClick={() => setZoom((z) => Math.min(4, z * 1.25))}>+</button>
        <span className="muted">{tren.length} khung trên trang</span>
      </div>
      <div className="viewer-scroll" ref={wrap}
        onPointerDown={(e) => { if (e.button !== 0) return; const el = e.currentTarget; keo.current = { x: e.clientX, y: e.clientY, sl: el.scrollLeft, st: el.scrollTop, di: false }; }}
        onPointerMove={(e) => {
          const k = keo.current; if (!k) return; const el = e.currentTarget;
          const dx = e.clientX - k.x, dy = e.clientY - k.y;
          if (!k.di && Math.hypot(dx, dy) > 4) { k.di = true; el.setPointerCapture(e.pointerId); el.classList.add("dang-keo"); } // kéo để di chuyển bản vẽ khi đã phóng to
          if (k.di) { el.scrollLeft = k.sl - dx; el.scrollTop = k.st - dy; }
        }}
        onPointerUp={(e) => { const el = e.currentTarget; if (keo.current?.di) el.releasePointerCapture(e.pointerId); el.classList.remove("dang-keo"); keo.current = null; }}
        onPointerCancel={(e) => { e.currentTarget.classList.remove("dang-keo"); keo.current = null; }}
        onWheel={(e) => { if (e.ctrlKey) { e.preventDefault(); setZoom((z) => Math.min(4, Math.max(0.5, z * (e.deltaY < 0 ? 1.1 : 1 / 1.1)))); } }}>
        <div className="viewer-page" style={{ width: kt.w, height: kt.h }}>
          <canvas ref={canvas} />
          {tren.map(({ d, r }, i) => {
            const [cr, cg, cb] = mauDong(d);
            const col = `rgb(${cr * 255},${cg * 255},${cb * 255})`;
            return (
              <div key={i} className={"khung" + (chon && chon.bang === d.bang && chon.idx === d.idx ? " khung-chon" : "")}
                title={`Khung ${d.khung} – ${nhanDong(d)}: ${d.ly_do}`}
                style={{ left: (r[0] / 1000) * kt.w, top: (r[1] / 1000) * kt.h, width: ((r[2] - r[0]) / 1000) * kt.w, height: ((r[3] - r[1]) / 1000) * kt.h, borderColor: col }}>
                <span style={{ background: col }}>{d.khung}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
