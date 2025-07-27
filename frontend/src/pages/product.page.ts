import { getProduct } from "@/api/products";
import { getLocalUser } from "@/auth";
import { addToCart, getCart } from "@/cart";
import { html } from "@/helpers";
import type { Page } from "@/types";

export default {
  html: html`
    <div id="productContainer">
      <h1>Chargement...</h1>
    </div>
  `,
  onLoad: async function () {
    const cart = getCart();

    const productContainer = document.getElementById("productContainer");
    if (!productContainer) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) {
      productContainer.innerHTML = html`<p>Produit introuvable.</p>`;
      return;
    }

    const product = await getProduct(id);
    if (!product) {
      productContainer.innerHTML = html`<p>Produit introuvable.</p>`;
      return;
    }

    productContainer.innerHTML = html`
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <p>
        <strong>Prix : <span>${product.price}</span> €</strong>
      </p>
      <button
        type="button"
        class="btn btn-secondary m-2"
        onclick="history.back()"
      >
        Retour
      </button>
    `;

    const addToCartButton = document.createElement("button");
    addToCartButton.textContent = "Ajouter au panier";
    addToCartButton.classList.add("btn", "btn-primary", "m-2");
    addToCartButton.addEventListener("click", function () {
      addToCart(product);
    });

    if (!cart.some((p) => p.id === product.id)) {
      productContainer.appendChild(addToCartButton);
    }

    const editProductLink = document.createElement("a");
    editProductLink.href = `/edit-product?id=${product.id}`;
    editProductLink.textContent = "Modifier";
    editProductLink.classList.add("btn", "btn-success", "m-2");

    if (getLocalUser()) {
      productContainer.appendChild(editProductLink);
    }
  },
} satisfies Page;
