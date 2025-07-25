import "@/env";

import logger from "@/logger";
import { cspMiddleware, generateCSPNonce } from "@/middlewares/csp";
import errorHandler from "@/middlewares/errorHandler";
import adminRouter from "@/modules/admin/admin.router";
import authRouter from "@/modules/auth/auth.router";
import productsRouter from "@/modules/products/products.router";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { authenticate } from "./middlewares/authenticate";

const app = express();

app
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
  .use(adminRouter)

  .use(errorHandler);

app.listen(process.env.PORT, () => {
  logger.info(`🚀 Serveur démarré sur le port ${process.env.PORT}`);
  logger.info(
    `📊 Statistiques publiques: http://localhost:${process.env.PORT}/products/stats`
  );
  logger.info(
    `🔒 Rapports CSP admin: http://localhost:${process.env.PORT}/admin/csp-reports`
  );
  logger.info(`🛡️ CSP configuré avec reporting sur: /csp-report`);
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: {
        userId: string;
      };
    }
  }
}
