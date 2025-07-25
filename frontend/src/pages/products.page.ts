import { getProducts } from "../api";
import type { Page } from "../types";

export default {
  html: `
    <h2>Nos Produits</h2>
    <div class="row" id="productsContainer">
      <p>Chargement...</p>
    </div>
    <button type="button" class="btn btn-secondary m-2" onclick="history.back()">Retour</button>
  `,
  onLoad: async function () {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const currentPage = parseInt(params.get("page") ?? "0");

    const { products, pageSize } = await getProducts(currentPage);

    const productsContainer = document.getElementById("productsContainer");
    if (productsContainer) {
      productsContainer.innerHTML = products
        ? products
            .map(
              (product) => `
              <div class="col-md-4 mb-4">
                <div class="card h-100" style="cursor: pointer;" onclick="window.location.href = '/product?id=${product.id}'">
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

    const nextPageLink = document.createElement("a");
    nextPageLink.href = `/products?page=${currentPage + 1}`;
    nextPageLink.textContent = "Page suivante";
    nextPageLink.classList.add("btn", "btn-primary", "m-2");

    const previousPageLink = document.createElement("a");
    previousPageLink.href = `/products?page=${currentPage - 1}`;
    previousPageLink.textContent = "Page précédente";
    previousPageLink.classList.add("btn", "btn-primary", "m-2");

    const root = document.querySelector("#app");
    if (currentPage > 0) {
      root?.appendChild(previousPageLink);
    }

    if (products.length === pageSize) {
      root?.appendChild(nextPageLink);
    }
  },
} satisfies Page;
