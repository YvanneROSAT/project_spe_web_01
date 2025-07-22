import { validateRequestBody } from "@/middlewares/validateRequestBody";
import { Router } from "express";
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
      console.log("login", req.body);
      res.sendStatus(200);
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
      console.log("register", req.body);
      res.sendStatus(200);
    }
  );
