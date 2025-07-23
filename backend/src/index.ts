import "./env";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import logger from "./logger";
import errorHandler from "./middlewares/errorHandler";
import authRouter from "./modules/auth/auth.router";
import { AuthPayload } from "./modules/auth/schemas";
import productsRouter from "./modules/products/products.router";

const app = express();
app
  .use(helmet())
  .use(cors({ origin: process.env.FRONTEND_URL }))
  .use(express.json())
  .use(cookieParser())
  .use("/auth", authRouter)
  .use("/products", productsRouter)
  .use(errorHandler);

app.listen(process.env.PORT, () => {
  logger.info(`Server listening on port ${process.env.PORT}`);
});

declare global {
  namespace Express {
    export interface Request {
      user: AuthPayload;
    }
  }
}
