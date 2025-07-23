import { BCRYPT_SALT_ROUNDS } from "@/config";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function getHIBPMatches(prefix: string): Promise<string[]> {
  try {
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const text = await res.text();

    return res.ok ? text.split("\n") : [];
  } catch {
    return [];
  }
}

export async function isPasswordSafe(password: string): Promise<boolean> {
  const hash = crypto
    .createHash("sha1")
    .update(password)
    .digest("hex")
    .toLowerCase();
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);
  const hibpMatches = await getHIBPMatches(prefix);

  return !hibpMatches.some((match) => match.startsWith(suffix));
}

export function comparePassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}
