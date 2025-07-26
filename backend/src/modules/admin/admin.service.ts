import { db } from "@/db/connection";
import { cspReports } from "@/db/schema";
import logger from "@/logger";
import { desc, gte } from "drizzle-orm";
import { CSPReport, CSPReportsQuery } from "./admin.schemas";

export async function saveCSPReport(
  reportData: CSPReport,
  userAgent: string,
  ipAddress: string
) {
  try {
    logger.info("CSP Report reçu:", {
      reportData,
      userAgent,
      ipAddress,
    });

    await db.insert(cspReports).values({
      reportData: reportData,
      userAgent: userAgent,
      ipAddress: ipAddress,
    });

    return true;
  } catch (error) {
    logger.error("Erreur détaillée sauvegarde CSP:", error);
    throw new Error(`Erreur lors de la sauvegarde du rapport CSP: ${error}`);
  }
}

export async function getCSPReports(query: CSPReportsQuery) {
  const { page, limit, since } = query;
  const offset = (page - 1) * limit;

  try {
    let dbQuery = db.select().from(cspReports);

    if (since) {
      const sinceDate = new Date(since);
      dbQuery = dbQuery.where(gte(cspReports.createdAt, sinceDate));
    }

    const reports = await dbQuery
      .orderBy(desc(cspReports.createdAt))
      .limit(limit)
      .offset(offset);

    const formattedReports = reports.map((report) => ({
      id: report.reportId,
      timestamp: report.createdAt,
      violation: {
        directive: report.reportData?.["csp-report"]?.["violated-directive"],
        blockedUri: report.reportData?.["csp-report"]?.["blocked-uri"],
        documentUri: report.reportData?.["csp-report"]?.["document-uri"],
        sourceFile: report.reportData?.["csp-report"]?.["source-file"],
        lineNumber: report.reportData?.["csp-report"]?.["line-number"],
      },
      userAgent: report.userAgent,
      ipAddress: report.ipAddress,
      rawData: report.reportData,
    }));

    return {
      reports: formattedReports,
      pagination: {
        page,
        limit,
        total: reports.length,
        hasMore: reports.length === limit,
      },
    };
  } catch (error) {
    throw new Error(
      `Erreur lors de la récupération des rapports CSP: ${error}`
    );
  }
}

export async function getCSPStats() {
  try {
    const reports = await db.select().from(cspReports);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const stats = {
      total: reports.length,
      today: reports.filter((r) => new Date(r.createdAt!) >= today).length,
      thisWeek: reports.filter((r) => new Date(r.createdAt!) >= thisWeek)
        .length,
      byDirective: reports.reduce(
        (acc, report) => {
          const directive =
            report.reportData?.["csp-report"]?.["violated-directive"] ||
            "unknown";
          acc[directive] = (acc[directive] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
      byDay: reports.reduce(
        (acc, report) => {
          const day = new Date(report.createdAt!).toISOString().split("T")[0];
          acc[day] = (acc[day] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
    };

    return stats;
  } catch (error) {
    throw new Error(`Erreur lors du calcul des statistiques CSP: ${error}`);
  }
}
