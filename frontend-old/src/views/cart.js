export function Cart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  if (cart.length === 0) {
    return `
      <h2>Votre panier est vide 🛒</h2>
      <button class="btn btn-primary mt-3" onclick="window.location.hash = '#/products'">Retour aux produits</button>
    `
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  const itemsHtml = cart.map((item, index) => `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <strong>${item.name}</strong><br>
        <small>${item.price.toFixed(2)} €</small>
      </div>
      <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Supprimer</button>
    </li>
  `).join("")

  return `
    <h2>Votre Panier 🛒</h2>
    <ul class="list-group mb-3">
      ${itemsHtml}
    </ul>
    <h4>Total : ${total.toFixed(2)} €</h4>
    <button class="btn btn-secondary mt-3" onclick="window.location.hash = '#/products'">Retour aux produits</button>
  `
}

window.removeFromCart = function (index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  cart.splice(index, 1)
  localStorage.setItem("cart", JSON.stringify(cart))
  window.dispatchEvent(new HashChangeEvent("hashchange"))
}
