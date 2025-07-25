import z from "zod";

export const categorySchema = z.object({
  id: z.cuid2(),
  label: z.string(),
});
