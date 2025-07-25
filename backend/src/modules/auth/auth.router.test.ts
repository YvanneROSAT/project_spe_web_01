import { REFRESH_TOKEN_COOKIE_NAME } from "@/config";
import { usersTable } from "@/db/schema";
import { createId } from "@paralleldrive/cuid2";
import cookieParser from "cookie-parser";
import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import authRouter from "./auth.router";

const mGetUserByEmail = vi.hoisted(() => vi.fn());
const mCreateUser = vi.hoisted(() => vi.fn());
vi.mock("./auth.service", () => ({
  getUserByEmail: mGetUserByEmail,
  createUser: mCreateUser,
}));

const mGetIsPasswordSafe = vi.hoisted(() => vi.fn());
const mComparePassword = vi.hoisted(() => vi.fn());
const mHashPassword = vi.hoisted(() => vi.fn());
vi.mock("./password", () => ({
  getIsPasswordSafe: mGetIsPasswordSafe,
  comparePassword: mComparePassword,
  hashPassword: mHashPassword,
}));

vi.mock("@/cache", () => ({}));

const mUserId = createId();
const mJti = createId();
const mSecret = "secret";

const mAccessToken = jwt.sign({ sub: mUserId, jti: mJti }, mSecret, {
  expiresIn: "1d",
});
const mRefreshToken = jwt.sign({ sub: mUserId }, mSecret, {
  expiresIn: "1y",
});

const mVerifyRefreshToken = vi.hoisted(() => vi.fn());
const mBlacklistAccessToken = vi.hoisted(() => vi.fn());
vi.mock("./jwt", async (importOriginal) => ({
  ...(await importOriginal()),
  generateAccessToken: () => mAccessToken,
  generateRefreshToken: () => mRefreshToken,
  verifyRefreshToken: mVerifyRefreshToken,
  blacklistAccessToken: mBlacklistAccessToken,
}));

const mRequireAuth = vi.hoisted(() => vi.fn((req, res, next) => next()));
vi.mock("@/middlewares/requireAuth", () => ({
  requireAuth: mRequireAuth,
}));

const mUser: typeof usersTable.$inferSelect = {
  userId: mUserId,
  email: "john.smith@mail.com",
  firstName: "John",
  lastName: "Smith",
  passwordHash: "validhash",
  createdAt: new Date(),
  isActive: true,
  lastLogin: new Date("2025-04-03"),
};

const app = express().use(express.json()).use(cookieParser()).use(authRouter);

beforeEach(() => {
  vi.clearAllMocks();

  process.env.ACCESS_TOKEN_SECRET = mSecret;
  process.env.REFRESH_TOKEN_SECRET = mSecret;
});

describe("POST /login", () => {
  it("should return token on successful login", async () => {
    mGetUserByEmail.mockResolvedValue(mUser);
    mComparePassword.mockResolvedValue(true);

    const mData = {
      email: "john.smith@mail.com",
      password: "correct123",
    };

    const res = await request(app).post("/login").send(mData);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      accessToken: mAccessToken,
      user: {
        id: mUser.userId,
        email: mUser.email,
        firstName: mUser.firstName,
        lastName: mUser.lastName,
      },
    });
    expect(mGetUserByEmail).toHaveResolvedTimes(1);
    expect(mGetUserByEmail).toHaveBeenCalledWith(mUser.email);
    expect(mComparePassword).toHaveResolvedTimes(1);
    expect(mComparePassword).toHaveBeenCalledWith(
      mData.password,
      mUser.passwordHash
    );
  });

  it("should return 403 on wrong credentials", async () => {
    mGetUserByEmail.mockResolvedValue(null);
    mComparePassword.mockResolvedValue(false);
    mGetIsPasswordSafe.mockReturnValue(false);

    const res = await request(app).post("/login").send({
      email: "john.smith@mail.com",
      password: "wrongpass",
    });

    expect(res.status).toBe(403);
  });

  it("should return 429 after too many login attempts", async () => {
    mGetUserByEmail.mockResolvedValue(null);
    mComparePassword.mockResolvedValue(false);

    const attempts = 11;
    let lastResponse;
    for (let i = 0; i < attempts; i++) {
      lastResponse = await request(app).post("/login").send({
        email: "user@example.com",
        password: "wrongpass",
      });
    }

    expect(lastResponse?.status).toBe(429);
    expect(lastResponse?.text).toMatch(/Too many requests/i);
  });
});

describe("POST /register", () => {
  it("should return 200 on successful registration", async () => {
    mGetUserByEmail.mockResolvedValue(null);
    mHashPassword.mockResolvedValue("hashed");
    mCreateUser.mockResolvedValue(true);
    mGetIsPasswordSafe.mockResolvedValue(true);

    const res = await request(app).post("/register").send({
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      password: "superpassword!",
    });

    expect(res.status).toBe(200);
  });

  it("should return 403 if user already exists", async () => {
    mGetUserByEmail.mockResolvedValue({});

    const res = await request(app).post("/register").send({
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@mail.com",
      password: "password",
    });

    expect(res.status).toBe(403);
  });

  it("should return 429 after too many register attempts", async () => {
    mGetUserByEmail.mockResolvedValue(null);
    mGetIsPasswordSafe.mockResolvedValue(true);
    mHashPassword.mockResolvedValue("hashed");
    mCreateUser.mockResolvedValue(true);

    const attempts = 11;
    let lastResponse;
    for (let i = 0; i < attempts; i++) {
      lastResponse = await request(app)
        .post("/register")
        .send({
          email: `rate${i}@test.com`,
          firstName: "John",
          lastName: "Doe",
          password: `someSafeP@ssword${i}`,
        });
    }

    expect(lastResponse?.status).toBe(429);
    expect(lastResponse?.text).toMatch(/Too many requests/i);
  });
});

describe("DELETE /logout", () => {
  it("should blacklist token and return 200", async () => {
    mVerifyRefreshToken.mockReturnValue({ sub: "mockUserId" });

    const res = await request(app)
      .delete("/logout")
      .set("Authorization", `Bearer ${mAccessToken}`)
      .set("Cookie", [`${REFRESH_TOKEN_COOKIE_NAME}=${mRefreshToken}`])
      .send();

    expect(res.status).toBe(200);
    expect(mRequireAuth).toHaveBeenCalled();
    expect(mBlacklistAccessToken).toHaveBeenCalledWith(mAccessToken);
  });
});
