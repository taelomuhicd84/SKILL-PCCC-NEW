import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { nhomTheoCongTrinh, tenCongTrinh, chonBangChinh, chonBangHeThong, chiaMuc, lapJobs, nhomCuaAgent, agentChoMuc, modelCuaJob, engineCuaJob, gop, ganHuongDan, ThongTin, promptJob, promptHuongDan, type Bang, type KetQuaDong } from "../src";

const bang = (ma: string): Bang => JSON.parse(readFileSync(`data/bang/${ma}.json`, "utf8"));
const haTT = ThongTin.parse({
  ten_cong_trinh: "Karaoke Hoàng Anh 1", cong_nang: "karaoke",
  truong: { A01: { gia_tri: "F2.1", nguon: "", trang_thai: "doc" }, A03: { gia_tri: 7.6, nguon: "", trang_thai: "doc" } },
  he_thong: { bao_chay: true, sprinkler: true, chong_khoi: true, hong_nuoc: null },
});

describe("chọn bảng", () => {
  it("Hoàng Anh 1 → A12 + bảng hệ thống", () => {
    expect(chonBangChinh(haTT).ma).toBe("A12");
    const ht = chonBangHeThong(haTT).map((b) => b.ma);
    for (const m of ["B1", "B6", "B12", "B13", "B14", "B5"]) expect(ht).toContain(m);
    expect(ht).not.toContain("B2");
  });
  it("theo công năng", () => {
    const t = (cn: string) => chonBangChinh(ThongTin.parse({ cong_nang: cn })).ma;
    expect(t("chung cư")).toBe("A2");
    expect(t("văn phòng")).toBe("A4");
    expect(t("nhà hỗn hợp")).toBe("A3");
    expect(t("kho hàng")).toBe("A15");
    expect(t("kho xăng dầu")).toBe("A18");
  });
  it("báo cháy địa chỉ → B2", () => {
    const ht = chonBangHeThong(ThongTin.parse({ he_thong: { bao_chay_dia_chi: true } })).map((b) => b.ma);
    expect(ht).toContain("B2");
    expect(ht).not.toContain("B1");
  });
});

describe("chia mục", () => {
  it("A12 có 8 mục, agent đúng", () => {
    const m = chiaMuc(bang("A12"));
    expect(m).toHaveLength(8);
    expect(m.map((x) => agentChoMuc(x.tieu_de).id)).toEqual([
      "m01-phan-loai", "m11-bao-chay", "m12-chua-chay", "m14-den-su-co", "m10-binh-chua-chay", "m15-cnch", "m13-cap-dien", "m18-quang-cao"]);
  });
  it("A14 bỏ dòng đánh số cột", () => {
    const m = chiaMuc(bang("A14"));
    expect(m[0].tieu_de).toMatch(/chiều cao/);
  });
  it("job phủ đủ mọi dòng, id không trùng", () => {
    const b = bang("A12");
    const jobs = lapJobs(b, [bang("B1")]);
    const n = jobs.filter((j) => j.bang === "A12").reduce((s, j) => s + j.dong.length, 0);
    expect(n).toBe(b.dong.length);
    expect(new Set(jobs.map((j) => j.id)).size).toBe(jobs.length);
    expect(jobs.every((j) => j.dong.length <= 45)).toBe(true);
    // hướng dẫn do agent riêng viết, agent hạng mục không còn điền
    expect(promptJob({ che_do: "tep", thong_tin: haTT, so_trang: 3, huong_dan: true, tep: { pdf: "a.pdf", chu_dir: "chu" } }, jobs[2])).not.toContain("huong_dan");
    const dk: KetQuaDong[] = [{ bang: "A12", idx: 1, tt: "1", noi_dung_thiet_ke: "", ket_luan: "CAN_XAC_NHAN", ly_do: "thiếu bề rộng", dieu_khoan: "", nguon: [], vi_tri: [] }];
    expect(promptHuongDan({ che_do: "tep", thong_tin: haTT, so_trang: 3, huong_dan: true, tep: { pdf: "a.pdf", chu_dir: "chu" } }, dk)).toContain("A12#1");
    expect(ganHuongDan(gop([dk]), { dong: [{ bang: "A12", idx: 1, huong_dan: " Bổ sung bề rộng " }, { bang: "X", idx: 9, huong_dan: "bỏ" }] })[0].huong_dan).toBe("Bổ sung bề rộng");
  });
});

