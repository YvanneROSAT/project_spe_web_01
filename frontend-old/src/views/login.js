import { BACKEND_URL } from "../config";

export function Login() {
  return `
    <h2>Connexion</h2>
    <form id="loginForm">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" name="email" autocomplete="email" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Mot de passe</label>
        <input type="password" class="form-control" id="password" name="password" autocomplete="current-password" required />
      </div>
      <button type="submit" class="btn btn-primary">Se connecter</button>
    </form>
    <button type="button" class="btn btn-secondary mt-3" onclick="history.back()">Retour</button>
  `;
}

async function login(email, password) {
  const res = await fetch(BACKEND_URL + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (res.ok) {
    return res.json();
  }

  switch (res.status) {
    case 403:
      alert("Email ou mot de passe incorrect");
    default:
      alert("Une erreur est survenue");
  }

  return null;
}

export function setupLoginFormHandler() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email) {
      alert("Email manquante");
    }

    if (!password) {
      alert("Mot de passe manquant");
    }

    try {
      const result = await login(email, password);
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
  form.addEventListener("submit", handleSubmit);
}
