import "./env";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import { JwtPayload } from "jsonwebtoken";

const app = express();
app.use(helmet()).use(cors()).use(express.json()).use();

app.listen(process.env.PORT);

declare global {
  namespace Express {
    export interface Request {
      user: string | JwtPayload;
    }
  }
}
