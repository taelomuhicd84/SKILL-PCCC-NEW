import { describe, expect, it } from "vitest";
import { apSuaDoi, docxSach } from "../src/hop_nhat";

const run = (t: string, gach = false) => `<w:r><w:rPr>${gach ? "<w:strike/>" : '<w:strike w:val="0"/>'}</w:rPr><w:t>${t}</w:t></w:r>`;
describe("Word gạch ngang", () => {
  it("bỏ phần gạch ngang, giữ phần mới", () => {
    const x = `<w:p>${run("1.1.2 Quy chuẩn cũ", true)}</w:p><w:p>${run("1.1.2 Quy chuẩn mới")}</w:p>`;
    expect(docxSach(x)).toEqual({ text: "1.1.2 Quy chuẩn mới", co_gach: true });
  });
});
describe("áp sửa đổi vào điều/khoản", () => {
  const goc = ["1.1.1 Phạm vi", "a) khoản a cũ", "1.1.2 Áp dụng", "a) nhà ở", "g) khoản g cũ", "h) khoản h", "1.1.3 Khác"];
  it("sửa khoản g, không đụng khoản khác", () => {
    const r = apSuaDoi(goc, { dieu: "1.1.2", khoan: "g", hanh_dong: "sua", noi_dung_moi: "g) khoản g mới" }, "SĐ1")!;
    expect(r).toEqual(["1.1.1 Phạm vi", "a) khoản a cũ", "1.1.2 Áp dụng", "a) nhà ở", "g) khoản g mới ⟨SĐ1⟩", "h) khoản h", "1.1.3 Khác"]);
  });
  it("bổ sung sau khoản, bãi bỏ khoản", () => {
    expect(apSuaDoi(goc, { dieu: "1.1.2", khoan: "g", hanh_dong: "bo_sung", noi_dung_moi: "g1) thêm" }, "SĐ1")!.indexOf("g1) thêm ⟨SĐ1⟩")).toBe(5);
    expect(apSuaDoi(goc, { dieu: "1.1.2", khoan: "h", hanh_dong: "bai_bo" }, "SĐ1")).toContain("[Đã bãi bỏ bởi SĐ1: 1.1.2 h]");
  });
  it("không thấy điều → null (đưa vào mục chưa gộp được)", () => {
    expect(apSuaDoi(goc, { dieu: "9.9", hanh_dong: "sua", noi_dung_moi: "x" }, "SĐ1")).toBeNull();
  });
});
