/**
 * Web Crypto API utilities - 100% tương thích Edge Runtime / Cloudflare Workers
 * Không dùng Node.js crypto / bcrypt / argon2 (vì không chạy trên Edge).
 */

const encoder = new TextEncoder();

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Hash password sử dụng PBKDF2 với SHA-256 + salt 16 bytes
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  const saltHex = bufferToHex(salt.buffer);
  const hashHex = bufferToHex(derivedKey);

  return `${saltHex}:${hashHex}`;
}

/**
 * Verify password
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [saltHex, originalHashHex] = storedHash.split(":");
  if (!saltHex || !originalHashHex) return false;

  const salt = hexToBuffer(saltHex);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  const calculatedHashHex = bufferToHex(derivedKey);
  return calculatedHashHex === originalHashHex;
}

/**
 * Mã hóa / Giải mã Token Cookie Session với HMAC SHA-256
 */
export interface SessionPayload {
  userId: string;
  role: "student" | "counselor" | "admin";
  username: string;
  exp: number; // timestamp ms
}

export async function createSessionToken(
  payload: SessionPayload,
  secret: string
): Promise<string> {
  const data = JSON.stringify(payload);
  const encodedData = btoa(data);

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(encodedData)
  );

  const signatureHex = bufferToHex(signature);
  return `${encodedData}.${signatureHex}`;
}

export async function verifySessionToken(
  token: string,
  secret: string
): Promise<SessionPayload | null> {
  const [encodedData, signatureHex] = token.split(".");
  if (!encodedData || !signatureHex) return null;

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const signature = hexToBuffer(signatureHex);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signature,
      encoder.encode(encodedData)
    );

    if (!isValid) return null;

    const jsonStr = atob(encodedData);
    const payload = JSON.parse(jsonStr) as SessionPayload;

    if (Date.now() > payload.exp) return null; // Hết hạn

    return payload;
  } catch {
    return null;
  }
}
