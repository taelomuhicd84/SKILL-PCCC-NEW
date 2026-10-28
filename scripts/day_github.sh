#!/usr/bin/env bash
# Kiểm bí mật, chạy test + build, commit, rồi đẩy lên GitHub bằng tài khoản taelomuhicd84. Không bao giờ force push.
# Dùng: bash scripts/day_github.sh "thông điệp commit" [đường_dẫn_file_mới_cần_thêm …]
# Chỉ thêm file đã theo dõi (git add -u) và các đường dẫn truyền vào; không tự thêm ket_qua/, graphify-out/.
# Thoát: 0 xong · 1 test/build lỗi · 2 phát hiện bí mật · 3 push cần đăng nhập hoặc lỗi mạng (người dùng đăng nhập GitHub một lần rồi chạy lại).
set -u
cd "$(dirname "$0")/.." || exit 1
export PATH="$LOCALAPPDATA/Programs/node-v22.23.3-win-x64:$PATH"
MSG="${1:?cần thông điệp commit}"; shift
TK="taelomuhicd84"

if ! git diff --quiet || ! git diff --cached --quiet || [ -n "$(git ls-files --others --exclude-standard -- "$@")" ]; then
  npx vitest run >/tmp/day_test.log 2>&1 || { tail -20 /tmp/day_test.log; echo "TEST LỖI"; exit 1; }
  npm run build >/tmp/day_build.log 2>&1 || { tail -20 /tmp/day_build.log; echo "BUILD LỖI"; exit 1; }
  git add -u
  [ $# -gt 0 ] && git add -- "$@"
  if git diff --cached --name-only | grep -iE "profile|cookie|token|gemini_key|\.env$"; then
    git reset -q; echo "PHÁT HIỆN FILE BÍ MẬT trong commit, đã hủy"; exit 2
  fi
  git commit -q -m "$MSG

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" || { echo "không có gì để commit"; }
fi

[ "$(git rev-list --count origin/main..HEAD)" = "0" ] && { echo "không có commit nào cần đẩy"; exit 0; }
# GIT_TERMINAL_PROMPT=0: thiếu đăng nhập thì lỗi ngay thay vì treo; credential.username chọn đúng tài khoản trong Git Credential Manager
GIT_TERMINAL_PROMPT=0 timeout 120 git -c "credential.https://github.com.username=$TK" push origin main 2>&1 | tail -3
if [ "${PIPESTATUS[0]}" != "0" ]; then echo "PUSH LỖI: có thể cần đăng nhập GitHub (tài khoản $TK) một lần bằng 'git push' trong terminal"; exit 3; fi
echo "đã đẩy lên GitHub ($TK): $(git log -1 --format='%h %s')"
