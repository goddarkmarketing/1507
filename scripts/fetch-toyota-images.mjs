import { execFileSync } from "child_process";
import fs from "fs";

const pages = [
  "https://www.toyota.co.th/model-list",
  "https://www.toyota.co.th/model/yarisativ",
  "https://www.toyota.co.th/model/yaris",
  "https://www.toyota.co.th/model/camry",
  "https://www.toyota.co.th/model/corollaaltis",
  "https://www.toyota.co.th/model/corollacross",
  "https://www.toyota.co.th/model/fortuner",
  "https://www.toyota.co.th/model/veloz",
  "https://www.toyota.co.th/model/alphard",
  "https://www.toyota.co.th/model/hiace",
  "https://www.toyota.co.th/model/commuter",
  "https://www.toyota.co.th/model/coaster",
  "https://www.toyota.co.th/model/innova",
  "https://www.toyota.co.th/model/crown",
];

const found = new Set();

for (const url of pages) {
  const out = "tmp-toyota.html";
  try {
    execFileSync(
      "curl.exe",
      ["-sL", url, "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", "-o", out],
      { stdio: "ignore" }
    );
  } catch {
    console.log("fail", url);
    continue;
  }
  const html = fs.readFileSync(out, "utf8");
  console.log("\n==", url, "len", html.length);
  const abs = [...html.matchAll(/https?:\/\/[^"'\\\s>]+\.(?:webp|png|jpg|jpeg)/gi)].map(
    (m) => m[0]
  );
  const media = [...html.matchAll(/\/media\/[^"'\\\s>]+/gi)].map((m) => m[0]);
  const next = html.includes("__NEXT_DATA__");
  const nuxt = html.includes("__NUXT__") || html.includes("nuxt");
  console.log("abs", abs.length, "media", media.length, "next", next, "nuxt", nuxt);
  for (const u of [...abs, ...media]) {
    if (/product|series|model|car|vehicle|\.webp|\.png|\.jpg/i.test(u)) found.add(u);
  }
  if (abs.length) console.log(abs.slice(0, 8).join("\n"));
  if (media.length) console.log([...new Set(media)].slice(0, 15).join("\n"));
}

console.log("\nFOUND", found.size);
for (const u of [...found].slice(0, 80)) console.log(u);
