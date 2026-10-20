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

// Bảng kiến trúc (thẩm định xây dựng PCCC, NĐ 105 Điều 6 khoản 2): dựng từ bộ bảng cũ theo công năng và chiều cao (data-build/build_kien_truc.py).
const theoCao = (moc: number[], ma: string[]) => (h: number | null) => ma[h == null ? 0 : Math.max(0, moc.findIndex((m) => h <= m) < 0 ? ma.length - 1 : moc.findIndex((m) => h <= m))];
const LUAT_KT: { re: RegExp; ma: string | ((h: number | null) => string) }[] = [
  { re: /karaoke|vũ trường|F2\.1/i, ma: "KT15" },
  { re: /hỗn hợp/i, ma: theoCao([28, 50], ["KT5.1", "KT5.2", "KT5.3"]) },
  { re: /chung cư|nhà ở tập thể|F1\.3/i, ma: theoCao([28, 75], ["KT4.1", "KT4.2", "KT4.3"]) },
  { re: /khách sạn|nhà nghỉ|F1\.2/i, ma: theoCao([28, 50], ["KT7.1", "KT7.2", "KT7.3"]) },
  { re: /văn phòng|F4\.3/i, ma: theoCao([28, 50], ["KT6.1", "KT6.2", "KT6.3"]) },
  { re: /nhà trẻ|mẫu giáo|mầm non/i, ma: "KT8" },
  { re: /trường|tiểu học|THCS|THPT|phổ thông/i, ma: "KT9" },
  { re: /bệnh viện|phòng khám|y tế/i, ma: "KT10" },
  { re: /trung tâm thương mại|TTTM|siêu thị/i, ma: "KT12" },
  { re: /chợ/i, ma: "KT11" },
  { re: /sân vận động|nhà thi đấu|thể thao/i, ma: "KT13" },
  { re: /rạp chiếu|rạp hát|cinema/i, ma: "KT14" },
  { re: /gara|bãi đỗ xe|nhà để xe/i, ma: "KT16" },
  { re: /cửa hàng xăng|cây xăng/i, ma: "KT19" },
  { re: /kho xăng/i, ma: "KT20" },
  { re: /LPG/i, ma: "KT24" },
  { re: /LNG/i, ma: "KT25" },
  { re: /vật liệu nổ/i, ma: "KT26" },
  { re: /điện mặt trời/i, ma: "KT28" },
  { re: /trạm biến áp/i, ma: "KT29" },
  { re: /hầm đường bộ/i, ma: "KT30" },
  { re: /sản xuất|nhà xưởng|xưởng|F5\.1/i, ma: "KT17" },
  { re: /kho|F5\.2/i, ma: "KT18" },
];
export function chonBangKienTruc(tt: ThongTin): { ma: string | null; ly_do: string } {
  const text = [tt.cong_nang, tt.truong?.A01?.gia_tri, tt.ten_cong_trinh].filter(Boolean).join(" · ");
  const h = chieuCao(tt);
  for (const l of LUAT_KT) if (l.re.test(text))
    return { ma: typeof l.ma === "string" ? l.ma : l.ma(h), ly_do: `công năng "${text}"${typeof l.ma === "string" ? "" : `, chiều cao PCCC ${h ?? "chưa rõ (lấy mức thấp nhất)"} m`}` };
  return { ma: null, ly_do: `chưa có bảng kiến trúc cho "${text}": chọn tay` };
}
