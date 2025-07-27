import { AppError } from "@/app-error";
import logger from "@/logger";
import { NextFunction, Request, Response } from "express";
import z from "zod";

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

  if (err instanceof z.ZodError) {
    return res.status(400).json({
      status: "fail",
      errors: err.issues.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  }

  logger.error(err.message, err);

  return res.status(500).send("Internal server error");
}
