import { getProduct } from "@/api/products";
import { getLocalUser } from "@/auth";
import { addToCart, getCart } from "@/cart";
import type { Page } from "@/types";

export default {
  html: `
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
      productContainer.innerHTML = `<p>Produit introuvable.</p>`;
      return;
    }

    const product = await getProduct(id);
    if (!product) {
      productContainer.innerHTML = `<p>Produit introuvable.</p>`;
      return;
    }

    productContainer.innerHTML = `
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <p><strong>Prix : <span>${product.price}</span> €</strong></p>
      <button type="button" class="btn btn-secondary mt-3" onclick="history.back()">Retour</button>
    `;

    const addToCartButton = document.createElement("button");
    addToCartButton.textContent = "Ajouter au panier";
    addToCartButton.classList.add("btn", "btn-primary", "mt-3");
    addToCartButton.addEventListener("click", function () {
      addToCart(product);
    });

    if (getLocalUser() && !cart.some((p) => p.id === product.id)) {
      productContainer.appendChild(addToCartButton);
    }
  },
} satisfies Page;
