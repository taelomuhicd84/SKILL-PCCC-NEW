import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// data/ ở gốc repo (bảng JSON + mẫu docx) được phục vụ như thư mục public: /bang/*.json, /mau/*.docx
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH ?? "./",
  publicDir: "../data",
  server: { fs: { allow: [".."] } },
  build: { chunkSizeWarningLimit: 3000 },
});
