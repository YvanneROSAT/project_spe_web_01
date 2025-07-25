import { getProduct } from "../api";
import type { Route } from "../types";

export default {
  html: `
  <div id="productContainer">
    <h2 id="productName">...</h2>
    <p id="productDescription">...</p>
    <p><strong>Prix : <span id="productPrice">...</span> €</strong></p>
    <button type="button" class="btn btn-secondary mt-3" onclick="history.back()">Retour</button>
  </div>
`,
  onLoad: async function () {
    const productContainer = document.getElementById("productContainer");
    if (!productContainer) {
      return;
    }

    const url = new URL("http://dummy" + window.location.hash.slice(1));
    const params = new URLSearchParams(url.toString());
    const id = params.get("id");
    console.log(id, url, Object.entries(params));
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
