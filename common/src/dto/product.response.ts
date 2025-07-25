import z from "zod";
import { productSchema } from "./product";

export const productResponseSchema = z.object({
  product: productSchema,
});

export type ProductResponse = z.infer<typeof productResponseSchema>;
