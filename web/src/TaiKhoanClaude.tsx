// Tài khoản Claude mà runner đang dùng, ngay mục 1: tên gợi nhớ, dấu vân tay token, hạn mức; kèm cảnh báo đăng nhập CLI của máy (runner không dùng).
import { useEffect, useState } from "react";
import { datNhanClaude, docTaiKhoanClaude, kiemTraClaude, type TaiKhoanClaude } from "./runner";

export function TaiKhoanClaudeBox() {
  const [tk, setTk] = useState<TaiKhoanClaude | null | undefined>(undefined);
  const [kq, setKq] = useState("");
  const [ten, setTen] = useState("");
  const tai = () => docTaiKhoanClaude().then(setTk);
  useEffect(() => { tai(); const t = setInterval(tai, 15000); return () => clearInterval(t); }, []);
  const t = tk?.token;
  return (
    <div className="tk-claude">
      <b>Tài khoản Claude của runner</b>{" "}
      {tk === undefined ? <span className="muted">đang kiểm tra…</span> : tk === null ? <span className="loi">không kết nối được runner</span> : !t?.co ? (
        <span className="loi">chưa liên kết token Claude, runner sẽ không chạy Claude (dán token ở ô “Liên kết Claude” bên dưới)</span>
      ) : (<>
        <span className="ten">{t.nhan ?? "(chưa đặt tên)"}</span>
        <span className="muted"> · {t.loai} · mã …{t.dau}{t.luc ? " · lưu " + new Date(t.luc).toLocaleString("vi-VN") : ""}</span>
        {tk.han_muc_den ? <span className="canh-bao"> · hết hạn mức, tự chạy tiếp lúc {tk.han_muc_den}</span> : <span className="xong"> · chưa gặp giới hạn</span>}
        <div className="hang">
          <button onClick={() => { setKq("Đang gọi thử…"); kiemTraClaude().then((r) => { setKq((r.ok ? "✓ " : "✗ ") + r.ghi_chu); tai(); }).catch((e) => setKq("✗ " + e)); }}>Kiểm tra tài khoản</button>
          <input placeholder="Đặt tên gợi nhớ (vd. Phương)" value={ten} onChange={(e) => setTen(e.target.value)} />
          <button disabled={!ten.trim()} onClick={() => datNhanClaude(ten).then(() => { setTen(""); tai(); })}>Lưu tên</button>
          {kq && <span className={kq.startsWith("✓") ? "xong" : "canh-bao"}>{kq}</span>}
        </div>
        <p className="muted">Anthropic không trả email cho loại token này, nên tên do bạn đặt; “Kiểm tra tài khoản” gọi thử một câu ngắn để biết còn hạn mức không.</p>
      </>)}
      {tk && tk.cli.email && <p className="muted">Đăng nhập Claude Code của máy: {tk.cli.email} — <b>runner không dùng tài khoản này</b>.</p>}
    </div>
  );
}
