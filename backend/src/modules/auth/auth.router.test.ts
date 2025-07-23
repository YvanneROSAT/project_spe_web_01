import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import authRouter from "./auth.router"; // adjust path

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

vi.mock("./jwt", () => ({
  generateJWToken: () => "mockedJWT",
}));

const app = express();
app.use(express.json());
app.use(authRouter);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /login", () => {
  it("returns 403 on wrong credentials", async () => {
    mGetUserByEmail.mockResolvedValue(null);
    mComparePassword.mockResolvedValue(false);
    mGetIsPasswordSafe.mockReturnValue(false);

    const res = await request(app).post("/login").send({
      email: "john.smith@mail.com",
      password: "wrongpass",
    });

    expect(res.status).toBe(403);
  });

  it("returns token upon successful login", async () => {
    mGetUserByEmail.mockResolvedValue({
      userId: "123",
      email: "john.smith@mail.com",
      passwordHash: "validhash",
    });
    mComparePassword.mockResolvedValue(true);

    const res = await request(app).post("/login").send({
      email: "john.smith@mail.com",
      password: "correct123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      token: "mockedJWT",
    });
  });
});

describe("POST /register", () => {
  it("returns 403 if user already exists", async () => {
    mGetUserByEmail.mockResolvedValue({});

    const res = await request(app).post("/register").send({
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@mail.com",
      password: "password",
    });

    expect(res.status).toBe(403);
  });

  it("returns 200 on successful registration", async () => {
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
});
