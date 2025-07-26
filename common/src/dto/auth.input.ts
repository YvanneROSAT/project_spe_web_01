import z from "zod";

const emailField = z.email({ pattern: z.regexes.rfc5322Email }).toLowerCase();
const passwordField = z
  .string({ error: "Mot de passe invalide" })
  .min(8, "Doit faire au moins 8 caracteres")
  .max(64, "Doit faire au plus 64 caracteres");
const firstNameField = z
  .string()
  .min(2, "Prenom trop court")
  .max(50, "Prenom trop long");
const lastNameField = z
  .string()
  .min(2, "Nom trop court")
  .max(50, "Nom trop long");

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
