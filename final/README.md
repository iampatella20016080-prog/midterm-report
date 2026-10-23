# 期末報告實測：量測說明

期末報告第 5 項（感測器訊號的收集）和第 6 項（資料整理分析）要用真的量到的資料。這個資料夾是量測用的紀錄表。

| 檔案 | 用途 |
|---|---|
| `measurement-log.xlsx` | 電腦上填的紀錄表。填數字後，平均、下降幅度、判斷和「摘要」工作表會自動算好 |
| `measurement-sheets.pdf` | 同一份紀錄表的 A4 紙本（說明＋四張紀錄表），可以印出來放在血壓計旁邊手寫，之後再輸入 Excel |

## 要準備的東西
- 上臂式電子血壓計（家裡現有的就可以）
- 電子溫濕度計一個，放在浴室（大多數手機沒有濕度感測器，手機 app 量不到）
- 紙本紀錄表和筆

## 四個量測項目

| 項目 | 對象 | 怎麼量 | 次數 | 對照的門檻 |
|---|---|---|---|---|
| 血壓 722 | 家人 | 早上起床後、晚上睡覺前各量一次，每次量兩遍 | 連續 7 天，共 14 次 | 平均 ≥ 130/80 mmHg 要注意（國健署） |
| 臥站血壓 | 家人 | 平躺 5 分鐘後量，站起後第 1、3 分鐘再量 | 每週 1 次，共 4 次 | 3 分鐘內收縮壓下降 ≥ 20 或舒張壓下降 ≥ 10 mmHg（臺大醫院、Freeman 2011） |
| 夜間如廁 | 家人 | 記上床、起床時間和半夜起來上廁所的次數 | 連續 7 晚 | 每晚 ≥ 3 次與跌倒風險較高有關（Vaughan 2010） |
| 洗澡濕度 | 自己或同學 | 洗澡前、洗澡中最高、洗完 10 分鐘後的濕度，加上開始和結束時間 | 7 次 | 用來訂「濕度上升多少算在洗澡」 |

為了每天的血壓可以互相比較，固定坐著、量同一隻手臂。

## 建議時程

| 時間 | 做什麼 |
|---|---|
| 第 1 週 | 血壓 722（7 天）和夜間如廁（7 晚）一起記；做第 1 次臥站血壓 |
| 第 2–4 週 | 每週做一次臥站血壓；洗澡濕度在這段時間記滿 7 次（寒流期間更符合情境 B） |
| 量完 | 把 `measurement-log.xlsx` 交回，用「摘要」工作表的結果做期末報告的分析頁 |

## 安全與同意
- 先問過被量測的人，說明這是課堂報告用的紀錄。
- 臥站血壓：站起來時旁邊要有人扶。頭暈就立刻坐下，當次停止。
- 這份紀錄不是診斷。血壓很高或身體不舒服，請停止量測並就醫。
- 檔案裡用「阿嬤」「同學」這類代稱，不寫真實姓名。

## 期末報告怎麼用這些資料
- 第 5 項：拍下血壓計、溫濕度計和擺放位置的照片，說明資料怎麼記錄、多久一次。
- 第 6 項：「摘要」工作表的五個結果，各自和右邊欄位的文獻門檻比較（草稿在 `final-draft.html` 的「資料整理分析」頁）。
- 洗澡濕度算出的門檻，會取代設計中暫定的洗澡判斷條件。

## 重新產生紀錄表
```bash
python3 tools/build-measurement-log.py --pdf   # 需要 openpyxl；--pdf 需要 LibreOffice Calc
```
產生後用 LibreOffice 或 Excel 開一次存檔，公式結果才會存在檔案裡（Excel 開啟時會自動計算）。

## 文獻
- 衛生福利部國民健康署（2023-05-15）。量血壓「722」原則。https://www.mohw.gov.tw/cp-16-74604-1.html
- CDC STEADI（2017）。Measuring Orthostatic Blood Pressure。https://www.cdc.gov/steadi/media/pdfs/steadi-assessment-measuringbp-508.pdf
- 臺大醫院健康電子報（2023-10，第 215 期）。姿勢性低血壓護理指導。
- Freeman R, et al. (2011). Consensus statement on the definition of orthostatic hypotension, neurally mediated syncope and the postural tachycardia syndrome. *Clin Auton Res*, 21(2), 69–72.
- Vaughan CP, et al. (2010). The association of nocturia with incident falls in an elderly community-dwelling cohort. *Int J Clin Pract*, 64(5), 577–583.
