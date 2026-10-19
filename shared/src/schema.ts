// Định dạng dữ liệu chung giữa web, runner và các agent (Claude Code, Gemini).
import { z } from "zod";

export const KET_LUAN = ["DAT", "CHUA_DAT", "CAN_XAC_NHAN", "KHONG_AP_DUNG"] as const;
export const KetLuan = z.enum(KET_LUAN);
export type KetLuan = z.infer<typeof KetLuan>;
export const NHAN_KET_LUAN: Record<KetLuan, string> = {
  DAT: "ĐẠT", CHUA_DAT: "CHƯA ĐẠT", CAN_XAC_NHAN: "CẦN XÁC NHẬN", KHONG_AP_DUNG: "KHÔNG ÁP DỤNG",
};

/** Vị trí khung trên bản vẽ. Toạ độ chuẩn hoá 0–1000 theo trang đã xoay đứng (gốc trên-trái). */
export const ViTri = z.object({
  trang: z.number().int().min(1),
  anchor: z.string().optional().describe("chữ trên bản vẽ để bám khung, vd. 'D3'"),
  bbox: z.array(z.number()).length(4).optional().describe("[x0,y0,x1,y1] 0–1000"),
});
export type ViTri = z.infer<typeof ViTri>;

export const KetQuaDong = z.object({
  bang: z.string(),
  idx: z.number().int(),
  tt: z.string().default(""),
  noi_dung_thiet_ke: z.string().default(""),
  ket_luan: KetLuan,
  ly_do: z.string().default(""),
  dieu_khoan: z.string().default(""),
  chinh_ban_ve: z.string().optional().describe("sai sót/thiếu ghi chú đã rõ cách sửa"),
  nguon: z.array(z.object({ trang: z.number().int(), ghi_chu: z.string().default("") })).default([]),
  vi_tri: z.array(ViTri).default([]),
  huong_dan: z.string().optional().describe("hướng dẫn thiết kế cho đạt (khi bật)"),
});
export type KetQuaDong = z.infer<typeof KetQuaDong>;

export const KetQuaJob = z.object({
  dong: z.array(KetQuaDong),
  ghi_chu: z.string().optional(),
});
export type KetQuaJob = z.infer<typeof KetQuaJob>;

export const TrangThai = z.enum(["doc", "do", "suy", "user", "tam", "thieu"]);
export const Truong = z.object({
  gia_tri: z.union([z.string(), z.number(), z.boolean(), z.null()]),
  nguon: z.string().default(""),
  trang_thai: TrangThai.default("doc"),
});
export type Truong = z.infer<typeof Truong>;

/** Cờ hệ thống PCCC có trong thiết kế (dùng để chọn bảng hệ thống B34–B50). */
export const HE_THONG = {
  bao_chay: "Báo cháy tự động", sprinkler: "Chữa cháy tự động sprinkler (nước, bọt)", hong_nuoc: "Họng nước chữa cháy trong nhà",
  ngoai_nha: "Cấp nước chữa cháy ngoài nhà (trụ, ống)", tram_bom: "Trạm bơm, bể nước chữa cháy", chong_khoi: "Chống tụ khói (hút khói, tăng áp)",
  thang_may_cc: "Thang máy chữa cháy", chong_set: "Chống sét", bot_co_dinh: "Chữa cháy bọt cố định", khi: "Chữa cháy bằng khí (CO2, khí hoá lỏng, khí nén)",
  sol_khi: "Chữa cháy sol-khí", khi_dot: "Cấp khí đốt trung tâm",
} as const;
export type HeThongKey = keyof typeof HE_THONG;

export const ThongTin = z.object({
  ten_cong_trinh: z.string().default(""),
  dia_diem: z.string().default(""),
  chu_dau_tu: z.string().default(""),
  don_vi_thiet_ke: z.string().default(""),
  cong_nang: z.string().default("").describe("công năng chính, vd. 'karaoke', 'chung cư'"),
  truong: z.record(Truong).default({}).describe("A01…C12 theo knowledge/truong-thong-tin.md"),
  he_thong: z.record(z.boolean().nullable()).default({}).describe("cờ HE_THONG; null = chưa rõ"),
  trang: z.array(z.object({ trang: z.number().int(), loai: z.string(), tieu_de: z.string().default("") })).default([]),
  cau_hoi: z.array(z.string()).default([]),
});
export type ThongTin = z.infer<typeof ThongTin>;

/** Một dòng bảng đối chiếu (data/bang/<MA>.json do data-build/build_data.py sinh). */
export interface DongBang {
  idx: number; tt: string; noi_dung: string; goi_y: string; quy_dinh: string;
  khoan_dieu: string; ket_luan_mau: string; tra_o: string; so_o: number;
}
export interface Bang { ma: string; ten: string; file_goc: string; so_dong: number; dau_bang: string[]; dong: DongBang[] }
export interface BangIndex { ma: string; ten: string; so_dong: number }

/** Lấy khối JSON đầu tiên trong câu trả lời của AI (có hoặc không có ```json). */
export function tachJson(text: string): unknown {
  const m = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const s = (m ? m[1] : text).trim();
  const a = s.indexOf("{"), b = s.lastIndexOf("}");
  return JSON.parse(a >= 0 && b > a ? s.slice(a, b + 1) : s);
}
