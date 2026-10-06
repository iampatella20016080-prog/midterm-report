#!/usr/bin/env node
/**
 * Export the deck as a vector PDF: one page per slide, each at its final
 * (fully built) state. Text stays selectable/searchable.
 * Output: exports/AnZai-slides.pdf
 */
import { chromium } from "playwright";
import { PDFDocument } from "pdf-lib";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "exports");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(pathToFileURL(path.join(ROOT, "index.html")).href + "?print");
await page.waitForFunction(() => window.DECK && window.DECK.ready, null, { timeout: 30000 });
await page.evaluate(() => document.body.classList.add("idle"));
const n = await page.evaluate(() => DECK.slides.length);

const merged = await PDFDocument.create();
merged.setTitle("你還好嗎？安在 AnZai — 健康物聯網期中報告");
merged.setSubject("不用鏡頭的浴室安全守護系統");
merged.setCreator("AnZai deck · tools/export-pdf.mjs");
for (let i = 0; i < n; i++) {
  await page.evaluate((i) => DECK.goto(i, "end"), i);
  await page.waitForTimeout(60);
  const buf = await page.pdf({ width: "1920px", height: "1080px", printBackground: true, pageRanges: "1" });
  const doc = await PDFDocument.load(buf);
  const [p] = await merged.copyPages(doc, [0]);
  merged.addPage(p);
  process.stdout.write(`\rpage ${i + 1}/${n}`);
}
const file = path.join(OUT, "AnZai-slides.pdf");
fs.writeFileSync(file, await merged.save());
await browser.close();
console.log(`\n${file} (${(fs.statSync(file).size / 1024 / 1024).toFixed(2)} MB)`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
