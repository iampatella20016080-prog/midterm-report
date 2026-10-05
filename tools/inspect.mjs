#!/usr/bin/env node
/**
 * Render & inspect the deck in headless Chromium.
 *  - console / page errors
 *  - every slide at every step (shots/sXX-kY.png)
 *  - each slide's own timeline at 0 / 25 / 50 / 75 / 100 %   (--fractions)
 *  - the full autoplay master timeline at 0 / 25 / 50 / 75 / 100 %  (--master)
 *  - layout checks: elements leaving the safe area, clipped text, overlapping text blocks
 *  - glyph coverage against the embedded font subset
 * Usage: node tools/inspect.mjs [--quick] [--fractions] [--master] [--only=3,4]
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));
const only = [...args].find((a) => a.startsWith("--only="));
const onlySet = only ? new Set(only.slice(7).split(",").map(Number)) : null;
const QUICK = args.has("--quick");
const OUT = path.join(ROOT, "shots");
fs.mkdirSync(OUT, { recursive: true });

const url = pathToFileURL(path.join(ROOT, "index.html")).href;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const problems = [];
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning") problems.push(`[console.${m.type()}] ${m.text()}`);
});
page.on("pageerror", (e) => problems.push(`[pageerror] ${e.message}`));
page.on("requestfailed", (r) => problems.push(`[requestfailed] ${r.url()}`));

async function open(q = "") {
  await page.goto(url + q);
  await page.waitForFunction(() => window.DECK && window.DECK.ready, null, { timeout: 30000 });
  await page.evaluate(() => document.body.classList.add("idle"));
}

await open("?print");
const info = await page.evaluate(() => DECK.info());
console.log(`slides: ${info.length}`);
info.forEach((s, i) => console.log(`  ${String(i).padStart(2, "0")} ${s.id.padEnd(14)} steps=${s.steps} dur=${s.duration}s`));

/* ---------- glyph coverage */
const charset = new Set(fs.readFileSync(path.join(ROOT, "assets/fonts/charset.txt"), "utf8"));
const pageText = await page.evaluate(() => document.getElementById("stage").textContent);
const missing = [...new Set(pageText)].filter((c) => c.trim() && !charset.has(c));
if (missing.length) problems.push(`[glyphs] not in font subset: ${missing.join(" ")}  → run npm run fonts`);

/* ---------- layout checks (end state of every slide) */
async function layoutCheck(i) {
  return page.evaluate((i) => {
    const out = [];
    const slide = DECK.slides[i];
    const stageR = document.getElementById("stage").getBoundingClientRect();
    const s = stageR.width / 1920;
    const R = (el) => {
      const rg = document.createRange();
      rg.selectNodeContents(el);
      const r = rg.getBoundingClientRect();
      return { x: (r.left - stageR.left) / s, y: (r.top - stageR.top) / s, w: r.width / s, h: r.height / s };
    };
    const visible = (el) => {
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) < 0.05) return false;
      let p = el.parentElement;
      while (p && p !== slide.el) {
        const c = getComputedStyle(p);
        if (c.display === "none" || parseFloat(c.opacity) < 0.05 || c.visibility === "hidden") return false;
        p = p.parentElement;
      }
      return true;
    };
    const textEls = [...slide.el.querySelectorAll(".slide-inner *")].filter((el) => {
      if (el.closest("svg") || el.closest(".notes")) return false;
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      return own && visible(el);
    });
    // safe area: 96px side margins, 40px top, HUD band at bottom
    for (const el of textEls) {
      const r = R(el);
      if (r.w === 0 || r.h === 0) continue;
      if (r.x < 90 || r.x + r.w > 1830 || r.y < 36 || r.y + r.h > 1012) {
        out.push(`[safe-area] ${el.className || el.tagName} "${el.textContent.trim().slice(0, 24)}" at x=${r.x.toFixed(0)} y=${r.y.toFixed(0)} w=${r.w.toFixed(0)} h=${r.h.toFixed(0)}`);
      }
      if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== "visible") {
        out.push(`[clipped] ${el.className} "${el.textContent.trim().slice(0, 24)}"`);
      }
    }
    // overlapping text blocks (ignoring intentional overlays)
    const skip = (el) => el.closest(".notif, .bubble, .result-chip, .countdown, .plan, .merge, .big, .cochart, .balance");
    const blocks = textEls.filter((e) => !skip(e)).map((e) => ({ e, r: R(e) }));
    for (let a = 0; a < blocks.length; a++) {
      for (let b = a + 1; b < blocks.length; b++) {
        const A = blocks[a];
        const B = blocks[b];
        if (A.e.contains(B.e) || B.e.contains(A.e)) continue;
        const ha = A.e.closest("h1, h2, .line1, .line2");
        if (ha && ha === B.e.closest("h1, h2, .line1, .line2")) continue;
        const ox = Math.min(A.r.x + A.r.w, B.r.x + B.r.w) - Math.max(A.r.x, B.r.x);
        const oy = Math.min(A.r.y + A.r.h, B.r.y + B.r.h) - Math.max(A.r.y, B.r.y);
        if (ox > 6 && oy > 6) out.push(`[overlap] "${A.e.textContent.trim().slice(0, 18)}" × "${B.e.textContent.trim().slice(0, 18)}" (${ox.toFixed(0)}×${oy.toFixed(0)})`);
      }
    }
    return out;
  }, i);
}

for (let i = 0; i < info.length; i++) {
  if (onlySet && !onlySet.has(i)) continue;
  const steps = info[i].steps;
  const ks = QUICK ? ["end"] : [...Array(steps).keys(), "end"];
  for (const k of ks) {
    await page.evaluate(([i, k]) => DECK.goto(i, k), [i, k]);
    await page.waitForTimeout(30);
    await page.screenshot({ path: path.join(OUT, `s${String(i).padStart(2, "0")}-${k === "end" ? "end" : "k" + k}.png`) });
  }
  const issues = await layoutCheck(i);
  issues.forEach((m) => problems.push(`s${String(i).padStart(2, "0")} ${m}`));
  if (args.has("--fractions")) {
    for (const f of [0, 0.25, 0.5, 0.75, 1]) {
      await page.evaluate(([i, f]) => DECK.seekFraction(i, f), [i, f]);
      await page.waitForTimeout(30);
      await page.screenshot({ path: path.join(OUT, `s${String(i).padStart(2, "0")}-f${String(f * 100).padStart(3, "0")}.png`) });
    }
  }
}

if (args.has("--master")) {
  await open("?render");
  const dur = await page.evaluate(() => DECK.master.duration());
  console.log(`master timeline: ${dur.toFixed(1)}s`);
  for (const f of [0, 0.25, 0.5, 0.75, 1]) {
    await page.evaluate((t) => DECK.master.pause(t), Math.min(dur * f, dur - 0.02));
    await page.waitForTimeout(40);
    await page.screenshot({ path: path.join(OUT, `master-${String(f * 100).padStart(3, "0")}.png`) });
  }
}

/* live mode smoke test: step through everything with the keyboard */
if (!QUICK) {
  await open("");
  for (let n = 0; n < 80; n++) {
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(60);
  }
  for (let n = 0; n < 10; n++) {
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(40);
  }
}

await browser.close();
console.log(problems.length ? `\n${problems.length} issue(s):\n` + problems.join("\n") : "\nno issues");
