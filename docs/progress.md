# 進度紀錄（Progress）

> 中斷後從這裡接續：先讀本檔與 `docs/01-spec.md`，再看 `git log`。

## 狀態：v2 完成（依老師公布的期中報告八個項目重新編排）

| 階段 | 狀態 |
|---|---|
| 讀老師的三張投影片（第 31、34、35 頁）→ 更新 `docs/01-spec.md` | ✅ |
| 補充資料：722 量血壓原則、姿勢性低血壓、雷達與 CO 模組規格 → `docs/02-research.md` E 節 | ✅ |
| 簡報改為八個章節（v2 初版 23 頁）；新增主題表、感測器關係圖、市售比較、觀察規劃、觀察項目、訊號收集、資料分析 | ✅ |
| 全部文字改為平實說明（移除品牌名、口號、破折號修辭） | ✅ |
| 書面報告改為八節，關係圖放在橫式頁 | ✅ 10 頁 |
| 檢查：`tools/inspect.mjs --fractions --master` | ✅ no issues |
| critique → revise | ✅ v2 共 3 輪（`docs/04-critique-log.md`） |
| 輸出：`exports/midterm-slides.pdf`、`exports/midterm-report.pdf`、`exports/midterm-autoplay.mp4` | ✅ |
| README、講稿、最終檢核表 | ✅ |
| 加入講義 1151015 內容：橫向關係、縱向關係、血氧機比較、靜息心率、SMART、流程圖與健康照護物聯網範例 | ✅ 簡報 25 頁、報告 12 頁 |

## 若之後要修改
1. 改 `index.html`（內容、講稿）、`report/index.html` 或 `src/*`。
2. `npm run fonts`（有新中文字時）→ `npm run inspect`（檢查）。
3. `npm run export:pdf`、`npm run export:report`、`npm run export:video`、`python3 tools/build-notes.py`。

## 技術注意事項
- 需要「可跳轉」的文字或數值動畫一律用 `drive` plugin（`S.ticker`、`S.count`），不要用 onUpdate。
- 長時間的環境動畫（風扇、粒子）要在所有 `S.step()` 之後才加入，避免把步驟停點往後推。
- SVG `<g transform>` 不要直接用 GSAP 縮放；縮放內層 `.s-in`、`.r-in`。
- 表格列要整列一起進場，否則 0% 時會先看到空的框線。
- SVG 線段的箭頭標記（marker）不受 stroke-dash 影響；有箭頭的短線用淡入，不用畫線。
- Playwright `page.evaluate` 不要回傳 GSAP 物件（序列化會卡住）。
- 書面報告的橫式頁用 `@page wide` 與 `section.landscape`，輸出時需要 `preferCSSPageSize: true`。
