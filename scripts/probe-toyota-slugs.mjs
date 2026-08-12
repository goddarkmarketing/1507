import { execFileSync } from "child_process";
import fs from "fs";

const slugs = [
  "fortunerchamp",
  "fortunerleader",
  "fortunergrsport",
  "newfortuner",
  "hilux",
  "hiluxrevo",
  "revo",
  "revodoublecab",
  "fortuner",
  "innova",
  "vellfire",
  "crown",
  "bz4x",
  "gr86",
  "grsupra",
  "corollaaltis",
  "corollagr",
  "hiluxchamp",
  "fortuner2",
  "fortunerlegender",
];

for (const slug of slugs) {
  try {
    execFileSync(
      "curl.exe",
      [
        "-sL",
        `https://www.toyota.co.th/model/${slug}`,
        "-A",
        "Mozilla/5.0",
        "-o",
        "tmp-toyota.html",
      ],
      { stdio: "ignore" }
    );
    const h = fs.readFileSync("tmp-toyota.html", "utf8");
    const m = h.match(
      /https:\/\/www\.toyota\.co\.th\/media\/product\/series\/v\/\d+\/model\/[a-f0-9]+\.webp/
    );
    console.log(slug, "len", h.length, m ? `OK ${m[0]}` : "no");
  } catch {
    console.log(slug, "err");
  }
}
