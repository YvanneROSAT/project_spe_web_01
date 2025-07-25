const products = [
  { id: 1, name: "Produit A", description: "Super produit A", price: 29.99 },
  { id: 2, name: "Produit B", description: "Génial produit B", price: 39.99 },
  { id: 3, name: "Produit C", description: "Incroyable produit C", price: 19.99 },
]

export function ProductDetail(id) {
  const product = products.find(p => p.id === parseInt(id))
  if (!product) return `<p>Produit introuvable.</p>`

  if (!product) {
    return `<p>Produit introuvable.</p>`
  }

  return `
    <h2>${product.name}</h2>
    <p>${product.description}</p>
    <p><strong>Prix : ${product.price.toFixed(2)} €</strong></p>
    <button type="button" class="btn btn-secondary mt-3" onclick="history.back()">Retour</button>
  `
}