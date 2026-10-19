import { describe, expect, it } from "vitest";
import { chuanHoa } from "../src/engines/gemini_cookies";

describe("chuẩn hoá cookie", () => {
  it("Cookie-Editor (mảng)", () => {
    const c = chuanHoa([
      { domain: ".google.com", expirationDate: 1893456000.5, hostOnly: false, httpOnly: true, name: "__Secure-1PSID", path: "/", sameSite: "unspecified", secure: true, session: false, value: "abc" },
      { domain: ".google.com", name: "NID", value: "x", sameSite: "no_restriction", secure: true, session: true },
      { domain: ".facebook.com", name: "c_user", value: "1" },
    ]);
    expect(c).toHaveLength(2);
    expect(c[0]).toMatchObject({ name: "__Secure-1PSID", expires: 1893456000, sameSite: "Lax", httpOnly: true });
    expect(c[1]).toMatchObject({ expires: -1, sameSite: "None" });
  });
  it("Playwright storageState", () => {
    const c = chuanHoa({ cookies: [{ name: "SID", value: "v", domain: ".google.com", path: "/", expires: 2000000000, httpOnly: false, secure: false, sameSite: "None" }], origins: [] });
    expect(c[0]).toMatchObject({ name: "SID", sameSite: "Lax" }); // None mà không secure → Lax
  });
});
