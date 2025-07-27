import { login, register } from "@/api/auth";
import { extractFormData, html } from "@/helpers";
import type { Page } from "@/types";
import { registerSchema } from "common";

function validateRegisterData(formData: Record<string, FormDataEntryValue>) {
  const result = registerSchema.safeParse(formData);
  if (!result.success) {
    const msg = result.error.issues.map((i) => i.message).join(", ");
    return { success: false, message: `Formulaire invalide: ${msg}` };
  }

  if (result.data.password !== formData.passwordConfirm) {
    return {
      success: false,
      message: "Les mots de passe ne correspondent pas !",
    };
  }

  return { success: true, data: result.data };
}

export default {
  html: html`
    <h2>Inscription</h2>
    <form id="registerForm">
      <div class="mb-3">
        <label for="firstname" class="form-label">Prénom</label>
        <input
          type="text"
          class="form-control"
          id="firstName"
          name="firstName"
          placeholder="John"
        />
      </div>
      <div class="mb-3">
        <label for="lastname" class="form-label">Nom</label>
        <input
          type="text"
          class="form-control"
          id="lastName"
          name="lastName"
          placeholder="Smith"
        />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          type="email"
          class="form-control"
          id="email"
          name="email"
          placeholder="john.smith@mail.com"
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Mot de passe</label>
        <input
          type="password"
          class="form-control"
          id="password"
          name="password"
          placeholder="●●●●●●●●"
        />
      </div>
      <div class="mb-3">
        <label for="passwordConfirm" class="form-label"
          >Confirmer le mot de passe</label
        >
        <input
          type="password"
          class="form-control"
          id="passwordConfirm"
          name="passwordConfirm"
          placeholder="●●●●●●●●"
        />
      </div>
      <button type="submit" class="btn btn-primary">S’inscrire</button>
    </form>
    <button
      type="button"
      class="btn btn-secondary mt-3"
      onclick="history.back()"
    >
      Retour
    </button>
  `,
  onLoad: function () {
    const form = document.querySelector<HTMLFormElement>("form#registerForm");
    if (!form) {
      return;
    }

    async function handleSubmit(e: SubmitEvent) {
      e.preventDefault();
      if (!form) {
        return;
      }

      const rawData = extractFormData(form);
      const result = validateRegisterData(rawData);

      if (!result.success || !result.data) {
        alert(result.message);
        return;
      }

      const success = await register(result.data);
      if (success) {
        await login(result.data);
      }
    }

    form.addEventListener("submit", handleSubmit);
  },
} satisfies Page;
