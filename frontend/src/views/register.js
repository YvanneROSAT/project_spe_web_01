export function Register() {
  return `
    <h2>Inscription</h2>
    <form>
      <div class="mb-3">
        <label for="username" class="form-label">Nom d'utilisateur</label>
        <input type="text" class="form-control" id="username" />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Mot de passe</label>
        <input type="password" class="form-control" id="password" />
      </div>
      <div class="mb-3">
        <label for="passwordConfirm" class="form-label">Confirmer le mot de passe</label>
        <input type="password" class="form-control" id="passwordConfirm" />
      </div>
      <button type="submit" class="btn btn-primary">S’inscrire</button>
    </form>
    <button type="button" class="btn btn-secondary mt-3" onclick="history.back()">Retour</button>
  `
}
