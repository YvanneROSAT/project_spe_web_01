import { NextFunction, RequestHandler } from "express";
import z from "zod";

async function validateAndFreeze<T extends z.ZodObject>(
  data: unknown,
  schema: T
): Promise<Readonly<z.infer<T>>> {
  const validated = await schema.parseAsync(data);
  return Object.freeze(validated);
}

export function validateRequest<
  Body extends z.ZodObject,
  Query extends z.ZodObject,
  Params extends z.ZodObject
>(schemas: {
  body?: Body;
  query?: Query;
  params?: Params;
}): RequestHandler<
  Readonly<z.infer<Params>>,
  unknown,
  Readonly<z.infer<Body>>,
  Readonly<z.infer<Query>>
> {
  return async (req, res, next: NextFunction) => {
    try {
      for (const key of ["body", "query", "params"] as const) {
        const schema = schemas[key];
        if (!schema) continue;

        Object.defineProperty(req, key, {
          value: await validateAndFreeze(req[key], schema),
        });
      }

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

      throw error;
    }
  };
}
