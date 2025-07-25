export function ConfirmDeleteProduct(id) {
  const products = JSON.parse(localStorage.getItem("products")) || []
  const product = products.find(p => p.id == id)

  if (!product) {
    return `<p>Produit introuvable.</p>`
  }

  return `
    <h2>Supprimer le produit</h2>
    <p>Voulez-vous vraiment supprimer <strong>${product.name}</strong> ?</p>
    <button class="btn btn-danger me-2" onclick="confirmDelete(${id})">Oui, supprimer</button>
    <button class="btn btn-secondary" onclick="history.back()">Annuler</button>
  `
}

window.confirmDelete = function(id) {
  const products = JSON.parse(localStorage.getItem("products")) || []
  const updated = products.filter(p => p.id != id)
  localStorage.setItem("products", JSON.stringify(updated))
  window.location.hash = '#/products'
}