// Dữ liệu tĩnh: bảng đối chiếu (data/bang), mẫu docx (data/mau), tri thức markdown (skills/, knowledge/, memory/).
import type { Bang, BangIndex } from "@pccc/shared";

const base = import.meta.env.BASE_URL;
const cache = new Map<string, Promise<Bang>>();

export const taiIndex = (): Promise<BangIndex[]> => fetch(`${base}bang/index.json`).then((r) => r.json());
export function taiBang(ma: string): Promise<Bang> {
  if (!cache.has(ma)) cache.set(ma, fetch(`${base}bang/${ma}.json`).then((r) => { if (!r.ok) throw new Error("không có bảng " + ma); return r.json(); }));
  return cache.get(ma)!;
}
export const taiMau = (ma: string) => fetch(`${base}mau/${ma}.docx`).then((r) => r.arrayBuffer());

// Tri thức: đóng gói lúc build, khoá là đường dẫn từ gốc repo (khớp AgentDef.tri_thuc).
const raw = import.meta.glob(["../../skills/*.md", "../../knowledge/**/*.md", "../../memory/*.md"], { query: "?raw", import: "default" });
export async function taiKb(files: string[]): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  await Promise.all(files.map(async (f) => {
    const load = raw["../../" + f];
    out[f] = load ? ((await load()) as string) : "(chưa có file này)";
  }));
  return out;
}
