import { batDauHoc, trangThai } from "./hoc";
batDauHoc("khai-niem-lo-hong", 60);
const t = setInterval(() => { console.log(new Date().toISOString().slice(11, 19), trangThai.xong + "/" + trangThai.tong, trangThai.viec); if (!trangThai.dang) { clearInterval(t); console.log(JSON.stringify(trangThai)); process.exit(0); } }, 60000);
