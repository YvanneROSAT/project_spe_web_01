import jwt from "jsonwebtoken";
import { describe, expect, it, vi } from "vitest";
import z from "zod";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  refreshTokens,
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
});
