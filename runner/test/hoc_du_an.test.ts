import { describe, expect, it } from "vitest";
import { kiemBaiHoc, tachBaiHoc, tiLeTrung } from "../src/hoc_du_an";

const tot = `# Bài học
### Hàng cuối vùng tính lấy đầu gần nút (2026-10-29, nguồn: kho 54x30)
- Trạng thái: da_duyet
- Căn cứ: tập huấn C07 mục e; người dùng chốt 2026-10-29
- Nội dung: số đầu tối thiểu n ≥ S/Ω, hàng cuối chỉ lấy các đầu gần nút ống chính nhất.
`;

describe("hoc_du_an", () => {
  it("tách bài học", () => {
    const b = tachBaiHoc(tot);
    expect(b).toHaveLength(1);
    expect(b[0].trang_thai).toBe("da_duyet");
  });
  it("bài đúng không lỗi", () => expect(kiemBaiHoc(tot)).toEqual([]));
  it("bắt thiếu căn cứ, sai trạng thái, lộ thông tin khách", () => {
    const xau = tot.replace("da_duyet", "ok").replace(/- Căn cứ:.*\n/, "- Căn cứ: \n") + "Liên hệ 0912 345 678, Công ty TNHH Minh Long.\n";
    const ly = kiemBaiHoc(xau).map((x) => x.ly_do).join(" | ");
    expect(ly).toMatch(/Trạng thái/);
    expect(ly).toMatch(/Căn cứ/);
    expect(ly).toMatch(/điện thoại/);
    expect(ly).toMatch(/doanh nghiệp/);
  });
  it("báo trùng tri thức sẵn có", () => {
    const kho = new Set<string>();
    const w = "so dau toi thieu n s hang cuoi chi lay cac dau gan nut ong chinh nhat".split(" ");
    for (let i = 0; i + 5 <= w.length; i++) kho.add(w.slice(i, i + 5).join(" "));
    expect(tiLeTrung("số đầu tối thiểu n S, hàng cuối chỉ lấy các đầu gần nút ống chính nhất", kho)).toBeGreaterThan(0.9);
    expect(kiemBaiHoc(tot, kho).some((x) => x.muc === "canh_bao")).toBe(true);
  });
});
