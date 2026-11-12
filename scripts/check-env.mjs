// Presence/format check only: no credential values are printed and no API requests are made.
// Run `npm run check:env` for local setup, or `node --env-file=.env scripts/check-env.mjs --hosted`
// to also validate the production settings the hosted demo requires (see src/lib/demo-auth.ts).
const required = ["PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET", "GEMINI_API_KEY", "GEMINI_MODEL"];
const optional = ["PAYPAL_WEBHOOK_ID", "AG_STUDIO_LICENSE_KEY"];
const present = (key) => {
  const value = process.env[key]?.trim();
  return Boolean(value && !/^(xxx|changeme|your[_-].*)$/i.test(value));
};
let missing = false;
for (const key of required) {
  const ready = present(key);
  console.log(`${ready ? "SET" : "MISSING"} ${key}`);
  missing ||= !ready;
}
for (const key of optional) console.log(`${present(key) ? "SET" : "OPTIONAL / NOT SET"} ${key}`);
if (process.argv.includes("--hosted")) {
  const password = process.env.DEMO_PASSWORD ?? "";
  const checks = [
    ["DEMO_PASSWORD is at least 16 characters", password.length >= 16],
    ["DATABASE_URL is set", present("DATABASE_URL")],
    ["APP_ORIGIN is an exact https origin", (() => { try { const u = new URL(process.env.APP_ORIGIN ?? ""); return u.protocol === "https:" && u.origin === process.env.APP_ORIGIN; } catch { return false; } })()],
  ];
  for (const [label, ok] of checks) { console.log(`${ok ? "OK" : "FAIL"} ${label}`); missing ||= !ok; }
}
console.log("Presence check only. No credential values printed; no API requests made.");
if (missing) process.exitCode = 1;
