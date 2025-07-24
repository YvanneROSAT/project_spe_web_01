import { REDIS_TOKEN_BLACKLIST_KEY, REFRESH_TOKEN_COOKIE_NAME } from "@/config";
import {
  ForbiddenError,
  SessionExpiredError,
  TokenExpiredError,
} from "@/modules/auth/auth.errors";
import { createId } from "@paralleldrive/cuid2";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";
import z from "zod";
import {
  blacklistAccessToken,
  compareToken,
  generateAccessToken,
  generateRefreshToken,
  getAccessTokenFromRequest,
  getIsTokenBlacklisted,
  getRefreshTokenFromRequest,
  hashToken,
  refreshTokens,
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

const mRedisSet = vi.hoisted(() => vi.fn());
const mRedisExists = vi.hoisted(() => vi.fn());
vi.mock("@/cache.ts", () => ({
  redis: {
    set: mRedisSet,
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
    process.env.REFRESH_TOKEN_SECRET = "jwt-refresh-secret";

    const res = generateRefreshToken();

    expect(jwt.decode(res)).toEqual({
      sessionId: expect.any(String),
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

describe("refreshTokens", () => {
  process.env.REFRESH_TOKEN_SECRET = mSecret;
  process.env.ACCESS_TOKEN_SECRET = mSecret;

  it("should return a pair of accessToken and refreshToken", async () => {
    const mOldRefreshToken = generateRefreshToken();
    const mSession = {
      sessionId: "sessionId123",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      tokenHash: hashToken(mOldRefreshToken),
      userId: "userId123",
    };
    mGetSession.mockResolvedValue(mSession);

    const res = await refreshTokens(mOldRefreshToken);

    expect(res).toEqual([expect.any(String), expect.any(String)]);
    expect(mGetSession).toHaveBeenCalledWith(expect.any(String));
    expect(mUpdateSession).toHaveBeenCalledWith(
      mSession.sessionId,
      expect.any(String),
      expect.any(Date)
    );
  });

  it("should throw if refresh token expired", () => {
    const mOldRefreshToken = jwt.sign({ exp: 0, sub: "userId123" }, mSecret);

    expect(() => refreshTokens(mOldRefreshToken)).rejects.toThrow(
      new TokenExpiredError()
    );
  });

  it("should throw if session expired", () => {
    const mOldRefreshToken = generateRefreshToken();
    mGetSession.mockResolvedValueOnce({
      expiresAt: 0,
    });

    expect(() => refreshTokens(mOldRefreshToken)).rejects.toThrow(
      new SessionExpiredError()
    );
  });

  it("should throw if refresh and session tokens don't match", () => {
    const mOldRefreshToken = generateRefreshToken();
    mGetSession.mockResolvedValueOnce({
      tokenHash: hashToken("anything"),
    });

    expect(() => refreshTokens(mOldRefreshToken)).rejects.toThrow(
      new ForbiddenError()
    );
  });
});

describe("hashToken", () => {
  it("should return the token hash", () => {
    const res = hashToken("anything");

    expect(res).toBeDefined();
    expect(res).toEqual(expect.any(String));
  });
});

describe("compareToken", () => {
  it("should compare tokens", () => {
    const mToken = jwt.sign({ foo: "bar" }, mSecret);

    const tokenHash = hashToken(mToken);
    const res = compareToken(mToken, tokenHash);

    expect(res).toEqual(true);
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

    expect(mRedisSet).toHaveBeenCalledWith(
      `${REDIS_TOKEN_BLACKLIST_KEY}:${mAccessToken}`,
      "1",
      "EX",
      mTtlSeconds
    );
  });

  it("should return if exp not set", async () => {
    const mAccessToken = jwt.sign({ sub: "userId123" }, mSecret);

    await blacklistAccessToken(mAccessToken);

    expect(mRedisSet).toHaveBeenCalledTimes(0);
  });

  it("should return if payload is invalid", async () => {
    const mAccessToken = jwt.sign("invalid payload", mSecret);

    await blacklistAccessToken(mAccessToken);

    expect(mRedisSet).toHaveBeenCalledTimes(0);
  });
});

describe("getIsTokenBlacklisted", () => {
  it("should return true for blacklisted token", async () => {
    mRedisExists.mockResolvedValue(1);
    const mAccessToken = "accessToken";

    const res = await getIsTokenBlacklisted(mAccessToken);

    expect(res).toEqual(true);
    expect(mRedisExists).toHaveBeenCalledWith(
      `${REDIS_TOKEN_BLACKLIST_KEY}:${mAccessToken}`
    );
  });

  it("should return false for non-blacklisted token", async () => {
    mRedisExists.mockResolvedValue(0);
    const mAccessToken = "accessToken";

    const res = await getIsTokenBlacklisted(mAccessToken);

    expect(res).toEqual(false);
    expect(mRedisExists).toHaveBeenCalledWith(
      `${REDIS_TOKEN_BLACKLIST_KEY}:${mAccessToken}`
    );
  });
});
