# 進度紀錄（Progress）

> 中斷後從這裡接續：先讀本檔與 `docs/01-spec.md`，再看 `git log`。

## 狀態：期中簡報完成（依老師範本：第 1–4 項＋四個練習，19 頁）；期末草稿與實測紀錄表已準備

| 階段 | 狀態 |
|---|---|
| 讀老師的三張投影片（第 31、34、35 頁）→ 更新 `docs/01-spec.md` | ✅ |
| 補充資料：722 量血壓原則、姿勢性低血壓、雷達與 CO 模組規格 → `docs/02-research.md` E 節 | ✅ |
| 簡報改為八個章節（v2 初版 23 頁）；新增主題表、感測器關係圖、市售比較、觀察規劃、觀察項目、訊號收集、資料分析 | ✅ |
| 全部文字改為平實說明（移除品牌名、口號、破折號修辭） | ✅ |
| 檢查：`tools/inspect.mjs --fractions --master` | ✅ no issues |
| critique → revise | ✅ v2 共 5 輪（`docs/04-critique-log.md`） |
| 輸出：`exports/midterm-slides.pdf` | ✅ |
| README、講稿、最終檢核表 | ✅ |
| 加入講義 1151015 內容：橫向關係、縱向關係、血氧機比較、靜息心率、SMART、健康照護物聯網範例 | ✅ 簡報 25 頁 |
| 改成上台簡報：每頁字少、字大（內文 24–38 px），細節移到講稿；移除書面報告與影片 | ✅ |
| 依老師範本（1151105）調整：期中只做第 1–4 項＋四個練習（19 頁）；封面學號姓名與日期；章節名稱用範本原文；縱向關係改畫三層圖；市售比較表頭改用範本措辭 | ✅ |
| 第 5–8 項移到期末草稿 `final-draft.html`（9 頁） | ✅ |
| 期末實測紀錄表 `final/`（xlsx＋A4 紙本＋量測說明） | ✅ 等待實際量測 |
| 期中報告後依老師指示聚焦：夜間跌倒、昏倒沒有反應；只用毫米波雷達＋語音確認；血壓、紅外線、床墊壓力不納入期末 | ✅ |
| 文獻與訊號圖：`docs/05-signal-literature.md`（雷達 13 篇、語音 9 篇） | ✅ |
| 期末草稿重寫（15 頁）：文獻的訊號曲線、對照表、判斷流程、一般做法 vs 本設計 | ✅ |

## 若之後要修改
1. 改 `index.html`（期中）或 `final-draft.html`（期末）、`src/*`。
2. `npm run fonts`（有新中文字時）→ `npm run inspect`（檢查）。
3. `npm run export:pdf`、`python3 tools/build-notes.py`；期末草稿加 `--file=final-draft.html`／`--final`。
4. 紀錄表：`python3 tools/build-measurement-log.py --pdf`，再用 xlsx skill 的 `recalc.py` 存入公式結果。

## 期末報告接下來要做
1. 換電腦時，把文獻圖放回 `final/figures/`（檔名見 `final/README.md`）。
2. 依講稿 `docs/speaker-notes-final.md` 練習，視時間調整。
3. 如果做了原型，把量到的曲線加進第 06 章，和文獻的曲線並排比較。

## 技術注意事項
- 需要「可跳轉」的文字或數值動畫一律用 `drive` plugin（`S.ticker`、`S.count`），不要用 onUpdate。
- 長時間的環境動畫（風扇、粒子）要在所有 `S.step()` 之後才加入，避免把步驟停點往後推。
- SVG `<g transform>` 不要直接用 GSAP 縮放；縮放內層 `.s-in`、`.r-in`。
- 表格列要整列一起進場，否則 0% 時會先看到空的框線。
- SVG 線段的箭頭標記（marker）不受 stroke-dash 影響；有箭頭的短線用淡入，不用畫線。
- Playwright `page.evaluate` 不要回傳 GSAP 物件（序列化會卡住）。
- LibreOffice 需要 Calc 元件才能開 xlsx／pptx（只有 `libreoffice-core` 時會出現 source file could not be loaded）。
