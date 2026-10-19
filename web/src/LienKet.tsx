// Liên kết tài khoản AI của người dùng với runner trên máy họ: token Claude, API key Gemini, file cookie Gemini (.json).
// Mọi thông tin chỉ gửi tới runner ở 127.0.0.1 và lưu trong thư mục runner của chính máy đó.
import { useState } from "react";
import { kiemGemini, luuKeyGemini, luuTokenClaude, moDangNhapClaude, napCookieGemini, type Engine, type SucKhoe } from "./runner";

export function LienKet({ engine, sk, capNhat, luong, setLuong }: {
  engine: Engine; sk: SucKhoe | null; capNhat: () => void; luong: number; setLuong: (n: number) => void;
}) {
  const [tb, setTb] = useState("");
  const [token, setToken] = useState("");
  const [key, setKey] = useState("");
  const lam = async (f: () => Promise<unknown>, ok: string) => {
    setTb("Đang xử lý…");
    try { await f(); setTb(ok); capNhat(); } catch (e) { setTb("Lỗi: " + (e instanceof Error ? e.message : String(e))); }
  };
  if (!sk) return <p className="muted">Chưa thấy runner ở máy bạn. Cài và chạy theo README (<code>npm run runner</code>), rồi tải lại trang.</p>;
  const co = (b?: boolean) => (b ? "✓" : "✗");

  return (
    <div className="lien-ket">
      <p className="ok">Runner đang chạy · Claude Code {co(sk.claude)} · token Claude {co(sk.claude_token)} · Gemini API key {co(sk.gemini_key)} · cookie Gemini {co(sk.gemini_cookie)}</p>

      {engine === "claude" && (
        <fieldset><legend>Liên kết Claude</legend>
          <p className="muted">Dùng tài khoản Claude của bạn. Nếu máy đã đăng nhập Claude Code thì không cần làm gì. Muốn liên kết lâu dài: bấm nút dưới, làm theo cửa sổ hiện ra, dán token <code>sk-ant-…</code> nhận được (hoặc API key) vào ô.</p>
          <button onClick={() => lam(moDangNhapClaude, "Đã mở cửa sổ đăng nhập Claude trên máy bạn.")}>Mở cửa sổ đăng nhập Claude</button>
          <div className="hang"><input type="password" placeholder="sk-ant-…" value={token} onChange={(e) => setToken(e.target.value)} />
            <button disabled={!token} onClick={() => lam(() => luuTokenClaude(token), "Đã liên kết Claude.").then(() => setToken(""))}>Lưu token</button></div>
        </fieldset>)}

      {engine === "gemini-api" && (
        <fieldset><legend>Liên kết Gemini API</legend>
          <p className="muted">Lấy key miễn phí bằng tài khoản Google của bạn tại <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">aistudio.google.com/apikey</a>, dán vào ô.</p>
          <div className="hang"><input type="password" placeholder="AIza…" value={key} onChange={(e) => setKey(e.target.value)} />
            <button disabled={!key} onClick={() => lam(() => luuKeyGemini(key), "Đã lưu API key Gemini.").then(() => setKey(""))}>Lưu key</button></div>
        </fieldset>)}

      {engine === "gemini" && (
        <fieldset><legend>Đăng nhập Gemini web bằng file cookie</legend>
          <p className="muted">Xuất cookie ở trang gemini.google.com (tiện ích Cookie-Editor → Export → JSON) khi đang đăng nhập, rồi nạp file vào đây. Đóng cửa sổ đó, không bấm đăng xuất. Runner tự làm mới cookie để dùng lâu dài.</p>
          <div className="hang"><input type="file" accept="application/json,.json" onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) await lam(async () => { const r = await napCookieGemini(JSON.parse(await f.text())); setTb(`Đã nạp ${r.so_cookie} cookie.`); }, "Đã nạp cookie.");
          }} />
            <button onClick={() => lam(async () => { const r = await kiemGemini(); if (!r.dang_nhap) throw new Error("cookie đã hết hạn, hãy xuất lại"); }, "Gemini đã đăng nhập.")}>Kiểm tra đăng nhập</button></div>
        </fieldset>)}

      {engine !== "gemini" && (
        <label className="hang">Số luồng song song: <input type="number" min={1} max={20} value={luong} onChange={(e) => setLuong(Math.max(1, Math.min(20, Number(e.target.value) || 1)))} style={{ width: 70 }} />
          <span className="muted">{engine === "gemini-api" ? "gói miễn phí giới hạn số lượt/phút: lỗi 429 thì giảm" : "mỗi luồng là một tiến trình Claude Code"}</span></label>)}
      {tb && <p className={tb.startsWith("Lỗi") ? "c-do" : "ok"}>{tb}</p>}
    </div>
  );
}
