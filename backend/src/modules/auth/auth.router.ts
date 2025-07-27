import { requireAuth } from "@/middlewares/requireAuth";
import { validateRequest } from "@/middlewares/validateRequest";
import { loginSchema, registerSchema } from "common";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, logout, refresh, register } from "./auth.controller";

const getLimiter = () => rateLimit({ limit: 10, windowMs: 60 * 1000 });

const router: Router = Router();

router.post(
  "/login",
  validateRequest({ body: loginSchema }),
  getLimiter(),
  login
);
router.post(
  "/register",
  validateRequest({ body: registerSchema }),
  getLimiter(),
  register
);
router.delete("/logout", requireAuth, logout);
router.post("/refresh", refresh);

export default router;
