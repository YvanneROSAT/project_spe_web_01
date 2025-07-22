export function Login() {
  return `
    <h2>Connexion</h2>
    <form>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Mot de passe</label>
        <input type="password" class="form-control" id="password" />
      </div>
      <button type="submit" class="btn btn-primary">Se connecter</button>
    </form>
    <button type="button" class="btn btn-secondary mt-3" onclick="history.back()">Retour</button>
  `
}
