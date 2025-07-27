import { logout } from "@/api/auth";
import { clearAuthStorage, getLocalUser } from "@/auth";
import { html } from "@/helpers";
import type { Page } from "@/types";

export default {
  html: html`
    <h1 class="text-center" id="welcomeMessage">Bienvenue</h1>
    <div class="text-center mt-4" id="linkContainer">
      <a href="/login" id="loginLink" class="btn btn-primary m-2"
        >Se connecter</a
      >
      <a href="/register" id="registerLink" class="btn btn-secondary m-2"
        >S'inscrire</a
      >
      <a href="/add-product" id="addProductLink" class="btn btn-success  m-2"
        >Ajouter un produit</a
      >
      <a href="/products" class="btn btn-info m-2">Voir les produits</a>
      <a href="/csp-stats" class="btn btn-warning m-2">Stats CSP</a>
      <a href="/cart" id="cartLink" class="btn btn-primary m-2">Panier</a>
    </div>
  `,
  onLoad: function () {
    const linkContainer = document.getElementById("linkContainer");
    const welcomeMessage = document.getElementById("welcomeMessage");
    const loginLink = document.getElementById("loginLink");
    const registerLink = document.getElementById("registerLink");
    const addProductLink = document.getElementById("addProductLink");
    const cartLink = document.getElementById("cartLink");

    if (
      !linkContainer ||
      !welcomeMessage ||
      !loginLink ||
      !registerLink ||
      !addProductLink ||
      !cartLink
    ) {
      return;
    }

    async function handleLogout() {
      await logout();

      clearAuthStorage();

      window.location.href = "/";
    }

    const user = getLocalUser();
    if (user) {
      loginLink.remove();
      registerLink.remove();
      welcomeMessage.textContent = `Bienvenue, ${user.firstName}`;

      const logoutButton = document.createElement("button");
      logoutButton.classList.add("btn", "btn-danger", "m-2");
      logoutButton.textContent = "Se Déconnecter  ";
      logoutButton.addEventListener("click", handleLogout);

      linkContainer.appendChild(logoutButton);
    } else {
      addProductLink.remove();
      cartLink.remove();
    }
  },
} satisfies Page;
