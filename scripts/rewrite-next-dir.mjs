import fs from "node:fs";
import path from "node:path";

/** Plesk/Apache often returns 403 for /_next/ — rename to /nx/ after static export. */
const ROOT = path.resolve(process.cwd(), process.argv[2] ?? "out");
const FROM_DIR = path.join(ROOT, "_next");
const TO_DIR = path.join(ROOT, "nx");
const TEXT_EXT = new Set([
  ".html",
  ".js",
  ".css",
  ".txt",
  ".json",
  ".xml",
  ".map",
  ".svg",
]);

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

if (!fs.existsSync(FROM_DIR)) {
  if (fs.existsSync(TO_DIR)) {
    console.log("Already rewritten:", TO_DIR);
    process.exit(0);
  }
  console.error("Missing", FROM_DIR);
  process.exit(1);
}

if (fs.existsSync(TO_DIR)) {
  fs.rmSync(TO_DIR, { recursive: true, force: true });
}
fs.renameSync(FROM_DIR, TO_DIR);

let changed = 0;
for (const file of walk(ROOT)) {
  const ext = path.extname(file).toLowerCase();
  if (!TEXT_EXT.has(ext)) continue;
  const before = fs.readFileSync(file, "utf8");
  const after = before
    .replaceAll("/_next/", "/nx/")
    .replaceAll("\\/_next\\/", "\\/nx\\/");
  if (after !== before) {
    fs.writeFileSync(file, after);
    changed += 1;
  }
}

console.log(`Renamed _next -> nx and updated ${changed} files in ${ROOT}`);
