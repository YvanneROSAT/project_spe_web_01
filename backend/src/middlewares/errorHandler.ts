import { AppError } from "@/app-error";
import logger from "@/logger";
import { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.status).send(err.message);
  }

  logger.error(err);

  res.status(500).send("Internal server error");
}

export default errorHandler;
