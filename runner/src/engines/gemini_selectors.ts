// Selector giao diện gemini.google.com. Google đổi giao diện thường xuyên: khi engine Gemini hỏng, sửa file này.
// Mỗi mục là danh sách thử lần lượt; selector đầu tiên khớp được dùng.
export const GEMINI_URL = "https://gemini.google.com/app";

export const SEL = {
  oNhap: ["rich-textarea .ql-editor", "div[contenteditable='true'][role='textbox']", "div.ql-editor[contenteditable='true']"],
  nutTaiLen: [
    "button[aria-label*='Upload' i]", "button[aria-label*='Tải' i]", "button[aria-label*='file' i]",
    "button[aria-label*='Mở trình đơn tải' i]", "uploader button", "button.upload-card-button",
  ],
  mucTaiTep: ["[data-test-id='local-images-files-uploader-button']", "button:has-text('Upload files')", "button:has-text('Tải tệp lên')", "[role='menuitem']:has-text('file')", "[role='menuitem']:has-text('tệp')"],
  nutGui: ["button[aria-label*='Send' i]", "button[aria-label*='Gửi' i]", "button.send-button"],
  nutDung: ["button[aria-label*='Stop' i]", "button[aria-label*='Dừng' i]"],
  traLoi: ["model-response message-content", "model-response .markdown", ".model-response-text", "message-content"],
  dangTaiTep: ["[aria-label*='Uploading' i]", ".file-upload-progress", "mat-progress-spinner"],
} as const;
