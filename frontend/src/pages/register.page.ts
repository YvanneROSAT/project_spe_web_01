import { registerSchema } from "common";
import { login, register } from "../api";
import type { Page } from "../types";

export default {
  html: `
    <h2>Inscription</h2>
    <form id="registerForm">
      <div class="mb-3">
        <label for="firstname" class="form-label">Prénom</label>
        <input type="text" class="form-control" id="firstName" name="firstName" />
      </div>
      <div class="mb-3">
        <label for="lastname" class="form-label">Nom</label>
        <input type="text" class="form-control" id="lastName" name="lastName" />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" name="email"/>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Mot de passe</label>
        <input type="password" class="form-control" id="password" name="password" />
      </div>
      <div class="mb-3">
        <label for="passwordConfirm" class="form-label">Confirmer le mot de passe</label>
        <input type="password" class="form-control" id="passwordConfirm" name="passwordConfirm" />
      </div>
      <button type="submit" class="btn btn-primary">S’inscrire</button>
    </form>
    <button type="button" class="btn btn-secondary mt-3" onclick="history.back()">Retour</button>
  `,
  onLoad: function () {
    const form = document.querySelector<HTMLFormElement>("form#registerForm");
    if (!form) {
      return;
    }

    async function handleSubmit(event: SubmitEvent) {
      event.preventDefault();
      if (!form) {
        return;
      }

      const formData = new FormData(form);
      const { data, success, error } = registerSchema.safeParse(
        Object.fromEntries(formData.entries())
      );
      if (!success) {
        alert(
          "Formulaire invalide: " + error.issues.map((i) => i.message).join(",")
        );
        return;
      }

      const passwordConfirm = formData.get("passwordConfirm")?.toString();

      if (data?.password !== passwordConfirm) {
        alert("Les mots de passe ne correspondent pas !");
        return;
      }

      const registerSuccess = await register(data);
      if (registerSuccess) {
        await login(data);
      }
    }
    form.addEventListener("submit", handleSubmit);
  },
} satisfies Page;
