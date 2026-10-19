// Chạy thử một prompt file bằng engine Claude: npx tsx runner/src/thu_claude.ts <prompt.md> <ra.json> <thu_muc_phien>
import { readFileSync, writeFileSync } from "node:fs";
import { chayClaude } from "./engines/claude";
const [p, ra, dir] = process.argv.slice(2);
const t0 = Date.now();
const t = await chayClaude(readFileSync(p, "utf8"), dir);
writeFileSync(ra, t, "utf8");
console.log("xong", Math.round((Date.now() - t0) / 1000), "s,", t.length, "ký tự");
