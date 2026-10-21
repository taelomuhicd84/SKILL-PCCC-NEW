// Chọn và nhúng sẵn chữ các trang liên quan vào prompt job: agent đỡ phải Grep/Read nhiều lượt (mỗi lượt đọc lại cả ngữ cảnh, tốn cache đọc).
import type { TrangChu } from "./pdf_chu";
import type { ThongTin } from "./schema";

const TU_KHOA: Record<string, RegExp> = {
  "m01-phan-loai": /diện tích|số tầng|chiều cao|nhóm nhà|F\d\.\d|bậc chịu lửa|thống kê|quy mô/i,
  "m02-bac-chiu-lua": /bậc chịu lửa|giới hạn chịu lửa|GHCL|REI|\bR\s?\d{2}|cột|dầm|kết cấu/i,
  "m03-khoang-cach": /khoảng cách|lân cận|ranh|công trình|mặt bằng tổng thể|Bảng E/i,
  "m04-giao-thong": /xe chữa cháy|đường PCCC|bãi đỗ|bán kính|tiếp cận|cổng|lối vào|giao thông/i,
  "m05-cong-nang": /công năng|phòng trực|tầng hầm|phòng kỹ thuật|bố trí|kho/i,
  "m06-ngan-chay": /ngăn cháy|GHCL|EI\s?\d|REI|FD\d|cửa chống cháy|khoang cháy|hành lang|tỉ lệ cửa/i,
  "m07-thoat-nan": /thoát nạn|lối ra|hành lang|cầu thang|CT\d|buồng thang|chiều rộng|khoảng cách thoát|cửa thoát/i,
  "m08-thang-may-cc": /thang máy|thang chữa cháy|giếng thang/i,
  "m09-chong-khoi": /hút khói|tăng áp|thoát khói|quạt|louver|bù khí/i,
  "m10-binh-chua-chay": /bình chữa cháy|BCC|mặt nạ|dụng cụ phá dỡ|CO2|ABC/i,
  "m11-bao-chay": /báo cháy|đầu báo|tủ trung tâm|BC-?\d|zone|nút ấn|chuông/i,
  "m12-chua-chay": /chữa cháy|sprinkler|họng|trạm bơm|bể|CC-?\d|bơm|đường ống/i,
  "m13-cap-dien": /cấp điện|nguồn|MTS|máy phát|ắc quy|MCCB|CFR|chịu lửa|CĐ-?\d|tủ điện/i,
  "m14-den-su-co": /EXIT|\bEM\b|sự cố|chỉ dẫn|loa|chiếu sáng/i,
  "m15-cnch": /phá dỡ|mặt nạ|cứu nạn|bảo hộ|cơ giới/i,
  "m16-chong-set": /chống sét|kim thu|nối đất|thu lôi/i,
  "m17-lien-lac": /liên lạc|điện thoại|bộ đàm/i,
  "m18-quang-cao": /quảng cáo|biển/i,
};

/** Chữ gọn của một trang: bỏ dòng ngắn/lặp, giữ thứ tự đọc. */
export function chuGon(t: TrangChu): string {
  const thay = new Set<string>(), out: string[] = [];
  for (const c of t.chu) { const s = c.s.trim(); if (s.length < 2 || thay.has(s)) continue; thay.add(s); out.push(s); }
  return out.join(" | ");
}

/** Tối đa `toiDa` trang điểm cao nhất theo từ khóa của agent, tổng không quá `kyTu` ký tự; trả "" nếu agent không có từ khóa hoặc không trang nào khớp. */
export function trangLienQuan(agent: string, tt: ThongTin | null, chu: TrangChu[], bat = false, toiDa = 6, kyTu = 14000): string {
  const re = TU_KHOA[agent];
  if (!bat || !re || !chu.length) return ""; // TẮT mặc định: đo 2026-10-21 trên Hoàng Anh 2 thấy nhúng chữ làm tăng token (xem BAO_CAO_TIEN_DO.md)
  const loai = new Map((tt?.trang ?? []).map((t) => [t.trang, t.loai]));
  const diem = chu.map((t) => {
    const g = chuGon(t);
    const khop = g.match(new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g"))?.length ?? 0;
    const thuyetMinh = loai.get(t.trang) === "thuyết minh" ? 1 : 0; // trang thuyết minh thường nêu quy định áp dụng
    return { t, g, d: khop + thuyetMinh * Math.min(khop, 3) };
  }).filter((x) => x.d > 0).sort((a, b) => b.d - a.d).slice(0, toiDa);
  let con = kyTu;
  const khung = diem.map(({ t, g }) => { const x = g.slice(0, Math.min(3500, con)); con -= x.length; return con >= 0 && x ? `### Trang ${t.trang}\n${x}` : ""; }).filter(Boolean);
  return khung.join("\n");
}
