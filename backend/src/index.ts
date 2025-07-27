import "@/env";

import logger from "@/logger";
import { authenticate } from "@/middlewares/authenticate";
import { cspMiddleware, generateCSPNonce } from "@/middlewares/csp";
import { errorHandler } from "@/middlewares/errorHandler";
import adminRouter from "@/modules/admin/admin.router";
import authRouter from "@/modules/auth/auth.router";
import categoriesRouter from "@/modules/categories/categories.router";
import productsRouter from "@/modules/products/products.router";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

express()
  .use(express.json())
  .use(cookieParser())
  .use(generateCSPNonce)
  .use(
    cors({
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    })
  )
  .use(authenticate)
  .use(cspMiddleware())

  .use("/auth", authRouter)
  .use("/products", productsRouter)
  .use("/categories", categoriesRouter)
  .use(adminRouter)

  .use(errorHandler)

  .listen(process.env.PORT, () => {
    logger.info(`🚀 Serveur démarré: ${process.env.BACKEND_URL}`);
    logger.info(
      `📊 Statistiques publiques: ${process.env.BACKEND_URL}/products/stats`
    );
    logger.info(
      `🔒 Rapports CSP admin: ${process.env.BACKEND_URL}/admin/csp-reports`
    );
    logger.info(`🛡️ CSP configuré avec reporting sur: /csp-report`);
  });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: Readonly<{
        userId: string;
      }> | null;
    }

    interface Locals {
      nonce?: string;
    }
  }
}
