import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";

const slugs = [
  "yarisativ",
  "yaris",
  "camry",
  "corollacross",
  "fortuner",
  "veloz",
  "alphard",
  "hiace",
  "commuter",
  "hiacecommuter",
  "coaster",
  "innova",
  "innovazenix",
  "yariscross",
  "corollaaltis",
  "altis",
  "crown",
  "vellfire",
  "fortunerlegend",
  "hilux",
  "hiluxrevo",
  "revo",
  "majesty",
];

const outDir = "public/vehicles/toyota";
fs.mkdirSync(outDir, { recursive: true });

const models = {};

for (const slug of slugs) {
  const htmlFile = "tmp-toyota.html";
  try {
    execFileSync(
      "curl.exe",
      [
        "-sL",
        `https://www.toyota.co.th/model/${slug}`,
        "-A",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "-o",
        htmlFile,
      ],
      { stdio: "ignore" }
    );
  } catch {
    continue;
  }
  const html = fs.readFileSync(htmlFile, "utf8");
  if (html.length < 8000) {
    console.log("skip short", slug, html.length);
    continue;
  }
  const match = html.match(
    /https:\/\/www\.toyota\.co\.th\/media\/product\/series\/v\/\d+\/model\/[a-f0-9]+\.webp/
  );
  if (!match) {
    console.log("no model cutout", slug);
    continue;
  }
  models[slug] = match[0];
  console.log("ok", slug, match[0]);
}

fs.writeFileSync(
  "scripts/toyota-model-urls.json",
  JSON.stringify(models, null, 2)
);

for (const [slug, url] of Object.entries(models)) {
  const dest = path.join(outDir, `${slug}.webp`);
  execFileSync("curl.exe", ["-sL", url, "-o", dest], { stdio: "ignore" });
  const size = fs.statSync(dest).size;
  console.log("saved", dest, size);
}
