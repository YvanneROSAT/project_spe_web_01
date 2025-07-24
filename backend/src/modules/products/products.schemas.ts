import z from "zod";

export const updateProductSchema = z.object({
  label: z.string().optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  categoryId: z.string().optional(),
});
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
