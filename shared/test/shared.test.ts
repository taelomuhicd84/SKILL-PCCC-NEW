import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { chonBangChinh, chonBangHeThong, chiaMuc, lapJobs, agentChoMuc, gop, ThongTin, promptJob, type Bang } from "../src";

const bang = (ma: string): Bang => JSON.parse(readFileSync(`data/bang/${ma}.json`, "utf8"));
const haTT = ThongTin.parse({
  ten_cong_trinh: "Karaoke Hoàng Anh 1", cong_nang: "karaoke",
  truong: { A01: { gia_tri: "F2.1", nguon: "", trang_thai: "doc" }, A03: { gia_tri: 7.6, nguon: "", trang_thai: "doc" } },
  he_thong: { bao_chay: true, sprinkler: true, chong_khoi: true, hong_nuoc: null },
});

describe("chọn bảng", () => {
  it("Hoàng Anh 1 → B15 + bảng hệ thống", () => {
    expect(chonBangChinh(haTT).ma).toBe("B15");
    const ht = chonBangHeThong(haTT).map((b) => b.ma);
    for (const m of ["B34", "B35", "B39", "B45", "B46", "B48", "B38"]) expect(ht).toContain(m);
  });
  it("theo chiều cao", () => {
    const t = (cn: string, h: number) => chonBangChinh(ThongTin.parse({ cong_nang: cn, truong: { A03: { gia_tri: h } } })).ma;
    expect(t("chung cư", 30)).toBe("B4.2");
    expect(t("văn phòng", 60)).toBe("B6.3");
    expect(t("nhà hỗn hợp", 20)).toBe("B5.1");
    expect(t("kho hàng", 10)).toBe("B18");
  });
});

describe("chia mục", () => {
  it("B15 có 18 mục, agent đúng", () => {
    const m = chiaMuc(bang("B15"));
    expect(m).toHaveLength(18);
    expect(agentChoMuc(m[6].tieu_de).id).toBe("m07-thoat-nan");
    expect(agentChoMuc(m[13].tieu_de).id).toBe("m14-den-su-co");
    expect(agentChoMuc(m[9].tieu_de).id).toBe("m10-binh-chua-chay");
    expect(agentChoMuc(m[14].tieu_de).id).toBe("m15-cnch");
    expect(agentChoMuc(m[8].tieu_de).id).toBe("m09-chong-khoi");
  });
  it("B17 bỏ dòng đánh số cột", () => {
    const m = chiaMuc(bang("B17"));
    expect(m[0].tieu_de).toMatch(/chiều cao/);
  });
  it("job phủ đủ mọi dòng, id không trùng", () => {
    const b = bang("B15");
    const jobs = lapJobs(b, [bang("B35")]);
    const n = jobs.filter((j) => j.bang === "B15").reduce((s, j) => s + j.dong.length, 0);
    expect(n).toBe(b.dong.length);
    expect(new Set(jobs.map((j) => j.id)).size).toBe(jobs.length);
    expect(jobs.every((j) => j.dong.length <= 45)).toBe(true);
    expect(promptJob({ che_do: "tep", thong_tin: haTT, so_trang: 3, huong_dan: true, tep: { pdf: "a.pdf", chu_dir: "chu" } }, jobs[6])).toContain("huong_dan");
  });
});

describe("gộp", () => {
  it("đánh số khung và ghi đè", () => {
    const d = (idx: number, k: any, extra = {}) => ({ bang: "B15", idx, tt: "", noi_dung_thiet_ke: "", ket_luan: k, ly_do: "", dieu_khoan: "", nguon: [], vi_tri: [], ...extra });
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
