import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { extraListing, Tours, TravelGuides, Boats } from "./content-namespaces.mjs";

const ROOT = new URL("..", import.meta.url);
const messagesDir = new URL("./src/messages/", ROOT);
const cachePath = new URL("./scripts/.translate-cache.json", ROOT);
const SEP = "\n§§§\n";

const GOOGLE_TL = {
  zh: "zh-CN",
  no: "no",
  he: "iw",
  tl: "tl",
  my: "my",
};

function deepMerge(base, overlay) {
  if (!overlay || typeof overlay !== "object" || Array.isArray(overlay)) {
    return overlay ?? base;
  }
  if (!base || typeof base !== "object" || Array.isArray(base)) return overlay;
  const next = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    next[key] =
      typeof next[key] === "object" &&
      next[key] &&
      !Array.isArray(next[key]) &&
      typeof value === "object" &&
      value &&
      !Array.isArray(value)
        ? deepMerge(next[key], value)
        : value;
  }
  return next;
}

function readJson(name) {
  return JSON.parse(readFileSync(new URL(name, messagesDir), "utf8"));
}

function writeJson(name, data) {
  writeFileSync(
    new URL(name, messagesDir),
    `${JSON.stringify(data, null, 2)}\n`,
    "utf8"
  );
}

function walkLeaves(value, path, visit) {
  if (typeof value === "string") {
    visit(path, value);
    return;
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  for (const [key, child] of Object.entries(value)) {
    walkLeaves(child, path ? `${path}.${key}` : key, visit);
  }
}

function setPath(obj, path, value) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const key = parts[i];
    if (!cur[key] || typeof cur[key] !== "object") cur[key] = {};
    cur = cur[key];
  }
  cur[parts[parts.length - 1]] = value;
}

function getPath(obj, path) {
  let cur = obj;
  for (const key of path.split(".")) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = cur[key];
  }
  return cur;
}

function skipPath(path) {
  if (!path.startsWith("LocaleSwitcher.")) return false;
  const key = path.slice("LocaleSwitcher.".length);
  return !["label", "search", "empty"].includes(key);
}

function protectIcu(text) {
  const slots = [];
  const protectedText = text.replace(/\{[^{}]+\}/g, (match) => {
    const token = `⟦${slots.length}⟧`;
    slots.push(match);
    return token;
  });
  return { protectedText, slots };
}

function restoreIcu(text, slots) {
  let out = text;
  slots.forEach((slot, index) => {
    out = out.replace(`⟦${index}⟧`, slot);
    out = out.replace(`[${index}]`, slot);
    out = out.replace(`[[${index}]]`, slot);
  });
  return out;
}

function loadCache() {
  if (!existsSync(cachePath)) return {};
  try {
    return JSON.parse(readFileSync(cachePath, "utf8"));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  writeFileSync(cachePath, JSON.stringify(cache), "utf8");
}

async function translateBatch(texts, tl) {
  if (texts.length === 0) return [];
  const q = texts.join(SEP);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(
    tl
  )}&dt=t&q=${encodeURIComponent(q)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`translate HTTP ${res.status}`);
  }
  const data = await res.json();
  const translated = (data[0] || []).map((row) => row[0]).join("");
  const parts = translated.split(SEP);
  if (parts.length !== texts.length) {
    // fallback: translate one-by-one
    const out = [];
    for (const text of texts) {
      const oneUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(
        tl
      )}&dt=t&q=${encodeURIComponent(text)}`;
      const oneRes = await fetch(oneUrl);
      if (!oneRes.ok) throw new Error(`translate HTTP ${oneRes.status}`);
      const oneData = await oneRes.json();
      out.push((oneData[0] || []).map((row) => row[0]).join(""));
      await sleep(80);
    }
    return out;
  }
  return parts;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function chunkOriginals(texts, maxChars) {
  const chunks = [];
  let current = [];
  let size = 0;
  for (const text of texts) {
    const add = protectIcu(text).protectedText.length + SEP.length;
    if (current.length && size + add > maxChars) {
      chunks.push(current);
      current = [text];
      size = add;
    } else {
      current.push(text);
      size += add;
    }
  }
  if (current.length) chunks.push(current);
  return chunks;
}

const en = readJson("en.json");
en.Listing = { ...en.Listing, ...extraListing };
en.Tours = Tours;
en.TravelGuides = TravelGuides;
en.Boats = Boats;
writeJson("en.json", en);

const cache = loadCache();
const locales = [
  "th",
  "zh",
  "ja",
  "ko",
  "ru",
  "de",
  "fr",
  "it",
  "es",
  "pt",
  "ar",
  "hi",
  "ms",
  "id",
  "vi",
  "km",
  "lo",
  "my",
  "tl",
  "sv",
  "nl",
  "pl",
  "uk",
  "tr",
  "cs",
  "el",
  "fi",
  "no",
  "da",
  "ro",
  "hu",
  "he",
  "fa",
  "bn",
];

let cacheDirty = 0;

for (const locale of locales) {
  const overlay = readJson(`${locale}.json`);
  const missing = [];
  walkLeaves(en, "", (path, value) => {
    if (skipPath(path)) return;
    const current = getPath(overlay, path);
    if (typeof current === "string" && current !== value) return;
    missing.push({ path, value });
  });

  const unique = [];
  const uniqueIndex = new Map();
  for (const item of missing) {
    if (!uniqueIndex.has(item.value)) {
      uniqueIndex.set(item.value, unique.length);
      unique.push(item.value);
    }
  }

  const tl = GOOGLE_TL[locale] || locale;
  const map = new Map();
  const pending = [];
  for (const text of unique) {
    const key = `${locale}::${text}`;
    if (cache[key]) map.set(text, cache[key]);
    else pending.push(text);
  }

  const batches = chunkOriginals(pending, 1400);
  for (const batch of batches) {
    let attempt = 0;
    while (true) {
      try {
        const translated = await translateBatch(
          batch.map((text) => protectIcu(text).protectedText),
          tl
        );
        batch.forEach((original, i) => {
          const { slots } = protectIcu(original);
          const restored = restoreIcu(translated[i] ?? original, slots).trim();
          map.set(original, restored || original);
          cache[`${locale}::${original}`] = restored || original;
        });
        cacheDirty += batch.length;
        if (cacheDirty >= 40) {
          saveCache(cache);
          cacheDirty = 0;
        }
        await sleep(120);
        break;
      } catch (error) {
        attempt += 1;
        if (attempt >= 5) throw error;
        await sleep(800 * attempt);
      }
    }
  }

  const next = structuredClone(overlay);
  walkLeaves(en, "", (path, value) => {
    if (skipPath(path)) {
      setPath(next, path, value);
      return;
    }
    const current = getPath(overlay, path);
    if (typeof current === "string" && current !== value) {
      setPath(next, path, current);
      return;
    }
    setPath(next, path, map.get(value) ?? value);
  });

  writeJson(`${locale}.json`, next);
  saveCache(cache);
  console.log(
    `${locale}: filled ${missing.length} strings (${unique.length} unique, ${pending.length} fetched)`
  );
}

console.log("done");
