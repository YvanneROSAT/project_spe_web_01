import { requireAuth } from "@/middlewares/requireAuth";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import controller from "./auth.controller";

const getLimiter = () => rateLimit({ limit: 10, windowMs: 60 * 1000 });

const router: Router = Router();

router.post("/login", getLimiter(), controller.handleLogin);
router.post("/register", getLimiter(), controller.handleRegister);
router.delete("/logout", requireAuth, controller.handleLogout);
router.post("/refresh", controller.handleRefresh);

export default router;
