import z from "zod";

export const categorySchema = z.object({
  id: z.cuid2(),
  label: z.string(),
});

export type Category = z.infer<typeof categorySchema>;
