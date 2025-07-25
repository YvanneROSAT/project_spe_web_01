export function Register() {
  return `
    <h2>Inscription</h2>
    <form id="registerForm">
      <div class="mb-3">
        <label for="firstname" class="form-label">Prénom</label>
        <input type="text" class="form-control" id="firstname" name="firstname" />
      </div>
      <div class="mb-3">
        <label for="lastname" class="form-label">Nom</label>
        <input type="text" class="form-control" id="lastname" name="lastname" />
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
  `;
}

export function setupRegisterFormHandler() {
  const form = document.getElementById("registerForm");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.passwordConfirm) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  });
}
