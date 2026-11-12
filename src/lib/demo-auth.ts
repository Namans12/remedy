import 'server-only';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const demoUser = 'judge';
export const sessionCookie = '__Host-remedy-session';
export const sessionSeconds = 8 * 60 * 60;

export function demoConfig() {
  const password = process.env.DEMO_PASSWORD;
  if (!password || password.length < 16 || !process.env.DATABASE_URL) return;
  try {
    const url = new URL(process.env.APP_ORIGIN ?? '');
    if (url.protocol === 'https:' && url.origin === process.env.APP_ORIGIN) {
      return { password, origin: url.origin };
    }
  } catch {
    return;
  }
}

function equal(left: string, right: string) {
  const digest = (value: string) => createHash('sha256').update(value).digest();
  return timingSafeEqual(digest(left), digest(right));
}

export function validCredentials(username: string, password: string, expected: string) {
  return username === demoUser && equal(password, expected);
}

export function validBasicAuth(header: string | null, password: string) {
  if (!header?.startsWith('Basic ')) return false;
  const candidate = Buffer.from(header.slice(6), 'base64').toString('utf8');
  return equal(candidate, `${demoUser}:${password}`);
}

function signature(expiry: string, password: string) {
  return createHmac('sha256', password).update(`remedy-demo-session:v1:${expiry}`).digest('base64url');
}

export function issueSession(password: string) {
  const expiry = String(Math.floor(Date.now() / 1000) + sessionSeconds);
  return `${expiry}.${signature(expiry, password)}`;
}

export function validSession(value: string | undefined, password: string) {
  const match = value?.match(/^(\d{10,11})\.([\w-]{43})$/);
  return !!match && Number(match[1]) > Math.floor(Date.now() / 1000)
    && equal(match[2], signature(match[1], password));
}

export function checkoutParams(checkout: unknown, token: unknown) {
  const params = new URLSearchParams();
  if (checkout === 'cancelled') params.set('checkout', checkout);
  if (checkout === 'approved' && typeof token === 'string' && /^[A-Z0-9]{1,40}$/i.test(token)) {
    params.set('checkout', checkout);
    params.set('token', token);
  }
  return params;
}
