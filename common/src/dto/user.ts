import z from "zod";

export const userSchema = z.object({
  id: z.cuid2(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
});

export type User = z.infer<typeof userSchema>;
