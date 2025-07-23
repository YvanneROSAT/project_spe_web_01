import jwt from "jsonwebtoken";
import { describe, expect, it } from "vitest";
import z from "zod";
import { generateAccessToken, generateRefreshToken, verifyToken } from "./jwt";

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

describe("refreshTokens", () => {});
