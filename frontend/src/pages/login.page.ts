import { loginSchema } from "common";
import { login } from "../api";
import { setAuthStorage } from "../auth";
import { extractFormData } from "../helpers";
import type { Page } from "../types";

function validateLoginData(formData: Record<string, FormDataEntryValue>) {
  const result = loginSchema.safeParse(formData);
  if (!result.success) {
    const msg = result.error.issues.map((i) => i.message).join(", ");
    return { success: false, message: `Formulaire invalide: ${msg}` };
  }

  return { success: true, data: result.data };
}

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
  onLoad: function () {
    const form = document.querySelector<HTMLFormElement>("form#loginForm");
    if (!form) {
      return;
    }

    async function handleSubmit(event: SubmitEvent) {
      event.preventDefault();
      if (!form) {
        return;
      }

      const rawData = extractFormData(form);
      const result = validateLoginData(rawData);

      if (!result.success || !result.data) {
        alert(result.message);
        return;
      }

      try {
        const res = await login(result.data);
        if (res) {
          setAuthStorage(res.accessToken, res.user);
          window.location.href = "/";
        }
      } catch (err) {
        console.error(err);
        alert("Une erreur est survenue");
      }
    }

    form.addEventListener("submit", handleSubmit);
  },
} satisfies Page;
