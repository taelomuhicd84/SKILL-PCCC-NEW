import { describe, expect, it } from "vitest";
import { apDungDinhChinh, gopKetQua, lintVanBan, soHieuTrongVanBan } from "../src/kiem_soat";

describe("kiểm soát viên: lint thuật ngữ, số hiệu, hiệu lực", () => {
  it("bắt văn bản hết hiệu lực không cảnh báo, bỏ qua khi có cảnh báo", () => {
    expect(lintVanBan("Trang bị theo TCVN 3890:2023.").map((v) => v.dung)).toContain("QCVN 10:2025/BCA");
    expect(lintVanBan("TCVN 3890:2023 đã bỏ, nay dùng QCVN 10:2025/BCA.")).toEqual([]);
    expect(lintVanBan("Căn cứ NĐ 136/2020 để thẩm duyệt điều chỉnh.")).toEqual([]);
  });
  it("bắt dùng 'thẩm duyệt' như thủ tục hiện hành", () => {
    expect(lintVanBan("Hồ sơ phải thẩm duyệt tại Phòng PCCC.").some((v) => v.loai === "thuat_ngu")).toBe(true);
    expect(lintVanBan("Giấy chứng nhận thẩm duyệt số 12/TD-PCCC.")).toEqual([]);
  });
  it("bắt sai năm và số hiệu lạ", () => {
    expect(lintVanBan("theo TCVN 7336:2015").some((v) => v.dung === "TCVN 7336:2021")).toBe(false); // 2015 là bản cũ đã biết
    expect(lintVanBan("theo TCVN 7336:2019").some((v) => v.dung === "TCVN 7336:2021")).toBe(true);
    expect(lintVanBan("theo NĐ 999/2025").some((v) => v.loai === "so_hieu")).toBe(true);
    expect(lintVanBan("theo NĐ 105/2025")).toEqual([]);
  });
  it("bắt lẫn bậc chịu lửa / cấp nguy hiểm cháy kết cấu / hạng / nhóm", () => {
    expect(lintVanBan("bậc chịu lửa S0").length).toBe(1);
    expect(lintVanBan("cấp nguy hiểm cháy kết cấu III").length).toBe(1);
    expect(lintVanBan("hạng nguy hiểm cháy F2.1").length).toBe(1);
    expect(lintVanBan("nhóm nguy cơ F2.1").length).toBe(1);
    expect(lintVanBan("bơm duy trì áp").length).toBe(1);
    expect(lintVanBan("bậc chịu lửa II, cấp S0, hạng C, nhóm F2.1, bơm bù áp")).toEqual([]);
  });
});

describe("kiểm soát viên: đính chính và gộp kết quả", () => {
  it("gạch đoạn sai và chèn bản đúng; không thấy thì thêm cuối bài", () => {
    const r = apDungDinhChinh("Bể phải có 108 m3 nước.", "Bể phải có 108 m3 nước", "Bể 45 m3 theo hồ sơ đã duyệt", "2026-10-20");
    expect(r.doi).toBe(true); expect(r.text).toContain("~~Bể phải có 108 m3 nước~~"); expect(r.text).toContain("đính chính 2026-10-20");
    expect(apDungDinhChinh("abc", "không có", "đúng", "2026-10-20").text).toContain("Đính chính (kiểm soát viên 2026-10-20):** đúng");
    expect(apDungDinhChinh("abc", "abc", "").doi).toBe(false);
  });
  it("kết quả: lint hoặc AI có lỗi thì can_sua", () => {
    expect(gopKetQua([], { ket_qua: "dat", van_de: [] })).toMatchObject({ ket_qua: "dat", ai: true });
    expect(gopKetQua([], undefined)).toMatchObject({ ket_qua: "dat", ai: false });
    expect(gopKetQua([], { ket_qua: "can_sua", van_de: [{ loai: "tri_so", trich: "x", ly_do: "sai" }] }).ket_qua).toBe("can_sua");
  });
  it("lấy số hiệu văn bản", () => {
    expect([...soHieuTrongVanBan("TCVN 7336:2021 và QCVN 06:2022, NĐ 105/2025, TCVN 7568-14")].sort()).toEqual(["NĐ 105/2025", "QCVN 06", "TCVN 7336", "TCVN 7568-14"]);
  });
});
