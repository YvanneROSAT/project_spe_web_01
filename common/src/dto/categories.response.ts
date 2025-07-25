import z from "zod";
import { categorySchema } from "./category";

export const categoriesResponseSchema = z.object({
  categories: z.array(categorySchema),
});

export type CategoriesResponse = z.infer<typeof categoriesResponseSchema>;
