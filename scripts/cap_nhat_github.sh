#!/usr/bin/env bash
# Kéo code từ GitHub rồi in ra những gì MỚI trong ba file ghi chú của người dùng (để Claude báo lại).
# Dùng: bash scripts/cap_nhat_github.sh
set -u
cd "$(dirname "$0")/.." || exit 1
export PATH="$LOCALAPPDATA/Programs/node-v22.23.3-win-x64:$PATH"
FILES="NOTE_CUA_TOI.md TIEN_DO.md BAT_DAU_PHIEN_MOI.md DONG_BO_TRAIN.md"
OLD=$(git rev-parse HEAD)
git pull --ff-only 2>&1 | tail -3
[ "${PIPESTATUS[0]}" = 0 ] || { echo "PULL LỖI (có thay đổi cục bộ vướng?): xem git status"; exit 1; }
NEW=$(git rev-parse HEAD)
[ "$OLD" = "$NEW" ] && { echo "Không có gì mới trên GitHub."; exit 0; }
echo "=== Commit mới ==="; git log --oneline "$OLD..$NEW"
echo "=== File đổi: $(git diff --name-only "$OLD" "$NEW" | wc -l) ==="
for f in $FILES; do
  git diff --quiet "$OLD" "$NEW" -- "$f" && { echo "--- $f: không đổi"; continue; }
  echo "--- $f: dòng MỚI/SỬA ---"
  git diff -U0 "$OLD" "$NEW" -- "$f" | grep -E '^\+' | grep -vE '^\+\+\+' | cut -c2- | cut -c1-400
done
if git diff --name-only "$OLD" "$NEW" | grep -q '^web/'; then echo "=== web/ đổi: build lại ==="; npm run build 2>&1 | tail -2; fi
git diff --name-only "$OLD" "$NEW" | grep -q '^runner/' && echo "=== runner/ đổi: tắt runner đang chạy rồi bật lại (chay.bat) ==="
git diff --name-only "$OLD" "$NEW" | grep -qE '^package(-lock)?\.json$' && echo "=== package.json đổi: chạy npm install ==="
exit 0
