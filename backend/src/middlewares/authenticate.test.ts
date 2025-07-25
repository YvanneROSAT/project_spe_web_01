import express, { type Express, type Request } from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authenticate } from "./authenticate"; // adjust import

// Mocks
const mGetAccessTokenFromRequest = vi.hoisted(() => vi.fn());
const mGetRefreshTokenFromRequest = vi.hoisted(() => vi.fn());
const mGetIsTokenBlacklisted = vi.hoisted(() => vi.fn());
const mVerifyAccessToken = vi.hoisted(() => vi.fn());
const mRefreshTokens = vi.hoisted(() => vi.fn());

vi.mock("@/modules/auth/jwt", () => ({
  getAccessTokenFromRequest: mGetAccessTokenFromRequest,
  getRefreshTokenFromRequest: mGetRefreshTokenFromRequest,
  getIsTokenBlacklisted: mGetIsTokenBlacklisted,
  verifyAccessToken: mVerifyAccessToken,
  refreshTokens: mRefreshTokens,
}));

describe("authenticate", () => {
  let app: Express;

  beforeEach(() => {
    vi.clearAllMocks();

    app = express()
      .use((req, res, next) => {
        authenticate(req, res, next);
      })
      .get("/", (req, res) => {
        res.json({ user: (req as Request).user ?? null });
      });
  });

  it("should refresh tokens and return new access token in header", async () => {
    mGetAccessTokenFromRequest.mockReturnValue(null);
    mGetRefreshTokenFromRequest.mockReturnValue("valid-refresh");
    mRefreshTokens.mockResolvedValue(["new-access", "new-refresh"]);
    mVerifyAccessToken.mockReturnValue({ sub: "user456" });

    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.header["x-new-access-token"]).toBe("new-access");
  });
});
