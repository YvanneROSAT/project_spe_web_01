import { BACKEND_URL } from "../config";

class LogoutButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
			<button class="btn btn-danger m-2">Se Déconnecter</button>
		`;

    this.querySelector("button")?.addEventListener("click", this.handleLogout);
  }

  disconnectedCallback() {
    this.querySelector("button")?.removeEventListener(
      "click",
      this.handleLogout
    );
  }

  handleLogout = async () => {
    try {
      await fetch(BACKEND_URL + "/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
      alert("Échec de déconnexion");
    }
  };
}

customElements.define("logout-button", LogoutButton);
