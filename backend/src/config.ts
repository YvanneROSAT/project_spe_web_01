export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET;
export const BCRYPT_SALT_ROUNDS = 10;

export const DB_CONNECTION_CONFIG = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
} as const;
