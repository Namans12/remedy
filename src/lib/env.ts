import "server-only";

// Fixed sandbox target: production payments are deliberately not configured.
export const PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com";

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value || /^(xxx|changeme|your[_-].*)$/i.test(value)) {
    throw new Error(`Missing configuration: ${name}. Add it to .env.`);
  }
  return value;
}

// Read lazily so the scaffold can build before credentials are supplied.
export function getPayPalConfig() {
  return {
    baseUrl: PAYPAL_API_BASE,
    clientId: required("PAYPAL_CLIENT_ID"),
    clientSecret: required("PAYPAL_CLIENT_SECRET"),
  };
}

export function getGeminiConfig() {
  return { apiKey: required("GEMINI_API_KEY"), model: required("GEMINI_MODEL") };
}
