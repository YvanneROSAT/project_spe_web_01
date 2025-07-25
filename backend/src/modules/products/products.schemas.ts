import z from "zod";

export const singleProductParamsSchema = z.object({
  productId: z.cuid2(),
});
