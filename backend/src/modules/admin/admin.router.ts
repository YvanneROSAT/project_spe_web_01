import { requireAuth } from "@/middlewares/requireAuth";
import { Router } from "express";
import controller from "./admin.controller";

const router: Router = Router();

// les rapports CSP (accessible à tous)
router.post("/csp-report", controller.handleNewReport);
// rapports Admin CSP
router.get("/admin/csp-reports", requireAuth, controller.handleGetReports);
// Statistiques des violations CSP
router.get("/admin/csp-stats", requireAuth, controller.handleGetStats);

export default router;
