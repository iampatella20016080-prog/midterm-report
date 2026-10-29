# 05 · 期末文獻：跌倒與昏倒沒反應的訊號曲線

> 依據：期中報告（11/5）後老師的指示。從橫向關係圖六個子議題選兩個：**夜間跌倒**（阿嬤）、**昏倒沒有反應**（同學）。
> 這兩個議題連到四個感測器：毫米波雷達（兩個議題都用）、紅外線、床墊壓力、語音按鈕盒。
> 要做的事：找文獻裡的訊號曲線，比較正常、跌倒、昏倒沒反應時的差別，整理成對照表（一般做法 vs 創新想法）。
> 血壓實測已經拿掉。

---

## A. 文獻總表

每一篇都讀過全文或摘要，數字直接取自原文。「可用的圖」是期末簡報可以引用的圖（要註明出處與圖號）。

| # | 文獻 | 感測器 | 可用的圖與重點 | 全文 |
|---|---|---|---|---|
| L1 | Diraco G, Leone A, Siciliano P. (2017). A radar-based smart sensor for unobtrusive elderly monitoring in ambient assisted living applications. *Biosensors*, 7(4), 55. doi:10.3390/bios7040055 | 雷達（UWB，4.3 GHz） | **Fig. 13**：一段完整紀錄，先走路、在樣本 T = 16,000 跌倒，之後躺著不動，到 T = 24,000 才起來。跌倒那一下和前面的走路訊號明顯不同。跌倒後躺著時，呼吸率準確度 93%、心率 89%（Table 2）。跌倒偵測敏感度 98.26%、特異度 91.75%。30 位健康受試者（平均約 25 歲與 47 歲），跌倒是模擬的 | [PMC5746778](https://pmc.ncbi.nlm.nih.gov/articles/PMC5746778/) |
| L2 | Jin F, Sengupta A, Cao S. (2022). mmFall: Fall detection using 4-D mmWave radar and a hybrid variational RNN autoencoder. *IEEE Trans Autom Sci Eng*, 19(2), 1245–1257. doi:10.1109/TASE.2020.3042158 | 毫米波雷達（77 GHz） | **Fig. 7**：藍線是身體重心高度，橘線是異常分數。跌倒時異常分數突然升高，同時重心高度下降。跌倒動作約 1 秒；重心下降門檻設 0.6 公尺。50 次跌倒偵測到 98%，誤報 2 次 | [arXiv 2003.02386](https://arxiv.org/abs/2003.02386) |
| L3 | Alizadeh M, Shaker G, De Almeida JCM, Morita PP, Safavi-Naeini S. (2019). Remote monitoring of human vital signs using mm-wave FMCW radar. *IEEE Access*, 7, 54958–54968. doi:10.1109/ACCESS.2019.2912956 | 毫米波雷達（77 GHz） | 雷達裝在床的上方，從胸口的微小起伏量呼吸和心跳。和參考儀器比較，呼吸的相關性 94%、心跳 80%。全文有呼吸波形圖（圖號待確認） | IEEE Access（開放取用） |
| L4 | He C, Liu S, Zhong G, et al. (2023). A non-contact fall detection method for bathroom application based on MEMS infrared sensors. *Micromachines*, 14(1), 130. doi:10.3390/mi14010130 | 紅外線（PIR）＋熱像陣列 | **浴室**專用。PIR 只對「人移動造成的紅外線變化」有反應，有動作時輸出 1，維持 2 秒。**Fig. 13**：跌倒後身體區域往下移，之後維持穩定（人躺著不動）。作者指出單用一個紅外線或 PIR 感測器很難判斷跌倒。2 位受試者、640 次測試，準確度 92.81%；環境溫度越高，準確度越低 | [PMC9867492](https://pmc.ncbi.nlm.nih.gov/articles/PMC9867492/) |
| L5 | Meng F, Liu T, Meng C, et al. (2024). Method of bed exit intention based on the internal pressure features in array air spring mattress. *Scientific Reports*, 14, 27273. doi:10.1038/s41598-024-78903-4 | 床墊壓力 | **Fig. 6**：八種狀態的壓力時間序列範例：躺著、床上坐起、床邊坐、無人、抬背、翻身、離床、跌下床。正常下床的順序是躺著 → 抬背 → 轉身 → 離床；**躺著直接變成離床，判斷為跌落**。離床後的壓力分布和沒人時一樣。測試集準確度 99.44%（720 筆），實際情境 93.5% | Scientific Reports（開放取用） |
| L6 | Subermaniam K, et al. (2017). The effectiveness of a wireless modular bed absence sensor device for fall prevention among older inpatients. *Front Public Health*, 4, 292. doi:10.3389/fpubh.2016.00292 | 床墊壓力（離床墊） | 三片感測墊都沒有壓力就警報。31 位住院長者、119 次警報，68% 是真的離床、32% 是誤報；敏感度 100%。沒有訊號圖 | [PMC5220104](https://pmc.ncbi.nlm.nih.gov/articles/PMC5220104/) |
| L7 | Qi P, Gong S, Jiang N, et al. (2023). Mattress-based non-influencing sleep apnea monitoring system. *Sensors*, 23(7), 3675. doi:10.3390/s23073675 | 床墊壓力（PVDF） | 感測條放在床墊下，量到胸口起伏的週期訊號。正常呼吸時波形相似度 70% 以上，呼吸中止時長時間低於 40%（Fig. 14）。樣本少（20 人） | [PMC10098849](https://pmc.ncbi.nlm.nih.gov/articles/PMC10098849) |
| L8 | Tîrziu E, Vasilevschi AM, Alexandru A, Tudora E. (2025). Real-time fall monitoring for seniors via YOLO and voice interaction. *Future Internet*, 17(8), 324. doi:10.3390/fi17080324 | 語音互動 | 懷疑跌倒後，語音助理先跟本人對話，依照有沒有回應決定要不要通知家人。加入語音確認後誤報減少。用 200 段模擬影片測試（他們用攝影機，本設計不用，只參考語音確認的做法） | MDPI（開放取用） |
| L9 | Chaudhuri S, Kneale L, Le T, et al. (2017). Older adults' perceptions of fall detection devices. *J Appl Gerontol*, 36(8), 915–930. doi:10.1177/0733464815591211 | 求救按鈕 | 27 位長者的焦點團體。長者擔心誤報，希望可以自己取消通報；也反映跌倒時按鈕很難按 | [PMC6874474](https://pmc.ncbi.nlm.nih.gov/articles/PMC6874474/) |
| [4] | Fleming J, Brayne C. (2008). *BMJ*, 337, a2227（期中已引用） | 求救按鈕 | 獨自跌倒時 80% 沒有使用隨身求救鈕 | |

---

## B. 對照表初稿：四個感測器的訊號

| 感測器 | 正常 | 夜間跌倒 | 昏倒沒有反應 |
|---|---|---|---|
| 毫米波雷達 | 走動時有明顯的移動訊號，重心在站著的高度；坐著或躺著不動時，還看得到呼吸造成的規律小起伏（L3） | 約 1 秒內出現一次很大的移動訊號，重心高度往下掉（L2）；之後移動訊號幾乎消失（L1 Fig. 13） | 身體幾乎不動，但呼吸、心跳還量得到（L1：跌倒後躺著時呼吸 93%、心跳 89%）。如果連呼吸訊號都不規律或消失，是最危險的狀況 |
| 紅外線 | 有人經過就輸出訊號（維持約 2 秒），人不動就沒有訊號（L4） | 跌倒那一下有訊號，之後人躺著不動就沒有訊號。PIR 分不出跌倒和坐下，要搭配其他感測器（L4） | （同學情境沒有用） |
| 床墊壓力 | 躺著時壓力穩定，加上呼吸的週期小變化（L7）；正常下床：躺著 → 抬背坐起 → 轉身到床邊 → 離床（L5） | 躺著直接變成沒人，中間沒有抬背、轉身，判斷為跌下床（L5）；離床太久沒回來，要看走廊和浴室的感測器 | （同學情境沒有用） |
| 語音按鈕盒 | 不是連續的曲線，是事件：系統問 → 本人回應（說話或按鈕）→ 取消通報 | 雷達判斷跌倒後先問，有回應就不打擾家人（L8） | 問了沒有回應，就當作可能昏倒，通知家人或室友。80% 長者獨自跌倒時沒按求救鈕（[4]），所以不能只靠本人主動按 |

---

## C. 一般做法 vs 本設計（創新想法）

| 問題 | 一般做法 | 本設計 |
|---|---|---|
| 單一感測器容易誤判 | 只用一種感測器：離床墊（誤報 32%，L6）、單一 PIR（作者說不夠，L4） | 床墊、走廊紅外線、浴室雷達照夜間動線串起來：離床 → 走廊有人經過 → 進浴室，訊號順序對得上才算正常如廁 |
| 跌倒後直接通報，家人常被誤報打擾 | 偵測到就通報 | 先用語音盒問本人，60 秒沒回應才通知（L8 語音確認減少誤報；L9 長者希望能取消） |
| 昏倒和睡著、泡澡分不出來 | 只看有沒有動作 | 雷達同時看「動作」和「呼吸心跳」：不動但呼吸正常、不動而且呼吸異常，分成不同等級通報（L1、L3） |
| 求救鈕要本人按 | 隨身按鈕 | 自動偵測，不需要本人按（[4]：80% 沒按） |

---

## D. 限制（期末討論可以寫）

- 這些研究的跌倒大多是年輕受試者模擬的（L1、L2、L4），不是長者真的跌倒。
- L1 用的是 4.3 GHz 的 UWB 雷達，L2、L3 是 77 GHz，本設計用 60 GHz。原理一樣，都是看反射訊號的變化，但頻率不同，數字不能直接套用。
- L4 指出浴室溫度高時，紅外線的準確度會下降，和情境 B（熱水澡）有關。
- L3 呼吸波形的圖號還沒確認，引用前要再看一次全文。
