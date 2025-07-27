import { InternalServerError } from "@/app.errors";
import {
  FAKE_PASSWORD_HASH,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "@/config";
import { usersTable } from "@/db/schema";
import {
  type AuthRefreshResponse,
  type LoginResponse,
  type User,
} from "common";
import { type Request, type Response } from "express";
import {
  ForbiddenError,
  InvalidCredentialsError,
  TokenExpiredError,
} from "./auth.errors";
import { createUser, getUserByEmail, getUserById } from "./auth.service";
import {
  blacklistAccessToken,
  generateAccessToken,
  generateRefreshToken,
  getAccessTokenFromRequest,
  getRefreshTokenFromRequest,
  verifyRefreshToken,
} from "./jwt";
import { comparePassword, getIsPasswordSafe, hashPassword } from "./password";

const formatUser = (user: typeof usersTable.$inferSelect): User => ({
  id: user.userId,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
});

export async function login(req: Request, res: Response) {
  const user = await getUserByEmail(req.body.email);
  const match = await comparePassword(
    req.body.password,
    user?.passwordHash ?? FAKE_PASSWORD_HASH
  );
  if (!user || !match) {
    throw new InvalidCredentialsError();
  }

  const accessToken = generateAccessToken(user.userId);
  const refreshToken = generateRefreshToken(user.userId);

  res
    .cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS
    )
    .json({
      accessToken,
      user: formatUser(user),
    } satisfies LoginResponse);
}

export async function register(req: Request, res: Response) {
  if (await getUserByEmail(req.body.email)) {
    throw new InvalidCredentialsError();
  }

  if (!(await getIsPasswordSafe(req.body.password))) {
    throw new InvalidCredentialsError();
  }

  const hash = await hashPassword(req.body.password);
  if (!(await createUser(req.body.email, hash, req.body))) {
    throw new InternalServerError();
  }

  res.sendStatus(200);
}

export async function logout(req: Request, res: Response) {
  const token = getAccessTokenFromRequest(req);
  if (token) {
    await blacklistAccessToken(token);
  }

  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME).send();
}

export async function refresh(req: Request, res: Response) {
  const oldRefreshToken = getAccessTokenFromRequest(req);
  if (oldRefreshToken) {
    await blacklistAccessToken(oldRefreshToken);
  }

  const refreshToken = getRefreshTokenFromRequest(req);
  if (!refreshToken) {
    throw new ForbiddenError();
  }

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    throw new TokenExpiredError();
  }

  const user = await getUserById(payload.sub);
  if (!user) {
    throw new InvalidCredentialsError();
  }

  const accessToken = generateAccessToken(payload.sub);
  res.json({
    accessToken,
    user: formatUser(user),
  } satisfies AuthRefreshResponse);
}
