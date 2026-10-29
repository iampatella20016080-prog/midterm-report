# 期末報告：資料準備

期中報告後，老師請我從橫向關係圖的六個子議題裡挑兩個，期末聚焦在這兩個：

| 議題 | 情境 | 感測器 |
|---|---|---|
| 夜間跌倒 | 阿嬤 | 毫米波雷達、語音確認 |
| 昏倒沒有反應 | 同學 | 毫米波雷達、語音確認 |

期末的主要內容是**文獻裡的訊號曲線**：每個感測器在正常、跌倒、昏倒沒反應時，訊號長什麼樣子，整理成對照表。文獻整理在 `docs/05-signal-literature.md`。

依老師建議，期末聚焦毫米波雷達和語音確認；紅外線、床墊壓力等其他感測器保留在系統設計裡，不深入討論。

血壓的實測已經拿掉（不在這兩個議題裡）。

## 期末簡報用的文獻圖（`final/figures/`）

`final-draft.html` 會讀這個資料夾的 7 張圖。圖的著作權屬於原作者，所以這個資料夾不進 GitHub；換電腦時，把圖檔包解壓到這裡。沒有圖檔時，簡報會在圖的位置顯示出處。

| 檔名 | 出處 | 用在 |
|---|---|---|
| `alizadeh2019-fig7.png` | Alizadeh et al., 2019, Figure 7 | 毫米波雷達量到什麼 |
| `amin2016-fig4-fall-vs-adl.png` | Amin et al., 2016, Fig. 4 | 跌倒那一下：頻譜圖 |
| `mmfall-fig7.png` | Jin et al., 2022, Fig. 7(a) | 跌倒那一下：身體高度 |
| `yu2023-fade-fig4.png` | Yu et al., 2023, Fig. 4(a)–(c) | 跌倒那一下：速度與加速度 |
| `diraco2017-fig13.png` | Diraco et al., 2017, Figure 13 | 跌倒之後：躺著不動 |
| `choi2022-fig6.png` | Choi et al., 2022, Figure 6 | 有沒有在呼吸 |
| `chen2026-fig9.png` | Chen et al., 2026, Fig. 9 | 備用（文獻整理有描述） |

## 這個資料夾的檔案

| 檔案 | 用途 |
|---|---|
| `measurement-log.xlsx` | 補充用的紀錄表：夜間如廁次數（7 晚）、洗澡時浴室濕度（7 次）。填數字後平均、判斷和「摘要」會自動算好 |
| `measurement-sheets.pdf` | 同一份紀錄表的 A4 紙本，可以印出來手寫 |

這兩項不是老師指定的，有時間再做。

## 量測方式

| 項目 | 對象 | 怎麼量 | 次數 |
|---|---|---|---|
| 夜間如廁 | 家人 | 記上床、起床時間和半夜起來上廁所的次數 | 連續 7 晚 |
| 洗澡濕度 | 自己或同學 | 浴室放電子溫濕度計，記洗澡前、洗澡中最高、洗完 10 分鐘後的濕度 | 7 次 |

- 先問過被記錄的人，說明是課堂報告用的。
- 檔案裡用「阿嬤」「同學」這類代稱，不寫真實姓名。

## 重新產生紀錄表
```bash
python3 tools/build-measurement-log.py --pdf   # 需要 openpyxl；--pdf 需要 LibreOffice Calc
```

## 文獻
- Vaughan CP, et al. (2010). The association of nocturia with incident falls in an elderly community-dwelling cohort. *Int J Clin Pract*, 64(5), 577–583.
