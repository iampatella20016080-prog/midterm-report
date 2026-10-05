/* ==========================================================================
   Floor plans (SVG) — 地點
   Plan A：阿嬤家（1 m ≈ 75 units）  Plan B：外宿同學的分租套房（1 m ≈ 100 units）
   All coordinates live in a 800 × 560 viewBox. Layers carry classes so each
   slide can animate only what it needs.
   ========================================================================== */
(function () {
  "use strict";

  let uidCounter = 0;

  function sector(cx, cy, r, a0, a1) {
    const rad = (d) => (d * Math.PI) / 180;
    const x0 = cx + r * Math.cos(rad(a0));
    const y0 = cy + r * Math.sin(rad(a0));
    const x1 = cx + r * Math.cos(rad(a1));
    const y1 = cy + r * Math.sin(rad(a1));
    const large = a1 - a0 > 180 ? 1 : 0;
    return `M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`;
  }

  function sensor(code, x, y, opts = {}) {
    const cls = opts.act ? "sensor act" : "sensor";
    return `<g class="${cls}" data-code="${code}" transform="translate(${x} ${y})"><g class="s-in"><circle r="15"/><text>${code}</text></g></g>`;
  }

  function nightLight(x, y, i) {
    return `<g class="nlight" data-i="${i}" transform="translate(${x} ${y})"><circle class="light-halo" r="30"/><circle class="light-core" r="6"/></g>`;
  }

  function risk(x, y, n) {
    return `<g class="risk" data-n="${n}" transform="translate(${x} ${y})"><g class="r-in">
      <circle class="r" r="14"/><text class="rn">${n}</text>
    </g></g>`;
  }

  function scaleBar(x, y, unit) {
    return `<g class="scale" transform="translate(${x} ${y})">
      <line x1="0" y1="0" x2="${unit * 2}" y2="0"/>
      <line x1="0" y1="-5" x2="0" y2="5"/><line x1="${unit}" y1="-4" x2="${unit}" y2="4"/><line x1="${unit * 2}" y1="-5" x2="${unit * 2}" y2="5"/>
      <text x="0" y="20">0</text><text x="${unit - 4}" y="20">1</text><text x="${unit * 2 - 4}" y="20">2 m</text>
    </g>`;
  }

  /* ------------------------------------------------------------------ A */
  function planA(opts = {}) {
    const id = "pa" + ++uidCounter;
    const o = Object.assign({ route: false, risks: false, sensors: false, presence: false, lights: false, labels: true, scale: true }, opts);

    const walls = `
      <path class="wall" d="M20 20 H780 V540 H420 M350 540 H20 V20"/>
      <path class="wall" d="M320 20 V250 M320 320 V420 M320 490 V540"/>
      <path class="wall" d="M20 360 H320"/>
      <path class="wall" d="M440 20 V80 M440 300 V400 M440 470 V540"/>
      <path class="wall" d="M440 360 H780"/>`;

    const doors = `
      <path class="door" d="M320 250 L250 250 A70 70 0 0 0 320 320"/>
      <path class="door" d="M440 400 L510 400 A70 70 0 0 1 440 470"/>
      <path class="door" d="M320 420 L250 420 A70 70 0 0 0 320 490"/>
      <path class="door" d="M350 540 L350 470 A70 70 0 0 1 420 540"/>`;

    const furn = `
      <g class="furn-g">
        <rect class="furn" x="60" y="50" width="170" height="220" rx="4"/>
        <rect class="furn" x="78" y="62" width="134" height="38" rx="9"/>
        <path class="furn" d="M60 128 H230"/>
        <rect class="furn" x="244" y="50" width="52" height="48" rx="2"/>
        <rect class="furn" x="36" y="378" width="66" height="146" rx="2"/>
        <circle class="furn" cx="69" cy="414" r="13"/><circle class="furn" cx="69" cy="456" r="13"/>
        <rect class="furn" x="520" y="44" width="220" height="66" rx="6"/>
        <path class="furn" d="M520 66 H740"/>
        <rect class="furn" x="570" y="152" width="120" height="60" rx="4"/>
        <rect class="furn" x="540" y="318" width="180" height="24" rx="2"/>
        <rect class="furn" x="466" y="372" width="84" height="44" rx="6"/>
        <ellipse class="furn" cx="508" cy="394" rx="26" ry="13"/>
        <rect class="furn" x="680" y="370" width="92" height="92"/>
        <path class="furn" d="M680 370 L772 462 M772 370 L680 462"/>
        <circle class="furn" cx="726" cy="416" r="6"/>
        <rect class="furn" x="746" y="468" width="26" height="62" rx="3"/>
        <ellipse class="furn" cx="718" cy="499" rx="27" ry="21"/>
      </g>`;

    const wet = `
      <g class="wet-g">
        <path class="wet" d="M560 470 q8 -6 16 0 t16 0"/>
        <path class="wet" d="M600 492 q8 -6 16 0 t16 0"/>
        <path class="wet" d="M548 506 q8 -6 16 0 t16 0"/>
      </g>`;

    const labels = o.labels
      ? `<g class="labels">
          <text class="plabel strong" x="128" y="318">臥室</text>
          <text class="plabel" x="352" y="160">走廊</text>
          <text class="plabel strong" x="560" y="440">浴室</text>
          <text class="plabel" x="590" y="270">客廳</text>
          <text class="plabel" x="170" y="460">廚房</text>
          <text class="plabel" x="352" y="525" style="font-size:14px">大門</text>
        </g>`
      : "";

    const routeD = "M236 210 C 270 218, 288 285, 322 285 L 380 285 L 380 436 L 442 436 C 520 436, 600 470, 682 494";

    let extras = "";
    if (o.lights) {
      extras += `<g class="lights">${nightLight(300, 304, 0)}${nightLight(424, 250, 1)}${nightLight(424, 380, 2)}</g>`;
    }
    if (o.route) {
      extras += `<defs><mask id="${id}-rm" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="560"><path class="route-mask" d="${routeD}" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round"/></mask></defs>
        <path class="route" d="${routeD}" mask="url(#${id}-rm)"/>`;
    }
    if (o.risks) {
      extras += `<g class="risks">${risk(268, 226, 1)}${risk(380, 362, 2)}${risk(612, 482, 3)}</g>`;
    }
    if (o.sensors) {
      extras += `<defs>
          <clipPath id="${id}-hall"><rect x="320" y="20" width="120" height="520"/></clipPath>
          <clipPath id="${id}-bath"><rect x="440" y="360" width="340" height="180"/></clipPath>
        </defs>
        <g class="covs">
          <path class="cov" data-code="P" data-o="380 40" clip-path="url(#${id}-hall)" d="${sector(380, 34, 380, 74, 106)}"/>
          <path class="cov" data-code="R" data-o="764 372" clip-path="url(#${id}-bath)" d="${sector(764, 372, 420, 98, 182)}"/>
        </g>
        <g class="sensors">
          ${sensor("B", 145, 190)}
          ${sensor("P", 380, 40)}
          ${sensor("D", 456, 486)}
          ${sensor("R", 764, 372)}
          ${sensor("H", 462, 522)}
          ${sensor("S", 660, 524, { act: true })}
          ${sensor("L", 300, 304, { act: true })}
          ${sensor("G", 756, 44, { act: true })}
        </g>`;
    }
    if (o.presence) {
      extras += `<g class="presence-g"><circle class="presence-ring" r="10"/><circle class="presence" r="9"/></g>`;
    }

    return `<svg viewBox="0 0 800 612" data-plan="A" data-uid="${id}" aria-label="阿嬤家平面圖">
      <g class="fl-wet">${wet}</g>
      <g class="fl-furn">${furn}</g>
      <g class="fl-doors">${doors}</g>
      <g class="fl-walls">${walls}</g>
      <g class="fl-labels">${labels}</g>
      ${o.scale ? scaleBar(30, 590, 75) : ""}
      <g class="fl-extras">${extras}</g>
    </svg>`;
  }

  /* ------------------------------------------------------------------ B */
  function planB(opts = {}) {
    const id = "pb" + ++uidCounter;
    const o = Object.assign({ risks: false, sensors: false, presence: false, co: false, labels: true, fan: true, crop: false, scale: true }, opts);

    const walls = `
      <path class="wall" d="M620 20 H20 V540 H90 M170 540 H620"/>
      <path class="wall" d="M620 20 H780 M620 540 H780"/>
      <path class="wall" d="M620 20 V70 M620 170 V320 M620 460 V540"/>
      <path class="wall" d="M420 20 V150 M420 215 V240 H620"/>`;

    const windows = `
      <g class="wins">
        <path class="win" d="M774 24 V536 M780 24 V536 M786 24 V536"/>
        <path class="win" d="M780 110 H786 M780 210 H786 M780 310 H786 M780 410 H786"/>
        <path class="win" d="M615 70 V170 M625 70 V170 M620 70 V170"/>
      </g>`;

    const doors = `
      <path class="door" d="M420 150 L485 150 A65 65 0 0 1 420 215"/>
      <path class="door" d="M90 540 L90 460 A80 80 0 0 1 170 540"/>
      <rect class="door" x="611" y="320" width="8" height="76"/>
      <rect class="door" x="621" y="384" width="8" height="76"/>`;

    const furn = `
      <g class="furn-g">
        <rect class="furn" x="40" y="40" width="200" height="150" rx="4"/>
        <rect class="furn" x="50" y="52" width="38" height="126" rx="9"/>
        <path class="furn" d="M120 40 V190"/>
        <rect class="furn" x="262" y="34" width="138" height="58" rx="2"/>
        <path class="furn" d="M262 34 L400 92"/>
        <rect class="furn" x="40" y="392" width="190" height="62" rx="2"/>
        <circle class="furn" cx="135" cy="482" r="18"/>
        <rect class="furn" x="250" y="260" width="120" height="80" rx="4"/>
        <rect class="furn" x="440" y="30" width="62" height="22" rx="2"/>
        <ellipse class="furn" cx="471" cy="78" rx="22" ry="27"/>
        <rect class="furn" x="520" y="30" width="92" height="104"/>
        <path class="furn" d="M520 30 L612 134 M612 30 L520 134"/>
        <circle class="furn" cx="566" cy="82" r="6"/>
        <rect class="furn" x="496" y="192" width="80" height="40" rx="6"/>
        <ellipse class="furn" cx="536" cy="212" rx="24" ry="12"/>
        <rect class="furn" x="688" y="380" width="74" height="74" rx="4"/>
        <circle class="furn" cx="725" cy="417" r="24"/>
        <path class="furn" d="M640 250 H760 M640 290 H760" style="stroke-dasharray:3 5"/>
        <path class="furn" d="M660 250 v18 M690 250 v22 M720 250 v16 M670 290 v20 M705 290 v18 M740 290 v22"/>
      </g>`;

    const heater = `
      <g class="heater" transform="translate(694 54)">
        <rect width="62" height="92" rx="4"/>
        <path d="M14 22 H48 M14 34 H48 M14 46 H48"/>
        <path d="M31 92 V120 H-30" class="gaspipe"/>
      </g>`;

    const fan = o.fan
      ? `<g class="fan" transform="translate(470 172)">
          <circle r="17"/>
          <g class="blades"><path d="M0 -2 C 4 -10, 10 -12, 12 -8 C 10 -4, 4 -2, 0 0 Z"/><path d="M0 -2 C 4 -10, 10 -12, 12 -8 C 10 -4, 4 -2, 0 0 Z" transform="rotate(120)"/><path d="M0 -2 C 4 -10, 10 -12, 12 -8 C 10 -4, 4 -2, 0 0 Z" transform="rotate(240)"/></g>
        </g>`
      : "";

    const labels = o.labels
      ? `<g class="labels">
          <text class="plabel strong" x="270" y="420">套房</text>
          <text class="plabel strong" x="526" y="178">浴室</text>
          <text class="plabel" x="652" y="520">陽台</text>
          <text class="plabel" x="100" y="526" style="font-size:14px">房門</text>
          <text class="plabel" x="700" y="44" style="font-size:14px;letter-spacing:.04em">熱水器</text>
        </g>`
      : "";

    let extras = "";
    if (o.co) {
      // CO particles: deterministic pseudo-random seeds so renders are reproducible
      let s = 7;
      const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
      let parts = "";
      for (let i = 0; i < 20; i++) {
        const ox = 725 + (rnd() - 0.5) * 30;
        const oy = 60 + rnd() * 20;
        parts += `<circle class="co-p" cx="${ox.toFixed(1)}" cy="${oy.toFixed(1)}" r="${(2 + rnd() * 1.6).toFixed(1)}" data-tx="${(440 + rnd() * 160).toFixed(1)}" data-ty="${(50 + rnd() * 150).toFixed(1)}" data-mx="${(645 + rnd() * 110).toFixed(1)}" data-my="${(70 + rnd() * 120).toFixed(1)}"/>`;
      }
      extras = `<rect class="co-tint bath" x="424" y="24" width="192" height="212"/><rect class="co-tint balc" x="624" y="24" width="152" height="512"/>` + extras;
      extras += `<g class="co-g">${parts}</g>`;
    }
    if (o.risks) {
      extras += `<g class="risks">${risk(725, 200, 1)}${risk(744, 330, 2)}${risk(520, 170, 3)}</g>`;
    }
    if (o.sensors) {
      extras += `<defs>
          <clipPath id="${id}-bath"><rect x="420" y="20" width="200" height="220"/></clipPath>
        </defs>
        <g class="covs">
          <path class="cov" data-code="R" data-o="606 228" clip-path="url(#${id}-bath)" d="${sector(606, 228, 300, 186, 266)}"/>
        </g>
        <g class="sensors">
          ${sensor("C", 438, 112)}
          ${sensor("C", 660, 92)}
          ${sensor("R", 606, 228)}
          ${sensor("H", 600, 150)}
          ${sensor("D", 438, 228)}
          ${sensor("F", 470, 172, { act: true })}
          ${sensor("V", 664, 174, { act: true })}
          ${sensor("S", 394, 252, { act: true })}
          ${sensor("G", 380, 500, { act: true })}
        </g>`;
    }
    if (o.presence) {
      extras += `<g class="presence-g" transform="translate(566 82)"><circle class="presence-ring" r="10"/><circle class="presence" r="9"/></g>`;
    }

    return `<svg viewBox="${o.crop ? "406 12 388 236" : "0 0 800 612"}"${o.crop ? ' style="overflow:hidden"' : ""} data-plan="B" data-uid="${id}" aria-label="外宿同學套房平面圖">
      <g class="fl-furn">${furn}</g>
      <g class="fl-doors">${doors}</g>
      <g class="fl-walls">${walls}${windows}</g>
      <g class="fl-heater">${heater}</g>
      <g class="fl-fan">${fan}</g>
      <g class="fl-labels">${labels}</g>
      ${o.scale ? scaleBar(30, 590, 100) : ""}
      <g class="fl-extras">${extras}</g>
    </svg>`;
  }

  window.PLANS = { planA, planB, sector };
})();
