import { getProducts } from "@/api/products";
import { extractFormData } from "@/helpers";
import type { Page } from "@/types";

export default {
  html: `
    <h2>Nos Produits</h2>
    <form id="searchForm" class="d-flex gap-2 mb-3">
      <input type="text" id="search" name="search" class="form-control" placeholder="Rechercher un produit" />
      <button type="submit" class="btn btn-secondary inline">🔍</button>
    </form>
    <div class="row" id="productsContainer">
      <p>Chargement...</p>
    </div>
    <button type="button" class="btn btn-secondary m-2" onclick="history.back()">Retour</button>
  `,
  onLoad: async function () {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const search = params.get("search");
    const currentPage = parseInt(params.get("page") ?? "0");

    const searchInput =
      document.querySelector<HTMLInputElement>("input#search");
    if (searchInput && search) {
      searchInput.value = search;
    }

    const { products, pageSize } = await getProducts(search, currentPage);

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

    const searchForm =
      document.querySelector<HTMLFormElement>("form#searchForm");

    function handleSearch(event: SubmitEvent) {
      event.preventDefault();
      if (!searchForm) return;

      const formData = extractFormData(searchForm);
      const search = formData?.search;

      window.location.href = `/products?search=${search}&page=0`;
    }

    searchForm?.addEventListener("submit", handleSearch);
  },
} satisfies Page;
