import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";

const urls = JSON.parse(
  fs.readFileSync("scripts/toyota-model-urls.json", "utf8")
);
const outDir = "public/vehicles/toyota";
fs.mkdirSync(outDir, { recursive: true });

for (const [slug, url] of Object.entries(urls)) {
  const dest = path.join(outDir, `${slug}.webp`);
  execFileSync("curl.exe", ["-sL", url, "-o", dest], { stdio: "ignore" });
  console.log("saved", dest, fs.statSync(dest).size);
}
