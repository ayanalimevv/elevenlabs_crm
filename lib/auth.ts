export const SESSION_COOKIE_NAME = "session";

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function requireSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return secret;
}

// Uses Web Crypto (crypto.subtle) rather than node:crypto so this also
// works unmodified in Next.js middleware, which runs on the Edge runtime.
async function hmacHex(message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(requireSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionCookieValue(): Promise<string> {
  const expires = Date.now() + SESSION_DURATION_MS;
  const signature = await hmacHex(String(expires));
  return `${expires}.${signature}`;
}

export async function isValidSessionCookieValue(
  value: string | undefined | null,
): Promise<boolean> {
  if (!value) return false;
  const [expiresStr, signature] = value.split(".");
  if (!expiresStr || !signature) return false;

  const expected = await hmacHex(expiresStr);
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  if (diff !== 0) return false;

  const expires = Number(expiresStr);
  return Number.isFinite(expires) && Date.now() <= expires;
}
