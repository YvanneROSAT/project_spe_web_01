import { getCart, removeFromCart } from "../cart";
import type { Page } from "../types";

export default {
  html: `
    <h2>Votre Panier</h2>
    <div class="row" id="cartContainer">
      <p>Chargement...</p>
    </div>
    <button type="button" class="btn btn-secondary m-2" onclick="history.back()">Retour</button>
  `,
  onLoad: async function () {
    const cart = getCart();

    const cartContainer = document.getElementById("cartContainer");
    if (cartContainer) {
      cartContainer.innerHTML = cart.length
        ? cart
            .map(
              (product) => `
              <div class="col-md-4 mb-4">
                <div class="card h-100" style="cursor: pointer;" id="product-${product.id}">
                  <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text"><strong>${product.price} €</strong></p>
                    <a href="/product?id=${product.id}">Details</a>
                  </div>
                </div>
              </div>
            `
            )
            .join("")
        : "<p>Vous n'avez rien dans votre panier</p>";
    }

    for (const product of cart) {
      const productCard = document.getElementById(`product-${product.id}`);
      if (!productCard) {
        return;
      }

      const removeFromCartButton = document.createElement("button");
      removeFromCartButton.textContent = "Retirer du panier";
      removeFromCartButton.classList.add("btn", "btn-danger", "m-2");
      removeFromCartButton.addEventListener("click", function (event) {
        event.stopPropagation();

        removeFromCart(product.id);

        window.location.href = "/cart";
      });

      productCard.appendChild(removeFromCartButton);
    }
  },
} satisfies Page;
