import crypto from "crypto";

const KEY_HEX = process.env.ANSWERS_ENC_KEY; // 64 hex chars for 32 bytes key
const KEY = KEY_HEX ? Buffer.from(KEY_HEX, "hex") : null;

export async function encryptSensitive(obj: any) {
  if (!KEY) return obj;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);
  const plaintext = Buffer.from(JSON.stringify(obj), "utf8");
  const enc = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { __enc: true, alg: "AES-256-GCM", iv: iv.toString("base64"), tag: tag.toString("base64"), data: enc.toString("base64") };
}

export async function decryptSensitive(payload: any) {
  if (!KEY || !payload?.__enc) return payload;
  const iv = Buffer.from(payload.iv, "base64");
  const tag = Buffer.from(payload.tag, "base64");
  const data = Buffer.from(payload.data, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(data), decipher.final()]);
  return JSON.parse(dec.toString("utf8"));
}
