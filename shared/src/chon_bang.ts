// GĐ2: chọn bảng công năng theo công năng + chiều cao PCCC, bảng hệ thống theo cờ (bang_doi_chieu/DANH_MUC.md).
import type { HeThongKey, ThongTin } from "./schema";

type Luat = { re: RegExp; bang: string | ((h: number | null) => string) };
const theoCao = (moc: number[], ma: string[]) => (h: number | null) => {
  if (h == null) return ma[0];
  const i = moc.findIndex((m) => h <= m);
  return ma[i < 0 ? ma.length - 1 : i];
};

// Thứ tự quan trọng: mẫu cụ thể trước mẫu chung.
const LUAT: Luat[] = [
  { re: /karaoke|vũ trường|F2\.1/i, bang: "B15" },
  { re: /hỗn hợp/i, bang: theoCao([28, 50], ["B5.1", "B5.2", "B5.3"]) },
  { re: /chung cư|nhà ở tập thể|F1\.3/i, bang: theoCao([28, 75], ["B4.1", "B4.2", "B4.3"]) },
  { re: /khách sạn|nhà nghỉ|F1\.2/i, bang: theoCao([28, 50], ["B7.1", "B7.2", "B7.3"]) },
  { re: /văn phòng|F4\.3/i, bang: theoCao([28, 50], ["B6.1", "B6.2", "B6.3"]) },
  { re: /nhà trẻ|mẫu giáo|mầm non/i, bang: "B8" },
  { re: /trường|tiểu học|THCS|THPT|phổ thông/i, bang: "B9" },
  { re: /bệnh viện|phòng khám|y tế/i, bang: "B10" },
  { re: /trung tâm thương mại|TTTM|siêu thị/i, bang: "B12" },
  { re: /chợ/i, bang: "B11" },
  { re: /sân vận động|nhà thi đấu|thể thao/i, bang: "B13" },
  { re: /rạp chiếu|rạp hát|cinema/i, bang: "B14" },
  { re: /gara|bãi đỗ xe|nhà để xe/i, bang: "B16" },
  { re: /cửa hàng xăng|cây xăng/i, bang: "B19" },
  { re: /kho xăng/i, bang: "B20" },
  { re: /cửa hàng.*khí|khí đốt/i, bang: "B21" },
  { re: /đường ống khí/i, bang: "B22" },
  { re: /san chiết|trạm chiết/i, bang: "B23" },
  { re: /LPG/i, bang: "B24" },
  { re: /LNG/i, bang: "B25" },
  { re: /vật liệu nổ/i, bang: "B26" },
  { re: /điện gió/i, bang: "B27" },
  { re: /điện mặt trời/i, bang: "B28" },
  { re: /trạm biến áp/i, bang: "B29" },
  { re: /hầm đường bộ/i, bang: "B30" },
  { re: /tàu biển/i, bang: "B31" },
  { re: /thủy nội địa.*hàng/i, bang: "B32" },
  { re: /thủy nội địa|tàu khách/i, bang: "B33" },
  { re: /sản xuất|nhà xưởng|xưởng|F5\.1/i, bang: "B17" },
  { re: /kho|F5\.2/i, bang: "B18" },
  { re: /quy hoạch/i, bang: "B1" },
  { re: /địa điểm/i, bang: "B2" },
  { re: /hạ tầng/i, bang: "B3" },
];

const HE_THONG_BANG: Record<HeThongKey, string> = {
  chong_khoi: "B34", bao_chay: "B35", tram_bom: "B36", ngoai_nha: "B37", hong_nuoc: "B38", sprinkler: "B39",
  bot_co_dinh: "B40", khi: "B43", sol_khi: "B44", khi_dot: "B47", thang_may_cc: "B50", chong_set: "B49",
};
/** Bảng hệ thống xét cho mọi công trình có đường thoát nạn / hệ thống PCCC. */
export const BANG_LUON_XET = ["B45", "B46", "B48"];

export function chieuCao(tt: ThongTin): number | null {
  const v = tt.truong?.A03?.gia_tri;
  const n = typeof v === "number" ? v : parseFloat(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function chonBangChinh(tt: ThongTin): { ma: string | null; ly_do: string } {
  const text = [tt.cong_nang, tt.truong?.A01?.gia_tri, tt.ten_cong_trinh].filter(Boolean).join(" · ");
  const h = chieuCao(tt);
  for (const l of LUAT) if (l.re.test(text)) {
    const ma = typeof l.bang === "string" ? l.bang : l.bang(h);
    return { ma, ly_do: `công năng "${text}"${typeof l.bang === "string" ? "" : `, chiều cao PCCC ${h ?? "chưa rõ (lấy mức thấp nhất)"} m`}` };
  }
  return { ma: null, ly_do: `chưa nhận ra công năng từ "${text}": chọn tay` };
}

export function chonBangHeThong(tt: ThongTin): { ma: string; ly_do: string }[] {
  const out = BANG_LUON_XET.map((ma) => ({ ma, ly_do: "xét cho mọi công trình" }));
  for (const [k, ma] of Object.entries(HE_THONG_BANG) as [HeThongKey, string][]) {
    const v = tt.he_thong?.[k];
    if (v === true) out.push({ ma, ly_do: "thiết kế có hệ thống" });
    else if (v == null && (k === "bao_chay" || k === "sprinkler" || k === "hong_nuoc"))
      out.push({ ma, ly_do: "chưa rõ có hay không: xét để kết luận đối tượng trang bị" });
  }
  return out.sort((a, b) => Number(a.ma.slice(1)) - Number(b.ma.slice(1)));
}
