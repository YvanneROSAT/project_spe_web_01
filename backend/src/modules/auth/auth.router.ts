import { FAKE_PASSWORD_HASH, JWT_SECRET } from "@/config";
import { validateRequestBody } from "@/middlewares/validateRequestBody";
import { createUser, getUserByEmail } from "@/modules/auth/auth.service";
import { comparePassword, hashPassword } from "@/modules/auth/password";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { loginSchema, registerSchema } from "./schemas";

export default Router()
  .post(
    "/auth/login",
    validateRequestBody(loginSchema),
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

      return res.json({
        token: jwt.sign({ email: req.body.email }, JWT_SECRET),
      });
    }
  )
  .post(
    "/auth/register",
    validateRequestBody(registerSchema),
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

      return res.status(200);
    }
  );
