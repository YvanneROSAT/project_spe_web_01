import { getProduct } from "../api";
import type { Route } from "../types";

export default {
  html: `
  <div id="productContainer">
    <h2 id="productName">Chargement</h2>
    <p id="productDescription">Chargement</p>
    <p><strong>Prix : <span id="productPrice">Chargement</span> €</strong></p>
    <button type="button" class="btn btn-secondary mt-3" onclick="history.back()">Retour</button>
  </div>
`,
  onLoad: async function () {
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

    console.log(product, product.price, typeof product.price);

    const productName = document.getElementById("productName");
    const productDescription = document.getElementById("productDescription");
    const productPrice = document.getElementById("productPrice");

    if (productName) {
      productName.textContent = product.name;
    }

    if (productDescription) {
      productDescription.textContent = product.description;
    }

    if (productPrice) {
      productPrice.textContent = product.price;
    }
  },
} satisfies Route;
