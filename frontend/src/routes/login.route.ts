import { loginSchema } from "common";
import { login } from "../api";
import type { Route } from "../types";

export default {
  html: `
  <h2>Connexion</h2>
  <form id="loginForm">
    <div class="mb-3">
      <label for="email" class="form-label">Email</label>
      <input type="email" class="form-control" id="email" name="email" autocomplete="email" placeholder="john.doe@mail.com" required />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Mot de passe</label>
      <input type="password" class="form-control" id="password" name="password" autocomplete="current-password" placeholder="●●●●●●●●" required />
    </div>
    <button type="submit" class="btn btn-primary">Se connecter</button>
  </form>
  <button type="button" class="btn btn-secondary mt-3" onclick="history.back()">Retour</button>
  `,
  onLoad: async function () {
    const form = document.querySelector<HTMLFormElement>("form#loginForm");

    async function handleSubmit(event: SubmitEvent) {
      event.preventDefault();
      if (!form) {
        return;
      }

      const formData = new FormData(form);
      const { data, success, error } = loginSchema.safeParse(
        Object.fromEntries(formData.entries())
      );
      if (!success) {
        alert(
          "Formulaire invalide: " + error.issues.map((i) => i.message).join(",")
        );
        return;
      }

      try {
        const result = await login(data);
        if (result) {
          localStorage.setItem("accessToken", result.accessToken);
          localStorage.setItem("user", JSON.stringify(result.user));
        }

        window.location.href = "/";
      } catch (err) {
        console.error(err);
        alert("Une erreur est survenue");
      }
    }
    form?.addEventListener("submit", handleSubmit);
  },
} satisfies Route;
