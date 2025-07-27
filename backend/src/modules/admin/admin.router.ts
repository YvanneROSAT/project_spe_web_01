import logger from "@/logger";
import { requireAuth } from "@/middlewares/requireAuth";
import { validateRequest } from "@/middlewares/validateRequest";
import { Router } from "express";
import { cspReportSchema, cspReportsQuerySchema } from "./admin.schemas";
import { getCSPReports, getCSPStats, saveCSPReport } from "./admin.service";

const router: Router = Router();
// les rapports CSP (accessible à tous)
router.post("/csp-report", async (req, res) => {
  const { body } = await validateRequest(req, { body: cspReportSchema });

  try {
    const userAgent = req.headers["user-agent"] || "";
    const ipAddress = req.ip || req.connection.remoteAddress || "unknown";

    await saveCSPReport(body, userAgent, ipAddress);

    logger.info("CSP Violation Report reçu", {
      timestamp: new Date().toISOString(),
      directive: body["csp-report"]?.["violated-directive"],
      blockedUri: body["csp-report"]?.["blocked-uri"],
      userAgent,
      ipAddress,
    });

    res.status(204).send();
  } catch (error) {
    logger.error("Erreur lors du stockage du rapport CSP", error);
    throw error;
  }
});

// rapports Admin CSP
router.get("/admin/csp-reports", requireAuth, async (req, res) => {
  const { query } = await validateRequest(req, {
    query: cspReportsQuerySchema,
  });

  try {
    const result = await getCSPReports(query);
    res.json(result);
  } catch (error) {
    logger.error("Erreur lors de la récupération des rapports CSP", error);
    throw error;
  }
});

// Statistiques des violations CSP
router.get("/admin/csp-stats", requireAuth, async (req, res) => {
  try {
    const stats = await getCSPStats();
    res.json(stats);
  } catch (error) {
    logger.error("Erreur lors du calcul des statistiques CSP", error);
    throw error;
  }
});

export default router;
