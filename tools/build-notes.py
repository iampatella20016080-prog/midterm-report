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
    "s-cover": "封面", "s-topic": "1 主題：關懷對象、時間與場域", "s-evA": "背景資料：長者跌倒",
    "s-evB": "背景資料：一氧化碳中毒", "s-scnA": "情境 A：獨居長者夜間如廁", "s-scnB": "情境 B：外宿同學冬天洗澡",
    "s-issues": "2 橫向關係：議題與感測器", "s-sensors": "感測系統與元件", "s-place": "感測器擺放位置", "s-diagram": "感測器關係圖",
    "s-compare": "與市售感測系統比較", "s-plan": "3 檢測觀察過程的規劃", "s-flowA": "監測流程 A：夜間如廁",
    "s-flowB": "監測流程 B：洗澡時的一氧化碳", "s-items": "4 檢測觀察項目", "s-signal": "5 感測器訊號的收集",
    "s-arch": "縱向關係：對應課堂的物聯網架構", "s-analysis": "6 資料整理分析與文獻佐證", "s-results": "7 討論：預計結果",
    "s-benefits": "討論：效益", "s-smart": "討論：SMART 五要素", "s-privacy": "討論：隱私與資料分享", "s-limits": "討論：限制與下一步",
    "s-refs": "8 參考資料", "s-thanks": "謝謝聆聽",
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
