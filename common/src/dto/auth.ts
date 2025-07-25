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

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: firstNameField,
  lastName: lastNameField,
  email: emailField,
  password: passwordField,
});

export type RegisterInput = z.infer<typeof registerSchema>;
