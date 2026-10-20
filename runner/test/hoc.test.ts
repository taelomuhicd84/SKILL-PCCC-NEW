import { describe, expect, it } from "vitest";
import { choDenReset } from "../src/engines/claude";

describe("tự học: chờ hết hạn mức", () => {
  it("đọc giờ reset trong thông báo", () => {
    const now = new Date(2026, 9, 20, 11, 31);
    expect(choDenReset("You've hit your session limit · resets 3:20pm (Asia/Ho_Chi_Minh)", now)).toBe(((15 - 11) * 60 + 20 - 31 + 2) * 60_000);
    expect(choDenReset("resets 9am", now)).toBe(((24 - 11 + 9) * 60 - 31 + 2) * 60_000); // đã qua 9 giờ sáng → sáng mai
    expect(choDenReset("rate limit", now)).toBe(15 * 60_000);
  });
});
