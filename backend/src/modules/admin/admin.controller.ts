import logger from "@/logger";
import { validateRequest } from "@/middlewares/validateRequest";
import { Controller } from "@/types";
import { Request, Response } from "express";
import { cspReportSchema, cspReportsQuerySchema } from "./admin.schemas";
import { getCSPReports, getCSPStats, saveCSPReport } from "./admin.service";

export default {
  handleNewReport: async function (req: Request, res: Response) {
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
  },
  handleGetReports: async function (req: Request, res: Response) {
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
  },
  handleGetStats: async function (req: Request, res: Response) {
    try {
      const stats = await getCSPStats();
      res.json(stats);
    } catch (error) {
      logger.error("Erreur lors du calcul des statistiques CSP", error);
      throw error;
    }
  },
} satisfies Controller;
