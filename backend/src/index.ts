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

const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    if (!origin || origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error("Non autorisé par CORS"));
    }
  },
  credentials: true,
};

app
  .use(express.json())
  .use(cookieParser())
  .use(generateCSPNonce)
  .use(authenticate)
  .use(cors(corsOptions))
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
  namespace Express {
    export interface Request {
      user: {
        userId: string;
      };
    }
  }
}
