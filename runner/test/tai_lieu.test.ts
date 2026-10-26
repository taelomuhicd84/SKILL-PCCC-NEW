import { describe, expect, it } from "vitest";
import { apDung, chuanSo, xuLy, type Hang, type So } from "../src/tai_lieu";

const hang = (ten: string, so_hieu: string, extra: Partial<Hang> = {}): Hang => ({ ten, rel: ten, sha: ten, size: 1, so_hieu, tieu_de: "", loai_tl: "Quy chuẩn QCVN", tinh_nang: "", ngay: "2026-01-01", trang_thai: "da_hoc", ghi_chu: "", ...extra });
const soMoi = (...h: Hang[]): So => ({ v: 1, hang: h, loai: [], da_doc: {} });

describe("số hiệu", () => {
  it("nhận từ tên file", () => {
    expect(chuanSo("TCVN 7568-14_2025 bản riu.pdf")?.hien).toBe("TCVN 7568-14:2025");
    expect(chuanSo("tcvn-4513-1988 thiết kế")?.hien).toBe("TCVN 4513:1988");
    expect(chuanSo("QCVN 06:2022/BXD")?.hien).toBe("QCVN 6:2022");
    expect(chuanSo("105/2025/NĐ-CP")?.hien).toBe("NĐ 105/2025");
    expect(chuanSo("công văn 2075/C07-P4")).toBeNull();
  });
});
describe("trùng và thay thế", () => {
  it("cùng số hiệu → trùng, loại", () => {
    const so = soMoi(hang("a.pdf", "TCVN 7336:2021"));
    const xu = xuLy(so, hang("b.pdf", "TCVN 7336:2021")); apDung(so, hang("b.pdf", "TCVN 7336:2021"), xu);
    expect(xu.kieu).toBe("trung"); expect(so.hang).toHaveLength(1); expect(so.loai).toHaveLength(1);
  });
  it("bản mới hơn thay đúng vị trí bản cũ", () => {
    const so = soMoi(hang("x", "NĐ 1/2020"), hang("tc15.pdf", "TCVN 7568-14:2015"), hang("y", "NĐ 2/2020"));
    const m = hang("tc25.pdf", "TCVN 7568-14:2025"); const xu = xuLy(so, m); apDung(so, m, xu);
    expect(xu.kieu).toBe("thay"); expect(so.hang.map((h) => h.ten)).toEqual(["x", "tc25.pdf", "y"]);
    expect(so.hang[1].ghi_chu).toMatch(/Thay thế.*tc15\.pdf/);
  });
  it("bản cũ hơn đến sau → loại", () => {
    const so = soMoi(hang("tc25.pdf", "TCVN 7568-14:2025"));
    expect(xuLy(so, hang("tc15.pdf", "TCVN 7568-14:2015")).kieu).toBe("cu_hon");
  });
  it("sửa đổi bổ sung thay vào dòng văn bản gốc; AI khai thay_the cũng thay", () => {
    const so = soMoi(hang("g.pdf", "QCVN 6:2022"), hang("nd105.pdf", "NĐ 105/2025"));
    const sd = hang("sd.pdf", "QCVN 6:2022", { tieu_de: "Sửa đổi 1:2023 QCVN 06" });
    expect(xuLy(so, sd).kieu).toBe("thay");
    const n347 = hang("347.pdf", "NĐ 347/2026");
    const xu = xuLy(so, n347, [{ van_ban: "105/2025/NĐ-CP", kieu: "sua_doi_bo_sung" }]);
    expect(xu).toMatchObject({ kieu: "thay", loai: "sua_doi_bo_sung" });
  });
});
