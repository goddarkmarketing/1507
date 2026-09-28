/**
 * Apply supabase/migrations/002_site_catalog.sql to the linked project.
 * Requires SUPABASE_ACCESS_TOKEN in the environment or supabase/.secrets.local.env
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadLocalEnv() {
  const p = resolve("supabase/.secrets.local.env");
  if (!existsSync(p)) return {};
  return Object.fromEntries(
    readFileSync(p, "utf8")
      .split(/\r?\n/)
      .filter((l) => l && !l.startsWith("#") && l.includes("="))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i), l.slice(i + 1).trim()];
      })
  );
}

const local = loadLocalEnv();
const token = (
  process.env.SUPABASE_ACCESS_TOKEN ||
  local.SUPABASE_ACCESS_TOKEN ||
  ""
).trim();
const ref = (local.SUPABASE_PROJECT_REF || "jihsrntczvqdkxiklcwj").trim();
const query = readFileSync(
  resolve("supabase/migrations/002_site_catalog.sql"),
  "utf8"
);

if (!token) {
  console.error("Missing SUPABASE_ACCESS_TOKEN");
  process.exit(1);
}

const res = await fetch(
  `https://api.supabase.com/v1/projects/${ref}/database/query`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  }
);

const text = await res.text();
if (!res.ok) {
  console.error(res.status);
  console.error(text.slice(0, 500));
  process.exit(1);
}
console.log("site_catalog_ok");
