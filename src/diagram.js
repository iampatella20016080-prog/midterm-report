/* ==========================================================================
   感測器關係圖（仿課堂 IEEE 1451 火災偵測與逃生系統範例的結構）
   上：受信端（家屬手機＋雲端）　下：家中閘道（相當於範例中的中繼器）
   右上：網路，連到救援中心、室友、其他家屬、醫師
   右下：感測器與輸出裝置
   回傳 SVG 字串，簡報與書面報告共用。viewBox 0 0 1680 700
   ========================================================================== */
(function () {
  "use strict";

  let uid = 0;

  function box(x, y, w, h, lines, cls = "dg-sub", opts = {}) {
    const fs = opts.fs || 21;
    const lh = fs * 1.4;
    const cx = x + w / 2;
    const top = y + h / 2 - ((lines.length - 1) * lh) / 2;
    const texts = lines
      .map((t, i) => {
        const small = typeof t === "object";
        const s = small ? t.t : t;
        return `<text x="${cx}" y="${(top + i * lh).toFixed(1)}" class="${small ? "dg-tsm" : "dg-t"}">${s}</text>`;
      })
      .join("");
    return `<g class="${cls}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/>${texts}</g>`;
  }

  function arrow(x1, y1, x2, y2, id, both = false) {
    return `<line class="dg-arrow" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#${id}-ah)"${both ? ` marker-start="url(#${id}-ah)"` : ""}/>`;
  }

  function sensorMap() {
    const id = "dg" + ++uid;
    const L = 30; // left column x
    const W = 470; // left column width
    const C = L + W / 2; // left column centre

    const defs = `<defs>
      <marker id="${id}-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 Z" class="dg-head"/>
      </marker>
    </defs>`;

    /* ---- signal path: drawn under the boxes, so the pulse shows only in the gaps and on the interface arrow */
    const flow = `<path class="dg-flowpath" d="M1250 422 H1000 V630 H${C} V48"/>
      <circle class="dg-pulse" r="11" cx="0" cy="0"/>`;

    /* ---- top: 受信端 */
    const top = `<g class="dg-top">
        <rect class="dg-frame" x="0" y="0" width="880" height="262"/>
        <text class="dg-title" x="690" y="122">受信端</text>
        <text class="dg-tsm" x="690" y="156">家屬手機＋雲端</text>
      </g>
      <g class="dg-top-subs">
        ${box(L, 20, W, 56, ["家屬手機 App／LINE 通知"])}
        ${box(L, 104, W, 56, ["雲端伺服器：收送事件與指令"])}
        ${box(L, 188, W, 56, ["通訊（Wi-Fi／4G）"])}
      </g>
      <g class="dg-top-arrows">${arrow(C, 78, C, 102, id, true)}${arrow(C, 162, C, 186, id, true)}</g>`;

    /* ---- right: 網路 */
    const branches = [
      [36, "緊急救援中心／119"],
      [108, "室友、同學"],
      [180, "其他家屬"],
      [252, "醫師（回診時看週報）"],
    ];
    const net = `<g class="dg-net">
        <path class="dg-line" d="M880 90 H1000 M880 200 H1000"/>
        <rect class="dg-bus" x="1000" y="0" width="52" height="290" rx="26"/>
        ${branches.map(([y]) => `<path class="dg-line" d="M1052 ${y} H1106"/>`).join("")}
      </g>
      <g class="dg-net-labels">
        ${branches.map(([y, t]) => `<text class="dg-lbl" x="1120" y="${y + 7}">${t}</text>`).join("")}
        <text class="dg-title sm" x="1026" y="326">網路</text>
      </g>`;

    /* ---- interface: 網路介面（範例中的「傳感器介面」） */
    const iface = `<g class="dg-iface">
        <path class="dg-big" d="M${C} 262 L${C + 40} 292 L${C + 18} 292 L${C + 18} 342 L${C + 40} 342 L${C} 372 L${C - 40} 342 L${C - 18} 342 L${C - 18} 292 L${C - 40} 292 Z"/>
        <text class="dg-lbl" x="${C + 62}" y="312">網路介面</text>
        <text class="dg-tsm left" x="${C + 62}" y="340">MQTT，經 Wi-Fi／4G 傳送</text>
      </g>`;

    /* ---- bottom: 家中閘道 */
    const bottom = `<g class="dg-bottom">
        <rect class="dg-frame" x="0" y="372" width="1680" height="328"/>
        <text class="dg-title left" x="560" y="420">家中閘道</text>
        <text class="dg-tsm left" x="560" y="454">Raspberry Pi 4，相當於範例中的「中繼器」</text>
      </g>
      <g class="dg-bot-subs">
        ${box(L, 392, W, 56, ["通訊模組（Wi-Fi／4G）"])}
        ${box(L, 476, W, 84, ["嵌入式處理系統", { t: "收送指令與數據、感測器資訊" }])}
        ${box(L, 588, W, 84, ["轉換感測器數據", { t: "判斷事件、執行通報與控制" }])}
      </g>
      <g class="dg-bot-arrows">${arrow(C, 450, C, 474, id, true)}${arrow(C, 562, C, 586, id, true)}</g>
      <g class="dg-teds">
        ${box(560, 476, 360, 84, ["感測器資料表（TEDS）", { t: "型號、單位、取樣頻率、門檻" }])}
        ${arrow(558, 518, 502, 518, id, true)}
      </g>`;

    /* ---- sensor groups */
    const groups = [
      [392, "跌倒偵測", "UART／Zigbee", "毫米波雷達・床墊壓力・門磁・紅外線", ""],
      [468, "生理量測", "藍牙 BLE", "藍牙血壓計（市售）", ""],
      [544, "環境偵測", "UART／Zigbee", "一氧化碳模組・溫濕度", ""],
      [620, "輸出裝置", "Zigbee／繼電器", "夜燈・語音按鈕盒・排風扇・瓦斯遮斷閥", " act"],
    ];
    const trunk = `<g class="dg-trunk">
        <path class="dg-line" d="M${L + W} 630 H1000 M1000 ${groups[0][0] + 30} V${groups[3][0] + 30}"/>
        ${groups.map(([y]) => arrow(1000, y + 30, 1038, y + 30, id)).join("")}
      </g>`;
    const grp = groups
      .map(
        ([y, name, proto, items, act]) => `<g class="dg-group-row${act}">
        ${box(1040, y, 180, 60, [name, { t: proto }], "dg-group", { fs: 20 })}
        ${arrow(1220, y + 30, 1248, y + 30, id)}
        ${box(1250, y, 410, 60, [items], "dg-item", { fs: 19 })}
      </g>`
      )
      .join("");

    return `<svg viewBox="0 0 1680 700" class="sensor-map" role="img" aria-label="感測器關係圖">${defs}${iface}${flow}${top}${net}${bottom}${trunk}${grp}</svg>`;
  }

  window.DIAGRAM = { sensorMap };
})();
