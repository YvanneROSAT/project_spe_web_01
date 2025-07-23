import { NextFunction, Request, Response } from "express";
import z from "zod";

export interface ValidatedRequest<T extends z.ZodObject> extends Request {
  body: Readonly<z.infer<T>>;
}

export function validateRequestBody<T extends z.ZodObject>(schema: T) {
  return async function validate(
    req: ValidatedRequest<T>,
    res: Response,
    next: NextFunction
  ) {
    try {
      req.body = Object.freeze(await schema.parseAsync(req.body));

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: "fail",
          errors: error.issues.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
      }

      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  };
}
