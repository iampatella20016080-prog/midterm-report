#!/usr/bin/env node
/**
 * Export the A4 written report (report/index.html) to PDF with page numbers.
 * Output: exports/AnZai-report.pdf
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "exports");
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(pathToFileURL(path.join(ROOT, "report", "index.html")).href);
await page.waitForFunction(() => document.body.dataset.ready === "1");
await page.evaluate(() => document.fonts.ready);
const file = path.join(OUT, "AnZai-report.pdf");
await page.pdf({
  path: file,
  format: "A4",
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: "<span></span>",
  footerTemplate:
    '<div style="width:100%;font-size:8px;color:#6b7380;padding:0 18mm;display:flex;justify-content:space-between;font-family:sans-serif"><span>AnZai · Health IoT Midterm Report</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
  margin: { top: "18mm", bottom: "20mm", left: "18mm", right: "18mm" },
});
await browser.close();
console.log(`${file} (${(fs.statSync(file).size / 1024 / 1024).toFixed(2)} MB)`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
