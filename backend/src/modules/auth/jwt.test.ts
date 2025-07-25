import { REFRESH_TOKEN_COOKIE_NAME } from "@/config";
import { createId } from "@paralleldrive/cuid2";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";
import z from "zod";
import {
  blacklistAccessToken,
  generateAccessToken,
  getAccessTokenFromRequest,
  getIsTokenBlacklisted,
  getRefreshTokenFromRequest,
  verifyAccessToken,
  verifyRefreshToken,
  verifyToken,
} from "./jwt";

const mGetSession = vi.hoisted(() => vi.fn());
const mUpdateSession = vi.hoisted(() => vi.fn());
vi.mock("./auth.service.ts", () => ({
  getSession: mGetSession,
  updateSession: mUpdateSession,
}));

const mRedisSetEx = vi.hoisted(() => vi.fn());
const mRedisExists = vi.hoisted(() => vi.fn());
vi.mock("@/cache.ts", () => ({
  redis: {
    setex: mRedisSetEx,
    exists: mRedisExists,
  },
}));

const mSecret = "secret";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("generateAccessToken", () => {
  it("returns the signed access token ", () => {
    process.env.ACCESS_TOKEN_SECRET = "jwt-access-secret";

    const res = generateAccessToken("userId");

    expect(jwt.decode(res)).toEqual({
      sub: "userId",
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });
});

describe("generateRefreshToken", () => {
  it("returns the signed refresh token ", () => {
    process.env.ACCESS_TOKEN_SECRET = "jwt-access-secret";

    const res = generateAccessToken("userId");

    expect(jwt.decode(res)).toEqual({
      sub: "userId",
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });
});

describe("verifyToken", () => {
  const mSchema = z.object({
    sub: z.string(),
  });

  it("should return decoded payload for valid token", () => {
    const mToken = jwt.sign({ sub: "subject" }, mSecret);

    const res = verifyToken(mToken, mSchema, mSecret);

    expect(res).toEqual({
      sub: "subject",
    });
  });

  it("should return null for invalid token", () => {
    const res = verifyToken("invalid token", mSchema, mSecret);

    expect(res).toEqual(null);
  });
});

describe("verifyAccessToken", () => {
  it("should verify access token and its return payload", () => {
    process.env.ACCESS_TOKEN_SECRET = mSecret;

    const mSub = createId();
    const mAccessToken = jwt.sign({ sub: mSub }, mSecret, {
      expiresIn: "10s",
    });

    const payload = verifyAccessToken(mAccessToken);

    expect(payload).toEqual({
      exp: Math.floor(Date.now() / 1000) + 10, // in 10 seconds
      sub: mSub,
    });
  });
});

describe("verifyRefreshToken", () => {
  it("should verify refresh token and its return payload", () => {
    process.env.REFRESH_TOKEN_SECRET = mSecret;

    const mSessionId = createId();
    const mRefreshToken = jwt.sign({ sessionId: mSessionId }, mSecret, {
      expiresIn: "10s",
    });

    const payload = verifyRefreshToken(mRefreshToken);

    expect(payload).toEqual({
      exp: Math.floor(Date.now() / 1000) + 10, // in 10 seconds
      sessionId: mSessionId,
    });
  });
});

describe("getAccessTokenFromRequest", () => {
  it("should return access token from request headers", () => {
    const mAccessToken = "accessToken";

    const res = getAccessTokenFromRequest({
      headers: {
        authorization: `Bearer ${mAccessToken}`,
      },
    } as Request);

    expect(res).toEqual(mAccessToken);
  });

  it("should return null if header not found", () => {
    const res = getAccessTokenFromRequest({ headers: {} } as Request);

    expect(res).toEqual(null);
  });
});

describe("getRefreshTokenFromRequest", () => {
  it("should return refresh token from request cookie", () => {
    const mRefreshToken = "refreshToken";

    const res = getRefreshTokenFromRequest({
      cookies: {
        [REFRESH_TOKEN_COOKIE_NAME]: mRefreshToken,
      },
    } as unknown as Request);

    expect(res).toEqual(mRefreshToken);
  });

  it("should return null if cookie not found", () => {
    const res = getRefreshTokenFromRequest({ cookies: {} } as Request);

    expect(res).toEqual(null);
  });
});

describe("blacklistAccessToken", () => {
  it("should blacklist access token for remaining ttl", async () => {
    const mTtlSeconds = 6;
    const mExp = Math.floor(Date.now() / 1000) + mTtlSeconds; // expire in 6 seconds
    const mAccessToken = jwt.sign({ sub: "userId123", exp: mExp }, mSecret);

    await blacklistAccessToken(mAccessToken);

    expect(mRedisSetEx).toHaveBeenCalledWith(
      `blacklist:${mAccessToken}`,
      "1",
      "EX",
      mTtlSeconds
    );
  });

  it("should return if exp not set", async () => {
    const mAccessToken = jwt.sign({ sub: "userId123" }, mSecret);

    await blacklistAccessToken(mAccessToken);

    expect(mRedisSetEx).toHaveBeenCalledTimes(0);
  });

  it("should return if payload is invalid", async () => {
    const mAccessToken = jwt.sign("invalid payload", mSecret);

    await blacklistAccessToken(mAccessToken);

    expect(mRedisSetEx).toHaveBeenCalledTimes(0);
  });
});

describe("getIsTokenBlacklisted", () => {
  it("should return true for blacklisted token", async () => {
    mRedisExists.mockResolvedValue(1);
    const mAccessToken = "accessToken";

    const res = await getIsTokenBlacklisted(mAccessToken);

    expect(res).toEqual(true);
    expect(mRedisExists).toHaveBeenCalledWith(`blacklist:${mAccessToken}`);
  });

  it("should return false for non-blacklisted token", async () => {
    mRedisExists.mockResolvedValue(0);
    const mAccessToken = "accessToken";

    const res = await getIsTokenBlacklisted(mAccessToken);

    expect(res).toEqual(false);
    expect(mRedisExists).toHaveBeenCalledWith(`blacklist:${mAccessToken}`);
  });
});
