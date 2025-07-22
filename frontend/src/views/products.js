const products = [
  { id: 1, name: "Produit A", description: "Super produit A", price: 29.99 },
  { id: 2, name: "Produit B", description: "Génial produit B", price: 39.99 },
  { id: 3, name: "Produit C", description: "Incroyable produit C", price: 19.99 },
]

export function ProductList() {
  return `
    <h2>Nos Produits</h2>
    <div class="row">
      ${products.map(product => `
        <div class="col-md-4 mb-4">
          <div class="card h-100" style="cursor: pointer;" onclick="window.location.hash = '#/product/${product.id}'">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${product.description}</p>
              <p class="card-text"><strong>${product.price.toFixed(2)} €</strong></p>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
    <button type="button" class="btn btn-secondary mt-3" onclick="history.back()">Retour</button>
  `
}