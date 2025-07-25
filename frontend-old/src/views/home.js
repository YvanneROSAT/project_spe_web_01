import { getUser } from "../auth";

export function Home() {
  const user = getUser();

  return `
    <h1 class="text-center">Bienvenue${user ? ", " + user.firstName : ""}</h1>
    <div class="text-center mt-4">
      ${
        user
          ? `
      <logout-button></logout-button>
      `
          : `
      <a href="#/login" class="btn btn-primary m-2">Se connecter</a>
      <a href="#/register" class="btn btn-secondary m-2">S'inscrire</a>
        `
      }    
      
      <a href="#/products" class="btn btn-info m-2">Voir les produits</a>
      <a href="#/stats" class="btn btn-warning m-2">Statistiques</a>
    </div>
  `;
}
