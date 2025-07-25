import z from "zod";

export const createProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.string(),
  categoryId: z.string(),
});
export type CreateProductInput = z.infer<typeof createProductSchema>;

export const setProductSchema = createProductSchema.partial();
export type SetProductInput = z.infer<typeof setProductSchema>;
