import { TokenExpiredError } from "@/modules/auth/auth.errors";
import { createId } from "@paralleldrive/cuid2";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authenticate } from "./authenticate";

const mNext = vi.fn();

vi.mock("@/cache.ts", () => ({
  redis: {},
}));

const mGetIsTokenBlacklisted = vi.hoisted(() => vi.fn());
vi.mock("@/modules/auth/jwt.ts", async (importOriginal) => ({
  ...(await importOriginal()),
  getIsTokenBlacklisted: mGetIsTokenBlacklisted,
}));

describe("authenticate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should continue with null user if no access token were provided", async () => {
    const mRequest = {
      headers: { authorization: undefined },
    } as Request;

    await authenticate(mRequest, {} as Response, mNext);

    expect(mRequest.user).toEqual(null);
    expect(mNext).toHaveBeenCalled();
  });

  it("should call next with TokenExpiredError if access token is expired", async () => {
    const mSecret = "secret";
    process.env.ACCESS_TOKEN_SECRET = mSecret;

    const mUserId = createId();
    const mAccessToken = jwt.sign(
      { sub: mUserId, jti: createId(), exp: 0 },
      mSecret
    );
    const mRequest = {
      headers: {
        authorization: `Bearer ${mAccessToken}`,
      },
    } as Request;

    await authenticate(mRequest, {} as Response, mNext);

    expect(mRequest.user).toEqual(null);
    expect(mNext).toHaveBeenCalledWith(new TokenExpiredError());
    expect(mGetIsTokenBlacklisted).not.toHaveBeenCalled();
  });

  it("should call next with TokenExpiredError if access token is blacklisted", async () => {
    const mSecret = "secret";
    process.env.ACCESS_TOKEN_SECRET = mSecret;

    const mUserId = createId();
    const mJti = createId();
    const mAccessToken = jwt.sign({ sub: mUserId, jti: mJti }, mSecret, {
      expiresIn: "1d",
    });
    const mRequest = {
      headers: {
        authorization: `Bearer ${mAccessToken}`,
      },
    } as Request;
    mGetIsTokenBlacklisted.mockResolvedValue(true);

    await authenticate(mRequest, {} as Response, mNext);

    expect(mRequest.user).toEqual(null);
    expect(mNext).toHaveBeenCalledWith(new TokenExpiredError());
    expect(mGetIsTokenBlacklisted).toHaveBeenCalledWith(mJti);
  });

  it("should populate user if valid access token", () => {
    // todo
  });
});
