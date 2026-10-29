# 05 · 期末文獻：跌倒與昏倒沒反應的訊號曲線

> 依據：期中報告（11/5）後老師的指示。從橫向關係圖六個子議題選兩個：**夜間跌倒**（阿嬤）、**昏倒沒有反應**（同學）。
> 這兩個議題連到四個感測器：毫米波雷達（兩個議題都用）、紅外線、床墊壓力、語音確認（按鈕盒或語音）。
> 要做的事：找文獻裡的訊號曲線，比較正常、跌倒、昏倒沒反應時的差別，整理成對照表（一般做法 vs 創新想法）。
> 重點放在**毫米波雷達**和**語音確認**。血壓實測已經拿掉。

每一篇都讀過全文或官方摘要，數字直接取自原文。標「有圖檔」的，圖已經從開放全文裁切出來（見 E 節）；其他的圖請到全文連結看，引用時註明作者、年份、圖號。

---

## A. 毫米波雷達

### A1. 跌倒那一下：身體重心高度＋速度

| # | 文獻 | 雷達 | 訊號圖與重點 |
|---|---|---|---|
| R1 | Jin F, Sengupta A, Cao S. (2022). mmFall: Fall detection using 4-D mmWave radar and a hybrid variational RNN autoencoder. *IEEE Trans Autom Sci Eng*, 19(2), 1245–1257. doi:10.1109/TASE.2020.3042158。全文：[arXiv 2003.02386](https://arxiv.org/abs/2003.02386) | 77 GHz（TI AWR1843） | **Fig. 7（有圖檔）**：藍線是身體重心高度，橘線是異常分數，橫軸約 100 秒。走路時重心在 1.1–1.4 公尺上下跳動；四種跌倒時重心在 1 秒左右掉到約 0.2–0.5 公尺，並停在低處幾秒；坐下、蹲下、彎腰也會讓重心降到約 0.5–0.8 公尺。**只看高度，坐下和跌倒很像**，所以作者再加上「動作突然變快」的異常分數，兩者同時出現才算跌倒。重心下降門檻 0.6 公尺；50 次跌倒偵測到 98%，誤報 2 次 |
| R2 | Chen HH, Lin JD, Lin SH, Wu CW, Chen HC. (2026). Millimeter-wave technology for multi-person fall detection validated through wearable sensors and real-life scenarios. *Scientific Reports*, 16, 8859. doi:10.1038/s41598-026-40330-y。全文：[PMC12988233](https://pmc.ncbi.nlm.nih.gov/articles/PMC12988233/) | **60–64 GHz**（TI IWR6843） | 判斷分兩階段：先找「快速往下的動作＋姿勢變低」，再等身體穩定後確認最後的姿勢。**Fig. 9**：雷達量到的高度（z 軸）和穿戴式加速度計的訊號對照。1–10 人同時在場，準確度 97.9%；但做「像跌倒的日常動作」時準確度只有 76.8%（調整門檻後 86.5%）。10 位健康成人模擬 |
| R3 | Diraco G, Leone A, Siciliano P. (2017). A radar-based smart sensor for unobtrusive elderly monitoring in ambient assisted living applications. *Biosensors*, 7(4), 55. doi:10.3390/bios7040055。全文：[PMC5746778](https://pmc.ncbi.nlm.nih.gov/articles/PMC5746778/) | UWB（4.3 GHz） | **Fig. 13**：一段連續紀錄，先越走越快、在樣本 T = 16,000 跌倒，之後一直躺著不動，到 T = 24,000 才起來。跌倒那一下和前面走路的訊號明顯不同。跌倒偵測敏感度 98.26%、特異度 91.75%。30 位健康受試者 |
| R4 | Hu S, Cao S, Toosizadeh N, et al. (2024). Radar-based fall detection: A survey. *IEEE Robotics & Automation Magazine*. doi:10.1109/MRA.2024.3352851。全文：[arXiv 2312.04037](https://arxiv.org/abs/2312.04037) | 綜論 | 整理 74 篇雷達跌倒研究。**Fig. 2（有圖檔 2a）**：雷達資料的四種樣子：頻譜圖（micro-Doppler）、距離－速度圖、距離－角度圖、點雲。2a 是走路的頻譜圖，手臂、軀幹、腿各自畫出不同的波紋 |

### A2. 跌倒之後：躺在地上幾乎不動

| # | 文獻 | 雷達 | 訊號圖與重點 |
|---|---|---|---|
| R5 | Trinh H, Thai P, Creager E, Shaker G. (2026). Reliable quasi-static post-fall floor-occupancy detection using low-cost millimetre-wave radar. arXiv:2601.17710（預印本） | **60 GHz**（Infineon BGT60TR13C） | 專門研究「跌倒後躺在地上」。作者指出這比偵測跌倒那一下更難，因為人幾乎不動，地板和家具的反射會蓋過人的訊號。**Fig. 5、6（有圖檔 Fig. 5）**：距離－角度圖上，躺在地上的人是一小塊亮點（綠框是人真正的位置）。7 位受試者，在像長照機構的房間測試，偵測率從 0.823 提升到 0.916。文中也定義「長時間倒地」為倒地 1 小時以上，可能造成失溫、脫水、壓瘡，甚至失去意識 |
| R3 | Diraco 2017（同上） | UWB | 跌倒後躺著不動時，雷達還量得到呼吸和心跳：呼吸率準確度 93%、心率 89% |

### A3. 呼吸：還有沒有在呼吸

| # | 文獻 | 雷達 | 訊號圖與重點 |
|---|---|---|---|
| R6 | Wang W, Li C, Chen Z, et al. (2024). Detection of sleep apnea-hypopnea events using millimeter-wave radar and pulse oximeter. arXiv:2409.19217（預印本） | **60 GHz**（Infineon BGT60TR13C） | **Fig. 2（有圖檔）**：一次阻塞型呼吸中止（約 18 秒）。左邊是醫院儀器：氣流變成一條平線、胸腹起伏變小，血氧在呼吸停止**之後**才往下掉（約 98% → 95%）。右邊是雷達：代表呼吸的那一層訊號在同一段時間明顯變暗，呼吸恢復後又亮回來。**Fig. 4**：只用雷達會漏掉部分「呼吸變淺」，只用血氧會漏掉中樞型呼吸中止，兩個一起用才全部抓到。100 位受試者在醫院睡眠檢查時同步錄，結合後準確度 97%（每小時 15 次的診斷門檻） |
| R7 | Choi JW, Kim DH, Koo DL, et al. (2022). Automated detection of sleep apnea-hypopnea events based on 60 GHz frequency-modulated continuous-wave radar using convolutional recurrent neural networks. *Sensors*, 22(19), 7177. doi:10.3390/s22197177。全文：[PMC9570824](https://pmc.ncbi.nlm.nih.gov/articles/PMC9570824/) | **60 GHz**（裝在天花板，離胸口 2 公尺） | **Fig. 4**：從雷達訊號解出來的呼吸波形。**Fig. 6**：呼吸變淺、阻塞型中止、中樞型中止三種狀況的雷達波形。44 位受試者。**只用雷達時，呼吸事件只抓到 49.0–67.6%，每人誤報 23.4–52.8 次**，所以雷達的呼吸訊號不能單獨用來判斷 |
| R8 | Alizadeh M, Shaker G, De Almeida JCM, et al. (2019). Remote monitoring of human vital signs using mm-wave FMCW radar. *IEEE Access*, 7, 54958–54968. doi:10.1109/ACCESS.2019.2912956 | 77 GHz | 雷達裝在床上方，從胸口的微小起伏量呼吸和心跳。和參考儀器比較，呼吸相關性 94%、心跳 80%（圖號待確認） |

### A4. 浴室裡的雷達

| # | 文獻 | 重點 |
|---|---|---|
| R9 | Wang H, Wang Y, Wang X, et al. (2025). P2MFDS: A privacy-preserving multimodal fall detection system for elderly people in bathroom environments. arXiv:2506.17332（期中參考資料 [13]） | 2.5 × 1.1 公尺的模擬浴室，雷達裝在 2.2 公尺高，淋浴區地上放震動感測器。9 種情境（空浴室、東西掉落、走路、扶牆走、站著不動、蹲下、跌倒），共 3 小時資料。雷達加震動，準確度 95.0%、跌倒偵測率 87.8%。作者提到雷達會受浴室磁磚和地板影響。沒有訊號曲線圖 |

---

## B. 語音確認（不限按鈕盒）

| # | 文獻 | 重點 |
|---|---|---|
| V1 | Tîrziu E, Vasilevschi AM, Alexandru A, Tudora E. (2025). Real-time fall monitoring for seniors via YOLO and voice interaction. *Future Internet*, 17(8), 324. doi:10.3390/fi17080324 | 懷疑跌倒後，語音助理先跟本人說話，依照有沒有回應決定要不要通知家人。語音辨識都在本機處理，保護隱私。加入語音確認後誤報減少。200 段模擬影片（他們用攝影機，本設計只參考語音確認的做法） |
| V2 | Fleming J, Brayne C. (2008). *BMJ*, 337, a2227（期中參考資料 [4]） | 獨自跌倒時 80% 沒有用隨身求救鈕，所以不能只等本人主動求救 |
| V3 | Chaudhuri S, Kneale L, Le T, et al. (2017). Older adults' perceptions of fall detection devices. *J Appl Gerontol*, 36(8), 915–930. doi:10.1177/0733464815591211。全文：[PMC6874474](https://pmc.ncbi.nlm.nih.gov/articles/PMC6874474/) | 27 位長者的焦點團體。擔心誤報，希望可以自己取消通報；也說跌倒時按鈕很難按 |
| V4 | Rice L, Peeler D, Presti P, et al. (2025). Development and validation of a fall detection system for older adults who use wheelchairs. *Innovation in Aging*, 9(Suppl 2), igaf122.243（研討會摘要）. doi:10.1093/geroni/igaf122.243。全文：[PMC12759454](https://pmc.ncbi.nlm.nih.gov/articles/PMC12759454/) | 輪椅族跌倒後平均在地上待 9 分鐘（1–45 分鐘），80% 需要別人幫忙才起得來。長者和照顧者希望可以取消誤報，也希望能自己決定通知誰 |
| V5 | Kim S. (2021). Exploring how older adults use a smart speaker-based voice assistant in their first interactions: Qualitative study. *JMIR mHealth uHealth*, 9(1), e20427. doi:10.2196/20427。全文：[PMC7840274](https://pmc.ncbi.nlm.nih.gov/articles/PMC7840274/) | 18 位 74–91 歲（平均 79 歲）、多數獨居的長者第一次用智慧音箱。用說的很簡單，第一印象正面；但要說出完整、固定格式的指令很困難，也擔心隱私 |
| V6 | Mahmood A, Wang J, Huang CM. (2024). Situated understanding of errors in older adults' interactions with voice assistants: A month-long, in-home study. arXiv:2403.02421 | 15 位長者家裡放智慧音箱一個月，錄下每次對話。常見錯誤：喚醒詞說錯、話只說一半、還沒說完就被打斷、辨識成錯的字。作者建議語音助理要能接受不完整、不標準的回答 |
| V7 | Cohn M, Lanzi A, Ishihara Y, et al. (2026). Challenges in automatic speech recognition for adults with cognitive impairment. *CHI 2026*（已接受）。全文：[arXiv 2602.23436](https://arxiv.org/abs/2602.23436) | 83 位長者對智慧音箱唸指令。**失智者的辨識錯誤率平均 0.32，是認知正常長者（約 0.12）的兩倍多**。音量、聲音品質、停頓多寡會影響辨識。人剛跌倒或頭暈時，聲音可能更小、更斷斷續續 |

### 語音確認的「訊號」長什麼樣

語音確認不是連續的曲線，是一條**事件時間軸**：

```
雷達判斷跌倒 ─→ 語音盒問「你還好嗎？」─→ 等待 ─┬─ 有回應（說話、出聲、按按鈕）→ 取消，記錄一筆
                                               └─ 沒回應 → 再問一次 → 還是沒有 → 通知家人或室友
```

依 V5–V7，長者的回答常常不完整、不標準，失智或剛跌倒時辨識更容易錯。所以本設計**不要求說出特定的字**，只要偵測到有人出聲（聲音能量變大）或按了按鈕，就算有回應。這是本設計依文獻做的調整，還沒有實測。

---

## C. 對照表：四個感測器在三種狀態的訊號

| 感測器 | 正常 | 夜間跌倒 | 昏倒沒有反應 |
|---|---|---|---|
| 毫米波雷達：身體重心高度 | 走路時重心在 1.1–1.4 公尺上下跳動（R1） | 約 1 秒內掉到 0.2–0.5 公尺，停在低處（R1） | 停在低處不起來，幾乎沒有移動訊號；地板反射會讓人不容易被看到（R5） |
| 毫米波雷達：動作速度 | 走路有規律的波紋（R4 Fig. 2a）；坐下、彎腰動作比較慢 | 突然出現很快的往下動作（R1 異常分數尖峰、R2 第一階段） | 之後幾乎沒有動作（R3 Fig. 13） |
| 毫米波雷達：呼吸 | 胸口規律起伏，雷達量得到（R8） | 跌倒後躺著時，呼吸還量得到，準確度 93%（R3） | 呼吸那層訊號變暗或消失（R6 Fig. 2）。但雷達單獨判斷呼吸事件只抓到約五到七成（R7），要搭配其他訊號 |
| 紅外線 | 有人經過就輸出訊號（約 2 秒），人不動就沒有訊號（He 2023） | 跌倒那一下有訊號，之後就沒有 | （同學情境沒用） |
| 床墊壓力 | 躺著時壓力穩定；正常下床：躺著 → 抬背 → 轉身 → 離床（Meng 2024） | 躺著直接變成沒人，中間沒有抬背、轉身，判斷為跌下床（Meng 2024） | （同學情境沒用） |
| 語音確認 | 問了有回應 → 取消 | 跌倒後問，有回應就不打擾家人，減少誤報（V1） | 問了沒回應 → 通知。80% 跌倒時不會自己按求救鈕（V2），所以要系統主動問 |

紅外線、床墊壓力的文獻見 D 節。

---

## D. 紅外線與床墊壓力（上一版已整理）

| 文獻 | 重點 |
|---|---|
| He C, Liu S, Zhong G, et al. (2023). A non-contact fall detection method for bathroom application based on MEMS infrared sensors. *Micromachines*, 14(1), 130. doi:10.3390/mi14010130（[PMC9867492](https://pmc.ncbi.nlm.nih.gov/articles/PMC9867492/)） | 浴室專用。PIR 只對人移動造成的紅外線變化有反應，有動作時輸出 1、維持 2 秒。**Fig. 13**：跌倒後身體區域往下移，之後維持穩定。單用一個紅外線或 PIR 很難判斷跌倒。準確度 92.81%，環境溫度越高越不準 |
| Meng F, Liu T, Meng C, et al. (2024). Method of bed exit intention based on the internal pressure features in array air spring mattress. *Scientific Reports*, 14, 27273. doi:10.1038/s41598-024-78903-4 | **Fig. 6**：八種狀態的壓力時間序列（躺著、床上坐起、床邊坐、沒人、抬背、轉身、離床、跌下床）。躺著直接變成離床判斷為跌落。測試集 99.44%、實際情境 93.5% |
| Subermaniam K, et al. (2017). *Front Public Health*, 4, 292. doi:10.3389/fpubh.2016.00292（[PMC5220104](https://pmc.ncbi.nlm.nih.gov/articles/PMC5220104/)） | 單用離床墊：119 次警報中 32% 是誤報 |
| Qi P, Gong S, Jiang N, et al. (2023). *Sensors*, 23(7), 3675. doi:10.3390/s23073675（[PMC10098849](https://pmc.ncbi.nlm.nih.gov/articles/PMC10098849)） | 床墊下的感測條量得到呼吸的週期訊號；呼吸中止時波形相似度長時間低於 40% |

---

## E. 一般做法 vs 本設計（創新想法）

| 問題（文獻） | 一般做法 | 本設計 |
|---|---|---|
| 只看高度，坐下和跌倒分不出來（R1） | 單一門檻 | 雷達同時看「重心高度掉多少」和「掉得多快」，再看之後有沒有起來（R1、R2 的兩階段做法） |
| 跌倒後躺著不動，雷達不容易看到人（R5） | 只偵測跌倒那一下 | 浴室門磁知道人在浴室裡、沒有出來；雷達改看呼吸訊號確認人還在 |
| 雷達單獨判斷呼吸事件會漏抓、誤報（R7） | 只靠一種訊號 | 雷達呼吸訊號只當作輔助，搭配「沒有動作＋語音沒回應」才通報；結合兩種訊號比單一訊號準（R6） |
| 跌倒時 80% 不會按求救鈕（V2） | 隨身按鈕 | 系統偵測到後主動問 |
| 偵測到就通報，誤報打擾家人（V1、V3） | 直接通報 | 先問本人，有回應就取消；本人也可以自己取消（V3、V4） |
| 長者回答不標準、失智者辨識錯誤率高（V5–V7） | 要說出固定指令 | 不辨識內容，只要有出聲或按按鈕就算回應；沒回應再問一次才通報 |

---

## F. 已經裁好的圖（期末簡報用）

| 檔案 | 出處 | 簡報上可以這樣說 |
|---|---|---|
| `mmfall-fig7.png` | Jin 2022（R1）Fig. 7 | 藍線是身體重心高度。走路時在 1.2 公尺上下，跌倒時一秒內掉到 0.5 公尺以下；坐下也會降，所以還要看速度 |
| `wang2024-fig2.png` | Wang 2024（R6）Fig. 2 | 綠框是呼吸停止的那 18 秒：氣流變平線，雷達的呼吸訊號同時變暗，血氧之後才掉 |
| `trinh2026-fig5.png` | Trinh 2026（R5）Fig. 5 | 跌倒後躺在地上，雷達畫面上只剩一小塊亮點，比站著走動難偵測很多 |
| `hu2024-fig2a-microdoppler.png` | Hu 2024（R4）Fig. 2a（原圖出自該文獻的參考資料 [52]） | 雷達的頻譜圖：走路時手、軀幹、腳各有不同的波紋 |

圖檔沒有放進 repository（著作權屬於原作者）。課堂報告引用時，在圖下方註明作者、年份、圖號。

---

## G. 限制（期末討論可以寫）

- 跌倒大多是年輕受試者模擬的（R1、R2、R3、R5），不是長者真的跌倒。
- 雷達頻率不一：R2、R5、R6、R7 是 60 GHz，和本設計一樣；R1、R8 是 77 GHz，R3 是 4.3 GHz。原理相同，數字不能直接套用。
- R5、R6、V6、V7 是預印本或會議論文，還沒有正式期刊版本。
- 浴室的磁磚、水流會影響雷達（R9）；溫度高時紅外線也比較不準（He 2023）。
- 語音確認「不辨識內容、只看有沒有出聲」是本設計的想法，文獻沒有直接測試過。
