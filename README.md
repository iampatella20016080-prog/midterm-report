# 浴室安全監測系統：對家人與同學的關心

「健康物聯網趨勢與創新」期中報告，115 學年度第 1 學期。學號 b409115048，商雅嵐。報告日 11 月 5 日（四），繳交期限 11 月 4 日（三）23:00。

老師的期中報告範本把八個項目中的第 1–4 項用螢光筆標出，所以期中報告做第 1–4 項和四個課堂練習：

- 1 主題：透過物聯網架構關懷項目（人、時間、場域）
- 2 需要使用工具：感測系統／元件
- 3 檢測觀察過程的規劃
- 4 檢測觀察項目（心律、血壓）
- 四個練習：橫向關係、縱向關係（三層圖）、與市售感測系統比較、感測器關係圖（仿 IEEE 1451 範例）

第 5–8 項（訊號收集、資料整理分析、討論、參考資料列表）是期末報告的內容，草稿在 `final-draft.html`（15 頁，講稿約 7 分鐘）。

繳交物：上台用的網頁簡報（19 頁，講稿約 9 分鐘）、簡報 PDF、講稿。

簡報為上台投影設計：每頁只放重點，內文字級 24–38 px（以 1920×1080 畫面計），細節與數字出處放在講稿（按 N 顯示）。

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
| 網址加 `#10` | 直接跳到第 10 頁（例：`index.html#10` 是感測器關係圖） |

字型和動畫程式庫都放在 repository 裡，教室電腦沒有網路也能正確顯示。

### 報告人資訊
學號與姓名已填在 `src/config.js`（`studentId`、`presenter`），封面會顯示。也可以用網址參數暫時改：`index.html?name=…&id=…`。改了中文姓名後要執行一次 `npm run fonts`。

### 時間不夠時
講稿約 9 分鐘。需要縮短時，可以跳過第 2–3 頁（背景資料）與第 8 頁（擺放位置），約省 1.5 分鐘。

---

## 2. 簡報頁次與期中項目的對應

| 項目 | 頁次 |
|---|---|
| 封面 | 00 |
| 1 主題：透過物聯網架構關懷項目（人、時間、場域） | 01 主題、02–03 背景資料、04 情境 A、05 情境 B |
| 2 需要使用工具：感測系統／元件 | 06 橫向關係、07 感測系統與元件、08 擺放位置、09 縱向關係（三層圖）、10 感測器關係圖、11 與市售感測系統比較 |
| 3 檢測觀察過程的規劃 | 12 觀察規劃、13 監測流程 A、14 監測流程 B |
| 4 檢測觀察項目（心律、血壓） | 15 檢測觀察項目 |
| 期末報告預告（第 5–8 項） | 16 |
| 參考資料 | 17（20 筆，全部在前面各頁引用） |

四個課堂練習：橫向關係 06、縱向關係 09、感測器關係圖 10、與市售比較 11。

---

## 3. 期末報告的準備

期中報告後，老師請我從橫向關係圖選兩個議題聚焦：**夜間跌倒**、**昏倒沒有反應**，只用毫米波雷達和語音確認，找文獻裡的訊號曲線做對照表。

| 檔案 | 內容 |
|---|---|
| `docs/05-signal-literature.md` | 期末文獻：毫米波雷達 13 篇、語音確認 9 篇；訊號曲線、對照表、一般做法 vs 本設計、限制 |
| `final-draft.html` | 期末簡報草稿（15 頁）：05 訊號收集 → 06 文獻的訊號曲線（跌倒那一下、躺著不動、呼吸、語音確認）→ 07 對照表、判斷流程、一般做法 vs 本設計、限制 → 08 參考資料 |
| `docs/speaker-notes-final.md` | 期末講稿（約 7 分鐘，`python3 tools/build-notes.py --final`） |
| `final/figures/` | 期末簡報用的文獻圖（7 張）。**不進 GitHub**（著作權屬於原作者），換電腦時要自己放回去；沒有圖檔時，簡報會在圖的位置顯示出處 |
| `exports/final-draft.pdf` | 期末草稿 PDF（`node tools/export-pdf.mjs --file=final-draft.html`），含文獻圖，所以也不進 GitHub |
| `final/` | 補充用紀錄表：夜間如廁、洗澡濕度（血壓已拿掉） |

