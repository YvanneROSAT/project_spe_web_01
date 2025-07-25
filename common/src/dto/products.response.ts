import z from "zod";
import { productSchema } from "./product";

export const productsResponseSchema = z.object({
  products: z.array(productSchema),
});

export type ProductsResponse = z.infer<typeof productsResponseSchema>;
