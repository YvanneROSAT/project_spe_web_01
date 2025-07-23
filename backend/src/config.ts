import { CookieOptions } from "express";

export const JWT_TOKEN_KEY = "token";
export const BCRYPT_SALT_ROUNDS = 10;
export const FAKE_PASSWORD_HASH =
  "$2b$10$CwTycUXWue0Thq9StjUM0uJ8eDl3pZAgUQmrc9hUlPZx4s8ZfrfG2";

export const DB_CONNECTION_CONFIG = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
} as const;

export const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";
export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "dev",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // days
} as const satisfies CookieOptions;
