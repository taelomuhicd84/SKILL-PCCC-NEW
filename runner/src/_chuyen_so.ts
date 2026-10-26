// Chạy một lần: chuyển chỉ mục cũ (_chi_muc.json) sang sổ trong thư mục + sinh checklist, KHÔNG gọi AI. File chưa có trong chỉ mục sẽ được liệt kê "cần học".
import { chuyenSoCu } from "./hoc";
console.log(JSON.stringify(chuyenSoCu(process.argv[2]), null, 1));
