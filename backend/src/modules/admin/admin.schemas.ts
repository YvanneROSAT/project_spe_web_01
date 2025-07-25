import z from "zod";

export const cspReportSchema = z.object({
  "csp-report": z.object({
    "violated-directive": z.string().optional(),
    "blocked-uri": z.string().optional(),
    "document-uri": z.string().optional(),
    "source-file": z.string().optional(),
    "line-number": z.number().optional(),
    "column-number": z.number().optional(),
    "original-policy": z.string().optional(),
  }).passthrough(),
}).passthrough();

export const cspReportsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  since: z.string().datetime().optional(),
});

export type CSPReport = z.infer<typeof cspReportSchema>;
export type CSPReportsQuery = z.infer<typeof cspReportsQuerySchema>; 