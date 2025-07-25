import { getProducts } from "../api";

export function ProductList() {
  return `
    <h2>Nos Produits</h2>
    <div class="row" id="productsContainer">
      <p>Chargement...</p>
    </div>
    <button type="button" class="btn btn-secondary mt-3" onclick="history.back()">Retour</button>
  `;
}

export async function setupProductsPage() {
  const { products } = await getProducts();

  const productsContainer = document.getElementById("productsContainer");

  productsContainer.innerHTML = products.length
    ? products
        .map(
          (product) => `
  <div class="col-md-4 mb-4">
    <div class="card h-100" style="cursor: pointer;" onclick="window.location.hash = '#/product/${product.id}'">
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
