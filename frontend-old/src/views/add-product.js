export function AddProduct() {
  return `
    <h2>Ajouter un produit</h2>
    <form onsubmit="return handleAddProduct(event)">
      <div class="mb-3">
        <label class="form-label">Nom</label>
        <input type="text" class="form-control" id="productName" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea class="form-control" id="productDescription" required></textarea>
      </div>
      <div class="mb-3">
        <label class="form-label">Prix</label>
        <input type="number" class="form-control" id="productPrice" required />
      </div>
      <button type="submit" class="btn btn-success">Ajouter</button>
    </form>
  `
}

window.handleAddProduct = function (event) {
  event.preventDefault()
  const name = document.getElementById("productName").value
  const description = document.getElementById("productDescription").value
  const price = parseFloat(document.getElementById("productPrice").value)

  const products = JSON.parse(localStorage.getItem("products")) || []
  const newProduct = { id: Date.now(), name, description, price }
  products.push(newProduct)
  localStorage.setItem("products", JSON.stringify(products))

  window.location.hash = "#/products"
  return false
}
