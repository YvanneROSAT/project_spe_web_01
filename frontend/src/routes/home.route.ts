import { getUser } from "../auth";
import type { Route } from "../types";

export default {
  html: `
    <h1 class="text-center" id="welcomeMessage">Bienvenue</h1>
    <div class="text-center mt-4">
      <a href="/login" id="loginLink" class="btn btn-primary m-2">Se connecter</a>
      <a href="/register" id="registerLink" class="btn btn-secondary m-2">S'inscrire</a>
      <a href="/products" class="btn btn-info m-2">Voir les produits</a>
      <a href="/stats" class="btn btn-warning m-2">Statistiques</a>
    </div>
  `,
  onLoad: function () {
    const welcomeMessage = document.getElementById("welcomeMessage");
    const loginLink = document.getElementById("loginLink");
    const registerLink = document.getElementById("registerLink");

    if (!welcomeMessage || !loginLink || !registerLink) {
      return;
    }

    const user = getUser();
    if (user) {
      loginLink.remove();
      registerLink.remove();
      welcomeMessage.textContent = `Bienvenue, ${user.firstName}`;
    }
  },
} satisfies Route;
