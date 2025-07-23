import {
  ForbiddenError,
  InternalServerError,
  SessionExpiredError,
} from "@/app-error";
import { REFRESH_TOKEN_COOKIE_OPTIONS } from "@/config";
import { db } from "@/db/connection";
import { sessionsTable } from "@/db/schema";
import { createId } from "@paralleldrive/cuid2";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import z from "zod";
import {
  AccessTokenPayload,
  accessTokenPayloadSchema,
  RefreshTokenPayload,
  refreshTokenPayloadSchema,
} from "./schemas";

export function generateAccessToken(userId: string): string {
  return jwt.sign(
    { sub: userId } satisfies AccessTokenPayload,
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "2min",
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

export async function refreshTokens(oldRefreshToken: string): Promise<{
  newAccessToken: string;
  newRefreshToken: string;
}> {
  const payload = verifyRefreshToken(oldRefreshToken);
  if (!payload) {
    throw new InternalServerError();
  }

  if (Date.now() >= payload.exp * 1000) {
    throw new SessionExpiredError();
  }

  const [session] = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.sessionId, payload.sessionId));
  if (!session || session.expiresAt < new Date()) {
    throw new SessionExpiredError();
  }

  if (!bcrypt.compareSync(oldRefreshToken, session.tokenHash)) {
    throw new ForbiddenError();
  }

  const newRefreshToken = generateRefreshToken();
  const newAccessToken = generateAccessToken(session.userId);

  await db
    .update(sessionsTable)
    .set({
      tokenHash: hashToken(newRefreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_COOKIE_OPTIONS.maxAge), // now + 7 days
    })
    .where(eq(sessionsTable.sessionId, session.sessionId));

  return { newAccessToken, newRefreshToken };
}

export function hashToken(token: string): string {
  return bcrypt.hashSync(token, 10);
}
