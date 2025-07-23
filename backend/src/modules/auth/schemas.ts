import z from "zod";

const emailField = z.email({ pattern: z.regexes.rfc5322Email }).toLowerCase();
const passwordField = z
  .string({ error: "Invalid password" })
  .min(8, "Must be 8 characters or more");
const firstNameField = z.string();
const lastNameField = z.string();

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export const registerSchema = z.object({
  firstName: firstNameField,
  lastName: lastNameField,
  email: emailField,
  password: passwordField,
});

export const authPayloadSchema = z.object({
  userId: z.cuid2(),
  email: emailField,
  csrfToken: z.string().optional(),
});
export type AuthPayload = z.infer<typeof authPayloadSchema>;
