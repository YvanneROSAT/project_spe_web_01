import z from "zod";
import { productSchema } from "./product";

export const productsResponseSchema = z.object({
  products: z.array(productSchema),
  pageSize: z.number(),
});

export type ProductsResponse = z.infer<typeof productsResponseSchema>;

export const singleProductResponseSchema = z.object({
  product: productSchema,
});

export type SingleProductResponse = z.infer<typeof singleProductResponseSchema>;

export const createProductResponseSchema = z.object({
  id: z.cuid2(),
});
export type CreateProductResponse = z.infer<typeof createProductResponseSchema>;
