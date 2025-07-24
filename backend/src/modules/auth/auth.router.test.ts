import { usersTable } from "@/db/schema";
import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import authRouter from "./auth.router"; // adjust path

const mGetUserByEmail = vi.hoisted(() => vi.fn());
const mCreateUser = vi.hoisted(() => vi.fn());
const mCreateSession = vi.hoisted(() => vi.fn());
vi.mock("./auth.service", () => ({
  getUserByEmail: mGetUserByEmail,
  createUser: mCreateUser,
  createSession: mCreateSession,
}));

const mGetIsPasswordSafe = vi.hoisted(() => vi.fn());
const mComparePassword = vi.hoisted(() => vi.fn());
const mHashPassword = vi.hoisted(() => vi.fn());
vi.mock("./password", () => ({
  getIsPasswordSafe: mGetIsPasswordSafe,
  comparePassword: mComparePassword,
  hashPassword: mHashPassword,
}));

const mAccessToken = "mockedAccessToken";
const mRefreshToken = "mockedRefreshToken";
vi.mock("./jwt", () => ({
  generateAccessToken: () => mAccessToken,
  generateRefreshToken: () => mRefreshToken,
}));

const mUser: typeof usersTable.$inferSelect = {
  userId: "123",
  email: "john.smith@mail.com",
  firstName: "John",
  lastName: "Smith",
  passwordHash: "validhash",
  createdAt: new Date(),
  isActive: true,
  lastLogin: new Date("2025-04-03"),
};

const app = express();
app.use(express.json());
app.use(authRouter);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /login", () => {
  it("should return token on successful login", async () => {
    mGetUserByEmail.mockResolvedValue(mUser);
    mComparePassword.mockResolvedValue(true);
    mCreateSession.mockResolvedValue("sessionId");

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
    expect(mCreateSession).toHaveResolvedTimes(1);
    expect(mCreateSession).toHaveBeenCalledWith(
      mUser.userId,
      mRefreshToken,
      "",
      "::ffff:127.0.0.1"
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
