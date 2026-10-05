# 進度紀錄（Progress）

> 中斷後從這裡接續：先讀本檔與 `docs/01-spec.md`，再看 `git log`。

## 狀態

| 階段 | 狀態 |
|---|---|
| 1 解析要求 → `docs/01-spec.md` | ✅ |
| 2 研究 → `docs/02-research.md`；企劃 → `docs/03-production-plan.md` | ✅ |
| 3 製作：`index.html` + `src/*` + 字型子集 + GSAP | ✅ 19 頁完成 |
| 4 執行與檢查：`tools/inspect.mjs`（截圖、console、版面、缺字） | ✅ 無錯誤 |
| 5 Critique → Revise | 第 1、2 輪完成（見 `docs/04-critique-log.md`） |
| 6 輸出：PDF / 書面報告 / 影片 | 進行中 |
| 7 README、講稿、最終檢核表 | 待辦 |

## 下一步
1. `tools/export-pdf.mjs`（向量 PDF，逐頁完成狀態）
2. `report/index.html` 書面報告 → `tools/export-report.mjs`
3. `tools/render-video.mjs`（主時間軸逐格輸出 MP4）
4. 檢查轉場與自動播放節奏（render 模式 0/25/50/75/100%）
5. README、`docs/speaker-notes.md`、`docs/99-final-checklist.md`

## 注意事項
- 修改任何中文文字後要執行 `npm run fonts`（字型為子集），`npm run check` 會檢查缺字。
- 需要「seek 安全」的文字/數值動畫一律用 `drive` plugin（`S.ticker` / `S.count`），不要用 onUpdate。
- 長時間的環境動畫（風扇、粒子）要在所有 `S.step()` 之後才加入，避免把步驟停點往後推。
- SVG `<g transform>` 不要直接用 GSAP 縮放；縮放內層 `.s-in` / `.r-in`。
