# 浴室安全監測系統：對家人與同學的關心

「健康物聯網趨勢與創新」期中報告（課堂：設計與應用），115 學年度第 1 學期。

內容依老師公布的期中報告八個項目編排：主題（人、時間、場域）、使用的感測系統與元件、檢測觀察過程的規劃、檢測觀察項目、感測器訊號的收集、資料整理分析、討論、參考資料。另外包含老師要求的「與市售感知層感測系統比較」與「感測器關係圖」（仿 IEEE 1451 範例）。

繳交物：動態網頁簡報（23 頁，講稿約 11 分鐘）、簡報 PDF、A4 書面報告 PDF、自動播放影片、講稿。

---

## 1. 直接展示（不需安裝、不需網路）

1. 用 Chrome、Edge、Safari 或 Firefox 開啟 **`index.html`**。
2. 按 **F** 全螢幕。
3. 按 **→**（或空白鍵、點滑鼠）播放下一段。每頁的動畫分段播放，配合口頭說明。

| 按鍵 | 功能 |
|---|---|
| → ／ 空白鍵 ／ Enter ／ 點擊畫面右側 | 下一步（動畫播放中按下會直接完成這一段） |
| ← ／ 點擊畫面左側 | 上一步 |
| F | 全螢幕 |
| N | 顯示或隱藏當頁講稿（畫面下方） |
| A | 自動播放（每頁停留時間依講稿長度計算） |
| Home ／ End | 第一頁 ／ 最後一頁 |
| 網址加 `#8` | 直接從第 8 頁開始（例：`index.html#8` 是感測器關係圖） |

字型和動畫程式庫都放在 repository 裡，教室電腦沒有網路也能正確顯示。

### 填上報告人姓名
編輯 `src/config.js` 的 `presenter`、`studentId`，或用網址參數：
`index.html?name=王小明&id=B11201001`
改了中文姓名後執行一次 `npm run fonts`，姓名才會使用內嵌字型。

### 時間不夠時
講稿約 11 分鐘。需要縮短時，可以跳過第 2–3 頁（背景資料）與第 15 頁（五層架構），約省 1.5 分鐘；這三頁的內容在書面報告裡都有。

---

## 2. 簡報頁次與八個項目的對應

| 項目 | 頁次 |
|---|---|
| 1 主題：關懷項目（人、時間、場域） | 01 主題、02–03 背景資料、04 情境 A、05 情境 B |
| 2 需要使用的工具：感測系統與元件 | 06 感測系統與元件、07 擺放位置、08 感測器關係圖、09 與市售感測系統比較 |
| 3 檢測觀察過程的規劃 | 10 觀察規劃、11 監測流程 A、12 監測流程 B |
| 4 檢測觀察項目（心律、血壓⋯） | 13 檢測觀察項目 |
| 5 感測器訊號的收集 | 14 訊號收集、15 五層架構 |
| 6 資料整理分析（找 Reference 佐證） | 16 資料整理分析與文獻佐證 |
| 7 討論 | 17 預計結果、18 效益、19 隱私與資料分享、20 限制與下一步 |
| 8 參考資料列表 | 21 參考資料 |

---

## 3. 繳交檔案（`exports/`）

| 檔案 | 內容 |
|---|---|
| `exports/midterm-slides.pdf` | 簡報 PDF，23 頁，每頁為完成狀態；向量、文字可搜尋 |
| `exports/midterm-report.pdf` | A4 書面報告，10 頁（感測器關係圖為橫式頁），含參考資料 |
| `exports/midterm-autoplay.mp4` | 自動播放影片（1920×1080、30 fps），節奏依講稿長度 |
| `docs/speaker-notes.md` | 逐頁講稿與預估秒數 |

---

## 4. 重新輸出（需要 Node.js 18+ 與 Python 3）

```bash
npm install                  # 安裝 Playwright、pdf-lib、字型來源與 GSAP
pip install fonttools brotli # 字型子集化

npm run fonts                # 修改任何中文文字後都要執行（重新產生字型子集）
npm run check                # 每頁完成狀態截圖，並檢查 console 錯誤、版面、缺字
npm run inspect              # 每頁每一步驟截圖（輸出到 shots/）
npm run export:pdf           # → exports/midterm-slides.pdf
npm run export:report        # → exports/midterm-report.pdf
npm run export:video         # → exports/midterm-autoplay.mp4（逐格輸出，約 20 分鐘；需要 ffmpeg）
python3 tools/build-notes.py # → docs/speaker-notes.md（由簡報內的講稿產生）
```

`node tools/inspect.mjs --fractions` 另外輸出每頁時間軸 0/25/50/75/100% 的畫面；`--master` 輸出整支自動播放的 0/25/50/75/100%。

---

## 5. 專案結構

```
index.html              簡報內容與講稿
src/
  styles.css            版面與各頁樣式
  deck.js               簡報引擎：縮放、步驟導覽、轉場、頁首資訊列、自動播放、影片與 PDF 輸出介面
  slides.js             每頁的動畫時間軸（GSAP）
  plans.js              平面圖產生器（SVG）：阿嬤家、分租套房、感測器、動線、CO 擴散
  diagram.js            感測器關係圖產生器（SVG），簡報與書面報告共用
  config.js             報告人資訊
assets/fonts/           子集化字型（Noto Sans TC、Noto Serif TC、霞鶩文楷 TC、IBM Plex Mono）
vendor/                 GSAP 3.15（含 MotionPathPlugin）
report/                 A4 書面報告（HTML + CSS）
tools/                  字型子集化、檢查、PDF、影片、講稿產生
exports/                繳交檔案
docs/
  01-spec.md            作業規格（老師的要求整理）
  02-research.md        研究筆記與資料來源
  03-production-plan.md 製作企劃
  04-critique-log.md    每輪檢查與修改紀錄
  99-final-checklist.md 最終需求檢核表
  speaker-notes.md      講稿
  progress.md           進度紀錄
```

---

## 6. 設計說明

- 每個情境都寫清楚人、時間、場域；情境與流程頁的頁首會顯示目前的時間與場域。
- 浴室不能裝攝影機，所以只用不產生影像的感測器，資料在家中閘道判斷，只把事件上傳。
- 架構依講義的五層架構（感知、網路、雲端計算、資料分析、應用）設計。
- 動畫用來表達內容：時間經過（時鐘、動線）、先後順序（流程步驟依序亮起）、資料流向（關係圖與訊號收集頁的資料點）。所有動畫都可以跳到任一時間點，PDF 和影片由同一條時間軸輸出。
- 統計數字都有出處（`docs/02-research.md`）；預計結果標示為待實測的設計目標；情境人物與模擬時間軸是示意。

## 7. 授權
- 字型：Noto Sans TC、Noto Serif TC、LXGW WenKai TC、IBM Plex Mono，SIL Open Font License 1.1。
- GSAP 3.15，GreenSock Standard "no charge" License。
- 統計資料與文獻引用自各原始來源，見參考資料頁。
