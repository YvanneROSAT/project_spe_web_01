import "./env";

import cors from "cors";
import express from "express";
import { JwtPayload } from "jsonwebtoken";
import { AuthController } from "./modules/auth/auth.controller";

const app = express();
app.use(cors()).use(express.json()).use(AuthController());

app.listen(process.env.PORT);

declare global {
  namespace Express {
    export interface Request {
      user: string | JwtPayload;
    }
  }
}
