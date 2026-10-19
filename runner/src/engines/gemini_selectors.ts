// Selector giao diện gemini.google.com (đã dò 2026-10-19, giao diện tiếng Việt). Google đổi giao diện thường xuyên:
// khi engine Gemini hỏng, sửa file này. Mỗi mục là danh sách thử lần lượt; selector đầu tiên thấy được dùng.
export const GEMINI_URL = "https://gemini.google.com/app";

export const SEL = {
  oNhap: ["rich-textarea .ql-editor", "div[contenteditable='true'][role='textbox']", "div.ql-editor[contenteditable='true']"],
  nutTaiLen: ["button[aria-label='Nội dung tải lên và công cụ']", "button[aria-label*='tải lên' i]", "button[aria-label*='Upload' i]", "uploader button"],
  mucTaiTep: ["[data-test-id='local-images-files-uploader-button']", "button:has-text('Tải tệp lên')", "button:has-text('Upload files')"],
  nutGui: ["button[aria-label='Gửi tin nhắn']", "button[aria-label*='Gửi' i]", "button[aria-label*='Send' i]"],
  nutDung: ["button[aria-label*='Dừng' i]", "button[aria-label*='Stop' i]"],
  nutTamThoi: ["button[aria-label='Cuộc trò chuyện tạm thời']", "button[aria-label*='Temporary chat' i]"],
  traLoi: ["model-response"],
  khoiMa: ["code-block code", "pre code", "code-block", "pre"], // trong model-response cuối
  tepDangTai: ["[aria-label*='Đang tải' i]", "[aria-label*='Uploading' i]", "mat-progress-spinner", ".loading"],
  // dấu hiệu bị chặn / hết lượt: dừng cả pool, không vượt captcha
  biChan: ["iframe[src*='recaptcha']", "text=/unusual traffic|lưu lượng truy cập bất thường/i", "text=/reached your limit|đã đạt đến giới hạn/i"],
} as const;
