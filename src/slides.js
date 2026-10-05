/* ==========================================================================
   Slide timelines
   Every builder receives S (helpers bound to the slide's timeline).
   Order inside each slide follows the hierarchy rule:
   headline → key visual → supporting text → sources.
   ========================================================================== */
(function () {
  "use strict";

  const B = DECK.builders;
  const AMBER = "#E8A33D";
  const VERM = "#D2462F";
  const SLATE = "#7F93A8";

  /* ------------------------------------------------------------ shared */
  const hms = (sec) => {
    sec = Math.max(0, Math.round(sec));
    const h = Math.floor(sec / 3600) % 24;
    const m = Math.floor(sec / 60) % 60;
    const s = sec % 60;
    return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
  };

  /** Plan-space point → stage-space point for an <svg> with a viewBox. */
  function planPt(svg, x, y) {
    const r = DECK.rectIn(svg);
    const vb = svg.viewBox.baseVal;
    const k = r.w / vb.width;
    return { x: r.x + (x - vb.x) * k, y: r.y + (y - vb.y) * k, k };
  }

  /** Draw a floor plan in a consistent order: walls → doors → furniture → labels. */
  function drawPlan(S, root, pos, speed = 1) {
    const { tl } = S;
    S.draw(S.q(root.querySelectorAll(".wall")), pos, { d: 1.3 * speed, stagger: 0.07 * speed });
    S.draw(S.q(root.querySelectorAll(".win")), pos + 0.5 * speed, { d: 0.9 * speed, stagger: 0.03 });
    S.draw(S.q(root.querySelectorAll(".door")), pos + 0.75 * speed, { d: 0.8 * speed, stagger: 0.06 });
    S.show(S.q(root.querySelectorAll(".fl-furn, .fl-heater, .fl-fan")), pos + 0.9 * speed, { d: 0.8 * speed });
    S.show(S.q(root.querySelectorAll(".fl-wet")), pos + 1.1 * speed, { d: 0.6 });
    S.fade(S.q(root.querySelectorAll(".plabel")), pos + 1.1 * speed, { y: 6, stagger: 0.05 });
    S.show(S.q(root.querySelectorAll(".scale")), pos + 1.3 * speed, { d: 0.5 });
    return tl;
  }

  /** A sensor glyph "fires": ring flash + colour. */
  function flash(S, g, pos, color = AMBER) {
    if (!g) return;
    const inner = g.querySelector(".s-in") || g;
    const c = g.querySelector("circle");
    S.tl.fromTo(inner, { scale: 1, transformOrigin: "50% 50%" }, { scale: 1.45, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 }, pos);
    S.tl.to(c, { stroke: color, strokeWidth: 3, duration: 0.2 }, pos);
    S.tl.to(g, { opacity: 1, duration: 0.2 }, pos);
  }
  function originOf(g) {
    const m = /translate\(([-\d.]+)[ ,]+([-\d.]+)\)/.exec(g.getAttribute("transform") || "");
    return m ? `${m[1]} ${m[2]}` : "0 0";
  }

  function lightsOn(S, svg, pos, stagger = 0.22) {
    const ls = Array.from(svg.querySelectorAll(".nlight"));
    ls.forEach((l, i) => {
      const halo = l.querySelector(".light-halo");
      const core = l.querySelector(".light-core");
      const o = originOf(l);
      S.tl.fromTo(core, { autoAlpha: 0.25 }, { autoAlpha: 1, duration: 0.25, ease: "power1.out" }, pos + i * stagger);
      S.tl.fromTo(halo, { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%" }, { scale: 1, autoAlpha: 1, duration: 0.9, ease: S.E.enter }, pos + i * stagger);
      void o;
    });
  }

  /* ================================================================ S0 */
  B["s-cover"] = (S) => {
    const { tl, E } = S;
    tl.fromTo(S.one(".cover-dot"), { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.7, ease: "back.out(2.2)" }, 0.25);
    tl.fromTo(S.one(".cover-halo"), { scale: 0.1, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 2.2, ease: "power2.out" }, 0.45);
    const chars = S.q(".q .ch");
    tl.fromTo(chars.slice(0, -1), { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: E.enter, stagger: 0.12 }, 0.9);
    // the question mark arrives last and settles — follow-through
    tl.fromTo(chars.slice(-1), { autoAlpha: 0, y: -46, rotation: -8 }, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.9, ease: "back.out(2)" }, 1.5);
    S.lines(".name .line", 2.0);
    S.lines(".sub .line", 2.2);
    S.rule(".meta-rule", 2.4, { d: 1.3 });
    S.fade(".eyebrow", 2.6, { y: 8 });
    S.fade(".meta > div", 2.7, { stagger: 0.12, y: 10 });
  };

  /* ================================================================ S1 */
  B["s-hook"] = (S) => {
    const { tl, E } = S;
    // measure the two 「浴室」 before any tween moves them
    const merge = S.one(".merge");
    const mr = DECK.rectIn(merge);
    const target = { x: 960, y: mr.y + mr.h / 2 };
    const baths = S.q(".bath");
    const flights = baths.map((b) => {
      const r = DECK.rectIn(b);
      return { el: b, dx: target.x - (r.x + r.w / 2), dy: target.y - (r.y + r.h / 2), k: 220 / parseFloat(getComputedStyle(b).fontSize) };
    });

    S.fade(".h-eyebrow", 0, { y: 8 });
    S.q(".clock").forEach((c, ci) => {
      const strips = DECK.makeRoller(c, c.dataset.time);
      const t0 = 0.2 + ci * 0.45;
      tl.fromTo(c, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, t0);
      strips.forEach((st, k) => {
        tl.fromTo(st.s, { yPercent: 0 }, { yPercent: -st.d * 10, duration: 1.1 + k * 0.14, ease: "power3.inOut" }, t0);
      });
    });
    tl.fromTo(S.one(".divider"), { scaleY: 0 }, { scaleY: 1, duration: 1.1, ease: E.move }, 0.4);
    S.fade(".moment.a .where", 1.0);
    S.fade(".moment.a .story", 1.2);
    S.fade(".moment.b .where", 1.45);
    S.fade(".moment.b .story", 1.65);
    S.lines(".punch .line", 2.3);
    S.step(4);

    // the shared place surfaces — everything else steps back
    const rest = S.q(".dimmable, .clock, .punch, .h-eyebrow, .where .k, .divider");
    tl.to(rest, { autoAlpha: 0.12, duration: 0.6, ease: "power1.inOut" });
    tl.to(baths, { color: AMBER, duration: 0.5, ease: "power1.inOut" }, "<0.1");
    // anticipation: a small dip before the flight
    tl.to(baths, { y: 6, duration: 0.22, ease: "power2.out" }, ">0.15");
    flights.forEach((f, i) => {
      tl.to(f.el, { x: f.dx, y: f.dy, scale: f.k, duration: 1.15, ease: "power3.inOut" }, i === 0 ? ">" : "<0.07");
    });
    tl.to(rest, { autoAlpha: 0, duration: 0.5, ease: "power1.in" }, "<0.3");
    tl.set(merge, { autoAlpha: 1 }, ">-0.05");
    tl.to(baths, { autoAlpha: 0, duration: 0.25 }, "<");
  };

  /* ================================================================ S2 */
  B["s-issue"] = (S) => {
    const { tl, E } = S;
    const big = S.one(".big");
    const br = DECK.rectIn(big);
    const pr = DECK.rectIn(S.one(".title-rest .ph"));
    const dx = pr.x + pr.w / 2 - 960;
    const dy = pr.y + pr.h / 2 - (br.y + br.h / 2);

    tl.to(big, { x: dx, y: dy, scale: 60 / 220, duration: 1.15, ease: "power3.inOut" }, 0.25);
    S.lines(".title-rest .line", 0.95);
    S.q(".fact").forEach((f, i) => {
      S.fade(f, 1.45 + i * 0.18);
    });
    S.step(3);

    // balance: anticipation → tilt → counter-tilt → settle
    const beam = S.one(".beam-g");
    const L = S.one(".pan-g.left");
    const R = S.one(".pan-g.right");
    const ang = { a: 0 };
    const apply = () => {
      const r = (ang.a * Math.PI) / 180;
      const c = Math.cos(r);
      const s = Math.sin(r);
      beam.setAttribute("transform", `rotate(${ang.a.toFixed(2)} 420 120)`);
      L.setAttribute("transform", `translate(${(420 - 280 * c).toFixed(1)} ${(120 - 280 * s).toFixed(1)})`);
      R.setAttribute("transform", `translate(${(420 + 280 * c).toFixed(1)} ${(120 + 280 * s).toFixed(1)})`);
    };
    apply();
    S.draw(S.q(".balance .base, .balance .post"), ">", { d: 0.7 });
    S.draw(S.q(".balance .beam"), "<0.3", { d: 0.8 });
    S.pop(S.q(".balance .pivot"), "<0.5", { from: 0 });
    S.fade(S.q(".pan-in"), "<0.4", { y: -10, stagger: 0.12 });
    const tilt = (to, d, ease, pos) => {
      const from = ang.a;
      ang.a = to;
      tl.to({}, { drive: { fn: (v) => { ang.a = v; apply(); }, from, to }, duration: d, ease }, pos);
    };
    tilt(-13, 1.1, "back.inOut(1.6)", ">0.3");
    tl.to(S.q(".pan-g.left .w-title"), { fill: VERM, duration: 0.4 }, "<0.5");
    tilt(13, 1.3, "back.inOut(1.6)", ">0.9");
    tl.to(S.q(".pan-g.left .w-title"), { fill: "#f2ede4", duration: 0.4 }, "<0.3");
    tl.to(S.q(".pan-g.right .w-title"), { fill: VERM, duration: 0.4 }, "<0.2");
    S.step(2.5);
    tilt(0, 1.3, "back.out(1.5)", ">");
    tl.to(S.q(".pan-g.right .w-title"), { fill: "#f2ede4", duration: 0.4 }, "<");
    tl.to(S.q(".pan-g .w-title"), { fill: AMBER, duration: 0.5 }, "<0.6");
    S.fade(".resolve .k", "<0.1", { y: 8 });
    tl.fromTo(S.one(".resolve .v"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: E.move }, "<0.2");
  };

  /* ================================================================ S3 */
  B["s-evA"] = (S) => {
    const { tl } = S;
    S.lines(".headline .line", 0);
    const col = (c, t) => {
      S.fade(`${c} .step`, t, { y: 8 });
      S.fade(`${c} .claim`, t + 0.12);
      S.fade(`${c} .num`, t + 0.3, { y: 24, d: 0.9 });
      S.count(`${c} .num .cnt`, t + 0.3, { d: 1.4 });
      S.fade(`${c} .num-label`, t + 0.55);
      S.fade(`${c} .second`, t + 0.75);
      S.count(`${c} .second .cnt`, t + 0.75, { d: 1.2 });
    };
    col(".c1", 0.6);
    S.step(3.5);
    S.rule(".link.l1", tl.duration(), { d: 0.5 });
    col(".c2", tl.duration() - 0.1);
    S.step(3.5);
    S.rule(".link.l2", tl.duration(), { d: 0.5 });
    col(".c3", tl.duration() - 0.1);
    S.fade(".foot", ">-0.4", { y: 6 });
  };

  /* ================================================================ S4 */
  B["s-evB"] = (S) => {
    const { tl, E } = S;
    const grid = S.one(".dots .grid");
    grid.innerHTML = Array.from({ length: 149 }, (_, i) => `<div class="d" data-i="${i}"></div>`).join("");
    const dots = S.q(".dots .d");
    const bar = S.one(".months .bar");
    const order = [7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6];
    bar.innerHTML = order.map((m) => `<div class="m ${[12, 1, 2].includes(m) ? "hot" : ""}">${[12, 1, 2].includes(m) ? '<div class="fillm"></div>' : ""}<span>${m}</span></div>`).join("");

    S.lines(".headline .line", 0);
    S.fade(".dots .caption", 0.5, { y: 6 });
    tl.fromTo(dots, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 0.55, duration: 0.45, ease: E.settle, stagger: { each: 0.006, grid: [10, 15], from: "start" } }, 0.65);
    tl.to(dots.slice(0, 119), { backgroundColor: AMBER, opacity: 1, duration: 0.35, ease: "power1.out", stagger: 0.005 }, ">0.2");
    S.fade(".dots .legend > div", "<0.3", { stagger: 0.15 });
    S.step(3.5);
    S.q(".stat").forEach((st, i) => {
      S.fade(st, tl.duration() + (i === 0 ? 0 : 0.0), { y: 18 });
    });
    const t1 = tl.duration() - 0.6;
    S.count(".stat .cnt", t1, { d: 1.3, stagger: 0.18 });
    S.fade(".months .cap", t1 + 0.6, { y: 6 });
    S.show(".months .m", t1 + 0.7, { d: 0.4, stagger: 0.03 });
    tl.fromTo(S.q(".months .fillm"), { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: E.enter, stagger: 0.1 }, t1 + 1.15);
    S.fade(".months .note", t1 + 1.4);
    S.fade(".quote", t1 + 1.9, { x: -14, y: 0 });
    S.fade(".foot", t1 + 2.2, { y: 6 });
  };

  /* ================================================================ S5 */
  B["s-scnA"] = (S) => {
    const { tl, E } = S;
    const svg = S.one(".plan svg");
    S.fade(".tag", 0, { x: -10, y: 0 });
    S.lines(".title .line", 0.1);
    S.fade(".row", 0.55, { stagger: 0.11 });
    drawPlan(S, svg, 0.5);
    S.fade(".plan-cap", 1.8, { y: 6 });
    S.step(2.5);

    // the night route: dashed line extends, the presence dot walks it
    const routeMask = svg.querySelector(".route-mask");
    const route = svg.querySelector(".route");
    const dot = svg.querySelector(".presence-g");
    S.draw(routeMask, tl.duration(), { d: 2.4, ease: "power1.inOut" });
    tl.fromTo(dot, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, "<");
    tl.fromTo(
      dot,
      { motionPath: { path: route, align: route, alignOrigin: [0.5, 0.5], start: 0, end: 0 } },
      { motionPath: { path: route, align: route, alignOrigin: [0.5, 0.5], start: 0, end: 1 }, duration: 2.4, ease: "power1.inOut", immediateRender: true },
      "<"
    );
    tl.fromTo(svg.querySelector(".presence-ring"), { scale: 1, autoAlpha: 0.9, transformOrigin: "50% 50%" }, { scale: 2.6, autoAlpha: 0, duration: 1.0, ease: "power2.out" }, ">-0.1");
    S.pop(S.q(svg.querySelectorAll(".risk .r-in")), "<", { stagger: 0.28 });
    S.fade(".risk-legend span", "<0.1", { stagger: 0.28, y: 8 });
  };

  /* ================================================================ S6 */
  function coDrift(S, svg, pos, dur = 3.2) {
    const parts = Array.from(svg.querySelectorAll(".co-p"));
    parts.forEach((p, i) => {
      const cx = +p.getAttribute("cx");
      const cy = +p.getAttribute("cy");
      const mx = +p.dataset.mx;
      const my = +p.dataset.my;
      const tx = +p.dataset.tx;
      const ty = +p.dataset.ty;
      const wy = 84 + ((i * 37) % 76); // through the bathroom window (y 70–170)
      const inBath = i % 3 !== 0; // two thirds leak into the bathroom
      const path = inBath
        ? [{ x: 0, y: 0 }, { x: mx - cx, y: my - cy }, { x: 622 - cx, y: wy - cy }, { x: tx - cx, y: ty - cy }]
        : [{ x: 0, y: 0 }, { x: (mx - cx) * 0.6, y: my - cy + 20 }, { x: mx - cx - 10, y: my - cy + 180 }];
      S.tl.fromTo(p, { autoAlpha: 0, x: 0, y: 0 }, { autoAlpha: 0.85, duration: 0.4, ease: "none" }, pos + i * 0.06);
      S.tl.fromTo(
        p,
        { x: 0, y: 0 },
        { motionPath: { path, curviness: 1.1 }, duration: dur + (i % 5) * 0.25, ease: "sine.inOut", immediateRender: false },
        pos + i * 0.06
      );
    });
  }

  B["s-scnB"] = (S) => {
    const { tl } = S;
    const svg = S.one(".plan svg");
    S.fade(".tag", 0, { x: -10, y: 0 });
    S.lines(".title .line", 0.1);
    S.fade(".row", 0.55, { stagger: 0.11 });
    drawPlan(S, svg, 0.5);
    S.fade(".plan-cap", 1.8, { y: 6 });
    S.step(2.5);

    const t0 = tl.duration();
    const dot = svg.querySelector(".presence-g");
    S.pop(dot, t0, { from: 0 });
    // heater fires: its lines warm up
    tl.to(svg.querySelectorAll(".heater path"), { stroke: VERM, duration: 0.5 }, t0 + 0.3);
    tl.to(svg.querySelector(".heater rect"), { stroke: VERM, duration: 0.5 }, t0 + 0.3);
    coDrift(S, svg, t0 + 0.6);
    tl.to(svg.querySelector(".co-tint.balc"), { opacity: 0.1, duration: 2.0, ease: "power1.in" }, t0 + 0.9);
    tl.to(svg.querySelector(".co-tint.bath"), { opacity: 0.2, duration: 2.6, ease: "power1.in" }, t0 + 1.6);
    S.pop(S.q(svg.querySelectorAll(".risk .r-in")), t0 + 1.6, { stagger: 0.35 });
    S.fade(".risk-legend span", t0 + 1.7, { stagger: 0.35, y: 8 });
    // the person slows down: ring fades, dot dims slightly
    tl.to(dot.querySelector(".presence"), { fill: "#c9a46a", duration: 1.2 }, t0 + 3.2);
  };

  /* ================================================================ S7 */
  B["s-principles"] = (S) => {
    const { tl } = S;
    S.lines(".headline .line", 0);
    S.q(".p").forEach((p, i) => {
      const t = 0.7 + i * 0.32;
      S.draw(S.q(p.querySelectorAll("svg .ln, svg .acc")), t - 0.1, { d: 0.9, stagger: 0.08 });
      S.rule(p.querySelector(".bar"), t + 0.2, { d: 0.8 });
      S.fade(p.querySelector(".n"), t + 0.15, { y: 6 });
      S.fade(p.querySelector(".t"), t + 0.22, { y: 18 });
      S.fade(p.querySelector(".d"), t + 0.36);
      S.fade(p.querySelector(".ex"), t + 0.5);
      S.pop(S.q(p.querySelectorAll("svg .accf")), t + 0.6);
    });
    void tl;
  };

  /* ================================================================ S8 */
  B["s-sensors"] = (S) => {
    S.lines(".headline .line", 0);
    S.fade(".tr.th", 0.6, { y: 6 });
    S.q(".tr:not(.th)").forEach((r, i) => {
      const t = 0.75 + i * 0.14;
      S.fade(r, t, { y: 14 });
      S.pop(r.querySelector(".code"), t + 0.1);
      S.pop(S.q(r.querySelectorAll(".chip.on")), t + 0.3, { stagger: 0.06, from: 0.6 });
    });
    S.fade(".foot", 2.2, { y: 6 });
  };

  /* ================================================================ S9 */
  B["s-place"] = (S) => {
    const { tl } = S;
    S.lines(".headline .line", 0);
    S.fade(".planwrap .cap", 0.4, { stagger: 0.15, y: 8 });
    const svgs = S.q(".planwrap svg");
    svgs.forEach((svg, i) => drawPlan(S, svg, 0.5 + i * 0.2, 0.75));
    S.step(2);
    const t0 = tl.duration();
    svgs.forEach((svg, i) => {
      const sensors = Array.from(svg.querySelectorAll(".sensor"));
      sensors.forEach((g, k) => {
        tl.fromTo(g.querySelector(".s-in"), { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%" }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(2)" }, t0 + i * 0.5 + k * 0.16);
      });
      svg.querySelectorAll(".cov").forEach((c, k) => {
        tl.fromTo(c, { scale: 0, autoAlpha: 0, svgOrigin: c.dataset.o }, { scale: 1, autoAlpha: 1, duration: 1.0, ease: S.E.enter, svgOrigin: c.dataset.o }, t0 + 0.4 + i * 0.5 + k * 0.3);
      });
      if (svg.querySelector(".nlight")) lightsOn(S, svg, t0 + 0.9, 0.18);
    });
    S.fade(".legend > span", t0 + 1.4, { stagger: 0.04, y: 6 });
  };

  /* ================================================================ S10 */
  B["s-arch"] = (S) => {
    const { tl, E } = S;
    const layers = S.q(".layer");
    const rects = layers.map((l) => DECK.rectIn(l));
    const top = rects[0];
    const bot = rects[rects.length - 1];
    const right = top.x + top.w;
    // place flow tracks inside the right gutter of the layer stack
    const upX = right - 78;
    const dnX = right - 44;
    const yTop = top.y + top.h / 2;
    const yBot = bot.y + bot.h / 2;
    const yAna = rects[1].y + rects[1].h / 2;
    const set = (sel, css) => Object.assign(S.one(sel).style, css);
    set(".flowline.up", { left: `${upX}px`, top: `${yTop}px`, height: `${yBot - yTop}px` });
    set(".flowline.down", { left: `${dnX}px`, top: `${yAna}px`, height: `${yBot - yAna}px` });
    set(".packet", { left: `${upX - 6}px`, top: `${yBot - 7}px` });
    set(".cmd", { left: `${dnX - 6}px`, top: `${yAna - 7}px` });
    set(".flowlabel.lu", { left: `${upX - 10}px`, top: `${top.y - 30}px`, transform: "translateX(-100%)" });
    set(".flowlabel.ld", { left: `${dnX + 10}px`, top: `${bot.y + bot.h + 10}px` });
    const cloudTop = rects[0].y;
    const cloudBot = rects[2].y + rects[2].h;
    const edgeTop = rects[3].y;
    const edgeBot = rects[4].y + rects[4].h;
    set(".b-cloud", { top: `${cloudTop + 6}px`, height: `${cloudBot - cloudTop - 12}px` });
    set(".b-edge", { top: `${edgeTop + 6}px`, height: `${edgeBot - edgeTop - 12}px` });
    set(".bl-cloud", { top: `${(cloudTop + cloudBot) / 2 - 56}px` });
    set(".bl-edge", { top: `${(edgeTop + edgeBot) / 2 - 56}px` });

    S.lines(".headline .line", 0);
    // build bottom-up: perception first, like the data
    const rev = layers.slice().reverse();
    rev.forEach((l, i) => {
      S.fade(l, 0.55 + i * 0.16, { y: 26, d: 0.8 });
    });
    S.step(3);
    const t0 = tl.duration();
    tl.fromTo(S.one(".flowline.up"), { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 1.0, ease: E.move }, t0);
    tl.fromTo(S.one(".packet"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, t0 + 0.2);
    tl.fromTo(S.one(".packet"), { y: 0 }, { y: -(yBot - yTop), duration: 2.0, ease: "power1.inOut" }, t0 + 0.3);
    S.fade(".flowlabel.lu", t0 + 0.6, { y: 6 });
    // each layer acknowledges the packet as it passes
    rev.forEach((l, i) => {
      tl.fromTo(l, { borderColor: "rgba(17,22,29,0.45)" }, { borderColor: SLATE, duration: 0.25, yoyo: true, repeat: 1 }, t0 + 0.3 + i * 0.45);
    });
    tl.fromTo(S.one(".flowline.down"), { scaleY: 0, transformOrigin: "50% 0%" }, { scaleY: 1, duration: 0.8, ease: E.move }, t0 + 2.3);
    tl.fromTo(S.one(".cmd"), { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, t0 + 2.4);
    tl.fromTo(S.one(".cmd"), { y: 0 }, { y: yBot - yAna, duration: 1.4, ease: "power2.inOut" }, t0 + 2.8);
    S.fade(".flowlabel.ld", t0 + 3.0, { y: -6 });
    S.step(3);
    const t1 = tl.duration();
    tl.fromTo(S.q(".bracket"), { scaleY: 0, transformOrigin: "0% 50%" }, { scaleY: 1, duration: 0.7, ease: E.move, stagger: 0.25 }, t1);
    S.fade(".bl-cloud", t1 + 0.3, { x: -10, y: 0 });
    S.fade(".bl-edge", t1 + 0.55, { x: -10, y: 0 });
  };

  /* ================================================================ S11 */
  B["s-flowA"] = (S) => {
    const { tl, E } = S;
    const svg = S.one(".plan svg");
    const route = svg.querySelector(".route");
    const routeMask = svg.querySelector(".route-mask");
    const dot = svg.querySelector(".presence-g");
    const core = dot.querySelector(".presence");
    const ring = dot.querySelector(".presence-ring");
    const sensor = (code) => svg.querySelector(`.sensor[data-code="${code}"]`);
    const node = (n) => S.one(`.node[data-n="${n}"]`);
    const clock = S.one(".simclock");
    const st = S.one(".simstate .st");
    const base = 2 * 3600 + 13 * 60;

    // overlay placement in plan space
    const pBath = planPt(svg, 600, 360);
    const bubble = S.one(".bubble");
    bubble.style.left = `${pBath.x - 40}px`;
    bubble.style.top = `${pBath.y - 132}px`;
    const cd = S.one(".countdown");
    cd.style.left = `${pBath.x - 40 + bubble.offsetWidth + 18}px`;
    cd.style.top = `${pBath.y - 128}px`;
    const pNotif = planPt(svg, 36, 300);
    const notif = S.one(".notif");
    notif.style.left = `${pNotif.x}px`;
    notif.style.top = `${pNotif.y}px`;
    const pChip = planPt(svg, 462, 120);
    const chip = S.one(".result-chip");
    chip.style.left = `${pChip.x}px`;
    chip.style.top = `${pChip.y}px`;

    const arc = cd.querySelector(".arc");
    const C = 2 * Math.PI * 33;
    arc.style.strokeDasharray = `${C} ${C}`;

    const stateTexts = [];
    const stateAt = (txt, pos) => stateTexts.push([pos, txt]);

    const lit = (n, pos, ts) => {
      const nd = node(n);
      tl.fromTo(nd.querySelector(".hl"), { scaleY: 0 }, { scaleY: 1, duration: 0.45, ease: E.enter }, pos);
      tl.to(nd.querySelector(".badge"), { borderColor: nd.classList.contains("alertnode") ? VERM : AMBER, color: "#f2ede4", duration: 0.3 }, pos);
      if (ts) {
        const tsEl = nd.querySelector(".ts");
        tl.fromTo(tsEl, { autoAlpha: 0, x: 8 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: E.soft }, pos + 0.1);
        tsEl.textContent = ts;
      }
    };

    /* ---- seg 0: the logic, readable at rest */
    S.lines(".headline .line", 0);
    S.fade(".simclock-row", 0.35, { y: 10 });
    drawPlan(S, svg, 0.4, 0.7);
    tl.fromTo(S.q(svg.querySelectorAll(".sensor, .cov")), { autoAlpha: 0 }, { autoAlpha: 0.38, duration: 0.6 }, 1.2);
    S.draw(routeMask, 1.3, { d: 1.2 });
    tl.fromTo(route, { autoAlpha: 0 }, { autoAlpha: 0.35, duration: 0.4 }, 1.3);
    tl.set(svg.querySelectorAll(".light-halo"), { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%" }, 0);
    tl.set(svg.querySelectorAll(".light-core"), { autoAlpha: 0.25 }, 0);
    S.fade(".node", 0.6, { stagger: 0.07, x: 12, y: 0 });
    lit(1, 1.5, "22:00");
    S.step(2);

    /* ---- seg 1: bed → bathroom */
    let t = tl.duration();
    const startPath = { path: route, align: route, alignOrigin: [0.5, 0.5], start: 0, end: 0 };
    tl.set(dot, { motionPath: startPath }, 0);
    tl.set(dot, { autoAlpha: 0 }, 0);
    S.ticker((v) => (clock.textContent = hms(base + v)), 0, 5, 0.6, t);
    tl.fromTo(dot, { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, t + 0.55);
    flash(S, sensor("B"), t + 0.6);
    lit(2, t + 0.7, "02:13:05");
    stateAt("離床：夜燈沿路亮起", t + 0.7);
    lightsOn(S, svg, t + 0.8, 0.25);
    tl.to(route, { autoAlpha: 0.9, duration: 0.5 }, t + 0.8);
    t += 1.5;
    tl.fromTo(dot, { motionPath: startPath }, { motionPath: { path: route, align: route, alignOrigin: [0.5, 0.5], start: 0, end: 0.6 }, duration: 2.4, ease: "power1.inOut", immediateRender: false }, t);
    S.ticker((v) => (clock.textContent = hms(base + v)), 5, 41, 2.4, t);
    flash(S, sensor("P"), t + 1.0);
    t += 2.4;
    flash(S, sensor("D"), t);
    lit(3, t, "02:13:41");
    stateAt("進入浴室：計時中", t);
    tl.to(dot, { motionPath: { path: route, align: route, alignOrigin: [0.5, 0.5], start: 0.6, end: 1 }, duration: 1.0, ease: "power2.out" }, t + 0.1);
    S.step(2.5);

    /* ---- seg 2: the fall, and who gets asked first */
    t = tl.duration();
    S.ticker((v) => (clock.textContent = hms(base + v)), 41, 372, 1.5, t, "power2.in");
    stateAt("浴室停留中", t);
    t += 1.5;
    tl.to(core, { fill: VERM, duration: 0.15 }, t);
    tl.to(dot, { y: "+=6", duration: 0.25, ease: "bounce.out" }, t);
    tl.fromTo(ring, { scale: 1, autoAlpha: 1, stroke: VERM, transformOrigin: "50% 50%" }, { scale: 3.2, autoAlpha: 0, duration: 0.9, ease: "power2.out", repeat: 1 }, t);
    flash(S, sensor("R"), t, VERM);
    tl.to(svg.querySelector('.cov[data-code="R"]'), { autoAlpha: 0.9, fill: VERM, duration: 0.3 }, t);
    lit(4, t + 0.1, "02:19:12");
    stateAt("雷達：偵測到跌倒姿態", t + 0.1);
    t += 1.0;
    flash(S, sensor("S"), t);
    tl.fromTo(bubble, { autoAlpha: 0, y: 14, scale: 0.96, transformOrigin: "0% 100%" }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: E.enter }, t);
    lit(5, t, "02:19:13");
    stateAt("等待本人回應⋯", t + 0.4);
    t += 0.7;
    tl.fromTo(cd, { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, t);
    const cdNum = cd.querySelector(".num");
    tl.fromTo(arc, { strokeDashoffset: 0 }, { strokeDashoffset: C, duration: 2.8, ease: "none" }, t + 0.2);
    S.ticker((v) => (cdNum.textContent = String(Math.ceil(60 - v))), 0, 60, 2.8, t + 0.2);
    S.ticker((v) => (clock.textContent = hms(base + 373 + v)), 0, 60, 2.8, t + 0.2);
    t += 3.1;
    tl.to([bubble, cd], { autoAlpha: 0.0, duration: 0.4 }, t);
    tl.fromTo(notif, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: E.enter }, t);
    lit(6, t + 0.1, "02:20:13");
    stateAt("已通知家人", t + 0.1);
    t += 1.0;
    S.ticker((v) => (clock.textContent = hms(base + 433 + v)), 0, 45, 1.2, t);
    t += 1.2;
    tl.to(notif.querySelector(".a2"), { backgroundColor: AMBER, borderColor: AMBER, color: "#11161d", duration: 0.25 }, t);
    tl.fromTo(notif.querySelector(".a2"), { scale: 1 }, { scale: 0.95, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.inOut" }, t);
    stateAt("家人已確認：正在回撥", t);
    tl.to(node(7), { opacity: 0.55, duration: 0.4 }, t + 0.2);
    S.fade(node(7).querySelector(".skip"), t + 0.3, { y: 4 });
    tl.fromTo(chip, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: E.enter }, t + 0.5);
    S.count(chip.querySelector(".v").firstChild ? wrapCount(chip) : chip, t + 0.5, { d: 1.0 });
    lit(8, t + 1.2, "每週");
    stateAt("事件已記錄：納入每週趨勢", t + 1.3);

    // state text as a seek-safe function of time
    stateTexts.sort((a, b) => a[0] - b[0]);
    const states = [[0, "夜間模式：監測中"]].concat(stateTexts);
    const total = tl.duration();
    st.textContent = states[0][1];
    tl.to(
      {},
      {
        drive: {
          fn: (now) => {
            let txt = states[0][1];
            for (const [p, s] of states) if (now >= p) txt = s;
            if (st.textContent !== txt) st.textContent = txt;
          },
          from: 0,
          to: total,
        },
        duration: total,
        ease: "none",
      },
      0
    );
  };

  function wrapCount(chip) {
    const v = chip.querySelector(".v");
    const n = v.firstChild;
    const span = document.createElement("span");
    span.className = "cnt";
    span.dataset.to = n.textContent.trim();
    span.dataset.dec = "0";
    span.textContent = n.textContent.trim();
    v.replaceChild(span, n);
    return span;
  }

  /* ================================================================ S12 */
  B["s-flowB"] = (S) => {
    const { tl, E } = S;
    const svg = S.one(".plan svg");
    const dot = svg.querySelector(".presence-g");
    const core = dot.querySelector(".presence");
    const ring = dot.querySelector(".presence-ring");
    const sensor = (code, k = 0) => svg.querySelectorAll(`.sensor[data-code="${code}"]`)[k];
    const node = (n) => S.one(`.node[data-n="${n}"]`);
    const clock = S.one(".simclock");
    const st = S.one(".simstate .st");
    const base = 22 * 3600 + 40 * 60;
    const ppmEl = S.one(".readout .ppm");
    const fanS = S.one(".fan-s");
    const gasS = S.one(".gas-s");
    const perS = S.one(".per-s");

    /* ---- chart */
    const W = 840;
    const H = 290;
    const m = { l: 56, r: 150, t: 14, b: 36 };
    const pw = W - m.l - m.r;
    const ph = H - m.t - m.b;
    const T = 480;
    const YMAX = 120;
    const X = (s) => m.l + (s / T) * pw;
    const Y = (v) => m.t + ph - (v / YMAX) * ph;
    const data = [
      [0, 3], [60, 4], [120, 6], [180, 8], [210, 9.2], [240, 11], [270, 14], [300, 18], [330, 26], [350, 36],
      [370, 50], [380, 57], [390, 61], [400, 62.5], [410, 63], [420, 62], [440, 56], [460, 44], [480, 32],
    ];
    const ppm = (s) => {
      for (let i = 1; i < data.length; i++) {
        if (s <= data[i][0]) {
          const [a, va] = data[i - 1];
          const [b, vb] = data[i];
          return va + ((s - a) / (b - a)) * (vb - va);
        }
      }
      return data[data.length - 1][1];
    };
    // dense, lightly smoothed path
    let d = "";
    for (let s = 0; s <= T; s += 4) d += (s ? " L" : "M") + X(s).toFixed(1) + " " + Y(ppm(s)).toFixed(1);
    const uid = "cc" + Math.random().toString(36).slice(2, 7);
    const thr = [
      [9, "t1", "9 ppm ・ L1 排風"],
      [50, "t2", "50 ppm ・ L2 警報"],
      [100, "t3", "100 ppm ・ L3 求救"],
    ];
    const xt = [0, 120, 240, 360, 480];
    const chartBox = S.one(".cochart");
    chartBox.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <defs><clipPath id="${uid}"><rect class="clipr" x="${m.l - 4}" y="0" width="0" height="${H}"/></clipPath></defs>
      <line class="axis" x1="${m.l}" y1="${m.t + ph}" x2="${m.l + pw}" y2="${m.t + ph}"/>
      <line class="axis" x1="${m.l}" y1="${m.t}" x2="${m.l}" y2="${m.t + ph}"/>
      ${[30, 60, 90, 120].map((v) => `<line class="grid" x1="${m.l}" y1="${Y(v)}" x2="${m.l + pw}" y2="${Y(v)}"/><text class="ax-t" x="${m.l - 10}" y="${Y(v) + 4}" text-anchor="end">${v}</text>`).join("")}
      <text class="ax-t" x="${m.l - 10}" y="${Y(0) + 4}" text-anchor="end">0</text>
      ${thr.map(([v, c, l]) => `<line class="thr ${c}" x1="${m.l}" y1="${Y(v)}" x2="${m.l + pw}" y2="${Y(v)}"/><text class="thl" x="${m.l + pw + 12}" y="${Y(v) + 5}">${l}</text>`).join("")}
      ${xt.map((s) => `<text class="ax-t" x="${X(s)}" y="${H - 10}" text-anchor="middle">${hms(base + s).slice(0, 5)}</text>`).join("")}
      <text class="ax-t" x="${m.l}" y="${m.t - 2}" dy="-4">ppm</text>
      <path class="curve" d="${d}" clip-path="url(#${uid})"/>
      <circle class="head" r="6" cx="${X(0)}" cy="${Y(ppm(0))}"/>
      <g class="marks">
        <g class="mk" data-k="1"><circle class="mark" r="7" cx="${X(210)}" cy="${Y(9.2)}" stroke="${AMBER}"/><text class="mark-t" x="${X(210)}" y="${Y(9.2) - 16}" text-anchor="middle" fill="${AMBER}">L1</text></g>
        <g class="mk" data-k="2"><circle class="mark" r="7" cx="${X(370)}" cy="${Y(50)}" stroke="${VERM}"/><text class="mark-t" x="${X(370) - 12}" y="${Y(50) - 14}" text-anchor="end" fill="#ec6a52">L2</text></g>
        <g class="mk" data-k="3"><circle class="mark" r="7" cx="${X(400)}" cy="${Y(62.5)}" stroke="${VERM}"/><text class="mark-t" x="${X(400)}" y="${Y(62.5) - 16}" text-anchor="middle" fill="#ec6a52">L3 無反應</text></g>
      </g>
    </svg>`;
    const clipR = chartBox.querySelector(".clipr");
    const tintBath = svg.querySelector(".co-tint.bath");
    const tintBalc = svg.querySelector(".co-tint.balc");
    const head = chartBox.querySelector(".head");
    const marks = chartBox.querySelectorAll(".mk");

    // one proxy drives clock, curve, head and readout — always in sync
    const sim = { s: 0 };
    const render = () => {
      const s = sim.s;
      clock.textContent = hms(base + s);
      clipR.setAttribute("width", (X(s) - m.l + 4).toFixed(1));
      head.setAttribute("cx", X(s).toFixed(1));
      head.setAttribute("cy", Y(ppm(s)).toFixed(1));
      ppmEl.textContent = Math.round(ppm(s));
      const v = ppm(s);
      tintBath.style.opacity = Math.min(0.26, v / 240).toFixed(3);
      tintBalc.style.opacity = Math.min(0.12, v / 400 + (s > 0 && s < 440 ? 0.03 : 0)).toFixed(3);
      head.style.fill = v >= 50 ? VERM : v >= 9 ? AMBER : "";
      ppmEl.parentNode.style.color = v >= 50 ? "#ec6a52" : v >= 9 ? AMBER : "";
      fanS.textContent = s >= 210 ? "運轉中" : "關";
      gasS.textContent = s >= 370 ? "已遮斷" : "供氣中";
      perS.textContent = s >= 440 ? "室友已趕到" : s >= 400 ? "無動作 30 秒" : s >= 0.5 ? "洗澡中・有動作" : "—";
      perS.style.color = s >= 400 && s < 440 ? "#ec6a52" : "";
      const states = [
        [0, "待機：監測中"],
        [1, "濕度驟升：判定洗澡中"],
        [210, "L1：已開排風扇、提醒開窗"],
        [370, "L2：警報中，瓦斯已遮斷"],
        [400, "L3：本人無反應，通知守護圈"],
        [440, "室友已趕到，開窗通風"],
        [479, "事件已記錄：列入週報"],
      ];
      let txt = states[0][1];
      for (const [p, t] of states) if (s >= p) txt = t;
      if (st.textContent !== txt) st.textContent = txt;
    };
    render();
    const run = (from, to, dur, pos, ease = "none") =>
      tl.to({}, { drive: { fn: (v) => { sim.s = v; render(); }, from, to }, duration: dur, ease }, pos);

    const lit = (n, pos, ts) => {
      const nd = node(n);
      tl.fromTo(nd.querySelector(".hl"), { scaleY: 0 }, { scaleY: 1, duration: 0.45, ease: E.enter }, pos);
      tl.to(nd.querySelector(".badge"), { borderColor: nd.classList.contains("alertnode") ? VERM : AMBER, color: "#f2ede4", duration: 0.3 }, pos);
      if (ts) {
        const tsEl = nd.querySelector(".ts");
        tsEl.textContent = ts;
        tl.fromTo(tsEl, { autoAlpha: 0, x: 8 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: E.soft }, pos + 0.1);
      }
    };

    // overlays
    const pBath = planPt(svg, 470, 30);
    const bubble = S.one(".bubble");
    bubble.style.left = `${pBath.x - 30}px`;
    bubble.style.top = `${pBath.y - 112}px`;
    const notif = S.one(".notif");
    const chart = DECK.rectIn(chartBox);
    notif.style.left = `${chart.x + 300}px`;
    notif.style.top = `${chart.y - 250}px`;
    const chip = S.one(".result-chip");
    chip.style.left = `${chart.x + 84}px`;
    chip.style.top = `${chart.y + 76}px`;

    /* ---- seg 0 */
    S.lines(".headline .line", 0);
    S.fade(".simclock-row", 0.35, { y: 10 });
    drawPlan(S, svg, 0.4, 0.7);
    tl.fromTo(S.q(svg.querySelectorAll(".sensor, .cov")), { autoAlpha: 0 }, { autoAlpha: 0.4, duration: 0.6 }, 1.2);
    S.fade(".readout", 0.9, { x: 10, y: 0 });
    S.fade(".cochart", 1.0, { y: 12 });
    S.fade(".node", 0.6, { stagger: 0.08, x: 12, y: 0 });
    tl.set(dot, { autoAlpha: 0 }, 0);
    S.step(2);

    /* ---- seg 1: shower → L1 */
    let t = tl.duration();
    S.pop(dot, t, { from: 0 });
    flash(S, sensor("H"), t + 0.1);
    lit(1, t + 0.2, "22:40:00");
    tl.to(svg.querySelectorAll(".heater path, .heater rect"), { stroke: VERM, duration: 0.5 }, t + 0.3);
    coDrift(S, svg, t + 0.5, 5.5);
    run(0, 210, 3.6, t + 0.3, "power1.in");
    t += 3.9;
    flash(S, sensor("C", 0), t);
    flash(S, sensor("F"), t + 0.15);
    lit(2, t + 0.1, "22:43:30");
    S.pop(marks[0], t + 0.05, { from: 0 });
    tl.to(svg.querySelector(".fan .blades"), { rotation: 360 * 9, svgOrigin: "0 0", duration: 9, ease: "none" }, t + 0.1);
    S.step(2.5);

    /* ---- seg 2: L2 → L3 */
    t = tl.duration();
    run(210, 370, 2.6, t, "power1.in");
    t += 2.6;
    lit(3, t, "22:46:10");
    S.pop(marks[1], t, { from: 0 });
    flash(S, sensor("V"), t, VERM);
    flash(S, sensor("S"), t + 0.1, VERM);
    tl.to(svg.querySelectorAll(".heater path, .heater rect"), { stroke: "#808a96", duration: 0.5 }, t + 0.2);
    tl.fromTo(bubble, { autoAlpha: 0, y: 14, scale: 0.96, transformOrigin: "0% 100%" }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: E.enter }, t + 0.1);
    run(370, 400, 1.6, t + 0.4);
    t += 2.0;
    tl.to(core, { fill: VERM, duration: 0.3 }, t);
    tl.fromTo(ring, { scale: 1, autoAlpha: 1, stroke: VERM, transformOrigin: "50% 50%" }, { scale: 3, autoAlpha: 0, duration: 0.9, ease: "power2.out", repeat: 1 }, t);
    flash(S, sensor("R"), t, VERM);
    lit(4, t + 0.1, "22:46:40");
    S.pop(marks[2], t, { from: 0 });
    tl.to(bubble, { autoAlpha: 0, duration: 0.4 }, t + 0.3);
    tl.fromTo(notif, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: E.enter }, t + 0.3);
    S.step(3);

    /* ---- seg 3: a friend arrives */
    t = tl.duration();
    tl.to(notif.querySelector(".a2"), { backgroundColor: AMBER, borderColor: AMBER, color: "#11161d", duration: 0.25 }, t);
    tl.fromTo(notif.querySelector(".a2"), { scale: 1 }, { scale: 0.95, duration: 0.12, yoyo: true, repeat: 1 }, t);
    run(400, 480, 2.8, t + 0.2, "power1.out");
    // the friend: a second amber presence entering through the bathroom door
    const friend = dot.cloneNode(true);
    friend.classList.add("friend");
    friend.removeAttribute("transform");
    dot.parentNode.appendChild(friend);
    const fCore = friend.querySelector(".presence");
    fCore.style.fill = AMBER;
    tl.set(friend, { x: 426, y: 186, autoAlpha: 0 }, 0);
    tl.to(friend, { autoAlpha: 1, duration: 0.3 }, t + 0.6);
    tl.to(friend, { x: 452, y: 186, duration: 0.5, ease: "power2.out" }, t + 0.6);
    tl.to(friend, { x: 540, y: 100, duration: 0.8, ease: "power2.inOut" }, t + 1.1);
    tl.to(notif, { autoAlpha: 0, y: -10, duration: 0.5, ease: E.exit }, t + 1.4);
    t += 3.1;
    tl.fromTo(chip, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: E.enter }, t);
    lit(5, t + 0.6, "週報");
  };

  /* ================================================================ S13 */
  B["s-privacy"] = (S) => {
    const { tl, E } = S;
    S.lines(".headline .line", 0);
    S.q(".stair").forEach((s, i) => {
      const t = 0.6 + i * 0.4;
      tl.fromTo(s, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: E.move }, t);
      const r = s.querySelector(".riser");
      if (r) tl.fromTo(r, { scaleY: 0 }, { scaleY: 1, duration: 0.4, ease: E.move, transformOrigin: "50% 100%" }, t - 0.15);
      S.fade(S.q(s.querySelectorAll(".lv, .who, .what, .when")), t + 0.25, { stagger: 0.06, y: 8 });
    });
    S.step(3.5);
    const t0 = tl.duration();
    S.fade(".side h3", t0, { stagger: 0.5, y: 8 });
    S.fade(".side li", t0 + 0.2, { stagger: 0.1, x: -10, y: 0 });
  };

  /* ================================================================ S14 */
  B["s-results"] = (S) => {
    const { tl, E } = S;
    S.lines(".headline .line", 0);
    S.fade(".badge-goal", 0.5, { y: 6 });
    S.fade(".hero .row .k", 0.6, { stagger: 0.15 });
    S.fade(".hero .axisrow", 0.7, { y: 6 });
    tl.fromTo(S.one(".hero .row.now .bar"), { scaleX: 0 }, { scaleX: 1, duration: 2.2, ease: "power1.inOut" }, 0.9);
    S.fade(".hero .row.now .v", 2.9, { x: -10, y: 0 });
    tl.fromTo(S.one(".hero .row.goal .bar"), { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: E.enter }, 3.3);
    S.fade(".hero .row.goal .v", 3.45, { x: -10, y: 0 });
    S.step(3);
    const t0 = tl.duration();
    S.fade(".tt", t0, { stagger: 0.12, y: 12 });
  };

  /* ================================================================ S15 */
  B["s-benefits"] = (S) => {
    const { tl } = S;
    S.lines(".headline .line", 0);
    S.q(".bc").forEach((c, i) => {
      const t = 0.6 + i * 0.28;
      tl.fromTo(c, { borderTopColor: "rgba(17,22,29,0)" }, { borderTopColor: "rgba(17,22,29,1)", duration: 0.4 }, t);
      S.fade(c.querySelector(".who"), t, { y: 14 });
      S.fade(S.q(c.querySelectorAll("li")), t + 0.2, { stagger: 0.1, y: 10 });
    });
    S.step(3);
    S.fade(".themes > *", tl.duration(), { stagger: 0.12, y: 10 });
  };

  /* ================================================================ S16 */
  B["s-limits"] = (S) => {
    const { tl, E } = S;
    S.lines(".headline .line", 0);
    S.fade(".lr", 0.6, { stagger: 0.12, y: 12 });
    S.step(3);
    const t0 = tl.duration();
    S.fade(".road .rh", t0, { y: 6 });
    const spine = S.one(".road .spine");
    const ms = S.q(".ms");
    const a = DECK.rectIn(ms[0].querySelector(".dot"));
    const b = DECK.rectIn(ms[ms.length - 1].querySelector(".dot"));
    const road = DECK.rectIn(S.one(".road"));
    spine.style.top = `${a.y - road.y + 7}px`;
    spine.style.height = `${b.y - a.y}px`;
    tl.fromTo(spine, { scaleY: 0 }, { scaleY: 1, duration: 1.4, ease: E.move }, t0 + 0.1);
    ms.forEach((m, i) => {
      S.pop(m.querySelector(".dot"), t0 + 0.1 + i * 0.35);
      S.fade(S.q(m.querySelectorAll(".w, .t, .d")), t0 + 0.15 + i * 0.35, { stagger: 0.06, x: 10, y: 0 });
    });
  };

  /* ================================================================ S17 */
  B["s-close"] = (S) => {
    const { tl } = S;
    tl.fromTo(S.one(".cdot"), { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.7, ease: "back.out(2.2)" }, 0.2);
    tl.fromTo(S.one(".chalo"), { scale: 0.1, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 2.0, ease: "power2.out" }, 0.4);
    S.lines(".line1 .line", 0.9, { d: 1.2 });
    S.lines(".line2 .line", 1.7, { stagger: 0.2 });
    S.fade(".sig .n", 2.6, { y: 12 });
    S.fade(".sig .t", 2.9, { y: 8 });
  };

  /* ================================================================ S18 */
  B["s-refs"] = (S) => {
    S.lines(".headline .line", 0);
    S.fade(".ref", 0.4, { stagger: 0.04, y: 8 });
    S.fade(".note", 1.2, { y: 6 });
  };
})();
