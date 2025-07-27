import { getCategories } from "@/api/categories";
import { getProduct, updateProduct } from "@/api/products";
import { extractFormData, html } from "@/helpers";
import type { Page } from "@/types";
import { setProductSchema } from "common";

function validateUpdateProductData(
  formData: Record<string, FormDataEntryValue>
) {
  const result = setProductSchema.safeParse(formData);
  if (!result.success) {
    const msg = result.error.issues.map((i) => i.message).join(", ");
    return { success: false, message: `Formulaire invalide: ${msg}` };
  }

  return { success: true, data: result.data };
}

export default {
  html: html`
    <h2>Ajouter un produit</h2>
    <div id="container">
      <form id="editProductForm">
        <div class="mb-3">
          <label class="form-label" for="productName">Nom</label>
          <input
            type="text"
            class="form-control"
            id="productName"
            name="name"
            placeholder="Chaise"
            required
          />
        </div>
        <div class="mb-3">
          <label class="form-label" for="productDescription">Description</label>
          <textarea
            class="form-control"
            id="productDescription"
            name="description"
            placeholder="Une incroyable chaise pour s'asseoir"
            required
          ></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label" for="productPrice">Prix</label>
          <input
            type="number"
            class="form-control"
            id="productPrice"
            name="price"
            step="0.01"
            min="0"
            max="99999"
            required
          />
        </div>
        <div class="mb-3">
          <label class="form-label" for="categorySelect">Catégorie</label>
          <select id="categorySelect" class="form-control" name="categoryId">
            <option value="loading">Chargement...</option>
          </select>
        </div>

        <button type="submit" class="btn btn-success">Sauvegarder</button>
      </form>
    </div>
  `,
  onLoad: async function () {
    const containerEl = document.getElementById("container");
    if (!containerEl) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    const product = productId ? await getProduct(productId) : null;
    if (!product) {
      containerEl.innerHTML = html`<p>Produit introuvable.</p>`;
      return;
    }

    const form = document.querySelector<HTMLFormElement>(
      "form#editProductForm"
    );
    if (!form) {
      return;
    }

    const categorySelect = document.querySelector<HTMLSelectElement>(
      "select#categorySelect"
    );
    if (!categorySelect) {
      return;
    }

    categorySelect.value = product.category?.id ?? "";

    const productNameInput =
      form.querySelector<HTMLInputElement>("#productName");
    if (productNameInput) {
      productNameInput.value = product.name;
    }

    const productDescriptionInput = form.querySelector<HTMLInputElement>(
      "#productDescription"
    );
    if (productDescriptionInput) {
      productDescriptionInput.value = product.description;
    }

    const productPriceInput =
      form.querySelector<HTMLInputElement>("#productPrice");
    if (productPriceInput) {
      productPriceInput.value = Number(product.price).toFixed(2);
    }

    const categories = await getCategories();
    categorySelect.innerHTML = categories
      .map(
        (category) => html`
          <option value="${category.id}">${category.label}</option>
        `
      )
      .join("\n");

    async function handleSubmit(event: SubmitEvent) {
      event.preventDefault();
      if (!form || !productId) {
        return;
      }

      const rawData = extractFormData(form);
      const result = validateUpdateProductData(rawData);

      if (!result.success || !result.data) {
        alert(result.message);
        return;
      }

      const success = await updateProduct(productId, result.data);
      if (success) {
        window.location.href = `/product?id=${productId}`;
      }
    }

    form.addEventListener("submit", handleSubmit);
  },
} satisfies Page;
