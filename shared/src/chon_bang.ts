// GĐ2: chọn bảng công năng theo công năng, bảng hệ thống theo cờ (bang_doi_chieu/DANH_MUC.md).
import type { HeThongKey, ThongTin } from "./schema";

type Luat = { re: RegExp; bang: string };
// Thứ tự quan trọng: mẫu cụ thể trước mẫu chung. Bảng A = theo công năng, B = theo hệ thống.
const LUAT: Luat[] = [
  { re: /karaoke|vũ trường|F2\.1/i, bang: "A12" },
  { re: /hỗn hợp/i, bang: "A3" },
  { re: /chung cư|nhà ở tập thể|F1\.3/i, bang: "A2" },
  { re: /khách sạn|nhà nghỉ|F1\.2/i, bang: "A5" },
  { re: /văn phòng|F4\.3/i, bang: "A4" },
  { re: /nhà trẻ|mẫu giáo|mầm non/i, bang: "A6" },
  { re: /trường|tiểu học|THCS|THPT|phổ thông/i, bang: "A7" },
  { re: /bệnh viện|phòng khám|y tế/i, bang: "A8" },
  { re: /trung tâm thương mại|TTTM|siêu thị|chợ/i, bang: "A9" },
  { re: /sân vận động|nhà thi đấu|thể thao/i, bang: "A10" },
  { re: /rạp chiếu|rạp hát|cinema/i, bang: "A11" },
  { re: /gara|bãi đỗ xe|nhà để xe/i, bang: "A13" },
  { re: /cửa hàng xăng|cây xăng/i, bang: "A16" },
  { re: /kho xăng/i, bang: "A18" },
  { re: /LPG/i, bang: "A19" },
  { re: /LNG/i, bang: "A20" },
  { re: /trạm chiết|san chiết|khí đốt/i, bang: "A17" },
  { re: /vật liệu nổ/i, bang: "A21" },
  { re: /trạm biến áp/i, bang: "A22" },
  { re: /hầm đường bộ/i, bang: "A23" },
  { re: /tàu biển/i, bang: "A24" },
  { re: /thủy nội địa.*hàng/i, bang: "A25" },
  { re: /thủy nội địa|tàu khách/i, bang: "A26" },
  { re: /sản xuất|nhà xưởng|xưởng|F5\.1/i, bang: "A14" },
  { re: /kho|F5\.2/i, bang: "A15" },
  { re: /hạ tầng/i, bang: "A1" },
];

// Hệ thống có bảng riêng. Báo cháy: B1 loại thường, B2 loại địa chỉ (chọn ở chonBangHeThong).
const HE_THONG_BANG: Partial<Record<HeThongKey, string>> = {
  tram_bom: "B3", ngoai_nha: "B4", hong_nuoc: "B5", sprinkler: "B6",
  bot_co_dinh: "B7", khi_hoa_long: "B8", khi_nen: "B9", khi: "B10", sol_khi: "B11",
};
/** Bảng hệ thống xét cho mọi công trình: bình chữa cháy và dụng cụ, đèn sự cố và loa, điện PCCC. */
export const BANG_LUON_XET = ["B12", "B13", "B14"];

export function chieuCao(tt: ThongTin): number | null {
  const v = tt.truong?.A03?.gia_tri;
  const n = typeof v === "number" ? v : parseFloat(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function chonBangChinh(tt: ThongTin): { ma: string | null; ly_do: string } {
  const text = [tt.cong_nang, tt.truong?.A01?.gia_tri, tt.ten_cong_trinh].filter(Boolean).join(" · ");
  for (const l of LUAT) if (l.re.test(text)) {
    return { ma: l.bang, ly_do: `công năng "${text}"` };
  }
  return { ma: null, ly_do: `chưa nhận ra công năng từ "${text}": chọn tay` };
}

export function chonBangHeThong(tt: ThongTin): { ma: string; ly_do: string }[] {
  const out = BANG_LUON_XET.map((ma) => ({ ma, ly_do: "xét cho mọi công trình" }));
  const bc = tt.he_thong?.bao_chay, dc = tt.he_thong?.bao_chay_dia_chi;
  if (dc === true) out.push({ ma: "B2", ly_do: "thiết kế có báo cháy địa chỉ" });
  else if (bc !== false) out.push({ ma: "B1", ly_do: bc === true ? "thiết kế có báo cháy" : "chưa rõ có hay không: xét để kết luận đối tượng trang bị" });
  for (const [k, ma] of Object.entries(HE_THONG_BANG) as [HeThongKey, string][]) {
    const v = tt.he_thong?.[k];
    if (v === true) out.push({ ma, ly_do: "thiết kế có hệ thống" });
    else if (v == null && (k === "sprinkler" || k === "hong_nuoc"))
      out.push({ ma, ly_do: "chưa rõ có hay không: xét để kết luận đối tượng trang bị" });
  }
  return out.sort((a, b) => Number(a.ma.slice(1)) - Number(b.ma.slice(1)));
}
