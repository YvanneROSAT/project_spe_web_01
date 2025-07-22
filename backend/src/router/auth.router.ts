import { BCRYPT_SALT_ROUNDS, JWT_SECRET } from "@/config";
import { db } from "@/db/connection";
import { usersTable } from "@/db/schema";
import { validateRequestBody } from "@/middlewares/validateRequestBody";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { Router } from "express";
import jwt from "jsonwebtoken";
import z from "zod";

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
      db.select()
        .from(usersTable)
        .where(eq(usersTable.email, req.body.email))
        .then(([user]) => {
          // todo: how do we avoid timing attacks ? we should return only after comparing the password, even if the user isn't found
          if (!user) {
            return res.sendStatus(403);
          }

          bcrypt
            .compare(req.body.password, user.passwordHash)
            .then((passwordMatch) => {
              if (!passwordMatch) {
                return res.sendStatus(403);
              }

              return res.json({
                token: jwt.sign({ email: user.email }, JWT_SECRET),
              });
            });
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
      db.select()
        .from(usersTable)
        .where(eq(usersTable.email, req.body.email))
        .then(([user]) => {
          if (user) {
            return res.sendStatus(403);
          }

          bcrypt
            .hash(req.body.password, BCRYPT_SALT_ROUNDS)
            .then((passwordHash) => {
              db.insert(usersTable)
                .values({
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  email: req.body.email,
                  passwordHash,
                })
                .then(([newUser]) => {
                  if (!newUser) {
                    return res.sendStatus(500);
                  }

                  return res.status(200);
                });
            });
        });
      // todo: catch errors
    }
  );
