// Đổi chữ gõ bằng font VNI (bản vẽ cũ, vd. "MAËT BAÈNG") sang Unicode ("MẶT BẰNG").
// Chỉ đổi khi chuỗi có dấu hiệu VNI chắc chắn (cặp nguyên âm + ký tự dấu VNI không thể có trong tiếng Việt Unicode),
// để không làm hỏng chữ Unicode bình thường (vd. "ô" hợp lệ trong Unicode nhưng là "ơ" trong VNI).

// Thứ tự dấu: sắc, huyền, hỏi, ngã, nặng
const DAU_THUONG = ["ù", "ø", "û", "õ", "ï"], DAU_HOA = ["Ù", "Ø", "Û", "Õ", "Ï"];
const MU_THUONG = ["á", "à", "å", "ã", "ä"], MU_HOA = ["Á", "À", "Å", "Ã", "Ä"]; // dấu đi với â/ê/ô
const TRANG_THUONG = ["é", "è", "ú", "ü", "ë"], TRANG_HOA = ["É", "È", "Ú", "Ü", "Ë"]; // dấu đi với ă

const BANG: [string, string][] = [];
function them(goc: string, cacDau: string[], dich: string) { cacDau.forEach((d, i) => BANG.push([goc + d, dich[i]])); }
// thường
them("a", DAU_THUONG, "áàảãạ"); them("a", MU_THUONG, "ấầẩẫậ"); them("a", TRANG_THUONG, "ắằẳẵặ");
them("e", DAU_THUONG, "éèẻẽẹ"); them("e", MU_THUONG, "ếềểễệ");
them("o", DAU_THUONG, "óòỏõọ"); them("o", MU_THUONG, "ốồổỗộ");
them("ô", DAU_THUONG, "ớờởỡợ"); them("ö", DAU_THUONG, "ứừửữự");
them("u", DAU_THUONG, "úùủũụ"); them("y", DAU_THUONG.slice(0, 4), "ýỳỷỹ");
// hoa
them("A", DAU_HOA, "ÁÀẢÃẠ"); them("A", MU_HOA, "ẤẦẨẪẬ"); them("A", TRANG_HOA, "ẮẰẲẴẶ");
them("E", DAU_HOA, "ÉÈẺẼẸ"); them("E", MU_HOA, "ẾỀỂỄỆ");
them("O", DAU_HOA, "ÓÒỎÕỌ"); them("O", MU_HOA, "ỐỒỔỖỘ");
them("Ô", DAU_HOA, "ỚỜỞỠỢ"); them("Ö", DAU_HOA, "ỨỪỬỮỰ");
them("U", DAU_HOA, "ÚÙỦŨỤ"); them("Y", DAU_HOA.slice(0, 4), "ÝỲỶỸ");
// nguyên âm có mũ/trăng không dấu
BANG.push(["aâ", "â"], ["aê", "ă"], ["eâ", "ê"], ["oâ", "ô"], ["AÂ", "Â"], ["AÊ", "Ă"], ["EÂ", "Ê"], ["OÂ", "Ô"]);
// ký tự đơn (sau khi đã xử lý cặp)
const DON: Record<string, string> = {
  "ô": "ơ", "ö": "ư", "Ô": "Ơ", "Ö": "Ư", "ñ": "đ", "Ñ": "Đ",
  "í": "í", "ì": "ì", "æ": "ỉ", "ó": "ĩ", "ò": "ị", "Í": "Í", "Ì": "Ì", "Æ": "Ỉ", "Ó": "Ĩ", "Ò": "Ị", "î": "ỵ", "Î": "Ỵ",
};

// "oà", "oá" (hoà, hoá) có cả trong Unicode nên không dùng làm dấu hiệu; các cặp còn lại chỉ có ở VNI
const DAU_VNI = /[aeouyôöAEOUYÔÖ][ùøûõïÙØÛÕÏ]|[aeoAEO][âåãäÂÅÃÄ]|[aeAE][áàÁÀ]|[aA][êéèúüëÊÉÈÚÜË]|[ñÑ]/;
// chữ Unicode tiếng Việt chỉ có ở Unicode (dựng sẵn) → chuỗi đã là Unicode
const UNICODE_VIET = /[ăắằẳẵặạảấầẩẫậđẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹĂẮẰẲẴẶẠẢẤẦẨẪẬĐẸẺẼẾỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴỶỸƠƯơư]/;

export const laVni = (s: string) => { const n = s.normalize("NFC"); return DAU_VNI.test(n) && !UNICODE_VIET.test(n); }; // PDF hay chứa Unicode dạng tổ hợp (NFD)

export function vniSangUnicode(s: string): string {
  if (!laVni(s)) return s;
  s = s.normalize("NFC");
  let out = "";
  for (let i = 0; i < s.length; ) {
    let khop = false;
    for (const [k, v] of BANG) if (s.startsWith(k, i)) { out += v; i += k.length; khop = true; break; }
    if (khop) continue;
    out += DON[s[i]] ?? s[i];
    i++;
  }
  return out;
}
