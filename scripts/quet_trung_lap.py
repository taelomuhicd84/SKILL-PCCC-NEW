import sys; sys.stdout.reconfigure(encoding="utf-8")
"""Quét đoạn văn trùng giữa knowledge/, skills/, shared/src/agents.ts. Chỉ báo cáo, không sửa.
Dùng: python scripts/quet_trung_lap.py"""
import re, glob, collections
files = glob.glob("knowledge/**/*.md", recursive=True) + glob.glob("skills/**/*.md", recursive=True) + ["shared/src/agents.ts"]
seen = collections.defaultdict(set)
for f in files:
    if "/hoc/" in f.replace("\\", "/"): continue  # hoc/ là file sinh, _da_duyet.md gộp từ ghi chú lẻ
    for ln in open(f, encoding="utf-8", errors="ignore"):
        k = re.sub(r"\s+", " ", ln).strip().lower()
        if len(k) >= 120: seen[k].add(f)
rows = [(len(v), k[:90], sorted(v)) for k, v in seen.items() if len(v) > 1]
for n, k, v in sorted(rows, reverse=True): print(n, "|", k, "|", ", ".join(v))
print(f"\n{len(rows)} dòng dài trùng giữa >=2 file")
