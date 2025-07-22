import "./env";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import { JwtPayload } from "jsonwebtoken";
import authRouter from "./router/auth.router";

const app = express();
app.use(helmet()).use(cors()).use(express.json()).use(authRouter);

app.listen(process.env.PORT);

declare global {
  namespace Express {
    export interface Request {
      user: string | JwtPayload;
    }
  }
}
