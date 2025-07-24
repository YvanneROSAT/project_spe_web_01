import {
  ForbiddenError,
  SessionExpiredError,
  TokenExpiredError,
} from "@/app-error";
import { redis } from "@/cache";
import {
  REDIS_TOKEN_BLACKLIST_KEY,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "@/config";
import { createId } from "@paralleldrive/cuid2";
import bcrypt from "bcrypt";
import { Request } from "express";
import jwt from "jsonwebtoken";
import z from "zod";
import { getSession, updateSession } from "./auth.service";
import {
  AccessTokenPayload,
  accessTokenPayloadSchema,
  RefreshTokenPayload,
  refreshTokenPayloadSchema,
} from "./schemas";

export function generateAccessToken(userId: string): string {
  return jwt.sign(
    { sub: userId } satisfies Omit<AccessTokenPayload, "exp">,
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "30s",
    }
  );
}

export function generateRefreshToken(): string {
  return jwt.sign(
    { sessionId: createId() } satisfies Omit<RefreshTokenPayload, "exp">,
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
  } catch (error) {
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

export async function refreshTokens(
  oldRefreshToken: string
): Promise<[string, string]> {
  const payload = verifyRefreshToken(oldRefreshToken);
  if (!payload) {
    throw new TokenExpiredError();
  }

  const session = await getSession(payload.sessionId);
  if (!session || session.expiresAt < new Date()) {
    throw new SessionExpiredError();
  }

  if (!compareToken(oldRefreshToken, session.tokenHash)) {
    throw new ForbiddenError();
  }

  const newRefreshToken = generateRefreshToken();
  const newAccessToken = generateAccessToken(session.userId);

  await updateSession(
    session.sessionId,
    hashToken(newRefreshToken),
    new Date(Date.now() + REFRESH_TOKEN_COOKIE_OPTIONS.maxAge)
  );

  return [newAccessToken, newRefreshToken];
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
  if (typeof payload === "string" || !payload?.exp) {
    return;
  }

  const ttlSeconds = Math.max(0, payload.exp - Math.floor(Date.now() / 1000));
  await redis.set(`blacklist:${accessToken}`, "1", "EX", ttlSeconds);
}

export async function getIsTokenBlacklisted(token: string): Promise<boolean> {
  return (await redis.exists(`${REDIS_TOKEN_BLACKLIST_KEY}:${token}`)) === 1;
}
