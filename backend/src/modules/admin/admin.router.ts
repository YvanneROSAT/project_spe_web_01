import logger from "@/logger";
import { requireAuth } from "@/middlewares/requireAuth";
import { validateRequest } from "@/middlewares/validateRequest";
import { Router } from "express";
import { cspReportSchema, cspReportsQuerySchema } from "./admin.schemas";
import { getCSPReports, getCSPStats, saveCSPReport } from "./admin.service";

export default Router()
  // les rapports CSP (accessible à tous)
  .post(
    "/csp-report",
    validateRequest({ body: cspReportSchema }),
    async (req, res) => {
      try {
        const userAgent = req.headers["user-agent"] || "";
        const ipAddress = req.ip || req.connection.remoteAddress || "unknown";

        await saveCSPReport(req.body, userAgent, ipAddress);

        logger.info("CSP Violation Report reçu", {
          timestamp: new Date().toISOString(),
          directive: req.body["csp-report"]?.["violated-directive"],
          blockedUri: req.body["csp-report"]?.["blocked-uri"],
          userAgent,
          ipAddress,
        });

        res.status(204).send();
      } catch (error) {
        logger.error("Erreur lors du stockage du rapport CSP", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
      }
    }
  )

  // rapports Admin CSP (authentifiée avec CSRF)
  .get(
    "/admin/csp-reports",
    requireAuth(true),
    validateRequest({ query: cspReportsQuerySchema }),
    async (req, res) => {
      try {
        const result = await getCSPReports(req.query);
        res.json(result);
      } catch (error) {
        logger.error("Erreur lors de la récupération des rapports CSP", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
      }
    }
  )

  // Statistiques des violations CSP (authentifiée avec CSRF)
  .get("/admin/csp-stats", requireAuth(true), async (req, res) => {
    try {
      const stats = await getCSPStats();
      res.json(stats);
    } catch (error) {
      logger.error("Erreur lors du calcul des statistiques CSP", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  });
