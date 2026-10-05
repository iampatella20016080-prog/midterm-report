#!/usr/bin/env node
/**
 * Frame-accurate video export.
 * Opens the deck in ?render mode (one master GSAP timeline: animations +
 * narration-paced holds + transitions), seeks it frame by frame and pipes
 * JPEG frames into ffmpeg → H.264 MP4.
 * Usage: node tools/render-video.mjs [--fps=30] [--from=0] [--to=<sec>] [--out=exports/AnZai-autoplay.mp4]
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = (k, d) => {
  const a = process.argv.find((x) => x.startsWith(`--${k}=`));
  return a ? a.split("=")[1] : d;
};
const FPS = +arg("fps", 30);
const OUTFILE = path.resolve(ROOT, arg("out", "exports/AnZai-autoplay.mp4"));
fs.mkdirSync(path.dirname(OUTFILE), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(pathToFileURL(path.join(ROOT, "index.html")).href + "?render");
await page.waitForFunction(() => window.DECK && window.DECK.ready, null, { timeout: 30000 });
const total = await page.evaluate(() => DECK.master.duration());
const from = +arg("from", 0);
const to = Math.min(+arg("to", total), total);
const frames = Math.round((to - from) * FPS);
console.log(`timeline ${total.toFixed(1)} s → rendering ${from}–${to.toFixed(1)} s, ${frames} frames @ ${FPS} fps`);

const ff = spawn("ffmpeg", [
  "-loglevel", "error", "-y",
  "-f", "image2pipe", "-c:v", "mjpeg", "-framerate", String(FPS), "-i", "-",
  "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
  "-movflags", "+faststart", OUTFILE,
], { stdio: ["pipe", "inherit", "inherit"] });

const t0 = Date.now();
for (let f = 0; f < frames; f++) {
  const t = from + f / FPS;
  await page.evaluate((t) => { DECK.master.pause(t); }, t);
  const buf = await page.screenshot({ type: "jpeg", quality: 92 });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  if (f % 150 === 0) {
    const el = (Date.now() - t0) / 1000;
    process.stdout.write(`\r${f}/${frames}  ${(t).toFixed(1)}s  elapsed ${el.toFixed(0)}s  eta ${((el / (f + 1)) * (frames - f)).toFixed(0)}s   `);
  }
}
ff.stdin.end();
await new Promise((r) => ff.on("close", r));
await browser.close();
console.log(`\n${OUTFILE} (${(fs.statSync(OUTFILE).size / 1024 / 1024).toFixed(1)} MB)`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
