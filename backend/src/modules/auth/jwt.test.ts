import {
  ForbiddenError,
  SessionExpiredError,
  TokenExpiredError,
} from "@/app-error";
import { createId } from "@paralleldrive/cuid2";
import jwt from "jsonwebtoken";
import { describe, expect, it, vi } from "vitest";
import z from "zod";
import {
  compareToken,
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  refreshTokens,
  verifyAccessToken,
  verifyRefreshToken,
  verifyToken,
} from "./jwt";

const mGetSession = vi.hoisted(() => vi.fn());
const mUpdateSession = vi.hoisted(() => vi.fn());
vi.mock("@/modules/auth/auth.service.ts", () => ({
  getSession: mGetSession,
  updateSession: mUpdateSession,
}));

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
  const mSecret = "secret";
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
    const mSecret = "secret";
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
    const mSecret = "secret";
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
  const mSecret = "secret";
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
    expect(mGetSession).toHaveBeenCalledTimes(1);
    expect(mGetSession).toHaveBeenCalledWith(expect.any(String));
    expect(mUpdateSession).toHaveBeenCalledTimes(1);
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
    const mSecret = "secret";
    const mToken = jwt.sign({ foo: "bar" }, mSecret);

    const tokenHash = hashToken(mToken);
    const res = compareToken(mToken, tokenHash);

    expect(res).toEqual(true);
  });
});
