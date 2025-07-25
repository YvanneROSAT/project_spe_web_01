import { getProducts } from "../api";
import type { Route } from "../types";

export default {
  html: `
    <h2>Nos Produits</h2>
    <div class="row" id="productsContainer">
      <p>Chargement...</p>
    </div>
    <button type="button" class="btn btn-secondary mt-3" onclick="history.back()">Retour</button>
  `,
  onLoad: async function () {
    const products = await getProducts();

    const productsContainer = document.getElementById("productsContainer");
    if (productsContainer) {
      productsContainer.innerHTML = products
        ? products
            .map(
              (product) => `
              <div class="col-md-4 mb-4">
                <div class="card h-100" style="cursor: pointer;" onclick="window.location.hash = '#/product?id=${product.id}'">
                  <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text"><strong>${product.price} €</strong></p>
                  </div>
                </div>
              </div>
            `
            )
            .join("")
        : "<p>Oh oh, c'est vide ici</p>";
    }
  },
} satisfies Route;
