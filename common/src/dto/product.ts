import z from "zod";
import { categorySchema } from "./category";

export const productSchema = z.object({
  id: z.cuid2(),
  name: z.string(),
  description: z.string(),
  price: z.string(),
  category: z.nullable(categorySchema),
  pictures: z.array(z.url()),
});

export type Product = z.infer<typeof productSchema>;
