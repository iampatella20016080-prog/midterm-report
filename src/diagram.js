/* ==========================================================================
   感測器關係圖（仿課堂 IEEE 1451 火災偵測與逃生系統範例的結構）
   上：受信端（家屬手機＋雲端）　下：家中閘道（相當於範例中的中繼器）
   右上：網路，連到救援中心、室友、其他家屬、醫師
   右下：感測器與輸出裝置
   回傳 SVG 字串。viewBox 0 0 1680 700
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

  /* ==========================================================================
     橫向關係圖（課堂練習：核心議題 → 子議題 → 感測器）
     中間：核心議題　左：情境 A 的子議題　右：情境 B 的子議題
     外側：每個子議題用到的感測器。viewBox 0 0 1680 700
     ========================================================================== */
  function issueMap() {
    const id = "im" + ++uid;
    const core = { x: 840, y: 375, r: 132 };
    const R = 80;
    const sides = [
      {
        key: "a",
        cx: 525,
        title: "情境 A：對家人的關心",
        tx: 40,
        anchor: "start",
        items: [
          [150, ["夜間跌倒"], [["R", "毫米波雷達"], ["P", "紅外線"], ["B", "床墊壓力"]]],
          [375, ["起身頭暈"], [["M", "藍牙血壓計"], ["B", "床墊壓力"]]],
          [600, ["夜尿變多"], [["D", "門磁"], ["B", "床墊壓力"]]],
        ],
      },
      {
        key: "b",
        cx: 1155,
        title: "情境 B：對同學、朋友的關心",
        tx: 1640,
        anchor: "end",
        items: [
          [150, ["一氧化碳", "累積"], [["C", "一氧化碳模組"], ["H", "溫濕度"]]],
          [375, ["昏倒", "沒有反應"], [["R", "毫米波雷達"], ["S", "語音按鈕盒"]]],
          [600, ["洗澡太久"], [["D", "門磁"], ["H", "溫濕度"]]],
        ],
      },
    ];
    const BW = 270;
    const BH = 46;
    const GAP = 12;

    const defs = `<defs>
      <marker id="${id}-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 Z" class="im-head"/>
      </marker>
    </defs>`;

    let spokes = "";
    let subs = "";
    let sensors = "";
    let heads = "";
    sides.forEach((sd) => {
      heads += `<text class="im-side ${sd.key}" x="${sd.tx}" y="26" text-anchor="${sd.anchor}">${sd.title}</text>`;
      sd.items.forEach(([cy, label, list], k) => {
        // spoke: core edge → sub-issue edge
        const dx = sd.cx - core.x;
        const dy = cy - core.y;
        const d = Math.hypot(dx, dy);
        const ux = dx / d;
        const uy = dy / d;
        spokes += `<line class="im-spoke ${sd.key}" x1="${(core.x + ux * core.r).toFixed(1)}" y1="${(core.y + uy * core.r).toFixed(1)}" x2="${(sd.cx - ux * R).toFixed(1)}" y2="${(cy - uy * R).toFixed(1)}"/>`;
        const lh = 30;
        const t0 = cy - ((label.length - 1) * lh) / 2;
        subs += `<g class="im-sub ${sd.key}" data-k="${k}"><circle cx="${sd.cx}" cy="${cy}" r="${R}"/>${label
          .map((t, i) => `<text x="${sd.cx}" y="${(t0 + i * lh).toFixed(1)}">${t}</text>`)
          .join("")}</g>`;
        // sensor boxes stacked on the outer side
        const top = cy - (list.length * BH + (list.length - 1) * GAP) / 2;
        const bx = sd.key === "a" ? 40 : 1640 - BW;
        const group = list
          .map(([code, name], j) => {
            const by = top + j * (BH + GAP);
            const my = by + BH / 2;
            const ex = sd.key === "a" ? bx + BW : bx; // box edge facing the circle
            const vx = sd.cx - ex;
            const vy = cy - my;
            const vd = Math.hypot(vx, vy);
            const px = sd.cx - (vx / vd) * (R + 4);
            const py = cy - (vy / vd) * (R + 4);
            const sx = ex + (sd.key === "a" ? 6 : -6);
            return `<g class="im-sensor">
              <rect x="${bx}" y="${by.toFixed(1)}" width="${BW}" height="${BH}"/>
              <circle class="im-code" cx="${bx + 28}" cy="${my.toFixed(1)}" r="15"/>
              <text class="im-code-t" x="${bx + 28}" y="${my.toFixed(1)}">${code}</text>
              <text class="im-name" x="${bx + 56}" y="${my.toFixed(1)}">${name}</text>
              <line class="im-arrow" x1="${sx}" y1="${my.toFixed(1)}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}" marker-start="url(#${id}-ah)" marker-end="url(#${id}-ah)"/>
            </g>`;
          })
          .join("");
        sensors += `<g class="im-sensors ${sd.key}" data-k="${k}">${group}</g>`;
      });
    });

    const coreG = `<g class="im-core">
        <circle cx="${core.x}" cy="${core.y}" r="${core.r}"/>
        <text class="im-core-k" x="${core.x}" y="${core.y - 42}">核心議題</text>
        <text class="im-core-t" x="${core.x}" y="${core.y + 2}">浴室裡出事</text>
        <text class="im-core-t" x="${core.x}" y="${core.y + 42}">外面不知道</text>
      </g>`;

    return `<svg viewBox="0 0 1680 700" class="issue-map" role="img" aria-label="橫向關係圖：核心議題、子議題與感測器">${defs}${heads}${spokes}${sensors}${subs}${coreG}</svg>`;
  }

  /* ==========================================================================
     縱向關係圖（課堂練習：三層圖 應用層／傳輸層／感知層）
     中軸 x=900：終端設備 → 物聯網閘道 → Wi-Fi 路由器 → 網際網路 → 雲端
     viewBox 0 0 1680 700
     ========================================================================== */
  function layerMap() {
    const id = "lm" + ++uid;
    const X = 900;
    const defs = `<defs>
      <marker id="${id}-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 Z" class="lm-head"/>
      </marker>
    </defs>`;
    const bands = [
      ["app", 0, 200, ["應", "用", "層"], "跨領域整合", "五層架構：應用層、資料分析層、雲端計算層"],
      ["net", 230, 420, ["傳", "輸", "層"], "醫學資訊", "五層架構：網路層"],
      ["dev", 450, 700, ["感", "知", "層"], "醫學工程", "五層架構：感知層（終端設備與物聯網閘道）"],
    ];
    const bandSvg = bands
      .map(([k, y0, y1, label, tag, note]) => {
        const cy = (y0 + y1) / 2;
        const name = label.map((c, i) => `<text class="lm-name" x="46" y="${cy + (i - 1) * 38}">${c}</text>`).join("");
        return `<g class="lm-band ${k}">
          <rect class="lm-plane" x="110" y="${y0}" width="1570" height="${y1 - y0}"/>
          ${name}
          <text class="lm-note" x="140" y="${y0 + 32}">${note}</text>
          <text class="lm-tag" x="1656" y="${y0 + 34}">${tag}</text>
        </g>`;
      })
      .join("");

    const box = (x, y, w, h, t, sub, cls = "") =>
      `<g class="lm-box ${cls}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/>` +
      `<text class="lm-t" x="${x + w / 2}" y="${sub ? y + h / 2 - 14 : y + h / 2}">${t}</text>` +
      (sub ? `<text class="lm-s" x="${x + w / 2}" y="${y + h / 2 + 18}">${sub}</text>` : "") +
      `</g>`;

    /* ---- 應用層 */
    const app = `<g class="lm-app">
        ${box(190, 64, 420, 96, "數據分析", "個人作息、找異常、看趨勢")}
        ${box(X - 210, 64, 420, 96, "雲端計算", "收事件、加密儲存（MQTT）", "hub")}
        ${box(1190, 64, 420, 96, "應用", "家屬與室友通知、週報、119")}
        <line class="lm-arrow" x1="${X - 212}" y1="112" x2="614" y2="112" marker-end="url(#${id}-ah)"/>
        <line class="lm-arrow" x1="${X + 212}" y1="112" x2="1186" y2="112" marker-end="url(#${id}-ah)"/>
      </g>`;

    /* ---- 傳輸層 */
    const net = `<g class="lm-net">
        <rect class="lm-bus" x="140" y="282" width="1520" height="42" rx="21"/>
        <text class="lm-bus-t" x="300" y="303">網際網路</text>
        ${box(X - 150, 350, 300, 56, "Wi-Fi 路由器")}
        ${box(1270, 350, 330, 56, "4G 基地台（斷網時）", "", "backup")}
        <line class="lm-link" x1="${X}" y1="350" x2="${X}" y2="324"/>
        <line class="lm-link dash" x1="1435" y1="350" x2="1435" y2="324"/>
        <line class="lm-link" x1="${X}" y1="282" x2="${X}" y2="160"/>
      </g>`;

    /* ---- 感知層 */
    const sensors = [["R", "雷達"], ["B", "床墊"], ["P", "紅外線"], ["D", "門磁"], ["H", "溫濕度"], ["C", "一氧化碳"], ["M", "血壓計"]];
    const outputs = [["L", "夜燈"], ["S", "語音盒"], ["F", "排風扇"], ["V", "遮斷閥"]];
    const sx = (i) => 200 + i * 120;
    const ox = (i) => 1190 + i * 120;
    const CY = 630;
    const chip = (x, code, name, cls) =>
      `<g class="lm-chip ${cls}" data-code="${code}"><circle cx="${x}" cy="${CY}" r="24"/>` +
      `<text class="lm-code" x="${x}" y="${CY}">${code}</text><text class="lm-cname" x="${x}" y="${CY + 48}">${name}</text></g>`;
    const gw = { x0: X - 210, x1: X + 210, y0: 492, y1: 552 };
    const fan = (x, cls) => {
      const tx = Math.max(gw.x0 + 20, Math.min(gw.x1 - 20, x));
      return `<line class="lm-wire ${cls}" x1="${x}" y1="${CY - 26}" x2="${tx}" y2="${gw.y1}"/>`;
    };
    const dev = `<g class="lm-dev">
        <g class="lm-wires">${sensors.map((_, i) => fan(sx(i), "in")).join("")}</g>
        <g class="lm-wires-out">${outputs.map((_, i) => fan(ox(i), "out")).join("")}</g>
        ${box(gw.x0, gw.y0, gw.x1 - gw.x0, gw.y1 - gw.y0, "物聯網閘道（Raspberry Pi 4）", "", "hub gw")}
        <line class="lm-link" x1="${X}" y1="${gw.y0}" x2="${X}" y2="406"/>
        <line class="lm-link dash" x1="${gw.x1}" y1="520" x2="1435" y2="406"/>
        <text class="lm-wire-t" x="140" y="572">Zigbee／藍牙／UART</text>
        <text class="lm-wire-t out" x="1660" y="572">控制</text>
        ${sensors.map(([c, n], i) => chip(sx(i), c, n, "in")).join("")}
        ${outputs.map(([c, n], i) => chip(ox(i), c, n, "out")).join("")}
      </g>`;

    /* ---- one reading goes up from the radar to the family's phone (drawn under the boxes) */
    const flow = `<path class="lm-flowpath" d="M${sx(0)} ${CY - 26} L${X - 40} ${gw.y1} L${X} ${gw.y0} L${X} 112 L1400 112"/>
      <circle class="lm-pulse" r="11" cx="0" cy="0"/>`;

    return `<svg viewBox="0 0 1680 700" class="layer-map" role="img" aria-label="縱向關係圖：感知層、傳輸層、應用層">${defs}${bandSvg}${flow}${net}${app}${dev}</svg>`;
  }

  window.DIAGRAM = { sensorMap, issueMap, layerMap };
})();
