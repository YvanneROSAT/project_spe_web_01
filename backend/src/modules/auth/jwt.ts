import { redis } from "@/cache";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/config";
import { createId } from "@paralleldrive/cuid2";
import bcrypt from "bcrypt";
import { Request } from "express";
import jwt from "jsonwebtoken";
import z from "zod";
import {
  AccessTokenPayload,
  accessTokenPayloadSchema,
  RefreshTokenPayload,
  refreshTokenPayloadSchema,
} from "./auth.schemas";

export function generateAccessToken(userId: string): string {
  return jwt.sign(
    { sub: userId } satisfies Omit<AccessTokenPayload, "exp" | "jti">,
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "30s",
      jwtid: createId(),
    }
  );
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign(
    { userId } satisfies Omit<RefreshTokenPayload, "exp">,
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "14d",
    }
  );
}

export function verifyToken<T extends z.ZodObject>(
  token: string,
  schema: T,
  secret: string
): z.infer<T> | null {
  try {
    const payload = jwt.verify(token, secret);

    return schema.parse(payload);
  } catch {
    return null;
  }
}

export function verifyAccessToken(accessToken: string) {
  return verifyToken(
    accessToken,
    accessTokenPayloadSchema,
    process.env.ACCESS_TOKEN_SECRET
  );
}

export function verifyRefreshToken(refreshToken: string) {
  return verifyToken(
    refreshToken,
    refreshTokenPayloadSchema,
    process.env.REFRESH_TOKEN_SECRET
  );
}

export function hashToken(token: string): string {
  return bcrypt.hashSync(token, 10);
}

export function compareToken(token: string, tokenHash: string): boolean {
  return bcrypt.compareSync(token, tokenHash);
}

export function getAccessTokenFromRequest(req: Request): string | null {
  return req.headers.authorization?.split(" ")[1] ?? null;
}

export function getRefreshTokenFromRequest(req: Request): string | null {
  return req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] ?? null;
}

export async function blacklistAccessToken(accessToken: string) {
  const payload = jwt.decode(accessToken);
  if (typeof payload === "string" || !payload?.exp || !payload.jti) {
    return;
  }

  const ttlSeconds = Math.max(0, payload.exp - Math.floor(Date.now() / 1000));
  await redis.setex(`blacklist:${payload.jti}`, ttlSeconds, "1");
}

export async function getIsTokenBlacklisted(tokenId: string): Promise<boolean> {
  return (await redis.exists(`blacklist:${tokenId}`)) === 1;
}
