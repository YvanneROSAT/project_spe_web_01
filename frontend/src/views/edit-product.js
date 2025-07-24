export function EditProduct(id) {
  const products = JSON.parse(localStorage.getItem("products")) || []
  const product = products.find(p => p.id == id)

  if (!product) return `<p>Produit introuvable.</p>`

  return `
    <h2>Modifier le produit</h2>
    <form onsubmit="return handleEditProduct(event, ${id})">
      <div class="mb-3">
        <label class="form-label">Nom</label>
        <input type="text" class="form-control" id="productName" value="${product.name}" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea class="form-control" id="productDescription" required>${product.description}</textarea>
      </div>
      <div class="mb-3">
        <label class="form-label">Prix</label>
        <input type="number" class="form-control" id="productPrice" value="${product.price}" required />
      </div>
      <button type="submit" class="btn btn-primary">Modifier</button>
    </form>
  `
}

window.handleEditProduct = function (event, id) {
  event.preventDefault()
  const name = document.getElementById("productName").value
  const description = document.getElementById("productDescription").value
  const price = parseFloat(document.getElementById("productPrice").value)

  const products = JSON.parse(localStorage.getItem("products")) || []
  const index = products.findIndex(p => p.id == id)
  if (index !== -1) {
    products[index] = { id, name, description, price }
    localStorage.setItem("products", JSON.stringify(products))
  }

  window.location.hash = "#/products"
  return false
}