describe("gộp", () => {
  it("đánh số khung và ghi đè", () => {
    const d = (idx: number, k: any, extra = {}) => ({ bang: "A12", idx, tt: "", noi_dung_thiet_ke: "", ket_luan: k, ly_do: "", dieu_khoan: "", nguon: [], vi_tri: [], ...extra });
    const out = gop([[d(1, "DAT"), d(2, "CHUA_DAT")], [d(1, "CAN_XAC_NHAN")]]);
    expect(out.map((x) => x.khung)).toEqual([1, 2]);
    expect(out[0].ket_luan).toBe("CAN_XAC_NHAN");
  });
});

import { vniSangUnicode } from "../src/vni";
describe("font VNI", () => {
  it("đổi chữ VNI", () => {
    expect(vniSangUnicode("MAËT BAÈNG TAÀNG TREÄT")).toBe("MẶT BẰNG TẦNG TRỆT");
    expect(vniSangUnicode("Ñöôøng thoaùt naïn")).toBe("Đường thoát nạn");
    expect(vniSangUnicode("CÖÛA CHOÁNG CHAÙY")).toBe("CỬA CHỐNG CHÁY");
    expect(vniSangUnicode("Lối thoát nạn")).toBe("Lối thoát nạn"); // Unicode giữ nguyên
    expect(vniSangUnicode("CÔNG TRÌNH")).toBe("CÔNG TRÌNH");
    expect(vniSangUnicode("D3 0.8x2.1")).toBe("D3 0.8x2.1");
    expect(vniSangUnicode("ÔÛ")).toBe("Ở");
    expect(vniSangUnicode("KARAOKE HOÀNG ANH")).toBe("KARAOKE HOÀNG ANH");
    expect(vniSangUnicode("COÄNG HOØA XAÕ HOÄI CHUÛ NGHÓA VIEÄT NAM")).toBe("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM");
  });
});

describe("gộp hồ sơ theo công trình", () => {
  it("4 file → 2 nhóm", () => {
    const g = nhomTheoCongTrinh(["PCCC Hoàng Anh.pdf", "Kiến trúc Liên Thành.pdf", "KT Hoàng Anh.pdf", "PCCC Liên Thành.pdf"], (x) => x);
    expect(g.map((x) => x.ten)).toEqual(["Hoàng Anh", "Liên Thành"]);
    expect(g[0].files).toEqual(["KT Hoàng Anh.pdf", "PCCC Hoàng Anh.pdf"]);
  });
  it("bỏ ngày, số thứ tự, phiên bản; giữ số trong tên", () => {
    expect(tenCongTrinh("01_BV PCCC_Hoàng Anh 1_v2 (1).pdf").ten).toBe("Hoàng Anh 1");
    expect(tenCongTrinh("Hoàng Anh 1 - KT 21.06.24.pdf").key).toBe("hoang anh 1");
    expect(tenCongTrinh("Hoàng Anh.pdf").key).not.toBe(tenCongTrinh("Hoàng Anh 1.pdf").key);
  });
  it("tên chỉ có bộ môn và ngày: nhóm riêng, giữ tên", () => {
    expect(tenCongTrinh("KT 21.06.24.pdf").ten).toBe("KT");
  });
  it("lập job kiến trúc từ bảng KT và tách nhóm", async () => {
    const b = bang;
    const kt = lapJobs(b("A12"), [], b("KT15"), "kien-truc");
    expect(kt.map((j) => j.agent)).toEqual(expect.arrayContaining(["m01-phan-loai", "m03-khoang-cach", "m07-thoat-nan", "m06-ngan-chay"]));
    expect(kt.every((j) => nhomCuaAgent(j.agent) !== "pccc")).toBe(true);
    expect(lapJobs(b("A12"), [], b("KT15"), "pccc").some((j) => j.bang === "KT15")).toBe(false);
  });
});

describe("model theo job", () => {
  it("việc tra bảng dùng haiku và giao Gemini ở hỗn hợp; việc khó dùng sonnet", () => {
    expect(modelCuaJob("A12-m10-binh-chua-chay-2")).toBe("haiku");
    expect(engineCuaJob("B12-m10-binh-chua-chay")).toBe("gemini");
    expect(modelCuaJob("KT15-m07-thoat-nan")).toBe("sonnet");
    expect(engineCuaJob("KT15-m07-thoat-nan")).toBe("claude");
    expect(modelCuaJob("A0-doc-ho-so")).toBe("sonnet");
    expect(modelCuaJob("R-ra-soat")).toBe("sonnet");
  });
});
