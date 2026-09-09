/**
 * Deploy notify-booking + set Resend secrets.
 * Requires SUPABASE_ACCESS_TOKEN (https://supabase.com/dashboard/account/tokens)
 *
 *   set SUPABASE_ACCESS_TOKEN=sbp_...
 *   node scripts/deploy-notify-booking.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
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
const token = (process.env.SUPABASE_ACCESS_TOKEN || local.SUPABASE_ACCESS_TOKEN || "").trim();
const ref = (local.SUPABASE_PROJECT_REF || "jihsrntczvqdkxiklcwj").trim();
const resend = (local.RESEND_API_KEY || "").trim();
const adminEmail = (local.ADMIN_NOTIFY_EMAIL || "goddarkmarketing@gmail.com").trim();

if (!token) {
  console.error(`
Missing SUPABASE_ACCESS_TOKEN.

1) Open https://supabase.com/dashboard/account/tokens
2) Generate token → copy (starts with sbp_)
3) Run:

   $env:SUPABASE_ACCESS_TOKEN="sbp_..."
   node scripts/deploy-notify-booking.mjs
`);
  process.exit(1);
}

if (!resend) {
  console.error("Missing RESEND_API_KEY in supabase/.secrets.local.env");
  process.exit(1);
}

const env = { ...process.env, SUPABASE_ACCESS_TOKEN: token };

execFileSync(
  "npx",
  [
    "supabase",
    "secrets",
    "set",
    `RESEND_API_KEY=${resend}`,
    `ADMIN_NOTIFY_EMAIL=${adminEmail}`,
    "--project-ref",
    ref,
  ],
  { stdio: "inherit", env, shell: true }
);

execFileSync(
  "npx",
  ["supabase", "functions", "deploy", "notify-booking", "--project-ref", ref],
  { stdio: "inherit", env, shell: true }
);

console.log("\nDeployed notify-booking");
console.log("Admin notify email:", adminEmail);
