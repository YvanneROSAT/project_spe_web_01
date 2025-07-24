import { InternalServerError, InvalidCredentialsError } from "@/app-error";
import {
  FAKE_PASSWORD_HASH,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "@/config";
import { db } from "@/db/connection";
import { requireAuth } from "@/middlewares/requireAuth";
import { validateRequest } from "@/middlewares/validateRequest";
import {
  createSession,
  createUser,
  getUserByEmail,
  invalidateSession,
} from "@/modules/auth/auth.service";
import {
  comparePassword,
  getIsPasswordSafe,
  hashPassword,
} from "@/modules/auth/password";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  blacklistAccessToken,
  generateAccessToken,
  generateRefreshToken,
  getAccessTokenFromRequest,
  getRefreshTokenFromRequest,
  verifyRefreshToken,
} from "./jwt";
import { loginSchema, registerSchema } from "./schemas";

export default Router()
  .post(
    "/login",
    validateRequest({ body: loginSchema }),
    rateLimit({ limit: 10, windowMs: 60 * 1000 }),
    async function (req, res) {
      const user = await getUserByEmail(req.body.email);
      // an attacker could guess if a user is registered based on the response time
      // so we'll compare passwords even if the user isn't found to avoid timing attacks
      const passwordMatch = await comparePassword(
        req.body.password,
        user?.passwordHash ?? FAKE_PASSWORD_HASH
      );
      // crucial check of `user` existence to avoid login using "fakepassword"
      if (!user || !passwordMatch) {
        throw new InvalidCredentialsError();
      }

      const accessToken = generateAccessToken(user.userId);
      const refreshToken = generateRefreshToken();

      await createSession(
        user.userId,
        refreshToken,
        req.headers["user-agent"] ?? "",
        req.ip ?? ""
      );

      res
        .cookie(
          REFRESH_TOKEN_COOKIE_NAME,
          refreshToken,
          REFRESH_TOKEN_COOKIE_OPTIONS
        )
        .json({
          accessToken,
          user: {
            id: user.userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        });
    }
  )
  .post(
    "/register",
    rateLimit({ limit: 10, windowMs: 60 * 1000 }),
    validateRequest({ body: registerSchema }),
    async function (req, res) {
      const user = await getUserByEmail(req.body.email);
      if (user) {
        throw new InvalidCredentialsError();
      }

      const isPasswordSafe = await getIsPasswordSafe(req.body.password);
      if (!isPasswordSafe) {
        throw new InvalidCredentialsError();
      }

      const passwordHash = await hashPassword(req.body.password);
      const success = await createUser(req.body.email, passwordHash, req.body);
      if (!success) {
        throw new InternalServerError();
      }

      return res.sendStatus(200);
    }
  )
  .delete("/logout", requireAuth, async function (req, res) {
    const refreshToken = getRefreshTokenFromRequest(req);
    const accessToken = getAccessTokenFromRequest(req);

    if (accessToken) {
      await blacklistAccessToken(accessToken);
    }

    if (refreshToken) {
      const payload = verifyRefreshToken(refreshToken);

      if (payload) {
        await invalidateSession(payload.sessionId);
      }

      res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
    }

    res.send();
  })
  // todo: for testing purposes, remove in prod
  .get("/dev", requireAuth, async function (req, res) {
    if (process.env.NODE_ENV !== "dev") {
      return res.sendStatus(404);
    }

    const users = await db.query.usersTable.findMany();

    return res.json(users).send();
  });
