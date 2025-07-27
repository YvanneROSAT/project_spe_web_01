import z from "zod";
import { apiAuthorizedRequester, apiRequester, parseResponse } from "./axios";

// Schémas pour les stats publiques
const publicStatsSchema = z.array(z.object({
  nom: z.string(),
  compte: z.number(),
}));

// Schémas pour les rapports CSP admin
const cspReportSchema = z.object({
  id: z.union([z.string(), z.number()]),
  timestamp: z.string(),
  violation: z.object({
    directive: z.string().optional(),
    blockedUri: z.string().optional(),
    documentUri: z.string().optional(),
    sourceFile: z.string().optional(),
    lineNumber: z.number().optional(),
  }),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  rawData: z.any(),
});

const cspReportsResponseSchema = z.object({
  reports: z.array(cspReportSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    hasMore: z.boolean(),
  }),
});

const cspStatsSchema = z.object({
  total: z.number(),
  today: z.number(),
  thisWeek: z.number(),
  byDirective: z.record(z.string(), z.number()),
  byDay: z.record(z.string(), z.number()),
});

export type PublicStats = z.infer<typeof publicStatsSchema>;
export type CSPReport = z.infer<typeof cspReportSchema>;
export type CSPReportsResponse = z.infer<typeof cspReportsResponseSchema>;
export type CSPStats = z.infer<typeof cspStatsSchema>;

// Stats publiques des produits (sans authentification)
export async function getPublicStats(): Promise<PublicStats> {
  try {
    const res = await apiRequester.get("/products/stats");
    return parseResponse(res, publicStatsSchema) ?? [];
  } catch (err) {
    console.error("Erreur récupération stats publiques:", err);
    return [];
  }
}

// Rapports CSP admin (avec authentification)
export async function getCSPReports(page: number = 1, limit: number = 20): Promise<CSPReportsResponse> {
  try {
    const res = await apiAuthorizedRequester.get("/admin/csp-reports", {
      params: { page, limit },
    });
    return parseResponse(res, cspReportsResponseSchema) ?? {
      reports: [],
      pagination: { page: 1, limit: 20, total: 0, hasMore: false }
    };
  } catch (err) {
    console.error("Erreur récupération rapports CSP:", err);
    return {
      reports: [],
      pagination: { page: 1, limit: 20, total: 0, hasMore: false }
    };
  }
}

// Stats CSP admin (avec authentification)
export async function getCSPStats(): Promise<CSPStats> {
  try {
    const res = await apiAuthorizedRequester.get("/admin/csp-stats");
    return parseResponse(res, cspStatsSchema) ?? {
      total: 0,
      today: 0,
      thisWeek: 0,
      byDirective: {},
      byDay: {}
    };
  } catch (err) {
    console.error("Erreur récupération stats CSP:", err);
    return {
      total: 0,
      today: 0,
      thisWeek: 0,
      byDirective: {},
      byDay: {}
    };
  }
}

// Envoyer une violation CSP (pour les tests)
export async function sendCSPReport(reportData: any): Promise<boolean> {
  try {
    await apiRequester.post("/csp-report", reportData);
    return true;
  } catch (err) {
    console.error("Erreur envoi rapport CSP:", err);
    return false;
  }
} 