---

## 4. 繳交檔案

| 檔案 | 內容 |
|---|---|
| `index.html` | 上台簡報 |
| `exports/midterm-slides.pdf` | 簡報 PDF，19 頁，每頁為完成狀態；向量、文字可搜尋 |
| `docs/speaker-notes.md` | 逐頁講稿與預估秒數 |

---

## 5. 重新輸出（需要 Node.js 18+ 與 Python 3）

```bash
npm install                  # 安裝 Playwright、pdf-lib、字型來源與 GSAP
pip install fonttools brotli openpyxl

npm run fonts                # 修改任何中文文字後都要執行（重新產生字型子集，掃描兩份簡報與 src/）
npm run check                # 每頁完成狀態截圖，並檢查 console 錯誤、版面、缺字
npm run inspect              # 每頁每一步驟截圖（輸出到 shots/）
npm run export:pdf           # → exports/midterm-slides.pdf
python3 tools/build-notes.py # → docs/speaker-notes.md（由簡報內的講稿產生）
python3 tools/build-measurement-log.py --pdf  # → final/ 紀錄表（--pdf 需要 LibreOffice Calc）
```

`node tools/inspect.mjs --fractions` 另外輸出每頁時間軸 0/25/50/75/100% 的畫面；`--master` 輸出整支自動播放的 0/25/50/75/100%；`--only=9,10` 只檢查指定頁；`--file=final-draft.html` 檢查期末草稿。

---

## 6. 專案結構

```
index.html              期中簡報內容與講稿
final-draft.html        期末報告草稿（第 5–8 項）
final/                  補充用紀錄表（夜間如廁、洗澡濕度）
src/
  styles.css            版面與各頁樣式
  deck.js               簡報引擎：縮放、步驟導覽、轉場、頁首資訊列、自動播放、PDF 輸出介面
  slides.js             每頁的動畫時間軸（GSAP）
  plans.js              平面圖產生器（SVG）：阿嬤家、分租套房、感測器、動線、CO 擴散
  diagram.js            橫向關係圖、縱向關係三層圖、感測器關係圖產生器（SVG）
  config.js             報告人資訊
assets/fonts/           子集化字型（Noto Sans TC、Noto Serif TC、霞鶩文楷 TC、IBM Plex Mono）
vendor/                 GSAP 3.15（含 MotionPathPlugin）
tools/                  字型子集化、檢查、PDF、講稿、紀錄表產生
exports/                繳交檔案
docs/
  01-spec.md            作業規格（老師的要求整理）
  02-research.md        研究筆記與資料來源
  03-production-plan.md 製作企劃
  04-critique-log.md    每輪檢查與修改紀錄
  05-signal-literature.md 期末文獻：跌倒與昏倒沒反應的訊號曲線
  99-final-checklist.md 最終需求檢核表
  speaker-notes.md      講稿
  progress.md           進度紀錄
```

---

## 7. 設計說明

- 每個情境都寫清楚人、時間、場域；情境與流程頁的頁首會顯示目前的時間與場域。
- 浴室不能裝攝影機，所以只用不產生影像的感測器，資料在家中閘道判斷，只把事件上傳。
- 縱向關係依課堂的三層圖（感知層、傳輸層、應用層）畫出這個設計的每個元件。
- 動畫用來表達內容：時間經過（時鐘、動線）、先後順序（流程步驟依序亮起）、資料流向（關係圖與三層圖的資料點）。所有動畫都可以跳到任一時間點，PDF 由同一條時間軸輸出每頁的完成狀態。
- 統計數字都有出處（`docs/02-research.md`）；情境人物與模擬時間軸是示意；期末的分析會用實測資料。

## 8. 授權
- 字型：Noto Sans TC、Noto Serif TC、LXGW WenKai TC、IBM Plex Mono，SIL Open Font License 1.1。
- GSAP 3.15，GreenSock Standard "no charge" License。
- 統計資料與文獻引用自各原始來源，見參考資料頁。
