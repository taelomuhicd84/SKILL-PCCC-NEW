// Engine Gemini API chính thức (Google AI Studio): mỗi người dùng tự lấy API key từ tài khoản Google của mình
// (https://aistudio.google.com/apikey, có gói miễn phí). Chạy song song nhiều luồng, không cần trình duyệt.
// Bản vẽ tải lên Files API một lần cho mỗi phiên (lưu uri trong <phiên>/gemini_file.json, file hết hạn sau 48 giờ).
import { existsSync, readFileSync, writeFileSync, statSync } from "node:fs";
import path from "node:path";
import { GOC_REPO, log } from "../chung";

export const FILE_KEY = path.join(GOC_REPO, "runner", "gemini_key.json");
const API = "https://generativelanguage.googleapis.com";
const MODEL = () => process.env.PCCC_GEMINI_MODEL ?? "gemini-2.5-flash";

export const coKey = () => !!process.env.GEMINI_API_KEY || existsSync(FILE_KEY);
export function luuKey(key: string) {
  const k = key.trim();
  if (!/^AIza[\w-]{30,}$/.test(k)) throw new Error("API key Gemini không đúng dạng (AIza…). Lấy tại https://aistudio.google.com/apikey");
  writeFileSync(FILE_KEY, JSON.stringify({ key: k, luc: new Date().toISOString() }), "utf8");
}
const docKey = () => process.env.GEMINI_API_KEY ?? (JSON.parse(readFileSync(FILE_KEY, "utf8")).key as string);

export class QuaHanMuc extends Error {}

async function goi(url: string, init: RequestInit): Promise<Response> {
  const r = await fetch(url, { ...init, headers: { ...(init.headers as Record<string, string>), "x-goog-api-key": docKey() } });
  if (r.status === 429) throw new QuaHanMuc("Gemini API báo vượt hạn mức (429): giảm số luồng hoặc chờ.");
  if (!r.ok) throw new Error(`Gemini API ${r.status}: ${(await r.text()).slice(0, 400)}`);
  return r;
}

/** Tải PDF lên Files API (resumable), chờ ACTIVE; dùng lại nếu đã tải trong 47 giờ qua. */
const dangTai = new Map<string, Promise<{ uri: string; mime: string }>>();
export function taiBanVe(pdf: string): Promise<{ uri: string; mime: string }> {
  const cache = path.join(path.dirname(pdf), "gemini_file.json");
  if (existsSync(cache)) {
    const c = JSON.parse(readFileSync(cache, "utf8"));
    if (Date.now() - c.luc < 47 * 3600_000 && c.kich_thuoc === statSync(pdf).size) return Promise.resolve(c);
  }
  if (!dangTai.has(pdf)) dangTai.set(pdf, (async () => {
    const data = readFileSync(pdf);
    const start = await goi(`${API}/upload/v1beta/files`, {
      method: "POST",
      headers: { "X-Goog-Upload-Protocol": "resumable", "X-Goog-Upload-Command": "start", "X-Goog-Upload-Header-Content-Length": String(data.length), "X-Goog-Upload-Header-Content-Type": "application/pdf", "content-type": "application/json" },
      body: JSON.stringify({ file: { display_name: "ban_ve.pdf" } }),
    });
    const upUrl = start.headers.get("x-goog-upload-url");
    if (!upUrl) throw new Error("Files API không trả upload url");
    const up = await goi(upUrl, { method: "POST", headers: { "X-Goog-Upload-Command": "upload, finalize", "X-Goog-Upload-Offset": "0", "content-length": String(data.length) }, body: data });
    let f = (await up.json()).file as { name: string; uri: string; mimeType: string; state: string };
    for (let i = 0; f.state === "PROCESSING" && i < 120; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      f = await (await goi(`${API}/v1beta/${f.name}`, { method: "GET" })).json();
    }
    if (f.state === "FAILED") throw new Error("Gemini không xử lý được file PDF");
    const kq = { uri: f.uri, mime: f.mimeType || "application/pdf" };
    writeFileSync(cache, JSON.stringify({ ...kq, luc: Date.now(), kich_thuoc: data.length }), "utf8");
    log("Gemini API: đã tải bản vẽ lên", f.name);
    return kq;
  })().finally(() => dangTai.delete(pdf)));
  return dangTai.get(pdf)!;
}

/** Một job: bản vẽ (file đã tải) + prompt đầy đủ (chế độ "kem") → văn bản JSON. */
export async function chayGeminiApi(prompt: string, pdf: string): Promise<string> {
  const f = await taiBanVe(pdf);
  const body = {
    contents: [{ role: "user", parts: [{ file_data: { mime_type: f.mime, file_uri: f.uri } }, { text: prompt }] }],
    generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
  };
  for (let thu = 1; ; thu++) {
    try {
      const r = await goi(`${API}/v1beta/models/${MODEL()}:generateContent`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const j = await r.json();
      const t = (j.candidates?.[0]?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? "").join("");
      if (!t) throw new Error("Gemini API không trả nội dung: " + JSON.stringify(j.promptFeedback ?? j.candidates?.[0]?.finishReason ?? "").slice(0, 200));
      return t;
    } catch (e) {
      if (!(e instanceof QuaHanMuc) || thu >= 4) throw e;
      await new Promise((r) => setTimeout(r, 20_000 * thu)); // lùi dần khi vượt hạn mức
    }
  }
}
