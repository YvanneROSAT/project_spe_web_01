import z from "zod";
import { productSchema } from "./product";

export const productResponseSchema = z.object({
  product: productSchema,
});

export type ProductResponse = z.infer<typeof productResponseSchema>;

export const createProductResponseSchema = z.object({
  id: z.cuid2(),
});
export type CreateProductResponse = z.infer<typeof createProductResponseSchema>;
