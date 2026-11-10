const required = ["PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET", "GEMINI_API_KEY"];
const optional = ["GEMINI_MODEL", "PAYPAL_WEBHOOK_ID", "AG_STUDIO_LICENSE_KEY"];
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
console.log("Presence check only. No credential values printed; no API requests made.");
if (missing) process.exitCode = 1;
