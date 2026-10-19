// Xem bản vẽ (pdf.js, xoay đứng) kèm khung kết quả.
import { useEffect, useRef, useState } from "react";
import { viewportDung, type DongKetQua, type TrangChu } from "@pccc/shared";
import type { PdfDoc } from "./pdf";
import { khungCuaDong, mauDong, nhanDong } from "./xuat_pdf";

export function Viewer({ pdf, chu, dong, trang, setTrang, chon }: {
  pdf: PdfDoc; chu: TrangChu[]; dong: DongKetQua[]; trang: number; setTrang: (n: number) => void; chon?: DongKetQua | null;
}) {
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
        <button onClick={() => setTrang(Math.max(1, trang - 1))}>‹</button>
        <span>Trang {trang}/{pdf.numPages}</span>
        <button onClick={() => setTrang(Math.min(pdf.numPages, trang + 1))}>›</button>
        <button onClick={() => setZoom((z) => Math.max(0.5, z / 1.25))}>−</button>
        <button onClick={() => setZoom((z) => Math.min(4, z * 1.25))}>+</button>
        <span className="muted">{tren.length} khung trên trang</span>
      </div>
      <div className="viewer-scroll" ref={wrap}>
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
