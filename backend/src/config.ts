export const PORT = process.env.PORT;

export const CSRF_TOKEN_KEY = "csrf_token";
export const JWT_TOKEN_KEY = "token";
export const JWT_SECRET = process.env.JWT_SECRET;
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
