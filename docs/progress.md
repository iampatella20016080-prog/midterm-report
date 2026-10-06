# 進度紀錄（Progress）

> 中斷後從這裡接續：先讀本檔與 `docs/01-spec.md`，再看 `git log`。

## 狀態：完成

| 階段 | 狀態 |
|---|---|
| 1 解析要求 → `docs/01-spec.md` | ✅ |
| 2 研究 → `docs/02-research.md`；企劃 → `docs/03-production-plan.md` | ✅ |
| 3 製作：`index.html` + `src/*` + 字型子集 + GSAP | ✅ 19 頁 |
| 4 執行與檢查：`tools/inspect.mjs` | ✅ no issues |
| 5 Critique → Revise | ✅ 4 輪（`docs/04-critique-log.md`） |
| 6 輸出：簡報 PDF、書面報告 PDF、自動播放 MP4 | ✅ `exports/` |
| 7 README、講稿、最終檢核表 | ✅ |

## 若之後要修改
1. 改 `index.html`（內容／講稿）或 `src/*`。
2. `npm run fonts`（有新中文字時）→ `npm run inspect`（檢查）。
3. `npm run export:pdf`、`npm run export:report`、`npm run export:video`、`python3 tools/build-notes.py`。

## 技術注意事項
- 需要「seek 安全」的文字／數值動畫一律用 `drive` plugin（`S.ticker` / `S.count`），不要用 onUpdate。
- 長時間的環境動畫（風扇、粒子）要在所有 `S.step()` 之後才加入，避免把步驟停點往後推。
- SVG `<g transform>` 不要直接用 GSAP 縮放；縮放內層 `.s-in` / `.r-in`。
- Playwright `page.evaluate` 不要回傳 GSAP 物件（序列化會卡住）。
