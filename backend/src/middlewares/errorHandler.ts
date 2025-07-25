import { AppError } from "@/app-error";
import logger from "@/logger";
import { NextFunction, Request, Response } from "express";

export async function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.status).send(err.code);
  }

  logger.error(err.message, err);

  return res.status(500).send("Internal server error");
}
