/* ==========================================================================
   Deck engine
   - Each slide owns one GSAP timeline. Steps are `addPause` points (live mode)
     or fixed holds (render mode), so any moment can be reproduced exactly.
   - Modes:  live (default) · ?render (one master timeline for video export)
             · ?print (static, 1:1 stage for PDF export)
   ========================================================================== */
(function () {
  "use strict";

  gsap.registerPlugin(MotionPathPlugin);

  /* "drive": tween a number and hand it to a function on every render.
     Unlike onUpdate callbacks, plugin renders also run while seeking with
     suppressed events — so text, clocks and charts stay correct when the deck
     jumps to any step, when PDF pages are captured and when video frames are
     rendered. Usage: tl.to({}, { drive: { fn, from, to }, duration }) */
  gsap.registerPlugin({
    name: "drive",
    rawVars: 1, // keep `fn` as a function (GSAP would otherwise call function-based values)
    init(target, v) {
      this.fn = v.fn;
      this.a = v.from ?? 0;
      this.b = v.to ?? 1;
    },
    render(ratio, data) {
      data.fn(data.a + (data.b - data.a) * ratio);
    },
  });

  const params = new URLSearchParams(location.search);
  const MODE = params.has("render") ? "render" : params.has("print") ? "print" : "live";

  /* The whole piece uses four curves (see docs/03-production-plan.md §7). */
  const E = {
    enter: "expo.out",
    soft: "power3.out",
    move: "power2.inOut",
    exit: "power2.in",
    settle: "back.out(1.4)",
  };

  const THEMES = {
    night: { bg: "#11161d", fg: "#f2ede4", fg2: "#8f99a5", line: "rgba(242,237,228,0.16)" },
    day: { bg: "#f2ede4", fg: "#11161d", fg2: "#666e79", line: "rgba(17,22,29,0.16)" },
  };

  // a deck can supply its own chapter list (window.DECK_CHAPTERS) before this script
  const CHAPTERS = window.DECK_CHAPTERS || [
    { n: "00", label: "封面" },
    { n: "01", label: "主題：關懷對象、時間、場域" },
    { n: "02", label: "使用的感測系統與元件" },
    { n: "03", label: "檢測觀察過程的規劃" },
    { n: "04", label: "檢測觀察項目" },
    { n: "05", label: "感測器訊號的收集" },
    { n: "06", label: "資料整理分析" },
    { n: "07", label: "討論" },
    { n: "08", label: "參考資料" },
  ];

  const D = (window.DECK = { builders: {}, E, MODE, slides: [], ready: false });

  let viewport, stage, bgwipe, playhead, hud;
  let cur = 0;
  let seg = 0;
  let busy = null;
  let auto = false;
  let idle = 0;
  let master = null;

  /* ---------------------------------------------------------------- utils */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const pad2 = (n) => String(n).padStart(2, "0");

  function fit() {
    if (MODE === "print") return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const s = Math.min(vw / 1920, vh / 1080);
    const x = (vw - 1920 * s) / 2;
    const y = (vh - 1080 * s) / 2;
    stage.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
    D.scale = s;
  }

  /* Stage-space rectangle of an element (independent of current scale). */
  function rectIn(el) {
    const r = el.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    const s = sr.width / 1920;
    return { x: (r.left - sr.left) / s, y: (r.top - sr.top) / s, w: r.width / s, h: r.height / s };
  }
  D.rectIn = rectIn;

  /* -------------------------------------------------------------- helpers */
  function helpers(tl, el, slide) {
    const q = (sel) => (typeof sel === "string" ? $$(sel, el) : sel instanceof Element ? [sel] : Array.from(sel));
    const one = (sel) => (typeof sel === "string" ? $(sel, el) : sel);
    const S = {
      E,
      q,
      one,
      tl,
      el,
      mode: MODE,
      /** End the current segment. Live: pause here. Render: hold for `hold` s. */
      step(hold = 2.5) {
        const t = tl.duration();
        tl.addPause(t);
        slide.steps.push(t);
        slide.holds.push(hold);
      },
      /** Masked line reveal — editorial headline entrance. */
      lines(sel, pos, o = {}) {
        const els = q(sel);
        if (!els.length) return;
        tl.fromTo(els, { yPercent: 112 }, { yPercent: 0, duration: o.d ?? 1.0, ease: o.ease ?? E.enter, stagger: o.stagger ?? 0.09 }, pos);
      },
      /** Opacity + small rise. Used only for supporting text. */
      fade(sel, pos, o = {}) {
        const els = q(sel);
        if (!els.length) return;
        tl.fromTo(
          els,
          { autoAlpha: 0, y: o.y ?? 16, x: o.x ?? 0 },
          { autoAlpha: 1, y: 0, x: 0, duration: o.d ?? 0.7, ease: o.ease ?? E.soft, stagger: o.stagger ?? 0.06 },
          pos
        );
      },
      /** Plain opacity. */
      show(sel, pos, o = {}) {
        const els = q(sel);
        if (!els.length) return;
        tl.fromTo(els, { autoAlpha: 0 }, { autoAlpha: o.to ?? 1, duration: o.d ?? 0.5, ease: o.ease ?? "none", stagger: o.stagger ?? 0 }, pos);
      },
      /** SVG stroke draw-on. */
      draw(sel, pos, o = {}) {
        const els = q(sel).filter((e) => typeof e.getTotalLength === "function");
        if (!els.length) return;
        els.forEach((e) => {
          const L = Math.ceil(e.getTotalLength()) + 1;
          e.style.strokeDasharray = `${L} ${L}`;
          e.__len = L;
        });
        tl.fromTo(
          els,
          { strokeDashoffset: (i) => els[i].__len },
          { strokeDashoffset: 0, duration: o.d ?? 1.2, ease: o.ease ?? E.move, stagger: o.stagger ?? 0.06 },
          pos
        );
      },
      /** Small elements landing with a controlled overshoot. */
      pop(sel, pos, o = {}) {
        const els = q(sel);
        if (!els.length) return;
        tl.fromTo(
          els,
          { autoAlpha: 0, scale: o.from ?? 0.4, transformOrigin: "50% 50%" },
          { autoAlpha: 1, scale: 1, duration: o.d ?? 0.55, ease: o.ease ?? E.settle, stagger: o.stagger ?? 0.07 },
          pos
        );
      },
      /** Horizontal rule growing from the left. */
      rule(sel, pos, o = {}) {
        const els = q(sel);
        if (!els.length) return;
        tl.fromTo(els, { scaleX: 0, transformOrigin: o.origin ?? "0% 50%" }, { scaleX: 1, duration: o.d ?? 0.9, ease: o.ease ?? E.move, stagger: o.stagger ?? 0.08 }, pos);
      },
      /** Number count-up; reads data-to / data-dec from the element. */
      count(sel, pos, o = {}) {
        q(sel).forEach((e, i) => {
          const to = parseFloat(e.dataset.to);
          const dec = parseInt(e.dataset.dec || "0", 10);
          const fn = (v) => (e.textContent = v.toFixed(dec));
          fn(0);
          tl.to({}, { drive: { fn, from: 0, to }, duration: o.d ?? 1.3, ease: o.ease ?? "power2.out" }, typeof pos === "number" ? pos + i * (o.stagger ?? 0) : pos);
        });
      },
      /** Drive any function from a tweened number (seek-safe). */
      ticker(fn, from, to, dur, pos, ease = "none") {
        fn(from);
        tl.to({}, { drive: { fn, from, to }, duration: dur, ease }, pos);
      },
    };
    return S;
  }

  /* ---------------------------------------------------------------- rollers */
  /* Odometer-style digits: "02:13" → strips of 0-9 that roll into place. */
  function makeRoller(el, text) {
    el.innerHTML = "";
    const strips = [];
    for (const ch of text) {
      if (/\d/.test(ch)) {
        const r = document.createElement("span");
        r.className = "roller";
        const s = document.createElement("span");
        s.className = "strip";
        for (let d = 0; d < 20; d++) {
          const c = document.createElement("span");
          c.textContent = d % 10;
          s.appendChild(c);
        }
        r.appendChild(s);
        el.appendChild(r);
        strips.push({ s, d: +ch });
      } else {
        const c = document.createElement("span");
        c.className = "roller-colon";
        c.textContent = ch;
        el.appendChild(c);
      }
    }
    return strips;
  }
  D.makeRoller = makeRoller;

  /* -------------------------------------------------------------- HUD */
  function buildHud() {
    const ch = $(".hud-chapter", hud);
    ch.innerHTML = CHAPTERS.map((c) => `<div class="hud-row" style="position:absolute;left:0;top:0"><span class="num">${c.n}</span><span class="label">${c.label}</span></div>`).join("");
    const where = $(".hud-where", hud);
    where.innerHTML = D.slides
      .map((s) =>
        s.time
          ? `<div class="hud-row" style="position:absolute;right:0;top:0"><span class="k">時間</span><span class="t">${s.time}</span><span class="sep"></span><span class="k">場域</span><span class="p">${s.place}</span></div>`
          : `<div class="hud-row" style="position:absolute;right:0;top:0"></div>`
      )
      .join("");
    const prog = $(".hud-progress", hud);
    const n = D.slides.length;
    // a tick at the first slide of each chapter (except the cover)
    CHAPTERS.forEach((c, ci) => {
      if (ci === 0) return;
      const first = D.slides.findIndex((s) => s.chapter === ci);
      if (first < 0) return;
      const t = document.createElement("div");
      t.className = "tick";
      t.style.left = `${((first - 1) / (n - 2)) * 100}%`;
      t.innerHTML = `<span>${c.n}</span>`;
      prog.appendChild(t);
    });
    $(".pt", hud).textContent = pad2(n - 1);
    gsap.set($$(".hud-chapter .hud-row", hud), { yPercent: 120 });
    gsap.set($$(".hud-where .hud-row", hud), { yPercent: 120 });
  }

  function progressOf(i) {
    const n = D.slides.length;
    return i <= 0 ? 0 : (i - 1) / (n - 2);
  }

  /** Set HUD for slide i instantly. */
  function hudSet(i) {
    const s = D.slides[i];
    gsap.set($$(".hud-chapter .hud-row", hud), { yPercent: 120 });
    gsap.set($$(".hud-chapter .hud-row", hud)[s.chapter], { yPercent: 0 });
    gsap.set($$(".hud-where .hud-row", hud), { yPercent: 120 });
    gsap.set($$(".hud-where .hud-row", hud)[i], { yPercent: 0 });
    gsap.set($(".hud-progress .fill", hud), { scaleX: progressOf(i) });
    $(".pg", hud).textContent = pad2(i);
    gsap.set(hud, { autoAlpha: i === 0 ? 0 : 1 });
    const th = THEMES[s.theme];
    gsap.set(viewport, { "--stage-bg": th.bg, "--hud-fg": th.fg, "--hud-fg2": th.fg2, "--hud-line": th.line });
  }

  /** Add HUD tweens for a change A → B to timeline t. */
  function hudTo(t, a, b, pos) {
    const A = D.slides[a];
    const B = D.slides[b];
    const chRows = $$(".hud-chapter .hud-row", hud);
    const whRows = $$(".hud-where .hud-row", hud);
    if (A.chapter !== B.chapter) {
      t.to(chRows[A.chapter], { yPercent: -120, duration: 0.45, ease: E.exit }, pos);
      t.fromTo(chRows[B.chapter], { yPercent: 120 }, { yPercent: 0, duration: 0.8, ease: E.enter, immediateRender: false }, pos + 0.35);
    }
    if ((A.time || "") + (A.place || "") !== (B.time || "") + (B.place || "")) {
      t.to(whRows[a], { yPercent: -120, duration: 0.45, ease: E.exit }, pos);
      t.fromTo(whRows[b], { yPercent: 120 }, { yPercent: 0, duration: 0.8, ease: E.enter, immediateRender: false }, pos + 0.4);
    } else {
      t.set(whRows[a], { yPercent: 120 }, pos + 0.4);
      t.set(whRows[b], { yPercent: 0 }, pos + 0.4);
    }
    t.to($(".hud-progress .fill", hud), { scaleX: progressOf(b), duration: 1.1, ease: E.move }, pos);
    const pg = $(".pg", hud);
    t.to({}, { drive: { fn: (v) => (pg.textContent = pad2(v < 0.5 ? a : b)), from: 0, to: 1 }, duration: 0.05 }, pos + 0.3);
    if (a === 0) t.fromTo(hud, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: "none", immediateRender: false }, pos + 0.3);
    if (b === 0) t.to(hud, { autoAlpha: 0, duration: 0.3 }, pos);
  }

  /* ---------------------------------------------------------- transitions */
  function transitionType(A, B) {
    if (B.el.dataset.transition) return B.el.dataset.transition;
    return A.theme !== B.theme ? "wipe" : "shift";
  }

  /** Adds A → B transition to timeline t. Returns the time B's timeline starts. */
  function buildTransition(t, a, b) {
    const A = D.slides[a];
    const B = D.slides[b];
    const type = transitionType(A, B);
    const thB = THEMES[B.theme];
    hudTo(t, a, b, 0.05);

    if (type === "cut") {
      t.set(A.el, { autoAlpha: 0 }, 0);
      t.set(B.el, { autoAlpha: 1 }, 0);
      return 0;
    }
    if (type === "wipe") {
      t.to(A.inner, { autoAlpha: 0, y: -12, duration: 0.34, ease: E.exit }, 0);
      t.set(bgwipe, { autoAlpha: 1, backgroundColor: thB.bg, clipPath: "inset(0% 100% 0% 0%)" }, 0.08);
      t.set(playhead, { autoAlpha: 1, x: -2 }, 0.08);
      t.to(bgwipe, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.78, ease: E.move }, 0.08);
      t.to(playhead, { x: 1920, duration: 0.78, ease: E.move }, 0.08);
      t.to(viewport, { "--hud-fg": thB.fg, "--hud-fg2": thB.fg2, "--hud-line": thB.line, duration: 0.78, ease: E.move }, 0.08);
      t.set(viewport, { "--stage-bg": thB.bg }, 0.86);
      t.set([bgwipe, playhead], { autoAlpha: 0 }, 0.86);
      t.set(A.el, { autoAlpha: 0 }, 0.7);
      t.set(B.el, { autoAlpha: 1 }, 0.7);
      return 0.7;
    }
    // shift: quiet exit, same ground
    t.to(A.inner, { autoAlpha: 0, y: -12, duration: 0.3, ease: E.exit }, 0);
    t.set(A.el, { autoAlpha: 0 }, 0.3);
    t.set(B.el, { autoAlpha: 1 }, 0.3);
    return 0.3;
  }

  /* ------------------------------------------------------------- building */
  function collect() {
    D.slides = $$(".slide", stage).map((el, i) => ({
      i,
      el,
      id: el.id,
      inner: $(".slide-inner", el),
      theme: el.dataset.theme,
      chapter: +el.dataset.chapter,
      time: el.dataset.time || "",
      place: el.dataset.place || "",
      hold: parseFloat(el.dataset.hold || "3"),
      notes: ($(".notes", el) || {}).textContent || "",
      steps: [],
      holds: [],
      tl: null,
    }));
  }

  function mountPlans() {
    $$(".plan[data-plan]", stage).forEach((box) => {
      const opts = box.dataset.opts ? JSON.parse(box.dataset.opts) : {};
      box.innerHTML = box.dataset.plan === "A" ? PLANS.planA(opts) : PLANS.planB(opts);
    });
  }

  function applyConfig() {
    const cfg = Object.assign({}, window.DECK_CONFIG || {});
    if (params.get("name")) cfg.presenter = params.get("name");
    if (params.get("id")) cfg.studentId = params.get("id");
    const who = [cfg.studentId ? `學號　${cfg.studentId}` : "", cfg.presenter ? `姓名　${cfg.presenter}` : ""].filter(Boolean).join("　　");
    $$("[data-cfg]").forEach((n) => {
      const k = n.dataset.cfg;
      if (k === "who") n.textContent = who;
      else if (cfg[k]) n.textContent = cfg[k];
    });
  }

  function buildSlides() {
    D.slides.forEach((s) => {
      s.tl = gsap.timeline({ paused: true });
      const b = D.builders[s.id];
      if (b) b(helpers(s.tl, s.el, s), s);
      if (s.tl.duration() === 0) s.tl.to({}, { duration: 0.01 });
    });
    computeHolds();
  }

  /* Narration-paced holds: each slide lasts about as long as reading its
     speaker notes aloud (≈ 4.6 Chinese characters per second), so autoplay and
     the exported video stay in step with the script. Extra time is spread over
     the slide's holds in proportion to their planned length. */
  const CPS = 4.6;
  function computeHolds() {
    D.slides.forEach((s) => {
      const base = s.holds.concat([s.hold]);
      const sumBase = base.reduce((a, b) => a + b, 0);
      const chars = s.notes.replace(/[\s（）()「」]/g, "").length;
      const target = chars / CPS;
      const extra = Math.max(0, target - (s.tl.duration() + sumBase));
      s.playHolds = base.map((h) => h + (extra * h) / sumBase);
      s.playDuration = s.tl.duration() + s.playHolds.reduce((a, b) => a + b, 0);
    });
  }

  function segEnd(i, k) {
    const s = D.slides[i];
    return k < s.steps.length ? s.steps[k] : s.tl.duration();
  }

  /* ---------------------------------------------------------- navigation */
  function showOnly(i) {
    D.slides.forEach((s, j) => {
      gsap.set(s.el, { autoAlpha: j === i ? 1 : 0 });
      gsap.set(s.inner, { clearProps: "opacity,visibility,transform" });
    });
  }

  function finishBusy() {
    if (busy) {
      const b = busy;
      busy = null;
      b.progress(1);
    }
  }

  function enter(i, how = "animate") {
    finishBusy();
    const from = cur;
    const B = D.slides[i];
    D.slides.forEach((s) => s !== D.slides[from] && s !== B && s.tl.pause());
    if (how === "animate" && i !== from) {
      gsap.set(B.inner, { clearProps: "opacity,visibility,transform" });
      B.tl.pause(0);
      const t = gsap.timeline({ onComplete: () => (busy = busy === t ? null : busy) });
      const at = buildTransition(t, from, i);
      t.call(() => B.tl.play(0), null, at);
      busy = t;
      D.slides[from].tl.pause();
    } else {
      showOnly(i);
      hudSet(i);
      if (how === "end") B.tl.pause(B.tl.duration());
      else if (how === "start") B.tl.pause(0);
      else B.tl.play(0);
    }
    cur = i;
    seg = how === "end" ? B.steps.length : 0;
    idle = 0;
    updateNotes();
    if (MODE === "live") history.replaceState(null, "", `#${i}`);
  }

  function next() {
    if (busy) {
      finishBusy();
      return;
    }
    const s = D.slides[cur];
    if (s.tl.isActive()) {
      s.tl.pause(segEnd(cur, seg));
      return;
    }
    if (seg < s.steps.length) {
      seg++;
      s.tl.play();
      return;
    }
    if (cur < D.slides.length - 1) enter(cur + 1, "animate");
  }

  function prev() {
    if (busy) finishBusy();
    const s = D.slides[cur];
    if (seg > 0) {
      seg--;
      s.tl.pause(segEnd(cur, seg));
      return;
    }
    if (cur > 0) enter(cur - 1, "end");
  }

  function updateNotes() {
    const p = $("#notes-panel");
    if (!p) return;
    const s = D.slides[cur];
    $(".nh", p).textContent = `${pad2(cur)} / ${pad2(D.slides.length - 1)} ・ ${CHAPTERS[s.chapter].label}`;
    $(".nb", p).textContent = s.notes.trim();
  }

  function bindInput() {
    window.addEventListener("keydown", (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"].includes(k)) {
        e.preventDefault();
        auto = false;
        next();
      } else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(k)) {
        e.preventDefault();
        auto = false;
        prev();
      } else if (k === "Home") enter(0, "animate");
      else if (k === "End") enter(D.slides.length - 1, "end");
      else if (k === "f" || k === "F") {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
      } else if (k === "n" || k === "N") document.body.classList.toggle("show-notes");
      else if (k === "a" || k === "A") {
        auto = !auto;
        idle = 0;
      }
      poke();
    });
    stage.addEventListener("click", (e) => {
      auto = false;
      if (e.clientX < window.innerWidth * 0.2) prev();
      else next();
      poke();
    });
    let tx = null;
    window.addEventListener("touchstart", (e) => (tx = e.touches[0].clientX), { passive: true });
    window.addEventListener("touchend", (e) => {
      if (tx === null) return;
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
      tx = null;
    });
    window.addEventListener("mousemove", poke);
    window.addEventListener("resize", fit);
  }

  let pokeTimer = null;
  function poke() {
    document.body.classList.remove("idle");
    clearTimeout(pokeTimer);
    pokeTimer = setTimeout(() => document.body.classList.add("idle"), 2600);
  }

  /* Autoplay in live mode: after each segment, hold for its planned time. */
  function autoTick(time, dt) {
    if (!auto || busy) return;
    const s = D.slides[cur];
    if (s.tl.isActive()) {
      idle = 0;
      return;
    }
    idle += dt / 1000;
    const hold = s.playHolds[seg];
    if (idle >= hold) {
      idle = 0;
      if (cur === D.slides.length - 1 && seg >= s.steps.length) auto = false;
      else next();
    }
  }

  /* -------------------------------------------------------------- render */
  /* One master timeline for video export: every slide's segments are
     scrubbed in order (tweenFromTo), separated by the narration-paced holds. */
  function addSlideSegments(s, pos) {
    const bounds = [0].concat(s.steps, [s.tl.duration()]);
    for (let k = 0; k < bounds.length - 1; k++) {
      const a = bounds[k];
      const b = bounds[k + 1];
      if (b > a) master.add(s.tl.tweenFromTo(a, b, { ease: "none", immediateRender: false }), pos);
      pos += b - a + s.playHolds[k];
    }
    return pos;
  }

  function buildMaster() {
    master = gsap.timeline({ paused: true });
    hudSet(0);
    showOnly(0);
    D.slides.forEach((s) => s.tl.pause(0));
    D.slideStarts = [0];
    let pos = addSlideSegments(D.slides[0], 0);
    for (let i = 1; i < D.slides.length; i++) {
      const t = gsap.timeline();
      const at = buildTransition(t, i - 1, i);
      master.add(t, pos);
      D.slideStarts.push(pos);
      pos = addSlideSegments(D.slides[i], pos + at);
    }
    master.to({}, { duration: 0.01 }, pos);
    D.master = master;
  }

  /* ---------------------------------------------------------- public API */
  /** Jump to slide i at segment k (number) or 'end'. Instant. Used by tools. */
  D.goto = function (i, k = "end") {
    finishBusy();
    const s = D.slides[i];
    showOnly(i);
    hudSet(i);
    D.slides.forEach((x) => x.tl.pause());
    const t = k === "end" ? s.tl.duration() : segEnd(i, k);
    s.tl.pause(t);
    cur = i;
    seg = k === "end" ? s.steps.length : k;
    return { steps: s.steps.length, duration: s.tl.duration() };
  };
  /** Seek slide i to a fraction (0–1) of its own timeline. */
  D.seekFraction = function (i, f) {
    D.goto(i, 0);
    const s = D.slides[i];
    s.tl.pause(s.tl.duration() * f);
  };
  D.info = function () {
    return D.slides.map((s) => ({ id: s.id, steps: s.steps.length, duration: +s.tl.duration().toFixed(2), play: +s.playDuration.toFixed(1), theme: s.theme }));
  };
  D.next = next;
  D.prev = prev;

  /* --------------------------------------------------------------- start */
  D.start = function () {
    viewport = $("#viewport");
    stage = $("#stage");
    bgwipe = $("#bgwipe");
    playhead = $("#playhead");
    hud = $("#hud");
    document.body.classList.add(MODE);
    fit();
    applyConfig();
    mountPlans();
    collect();
    buildHud();

    const go = () => {
      buildSlides();
      if (MODE === "render") {
        buildMaster();
        master.pause(0);
      } else {
        const h = parseInt(location.hash.slice(1), 10);
        const startAt = Number.isFinite(h) && h >= 0 && h < D.slides.length ? h : 0;
        cur = startAt;
        if (MODE === "print") D.goto(startAt, "end");
        else enter(startAt, "play");
        bindInput();
        gsap.ticker.add(autoTick);
        poke();
      }
      D.ready = true;
      document.dispatchEvent(new Event("deck:ready"));
    };
    // Layout-dependent animations need final font metrics.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => requestAnimationFrame(go));
    else go();
  };
})();
