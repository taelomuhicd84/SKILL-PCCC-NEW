import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { chayGeminiApi } from "../src/engines/gemini_api";

describe("Gemini API", () => {
  it("tải PDF một lần, gọi generateContent với file_data, key ở header", async () => {
    process.env.GEMINI_API_KEY = "AIza" + "x".repeat(35);
    const dir = mkdtempSync(path.join(tmpdir(), "pccc-"));
    const pdf = path.join(dir, "ban_ve.pdf");
    writeFileSync(pdf, "%PDF-1.4 thu");
    const calls: { url: string; init: RequestInit }[] = [];
    vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
      calls.push({ url, init });
      if (url.includes("/upload/v1beta/files")) return new Response("{}", { headers: { "x-goog-upload-url": "https://up/1" } });
      if (url === "https://up/1") return new Response(JSON.stringify({ file: { name: "files/a", uri: "https://f/a", mimeType: "application/pdf", state: "ACTIVE" } }));
      return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: '{"dong":[]}' }] } }] }));
    });
    expect(await chayGeminiApi("prompt", pdf)).toBe('{"dong":[]}');
    expect(await chayGeminiApi("prompt 2", pdf)).toBe('{"dong":[]}');
    expect(calls.filter((c) => c.url.includes("upload")).length).toBe(1); // tải một lần
    const gen = calls.find((c) => c.url.includes(":generateContent"))!;
    expect(gen.url).not.toContain("key=");
    expect((gen.init.headers as Record<string, string>)["x-goog-api-key"]).toMatch(/^AIza/);
    expect(JSON.parse(gen.init.body as string).contents[0].parts[0].file_data.file_uri).toBe("https://f/a");
    vi.unstubAllGlobals();
  });
});
