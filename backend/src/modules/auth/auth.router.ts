import { requireAuth } from "@/middlewares/requireAuth";
import { validateRequest } from "@/middlewares/validateRequest";
import { loginSchema, registerSchema } from "common";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, logout, refresh, register } from "./auth.controller";

const limiter = rateLimit({ limit: 10, windowMs: 60 * 1000 });

const router: Router = Router()

router.post("/login", validateRequest({ body: loginSchema }), limiter, login)
router.post(
  "/register",
  limiter,
  validateRequest({ body: registerSchema }),
  register
)
router.delete("/logout", requireAuth, logout)
router.post("/refresh", refresh);


export default router