// Nhịp thao tác chậm cho Gemini web (giảm tải cho dịch vụ, tránh gửi dồn): nghỉ giữa thao tác, giãn cách giữa các lần gửi
// trên mọi tab, nghỉ dài sau vài lượt. Không phải công cụ né phát hiện; gặp xác minh/captcha thì dừng.
import type { Locator, Page } from "playwright";

export const ngauNhien = (a: number, b: number) => a + Math.random() * (b - a);
export const nghi = (a: number, b: number) => new Promise((r) => setTimeout(r, ngauNhien(a, b)));

/** Di chuột theo vài bước tới giữa phần tử (lệch ngẫu nhiên) rồi bấm. */
export async function bam(page: Page, l: Locator) {
  const b = await l.boundingBox().catch(() => null);
  if (b) {
    await page.mouse.move(b.x + b.width * ngauNhien(0.3, 0.7), b.y + b.height * ngauNhien(0.3, 0.7), { steps: Math.round(ngauNhien(8, 20)) });
    await nghi(120, 450);
  }
  await l.click({ delay: ngauNhien(40, 120) });
}

/** Gõ từng đoạn, mỗi phím trễ 25–110 ms, thỉnh thoảng dừng lâu hơn như đang nghĩ. */
export async function go(page: Page, text: string) {
  for (const doan of text.match(/.{1,18}/gsu) ?? []) {
    await page.keyboard.type(doan, { delay: ngauNhien(25, 110) });
    if (Math.random() < 0.15) await nghi(300, 1200);
  }
}

/** Giãn cách giữa các lần GỬI trên mọi tab (Gemini nhìn tổng lưu lượng của tài khoản). */
let lanGuiCuoi = 0;
let hangGui: Promise<void> = Promise.resolve();
export function choLuotGui(minMs = Number(process.env.PCCC_GEMINI_GIAN_CACH ?? 6000)): Promise<void> {
  const p = hangGui.then(async () => {
    const cho = lanGuiCuoi + ngauNhien(minMs, minMs * 1.8) - Date.now();
    if (cho > 0) await new Promise((r) => setTimeout(r, cho));
    lanGuiCuoi = Date.now();
  });
  hangGui = p.catch(() => {});
  return p;
}

/** Cuộn nhẹ trang như đang đọc câu trả lời. */
export async function cuonDoc(page: Page) {
  await page.mouse.wheel(0, ngauNhien(200, 700)).catch(() => {});
  await nghi(400, 1500);
}
