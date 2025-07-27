import { logout } from "@/api/auth";
import { clearAuthStorage, getLocalUser } from "@/auth";
import { html } from "@/helpers";
import type { Page } from "@/types";

enum ShowLink {
  EXCEPT_AUTH = "EXPECT_AUTH",
  AUTH_ONLY = "AUTH_ONLY",
}

interface Link {
  label: string;
  href: string;
  className: string;
  show?: ShowLink;
}

const links: Link[] = [
  {
    href: "/login",
    label: "Se connecter",
    className: "btn-primary",
    show: ShowLink.EXCEPT_AUTH,
  },
  {
    href: "/register",
    label: "S'inscrire",
    className: "btn-secondary",
    show: ShowLink.EXCEPT_AUTH,
  },
  {
    href: "/add-product",
    label: "Ajouter un produit",
    className: "btn-success",
    show: ShowLink.AUTH_ONLY,
  },
  { href: "/products", label: "Voir les produits", className: "btn-info" },
  { href: "/csp-stats", label: "Stats CSP", className: "btn-warning" },
  { href: "/cart", label: "Panier", className: "btn-primary" },
];

export default {
  html: html`
    <h1 class="text-center" id="welcomeMessage">Bienvenue</h1>
    <div
      class="text-center mt-4 d-flex gap-2 align-items-center justify-content-center"
      id="linkContainer"
    ></div>
  `,
  onLoad: function () {
    const linkContainer = document.getElementById("linkContainer");
    const welcomeMessage = document.getElementById("welcomeMessage");

    if (!linkContainer || !welcomeMessage) {
      return;
    }

    const user = getLocalUser();

    links.forEach(({ label, href, className, show }) => {
      if (show === ShowLink.AUTH_ONLY && !user) {
        return;
      }

      if (show === ShowLink.EXCEPT_AUTH && user) {
        return;
      }

      const link = document.createElement("a");
      link.textContent = label;
      link.href = href;
      link.classList.add("btn", ...className.split(" "));

      linkContainer.appendChild(link);
    });

    async function handleLogout() {
      await logout();

      clearAuthStorage();

      window.location.href = "/";
    }

    if (user) {
      welcomeMessage.textContent = `Bienvenue, ${user.firstName}`;

      const logoutButton = document.createElement("button");
      logoutButton.classList.add("btn", "btn-danger", "m-2");
      logoutButton.textContent = "Se Déconnecter  ";
      logoutButton.addEventListener("click", handleLogout);

      linkContainer.appendChild(logoutButton);
    }
  },
} satisfies Page;
