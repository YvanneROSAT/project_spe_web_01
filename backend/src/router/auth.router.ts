import { BCRYPT_SALT_ROUNDS, JWT_SECRET } from "@/config";
import { db } from "@/db/connection";
import { usersTable } from "@/db/schema";
import { validateRequestBody } from "@/middlewares/validateRequestBody";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { Router } from "express";
import jwt from "jsonwebtoken";
import z from "zod";

const FAKE_PASSWORD_HASH =
  "$2b$10$CwTycUXWue0Thq9StjUM0uJ8eDl3pZAgUQmrc9hUlPZx4s8ZfrfG2";

export default Router()
  .post(
    "/auth/login",
    validateRequestBody(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    ),
    async function (req, res) {
      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, req.body.email));

      const passwordMatch = await bcrypt.compare(
        req.body.password,
        // an attacker could guess if a user is registered based on the response time
        // so we'll compare passwords even if the user isn't found to avoid timing attacks
        user?.passwordHash ?? FAKE_PASSWORD_HASH
      );
      if (!passwordMatch) {
        return res.sendStatus(403);
      }

      return res.json({
        token: jwt.sign({ email: user.email }, JWT_SECRET),
      });
      // todo: catch errors
    }
  )
  .post(
    "/auth/register",
    validateRequestBody(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        password: z.string(),
      })
    ),
    async function (req, res) {
      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, req.body.email));

      if (user) {
        return res.sendStatus(403);
      }

      const passwordHash = await bcrypt.hash(
        req.body.password,
        BCRYPT_SALT_ROUNDS
      );
      const [newUser] = await db.insert(usersTable).values({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        passwordHash,
      });
      if (!newUser) {
        return res.sendStatus(500);
      }

      return res.status(200);
      // todo: catch errors
    }
  );
