# 你還好嗎？｜安在 AnZai

**不用鏡頭的浴室安全守護系統**——給夜裡起身的阿嬤，與冬夜洗澡的外宿同學。
「健康物聯網趨勢與創新」期中報告（課堂：設計與應用），115 學年度第 1 學期。

一份動態網頁簡報（19 頁、約 10 分鐘）＋ 簡報 PDF ＋ A4 書面報告 ＋ 自動播放影片 ＋ 講稿。

---

## 1. 直接展示（不需安裝、不需網路）

1. 雙擊 **`index.html`**，用 Chrome / Edge / Safari / Firefox 開啟。
2. 按 **F** 全螢幕。
3. 按 **→**（或空白鍵、點滑鼠）播放下一段；每頁的動畫分段播放，配合口頭說明。

| 按鍵 | 功能 |
|---|---|
| → ／ 空白鍵 ／ Enter ／ 點擊畫面右側 | 下一步（動畫播放中按下 → 立即完成這一段） |
| ← ／ 點擊畫面左側 | 上一步 |
| F | 全螢幕 |
| N | 顯示／隱藏當頁講稿（畫面下方） |
| A | 自動播放（停留時間依講稿長度，約 10 分鐘） |
| Home ／ End | 第一頁 ／ 最後一頁 |
| 網址加 `#11` | 直接從第 11 頁開始（例：`index.html#11`） |

字型、動畫程式庫都已內嵌在 repository，教室電腦離線也能正確顯示。

### 填上報告人姓名
編輯 `src/config.js` 的 `presenter`、`studentId`；或直接用網址參數：
`index.html?name=王小明&id=B11201001`
改了中文姓名後執行一次 `npm run fonts`，姓名就會使用內嵌字型（否則會以系統中文字型顯示）。

---

## 2. 繳交檔案（`exports/`）

| 檔案 | 內容 |
|---|---|
| `exports/AnZai-slides.pdf` | 簡報 PDF，19 頁，每頁為完成狀態；向量、文字可搜尋 |
| `exports/AnZai-report.pdf` | A4 書面報告，7 頁，含參考資料 |
| `exports/AnZai-autoplay.mp4` | 自動播放影片（1920×1080、30 fps），節奏與講稿同步，可配音或備用 |
| `docs/speaker-notes.md` | 逐頁講稿與預估秒數 |

---

## 3. 重新輸出（需要 Node.js 18+ 與 Python 3）

```bash
npm install                  # 安裝 Playwright、pdf-lib、字型來源與 GSAP
pip install fonttools brotli # 字型子集化

npm run fonts                # 修改任何中文文字後都要執行（重新產生字型子集）
npm run check                # 每頁完成狀態截圖 + console / 版面 / 缺字檢查
npm run inspect              # 每頁每一步驟截圖 + 鍵盤導覽測試（輸出到 shots/）
npm run export:pdf           # → exports/AnZai-slides.pdf
npm run export:report        # → exports/AnZai-report.pdf
npm run export:video         # → exports/AnZai-autoplay.mp4（逐格輸出，約 20 分鐘；需要 ffmpeg）
python3 tools/build-notes.py # → docs/speaker-notes.md（由簡報內的講稿產生）
```

`node tools/inspect.mjs --fractions` 會另外輸出每頁時間軸 0/25/50/75/100% 的畫面；`--master` 輸出整支自動播放時間軸的 0/25/50/75/100%。

---

## 4. 專案結構

```
index.html              簡報（19 頁的內容與講稿都在這裡）
src/
  styles.css            設計 token、版面、各頁樣式
  deck.js               簡報引擎：縮放、步驟導覽、轉場、HUD、自動播放、影片／PDF 介面
  slides.js             每頁的動畫時間軸（GSAP）
  plans.js              平面圖產生器（SVG）：阿嬤家、分租套房、感測器、動線、CO 擴散
  config.js             報告人資訊
assets/fonts/           子集化字型（Noto Sans TC、Noto Serif TC、霞鶩文楷 TC、IBM Plex Mono）
vendor/                 GSAP 3.15（含 MotionPathPlugin）
report/                 A4 書面報告（HTML + CSS）
tools/                  字型子集化、檢查、PDF、影片、講稿產生
exports/                繳交檔案
docs/
  01-spec.md            作業規格（由講義與作業要求整理）
  02-research.md        研究筆記與資料來源
  03-production-plan.md 企劃：概念、敘事、視覺、分鏡、動態邏輯、技術
  04-critique-log.md    每輪 critique → revise 紀錄
  99-final-checklist.md 最終需求檢核表
  speaker-notes.md      講稿
  progress.md           進度紀錄
```

---

## 5. 設計重點

- **作業要求的「時間、地點」是本作品的視覺文法**：情境頁都有一個時鐘（時間）與一張平面圖（地點），頁首 HUD 全程標示目前的時間與地點。
- **人文關懷議題**：浴室——最私密、最難被發現、也最不可能裝鏡頭 → 「守護，但不窺視」。
- **課程對應**：系統依講義的五層架構（感知、網路、雲端計算、資料分析、應用）設計；網路技術、SaaS／PaaS／IaaS 皆對應講義內容。
- **動畫只用來表達內容**：時間流逝（時鐘、動線）、因果（流程節點依序點亮）、數量（計數、點陣）。全片只用四種 easing；所有動畫可精準跳轉到任一時間點（PDF 與影片皆由同一條時間軸輸出）。
- **資料誠實**：所有統計數字附出處（`docs/02-research.md`）；「預計結果」明確標示為待實測的設計目標；情境與模擬時間軸標示為示意。

## 6. 授權
- 字型：Noto Sans TC、Noto Serif TC、LXGW WenKai TC、IBM Plex Mono — SIL Open Font License 1.1。
- GSAP 3.15 — GreenSock Standard "no charge" License。
- 統計資料與文獻引用自各原始來源，見參考資料頁。
