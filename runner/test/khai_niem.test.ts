import { describe, expect, it } from "vitest";
import { loHong, slugHoa, type KhaiNiem } from "../src/khai_niem";

const the = (ten: string, lien_quan: string[], dong_nghia: string[] = []): KhaiNiem => ({ slug: slugHoa(ten), ten, dong_nghia, anh_huong: [], lien_quan, ngay: "", dinh_nghia: [], cach_xac_dinh: [], ap_dung: [], khong_ap_dung: [], yeu_cau: [], cach_kiem: [], hay_nham: [] });
describe("khái niệm", () => {
  it("slug bỏ dấu", () => expect(slugHoa("Buồng thang bộ không nhiễm khói")).toBe("buong-thang-bo-khong-nhiem-khoi"));
  it("lỗ hổng = được nhắc mà chưa có thẻ (kể cả qua đồng nghĩa)", () => {
    const ds = [the("Tầng hầm", ["Chiều cao PCCC", "Nhà đa năng"]), the("Công trình hỗn hợp", [], ["Nhà đa năng"])];
    expect(loHong(ds)).toEqual(["Chiều cao PCCC"]);
  });
});
