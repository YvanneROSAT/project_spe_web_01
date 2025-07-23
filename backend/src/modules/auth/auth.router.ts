import { CSRF_TOKEN_KEY, FAKE_PASSWORD_HASH, JWT_TOKEN_KEY } from "@/config";
import { db } from "@/db/connection";
import { requireAuth } from "@/middlewares/requireAuth";
import { validateRequest } from "@/middlewares/validateRequest";
import { createUser, getUserByEmail } from "@/modules/auth/auth.service";
import { comparePassword, hashPassword } from "@/modules/auth/password";
import { Router } from "express";
import { generateCSRFToken, generateJWToken } from "./jwt";
import { loginSchema, registerSchema } from "./schemas";

export default Router()
  .post(
    "/login",
    validateRequest({ body: loginSchema }),
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
        return res.sendStatus(403);
      }

      const csrfToken = generateCSRFToken();
      const token = generateJWToken({
        userId: user.userId,
        email: user.email,
        csrfToken,
      });

      return res
        .cookie(JWT_TOKEN_KEY, token, {
          sameSite: "strict",
          httpOnly: true,
          secure: process.env.NODE_ENV !== "dev",
          maxAge: 15 * 60 * 1000, // 15mins
        })
        .cookie(CSRF_TOKEN_KEY, csrfToken, {
          secure: true,
        })
        .send();
    }
  )
  .post(
    "/register",
    validateRequest({ body: registerSchema }),
    async function (req, res) {
      const user = await getUserByEmail(req.body.email);
      if (user) {
        return res.sendStatus(403);
      }

      const passwordHash = await hashPassword(req.body.password);
      const success = await createUser(req.body.email, passwordHash, req.body);
      if (!success) {
        return res.sendStatus(500);
      }

      return res.sendStatus(200);
    }
  )
  // todo: for tesging purposes, remove in prod
  .get("/dev", requireAuth(true), async function (_req, res) {
    if (process.env.NODE_ENV !== "dev") {
      return res.sendStatus(404);
    }

    const users = await db.query.usersTable.findMany();

    return res.json(users).send();
  });
