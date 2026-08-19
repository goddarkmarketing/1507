import fs from "fs";

const xml = fs.readFileSync("tmp-xlsx/xl/worksheets/sheet1.xml", "utf8");
const rows = [...xml.matchAll(/<row r="(\d+)"[\s\S]*?<\/row>/g)];

function decode(t) {
  return t
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
}

const routes = [];
for (const m of rows) {
  const rowXml = m[0];
  const no = rowXml.match(/<c r="A\d+"[^>]*><is><t>(\d+)<\/t>/);
  if (!no) continue;
  const nameCell = rowXml.match(/<c r="B\d+"[^>]*><is><t>([\s\S]*?)<\/t>/);
  const nums = [...rowXml.matchAll(/<c r="[C-I]\d+"[^>]*><v>(\d+)<\/v>/g)].map(
    (x) => Number(x[1])
  );
  if (!nameCell || nums.length < 7) continue;
  const raw = decode(nameCell[1]);
  const lines = raw.split(/\n/).map((s) => s.trim()).filter(Boolean);
  const th = lines[0]?.replace(/^สนามบินกระบี่\s*↔\s*/, "") ?? "";
  const enLine = lines.find((l) => l.startsWith("Krabi Airport")) ?? "";
  const en = enLine.replace(/^Krabi Airport\s*↔\s*/, "");
  routes.push({
    no: no[1],
    nameTh: th,
    nameEn: en,
    prices: {
      ECO: nums[0],
      PREM: nums[1],
      SUV: nums[2],
      VAN: nums[3],
      EXE: nums[4],
      VIP: nums[5],
      SIG: nums[5],
      BUS: nums[6],
    },
  });
}

console.log(JSON.stringify(routes, null, 2));
console.log("COUNT", routes.length);
