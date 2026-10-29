#!/usr/bin/env python3
"""Generate docs/speaker-notes.md from the <aside class="notes"> blocks in index.html."""
import html
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CPS = 4.6  # characters per second, same pacing as src/deck.js

import sys
FINAL = "--final" in sys.argv  # final-draft.html → docs/speaker-notes-final.md
src = open(os.path.join(ROOT, "final-draft.html" if FINAL else "index.html"), encoding="utf-8").read()
sections = re.findall(r'<section class="[^"]*" id="([^"]+)"(.*?)</section>', src, flags=re.S)
TITLES = {
    "s-cover": "封面", "s-topic": "1 主題：關懷對象、時間與場域", "s-evA": "背景資料：長者跌倒",
    "s-evB": "背景資料：一氧化碳中毒", "s-scnA": "情境 A：獨居長者夜間如廁", "s-scnB": "情境 B：外宿同學冬天洗澡",
    "s-issues": "2 橫向關係：議題與感測器", "s-sensors": "感測系統與元件", "s-place": "感測器擺放位置", "s-diagram": "感測器關係圖",
    "s-compare": "與市售感測系統比較", "s-plan": "3 檢測觀察過程的規劃", "s-flowA": "監測流程 A：夜間如廁",
    "s-flowB": "監測流程 B：洗澡時的一氧化碳", "s-items": "4 檢測觀察項目", "s-signal": "5 感測器訊號的收集",
    "s-arch": "縱向關係：我的健康物聯網", "s-analysis": "6 資料整理分析與文獻佐證", "s-results": "7 討論：預計結果",
    "s-benefits": "討論：效益", "s-smart": "討論：SMART 五要素", "s-privacy": "討論：隱私與資料分享", "s-limits": "討論：限制與下一步",
    "s-next": "期末報告：接下來要完成的項目", "s-refs": "參考資料", "s-thanks": "謝謝聆聽",
    # final-draft.html
    "s-fcover": "封面", "s-focus": "5 期中之後：聚焦兩個議題", "s-radar": "毫米波雷達量到什麼", "s-collect": "訊號怎麼收集",
    "s-fspec": "6 跌倒那一下：頻譜圖", "s-fheight": "跌倒那一下：身體高度", "s-fspeed": "跌倒那一下：速度與加速度",
    "s-still": "跌倒之後：躺著不動", "s-breath": "有沒有在呼吸", "s-voice": "語音確認：文獻怎麼說",
    "s-ftable": "7 對照表：三種狀態的訊號", "s-logic": "本設計的判斷流程", "s-innov": "一般做法 vs 本設計",
    "s-flimits": "限制與下一步", "s-frefs": "8 參考資料",
}
out = ["# 期末報告講稿（Speaker Notes）" if FINAL else "# 講稿（Speaker Notes）", "",
       f"> 由 `{'final-draft.html' if FINAL else 'index.html'}` 內每頁的 `<aside class=\"notes\">` 自動產生（`python3 tools/build-notes.py{' --final' if FINAL else ''}`）。",
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
open(os.path.join(ROOT, "docs", "speaker-notes-final.md" if FINAL else "speaker-notes.md"), "w", encoding="utf-8").write("\n".join(out))
print(f"{len(sections)} slides, ~{total/60:.1f} min of narration")
