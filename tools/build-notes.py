#!/usr/bin/env python3
"""Generate docs/speaker-notes.md from the <aside class="notes"> blocks in index.html."""
import html
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CPS = 4.6  # characters per second, same pacing as src/deck.js

src = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
sections = re.findall(r'<section class="[^"]*" id="([^"]+)"(.*?)</section>', src, flags=re.S)
TITLES = {
    "s-cover": "封面：你還好嗎？", "s-hook": "兩個時刻", "s-issue": "人文關懷議題：守護，但不窺視",
    "s-evA": "證據 A：跌倒之後", "s-evB": "證據 B：一氧化碳", "s-scnA": "情境 A：對家人的關心",
    "s-scnB": "情境 B：對同學、朋友的關心", "s-principles": "四個設計原則", "s-sensors": "感測器",
    "s-place": "感測器擺放", "s-arch": "五層架構", "s-flowA": "監測流程 A：夜間如廁",
    "s-flowB": "監測流程 B：冬夜洗澡的一氧化碳", "s-privacy": "隱私與資料分級", "s-results": "預計結果",
    "s-benefits": "效益", "s-limits": "限制與下一步", "s-close": "結語", "s-refs": "參考資料",
}
out = ["# 講稿（Speaker Notes）", "",
       "> 由 `index.html` 內每頁的 `<aside class=\"notes\">` 自動產生（`python3 tools/build-notes.py`）。",
       "> 簡報時按 **N** 可在畫面下方顯示當頁講稿；「（下一步）」表示此時按 → 播放下一段動畫。", ""]
total = 0
for i, (sid, body) in enumerate(sections):
    m = re.search(r'<aside class="notes">(.*?)</aside>', body, flags=re.S)
    note = html.unescape(re.sub(r"<[^>]+>", "", m.group(1))).strip() if m else ""
    chars = len(re.sub(r"[\s（）()「」]", "", note))
    sec = chars / CPS
    total += sec
    out += [f"## {i:02d}　{TITLES.get(sid, sid)}　<sub>約 {sec:.0f} 秒</sub>", "", note, ""]
out.insert(4, f"> 全部講稿約 {total/60:.1f} 分鐘（以每秒 {CPS} 字估算，不含動畫與停頓）。")
open(os.path.join(ROOT, "docs", "speaker-notes.md"), "w", encoding="utf-8").write("\n".join(out))
print(f"{len(sections)} slides, ~{total/60:.1f} min of narration")
