// validate.ts
import { Request } from "express";
import z from "zod";

const keys = ["body", "query", "params"] as const;
type Keys = typeof keys;

type SchemaMap = Partial<Record<Keys[number], z.ZodType>>;

type Validated<Schemas extends SchemaMap> = {
  [K in keyof Schemas]: z.infer<Schemas[K]>;
};

export async function validateRequest<Schemas extends SchemaMap>(
  req: Request,
  schemas: Schemas
): Promise<Validated<Schemas>> {
  const result = {} as Validated<Schemas>;

  for (const key of keys) {
    const schema = schemas[key];
    const data = await schema?.parseAsync(req[key]);

    if (data) {
      Object.defineProperty(result, key, {
        value: Object.freeze(data),
        configurable: false,
        writable: false,
      });
    }
  }

  return result;
}
